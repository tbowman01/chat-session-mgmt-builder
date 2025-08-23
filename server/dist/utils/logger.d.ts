import winston from 'winston';
declare const logger: winston.Logger;
export declare function logRequest(req: any, res: any, duration: number): void;
export declare function logError(error: Error, context?: any): void;
export declare function logInfo(message: string, meta?: any): void;
export declare function logWarning(message: string, meta?: any): void;
export declare function logDebug(message: string, meta?: any): void;
export declare function logResponse(endpoint: string, method: string, status: number, data?: any): void;
export declare function logSecurityEvent(event: string, details: any): void;
export default logger;
//# sourceMappingURL=logger.d.ts.map