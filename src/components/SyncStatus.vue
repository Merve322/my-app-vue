<template>
  <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-sm border">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Online/Offline Status -->
        <div :class="['flex items-center gap-2', syncState.isOnline ? 'text-green-600' : 'text-red-600']">
          <Wifi v-if="syncState.isOnline" size="20" />
          <WifiOff v-else size="20" />
          <span class="font-medium">
            {{ syncState.isOnline ? 'Online' : 'Offline' }}
          </span>
        </div>

        <!-- Pending Sync Count -->
        <div v-if="syncState.pendingSync.length > 0" class="flex items-center gap-2 text-orange-600">
          <RefreshCw size="16" />
          <span class="text-sm">
            {{ syncState.pendingSync.length }} pending sync{{ syncState.pendingSync.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Last Synced -->
        <div v-if="syncState.lastSynced && syncState.isOnline && syncState.pendingSync.length === 0" class="flex items-center gap-2 text-green-600">
          <CheckCircle size="16" />
          <span class="text-sm">
            Synced {{ formatTime(syncState.lastSynced) }}
          </span>
        </div>
      </div>

      <!-- Sync Button -->
      <button
        v-if="syncState.isOnline && syncState.pendingSync.length > 0"
        @click="$emit('sync')"
        :disabled="isSyncing"
        :class="[
          'flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition',
          isSyncing 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        ]"
      >
        <RefreshCw size="14" :class="{ 'animate-spin': isSyncing }" />
        {{ isSyncing ? 'Syncing...' : 'Sync Now' }}
      </button>
    </div>

    <!-- Offline Warning -->
    <div v-if="!syncState.isOnline" class="mt-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded border border-amber-200">
      🔄 You're offline. Changes will be saved locally and synced when you're back online.
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-vue-next'
import type { SyncState } from '../types/todo'

interface Props {
  syncState: SyncState
  isSyncing: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  sync: []
}>()

const formatTime = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleTimeString()
}
</script>