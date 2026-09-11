<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-nuxt-dark text-gray-900 dark:text-white font-sans antialiased transition-colors duration-300"
  >
    <InterviewNav @go-home="goHome" @toggle-drawer="toggleDrawer" />

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 z-[300] flex items-center justify-center bg-white/90 dark:bg-nuxt-dark/95 backdrop-blur-sm transition-opacity duration-500"
    >
      <div class="text-center px-6">
        <!-- Spinner -->
        <div class="relative w-16 h-16 mx-auto mb-6">
          <div
            class="absolute inset-0 border-4 border-gray-200 dark:border-white/10 rounded-full"
          ></div>
          <div
            class="absolute inset-0 border-4 border-transparent border-t-nuxt-green rounded-full animate-spin"
          ></div>
          <div
            class="absolute inset-2 border-4 border-transparent border-b-nuxt-green/50 rounded-full animate-spin"
            style="animation-direction: reverse; animation-duration: 1.5s"
          ></div>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
          正在加载题库数据
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          正在加载题库数据，请稍候...
        </p>
        <div class="flex items-center justify-center gap-1.5">
          <span
            class="w-1.5 h-1.5 bg-nuxt-green rounded-full animate-bounce"
            style="animation-delay: 0s"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-nuxt-green rounded-full animate-bounce"
            style="animation-delay: 0.15s"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-nuxt-green rounded-full animate-bounce"
            style="animation-delay: 0.3s"
          ></span>
        </div>
      </div>
    </div>

    <!-- Data Source Toast -->
    <Transition name="fade">
      <div
        v-if="dataSourceToast"
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[80] px-4 py-2.5 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 bg-nuxt-green/10 border-nuxt-green/20 text-nuxt-green"
      >
        <div class="flex items-center gap-2 text-sm font-medium">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          <span v-if="dataSourceInfo.fromCache">
            📦 从缓存加载 {{ questions.length }} 题，后台已更新数据
          </span>
          <span v-else> ✅ 本地加载完成，共 {{ questions.length }} 题 </span>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="pt-14 sm:pt-16">
      <!-- Hero Banner -->
      <section
        v-if="!started"
        class="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-grid"
      >
        <div class="absolute inset-0 pointer-events-none">
          <div
            class="absolute -top-40 -left-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-nuxt-green/5 rounded-full blur-[120px]"
          ></div>
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-nuxt-green/3 rounded-full blur-[150px]"
          ></div>
          <div
            class="absolute -bottom-40 -right-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-nuxt-green/4 rounded-full blur-[100px]"
          ></div>
          <div
            class="absolute top-20 right-1/4 w-2 h-2 bg-nuxt-green/30 rounded-full animate-pulse hidden sm:block"
          ></div>
          <div
            class="absolute top-1/3 left-[20%] w-1.5 h-1.5 bg-nuxt-green/20 rounded-full animate-ping hidden sm:block"
          ></div>
          <div
            class="absolute bottom-1/3 right-1/3 w-1 h-1 bg-nuxt-green/40 rounded-full animate-pulse hidden sm:block"
          ></div>
        </div>

        <div
          class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div
            class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 rounded-full border border-nuxt-green/20 bg-nuxt-green/5 backdrop-blur-sm"
          >
            <span
              class="w-2 h-2 bg-nuxt-green rounded-full animate-pulse"
            ></span>
            <span class="text-xs sm:text-sm text-nuxt-green font-medium"
              >面试准备平台</span
            >
          </div>

          <h1
            class="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-4 sm:mb-6 tracking-tight"
          >
            <span class="text-gray-900 dark:text-white">高效备战</span>
            <br />
            <span class="text-gradient">技术面试</span>
          </h1>

          <p
            class="text-sm sm:text-lg lg:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-2"
          >
            精心整理的 HTML/CSS + JavaScript + TypeScript + Vue +
            浏览器&amp;网络 + 前端工程化 + 性能优化 + 算法实现 + 设计模式 +
            项目经验 + 综合场景题 + 简历深度 + AI前端
            核心面试题库，涵盖语义化、盒模型、闭包、原型链、异步编程、ES6+、泛型、响应式原理、HTTP协议、Webpack、Vite、CI/CD、排序算法、观察者模式、工厂模式、代理模式、大文件上传、协同编辑、骨架屏、状态机、性能监控、Kuikly跨端、Node
            Canvas、OAuth2.0、低代码平台、LLM接入、Prompt Engineering、RAG、AI
            Agent 等多个领域。
            <br class="hidden sm:block" />
            逐题练习、实时作答，助你自信迎接每一场面试。
          </p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
          >
            <button
              @click="startInterview"
              class="group relative w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-nuxt-green text-nuxt-dark font-bold rounded-xl text-base sm:text-lg hover:bg-nuxt-green-400 transition-all duration-300 shadow-lg shadow-nuxt-green/20 hover:shadow-nuxt-green/40 hover:scale-105"
            >
              {{ lastIndex > 0 ? '继续面试' : '开始面试' }}
              <svg
                class="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <button
              @click="managerVisible = true"
              class="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-base sm:text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-nuxt-green/30 hover:text-nuxt-green"
            >
              <svg
                class="inline-block w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              题目管理
            </button>
          </div>

          <!-- Last Progress Hint -->
          <div v-if="lastIndex > 0" class="mb-8 sm:mb-10">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm"
            >
              <svg
                class="w-4 h-4 text-nuxt-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                上次看到第
                <span class="text-nuxt-green font-semibold">{{
                  lastIndex + 1
                }}</span>
                题，点击继续面试将自动跳转
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto"
          >
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              class="text-center p-3 sm:p-0 rounded-xl bg-white/50 dark:bg-transparent sm:bg-transparent border border-gray-200/50 dark:border-transparent sm:border-transparent"
            >
              <div
                class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1"
              >
                {{ stat.value }}
              </div>
              <div
                class="text-[10px] sm:text-xs md:text-sm text-gray-400 dark:text-gray-500"
              >
                {{ stat.label }}
              </div>
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
          :favorites-map="favoritesMap"
          @select="selectQuestion"
          @toggle-favorite="toggleFavorite"
        />

        <!-- Main Area -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Progress Bar -->
          <ProgressBar
            :total="questions.length"
            :answered="answeredCount"
            :current="currentIndex + 1"
          />

          <!-- Content: 题目详情占据主视觉，作答区域改为抽屉按需打开 -->
          <div class="flex-1 flex overflow-hidden">
            <QuestionPanel
              :question="currentQuestion"
              :index="currentIndex"
              :total="questions.length"
            />
          </div>
        </div>
      </div>

      <!-- Interview Area (Mobile) -->
      <div
        v-if="started"
        class="md:hidden flex flex-col h-[calc(100vh-3.5rem)]"
      >
        <!-- Mobile Progress Bar -->
        <ProgressBar
          :total="questions.length"
          :answered="answeredCount"
          :current="currentIndex + 1"
        />

        <!-- Mobile Content: 题目详情占据主视觉 -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-y-auto">
            <QuestionPanel
              :question="currentQuestion"
              :index="currentIndex"
              :total="questions.length"
            />
          </div>
          <!-- Mobile Bottom Navigation -->
          <div
            class="shrink-0 px-3 py-2.5 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-nuxt-dark-100/50 flex items-center gap-2.5"
          >
            <button
              @click="prevQuestion"
              :disabled="currentIndex === 0"
              class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
              :class="
                currentIndex === 0
                  ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 active:scale-95'
              "
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              上一题
            </button>
            <span
              class="text-xs text-gray-400 dark:text-gray-500 font-medium shrink-0 tabular-nums"
            >
              {{ currentIndex + 1 }} / {{ questions.length }}
            </span>
            <button
              @click="nextQuestion"
              :disabled="currentIndex === questions.length - 1"
              class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
              :class="
                currentIndex === questions.length - 1
                  ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 active:scale-95'
              "
            >
              下一题
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Answer Drawer Overlay -->
      <Transition name="fade">
        <div
          v-if="answerDrawerOpen && started"
          class="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          @click="answerDrawerOpen = false"
        ></div>
      </Transition>

      <!-- Answer Drawer (Desktop: 右侧滑入 / Mobile: 底部滑起) -->
      <Transition :name="isMobileScreenReactive ? 'slide-up' : 'slide-right'">
        <div
          v-if="answerDrawerOpen && started"
          class="fixed z-[71] bg-white dark:bg-nuxt-dark shadow-2xl flex flex-col overflow-hidden"
          :class="
            isMobileScreenReactive
              ? 'left-0 right-0 bottom-0 h-[88vh] rounded-t-2xl border-t border-gray-200 dark:border-white/10'
              : 'top-0 right-0 bottom-0 w-[480px] max-w-[95vw] border-l border-gray-200 dark:border-white/10'
          "
        >
          <!-- Mobile drag handle -->
          <div
            v-if="isMobileScreenReactive"
            class="pt-2 pb-1 flex items-center justify-center"
          >
            <span
              class="w-10 h-1 rounded-full bg-gray-300 dark:bg-white/20"
            ></span>
          </div>
          <AnswerPanel
            :question="currentQuestion"
            :answer="currentAnswer"
            @update:answer="updateAnswer"
            @prev="prevQuestion"
            @next="nextQuestion"
            @submit="handleAnswerSubmit"
            :is-first="currentIndex === 0"
            :is-last="currentIndex === questions.length - 1"
            :is-answered="!!answeredMap[currentIndex]"
            :is-mobile="isMobileScreenReactive"
            :show-close="true"
            @close="answerDrawerOpen = false"
          />
        </div>
      </Transition>

      <!-- Mobile Question Drawer Overlay -->
      <Transition name="fade">
        <div
          v-if="drawerOpen && started"
          class="drawer-overlay md:hidden"
          @click="drawerOpen = false"
        ></div>
      </Transition>

      <!-- Mobile Question Drawer -->
      <Transition name="slide-left">
        <div
          v-if="drawerOpen && started"
          class="fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-xs md:hidden"
        >
          <QuestionList
            ref="mobileQuestionListRef"
            :questions="questions"
            :current-index="currentIndex"
            :answered-map="answeredMap"
            :favorites-map="favoritesMap"
            @select="
              (idx: number) => {
                selectQuestion(idx);
                drawerOpen = false;
              }
            "
            @toggle-favorite="toggleFavorite"
            :is-mobile="true"
          />
        </div>
      </Transition>
    </div>

    <!-- Floating Action Buttons (when in interview mode, draggable) -->
    <div
      v-if="started"
      ref="floatingBtnRef"
      @mousedown="onFabMouseDown"
      @touchstart.passive="onFabTouchStart"
      class="fixed z-[60] flex items-center gap-2 select-none"
      :class="{ 'cursor-grabbing': fabDragging, 'cursor-grab': !fabDragging }"
      :style="
        fabInitialized
          ? { left: fabPos.left + 'px', top: fabPos.top + 'px' }
          : { bottom: '16px', right: fabDefaultRight }
      "
    >
      <!-- Favorite Button -->
      <button
        @click.stop="onFavClick"
        class="w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group/fav"
        :class="
          favoritesMap[currentIndex]
            ? 'bg-amber-400 text-white shadow-amber-400/30 hover:shadow-amber-400/50 hover:scale-110'
            : 'bg-white dark:bg-nuxt-dark-50 text-gray-400 dark:text-gray-500 shadow-black/10 dark:shadow-black/30 hover:text-amber-400 dark:hover:text-amber-400 hover:shadow-amber-400/20 hover:scale-110 border border-gray-200 dark:border-white/10'
        "
        :title="favoritesMap[currentIndex] ? '取消收藏' : '收藏当前题目'"
      >
        <svg
          class="w-5 h-5 transition-transform group-hover/fav:scale-110 pointer-events-none"
          :fill="favoritesMap[currentIndex] ? 'currentColor' : 'none'"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      </button>
      <!-- Answer Button (打开作答抽屉) -->
      <button
        @click.stop="onAnswerClick"
        class="relative w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group/ans hover:scale-110"
        :class="
          answerDrawerOpen
            ? 'bg-nuxt-green text-nuxt-dark shadow-nuxt-green/40'
            : 'bg-white dark:bg-nuxt-dark-50 text-gray-500 dark:text-gray-400 shadow-black/10 dark:shadow-black/30 hover:text-nuxt-green dark:hover:text-nuxt-green hover:shadow-nuxt-green/20 border border-gray-200 dark:border-white/10'
        "
        :title="answerDrawerOpen ? '关闭作答' : '打开作答区域'"
      >
        <svg
          class="w-5 h-5 transition-transform group-hover/ans:scale-110 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <span
          v-if="!!answeredMap[currentIndex]"
          class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-nuxt-green border-2 border-white dark:border-nuxt-dark"
          title="已作答"
        ></span>
      </button>
      <!-- Edit Button -->
      <button
        @click.stop="onEditClick"
        class="w-12 h-12 rounded-full bg-nuxt-green text-nuxt-dark shadow-lg shadow-nuxt-green/30 hover:shadow-nuxt-green/50 transition-all duration-300 flex items-center justify-center group/edit hover:scale-110"
        title="题目管理"
      >
        <svg
          class="w-5 h-5 group-hover/edit:rotate-12 transition-transform pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>
    </div>

    <!-- Question Manager Modal -->
    <QuestionManager
      :visible="managerVisible"
      :questions="questions"
      :current-question-index="started ? currentIndex : undefined"
      @close="managerVisible = false"
      @update:questions="handleUpdateQuestions"
    />

    <!-- Footer (only on landing page) -->
    <footer
      v-if="!started"
      class="border-t border-gray-200 dark:border-white/5 py-6 sm:py-8"
    >
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
          由
          <a href="https://with.woa.com/" style="color: #8a2be2" target="_blank"
            >With</a
          >
          通过自然语言生成
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import InterviewNav from './components/InterviewNav.vue';
import QuestionList from './components/QuestionList.vue';
import QuestionPanel from './components/QuestionPanel.vue';
import AnswerPanel from './components/AnswerPanel.vue';
import ProgressBar from './components/ProgressBar.vue';
import QuestionManager from './components/QuestionManager.vue';
import {
  allQuestions,
  loadLocalQuestions,
  getCachedQuestions,
  saveCachedQuestions,
} from './data';
import type { Question } from './data';

