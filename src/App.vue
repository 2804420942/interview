<template>
  <div class="min-h-screen bg-gray-50 dark:bg-nuxt-dark text-gray-900 dark:text-white font-sans antialiased transition-colors duration-300">
    <InterviewNav @go-home="goHome" @toggle-drawer="toggleDrawer" />
    
    <!-- Main Content -->
    <div class="pt-14 sm:pt-16">
      <!-- Hero Banner -->
      <section v-if="!started" class="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-grid">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute -top-40 -left-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-nuxt-green/5 rounded-full blur-[120px]"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-nuxt-green/3 rounded-full blur-[150px]"></div>
          <div class="absolute -bottom-40 -right-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-nuxt-green/4 rounded-full blur-[100px]"></div>
          <div class="absolute top-20 right-1/4 w-2 h-2 bg-nuxt-green/30 rounded-full animate-pulse hidden sm:block"></div>
          <div class="absolute top-1/3 left-[20%] w-1.5 h-1.5 bg-nuxt-green/20 rounded-full animate-ping hidden sm:block"></div>
          <div class="absolute bottom-1/3 right-1/3 w-1 h-1 bg-nuxt-green/40 rounded-full animate-pulse hidden sm:block"></div>
        </div>

        <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 rounded-full border border-nuxt-green/20 bg-nuxt-green/5 backdrop-blur-sm">
            <span class="w-2 h-2 bg-nuxt-green rounded-full animate-pulse"></span>
            <span class="text-xs sm:text-sm text-nuxt-green font-medium">面试准备平台</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight">
            <span class="text-gray-900 dark:text-white">高效备战</span>
            <br />
            <span class="text-gradient">技术面试</span>
          </h1>

          <p v-if="isFullVersion" class="text-sm sm:text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-2">
            精心整理的 HTML/CSS + JavaScript + TypeScript + Vue + 浏览器&amp;网络 + 前端工程化 + 性能优化 + 算法&amp;数据结构 + 设计模式 + 项目经验 + 场景题 + 简历深度 核心面试题库，涵盖语义化、盒模型、闭包、原型链、异步编程、ES6+、泛型、响应式原理、HTTP协议、Webpack、Vite、CI/CD、排序算法、观察者模式、工厂模式、代理模式、大文件上传、协同编辑、骨架屏、状态机、性能监控 等多个领域。
            <br class="hidden sm:block" />
            逐题练习、实时作答，助你自信迎接每一场面试。
          </p>
          <p v-else class="text-sm sm:text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-2">
            精心整理的 HTML/CSS + JavaScript + TypeScript + Vue + 浏览器&amp;网络 + 前端工程化 + 性能优化 + 算法&amp;数据结构 核心面试题库，涵盖语义化、盒模型、闭包、原型链、异步编程、ES6+、泛型、响应式原理、HTTP协议、Webpack、Vite、CI/CD、排序算法 等多个领域。
            <br class="hidden sm:block" />
            逐题练习、实时作答，助你自信迎接每一场面试。
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <button 
              @click="startInterview"
              class="group relative w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-nuxt-green text-nuxt-dark font-bold rounded-xl text-base sm:text-lg hover:bg-nuxt-green-400 transition-all duration-300 shadow-lg shadow-nuxt-green/20 hover:shadow-nuxt-green/40 hover:scale-105">
              {{ lastIndex > 0 ? '继续面试' : '开始面试' }}
              <svg class="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </button>
          </div>

          <!-- Last Progress Hint -->
          <div v-if="lastIndex > 0" class="mb-8 sm:mb-10">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <svg class="w-4 h-4 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                上次看到第 <span class="text-nuxt-green font-semibold">{{ lastIndex + 1 }}</span> 题，点击继续面试将自动跳转
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div v-for="stat in heroStats" :key="stat.label" class="text-center p-3 sm:p-0 rounded-xl bg-white/50 dark:bg-transparent sm:bg-transparent border border-gray-200/50 dark:border-transparent sm:border-transparent">
              <div class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">{{ stat.value }}</div>
              <div class="text-[10px] sm:text-xs md:text-sm text-gray-400 dark:text-gray-500">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interview Area (Desktop) -->
      <div v-else class="hidden md:flex h-[calc(100vh-4rem)]">
        <!-- Left Sidebar - Question List -->
        <QuestionList 
          ref="questionListRef"
          :questions="questions"
          :current-index="currentIndex"
          :answered-map="answeredMap"
          @select="selectQuestion"
        />

        <!-- Main Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Progress Bar -->
          <ProgressBar 
            :total="questions.length"
            :answered="answeredCount"
            :current="currentIndex + 1"
          />

          <!-- Content -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Question Panel -->
            <QuestionPanel 
              :question="currentQuestion"
              :index="currentIndex"
              :total="questions.length"
            />

            <!-- Answer Panel -->
            <AnswerPanel
              :question="currentQuestion"
              :answer="currentAnswer"
              @update:answer="updateAnswer"
              @prev="prevQuestion"
              @next="nextQuestion"
              @submit="submitAnswer"
              :is-first="currentIndex === 0"
              :is-last="currentIndex === questions.length - 1"
              :is-answered="!!answeredMap[currentIndex]"
            />
          </div>
        </div>
      </div>

      <!-- Interview Area (Mobile) -->
      <div v-if="started" class="md:hidden flex flex-col h-[calc(100vh-3.5rem)]">
        <!-- Mobile Progress Bar -->
        <ProgressBar 
          :total="questions.length"
          :answered="answeredCount"
          :current="currentIndex + 1"
        />

        <!-- Mobile Tab Switcher -->
        <div class="mobile-tab-bar bg-white dark:bg-nuxt-dark-100/50">
          <button
            class="mobile-tab"
            :class="{ active: mobileTab === 'question' }"
            @click="mobileTab = 'question'"
          >
            📋 题目
          </button>
          <button
            class="mobile-tab"
            :class="{ active: mobileTab === 'answer' }"
            @click="mobileTab = 'answer'"
          >
            ✍️ 作答
          </button>
        </div>

        <!-- Mobile Content -->
        <div class="flex-1 overflow-hidden">
          <div v-show="mobileTab === 'question'" class="h-full flex flex-col">
            <div class="flex-1 overflow-y-auto">
              <QuestionPanel 
                :question="currentQuestion"
                :index="currentIndex"
                :total="questions.length"
              />
            </div>
            <!-- Mobile Bottom Navigation for Question Tab -->
            <div class="shrink-0 px-3 py-2.5 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-nuxt-dark-100/50 flex items-center gap-2.5">
              <button
                @click="prevQuestion"
                :disabled="currentIndex === 0"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                :class="currentIndex === 0
                  ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 active:scale-95'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                上一题
              </button>
              <span class="text-xs text-gray-400 dark:text-gray-500 font-medium shrink-0 tabular-nums">
                {{ currentIndex + 1 }} / {{ questions.length }}
              </span>
              <button
                @click="nextQuestion"
                :disabled="currentIndex === questions.length - 1"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                :class="currentIndex === questions.length - 1
                  ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 active:scale-95'"
              >
                下一题
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
          <div v-show="mobileTab === 'answer'" class="h-full flex flex-col">
            <AnswerPanel
              :question="currentQuestion"
              :answer="currentAnswer"
              @update:answer="updateAnswer"
              @prev="prevQuestion"
              @next="nextQuestion"
              @submit="submitAnswer"
              :is-first="currentIndex === 0"
              :is-last="currentIndex === questions.length - 1"
              :is-answered="!!answeredMap[currentIndex]"
              :is-mobile="true"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Question Drawer Overlay -->
      <Transition name="fade">
        <div v-if="drawerOpen && started" class="drawer-overlay md:hidden" @click="drawerOpen = false"></div>
      </Transition>

      <!-- Mobile Question Drawer -->
      <Transition name="slide-left">
        <div v-if="drawerOpen && started" class="fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-xs md:hidden">
          <QuestionList 
            ref="mobileQuestionListRef"
            :questions="questions"
            :current-index="currentIndex"
            :answered-map="answeredMap"
            @select="(idx: number) => { selectQuestion(idx); drawerOpen = false }"
            :is-mobile="true"
          />
        </div>
      </Transition>
    </div>

    <!-- Footer (only on landing page) -->
    <footer v-if="!started" class="border-t border-gray-200 dark:border-white/5 py-6 sm:py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
          由 <a href="https://with.woa.com/" style="color: #8A2BE2;" target="_blank">With</a> 通过自然语言生成
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import InterviewNav from './components/InterviewNav.vue'
import QuestionList from './components/QuestionList.vue'
import QuestionPanel from './components/QuestionPanel.vue'
import AnswerPanel from './components/AnswerPanel.vue'
import ProgressBar from './components/ProgressBar.vue'
import { allQuestions } from './data'
import type { Question } from './data'

