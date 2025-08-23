import { Router, Request, Response } from 'express';
import { validate, validationSchemas } from '@/middleware/validation.js';
import { provisioningRateLimit } from '@/middleware/rateLimit.js';
import { asyncHandler } from '@/middleware/errorHandler.js';
import { logInfo, logResponse } from '@/utils/logger.js';
import { generateRequestId } from '@/utils/security.js';
import AirtableBaseService from '@/services/airtable/base.js';
import { ProvisionAirtableRequest, ProvisionAirtableResponse } from '@/types/index.js';

const router = Router();

/**
 * Provision Airtable base
 * POST /api/provision/airtable
 */
router.post(
  '/',
  provisioningRateLimit, // Apply stricter rate limiting for provisioning
  validate(validationSchemas.provisionAirtable),
  asyncHandler(async (req: Request, res: Response) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const { baseId, seedSample = false, config } = req.body as ProvisionAirtableRequest;
    
    logInfo('Airtable provisioning request received', {
      requestId,
      baseId: baseId.substring(0, 8) + '...', // Partially masked for security
      seedSample,
      hasConfig: !!config,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    try {
      // Initialize Airtable base service
      const airtableService = new AirtableBaseService();
      
      // Validate the base and table structure
      const validation = await airtableService.validateBase(baseId, config);
      
      if (!validation.valid) {
        // This should not happen due to validation logic, but included for completeness
        throw new Error('Base validation failed');
      }
      
      let sampleRecordId: string | undefined;
      
      // Create sample data if requested
      if (seedSample) {
        try {
          const sampleResult = await airtableService.createSampleData(baseId, config);
          sampleRecordId = sampleResult?.recordId;
          
          if (sampleResult) {
            logInfo('Sample data created successfully', { 
              requestId, 
              baseId, 
              recordId: sampleResult.recordId 
            });
          }
        } catch (sampleError) {
          // Log but don't fail the entire request
          logInfo('Sample data creation failed (non-critical)', { 
            requestId, 
            baseId, 
            error: sampleError 
          });
        }
      }
      
      const duration = Date.now() - startTime;
      
      const response: ProvisionAirtableResponse = {
        url: `https://airtable.com/${baseId}`,
        table: validation.table,
        sampleRecordId,
        fields: validation.fields,
        recordCount: validation.recordCount + (sampleRecordId ? 1 : 0),
      };
      
      logInfo('Airtable provisioning completed successfully', {
        requestId,
        baseId,
        duration,
        fieldsCount: validation.fields.length,
        recordCount: response.recordCount,
        sampleCreated: !!sampleRecordId,
        warnings: validation.warnings?.length || 0,
      });
      
      logResponse('/api/provision/airtable', 'POST', 200, response);
      
      // Set response headers
      res.set({
        'X-Request-ID': requestId,
        'X-Base-ID': baseId,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      
      // Include warnings in response if present
      if (validation.warnings && validation.warnings.length > 0) {
        res.set('X-Warnings', validation.warnings.join('; '));
      }
      
      res.status(200).json(response);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      logInfo('Airtable provisioning failed', {
        requestId,
        baseId: baseId.substring(0, 8) + '...',
        duration,
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      });
      
      // Add request ID to error response
      if (error.details) {
        error.details += ` (Request ID: ${requestId})`;
      }
      
      throw error; // Re-throw to be handled by error middleware
    }
  })
);

/**
 * Test Airtable connection
 * GET /api/provision/airtable/test/:baseId
 */
router.get(
  '/test/:baseId',
  asyncHandler(async (req: Request, res: Response) => {
    const requestId = generateRequestId();
    const { baseId } = req.params;
    
    // Validate base ID format
    if (!/^app[a-zA-Z0-9]{14}$/.test(baseId)) {
      res.status(400).json({
        error: 'Invalid base ID format',
        code: 'INVALID_BASE_ID',
        details: 'Base ID must start with "app" followed by 14 alphanumeric characters',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    try {
      const airtableService = new AirtableBaseService();
      const isConnected = await (airtableService as any).client.testConnection(baseId);
      
      const testResponse = {
        connected: isConnected,
        baseId,
        timestamp: new Date().toISOString(),
        requestId,
      };
      
      logInfo('Airtable connection test completed', {
        requestId,
        baseId,
        connected: isConnected,
      });
      
      logResponse('/api/provision/airtable/test', 'GET', 200, testResponse);
      
      res.set({
        'X-Request-ID': requestId,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      
      res.status(200).json(testResponse);
      
    } catch (error: any) {
      logInfo('Airtable connection test failed', {
        requestId,
        baseId,
        error: error.message,
      });
      
      throw error;
    }
  })
);

/**
 * Get Airtable base information
 * GET /api/provision/airtable/info/:baseId
 */
router.get(
  '/info/:baseId',
  asyncHandler(async (req: Request, res: Response) => {
    const requestId = generateRequestId();
    const { baseId } = req.params;
    
    // Validate base ID format
    if (!/^app[a-zA-Z0-9]{14}$/.test(baseId)) {
      res.status(400).json({
        error: 'Invalid base ID format',
        code: 'INVALID_BASE_ID',
        details: 'Base ID must start with "app" followed by 14 alphanumeric characters',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    try {
      const airtableService = new AirtableBaseService();
      const baseInfo = await airtableService.getBaseInfo(baseId);
      
      logInfo('Airtable base info retrieved', {
        requestId,
        baseId,
        tablesCount: baseInfo.tables.length,
      });
      
      logResponse('/api/provision/airtable/info', 'GET', 200, baseInfo);
      
      res.set({
        'X-Request-ID': requestId,
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
      });
      
      res.status(200).json(baseInfo);
      
    } catch (error: any) {
      logInfo('Airtable base info retrieval failed', {
        requestId,
        baseId,
        error: error.message,
      });
      
      throw error;
    }
  })
);

export default router;