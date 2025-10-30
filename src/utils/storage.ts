import { Todo, SyncState } from '../types/todo';
import { todoService } from '../services/todoService';
// import mockTodos from '../data/mockTodos';

const SYNC_QUEUE_KEY = 'syncQueue';
const SYNC_STATE_KEY = 'syncState';

// // Initialize with mock data if empty
// const initializeData = async (): Promise<void> => {
//   const todos = await todoService.getTodos();
//   if (todos.length === 0) {
//     localStorage.setItem('todos', JSON.stringify(mockTodos));
//   }
// };

// Sync queue management
export const getSyncQueue = (): Todo[] => {
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error reading sync queue:', error);
    return [];
  }
};

export const saveSyncQueue = (queue: Todo[]): void => {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
};

// Sync state management
export const getSyncState = (): SyncState => {
  try {
    const state = localStorage.getItem(SYNC_STATE_KEY);
    if (state) {
      const parsed = JSON.parse(state);
      return {
        ...parsed,
        lastSynced: parsed.lastSynced ? new Date(parsed.lastSynced) : null,
      };
    }
  } catch (error) {
    console.error('Error reading sync state:', error);
  }
  
  return {
    isOnline: navigator.onLine,
    pendingSync: [],
    lastSynced: null,
  };
};

export const saveSyncState = (state: SyncState): void => {
  localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(state));
};

// Enhanced todo operations with offline sync
export const getTodos = async (): Promise<Todo[]> => {
//   await initializeData();
  return todoService.getTodos();
};

export const addTodo = async (title: string): Promise<Todo> => {
  const isOnline = navigator.onLine;
  
  const newTodo: Omit<Todo, 'id'> = {
    title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    synced: isOnline,
  };

  try {
    const createdTodo = await todoService.createTodo(newTodo);
    
    // If offline, add to sync queue
    if (!isOnline) {
      const queue = getSyncQueue();
      queue.push(createdTodo);
      saveSyncQueue(queue);
      
      // Update sync state
      const syncState = getSyncState();
      saveSyncState({
        ...syncState,
        pendingSync: queue,
      });
    }
    
    return createdTodo;
  } catch (error) {
    console.error('Failed to create todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo[]> => {
  const isOnline = navigator.onLine;
  
  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  try {
    const updatedTodo = await todoService.updateTodo(id, updateData);
    const todos = await todoService.getTodos();
    
    // If offline, add to sync queue
    if (!isOnline) {
      const queue = getSyncQueue();
      const filteredQueue = queue.filter(todo => todo.id !== id);
      filteredQueue.push(updatedTodo);
      saveSyncQueue(filteredQueue);
      
      // Update sync state
      const syncState = getSyncState();
      saveSyncState({
        ...syncState,
        pendingSync: filteredQueue,
      });
    }
    
    return todos;
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<Todo[]> => {
  try {
    await todoService.deleteTodo(id);
    return todoService.getTodos();
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
};

// Enhanced sync simulation
export const syncWithServer = async (): Promise<void> => {
  const queue = getSyncQueue();
  
  if (queue.length === 0) return;

  try {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔄 Simulating sync with server:', queue.length, 'items');
    
    // For now, we just mark todos as synced locally
    const currentTodos = await todoService.getTodos();
    const updatedTodos = currentTodos.map(localTodo => {
      const queuedTodo = queue.find(q => q.id === localTodo.id);
      if (queuedTodo && queuedTodo.version >= localTodo.version) {
        return { ...queuedTodo, synced: true };
      }
      return localTodo;
    });

    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    
    // Clear sync queue
    saveSyncQueue([]);
    
    // Update sync state
    const syncState = getSyncState();
    saveSyncState({
      ...syncState,
      pendingSync: [],
      lastSynced: new Date(),
    });

  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
};

export const switchToServerService = (baseURL: string): void => {
  console.log('🚀 Switching to server todo service:', baseURL);
};