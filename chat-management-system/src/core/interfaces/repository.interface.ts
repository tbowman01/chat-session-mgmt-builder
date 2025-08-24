import { ChatMessage, ChatFilters, PaginatedChats, CreateChatDTO, UpdateChatDTO } from '@/common/types/chat.types';

export interface IChatRepository {
  findAll(filters?: ChatFilters): Promise<PaginatedChats>;
  findById(id: string): Promise<ChatMessage | null>;
  create(data: CreateChatDTO): Promise<ChatMessage>;
  update(id: string, data: UpdateChatDTO): Promise<ChatMessage | null>;
  delete(id: string): Promise<boolean>;
  count(filters?: ChatFilters): Promise<number>;
}