export type { Question }

const STORAGE_KEY_INDEX = 'interview_last_index'
const STORAGE_KEY_ANSWERS = 'interview_answers'

// Version detection from URL params
const urlParams = new URLSearchParams(window.location.search)
const isFullVersion = urlParams.get('version') === 'full'

// Filter questions based on version
// 精简版只显示到 ID=720（实现 Promise.all），完整版显示所有题目
const LITE_MAX_ID = 720
const filteredQuestions = isFullVersion
  ? [...allQuestions]
  : allQuestions.filter(q => q.id <= LITE_MAX_ID)

const started = ref(false)
const drawerOpen = ref(false)
const mobileTab = ref<'question' | 'answer'>('question')
const questionListRef = ref<InstanceType<typeof QuestionList> | null>(null)
const mobileQuestionListRef = ref<InstanceType<typeof QuestionList> | null>(null)

// Dynamic stats based on version
const liteCategories = new Set(filteredQuestions.map(q => q.category))
const heroStats = isFullVersion
  ? [
      { value: '365', label: '面试题目' },
      { value: '13大领域', label: '题目分类' },
      { value: '3级', label: '难度梯度' },
      { value: '实时', label: '即时作答' },
    ]
  : [
      { value: String(filteredQuestions.length), label: '面试题目' },
      { value: `${liteCategories.size}大领域`, label: '题目分类' },
      { value: '3级', label: '难度梯度' },
      { value: '实时', label: '即时作答' },
    ]

