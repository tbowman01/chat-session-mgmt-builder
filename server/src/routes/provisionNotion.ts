import { Router, Request, Response } from 'express';
import { validate, validationSchemas } from '@/middleware/validation.js';
import { provisioningRateLimit } from '@/middleware/rateLimit.js';
import { asyncHandler } from '@/middleware/errorHandler.js';
import { logInfo, logResponse } from '@/utils/logger.js';
import { generateRequestId } from '@/utils/security.js';
import NotionDatabaseService from '@/services/notion/database.js';
import { ProvisionNotionRequest, ProvisionNotionResponse } from '@/types/index.js';

const router = Router();

/**
 * Provision Notion database
 * POST /api/provision/notion
 */
router.post(
  '/',
  provisioningRateLimit, // Apply stricter rate limiting for provisioning
  validate(validationSchemas.provisionNotion),
  asyncHandler(async (req: Request, res: Response) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const { parentPageId, config } = req.body as ProvisionNotionRequest;
    
    logInfo('Notion provisioning request received', {
      requestId,
      parentPageId: parentPageId.substring(0, 8) + '...' + parentPageId.substring(-4), // Partially masked for security
      platform: config.platform,
      priorities: config.priorities,
      features: config.features,
      teamSize: config.teamSize,
      complexity: config.complexity,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    try {
      // Initialize Notion database service
      const notionService = new NotionDatabaseService();
      
      // Create the chat session database
      const result = await notionService.createChatSessionDatabase(parentPageId, config);
      
      // Try to create sample data (non-critical operation)
      try {
        await notionService.createSampleData(result.id, config);
        logInfo('Sample data created successfully', { requestId, databaseId: result.id });
      } catch (sampleError) {
        // Log but don't fail the entire request
        logInfo('Sample data creation failed (non-critical)', { 
          requestId, 
          databaseId: result.id, 
          error: sampleError 
        });
      }
      
      const duration = Date.now() - startTime;
      
      const response: ProvisionNotionResponse = {
        url: result.url,
        id: result.id,
        properties: result.properties,
        views: result.views,
      };
      
      logInfo('Notion provisioning completed successfully', {
        requestId,
        databaseId: result.id,
        duration,
        propertiesCount: Object.keys(result.properties).length,
        viewsCount: result.views.length,
      });
      
      logResponse('/api/provision/notion', 'POST', 200, response);
      
      // Set response headers
      res.set({
        'X-Request-ID': requestId,
        'X-Database-ID': result.id,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      
      res.status(200).json(response);
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      logInfo('Notion provisioning failed', {
        requestId,
        parentPageId: parentPageId.substring(0, 8) + '...',
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
 * Test Notion connection
 * GET /api/provision/notion/test
 */
router.get(
  '/test',
  asyncHandler(async (req: Request, res: Response) => {
    const requestId = generateRequestId();
    
    try {
      const notionService = new NotionDatabaseService();
      const isConnected = await (notionService as any).client.testConnection();
      
      const testResponse = {
        connected: isConnected,
        timestamp: new Date().toISOString(),
        requestId,
      };
      
      logInfo('Notion connection test completed', {
        requestId,
        connected: isConnected,
      });
      
      logResponse('/api/provision/notion/test', 'GET', 200, testResponse);
      
      res.set({
        'X-Request-ID': requestId,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      });
      
      res.status(200).json(testResponse);
      
    } catch (error: any) {
      logInfo('Notion connection test failed', {
        requestId,
        error: error.message,
      });
      
      throw error;
    }
  })
);

export default router;