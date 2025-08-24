import { Router } from 'express';
import { createChatRoutes } from './chat.routes';
import { ChatController } from '@/api/controllers/chat.controller';

export function createRoutes(chatController: ChatController): Router {
  const router = Router();

  // Mount chat routes
  router.use('/chats', createChatRoutes(chatController));

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'chat-api'
    });
  });

  return router;
}