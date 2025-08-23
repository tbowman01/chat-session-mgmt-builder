import { Request, Response, NextFunction } from 'express';
export declare function sanitizeString(input: string): string;
export declare function validateNotionPageId(pageId: string): boolean;
export declare function validateAirtableBaseId(baseId: string): boolean;
export declare function detectSuspiciousActivity(req: Request): boolean;
export declare function securityMiddleware(req: Request, res: Response, next: NextFunction): void;
declare class InMemoryRateLimitStore {
    private store;
    private windowMs;
    constructor(windowMs: number);
    incr(key: string): number;
    decrement(key: string): void;
    resetTime(key: string): Date;
    resetAll(): void;
    cleanup(): void;
}
export declare const rateLimitStore: InMemoryRateLimitStore;
export declare function getSecurityHeaders(): {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: string[];
            styleSrc: string[];
            scriptSrc: string[];
            imgSrc: string[];
            connectSrc: string[];
            fontSrc: string[];
            objectSrc: string[];
            mediaSrc: string[];
            frameSrc: string[];
        };
    };
    crossOriginEmbedderPolicy: boolean;
    crossOriginOpenerPolicy: boolean;
    crossOriginResourcePolicy: boolean;
    dnsPrefetchControl: boolean;
    frameguard: {
        action: "deny";
    };
    hidePoweredBy: boolean;
    hsts: {
        maxAge: number;
        includeSubDomains: boolean;
        preload: boolean;
    };
    ieNoOpen: boolean;
    noSniff: boolean;
    originAgentCluster: boolean;
    permittedCrossDomainPolicies: boolean;
    referrerPolicy: {
        policy: "no-referrer";
    };
};
export declare function validateRequestSize(req: Request, maxSize?: number): boolean;
export declare function generateRequestId(): string;
export {};
//# sourceMappingURL=security.d.ts.map