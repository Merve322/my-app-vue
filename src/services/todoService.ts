import { Todo } from '../types/todo';
import { TodoService } from '../types/todo';

class LocalTodoService implements TodoService {
  private STORAGE_KEY = 'todos';

  async getTodos(): Promise<Todo[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const todos = JSON.parse(stored);
        return todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error reading todos:', error);
      return [];
    }
  }

  async createTodo(todoData: Omit<Todo, 'id'>): Promise<Todo> {
    const todos = await this.getTodos();
    const newTodo: Todo = {
      ...todoData,
      id: Date.now(),
    };
    const updated = [newTodo, ...todos];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    return newTodo;
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    const todos = await this.getTodos();
    const updated = todos.map((todo) =>
      todo.id === id 
        ? { 
            ...todo, 
            ...updates, 
            updatedAt: new Date(),
            version: (todo.version || 1) + 1,
          }
        : todo
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    const updatedTodo = updated.find(todo => todo.id === id);
    if (!updatedTodo) throw new Error('Todo not found');
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    const todos = await this.getTodos();
    const updated = todos.filter(todo => todo.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  async syncTodos(todos: Todo[]): Promise<Todo[]> {
    // For local service, sync is a no-op
    return todos;
  }
}

// Export the current service (using local storage)
export const todoService: TodoService = new LocalTodoService();