export type { Question };

const STORAGE_KEY_INDEX = 'interview_last_index';
const STORAGE_KEY_ANSWERS = 'interview_answers';
const STORAGE_KEY_FAVORITES = 'interview_favorites';

// 默认展示全部题目，不再区分精简版 / 完整版
const filteredQuestions = [...allQuestions];

const started = ref(false);
const drawerOpen = ref(false);
const managerVisible = ref(false);
const loading = ref(true);
const dataSourceToast = ref(false);
const dataSourceInfo = ref({ fromCache: false });
// 作答抽屉默认隐藏，需手动点击右下角“作答”按钮打开
const answerDrawerOpen = ref(false);
// 响应式的移动端屏幕判定，供抽屉方向、AnswerPanel is-mobile 使用
const isMobileScreenReactive = ref(false);
const updateMobileState = () => {
  isMobileScreenReactive.value = window.innerWidth < 768;
};
const questionListRef = ref<InstanceType<typeof QuestionList> | null>(null);
const mobileQuestionListRef = ref<InstanceType<typeof QuestionList> | null>(
  null,
);
const floatingBtnRef = ref<HTMLDivElement | null>(null);

// 浮动按钮可拖拽逻辑
const fabPos = ref({ left: -1, top: -1 }); // -1 表示未初始化，使用默认位置
const fabInitialized = ref(false);
const fabDragging = ref(false);
let fabStartX = 0;
let fabStartY = 0;
let fabStartLeft = 0;
let fabStartTop = 0;
let fabMoved = false;

