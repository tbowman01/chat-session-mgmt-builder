import { Router } from 'express';
import { validate, validationSchemas } from '../middleware/validation.js';
import { provisioningRateLimit } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logInfo, logResponse } from '../utils/logger.js';
import { generateRequestId } from '../utils/security.js';
import NotionDatabaseService from '../services/notion/database.js';
const router = Router();
router.post('/', provisioningRateLimit, validate(validationSchemas.provisionNotion), asyncHandler(async (req, res) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const { parentPageId, config } = req.body;
    logInfo('Notion provisioning request received', {
        requestId,
        parentPageId: parentPageId.substring(0, 8) + '...' + parentPageId.substring(-4),
        platform: config.platform,
        priorities: config.priorities,
        features: config.features,
        teamSize: config.teamSize,
        complexity: config.complexity,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    try {
        const notionService = new NotionDatabaseService();
        const result = await notionService.createChatSessionDatabase(parentPageId, config);
        try {
            await notionService.createSampleData(result.id, config);
            logInfo('Sample data created successfully', { requestId, databaseId: result.id });
        }
        catch (sampleError) {
            logInfo('Sample data creation failed (non-critical)', {
                requestId,
                databaseId: result.id,
                error: sampleError
            });
        }
        const duration = Date.now() - startTime;
        const response = {
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
        res.set({
            'X-Request-ID': requestId,
            'X-Database-ID': result.id,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        });
        res.status(200).json(response);
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logInfo('Notion provisioning failed', {
            requestId,
            parentPageId: parentPageId.substring(0, 8) + '...',
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
router.get('/test', asyncHandler(async (req, res) => {
    const requestId = generateRequestId();
    try {
        const notionService = new NotionDatabaseService();
        const isConnected = await notionService.client.testConnection();
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
    }
    catch (error) {
        logInfo('Notion connection test failed', {
            requestId,
            error: error.message,
        });
        throw error;
    }
}));
export default router;
//# sourceMappingURL=provisionNotion.js.map