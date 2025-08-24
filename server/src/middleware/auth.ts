import { Request, Response, NextFunction } from 'express';
import { 
  extractTokenFromHeader, 
  extractTokenFromCookie, 
  verifyAccessToken, 
  isTokenBlacklisted 
} from '../utils/jwt.js';
import logger from '../utils/logger.js';

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  // Extract token from Authorization header or cookie
  let token = extractTokenFromHeader(req);
  
  if (!token) {
    token = extractTokenFromCookie(req);
  }

  if (!token) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'MISSING_TOKEN',
      details: 'No authentication token provided',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Check if token is blacklisted
  if (isTokenBlacklisted(token)) {
    res.status(401).json({
      error: 'Token invalid',
      code: 'BLACKLISTED_TOKEN',
      details: 'Token has been revoked',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Verify token
  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
      details: 'Token verification failed',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Attach user info to request (in production, fetch full user from database)
  req.user = {
    id: payload.userId,
    email: payload.email,
    name: payload.email.split('@')[0],
    role: payload.role as 'admin' | 'user',
    provider: payload.provider as 'local' | 'github' | 'google',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
    isActive: true,
  };

  logger.debug('User authenticated', { 
    userId: req.user.id, 
    email: req.user.email,
    route: req.path 
  });

  next();
}

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractTokenFromHeader(req) || extractTokenFromCookie(req);
  
  if (token && !isTokenBlacklisted(token)) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = {
        id: payload.userId,
        email: payload.email,
        name: payload.email.split('@')[0],
        role: payload.role as 'admin' | 'user',
        provider: payload.provider as 'local' | 'github' | 'google',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: true,
        isActive: true,
      };
    }
  }

  next();
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...roles: ('admin' | 'user')[]): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED',
        details: 'User authentication is required for this endpoint',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Access denied - insufficient role', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        route: req.path,
      });

      res.status(403).json({
        error: 'Access denied',
        code: 'INSUFFICIENT_ROLE',
        details: `Access requires one of these roles: ${roles.join(', ')}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware to check if user owns the resource (by userId parameter)
 */
export function requireOwnership(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      error: 'Authentication required',
      code: 'AUTHENTICATION_REQUIRED',
      details: 'User authentication is required for this endpoint',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const resourceUserId = req.params.userId || req.body.userId || req.query.userId;
  
  if (!resourceUserId) {
    res.status(400).json({
      error: 'Bad request',
      code: 'MISSING_USER_ID',
      details: 'User ID parameter is required',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Admin can access all resources, users can only access their own
  if (req.user.role !== 'admin' && req.user.id !== resourceUserId) {
    logger.warn('Access denied - ownership violation', {
      userId: req.user.id,
      requestedResourceUserId: resourceUserId,
      route: req.path,
    });

    res.status(403).json({
      error: 'Access denied',
      code: 'OWNERSHIP_VIOLATION',
      details: 'You can only access your own resources',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
}

/**
 * Rate limiting for authentication endpoints
 */
export function authRateLimit(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
  const attempts = new Map<string, { count: number; resetTime: Date }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || 'unknown';
    const now = new Date();
    const record = attempts.get(key);

    if (!record || now > record.resetTime) {
      attempts.set(key, { count: 1, resetTime: new Date(now.getTime() + windowMs) });
      next();
      return;
    }

    if (record.count >= maxAttempts) {
      logger.warn('Authentication rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        route: req.path,
      });

      res.status(429).json({
        error: 'Too many attempts',
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        details: `Maximum ${maxAttempts} authentication attempts exceeded. Try again in ${Math.ceil((record.resetTime.getTime() - now.getTime()) / 60000)} minutes.`,
        timestamp: new Date().toISOString(),
        retryAfter: Math.ceil((record.resetTime.getTime() - now.getTime()) / 1000),
      });
      return;
    }

    record.count++;
    next();
  };
}

/**
 * Middleware to validate API key for service-to-service communication
 */
export function validateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    logger.error('API key validation skipped - no API_KEY environment variable set');
    next();
    return;
  }

  if (!apiKey) {
    res.status(401).json({
      error: 'API key required',
      code: 'MISSING_API_KEY',
      details: 'X-API-Key header is required for this endpoint',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (apiKey !== validApiKey) {
    logger.warn('Invalid API key attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      route: req.path,
    });

    res.status(401).json({
      error: 'Invalid API key',
      code: 'INVALID_API_KEY',
      details: 'The provided API key is not valid',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
}

/**
 * Middleware to log authentication events
 */
export function logAuthEvent(event: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authInfo = {
      event,
      userId: req.user?.id,
      email: req.user?.email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      route: req.path,
      timestamp: new Date().toISOString(),
    };

    logger.info('Authentication event', authInfo);
    next();
  };
}