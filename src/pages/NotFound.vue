<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-gradient-to-tr from-white via-violet-50 to-white">
    <h1 class="text-7xl font-extrabold text-violet-600 drop-shadow mb-4">404</h1>
    <p class="text-2xl text-gray-700 mb-3">Oops! Page not found.</p>
    <p class="text-gray-500 max-w-md mb-6">
      The page you are looking for does not exist or has been moved.
    </p>
    <router-link
      to="/"
      class="inline-block px-6 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-violet-700 transition"
    >
      ⬅️ Back to Home
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No need for additional logic
</script>