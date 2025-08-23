import { ServerConfig } from '../types/index.js';
export declare const config: ServerConfig;
export declare function validateConfig(): void;
export declare function isProduction(): boolean;
export declare function isDevelopment(): boolean;
export declare function getCorsConfig(): {
    origin: string[];
    methods: string[];
    allowedHeaders: string[];
    maxAge: number;
    credentials: boolean;
};
export declare function getRateLimitConfig(): {
    windowMs: number;
    max: number;
    message: {
        error: string;
        code: string;
        details: string;
        timestamp: string;
    };
    standardHeaders: boolean;
    legacyHeaders: boolean;
    handler: (req: any, res: any) => void;
};
export default config;
//# sourceMappingURL=config.d.ts.map