// 初始化浮动按钮位置（右下角）
// 判断是否为移动端（与 md 断点 768px 一致）
const isMobileScreen = () => window.innerWidth < 768;

// 作答区域已改为抽屉，右侧不再占据固定宽度，堆叠按钮默认就紧贴右下角
const fabDefaultRight = computed(() => (isMobileScreen() ? '16px' : '24px'));

const FAB_CONTAINER_WIDTH = 172; // 48 * 3 + 8 * 2
const FAB_CONTAINER_HEIGHT = 48;

const initFabPos = () => {
  if (!fabInitialized.value) {
    const rightOffset = isMobileScreen() ? 16 : 24;
    fabPos.value = {
      left: window.innerWidth - rightOffset - FAB_CONTAINER_WIDTH,
      top: window.innerHeight - 16 - FAB_CONTAINER_HEIGHT,
    };
    fabInitialized.value = true;
  }
};

const onFabMouseDown = (e: MouseEvent) => {
  initFabPos();
  fabMoved = false;
  fabDragging.value = true;
  fabStartX = e.clientX;
  fabStartY = e.clientY;
  fabStartLeft = fabPos.value.left;
  fabStartTop = fabPos.value.top;
  document.addEventListener('mousemove', onFabMouseMove);
  document.addEventListener('mouseup', onFabMouseUp);
  e.preventDefault();
};

