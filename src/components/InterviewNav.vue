<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'bg-white/90 dark:bg-nuxt-dark/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-black/10'
      : 'bg-transparent'">
    <div class="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <!-- Logo -->
        <div class="flex items-center gap-2 sm:gap-3 cursor-pointer group" @click="$emit('goHome')">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-nuxt-green/10 flex items-center justify-center group-hover:bg-nuxt-green/20 transition-colors">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <span class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">InterviewHub</span>
            <span class="text-xs text-gray-400 dark:text-gray-500 ml-1.5 hidden sm:inline">面试准备平台</span>
          </div>
        </div>

        <!-- Center Nav (Desktop) -->
        <div class="hidden md:flex items-center gap-1">
          <a v-for="item in navItems" :key="item.label"
            :href="item.href"
            class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-nuxt-green transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 font-medium">
            {{ item.label }}
          </a>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 rounded-lg transition-all duration-300 hover:scale-110 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-nuxt-green dark:hover:text-nuxt-green border border-gray-200 dark:border-white/5 hover:border-nuxt-green/30"
            :title="isDark ? '切换到白天模式' : '切换到夜间模式'"
          >
            <!-- Sun icon (shown in dark mode) -->
            <svg v-if="isDark" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <!-- Moon icon (shown in light mode) -->
            <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
            <div class="w-2 h-2 rounded-full bg-nuxt-green animate-pulse"></div>
            <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">在线作答</span>
          </div>

          <button class="hidden sm:inline-flex px-3 sm:px-4 py-2 bg-nuxt-green/10 text-nuxt-green text-xs sm:text-sm font-semibold rounded-lg hover:bg-nuxt-green/20 transition-all border border-nuxt-green/20 hover:border-nuxt-green/40">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            题库
          </button>

          <!-- Mobile menu button -->
          <button @click="$emit('toggleDrawer')" class="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-nuxt-green rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()

defineEmits<{
  goHome: []
  toggleDrawer: []
}>()

const scrolled = ref(false)

const navItems: { label: string; href: string }[] = [
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
