import { MemoryStore } from './memory-store';
import { IMemoryStore } from './store.interface';
import { Todo } from '@/common/types/chat.types';

describe('MemoryStore', () => {
  let store: IMemoryStore<Todo>;

  beforeEach(() => {
    store = new MemoryStore<Todo>();
  });

  describe('basic operations', () => {
    it('should start with size 0', () => {
      expect(store.size()).toBe(0);
    });

    it('should store and retrieve a value', () => {
      const todo: Todo = {
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.set('1', todo);
      const retrieved = store.get('1');

      expect(retrieved).toEqual(todo);
      expect(store.size()).toBe(1);
    });

    it('should return undefined for non-existent key', () => {
      expect(store.get('non-existent')).toBeUndefined();
    });

    it('should check if key exists', () => {
      const todo: Todo = {
        id: '1',
        title: 'Test Todo',
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(store.has('1')).toBe(false);
      store.set('1', todo);
      expect(store.has('1')).toBe(true);
    });

    it('should delete a value', () => {
      const todo: Todo = {
        id: '1',
        title: 'Test Todo',
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.set('1', todo);
      expect(store.has('1')).toBe(true);

      const deleted = store.delete('1');
      expect(deleted).toBe(true);
      expect(store.has('1')).toBe(false);
      expect(store.size()).toBe(0);
    });

    it('should return false when deleting non-existent key', () => {
      expect(store.delete('non-existent')).toBe(false);
    });

    it('should clear all values', () => {
      const todo1: Todo = {
        id: '1',
        title: 'Test Todo 1',
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const todo2: Todo = {
        id: '2',
        title: 'Test Todo 2',
        description: '',
        completed: false,
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.set('1', todo1);
      store.set('2', todo2);
      expect(store.size()).toBe(2);

      store.clear();
      expect(store.size()).toBe(0);
      expect(store.has('1')).toBe(false);
      expect(store.has('2')).toBe(false);
    });

    it('should update existing value', () => {
      const todo: Todo = {
        id: '1',
        title: 'Original Title',
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.set('1', todo);

      const updatedTodo: Todo = {
        ...todo,
        title: 'Updated Title',
        updatedAt: new Date()
      };

      store.set('1', updatedTodo);
      const retrieved = store.get('1');

      expect(retrieved?.title).toBe('Updated Title');
      expect(store.size()).toBe(1); // Size should not change
    });
  });

  describe('iteration methods', () => {
    beforeEach(() => {
      const todo1: Todo = {
        id: '1',
        title: 'Test Todo 1',
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const todo2: Todo = {
        id: '2',
        title: 'Test Todo 2',
        description: '',
        completed: true,
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.set('1', todo1);
      store.set('2', todo2);
    });

    it('should return all keys', () => {
      const keys = Array.from(store.keys());
      expect(keys).toHaveLength(2);
      expect(keys).toContain('1');
      expect(keys).toContain('2');
    });

    it('should return all values', () => {
      const values = Array.from(store.values());
      expect(values).toHaveLength(2);
      expect(values[0].title).toBe('Test Todo 1');
      expect(values[1].title).toBe('Test Todo 2');
    });

    it('should return all entries', () => {
      const entries = Array.from(store.entries());
      expect(entries).toHaveLength(2);
      expect(entries[0][0]).toBe('1');
      expect(entries[0][1].title).toBe('Test Todo 1');
      expect(entries[1][0]).toBe('2');
      expect(entries[1][1].title).toBe('Test Todo 2');
    });
  });

  describe('thread safety simulation', () => {
    it('should handle concurrent operations', () => {
      const operations = [];

      // Simulate concurrent writes
      for (let i = 0; i < 100; i++) {
        const todo: Todo = {
          id: `todo-${i}`,
          title: `Todo ${i}`,
          description: '',
          completed: i % 2 === 0,
          priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        operations.push(() => store.set(`todo-${i}`, todo));
      }

      // Simulate concurrent reads
      for (let i = 0; i < 50; i++) {
        operations.push(() => store.get(`todo-${i}`));
      }

      // Execute all operations
      operations.forEach(op => op());

      expect(store.size()).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string keys', () => {
      const todo: Todo = {
        id: '',
        title: 'Empty Key Todo',
        description: '',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      store.set('', todo);
      expect(store.has('')).toBe(true);
      expect(store.get('')).toEqual(todo);
    });

    it('should handle special character keys', () => {
      const specialKeys = ['!@#$%', '123', 'key with spaces', 'ñáéíóú'];
      
      specialKeys.forEach((key, index) => {
        const todo: Todo = {
          id: key,
          title: `Todo ${index}`,
          description: '',
          completed: false,
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        store.set(key, todo);
        expect(store.get(key)).toEqual(todo);
      });

      expect(store.size()).toBe(specialKeys.length);
    });

    it('should handle large numbers of items', () => {
      const itemCount = 1000;

      for (let i = 0; i < itemCount; i++) {
        const todo: Todo = {
          id: `bulk-${i}`,
          title: `Bulk Todo ${i}`,
          description: `Description for todo ${i}`,
          completed: i % 10 === 0,
          priority: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        store.set(`bulk-${i}`, todo);
      }

      expect(store.size()).toBe(itemCount);

      // Verify some random items
      const randomIndices = [0, 100, 500, 999];
      randomIndices.forEach(i => {
        const retrieved = store.get(`bulk-${i}`);
        expect(retrieved?.title).toBe(`Bulk Todo ${i}`);
        expect(retrieved?.description).toBe(`Description for todo ${i}`);
      });
    });
  });
});