const onFabMouseMove = (e: MouseEvent) => {
  const dx = e.clientX - fabStartX;
  const dy = e.clientY - fabStartY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) fabMoved = true;
  const newLeft = Math.max(
    8,
    Math.min(window.innerWidth - FAB_CONTAINER_WIDTH - 8, fabStartLeft + dx),
  );
  const newTop = Math.max(
    8,
    Math.min(window.innerHeight - FAB_CONTAINER_HEIGHT - 8, fabStartTop + dy),
  );
  fabPos.value = { left: newLeft, top: newTop };
};

const onFabMouseUp = () => {
  fabDragging.value = false;
  document.removeEventListener('mousemove', onFabMouseMove);
  document.removeEventListener('mouseup', onFabMouseUp);
};

const onFabTouchStart = (e: TouchEvent) => {
  if (e.touches.length !== 1) return;
  initFabPos();
  fabMoved = false;
  fabDragging.value = true;
  const touch = e.touches[0];
  fabStartX = touch.clientX;
  fabStartY = touch.clientY;
  fabStartLeft = fabPos.value.left;
  fabStartTop = fabPos.value.top;
  document.addEventListener('touchmove', onFabTouchMove, { passive: false });
  document.addEventListener('touchend', onFabTouchEnd);
};

const onFabTouchMove = (e: TouchEvent) => {
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  const dx = touch.clientX - fabStartX;
  const dy = touch.clientY - fabStartY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) fabMoved = true;
  const newLeft = Math.max(
    8,
    Math.min(window.innerWidth - FAB_CONTAINER_WIDTH - 8, fabStartLeft + dx),
  );
  const newTop = Math.max(
    8,
    Math.min(window.innerHeight - FAB_CONTAINER_HEIGHT - 8, fabStartTop + dy),
  );
  fabPos.value = { left: newLeft, top: newTop };
  e.preventDefault();
};

