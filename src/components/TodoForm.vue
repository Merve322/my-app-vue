<template>
  <form @submit.prevent="handleSubmit" class="mb-6">
    <div class="flex gap-3 items-start sm:items-center">
      <input
        type="text"
        placeholder="Add a new task..."
        v-model="title"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
      />
      <button
        type="submit"
        class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
      >
        <Plus size="18" />
        <span class="hidden sm:inline">Add</span>
      </button>
    </div>
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'

interface Emits {
  (e: 'add', title: string): void
}

const emit = defineEmits<Emits>()

const title = ref('')
const error = ref('')

const handleSubmit = () => {
  if (!title.value.trim()) {
    error.value = 'Task title cannot be empty'
    return
  }
  
  error.value = ''
  emit('add', title.value)
  title.value = ''
}
</script>