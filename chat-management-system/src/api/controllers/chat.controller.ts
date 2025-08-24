import { Request, Response, NextFunction } from 'express';
import { IChatService } from '@/core/interfaces/service.interface';
import { CreateChatDTO, UpdateChatDTO, ChatFilters } from '@/common/types/chat.types';

export class ChatController {
  constructor(private readonly chatService: IChatService) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ChatFilters = {};
      
      if (req.query.sessionId) {
        filters.sessionId = req.query.sessionId as string;
      }
      
      if (req.query.userId) {
        filters.userId = req.query.userId as string;
      }
      
      if (req.query.messageType) {
        filters.messageType = req.query.messageType as 'user' | 'assistant' | 'system';
      }
      
      if (req.query.priority) {
        filters.priority = req.query.priority as 'low' | 'medium' | 'high';
      }
      
      if (req.query.limit) {
        const limitValue = parseInt(req.query.limit as string, 10);
        if (!isNaN(limitValue) && limitValue > 0) {
          filters.limit = limitValue;
        }
      }
      
      if (req.query.offset) {
        const offsetValue = parseInt(req.query.offset as string, 10);
        if (!isNaN(offsetValue) && offsetValue >= 0) {
          filters.offset = offsetValue;
        }
      }

      const result = await this.chatService.findAll(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const chat = await this.chatService.findById(id);
      res.status(200).json(chat);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createData = req.body as CreateChatDTO;
      const newChat = await this.chatService.create(createData);
      res.status(201).json(newChat);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body as UpdateChatDTO;
      const updatedChat = await this.chatService.update(id, updateData);
      res.status(200).json(updatedChat);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.chatService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const markedChat = await this.chatService.markAsRead(id);
      res.status(200).json(markedChat);
    } catch (error) {
      next(error);
    }
  }
}