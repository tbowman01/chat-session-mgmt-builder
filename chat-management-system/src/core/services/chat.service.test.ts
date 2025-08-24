import { TodoService } from './todo.service';
import { ITodoService } from '@/core/interfaces/service.interface';
import { ITodoRepository } from '@/core/interfaces/repository.interface';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '@/common/types/chat.types';
import { NotFoundError } from '@/common/errors/not-found.error';
import { ValidationError } from '@/common/errors/validation.error';

describe('TodoService', () => {
  let service: ITodoService;
  let mockRepository: jest.Mocked<ITodoRepository>;

  const mockTodo: Todo = {
    id: 'test-id',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    priority: 'medium',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  };

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    };

    service = new TodoService(mockRepository);
  });

  describe('findAll', () => {
    it('should return paginated todos from repository', async () => {
      const expectedResult = {
        todos: [mockTodo],
        total: 1,
        limit: 100,
        offset: 0
      };

      mockRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should pass filters to repository', async () => {
      const filters = { completed: true, priority: 'high' as const, limit: 10, offset: 5 };
      const expectedResult = {
        todos: [],
        total: 0,
        limit: 10,
        offset: 5
      };

      mockRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll(filters);

      expect(result).toEqual(expectedResult);
      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
    });

    it('should handle repository errors', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Repository error'));

      await expect(service.findAll()).rejects.toThrow('Repository error');
    });
  });

  describe('findById', () => {
    it('should return todo when found', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);

      const result = await service.findById('test-id');

      expect(result).toEqual(mockTodo);
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundError when todo not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(NotFoundError);
      await expect(service.findById('non-existent')).rejects.toThrow('Todo not found');
    });

    it('should handle repository errors', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Repository error'));

      await expect(service.findById('test-id')).rejects.toThrow('Repository error');
    });
  });

  describe('create', () => {
    it('should create and return new todo', async () => {
      const createData: CreateTodoDTO = {
        title: 'New Todo',
        description: 'New Description',
        priority: 'high'
      };

      mockRepository.create.mockResolvedValue(mockTodo);

      const result = await service.create(createData);

      expect(result).toEqual(mockTodo);
      expect(mockRepository.create).toHaveBeenCalledWith(createData);
    });

    it('should handle validation errors from repository', async () => {
      const createData: CreateTodoDTO = {
        title: ''
      };

      mockRepository.create.mockRejectedValue(new ValidationError('Title is required'));

      await expect(service.create(createData)).rejects.toThrow(ValidationError);
      await expect(service.create(createData)).rejects.toThrow('Title is required');
    });

    it('should handle repository errors', async () => {
      const createData: CreateTodoDTO = {
        title: 'New Todo'
      };

      mockRepository.create.mockRejectedValue(new Error('Repository error'));

      await expect(service.create(createData)).rejects.toThrow('Repository error');
    });
  });

  describe('update', () => {
    it('should update and return todo when found', async () => {
      const updateData: UpdateTodoDTO = {
        title: 'Updated Title',
        completed: true
      };

      const updatedTodo: Todo = {
        ...mockTodo,
        title: 'Updated Title',
        completed: true,
        updatedAt: new Date('2024-01-02T00:00:00.000Z')
      };

      mockRepository.update.mockResolvedValue(updatedTodo);

      const result = await service.update('test-id', updateData);

      expect(result).toEqual(updatedTodo);
      expect(mockRepository.update).toHaveBeenCalledWith('test-id', updateData);
    });

    it('should throw NotFoundError when todo not found', async () => {
      const updateData: UpdateTodoDTO = {
        title: 'Updated Title'
      };

      mockRepository.update.mockResolvedValue(null);

      await expect(service.update('non-existent', updateData)).rejects.toThrow(NotFoundError);
      await expect(service.update('non-existent', updateData)).rejects.toThrow('Todo not found');
    });

    it('should handle validation errors from repository', async () => {
      const updateData: UpdateTodoDTO = {
        title: ''
      };

      mockRepository.update.mockRejectedValue(new ValidationError('Title is required'));

      await expect(service.update('test-id', updateData)).rejects.toThrow(ValidationError);
      await expect(service.update('test-id', updateData)).rejects.toThrow('Title is required');
    });

    it('should handle repository errors', async () => {
      const updateData: UpdateTodoDTO = {
        title: 'Updated Title'
      };

      mockRepository.update.mockRejectedValue(new Error('Repository error'));

      await expect(service.update('test-id', updateData)).rejects.toThrow('Repository error');
    });
  });

  describe('delete', () => {
    it('should delete todo when found', async () => {
      mockRepository.delete.mockResolvedValue(true);

      await expect(service.delete('test-id')).resolves.toBeUndefined();
      expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundError when todo not found', async () => {
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundError);
      await expect(service.delete('non-existent')).rejects.toThrow('Todo not found');
    });

    it('should handle repository errors', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Repository error'));

      await expect(service.delete('test-id')).rejects.toThrow('Repository error');
    });
  });

  describe('toggleComplete', () => {
    it('should find todo and toggle completion status', async () => {
      const incompleteTodo: Todo = { ...mockTodo, completed: false };
      const completedTodo: Todo = { ...mockTodo, completed: true, updatedAt: new Date('2024-01-02T00:00:00.000Z') };

      mockRepository.findById.mockResolvedValue(incompleteTodo);
      mockRepository.update.mockResolvedValue(completedTodo);

      const result = await service.toggleComplete('test-id');

      expect(result).toEqual(completedTodo);
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.update).toHaveBeenCalledWith('test-id', { completed: true });
    });

    it('should toggle from completed to incomplete', async () => {
      const completedTodo: Todo = { ...mockTodo, completed: true };
      const incompleteTodo: Todo = { ...mockTodo, completed: false, updatedAt: new Date('2024-01-02T00:00:00.000Z') };

      mockRepository.findById.mockResolvedValue(completedTodo);
      mockRepository.update.mockResolvedValue(incompleteTodo);

      const result = await service.toggleComplete('test-id');

      expect(result).toEqual(incompleteTodo);
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.update).toHaveBeenCalledWith('test-id', { completed: false });
    });

    it('should throw NotFoundError when todo not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.toggleComplete('non-existent')).rejects.toThrow(NotFoundError);
      await expect(service.toggleComplete('non-existent')).rejects.toThrow('Todo not found');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors on findById', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Repository error'));

      await expect(service.toggleComplete('test-id')).rejects.toThrow('Repository error');
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors on update', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      mockRepository.update.mockRejectedValue(new Error('Update error'));

      await expect(service.toggleComplete('test-id')).rejects.toThrow('Update error');
    });

    it('should throw error if update returns null unexpectedly', async () => {
      mockRepository.findById.mockResolvedValue(mockTodo);
      mockRepository.update.mockResolvedValue(null);

      await expect(service.toggleComplete('test-id')).rejects.toThrow(NotFoundError);
      await expect(service.toggleComplete('test-id')).rejects.toThrow('Failed to toggle todo completion');
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle empty strings gracefully', async () => {
      await expect(service.findById('')).rejects.toThrow(NotFoundError);
    });

    it('should handle null/undefined parameters', async () => {
      // @ts-expect-error Testing runtime behavior
      await expect(service.findById(null)).rejects.toThrow();
      // @ts-expect-error Testing runtime behavior
      await expect(service.findById(undefined)).rejects.toThrow();
    });

    it('should propagate validation errors correctly', async () => {
      const createData: CreateTodoDTO = { title: 'a'.repeat(201) };
      
      mockRepository.create.mockRejectedValue(
        new ValidationError('Title must not exceed 200 characters')
      );

      await expect(service.create(createData)).rejects.toThrow(ValidationError);
    });
  });
});