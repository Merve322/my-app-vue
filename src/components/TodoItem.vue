<template>
  <li class="p-4 rounded-lg bg-gradient-to-r from-white via-indigo-50 to-white shadow hover:shadow-md transition">
    <div class="flex justify-between items-start sm:items-center gap-4 flex-col sm:flex-row">
      <div class="flex items-center gap-2 flex-1">
        <input
          v-if="isEditing"
          v-model="editedTitle"
          class="flex-1 px-3 py-1 border border-indigo-300 rounded-md text-sm"
          @keyup.enter="handleSave"
          @keyup.escape="cancelEdit"
          ref="editInput"
        />
        <router-link
          v-else
          :to="`/todos/${todo.id}`"
          class="flex items-center gap-2 flex-1 text-sm sm:text-base font-medium text-gray-800 hover:text-indigo-700"
        >
          <span :class="{ 'line-through text-gray-500': todo.completed }">
            #{{ todo.id }} - {{ todo.title }}
          </span>
          <Zap
            v-if="!todo.synced"
            :size="14"
            class="text-orange-500 flex-shrink-0"
            title="Pending sync - changes not saved to server"
          />
        </router-link>
      </div>

      <div class="flex items-center gap-2 text-sm flex-wrap">
        <button
          @click="$emit('toggle', todo.id)"
          class="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition text-xs"
          title="Toggle Status"
        >
          <CheckCircle v-if="todo.completed" :size="14" class="text-green-500" />
          <Clock v-else :size="14" class="text-yellow-500" />
          <span :class="todo.completed ? 'text-green-600' : 'text-yellow-600'">
            {{ todo.completed ? 'Done' : 'Pending' }}
          </span>
        </button>

        <template v-if="isEditing">
          <button @click="handleSave" class="text-green-600 hover:text-green-800" title="Save">
            <Save :size="16" />
          </button>
          <button @click="cancelEdit" class="text-gray-500 hover:text-gray-700" title="Cancel">
            <X :size="16" />
          </button>
        </template>
        <template v-else>
          <button @click="startEdit" class="text-blue-500 hover:text-blue-700" title="Edit">
            <Edit2 :size="16" />
          </button>
          <button @click="$emit('delete', todo.id)" class="text-red-500 hover:text-red-700" title="Delete">
            <Trash2 :size="16" />
          </button>
        </template>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { CheckCircle, Clock, Edit2, Trash2, Save, X, Zap } from 'lucide-vue-next'
import type { Todo } from '../types/todo'

interface Props {
  todo: Todo
}

interface Emits {
  (e: 'edit', id: number, newTitle: string): void
  (e: 'delete', id: number): void
  (e: 'toggle', id: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEditing = ref(false)
const editedTitle = ref(props.todo.title)
const editInput = ref<HTMLInputElement>()

const startEdit = () => {
  isEditing.value = true
  editedTitle.value = props.todo.title
  nextTick(() => {
    editInput.value?.focus()
  })
}

const handleSave = () => {
  if (!editedTitle.value.trim()) return
  emit('edit', props.todo.id, editedTitle.value)
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editedTitle.value = props.todo.title
}
</script>