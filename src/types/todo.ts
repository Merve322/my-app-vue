export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  synced: boolean;
}

export interface TodoFormProps {
  onAdd: (title: string) => void;
}

export interface TodoItemProps {
  todo: Todo;
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export interface TodoListProps {
  todos: Todo[];
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export interface FilterProps {
  search: string;
  onSearch: (search: string) => void;
  filterStatus: 'all' | 'complete' | 'incomplete';
  onStatusChange: (status: 'all' | 'complete' | 'incomplete') => void;
}

export interface PaginationProps {
  total: number;
  perPage: number;
  current: number;
  onPageChange: (page: number) => void;
}

export interface FilterState {
  search: string;
  status: 'all' | 'complete' | 'incomplete';
}

export interface SyncState {
  isOnline: boolean;
  pendingSync: Todo[];
  lastSynced: Date | null;
}

export interface TodoService {
  getTodos(): Promise<Todo[]>;
  createTodo(todo: Omit<Todo, 'id'>): Promise<Todo>;
  updateTodo(id: number, updates: Partial<Todo>): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
  syncTodos(todos: Todo[]): Promise<Todo[]>;
}