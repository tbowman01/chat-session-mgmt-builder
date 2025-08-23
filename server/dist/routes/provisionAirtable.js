import { Router } from 'express';
import { validate, validationSchemas } from '../middleware/validation.js';
import { provisioningRateLimit } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logInfo, logResponse } from '../utils/logger.js';
import { generateRequestId } from '../utils/security.js';
import AirtableBaseService from '../services/airtable/base.js';
const router = Router();
router.post('/', provisioningRateLimit, validate(validationSchemas.provisionAirtable), asyncHandler(async (req, res) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const { baseId, seedSample = false, config } = req.body;
    logInfo('Airtable provisioning request received', {
        requestId,
        baseId: baseId.substring(0, 8) + '...',
        seedSample,
        hasConfig: !!config,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    try {
        const airtableService = new AirtableBaseService();
        const validation = await airtableService.validateBase(baseId, config);
        if (!validation.valid) {
            throw new Error('Base validation failed');
        }
        let sampleRecordId;
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
            }
            catch (sampleError) {
                logInfo('Sample data creation failed (non-critical)', {
                    requestId,
                    baseId,
                    error: sampleError
                });
            }
        }
        const duration = Date.now() - startTime;
        const response = {
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
        res.set({
            'X-Request-ID': requestId,
            'X-Base-ID': baseId,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        });
        if (validation.warnings && validation.warnings.length > 0) {
            res.set('X-Warnings', validation.warnings.join('; '));
        }
        res.status(200).json(response);
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logInfo('Airtable provisioning failed', {
            requestId,
            baseId: baseId.substring(0, 8) + '...',
            duration,
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR',
        });
        if (error.details) {
            error.details += ` (Request ID: ${requestId})`;
        }
        throw error;
    }
}));
router.get('/test/:baseId', asyncHandler(async (req, res) => {
    const requestId = generateRequestId();
    const { baseId } = req.params;
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
        const isConnected = await airtableService.client.testConnection(baseId);
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
    }
    catch (error) {
        logInfo('Airtable connection test failed', {
            requestId,
            baseId,
            error: error.message,
        });
        throw error;
    }
}));
router.get('/info/:baseId', asyncHandler(async (req, res) => {
    const requestId = generateRequestId();
    const { baseId } = req.params;
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
            'Cache-Control': 'private, max-age=300',
        });
        res.status(200).json(baseInfo);
    }
    catch (error) {
        logInfo('Airtable base info retrieval failed', {
            requestId,
            baseId,
            error: error.message,
        });
        throw error;
    }
}));
export default router;
//# sourceMappingURL=provisionAirtable.js.map