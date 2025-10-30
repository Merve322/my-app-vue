<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-violet-100 text-gray-800 font-sans">
    <header class="bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-5 shadow-lg">
      <nav class="flex justify-between items-center max-w-5xl mx-auto px-4">
        <h1 class="text-2xl font-bold tracking-tight">Todo App</h1>
        <div class="space-x-6 text-sm">
          <router-link to="/" class="hover:underline hover:text-gray-200 transition">Home</router-link>
        </div>
      </nav>
    </header>

    <main class="px-4 py-8 max-w-5xl mx-auto">
      <router-view />
    </main>

    <footer class="text-center text-xs text-gray-500 py-6 border-t mt-10">
      &copy; {{ new Date().getFullYear() }} Merveille's Todo App. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

