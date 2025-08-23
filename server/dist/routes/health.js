import { Router } from 'express';
import { config } from '../utils/config.js';
import { logInfo, logResponse } from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
const router = Router();
router.get('/', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const healthResponse = {
        ok: true,
        timestamp: new Date().toISOString(),
        version: config.apiVersion,
    };
    if (config.environment === 'development') {
        healthResponse.environment = config.environment;
        healthResponse.uptime = process.uptime();
        healthResponse.memory = {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        };
    }
    const duration = Date.now() - startTime;
    logInfo('Health check requested', {
        duration,
        status: 'healthy',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    logResponse('/health', 'GET', 200, healthResponse);
    res.set({
        'Cache-Control': 'public, max-age=30',
        'X-API-Version': config.apiVersion,
    });
    res.status(200).json(healthResponse);
}));
router.get('/detailed', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const healthResponse = {
        ok: true,
        timestamp: new Date().toISOString(),
        version: config.apiVersion,
        environment: config.environment,
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            external: Math.round(process.memoryUsage().external / 1024 / 1024),
        },
        cpu: process.cpuUsage(),
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        services: {
            notion: !!config.notion.token,
            airtable: !!config.airtable.token,
        },
    };
    const duration = Date.now() - startTime;
    logInfo('Detailed health check requested', {
        duration,
        status: 'healthy',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    logResponse('/health/detailed', 'GET', 200, healthResponse);
    res.status(200).json(healthResponse);
}));
router.get('/ready', asyncHandler(async (req, res) => {
    const isReady = !!(config.notion.token && config.airtable.token);
    const readinessResponse = {
        ready: isReady,
        timestamp: new Date().toISOString(),
        services: {
            notion: !!config.notion.token,
            airtable: !!config.airtable.token,
        },
    };
    const statusCode = isReady ? 200 : 503;
    logResponse('/health/ready', 'GET', statusCode, readinessResponse);
    res.status(statusCode).json(readinessResponse);
}));
router.get('/live', asyncHandler(async (req, res) => {
    const livenessResponse = {
        alive: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
    logResponse('/health/live', 'GET', 200, livenessResponse);
    res.status(200).json(livenessResponse);
}));
export default router;
//# sourceMappingURL=health.js.map