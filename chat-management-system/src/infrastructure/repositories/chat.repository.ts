import { IChatRepository } from '@/core/interfaces/repository.interface';
import { IMemoryStore } from '@/infrastructure/store/store.interface';
import { ChatMessage, CreateChatDTO, UpdateChatDTO, ChatFilters, PaginatedChats } from '@/common/types/chat.types';
import { ChatModel } from '@/core/models/chat.model';

export class ChatRepository implements IChatRepository {
  constructor(private readonly store: IMemoryStore<ChatMessage>) {}

  async create(data: CreateChatDTO): Promise<ChatMessage> {
    const chat = ChatModel.create(data);
    this.store.set(chat.id, chat);
    return chat;
  }

  async findById(id: string): Promise<ChatMessage | null> {
    return this.store.get(id) || null;
  }

  async findAll(filters: ChatFilters = {}): Promise<PaginatedChats> {
    const allChats = Array.from(this.store.values());
    
    // Apply filters
    const filteredChats = allChats.filter(chat => {
      if (filters.sessionId && chat.sessionId !== filters.sessionId) {
        return false;
      }
      
      if (filters.userId && chat.userId !== filters.userId) {
        return false;
      }
      
      if (filters.messageType && chat.messageType !== filters.messageType) {
        return false;
      }
      
      if (filters.priority && chat.priority !== filters.priority) {
        return false;
      }
      
      return true;
    });

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit !== undefined ? filters.limit : 100;
    
    const paginatedChats = filteredChats.slice(offset, offset + limit);

    return {
      chats: paginatedChats,
      total: filteredChats.length,
      limit,
      offset
    };
  }

  async update(id: string, data: UpdateChatDTO): Promise<ChatMessage | null> {
    const existingChat = this.store.get(id);
    
    if (!existingChat) {
      return null;
    }

    const updatedChat = ChatModel.update(existingChat, data);
    this.store.set(id, updatedChat);
    
    return updatedChat;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async count(filters: ChatFilters = {}): Promise<number> {
    const allChats = Array.from(this.store.values());
    
    return allChats.filter(chat => {
      if (filters.sessionId && chat.sessionId !== filters.sessionId) {
        return false;
      }
      
      if (filters.userId && chat.userId !== filters.userId) {
        return false;
      }
      
      if (filters.messageType && chat.messageType !== filters.messageType) {
        return false;
      }
      
      if (filters.priority && chat.priority !== filters.priority) {
        return false;
      }
      
      return true;
    }).length;
  }
}