import { IChatService } from '@/core/interfaces/service.interface';
import { IChatRepository } from '@/core/interfaces/repository.interface';
import { ChatMessage, CreateChatDTO, UpdateChatDTO, ChatFilters, PaginatedChats } from '@/common/types/chat.types';
import { NotFoundError } from '@/common/errors/not-found.error';

export class ChatService implements IChatService {
  constructor(private readonly repository: IChatRepository) {}

  async findAll(filters?: ChatFilters): Promise<PaginatedChats> {
    return this.repository.findAll(filters);
  }

  async findById(id: string): Promise<ChatMessage> {
    if (!id || id === null || id === undefined) {
      throw new NotFoundError('Chat message not found');
    }

    const chat = await this.repository.findById(id);
    
    if (!chat) {
      throw new NotFoundError('Chat message not found');
    }

    return chat;
  }

  async create(data: CreateChatDTO): Promise<ChatMessage> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateChatDTO): Promise<ChatMessage> {
    const updatedChat = await this.repository.update(id, data);
    
    if (!updatedChat) {
      throw new NotFoundError('Chat message not found');
    }

    return updatedChat;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    
    if (!deleted) {
      throw new NotFoundError('Chat message not found');
    }
  }

  async markAsRead(id: string): Promise<ChatMessage> {
    const existingChat = await this.repository.findById(id);
    
    if (!existingChat) {
      throw new NotFoundError('Chat message not found');
    }

    const updatedChat = await this.repository.update(id, {});

    if (!updatedChat) {
      throw new NotFoundError('Failed to mark chat message as read');
    }

    return updatedChat;
  }
}