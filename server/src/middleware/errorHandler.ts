import { Request, Response, NextFunction } from 'express';
import { logError, logResponse } from '@/utils/logger.js';
import { ApiError as IApiError } from '@/types/index.js';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details: string;
  
  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details: string = '') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    // Ensure the stack trace points to the caller
    Error.captureStackTrace(this, ApiError);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // If response already sent, delegate to Express default error handler
  if (res.headersSent) {
    return next(error);
  }
  
  const timestamp = new Date().toISOString();
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details = 'An unexpected error occurred';
  
  // Handle different error types
  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = error.message;
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Authentication required';
    details = 'Valid credentials are required to access this resource';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    code = 'FORBIDDEN';
    message = 'Access denied';
    details = 'You do not have permission to access this resource';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Resource not found';
    details = 'The requested resource could not be found';
  } else if (error.message.includes('NOTION_')) {
    statusCode = 400;
    code = 'NOTION_ERROR';
    message = 'Notion API error';
    details = error.message;
  } else if (error.message.includes('AIRTABLE_')) {
    statusCode = 400;
    code = 'AIRTABLE_ERROR';
    message = 'Airtable API error';
    details = error.message;
  }
  
  // Log error with context
  logError(error, {
    endpoint: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    statusCode,
    code,
  });
  
  // Create error response
  const errorResponse: IApiError = {
    error: message,
    code,
    details,
    timestamp,
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).stack = error.stack;
  }
  
  // Log response
  logResponse(req.originalUrl, req.method, statusCode, errorResponse);
  
  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: IApiError = {
    error: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString(),
  };
  
  logResponse(req.originalUrl, req.method, 404, errorResponse);
  res.status(404).json(errorResponse);
}

/**
 * Async wrapper to catch async errors and pass them to error handler
 */
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<void>
) {
  return (req: T, res: U, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create specific API errors
 */
export const createError = {
  badRequest: (message: string, details?: string) => 
    new ApiError(message, 400, 'BAD_REQUEST', details || message),
    
  unauthorized: (message: string, details?: string) => 
    new ApiError(message, 401, 'UNAUTHORIZED', details || message),
    
  forbidden: (message: string, details?: string) => 
    new ApiError(message, 403, 'FORBIDDEN', details || message),
    
  notFound: (message: string, details?: string) => 
    new ApiError(message, 404, 'NOT_FOUND', details || message),
    
  conflict: (message: string, details?: string) => 
    new ApiError(message, 409, 'CONFLICT', details || message),
    
  unprocessableEntity: (message: string, details?: string) => 
    new ApiError(message, 422, 'UNPROCESSABLE_ENTITY', details || message),
    
  tooManyRequests: (message: string, details?: string) => 
    new ApiError(message, 429, 'TOO_MANY_REQUESTS', details || message),
    
  internal: (message: string, details?: string) => 
    new ApiError(message, 500, 'INTERNAL_ERROR', details || message),
    
  notionError: (message: string, details?: string) => 
    new ApiError(message, 400, 'NOTION_ERROR', details || message),
    
  airtableError: (message: string, details?: string) => 
    new ApiError(message, 400, 'AIRTABLE_ERROR', details || message),
};

export default errorHandler;