import { Router, Request, Response } from 'express';
import { config } from '@/utils/config.js';
import { logInfo, logResponse } from '@/utils/logger.js';
import { asyncHandler } from '@/middleware/errorHandler.js';
import { HealthResponse } from '@/types/index.js';

const router = Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  // Basic health check response
  const healthResponse: HealthResponse = {
    ok: true,
    timestamp: new Date().toISOString(),
    version: config.apiVersion,
  };
  
  // Add additional health metrics in development
  if (config.environment === 'development') {
    (healthResponse as any).environment = config.environment;
    (healthResponse as any).uptime = process.uptime();
    (healthResponse as any).memory = {
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
  
  // Set cache headers
  res.set({
    'Cache-Control': 'public, max-age=30', // Cache for 30 seconds
    'X-API-Version': config.apiVersion,
  });
  
  res.status(200).json(healthResponse);
}));

/**
 * Detailed health check endpoint
 * GET /health/detailed
 */
router.get('/detailed', asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  // More comprehensive health check
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

/**
 * Readiness probe endpoint for Kubernetes
 * GET /health/ready
 */
router.get('/ready', asyncHandler(async (req: Request, res: Response) => {
  // Check if essential services are configured
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

/**
 * Liveness probe endpoint for Kubernetes
 * GET /health/live
 */
router.get('/live', asyncHandler(async (req: Request, res: Response) => {
  // Simple liveness check
  const livenessResponse = {
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
  
  logResponse('/health/live', 'GET', 200, livenessResponse);
  
  res.status(200).json(livenessResponse);
}));

export default router;