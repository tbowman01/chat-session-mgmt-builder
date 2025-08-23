import cors from 'cors';
import { getCorsConfig } from '../utils/config.js';
import { logSecurityEvent } from '../utils/logger.js';
export const corsMiddleware = cors({
    ...getCorsConfig(),
    optionsSuccessStatus: 200,
    origin: (origin, callback) => {
        const corsConfig = getCorsConfig();
        if (!origin) {
            return callback(null, true);
        }
        if (corsConfig.origin.includes(origin)) {
            return callback(null, true);
        }
        logSecurityEvent('CORS_VIOLATION', {
            origin,
            allowedOrigins: corsConfig.origin,
            timestamp: new Date().toISOString(),
        });
        const corsError = new Error(`CORS policy violation: Origin ${origin} is not allowed`);
        return callback(corsError, false);
    },
});
export default corsMiddleware;
//# sourceMappingURL=cors.js.map