const onFabTouchEnd = () => {
  fabDragging.value = false;
  document.removeEventListener('touchmove', onFabTouchMove);
  document.removeEventListener('touchend', onFabTouchEnd);
};

// 统计数据（加载完成后会按实际数据刷新）
const initialCategories = new Set(filteredQuestions.map((q) => q.category));
const heroStats = ref([
  { value: String(filteredQuestions.length), label: '面试题目' },
  { value: `${initialCategories.size}大领域`, label: '题目分类' },
  { value: '3级', label: '难度梯度' },
  { value: '实时', label: '即时作答' },
]);

const questions = ref<Question[]>(filteredQuestions);

// 兼容读取：历史版本曾把进度/答案/收藏存在带 _full / _lite 后缀的 key 上
// 首次命中旧 key 时迁移到统一 key，避免用户进度丢失
const readWithLegacy = (key: string): string | null => {
  for (const k of [key, key + '_full', key + '_lite']) {
    const value = localStorage.getItem(k);
    if (value !== null) {
      if (k !== key) {
        localStorage.setItem(key, value);
        localStorage.removeItem(k);
      }
      return value;
    }
  }
  return null;
};

// Restore last viewed index from localStorage
const savedIndex = parseInt(readWithLegacy(STORAGE_KEY_INDEX) || '0', 10);
const lastIndex = ref(
  isNaN(savedIndex) ? 0 : Math.min(savedIndex, filteredQuestions.length - 1),
);

