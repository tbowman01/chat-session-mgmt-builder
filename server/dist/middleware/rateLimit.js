import rateLimit from 'express-rate-limit';
import { getRateLimitConfig } from '../utils/config.js';
import { logSecurityEvent } from '../utils/logger.js';
export const rateLimitMiddleware = rateLimit({
    ...getRateLimitConfig(),
    keyGenerator: (req) => {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        return `${ip}`;
    },
    handler: (req, res) => {
        const { windowMs, max } = getRateLimitConfig();
        logSecurityEvent('RATE_LIMIT_EXCEEDED', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent'),
            limit: max,
            windowMs,
            timestamp: new Date().toISOString(),
        });
        res.status(429).json({
            error: 'Too many requests',
            code: 'RATE_LIMIT_EXCEEDED',
            details: `Maximum ${max} requests per ${windowMs / 1000} seconds`,
            retryAfter: Math.ceil(windowMs / 1000),
            timestamp: new Date().toISOString(),
        });
    },
    skip: (req) => {
        return req.path === '/health' && req.method === 'GET';
    },
    standardHeaders: true,
    legacyHeaders: false,
});
export const provisioningRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: 'Too many provisioning requests',
        code: 'PROVISIONING_RATE_LIMIT_EXCEEDED',
        details: 'Maximum 10 provisioning requests per 15 minutes',
        timestamp: new Date().toISOString(),
    },
    handler: (req, res) => {
        logSecurityEvent('PROVISIONING_RATE_LIMIT_EXCEEDED', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString(),
        });
        res.status(429).json({
            error: 'Too many provisioning requests',
            code: 'PROVISIONING_RATE_LIMIT_EXCEEDED',
            details: 'Maximum 10 provisioning requests per 15 minutes',
            retryAfter: 900,
            timestamp: new Date().toISOString(),
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});
export default rateLimitMiddleware;
//# sourceMappingURL=rateLimit.js.map