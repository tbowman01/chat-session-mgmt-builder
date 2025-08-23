import cors from 'cors';
import { getCorsConfig } from '@/utils/config.js';
import { logSecurityEvent } from '@/utils/logger.js';

/**
 * CORS middleware configuration
 */
export const corsMiddleware = cors({
  ...getCorsConfig(),
  optionsSuccessStatus: 200,
  
  // Custom origin validation with logging
  origin: (origin, callback) => {
    const corsConfig = getCorsConfig();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (corsConfig.origin.includes(origin)) {
      return callback(null, true);
    }
    
    // Log unauthorized origin attempt
    logSecurityEvent('CORS_VIOLATION', {
      origin,
      allowedOrigins: corsConfig.origin,
      timestamp: new Date().toISOString(),
    });
    
    const corsError = new Error(
      `CORS policy violation: Origin ${origin} is not allowed`
    );
    return callback(corsError, false);
  },
});

export default corsMiddleware;