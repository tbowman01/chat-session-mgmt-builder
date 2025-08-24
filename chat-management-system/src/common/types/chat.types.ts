export type Priority = 'low' | 'medium' | 'high';

export interface ChatMessage {
  id: string;
  content: string;
  sessionId: string;
  userId: string | undefined;
  messageType: 'user' | 'assistant' | 'system';
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatDTO {
  content: string;
  sessionId: string;
  userId?: string;
  messageType?: 'user' | 'assistant' | 'system';
  priority?: Priority;
}

export interface UpdateChatDTO {
  content?: string;
  sessionId?: string;
  userId?: string;
  messageType?: 'user' | 'assistant' | 'system';
  priority?: Priority;
}

export interface ChatFilters {
  sessionId?: string;
  userId?: string;
  messageType?: 'user' | 'assistant' | 'system';
  priority?: Priority;
  limit?: number;
  offset?: number;
}

export interface PaginatedChats {
  chats: ChatMessage[];
  total: number;
  limit: number;
  offset: number;
}