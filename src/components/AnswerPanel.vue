<template>
  <div class="flex flex-col overflow-hidden shrink-0"
    :class="isMobile
      ? 'w-full bg-white dark:bg-nuxt-dark-100/20'
      : 'w-[420px] border-l border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-nuxt-dark-100/20'">
    <!-- Answer Header -->
    <div class="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">作答区域</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span v-if="isAnswered" class="inline-flex items-center gap-1 text-[10px] text-nuxt-green bg-nuxt-green/10 px-2 py-0.5 rounded-full border border-nuxt-green/20">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          已作答
        </span>
        <span class="text-[10px] text-gray-400 dark:text-gray-600">
          {{ charCount }} 字
        </span>
      </div>
    </div>

    <!-- Text Area -->
    <div class="flex-1 overflow-hidden flex flex-col p-3 sm:p-4">
      <div class="flex-1 relative">
        <textarea
          :value="answer"
          @input="handleInput"
          placeholder="在此输入你的答案...&#10;&#10;💡 提示：&#10;• 尽量条理清晰地组织答案&#10;• 可以使用要点列举的方式&#10;• 结合实际经验会更有说服力"
          class="w-full h-full resize-none bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-3 sm:p-4 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 focus:bg-white dark:focus:bg-white/[0.05] transition-all leading-relaxed font-mono"
          :style="isMobile ? 'min-height: 200px' : ''"
        ></textarea>

        <!-- Quick Actions (floating) -->
        <div class="absolute bottom-3 right-3 flex items-center gap-1.5">
          <button
            @click="clearAnswer"
            v-if="answer"
            class="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all"
            title="清空答案"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
      <!-- Submit -->
      <button
        @click="$emit('submit')"
        :disabled="!answer?.trim()"
        class="w-full py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300"
        :class="answer?.trim() 
          ? 'bg-nuxt-green text-nuxt-dark hover:bg-nuxt-green-400 shadow-lg shadow-nuxt-green/20 hover:shadow-nuxt-green/40 hover:scale-[1.02]' 
          : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-white/5'"
      >
        <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        {{ isAnswered ? '更新答案' : '提交答案' }}
      </button>

      <!-- Navigation -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('prev')"
          :disabled="isFirst"
          class="flex-1 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
          :class="isFirst 
            ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]' 
            : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          上一题
        </button>
        <button
          @click="$emit('next')"
          :disabled="isLast"
          class="flex-1 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
          :class="isLast 
            ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]' 
            : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'"
        >
          下一题
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Question {
  id: number
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  tags: string[]
}

const props = withDefaults(defineProps<{
  question: Question | undefined
  answer: string
  isFirst: boolean
  isLast: boolean
  isAnswered: boolean
  isMobile?: boolean
}>(), {
  isMobile: false
})

const emit = defineEmits<{
  'update:answer': [val: string]
  prev: []
  next: []
  submit: []
}>()

const charCount = computed(() => props.answer?.length || 0)

const handleInput = (e: Event) => {
  emit('update:answer', (e.target as HTMLTextAreaElement).value)
}

const clearAnswer = () => {
  emit('update:answer', '')
}
</script>