const currentIndex = ref(0);

// Restore answers from localStorage
const savedAnswers = readWithLegacy(STORAGE_KEY_ANSWERS);
const answeredMap = ref<Record<number, string>>(
  savedAnswers ? JSON.parse(savedAnswers) : {},
);

// Restore favorites from localStorage (stores question IDs)
const savedFavorites = readWithLegacy(STORAGE_KEY_FAVORITES);
const favoritesMap = ref<Record<number, boolean>>(
  savedFavorites ? JSON.parse(savedFavorites) : {},
);

const toggleFavorite = (globalIndex: number) => {
  if (favoritesMap.value[globalIndex]) {
    delete favoritesMap.value[globalIndex];
  } else {
    favoritesMap.value[globalIndex] = true;
  }
  // Trigger reactivity
  favoritesMap.value = { ...favoritesMap.value };
};

// Click handlers for floating buttons (skip if user was dragging)
const onFavClick = () => {
  if (fabMoved) return;
  toggleFavorite(currentIndex.value);
};

const onEditClick = () => {
  if (fabMoved) return;
  managerVisible.value = true;
};

// 点击右下角“作答”按钮：切换抽屉开关
const onAnswerClick = () => {
  if (fabMoved) return;
  answerDrawerOpen.value = !answerDrawerOpen.value;
};

// 提交后关闭抽屉，方便继续浏览题目详情
const handleAnswerSubmit = () => {
  submitAnswer();
  answerDrawerOpen.value = false;
};

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const currentAnswer = computed(
  () => answeredMap.value[currentIndex.value] || '',
);
const answeredCount = computed(() => Object.keys(answeredMap.value).length);

// Persist currentIndex to localStorage whenever it changes
watch(currentIndex, (newIdx) => {
  localStorage.setItem(STORAGE_KEY_INDEX, String(newIdx));
  lastIndex.value = newIdx;
});

// Persist answers to localStorage whenever they change (debounced to avoid jank)
let answerSaveTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  answeredMap,
  (newMap) => {
    if (answerSaveTimer) clearTimeout(answerSaveTimer);
    answerSaveTimer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(newMap));
    }, 500);
  },
  { deep: true },
);

// Persist favorites to localStorage whenever they change
watch(
  favoritesMap,
  (newMap) => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newMap));
  },
  { deep: true },
);

const startInterview = () => {
  started.value = true;
  // Jump to last viewed question
  if (lastIndex.value > 0 && lastIndex.value < questions.value.length) {
    currentIndex.value = lastIndex.value;
  }
  // Ensure question list scrolls to the current question after render
  nextTick(() => {
    setTimeout(() => {
      questionListRef.value?.scrollToQuestion(currentIndex.value);
      mobileQuestionListRef.value?.scrollToQuestion(currentIndex.value);
    }, 150);
  });
};

const goHome = () => {
  started.value = false;
};

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
};

const selectQuestion = (index: number) => {
  currentIndex.value = index;
};

const updateAnswer = (val: string) => {
  answeredMap.value[currentIndex.value] = val;
};

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  }
};

const submitAnswer = () => {
  if (currentAnswer.value.trim()) {
    answeredMap.value[currentIndex.value] = currentAnswer.value;
  }
};

// Esc 关闭作答抽屉
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && answerDrawerOpen.value) {
    answerDrawerOpen.value = false;
  }
};

// Question Manager: handle updates
const STORAGE_KEY_MODIFIED = 'interview_modified_questions';

const handleUpdateQuestions = (newQuestions: Question[]) => {
  questions.value = newQuestions;
  // Note: QuestionManager already handles saving to localStorage internally
  // Adjust currentIndex if it's now out of range
  if (currentIndex.value >= newQuestions.length) {
    currentIndex.value = Math.max(0, newQuestions.length - 1);
  }
};

