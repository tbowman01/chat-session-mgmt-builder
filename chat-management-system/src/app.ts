import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createRoutes } from '@/api/routes';
import { errorMiddleware } from '@/api/middleware/error.middleware';
import { ChatController } from '@/api/controllers/chat.controller';
import { ChatService } from '@/core/services/chat.service';
import { ChatRepository } from '@/infrastructure/repositories/chat.repository';
import { MemoryStore } from '@/infrastructure/store/memory-store';
import { ChatMessage } from '@/common/types/chat.types';
import { AppConfig } from '@/config/app.config';

export function createApp(config: AppConfig): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS middleware
  app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Dependency injection - create instances
  const store = new MemoryStore<ChatMessage>();
  const repository = new ChatRepository(store);
  const service = new ChatService(repository);
  const controller = new ChatController(service);

  // Routes
  app.use('/api', createRoutes(controller));

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      name: 'Chat API',
      version: '1.0.0',
      environment: config.environment,
      endpoints: {
        health: '/api/health',
        chats: '/api/chats',
        docs: '/api/chats (GET, POST, PUT, DELETE)'
      }
    });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}