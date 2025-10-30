import { Todo } from '../types/todo';

const mockTodos: Todo[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Todo Task #${i + 1}`,
  completed: i % 3 === 0,
  createdAt: new Date(Date.now() - (i * 1000 * 60 * 60)),
  updatedAt: new Date(Date.now() - (i * 1000 * 60 * 30)),
  version: 1,
  synced: true,
}));

export default mockTodos;