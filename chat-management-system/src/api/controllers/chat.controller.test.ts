import { Request, Response, NextFunction } from 'express';
import { TodoController } from './todo.controller';
import { ITodoService } from '@/core/interfaces/service.interface';
import { Todo, PaginatedTodos } from '@/common/types/chat.types';
import { NotFoundError } from '@/common/errors/not-found.error';
import { ValidationError } from '@/common/errors/validation.error';

describe('TodoController', () => {
  let controller: TodoController;
  let mockService: jest.Mocked<ITodoService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

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
    mockService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      toggleComplete: jest.fn()
    };

    controller = new TodoController(mockService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('getAll', () => {
    it('should return all todos with default pagination', async () => {
      const mockResult: PaginatedTodos = {
        todos: [mockTodo],
        total: 1,
        limit: 100,
        offset: 0
      };

      mockRequest = {
        query: {}
      };

      mockService.findAll.mockResolvedValue(mockResult);

      await controller.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.findAll).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return filtered todos', async () => {
      const filters = {
        completed: 'true',
        priority: 'high',
        limit: '10',
        offset: '5'
      };

      mockRequest = {
        query: filters
      };

      const mockResult: PaginatedTodos = {
        todos: [],
        total: 0,
        limit: 10,
        offset: 5
      };

      mockService.findAll.mockResolvedValue(mockResult);

      await controller.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      const expectedFilters = {
        completed: true,
        priority: 'high',
        limit: 10,
        offset: 5
      };

      expect(mockService.findAll).toHaveBeenCalledWith(expectedFilters);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle service errors', async () => {
      mockRequest = { query: {} };
      const error = new Error('Service error');
      
      mockService.findAll.mockRejectedValue(error);

      await controller.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return todo by id', async () => {
      mockRequest = {
        params: { id: 'test-id' }
      };

      mockService.findById.mockResolvedValue(mockTodo);

      await controller.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.findById).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle NotFoundError', async () => {
      mockRequest = {
        params: { id: 'non-existent' }
      };

      const error = new NotFoundError('Todo not found');
      mockService.findById.mockRejectedValue(error);

      await controller.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockRequest = {
        params: { id: 'test-id' }
      };

      const error = new Error('Service error');
      mockService.findById.mockRejectedValue(error);

      await controller.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('create', () => {
    it('should create new todo', async () => {
      const createData = {
        title: 'New Todo',
        description: 'New Description',
        priority: 'high'
      };

      mockRequest = {
        body: createData
      };

      mockService.create.mockResolvedValue(mockTodo);

      await controller.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.create).toHaveBeenCalledWith(createData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle ValidationError', async () => {
      mockRequest = {
        body: { title: '' }
      };

      const error = new ValidationError('Title is required');
      mockService.create.mockRejectedValue(error);

      await controller.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockRequest = {
        body: { title: 'New Todo' }
      };

      const error = new Error('Service error');
      mockService.create.mockRejectedValue(error);

      await controller.create(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('update', () => {
    it('should update existing todo', async () => {
      const updateData = {
        title: 'Updated Title',
        completed: true
      };

      mockRequest = {
        params: { id: 'test-id' },
        body: updateData
      };

      const updatedTodo = { ...mockTodo, title: 'Updated Title', completed: true };
      mockService.update.mockResolvedValue(updatedTodo);

      await controller.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.update).toHaveBeenCalledWith('test-id', updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedTodo);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle NotFoundError', async () => {
      mockRequest = {
        params: { id: 'non-existent' },
        body: { title: 'Updated Title' }
      };

      const error = new NotFoundError('Todo not found');
      mockService.update.mockRejectedValue(error);

      await controller.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle ValidationError', async () => {
      mockRequest = {
        params: { id: 'test-id' },
        body: { title: '' }
      };

      const error = new ValidationError('Title cannot be empty');
      mockService.update.mockRejectedValue(error);

      await controller.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle service errors', async () => {
      mockRequest = {
        params: { id: 'test-id' },
        body: { title: 'Updated Title' }
      };

      const error = new Error('Service error');
      mockService.update.mockRejectedValue(error);

      await controller.update(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('delete', () => {
    it('should delete existing todo', async () => {
      mockRequest = {
        params: { id: 'test-id' }
      };

      mockService.delete.mockResolvedValue();

      await controller.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.delete).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle NotFoundError', async () => {
      mockRequest = {
        params: { id: 'non-existent' }
      };

      const error = new NotFoundError('Todo not found');
      mockService.delete.mockRejectedValue(error);

      await controller.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockRequest = {
        params: { id: 'test-id' }
      };

      const error = new Error('Service error');
      mockService.delete.mockRejectedValue(error);

      await controller.delete(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('toggle', () => {
    it('should toggle todo completion status', async () => {
      mockRequest = {
        params: { id: 'test-id' }
      };

      const toggledTodo = { ...mockTodo, completed: true };
      mockService.toggleComplete.mockResolvedValue(toggledTodo);

      await controller.toggle(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockService.toggleComplete).toHaveBeenCalledWith('test-id');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(toggledTodo);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle NotFoundError', async () => {
      mockRequest = {
        params: { id: 'non-existent' }
      };

      const error = new NotFoundError('Todo not found');
      mockService.toggleComplete.mockRejectedValue(error);

      await controller.toggle(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockRequest = {
        params: { id: 'test-id' }
      };

      const error = new Error('Service error');
      mockService.toggleComplete.mockRejectedValue(error);

      await controller.toggle(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('error handling', () => {
    it('should handle async errors properly', async () => {
      mockRequest = { query: {} };
      const error = new Error('Async error');
      
      mockService.findAll.mockRejectedValue(error);

      await controller.getAll(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should not call response methods when error occurs', async () => {
      mockRequest = { params: { id: 'test-id' } };
      const error = new NotFoundError('Todo not found');
      
      mockService.findById.mockRejectedValue(error);

      await controller.getById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});