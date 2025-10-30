<template>
  <slot v-if="!hasError" />
  <div v-else class="min-h-screen flex flex-col justify-center items-center bg-red-50 text-center p-6">
    <div class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <AlertTriangle class="w-12 h-12 text-red-500 mb-4" />
      <h2 class="text-2xl font-semibold text-red-600 mb-2">Something went wrong</h2>
      <p class="text-gray-700 mb-4">An unexpected error occurred. Please refresh the page or try again later.</p>
      <button
        @click="handleRefresh"
        class="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Refresh Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'

const hasError = ref(false)

const handleRefresh = () => {
  window.location.reload()
}

// Vue 3 error capturing
onErrorCaptured((error) => {
  hasError.value = true
  console.error('Error caught by ErrorBoundary:', error)
  return false // Prevent the error from propagating further
})
</script>