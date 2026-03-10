<template>
  <div class="flex-1 flex flex-col overflow-hidden bg-white/50 dark:bg-nuxt-dark/30 md:border-r md:border-gray-200 md:dark:border-white/5">
    <!-- Question Header -->
    <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-nuxt-dark-100/30">
      <div class="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-2">
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-nuxt-green/10 text-nuxt-green border border-nuxt-green/20">
            第 {{ index + 1 }}/{{ total }} 题
          </span>
          <span class="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded font-medium"
            :class="getDifficultyClass(question?.difficulty)">
            {{ getDifficultyLabel(question?.difficulty) }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span v-for="tag in question?.tags" :key="tag"
            class="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-white/5">
            {{ tag }}
          </span>
        </div>
      </div>
      <h2 class="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{{ question?.title }}</h2>
      <div class="flex items-center gap-2 mt-1 sm:mt-1.5">
        <svg class="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{{ question?.category }}</span>
      </div>
    </div>

    <!-- Question Content (Rendered Markdown) -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="p-4 sm:p-6">
        <div class="prose-content" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

interface Question {
  id: number
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  tags: string[]
}

const props = defineProps<{
  question: Question | undefined
  index: number
  total: number
}>()

const { isDark } = useTheme()

const renderedContent = computed(() => {
  if (!props.question?.content) return ''
  return simpleMarkdown(props.question.content)
})

function simpleMarkdown(md: string): string {
  let html = md

  // Step 1: Extract fenced code blocks (```...```) and replace with placeholders
  const codeBlocks: string[] = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escaped = escapeHtml(code.trimEnd())
    const langLabel = lang ? `<span class="absolute top-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 font-mono select-none">${lang}</span>` : ''
    const block = `<div class="relative my-4 rounded-xl bg-gray-900 dark:bg-[#0d1117] border border-gray-200 dark:border-white/5 overflow-hidden">${langLabel}<pre class="p-4 overflow-x-auto text-sm leading-relaxed"><code class="text-gray-300 font-mono text-xs">${escaped}</code></pre></div>`
    codeBlocks.push(block)
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`
  })

  // Step 2: Extract inline code and replace with placeholders
  const inlineCodes: string[] = []
  html = html.replace(/`([^`]+?)`/g, (_match, code) => {
    const escaped = escapeHtml(code)
    const inlineHtml = `<code class="px-1.5 py-0.5 bg-nuxt-green/10 text-emerald-600 dark:text-nuxt-green text-xs rounded font-mono border border-nuxt-green/10">${escaped}</code>`
    inlineCodes.push(inlineHtml)
    return `%%INLINECODE_${inlineCodes.length - 1}%%`
  })

  // Step 3: Process tables
  html = html.replace(/(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/g, (_match, headerRow, _separator, bodyRows) => {
    const headers = headerRow.split('|').filter((c: string) => c.trim() !== '').map((c: string) => c.trim())
    const rows = bodyRows.trim().split('\n').map((row: string) =>
      row.split('|').filter((c: string) => c.trim() !== '').map((c: string) => c.trim())
    )
    let table = '<div class="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-white/5"><table class="w-full text-sm">'
    table += '<thead><tr class="bg-gray-50 dark:bg-white/5">'
    headers.forEach((h: string) => {
      table += `<th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-white/5">${h}</th>`
    })
    table += '</tr></thead><tbody>'
    rows.forEach((row: string[], i: number) => {
      const bg = i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-white/[0.02]'
      table += `<tr class="${bg}">`
      row.forEach((cell: string) => {
        table += `<td class="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.03]">${cell}</td>`
      })
      table += '</tr>'
    })
    table += '</tbody></table></div>'
    return table
  })

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-emerald-600 dark:text-nuxt-green/80 mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-4 bg-nuxt-green/40 rounded-full inline-block"></span>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-4">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>')
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-800 dark:text-white font-semibold">$1</strong>')
  // List items
  html = html.replace(/^- (.+)$/gm, '<li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 mb-2.5"><span class="w-1.5 h-1.5 rounded-full bg-nuxt-green/50 mt-1.5 shrink-0"></span><span>$1</span></li>')
  // Wrap consecutive li elements in ul
  html = html.replace(/((<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="space-y-0.5 my-3">$1</ul>')
  // Paragraphs (non-empty lines that aren't already tags)
  html = html.replace(/^(?!<[h|u|l|c|s|d|t])(?!%%CODEBLOCK_)(?!%%INLINECODE_)(.+)$/gm, (match) => {
    if (match.trim() === '') return ''
    return `<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">${match}</p>`
  })
  // Line breaks
  html = html.replace(/\n\n/g, '<div class="h-2"></div>')

  // Step 4: Restore code blocks and inline codes
  codeBlocks.forEach((block, i) => {
    html = html.replace(`%%CODEBLOCK_${i}%%`, block)
  })
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE_${i}%%`, code)
  })

  return html
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\{\{/g, '&#123;&#123;')
    .replace(/\}\}/g, '&#125;&#125;')
}

const getDifficultyClass = (diff?: string) => {
  switch (diff) {
    case 'easy': return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
    case 'medium': return 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
    case 'hard': return 'bg-red-500/10 text-red-500 dark:text-red-400'
    default: return 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'
  }
}

const getDifficultyLabel = (diff?: string) => {
  switch (diff) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return ''
  }
}
</script>
