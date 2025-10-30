<template>
  <div class="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="flex items-center border border-indigo-300 rounded-lg px-3 py-2 bg-indigo-50 focus-within:ring-2 focus-within:ring-indigo-500 w-full sm:w-1/2">
      <Search class="w-4 h-4 text-indigo-500 mr-2" />
      <input
        type="text"
        :value="search"
        @input="onSearchInput"
        placeholder="Search todos..."
        class="w-full bg-transparent focus:outline-none text-sm"
      />
    </div>

    <div class="flex items-center border border-indigo-300 rounded-lg px-3 py-2 bg-indigo-50 w-full sm:w-1/3">
      <FilterIcon class="w-4 h-4 text-indigo-500 mr-2" />
      <select
        :value="filterStatus"
        @change="onStatusChange"
        class="w-full bg-transparent focus:outline-none text-sm text-gray-700"
      >
        <option value="all">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Filter as FilterIcon } from 'lucide-vue-next'

interface Props {
  search: string
  filterStatus: 'all' | 'complete' | 'incomplete'
}

interface Emits {
  (e: 'update:search', value: string): void
  (e: 'update:filterStatus', value: 'all' | 'complete' | 'incomplete'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const onSearchInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:search', target.value)
}

const onStatusChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  emit('update:filterStatus', target.value as 'all' | 'complete' | 'incomplete')
}
</script>