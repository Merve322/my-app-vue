<template>
  <section v-if="todo" class="max-w-2xl mx-auto p-6 mt-12 bg-white/70 backdrop-blur-md shadow-lg rounded-xl">
    <h2 class="text-3xl font-semibold text-violet-700 mb-6 text-center">📝 Todo Detail</h2>

    <div class="space-y-4 text-lg text-gray-700">
      <p><span class="font-bold">ID:</span> {{ todo.id }}</p>
      <p><span class="font-bold">Title:</span> {{ todo.title }}</p>
      <p>
        <span class="font-bold">Status:</span>
        <span :class="['font-medium', todo.completed ? 'text-green-600' : 'text-orange-500']">
          {{ todo.completed ? 'Completed' : 'Incomplete' }}
        </span>
      </p>
      <p><span class="font-bold">Created:</span> <span class="text-gray-600">{{ formatDate(todo.createdAt) }}</span></p>
      <p><span class="font-bold">Last Updated:</span> <span class="text-gray-600">{{ formatDate(todo.updatedAt) }}</span></p>
      <p><span class="font-bold">Version:</span> <span class="text-gray-600">{{ todo.version || 1 }}</span></p>
      <p>
        <span class="font-bold">Sync Status:</span>
        <span :class="['font-medium', todo.synced ? 'text-green-600' : 'text-orange-500']">
          {{ todo.synced ? '✅ Synced' : '⚡ Pending Sync' }}
        </span>
      </p>
    </div>

    <div class="mt-8 text-center">
      <button
        @click="router.back()"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        ⬅️ Back to List
      </button>
    </div>
  </section>

  <div v-else-if="loading" class="text-center mt-20 text-gray-500">
    Loading todo...
  </div>

  <div v-else class="text-center mt-20 p-6 max-w-md mx-auto bg-white/60 rounded-xl shadow-md backdrop-blur">
    <h2 class="text-2xl font-bold text-red-500 mb-4">Todo not found</h2>
    <p class="text-gray-600 mb-6">We couldn't find a todo with that ID.</p>
    <button
      @click="router.back()"
      class="px-6 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
    >
      ⬅️ Go Back
    </button>
    <router-link
      to="/"
      class="block mt-4 text-sm text-violet-600 hover:underline"
    >
      🏠 Back to Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTodos } from '../utils/storage'
import type { Todo } from '../types/todo'

const route = useRoute()
const router = useRouter()
const todo = ref<Todo | null>(null)
const loading = ref(true)

const formatDate = (date: Date | undefined): string => {
  if (!date) return 'Unknown'
  return date.toLocaleString()
}

onMounted(async () => {
  try {
    const todos = await getTodos()
    const todoId = parseInt(route.params.id as string, 10)
    todo.value = todos.find(item => item.id === todoId) || null
  } catch (error) {
    console.error('Error loading todo:', error)
    todo.value = null
  } finally {
    loading.value = false
  }
})
</script>