const questions = ref<Question[]>(filteredQuestions)

// Restore last viewed index from localStorage
const storageKeySuffix = isFullVersion ? '_full' : '_lite'
const savedIndex = parseInt(localStorage.getItem(STORAGE_KEY_INDEX + storageKeySuffix) || '0', 10)
const lastIndex = ref(isNaN(savedIndex) ? 0 : Math.min(savedIndex, filteredQuestions.length - 1))

const currentIndex = ref(0)

// Restore answers from localStorage
const savedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS + storageKeySuffix)
const answeredMap = ref<Record<number, string>>(savedAnswers ? JSON.parse(savedAnswers) : {})

const currentQuestion = computed(() => questions.value[currentIndex.value])
const currentAnswer = computed(() => answeredMap.value[currentIndex.value] || '')
const answeredCount = computed(() => Object.keys(answeredMap.value).length)

// Persist currentIndex to localStorage whenever it changes
watch(currentIndex, (newIdx) => {
  localStorage.setItem(STORAGE_KEY_INDEX + storageKeySuffix, String(newIdx))
  lastIndex.value = newIdx
})

// Persist answers to localStorage whenever they change
watch(answeredMap, (newMap) => {
  localStorage.setItem(STORAGE_KEY_ANSWERS + storageKeySuffix, JSON.stringify(newMap))
}, { deep: true })

const startInterview = () => {
  started.value = true
  // Jump to last viewed question
  if (lastIndex.value > 0 && lastIndex.value < questions.value.length) {
    currentIndex.value = lastIndex.value
  }
  // Ensure question list scrolls to the current question after render
  nextTick(() => {
    setTimeout(() => {
      questionListRef.value?.scrollToQuestion(currentIndex.value)
      mobileQuestionListRef.value?.scrollToQuestion(currentIndex.value)
    }, 150)
  })
}

const goHome = () => {
  started.value = false
}

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const selectQuestion = (index: number) => {
  currentIndex.value = index
}

const updateAnswer = (val: string) => {
  answeredMap.value[currentIndex.value] = val
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const submitAnswer = () => {
  if (currentAnswer.value.trim()) {
    answeredMap.value[currentIndex.value] = currentAnswer.value
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>