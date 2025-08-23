import { Request, Response, NextFunction } from 'express';
export declare class ApiError extends Error {
    statusCode: number;
    code: string;
    details: string;
    constructor(message: string, statusCode?: number, code?: string, details?: string);
}
export declare function errorHandler(error: Error | ApiError, req: Request, res: Response, next: NextFunction): void;
export declare function notFoundHandler(req: Request, res: Response): void;
export declare function asyncHandler<T extends Request, U extends Response>(fn: (req: T, res: U, next: NextFunction) => Promise<void>): (req: T, res: U, next: NextFunction) => void;
export declare const createError: {
    badRequest: (message: string, details?: string) => ApiError;
    unauthorized: (message: string, details?: string) => ApiError;
    forbidden: (message: string, details?: string) => ApiError;
    notFound: (message: string, details?: string) => ApiError;
    conflict: (message: string, details?: string) => ApiError;
    unprocessableEntity: (message: string, details?: string) => ApiError;
    tooManyRequests: (message: string, details?: string) => ApiError;
    internal: (message: string, details?: string) => ApiError;
    notionError: (message: string, details?: string) => ApiError;
    airtableError: (message: string, details?: string) => ApiError;
};
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map