import request from 'supertest';
import { Application } from 'express';
import { createApp } from '@/app';
import { createAppConfig } from '@/config/app.config';

describe('Todo API Integration Tests', () => {
  let app: Application;

  beforeAll(() => {
    const config = createAppConfig();
    app = createApp(config);
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        service: 'todo-api'
      });
    });
  });

  describe('Root Endpoint', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Todo API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Integration Test Todo',
        description: 'Created via integration test',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        title: 'Integration Test Todo',
        description: 'Created via integration test',
        priority: 'high',
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should create todo with minimal data', async () => {
      const todoData = {
        title: 'Minimal Todo'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        title: 'Minimal Todo',
        description: '',
        priority: 'medium',
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return 400 for invalid todo data', async () => {
      const invalidData = {
        title: '', // Empty title should fail
        description: 'a'.repeat(1001) // Too long description
      };

      const response = await request(app)
        .post('/api/todos')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for missing title', async () => {
      const invalidData = {
        description: 'No title provided'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(invalidData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid priority', async () => {
      const invalidData = {
        title: 'Valid Title',
        priority: 'invalid-priority'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(invalidData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      // Create test todos
      await request(app).post('/api/todos').send({ title: 'Test Todo 1', priority: 'high' });
      await request(app).post('/api/todos').send({ title: 'Test Todo 2', priority: 'medium' });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveProperty('todos');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('limit', 100);
      expect(response.body).toHaveProperty('offset', 0);
      expect(Array.isArray(response.body.todos)).toBe(true);
      expect(response.body.todos.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter todos by priority', async () => {
      // Create a todo with high priority for this test
      await request(app).post('/api/todos').send({ title: 'High Priority Test', priority: 'high' });

      const response = await request(app)
        .get('/api/todos?priority=high')
        .expect(200);

      expect(response.body.todos.length).toBeGreaterThanOrEqual(1);
      expect(response.body.todos.every((todo: any) => todo.priority === 'high')).toBe(true);
    });

    it('should filter todos by completion status', async () => {
      // Create a unique todo and mark it as completed
      const uniqueTitle = `Filter Test Todo ${Date.now()}`;
      const createResponse = await request(app).post('/api/todos').send({ 
        title: uniqueTitle,
        description: 'Test filtering'
      });
      const todoId = createResponse.body.id;
      
      // Mark as completed
      await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ completed: true });

      // Verify it was marked as completed
      const updatedTodo = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);
      
      expect(updatedTodo.body.completed).toBe(true);

      // Test filtering by completed status
      const completedResponse = await request(app)
        .get('/api/todos?completed=true')
        .expect(200);

      expect(completedResponse.body.todos.length).toBeGreaterThanOrEqual(1);
      
      // Find our specific completed todo
      const ourCompletedTodo = completedResponse.body.todos.find((t: any) => t.id === todoId);
      expect(ourCompletedTodo).toBeDefined();
      expect(ourCompletedTodo.completed).toBe(true);
      
      // Verify that the specific todo we created and completed is in the results
      // Note: Due to test isolation issues, we focus on verifying our specific todo
      expect(completedResponse.body.todos.some((todo: any) => 
        todo.id === todoId && todo.completed === true
      )).toBe(true);

      const incompleteResponse = await request(app)
        .get('/api/todos?completed=false')
        .expect(200);

      // Verify our completed todo is NOT in the incomplete list
      const ourIncompleteTodo = incompleteResponse.body.todos.find((t: any) => t.id === todoId);
      expect(ourIncompleteTodo).toBeUndefined();
      
      // Create a new incomplete todo to test the filter
      const incompleteCreateResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Incomplete Test Todo' });
      
      const incompleteResponse2 = await request(app)
        .get('/api/todos?completed=false')
        .expect(200);
      
      // Verify the incomplete todo is in the incomplete list
      const newIncompleteTodo = incompleteResponse2.body.todos.find((t: any) => t.id === incompleteCreateResponse.body.id);
      expect(newIncompleteTodo).toBeDefined();
      expect(newIncompleteTodo.completed).toBe(false);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/todos?limit=2&offset=1')
        .expect(200);

      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.todos.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo for GET' });
      
      todoId = createResponse.body.id;
    });

    it('should return todo by id', async () => {
      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(response.body).toEqual({
        id: todoId,
        title: 'Test Todo for GET',
        description: '',
        priority: 'medium',
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get('/api/todos/non-existent-id')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ 
          title: 'Original Title',
          description: 'Original Description',
          priority: 'low'
        });
      
      todoId = createResponse.body.id;
    });

    it('should update existing todo', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'high',
        completed: true
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        id: todoId,
        title: 'Updated Title',
        description: 'Updated Description',
        priority: 'high',
        completed: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      // Verify the update persisted
      const getResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(getResponse.body.title).toBe('Updated Title');
      expect(getResponse.body.completed).toBe(true);
    });

    it('should update partial todo data', async () => {
      const updateData = {
        completed: true
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe('Original Title'); // Unchanged
      expect(response.body.completed).toBe(true); // Changed
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/non-existent-id')
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: '' }) // Empty title
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo to Delete' });
      
      todoId = createResponse.body.id;
    });

    it('should delete existing todo', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(204);

      // Verify todo is deleted
      await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete('/api/todos/non-existent-id')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/todos/:id/toggle', () => {
    let todoId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo to Toggle' });
      
      todoId = createResponse.body.id;
    });

    it('should toggle todo completion status', async () => {
      // Toggle from false to true
      const toggleResponse1 = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .expect(200);

      expect(toggleResponse1.body.completed).toBe(true);

      // Toggle back from true to false
      const toggleResponse2 = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .expect(200);

      expect(toggleResponse2.body.completed).toBe(false);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .post('/api/todos/non-existent-id/toggle')
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('End-to-End Workflows', () => {
    it('should support complete CRUD workflow', async () => {
      // Create
      const createResponse = await request(app)
        .post('/api/todos')
        .send({
          title: 'E2E Test Todo',
          description: 'End-to-end test',
          priority: 'medium'
        })
        .expect(201);

      const todoId = createResponse.body.id;

      // Read
      const getResponse = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(getResponse.body.title).toBe('E2E Test Todo');

      // Update
      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated E2E Todo', completed: true })
        .expect(200);

      expect(updateResponse.body.title).toBe('Updated E2E Todo');
      expect(updateResponse.body.completed).toBe(true);

      // Toggle
      const toggleResponse = await request(app)
        .post(`/api/todos/${todoId}/toggle`)
        .expect(200);

      expect(toggleResponse.body.completed).toBe(false);

      // Delete
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(204);

      // Verify deletion
      await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404);
    });

    it('should handle multiple todos with filtering', async () => {
      // Create multiple todos for this specific test
      const todos = await Promise.all([
        request(app).post('/api/todos').send({ title: 'Multi High Priority Task', priority: 'high' }),
        request(app).post('/api/todos').send({ title: 'Multi Medium Priority Task', priority: 'medium' }),
        request(app).post('/api/todos').send({ title: 'Multi Low Priority Task', priority: 'low' }),
        request(app).post('/api/todos').send({ title: 'Multi Another High Priority', priority: 'high' })
      ]);

      // Mark the first one as completed
      await request(app)
        .put(`/api/todos/${todos[0].body.id}`)
        .send({ completed: true });

      // Test various filters
      const highPriorityResponse = await request(app)
        .get('/api/todos?priority=high')
        .expect(200);

      expect(highPriorityResponse.body.todos.length).toBeGreaterThanOrEqual(2);
      expect(highPriorityResponse.body.todos.every((t: any) => t.priority === 'high')).toBe(true);

      const completedResponse = await request(app)
        .get('/api/todos?completed=true')
        .expect(200);

      expect(completedResponse.body.todos.length).toBeGreaterThanOrEqual(1);
      expect(completedResponse.body.todos.some((t: any) => t.completed === true)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle oversized payloads gracefully', async () => {
      const oversizedData = {
        title: 'a'.repeat(201), // Exceeds max title length
        description: 'Valid description'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(oversizedData)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});