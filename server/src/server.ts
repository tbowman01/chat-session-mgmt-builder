// Test-friendly server export without import.meta usage
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { corsOptions } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateContentType } from './middleware/validation.js';
import { rateLimitConfig } from './middleware/rateLimit.js';
import healthRoutes from './routes/health.js';
import provisionNotionRoutes from './routes/provisionNotion.js';
import provisionAirtableRoutes from './routes/provisionAirtable.js';
import { logger } from './utils/logger.js';
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

    // Rate limiting
    this.app.use(rateLimit(rateLimitConfig));

    // Body parsing and compression
    this.app.use(compression());
    this.app.use(validateContentType);
    this.app.use(express.json({ limit: config.MAX_REQUEST_SIZE }));
    this.app.use(express.urlencoded({ extended: true, limit: config.MAX_REQUEST_SIZE }));

    // Logging
    if (config.NODE_ENV !== 'test') {
      this.app.use(morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) }
      }));
    }

    // API version header
    this.app.use((req, res, next) => {
      res.set('X-API-Version', config.VERSION);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check routes
    this.app.use('/health', healthRoutes);

    // API routes
    this.app.use('/api/provision/notion', provisionNotionRoutes);
    this.app.use('/api/provision/airtable', provisionAirtableRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Chat Session Management API',
        version: config.VERSION,
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          detailed_health: '/health/detailed',
          readiness: '/health/ready',
          liveness: '/health/live',
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
      const port = config.PORT;
      this.server = this.app.listen(port, () => {
        logger.info(`🚀 Server running on port ${port}`);
        logger.info(`📱 Environment: ${config.NODE_ENV}`);
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