import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config, validateConfig } from './utils/config.js';
import { getSecurityHeaders } from './utils/security.js';
import { logInfo, logError, logRequest } from './utils/logger.js';
import corsMiddleware from './middleware/cors.js';
import rateLimitMiddleware from './middleware/rateLimit.js';
import { securityMiddleware } from './utils/security.js';
import { validateContentType } from './middleware/validation.js';
import errorHandler, { notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import healthRoutes from './routes/health.js';
import provisionNotionRoutes from './routes/provisionNotion.js';
import provisionAirtableRoutes from './routes/provisionAirtable.js';

/**
 * Express application setup and configuration
 */
class Server {
  public app: express.Application;
  private startTime: Date;
  
  constructor() {
    this.app = express();
    this.startTime = new Date();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }
  
  /**
   * Initialize middleware stack
   */
  private initializeMiddleware(): void {
    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);
    
    // Security middleware - must be first
    this.app.use(helmet(getSecurityHeaders()));
    
    // CORS configuration
    this.app.use(corsMiddleware);
    
    // Request logging
    if (config.environment === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => {
            logInfo('HTTP Request', { message: message.trim() });
          },
        },
      }));
    }
    
    // Custom request timing middleware
    this.app.use((req, res, next) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        logRequest(req, res, duration);
      });
      
      next();
    });
    
    // Compression middleware
    this.app.use(compression());
    
    // Body parsing middleware
    this.app.use(express.json({ 
      limit: '10mb',
      strict: true,
    }));
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb',
    }));
    
    // Content-Type validation
    this.app.use(validateContentType);
    
    // Rate limiting
    this.app.use(rateLimitMiddleware);
    
    // Security checks
    this.app.use(securityMiddleware);
    
    // API version header
    this.app.use((req, res, next) => {
      res.set('X-API-Version', config.apiVersion);
      next();
    });
  }
  
  /**
   * Initialize API routes
   */
  private initializeRoutes(): void {
    // Health check routes
    this.app.use('/health', healthRoutes);
    
    // API routes
    const apiRouter = express.Router();
    
    // Provision routes
    apiRouter.use('/provision/notion', provisionNotionRoutes);
    apiRouter.use('/provision/airtable', provisionAirtableRoutes);
    
    // Mount API router
    this.app.use('/api', apiRouter);
    
    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Chat Session Management Builder API',
        version: config.apiVersion,
        environment: config.environment,
        status: 'running',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          provision: {
            notion: '/api/provision/notion',
            airtable: '/api/provision/airtable',
          },
        },
      });
    });
    
    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'Chat Session Management Builder API',
        version: config.apiVersion,
        documentation: {
          health: {
            endpoint: '/health',
            description: 'Health check endpoint',
            methods: ['GET'],
          },
          provisionNotion: {
            endpoint: '/api/provision/notion',
            description: 'Create Notion database with configured properties',
            methods: ['POST'],
            rateLimit: '10 requests per 15 minutes',
          },
          provisionAirtable: {
            endpoint: '/api/provision/airtable',
            description: 'Validate Airtable base and seed sample data',
            methods: ['POST'],
            rateLimit: '10 requests per 15 minutes',
          },
        },
        rateLimit: {
          general: '60 requests per minute',
          provisioning: '10 requests per 15 minutes',
        },
        cors: {
          allowedOrigins: config.allowedOrigins,
        },
      });
    });
  }
  
  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    // 404 handler for unmatched routes
    this.app.use(notFoundHandler);
    
    // Global error handler - must be last
    this.app.use(errorHandler);
  }
  
  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Validate configuration before starting
      validateConfig();
      
      // Create logs directory if it doesn't exist
      const fs = await import('fs');
      const path = await import('path');
      const logDir = path.dirname(config.logging.file);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      // Start server
      const server = this.app.listen(config.port, () => {
        logInfo('Server started successfully', {
          port: config.port,
          environment: config.environment,
          version: config.apiVersion,
          startTime: this.startTime.toISOString(),
          processId: process.pid,
        });
        
        console.log(`
🚀 Chat Session Management Builder API Server

📍 Server running at: http://localhost:${config.port}
🌍 Environment: ${config.environment}
📦 Version: ${config.apiVersion}
⏰ Started: ${this.startTime.toISOString()}

📖 API Documentation: http://localhost:${config.port}/api
💚 Health Check: http://localhost:${config.port}/health

🔗 Endpoints:
   POST /api/provision/notion - Create Notion database
   POST /api/provision/airtable - Validate Airtable base

🛡️  Security:
   ✅ Helmet.js security headers
   ✅ CORS protection  
   ✅ Rate limiting (${config.rateLimit.maxRequests} req/min)
   ✅ Input validation & sanitization
   ✅ Request logging & monitoring

Press Ctrl+C to stop the server
        `);
      });
      
      // Graceful shutdown handling
      const gracefulShutdown = (signal: string) => {
        logInfo(`Received ${signal}, shutting down gracefully`, {
          uptime: process.uptime(),
        });
        
        server.close((err) => {
          if (err) {
            logError(err, { context: 'Server shutdown' });
            process.exit(1);
          }
          
          logInfo('Server shut down successfully');
          process.exit(0);
        });
      };
      
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));
      
      // Handle uncaught exceptions
      process.on('uncaughtException', (error: Error) => {
        logError(error, { context: 'Uncaught exception' });
        console.error('Uncaught Exception:', error);
        process.exit(1);
      });
      
      // Handle unhandled promise rejections
      process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        logError(new Error(`Unhandled Rejection: ${reason}`), { 
          context: 'Unhandled promise rejection',
          promise: promise.toString(),
        });
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
      });
      
    } catch (error: any) {
      logError(error, { context: 'Server startup' });
      console.error('Failed to start server:', error.message);
      process.exit(1);
    }
  }
}

// Create and start server
const server = new Server();

// Start server only if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default server.app;
export { server };