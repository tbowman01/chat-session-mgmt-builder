import { Router } from 'express';
import { ChatController } from '@/api/controllers/chat.controller';
import { validateBody, validateQuery, validateParams } from '@/api/middleware/validation.middleware';
import { 
  createChatSchema, 
  updateChatSchema, 
  chatFiltersSchema, 
  chatIdSchema 
} from '@/api/validators/chat.validator';

export function createChatRoutes(controller: ChatController): Router {
  const router = Router();

  // GET /chats - Get all chats with filtering and pagination
  router.get('/', 
    validateQuery(chatFiltersSchema),
    controller.getAll.bind(controller)
  );

  // GET /chats/:id - Get chat by id
  router.get('/:id', 
    validateParams(chatIdSchema),
    controller.getById.bind(controller)
  );

  // POST /chats - Create new chat message
  router.post('/', 
    validateBody(createChatSchema),
    controller.create.bind(controller)
  );

  // PUT /chats/:id - Update existing chat message
  router.put('/:id', 
    validateParams(chatIdSchema),
    validateBody(updateChatSchema),
    controller.update.bind(controller)
  );

  // DELETE /chats/:id - Delete chat message
  router.delete('/:id', 
    validateParams(chatIdSchema),
    controller.delete.bind(controller)
  );

  // POST /chats/:id/mark-read - Mark chat message as read
  router.post('/:id/mark-read', 
    validateParams(chatIdSchema),
    controller.markAsRead.bind(controller)
  );

  return router;
}