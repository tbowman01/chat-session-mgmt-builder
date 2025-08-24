import { Request, Response, NextFunction } from 'express';
import { BaseError } from '@/common/errors/base.error';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
    return;
  }

  // Handle unexpected errors - only log in development/production
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unexpected error:', error);
  }
  
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
    }
  });
};