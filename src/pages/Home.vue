<template>
  <main class="max-w-3xl mx-auto px-6 py-10 bg-white/70 backdrop-blur-lg shadow-xl rounded-xl">
    <h1 class="text-3xl font-bold text-violet-700 mb-6 text-center">📋 Todos</h1>

    <SyncStatus 
      :sync-state="syncState" 
      @sync="handleSync"
      :is-syncing="isSyncing"
    />

    <TodoForm @add="handleAdd" />

    <Filter
      :search="filterState.search"
      :filter-status="filterState.status"
      @update:search="handleSearch"
      @update:filter-status="handleStatusChange"
    />

    <p v-if="!loading" class="text-sm text-gray-600 mb-4">
      Showing <strong>{{ currentTodos.length }}</strong> of <strong>{{ filteredTodos.length }}</strong> todo{{ filteredTodos.length !== 1 ? 's' : '' }}
      <span v-if="syncState.pendingSync.length > 0 && !syncState.isOnline" class="text-orange-600 ml-2">
        ({{ syncState.pendingSync.length }} pending sync)
      </span>
    </p>

    <p v-if="loading" class="text-center text-gray-500 animate-pulse">Loading todos...</p>
    
    <TodoList
      v-else
      :todos="currentTodos"
      @edit="handleEdit"
      @delete="handleDelete"
      @toggle="handleToggle"
    />

    <div v-if="filteredTodos.length > todosPerPage" class="mt-6">
      <Pagination
        :total="filteredTodos.length"
        :per-page="todosPerPage"
        :current="currentPage"
        @page-change="setCurrentPage"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Todo, FilterState, SyncState } from '../types/todo'
import { 
  getTodos, 
  addTodo, 
  updateTodo, 
  deleteTodo, 
  getSyncState, 
  saveSyncState, 
  syncWithServer 
} from '../utils/storage'
import TodoList from '../components/TodoList.vue'
import Pagination from '../components/Pagination.vue'
import Filter from '../components/Filter.vue'
import TodoForm from '../components/TodoForm.vue'
import SyncStatus from '../components/SyncStatus.vue'

const todos = ref<Todo[]>([])
const loading = ref(true)
const currentPage = ref(1)
const isSyncing = ref(false)

const filterState = ref<FilterState>({
  search: '',
  status: 'all'
})

const syncState = ref<SyncState>(getSyncState())
const todosPerPage = 10

// Computed properties
const filteredTodos = computed(() => {
  return todos.value.filter((todo: Todo) => {
    const matchSearch = todo.title.toLowerCase().includes(filterState.value.search.toLowerCase())
    const matchStatus =
      filterState.value.status === 'all' ||
      (filterState.value.status === 'complete' && todo.completed) ||
      (filterState.value.status === 'incomplete' && !todo.completed)
    return matchSearch && matchStatus
  })
})

const currentTodos = computed(() => {
  const last = currentPage.value * todosPerPage
  const first = last - todosPerPage
  return filteredTodos.value.slice(first, last)
})

// Methods
const handleSync = async (): Promise<void> => {
  if (!syncState.value.isOnline || isSyncing.value) return
  
  isSyncing.value = true
  try {
    await syncWithServer()
    
    // Refresh data after sync
    const updatedTodos = await getTodos()
    todos.value = updatedTodos
    
    const newSyncState = {
      ...syncState.value,
      pendingSync: [],
      lastSynced: new Date(),
    }
    syncState.value = newSyncState
    saveSyncState(newSyncState)
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    isSyncing.value = false
  }
}

const handleSearch = (search: string): void => {
  filterState.value.search = search
  currentPage.value = 1
}

const handleStatusChange = (status: 'all' | 'complete' | 'incomplete'): void => {
  filterState.value.status = status
  currentPage.value = 1
}

const setCurrentPage = (page: number): void => {
  currentPage.value = page
}

const handleAdd = async (title: string): Promise<void> => {
  try {
    const newTodo = await addTodo(title)
    todos.value = [newTodo, ...todos.value]
    
    const currentSyncState = getSyncState()
    syncState.value = currentSyncState
  } catch (error) {
    console.error('Error adding todo:', error)
  }
}

const handleEdit = async (id: number, newTitle: string): Promise<void> => {
  try {
    const updatedTodos = await updateTodo(id, { title: newTitle })
    todos.value = updatedTodos
    
    const currentSyncState = getSyncState()
    syncState.value = currentSyncState
  } catch (error) {
    console.error('Error editing todo:', error)
  }
}

const handleDelete = async (id: number): Promise<void> => {
  try {
    const updatedTodos = await deleteTodo(id)
    todos.value = updatedTodos
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

const handleToggle = async (id: number): Promise<void> => {
  try {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      const updatedTodos = await updateTodo(id, { completed: !todo.completed })
      todos.value = updatedTodos
      
      const currentSyncState = getSyncState()
      syncState.value = currentSyncState
    }
  } catch (error) {
    console.error('Error toggling todo:', error)
  }
}

// Online/Offline detection
const handleOnline = () => {
  console.log('Browser online event triggered')
  const newSyncState = { ...syncState.value, isOnline: true }
  syncState.value = newSyncState
  saveSyncState(newSyncState)
  
  if (syncState.value.pendingSync.length > 0) {
    handleSync()
  }
}

const handleOffline = () => {
  console.log('Browser offline event triggered')
  const newSyncState = { ...syncState.value, isOnline: false }
  syncState.value = newSyncState
  saveSyncState(newSyncState)
}

// Lifecycle
onMounted(async () => {
  // Load initial data
  try {
    const storedTodos = await getTodos()
    todos.value = storedTodos
    
    const currentSyncState = getSyncState()
    syncState.value = currentSyncState
    
    loading.value = false
  } catch (error) {
    console.error('Error loading todos:', error)
    loading.value = false
  }

  // Set up event listeners
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Force initial status check
  if (navigator.onLine !== syncState.value.isOnline) {
    const newSyncState = { ...syncState.value, isOnline: navigator.onLine }
    syncState.value = newSyncState
    saveSyncState(newSyncState)
  }
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>