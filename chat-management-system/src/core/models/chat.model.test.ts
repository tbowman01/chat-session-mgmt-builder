import { ChatModel } from './chat.model';
import { CreateChatDTO, Priority } from '@/common/types/chat.types';
import { ValidationError } from '@/common/errors/validation.error';

describe('ChatModel', () => {
  describe('create', () => {
    it('should create a chat message with required fields only', () => {
      const createDTO: CreateChatDTO = {
        content: 'Test chat message',
        sessionId: 'session-123'
      };

      const chat = ChatModel.create(createDTO);

      expect(chat.id).toBeValidUUID();
      expect(chat.content).toBe('Test chat message');
      expect(chat.sessionId).toBe('session-123');
      expect(chat.messageType).toBe('user');
      expect(chat.priority).toBe('medium');
      expect(chat.createdAt).toBeInstanceOf(Date);
      expect(chat.updatedAt).toBeInstanceOf(Date);
      expect(chat.createdAt.getTime()).toBe(chat.updatedAt.getTime());
    });

    it('should create a chat message with all fields', () => {
      const createDTO: CreateChatDTO = {
        content: 'Test chat message',
        sessionId: 'session-123',
        userId: 'user-456',
        messageType: 'assistant',
        priority: 'high' as Priority
      };

      const chat = ChatModel.create(createDTO);

      expect(chat.content).toBe('Test chat message');
      expect(chat.sessionId).toBe('session-123');
      expect(chat.userId).toBe('user-456');
      expect(chat.messageType).toBe('assistant');
      expect(chat.priority).toBe('high');
    });

    it('should throw ValidationError if content is empty', () => {
      const createDTO: CreateChatDTO = {
        content: '',
        sessionId: 'session-123'
      };

      expect(() => ChatModel.create(createDTO)).toThrow(ValidationError);
      expect(() => ChatModel.create(createDTO)).toThrow('Content is required');
    });

    it('should throw ValidationError if content exceeds 2000 characters', () => {
      const createDTO: CreateChatDTO = {
        content: 'a'.repeat(2001),
        sessionId: 'session-123'
      };

      expect(() => ChatModel.create(createDTO)).toThrow(ValidationError);
      expect(() => ChatModel.create(createDTO)).toThrow('Content must not exceed 2000 characters');
    });

    it('should throw ValidationError if sessionId is empty', () => {
      const createDTO: CreateChatDTO = {
        content: 'Test message',
        sessionId: ''
      };

      expect(() => ChatModel.create(createDTO)).toThrow(ValidationError);
      expect(() => ChatModel.create(createDTO)).toThrow('Session ID is required');
    });

    it('should throw ValidationError for invalid message type', () => {
      const createDTO: CreateChatDTO = {
        content: 'Test message',
        sessionId: 'session-123',
        messageType: 'invalid' as any
      };

      expect(() => ChatModel.create(createDTO)).toThrow(ValidationError);
      expect(() => ChatModel.create(createDTO)).toThrow('Message type must be one of: user, assistant, system');
    });

    it('should throw ValidationError for invalid priority', () => {
      const createDTO: CreateChatDTO = {
        content: 'Test message',
        sessionId: 'session-123',
        priority: 'invalid' as any
      };

      expect(() => ChatModel.create(createDTO)).toThrow(ValidationError);
      expect(() => ChatModel.create(createDTO)).toThrow('Priority must be one of: low, medium, high');
    });
  });

  describe('update', () => {
    let existingChat: any;

    beforeEach(() => {
      existingChat = {
        id: '123',
        content: 'Original content',
        sessionId: 'session-123',
        messageType: 'user',
        priority: 'medium',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };
    });

    it('should update content', () => {
      const updates = { content: 'Updated content' };
      const updated = ChatModel.update(existingChat, updates);

      expect(updated.content).toBe('Updated content');
      expect(updated.updatedAt).not.toBe(existingChat.updatedAt);
    });

    it('should update messageType', () => {
      const updates = { messageType: 'assistant' as const };
      const updated = ChatModel.update(existingChat, updates);

      expect(updated.messageType).toBe('assistant');
      expect(updated.updatedAt).not.toBe(existingChat.updatedAt);
    });

    it('should not update if no changes provided', () => {
      const updates = {};
      const updated = ChatModel.update(existingChat, updates);

      expect(updated.updatedAt).toBe(existingChat.updatedAt);
    });

    it('should throw ValidationError for invalid update data', () => {
      const updates = { content: '' };

      expect(() => ChatModel.update(existingChat, updates)).toThrow(ValidationError);
      expect(() => ChatModel.update(existingChat, updates)).toThrow('Content is required');
    });
  });

  describe('markAsRead', () => {
    it('should mark chat message as read by updating timestamp', () => {
      const chat = {
        id: '123',
        content: 'Test message',
        sessionId: 'session-123',
        messageType: 'user',
        priority: 'medium',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      const marked = ChatModel.markAsRead(chat);

      expect(marked.updatedAt).not.toBe(chat.updatedAt);
      expect(marked.updatedAt).toBeInstanceOf(Date);
    });
  });
});

// Custom matcher for UUID validation
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);
    
    return {
      message: () => pass
        ? `expected ${received} not to be a valid UUID`
        : `expected ${received} to be a valid UUID`,
      pass
    };
  }
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
    }
  }
}