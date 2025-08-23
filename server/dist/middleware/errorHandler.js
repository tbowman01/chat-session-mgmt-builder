import { logError, logResponse } from '../utils/logger.js';
export class ApiError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = '') {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, ApiError);
    }
}
export function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }
    const timestamp = new Date().toISOString();
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details = 'An unexpected error occurred';
    if (error instanceof ApiError) {
        statusCode = error.statusCode;
        code = error.code;
        message = error.message;
        details = error.details;
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Request validation failed';
        details = error.message;
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        code = 'UNAUTHORIZED';
        message = 'Authentication required';
        details = 'Valid credentials are required to access this resource';
    }
    else if (error.name === 'ForbiddenError') {
        statusCode = 403;
        code = 'FORBIDDEN';
        message = 'Access denied';
        details = 'You do not have permission to access this resource';
    }
    else if (error.name === 'NotFoundError') {
        statusCode = 404;
        code = 'NOT_FOUND';
        message = 'Resource not found';
        details = 'The requested resource could not be found';
    }
    else if (error.message.includes('NOTION_')) {
        statusCode = 400;
        code = 'NOTION_ERROR';
        message = 'Notion API error';
        details = error.message;
    }
    else if (error.message.includes('AIRTABLE_')) {
        statusCode = 400;
        code = 'AIRTABLE_ERROR';
        message = 'Airtable API error';
        details = error.message;
    }
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
    const errorResponse = {
        error: message,
        code,
        details,
        timestamp,
    };
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
    }
    logResponse(req.originalUrl, req.method, statusCode, errorResponse);
    res.status(statusCode).json(errorResponse);
}
export function notFoundHandler(req, res) {
    const errorResponse = {
        error: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        details: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
        timestamp: new Date().toISOString(),
    };
    logResponse(req.originalUrl, req.method, 404, errorResponse);
    res.status(404).json(errorResponse);
}
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
export const createError = {
    badRequest: (message, details) => new ApiError(message, 400, 'BAD_REQUEST', details || message),
    unauthorized: (message, details) => new ApiError(message, 401, 'UNAUTHORIZED', details || message),
    forbidden: (message, details) => new ApiError(message, 403, 'FORBIDDEN', details || message),
    notFound: (message, details) => new ApiError(message, 404, 'NOT_FOUND', details || message),
    conflict: (message, details) => new ApiError(message, 409, 'CONFLICT', details || message),
    unprocessableEntity: (message, details) => new ApiError(message, 422, 'UNPROCESSABLE_ENTITY', details || message),
    tooManyRequests: (message, details) => new ApiError(message, 429, 'TOO_MANY_REQUESTS', details || message),
    internal: (message, details) => new ApiError(message, 500, 'INTERNAL_ERROR', details || message),
    notionError: (message, details) => new ApiError(message, 400, 'NOTION_ERROR', details || message),
    airtableError: (message, details) => new ApiError(message, 400, 'AIRTABLE_ERROR', details || message),
};
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map