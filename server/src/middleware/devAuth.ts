import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

/**
 * Development-only authentication bypass middleware
 * Creates a mock user for development purposes
 */
export function devAuthBypass(req: Request, res: Response, next: NextFunction): void {
  // Only work in development mode with bypass enabled
  if (process.env.NODE_ENV !== 'development' || process.env.BYPASS_AUTH !== 'true') {
    return next();
  }

  // Create a mock user for development
  req.user = {
    id: 'dev-user-123',
    email: 'dev@example.com',
    name: 'Development User',
    role: 'admin',
    provider: 'local',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
    isActive: true,
  };

  logger.debug('Development auth bypass activated', { 
    userId: req.user.id, 
    email: req.user.email,
    route: req.path 
  });

  next();
}

/**
 * Simple development authentication that bypasses JWT entirely
 */
export function simpleDevAuth(req: Request, res: Response, next: NextFunction): void {
  // Skip authentication entirely in development bypass mode
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    req.user = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User',
      role: 'admin',
      provider: 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true,
      isActive: true,
    };

    logger.debug('Simple development auth bypass', { 
      userId: req.user.id, 
      route: req.path 
    });

    return next();
  }

  // In production mode or bypass disabled, require proper authentication
  res.status(401).json({
    error: 'Authentication required',
    code: 'MISSING_TOKEN',
    details: 'Authentication bypass is only available in development mode',
    timestamp: new Date().toISOString(),
  });
}