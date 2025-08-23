import { logSecurityEvent } from './logger.js';
export function sanitizeString(input) {
    if (typeof input !== 'string') {
        return '';
    }
    return input
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
}
export function validateNotionPageId(pageId) {
    const notionPageIdRegex = /^[a-zA-Z0-9\-]{32}$/;
    return notionPageIdRegex.test(pageId);
}
export function validateAirtableBaseId(baseId) {
    const airtableBaseIdRegex = /^app[a-zA-Z0-9]{14}$/;
    return airtableBaseIdRegex.test(baseId);
}
export function detectSuspiciousActivity(req) {
    const suspiciousPatterns = [
        /\.\./,
        /<script/i,
        /union.*select/i,
        /javascript:/i,
        /vbscript:/i,
        /data:/i,
    ];
    const requestString = JSON.stringify(req.body) + req.url + (req.get('User-Agent') || '');
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(requestString)) {
            logSecurityEvent('SUSPICIOUS_PATTERN_DETECTED', {
                pattern: pattern.toString(),
                url: req.url,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                body: req.body,
            });
            return true;
        }
    }
    return false;
}
export function securityMiddleware(req, res, next) {
    if (detectSuspiciousActivity(req)) {
        res.status(403).json({
            error: 'Suspicious activity detected',
            code: 'SECURITY_VIOLATION',
            details: 'Request contains potentially malicious content',
            timestamp: new Date().toISOString(),
        });
        return;
    }
    next();
}
class InMemoryRateLimitStore {
    store = new Map();
    windowMs;
    constructor(windowMs) {
        this.windowMs = windowMs;
    }
    incr(key) {
        const now = new Date();
        const record = this.store.get(key);
        if (!record || now > record.resetTime) {
            const resetTime = new Date(now.getTime() + this.windowMs);
            this.store.set(key, { count: 1, resetTime });
            return 1;
        }
        record.count++;
        this.store.set(key, record);
        return record.count;
    }
    decrement(key) {
        const record = this.store.get(key);
        if (record && record.count > 0) {
            record.count--;
            this.store.set(key, record);
        }
    }
    resetTime(key) {
        const record = this.store.get(key);
        return record?.resetTime || new Date();
    }
    resetAll() {
        this.store.clear();
    }
    cleanup() {
        const now = new Date();
        for (const [key, record] of this.store.entries()) {
            if (now > record.resetTime) {
                this.store.delete(key);
            }
        }
    }
}
export const rateLimitStore = new InMemoryRateLimitStore(60000);
setInterval(() => {
    rateLimitStore.cleanup();
}, 5 * 60 * 1000);
export function getSecurityHeaders() {
    return {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        dnsPrefetchControl: true,
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        ieNoOpen: true,
        noSniff: true,
        originAgentCluster: true,
        permittedCrossDomainPolicies: false,
        referrerPolicy: { policy: 'no-referrer' },
    };
}
export function validateRequestSize(req, maxSize = 1024 * 1024) {
    const contentLength = req.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxSize) {
        logSecurityEvent('REQUEST_SIZE_EXCEEDED', {
            contentLength: parseInt(contentLength, 10),
            maxSize,
            url: req.url,
            ip: req.ip,
        });
        return false;
    }
    return true;
}
export function generateRequestId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
//# sourceMappingURL=security.js.map