/**
 * Restore custom question modifications from localStorage on init.
 * Only merges modified/custom questions into the current data,
 * instead of replacing all questions with stale data.
 *
 * 重要：如果源代码中的题目内容已更新（content 变化），则优先使用最新代码版本，
 * 丢弃 localStorage 中的旧修改，避免旧缓存覆盖新内容。
 */
const restoreModifiedQuestions = (baseQuestions: Question[]): Question[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MODIFIED);
    if (!saved) return baseQuestions;

    const parsed = JSON.parse(saved) as Question[];
    if (!Array.isArray(parsed) || parsed.length === 0) return baseQuestions;

    // Build a map of original questions from source code (allQuestions) by ID
    const originalMap = new Map<number, Question>();
    for (const q of allQuestions) {
      originalMap.set(q.id, q);
    }

    // Build a map of saved modifications by ID
    const modifiedMap = new Map<number, Question>();
    for (const q of parsed) {
      modifiedMap.set(q.id, q);
    }

    // Get the set of IDs present in base questions
    const baseIds = new Set(baseQuestions.map((q) => q.id));

    // Track IDs that should be removed from localStorage because source code changed
    const staleIds: number[] = [];

    // Merge: replace matching items in base, keep non-matching base items as-is
    const merged = baseQuestions.map((q) => {
      if (modifiedMap.has(q.id)) {
        const savedQ = modifiedMap.get(q.id)!;
        const originalQ = originalMap.get(q.id);

        // 判断源代码是否更新的逻辑：
        // 比较源码原始内容 (originalQ.content) 与用户保存的修改版本 (savedQ.content)
        // 注意：不能用 q.content 来比较，因为当 baseQuestions 来自缓存时，
        // q.content 可能已经是上次合并后的修改版本，会导致误判。
        //
        // 正确做法：用源码原始内容与 savedQ 中记录的原始内容对比。
        // 如果 savedQ.content === originalQ.content，说明用户并没有真正修改内容，
        // 这种情况不需要特殊处理，直接使用 base 中的版本即可。
        // 如果 savedQ.content !== originalQ.content，说明用户确实修改了内容，应该保留修改。
        // 只有当源码本身发生了变化（通过记录的 _originalContent 字段判断）时，才丢弃旧修改。
        if (originalQ) {
          // 如果 savedQ 中记录了原始内容的哈希/快照，可以精确判断源码是否更新
          // 这里使用简单策略：只要 savedQ.content 与 originalQ.content 不同，
          // 就说明用户做了修改，应该保留用户的修改版本
          if (savedQ.content !== originalQ.content) {
            // 用户确实修改了内容，保留用户修改
            return savedQ;
          } else {
            // savedQ 内容与源码相同，说明没有实质修改，使用 base 版本
            staleIds.push(q.id);
            return q;
          }
        }

        return savedQ;
      }
      return q;
    });

    // Append custom questions (IDs not in base) at the end
    for (const [id, q] of modifiedMap) {
      if (!baseIds.has(id)) {
        merged.push(q);
      }
    }

    // 清理已过期的修改记录
    if (staleIds.length > 0) {
      const updatedModified = parsed.filter((q) => !staleIds.includes(q.id));
      if (updatedModified.length > 0) {
        localStorage.setItem(
          STORAGE_KEY_MODIFIED,
          JSON.stringify(updatedModified),
        );
      } else {
        localStorage.removeItem(STORAGE_KEY_MODIFIED);
      }
      // 同时清理 modifiedIds
      try {
        const modIdsStr = localStorage.getItem('interview_modified_ids');
        if (modIdsStr) {
          const modIds = JSON.parse(modIdsStr) as number[];
          const updatedModIds = modIds.filter((id) => !staleIds.includes(id));
          localStorage.setItem(
            'interview_modified_ids',
            JSON.stringify(updatedModIds),
          );
        }
      } catch {}
      console.log(
        `🧹 [缓存清理] 已清除 ${staleIds.length} 条过期的题目修改记录`,
      );
    }

    return merged;
  } catch {
    return baseQuestions;
  }
};

