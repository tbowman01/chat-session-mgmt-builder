import { ChatMessage, CreateChatDTO, UpdateChatDTO, ChatFilters, PaginatedChats } from '@/common/types/chat.types';

export interface IChatService {
  findAll(filters?: ChatFilters): Promise<PaginatedChats>;
  findById(id: string): Promise<ChatMessage>;
  create(data: CreateChatDTO): Promise<ChatMessage>;
  update(id: string, data: UpdateChatDTO): Promise<ChatMessage>;
  delete(id: string): Promise<void>;
  markAsRead(id: string): Promise<ChatMessage>;
}