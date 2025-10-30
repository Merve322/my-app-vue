<template>
  <ul class="space-y-3">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
      @toggle="$emit('toggle', $event)"
    />
  </ul>
</template>

<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types/todo'

interface Props {
  todos: Todo[]
}

interface Emits {
  (e: 'edit', id: number, newTitle: string): void
  (e: 'delete', id: number): void
  (e: 'toggle', id: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>