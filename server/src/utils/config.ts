import dotenv from 'dotenv';
import { ServerConfig } from '@/types/index.js';

// Load environment variables
dotenv.config();

/**
 * Server configuration with environment variable validation
 */
export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '8787', 10),
  environment: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || '2.0.0',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60', 10),
    maxConcurrent: parseInt(process.env.RATE_LIMIT_MAX_CONCURRENT || '10', 10),
  },
  notion: {
    token: process.env.NOTION_TOKEN || '',
  },
  airtable: {
    token: process.env.AIRTABLE_TOKEN || '',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/server.log',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-token-key-change-in-production',
    accessTokenExpiry: process.env.JWT_EXPIRES_IN || '1h',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'chat-session-mgmt-api',
    audience: process.env.JWT_AUDIENCE || 'chat-session-mgmt-client',
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:8787/api/auth/github/callback',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8787/api/auth/google/callback',
    },
    session: {
      secret: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800000', 10), // 7 days
    },
  },
};

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
  // Skip validation in development if auth bypass is enabled
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    console.log('✅ Configuration validation skipped (development auth bypass mode)');
    return;
  }

  const requiredVars = ['NOTION_TOKEN', 'AIRTABLE_TOKEN'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`  - ${varName}`);
    });
    console.error('\nPlease check your .env file or environment configuration.');
    process.exit(1);
  }
  
  // Validate Notion token format
  if (!config.notion.token.startsWith('secret_')) {
    console.error('❌ Invalid NOTION_TOKEN format. Must start with "secret_"');
    process.exit(1);
  }
  
  // Validate Airtable token format
  if (!config.airtable.token.startsWith('pat')) {
    console.error('❌ Invalid AIRTABLE_TOKEN format. Must start with "pat"');
    process.exit(1);
  }
  
  console.log('✅ Configuration validation passed');
}

/**
 * Check if running in production environment
 */
export function isProduction(): boolean {
  return config.environment === 'production';
}

/**
 * Check if running in development environment
 */
export function isDevelopment(): boolean {
  return config.environment === 'development';
}

/**
 * Get CORS configuration
 */
export function getCorsConfig() {
  return {
    origin: config.allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400, // 24 hours
    credentials: false,
  };
}

/**
 * Get rate limiting configuration
 */
export function getRateLimitConfig() {
  return {
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      details: `Maximum ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs / 1000} seconds`,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any, res: any) => {
      res.status(429).json({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        details: `Maximum ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs / 1000} seconds`,
        timestamp: new Date().toISOString(),
      });
    },
  };
}

export default config;