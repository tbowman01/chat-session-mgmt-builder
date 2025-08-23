import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './logger.js';

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate Notion page ID format
 */
export function validateNotionPageId(pageId: string): boolean {
  // Notion page IDs are 32 characters long and contain only alphanumeric characters and hyphens
  const notionPageIdRegex = /^[a-zA-Z0-9\-]{32}$/;
  return notionPageIdRegex.test(pageId);
}

/**
 * Validate Airtable base ID format
 */
export function validateAirtableBaseId(baseId: string): boolean {
  // Airtable base IDs start with "app" followed by 14 alphanumeric characters
  const airtableBaseIdRegex = /^app[a-zA-Z0-9]{14}$/;
  return airtableBaseIdRegex.test(baseId);
}

/**
 * Check for suspicious patterns in request
 */
export function detectSuspiciousActivity(req: Request): boolean {
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // Script injection
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript protocol
    /vbscript:/i,  // VBScript protocol
    /data:/i,  // Data protocol
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

/**
 * Security middleware to check for suspicious activity
 */
export function securityMiddleware(req: Request, res: Response, next: NextFunction): void {
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

/**
 * Rate limiting store for tracking requests
 */
class InMemoryRateLimitStore {
  private store = new Map<string, { count: number; resetTime: Date }>();
  private windowMs: number;
  
  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }
  
  incr(key: string): number {
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
  
  decrement(key: string): void {
    const record = this.store.get(key);
    if (record && record.count > 0) {
      record.count--;
      this.store.set(key, record);
    }
  }
  
  resetTime(key: string): Date {
    const record = this.store.get(key);
    return record?.resetTime || new Date();
  }
  
  resetAll(): void {
    this.store.clear();
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = new Date();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimitStore = new InMemoryRateLimitStore(60000); // 1 minute window

// Clean up expired rate limit entries every 5 minutes
setInterval(() => {
  rateLimitStore.cleanup();
}, 5 * 60 * 1000);

/**
 * Generate secure headers configuration
 */
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
    crossOriginEmbedderPolicy: false, // Disable for API compatibility
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' as const },
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
    referrerPolicy: { policy: 'no-referrer' as const },
  };
}

/**
 * Validate request size
 */
export function validateRequestSize(req: Request, maxSize: number = 1024 * 1024): boolean {
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

/**
 * Generate request ID for tracking
 */
export function generateRequestId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}