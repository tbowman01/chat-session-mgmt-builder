// Test-friendly server export without import.meta usage
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import corsOptions from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateContentType } from './middleware/validation.js';
import rateLimitConfig from './middleware/rateLimit.js';
import { securityMiddleware } from './utils/security.js';
import healthRoutes from './routes/health.js';
import provisionNotionRoutes from './routes/provisionNotion.js';
import provisionAirtableRoutes from './routes/provisionAirtable.js';
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import logger from './utils/logger.js';
import { config } from './utils/config.js';

export class Server {
  public app: Application;
  private server?: any;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.github.com", "https://accounts.google.com"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }));

    // CORS
    this.app.use(cors(corsOptions));

    // Cookie parser (required for authentication)
    this.app.use(cookieParser());

    // Session middleware (required for OAuth)
    this.app.use(session({
      secret: config.auth.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: config.environment === 'production',
        httpOnly: true,
        maxAge: config.auth.session.maxAge,
      },
    }));

    // Initialize Passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Rate limiting
    this.app.use(rateLimit(rateLimitConfig));

    // Security checks for suspicious activity
    this.app.use(securityMiddleware);

    // Body parsing and compression
    this.app.use(compression());
    this.app.use(validateContentType);
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging
    if (config.environment !== 'test') {
      this.app.use(morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) }
      }));
    }

    // API version header
    this.app.use((req, res, next) => {
      res.set('X-API-Version', config.apiVersion);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check routes
    this.app.use('/health', healthRoutes);

    // Authentication routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/auth', oauthRoutes);

    // API routes (protected endpoints can use authentication middleware)
    this.app.use('/api/provision/notion', provisionNotionRoutes);
    this.app.use('/api/provision/airtable', provisionAirtableRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Chat Session Management API',
        version: config.apiVersion,
        environment: config.environment,
        timestamp: new Date().toISOString(),
        endpoints: {
          // Health endpoints
          health: '/health',
          detailed_health: '/health/detailed',
          readiness: '/health/ready',
          liveness: '/health/live',
          
          // Authentication endpoints
          auth_login: '/api/auth/login',
          auth_register: '/api/auth/register',
          auth_logout: '/api/auth/logout',
          auth_refresh: '/api/auth/refresh',
          auth_me: '/api/auth/me',
          auth_status: '/api/auth/status',
          
          // OAuth endpoints
          oauth_github: '/api/auth/github',
          oauth_google: '/api/auth/google',
          oauth_providers: '/api/auth/providers',
          
          // Provision endpoints
          provision_notion: '/api/provision/notion',
          provision_airtable: '/api/provision/airtable',
        },
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  async start(): Promise<void> {
    try {
      const port = config.port;
      this.server = this.app.listen(port, () => {
        logger.info(`🚀 Server running on port ${port}`);
        logger.info(`📱 Environment: ${config.environment}`);
        logger.info(`🔗 Health check: http://localhost:${port}/health`);
      });

      // Graceful shutdown
      const gracefulShutdown = () => {
        logger.info('Shutting down gracefully...');
        this.server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });
      };

      process.on('SIGTERM', gracefulShutdown);
      process.on('SIGINT', gracefulShutdown);

    } catch (error) {
      logger.error('Failed to start server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.close();
      logger.info('Server stopped');
    }
  }
}

// Create and export server instance
export const server = new Server();
export default server.app;