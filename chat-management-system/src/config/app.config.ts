export interface AppConfig {
  port: number;
  environment: 'development' | 'test' | 'production';
  cors: {
    origin: string | boolean;
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  store: {
    maxItems: number;
  };
}

export const createAppConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  environment: (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN === 'true' || process.env.CORS_ORIGIN || false,
    credentials: process.env.CORS_CREDENTIALS === 'true'
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10) // 100 requests per windowMs
  },
  store: {
    maxItems: parseInt(process.env.MAX_TODOS || '10000', 10)
  }
});