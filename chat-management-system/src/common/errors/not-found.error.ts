import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly errorCode = 'NOT_FOUND';

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}