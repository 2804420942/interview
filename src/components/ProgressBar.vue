<template>
  <div class="px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-nuxt-dark-100/30 flex items-center gap-3 sm:gap-4">
    <!-- Progress Info -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-400 hidden sm:inline">进度</span>
      </div>
      <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
        {{ answered }}<span class="text-gray-400 dark:text-gray-500 font-normal">/{{ total }}</span>
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="flex-1">
      <div class="h-1 sm:h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-nuxt-green to-nuxt-green-400 rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Percentage -->
    <div class="shrink-0 flex items-center gap-2 sm:gap-3">
      <span class="text-[10px] sm:text-xs font-bold text-nuxt-green">{{ progressPercent }}%</span>
      <div class="h-4 w-px bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
      <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
        当前第 <span class="text-gray-600 dark:text-gray-300 font-medium">{{ current }}</span> 题
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  answered: number
  current: number
}>()

const progressPercent = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.answered / props.total) * 100)
})
</script>
