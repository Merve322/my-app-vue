<template>
  <div class="flex flex-wrap gap-2 mt-6 justify-center">
    <button
      v-for="num in pageNumbers"
      :key="num"
      @click="$emit('pageChange', num)"
      :class="[
        'px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200',
        num === current
          ? 'bg-indigo-600 text-white shadow-md'
          : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
      ]"
    >
      {{ num }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  perPage: number
  current: number
}

interface Emits {
  (e: 'pageChange', page: number): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const pageNumbers = computed(() => {
  const pages = Math.ceil(props.total / props.perPage)
  return [...Array(pages).keys()].map(n => n + 1)
})
</script>