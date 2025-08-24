import { TodoRepository } from './todo.repository';
import { MemoryStore } from '@/infrastructure/store/memory-store';
import { ITodoRepository } from '@/core/interfaces/repository.interface';
import { IMemoryStore } from '@/infrastructure/store/store.interface';
import { Todo, CreateTodoDTO } from '@/common/types/chat.types';

describe('TodoRepository', () => {
  let repository: ITodoRepository;
  let store: IMemoryStore<Todo>;

  beforeEach(() => {
    store = new MemoryStore<Todo>();
    repository = new TodoRepository(store);
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createData: CreateTodoDTO = {
        title: 'Test Todo',
        description: 'Test Description',
        priority: 'high'
      };

      const result = await repository.create(createData);

      expect(result.title).toBe('Test Todo');
      expect(result.description).toBe('Test Description');
      expect(result.priority).toBe('high');
      expect(result.completed).toBe(false);
      expect(result.id).toBeValidUUID();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create todo with minimal data', async () => {
      const createData: CreateTodoDTO = {
        title: 'Minimal Todo'
      };

      const result = await repository.create(createData);

      expect(result.title).toBe('Minimal Todo');
      expect(result.description).toBe('');
      expect(result.priority).toBe('medium');
      expect(result.completed).toBe(false);
    });

    it('should store created todo in the store', async () => {
      const createData: CreateTodoDTO = {
        title: 'Test Todo'
      };

      const result = await repository.create(createData);

      expect(store.has(result.id)).toBe(true);
      expect(store.get(result.id)).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should find todo by id', async () => {
      const createData: CreateTodoDTO = {
        title: 'Findable Todo'
      };

      const created = await repository.create(createData);
      const found = await repository.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should return null for non-existent id', async () => {
      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create test data
      await repository.create({
        title: 'Todo 1',
        description: 'First todo',
        priority: 'high'
      });

      await repository.create({
        title: 'Todo 2',
        description: 'Second todo',
        priority: 'medium'
      });

      await repository.create({
        title: 'Todo 3',
        description: 'Third todo',
        priority: 'low'
      });

      // Create a completed todo
      const completedTodo = await repository.create({
        title: 'Completed Todo',
        priority: 'medium'
      });

      await repository.update(completedTodo.id, { completed: true });
    });

    it('should return all todos without filters', async () => {
      const result = await repository.findAll();

      expect(result.todos).toHaveLength(4);
      expect(result.total).toBe(4);
      expect(result.limit).toBe(100); // default limit
      expect(result.offset).toBe(0);
    });

    it('should filter by completion status', async () => {
      const completedResult = await repository.findAll({ completed: true });
      expect(completedResult.todos).toHaveLength(1);
      expect(completedResult.todos[0].title).toBe('Completed Todo');

      const incompleteResult = await repository.findAll({ completed: false });
      expect(incompleteResult.todos).toHaveLength(3);
    });

    it('should filter by priority', async () => {
      const highPriorityResult = await repository.findAll({ priority: 'high' });
      expect(highPriorityResult.todos).toHaveLength(1);
      expect(highPriorityResult.todos[0].title).toBe('Todo 1');

      const mediumPriorityResult = await repository.findAll({ priority: 'medium' });
      expect(mediumPriorityResult.todos).toHaveLength(2); // Todo 2 and Completed Todo
    });

    it('should apply pagination', async () => {
      const firstPage = await repository.findAll({ limit: 2, offset: 0 });
      expect(firstPage.todos).toHaveLength(2);
      expect(firstPage.total).toBe(4);
      expect(firstPage.limit).toBe(2);
      expect(firstPage.offset).toBe(0);

      const secondPage = await repository.findAll({ limit: 2, offset: 2 });
      expect(secondPage.todos).toHaveLength(2);
      expect(secondPage.total).toBe(4);
      expect(secondPage.limit).toBe(2);
      expect(secondPage.offset).toBe(2);
    });

    it('should combine filters', async () => {
      const result = await repository.findAll({
        priority: 'medium',
        completed: false,
        limit: 10
      });

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0].title).toBe('Todo 2');
    });

    it('should return empty array when no matches', async () => {
      const result = await repository.findAll({
        priority: 'high',
        completed: true
      });

      expect(result.todos).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('update', () => {
    let existingTodo: Todo;

    beforeEach(async () => {
      existingTodo = await repository.create({
        title: 'Original Title',
        description: 'Original Description',
        priority: 'low'
      });
    });

    it('should update todo title', async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      const result = await repository.update(existingTodo.id, {
        title: 'Updated Title'
      });

      expect(result?.title).toBe('Updated Title');
      expect(result?.description).toBe('Original Description');
      expect(result?.updatedAt.getTime()).toBeGreaterThan(existingTodo.updatedAt.getTime());
    });

    it('should update todo completion status', async () => {
      await new Promise(resolve => setTimeout(resolve, 1));
      const result = await repository.update(existingTodo.id, {
        completed: true
      });

      expect(result?.completed).toBe(true);
      expect(result?.updatedAt.getTime()).toBeGreaterThan(existingTodo.updatedAt.getTime());
    });

    it('should update multiple fields', async () => {
      await new Promise(resolve => setTimeout(resolve, 1));
      const result = await repository.update(existingTodo.id, {
        title: 'New Title',
        description: 'New Description',
        priority: 'high',
        completed: true
      });

      expect(result?.title).toBe('New Title');
      expect(result?.description).toBe('New Description');
      expect(result?.priority).toBe('high');
      expect(result?.completed).toBe(true);
    });

    it('should return null for non-existent todo', async () => {
      const result = await repository.update('non-existent-id', {
        title: 'Updated Title'
      });

      expect(result).toBeNull();
    });

    it('should persist updated todo in store', async () => {
      await repository.update(existingTodo.id, {
        title: 'Updated Title'
      });

      const fromStore = store.get(existingTodo.id);
      expect(fromStore?.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    let existingTodo: Todo;

    beforeEach(async () => {
      existingTodo = await repository.create({
        title: 'Todo to Delete'
      });
    });

    it('should delete existing todo', async () => {
      const result = await repository.delete(existingTodo.id);

      expect(result).toBe(true);
      expect(store.has(existingTodo.id)).toBe(false);
    });

    it('should return false for non-existent todo', async () => {
      const result = await repository.delete('non-existent-id');
      expect(result).toBe(false);
    });

    it('should not affect other todos when deleting', async () => {
      const otherTodo = await repository.create({
        title: 'Other Todo'
      });

      await repository.delete(existingTodo.id);

      expect(store.has(otherTodo.id)).toBe(true);
    });
  });

  describe('count', () => {
    beforeEach(async () => {
      await repository.create({ title: 'Todo 1', priority: 'high' });
      await repository.create({ title: 'Todo 2', priority: 'medium' });
      await repository.create({ title: 'Todo 3', priority: 'low' });

      const completedTodo = await repository.create({ title: 'Completed Todo' });
      await repository.update(completedTodo.id, { completed: true });
    });

    it('should count all todos without filters', async () => {
      const count = await repository.count();
      expect(count).toBe(4);
    });

    it('should count with completion filter', async () => {
      const completedCount = await repository.count({ completed: true });
      expect(completedCount).toBe(1);

      const incompleteCount = await repository.count({ completed: false });
      expect(incompleteCount).toBe(3);
    });

    it('should count with priority filter', async () => {
      const highCount = await repository.count({ priority: 'high' });
      expect(highCount).toBe(1);

      const mediumCount = await repository.count({ priority: 'medium' });
      expect(mediumCount).toBe(2);
    });

    it('should count with combined filters', async () => {
      const count = await repository.count({
        priority: 'medium',
        completed: false
      });
      expect(count).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty store', async () => {
      const result = await repository.findAll();
      expect(result.todos).toHaveLength(0);
      expect(result.total).toBe(0);

      const count = await repository.count();
      expect(count).toBe(0);
    });

    it('should handle pagination beyond available items', async () => {
      await repository.create({ title: 'Single Todo' });

      const result = await repository.findAll({ offset: 10, limit: 5 });
      expect(result.todos).toHaveLength(0);
      expect(result.total).toBe(1);
      expect(result.offset).toBe(10);
      expect(result.limit).toBe(5);
    });

    it('should handle zero limit', async () => {
      await repository.create({ title: 'Todo 1' });
      await repository.create({ title: 'Todo 2' });

      const result = await repository.findAll({ limit: 0 });
      expect(result.todos).toHaveLength(0);
      expect(result.total).toBe(2);
      expect(result.limit).toBe(0);
    });
  });
});