// 数据加载策略：
// 1. 首次进入：加载本地 JS 文件 → 保存到 localStorage
// 2. 再次进入：先从 localStorage 加载缓存立即显示 → 后台加载本地 JS 文件 → 更新 localStorage
onMounted(() => {
  // 初始化移动端状态 & 监听窗口尺寸变化 & Esc 关闭抽屉
  updateMobileState();
  window.addEventListener('resize', updateMobileState);
  window.addEventListener('keydown', handleKeydown);

  // Step 1: 尝试从 localStorage 读取缓存数据
  const cachedData = getCachedQuestions();

  if (cachedData && cachedData.length > 0) {
    // 有缓存：立即使用缓存数据显示
    const mergedCached = restoreModifiedQuestions(cachedData);
    questions.value = mergedCached;
    dataSourceInfo.value = { fromCache: true };

    // 更新 heroStats
    const cats = new Set(mergedCached.map((q) => q.category));
    heroStats.value[0].value = String(mergedCached.length);
    heroStats.value[1].value = `${cats.size}大领域`;

    // 调整 lastIndex
    if (lastIndex.value >= mergedCached.length) {
      lastIndex.value = Math.max(0, mergedCached.length - 1);
    }

    // 立即取消 loading 遮罩（缓存数据已可用）
    loading.value = false;

    // 显示数据来源提示
    dataSourceToast.value = true;
    setTimeout(() => {
      dataSourceToast.value = false;
    }, 4000);

    // Step 2: 后台异步加载本地 JS 文件数据，加载完成后更新 localStorage
    setTimeout(() => {
      try {
        const localData = loadLocalQuestions();
        const mergedLocal = restoreModifiedQuestions(localData);

        // 更新页面数据
        questions.value = mergedLocal;

        // 更新 heroStats
        const localCats = new Set(mergedLocal.map((q) => q.category));
        heroStats.value[0].value = String(mergedLocal.length);
        heroStats.value[1].value = `${localCats.size}大领域`;

        // 调整 lastIndex
        if (lastIndex.value >= mergedLocal.length) {
          lastIndex.value = Math.max(0, mergedLocal.length - 1);
        }

        // 保存原始数据到 localStorage 缓存（不含用户修改，避免缓存数据与源码不一致）
        saveCachedQuestions(localData);
        console.log('🔄 [后台更新] 本地 JS 数据已加载并更新到 localStorage');
      } catch (err) {
        console.warn('⚠️ 后台加载本地 JS 数据失败，继续使用缓存数据', err);
      }
    }, 100);
  } else {
    // 无缓存（首次进入）：直接加载本地 JS 文件
    try {
      const localData = loadLocalQuestions();
      const mergedLocal = restoreModifiedQuestions(localData);

      questions.value = mergedLocal;
      dataSourceInfo.value = { fromCache: false };

      // 更新 heroStats
      const cats = new Set(mergedLocal.map((q) => q.category));
      heroStats.value[0].value = String(mergedLocal.length);
      heroStats.value[1].value = `${cats.size}大领域`;

      // 调整 lastIndex
      if (lastIndex.value >= mergedLocal.length) {
        lastIndex.value = Math.max(0, mergedLocal.length - 1);
      }

      // 保存原始数据到 localStorage 缓存（不含用户修改，避免缓存数据与源码不一致）
      saveCachedQuestions(localData);
      console.log('✅ [首次加载] 本地 JS 数据已加载并写入 localStorage 缓存');
    } catch (err) {
      console.error('❌ 数据加载失败，使用打包内数据', err);
      const mergedFallback = restoreModifiedQuestions(filteredQuestions);
      questions.value = mergedFallback;
    } finally {
      loading.value = false;
      // 显示数据来源提示
      dataSourceToast.value = true;
      setTimeout(() => {
        dataSourceToast.value = false;
      }, 4000);
    }
  }
});
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

/* 作答抽屉：桌面端从右侧滑入 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* 作答抽屉：移动端从底部滑起 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
