import { ChatMessage, CreateChatDTO, UpdateChatDTO, Priority } from '@/common/types/chat.types';
import { ValidationError } from '@/common/errors/validation.error';
import { IdGenerator } from '@/common/utils/id-generator';

export class ChatModel {
  private static readonly VALID_PRIORITIES: Priority[] = ['low', 'medium', 'high'];
  private static readonly MAX_CONTENT_LENGTH = 2000;
  private static readonly MAX_SESSION_ID_LENGTH = 100;

  static create(data: CreateChatDTO): ChatMessage {
    this.validateCreateData(data);

    return {
      id: IdGenerator.generate(),
      content: data.content,
      sessionId: data.sessionId,
      userId: data.userId,
      messageType: data.messageType || 'user',
      priority: data.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static update(chat: ChatMessage, updates: UpdateChatDTO): ChatMessage {
    this.validateUpdateData(updates);

    let hasChanges = false;
    const updatedChat = { ...chat };

    if (updates.content !== undefined) {
      updatedChat.content = updates.content;
      hasChanges = true;
    }

    if (updates.sessionId !== undefined) {
      updatedChat.sessionId = updates.sessionId;
      hasChanges = true;
    }

    if (updates.userId !== undefined) {
      updatedChat.userId = updates.userId;
      hasChanges = true;
    }

    if (updates.messageType !== undefined) {
      updatedChat.messageType = updates.messageType;
      hasChanges = true;
    }

    if (updates.priority !== undefined) {
      updatedChat.priority = updates.priority;
      hasChanges = true;
    }

    if (hasChanges) {
      updatedChat.updatedAt = new Date();
    }

    return updatedChat;
  }

  static markAsRead(chat: ChatMessage): ChatMessage {
    return {
      ...chat,
      updatedAt: new Date(),
    };
  }

  private static validateCreateData(data: CreateChatDTO): void {
    if (!data.content || data.content.trim() === '') {
      throw new ValidationError('Content is required');
    }

    if (data.content.length > this.MAX_CONTENT_LENGTH) {
      throw new ValidationError('Content must not exceed 2000 characters');
    }

    if (!data.sessionId || data.sessionId.trim() === '') {
      throw new ValidationError('Session ID is required');
    }

    if (data.sessionId.length > this.MAX_SESSION_ID_LENGTH) {
      throw new ValidationError('Session ID must not exceed 100 characters');
    }

    if (data.messageType && !['user', 'assistant', 'system'].includes(data.messageType)) {
      throw new ValidationError('Message type must be one of: user, assistant, system');
    }

    if (data.priority && !this.VALID_PRIORITIES.includes(data.priority)) {
      throw new ValidationError('Priority must be one of: low, medium, high');
    }
  }

  private static validateUpdateData(data: UpdateChatDTO): void {
    if (data.content !== undefined) {
      if (!data.content || data.content.trim() === '') {
        throw new ValidationError('Content is required');
      }

      if (data.content.length > this.MAX_CONTENT_LENGTH) {
        throw new ValidationError('Content must not exceed 2000 characters');
      }
    }

    if (data.sessionId !== undefined) {
      if (!data.sessionId || data.sessionId.trim() === '') {
        throw new ValidationError('Session ID is required');
      }

      if (data.sessionId.length > this.MAX_SESSION_ID_LENGTH) {
        throw new ValidationError('Session ID must not exceed 100 characters');
      }
    }

    if (data.messageType !== undefined && !['user', 'assistant', 'system'].includes(data.messageType)) {
      throw new ValidationError('Message type must be one of: user, assistant, system');
    }

    if (data.priority !== undefined && !this.VALID_PRIORITIES.includes(data.priority)) {
      throw new ValidationError('Priority must be one of: low, medium, high');
    }
  }
}