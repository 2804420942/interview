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
    <div ref="scrollContainer" class="flex-1 overflow-y-auto custom-scrollbar">
      <div class="p-4 sm:p-6">
        <div class="prose-content" v-html="renderedContent" @click="handleContentClick"></div>
      </div>
    </div>

    <!-- Mermaid 全屏查看弹窗 -->
    <Teleport to="body">
      <Transition name="mermaid-modal">
        <div
          v-if="mermaidModalVisible"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          @click.self="closeMermaidModal"
        >
          <div class="relative w-[95vw] h-[90vh] max-w-[1400px] bg-white dark:bg-nuxt-dark-50 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden">
            <!-- 弹窗头部 -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-nuxt-dark-100/50 shrink-0">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">流程图预览</span>
              </div>
              <!-- 缩放控制栏 -->
              <div class="flex items-center gap-1.5">
                <button
                  @click="zoomScale = Math.max(MIN_ZOOM, zoomScale - ZOOM_STEP * zoomScale)"
                  class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                  title="缩小"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
                  </svg>
                </button>
                <button
                  @click="resetZoom"
                  class="px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-mono font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors min-w-[52px] text-center"
                  title="重置缩放"
                >
                  {{ zoomPercent }}%
                </button>
                <button
                  @click="zoomScale = Math.min(MAX_ZOOM, zoomScale + ZOOM_STEP * zoomScale)"
                  class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                  title="放大"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                  </svg>
                </button>
                <button
                  @click="fitToView"
                  class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                  title="适应窗口"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                </button>
                <div class="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1"></div>
                <button
                  @click="closeMermaidModal"
                  class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                  title="关闭"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <!-- 弹窗内容（支持缩放和拖拽） -->
            <div
              ref="zoomContainerRef"
              class="flex-1 overflow-hidden mermaid-modal-body relative"
              @wheel.prevent="handleWheelZoom"
              @mousedown="handleDragStart"
              @dblclick="resetZoom"
            >
              <div
                class="mermaid-modal-svg mermaid-zoom-content"
                :style="zoomTransformStyle"
                v-html="mermaidModalSvg"
              ></div>
              <!-- 缩放提示（首次打开时短暂显示） -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 dark:bg-white/10 text-white text-xs backdrop-blur-sm pointer-events-none select-none opacity-60">
                滚轮缩放 · 拖拽平移 · 双击重置
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { parseMermaidGraph } from '@/composables/flowchartParser'
import { renderFlowchartSVG } from '@/composables/flowchartRenderer'
import { isSequenceDiagram, renderSequenceDiagramSVG } from '@/composables/sequenceDiagramRenderer'
import {
  renderMarkdown,
  handleCodeCopyClick,
  decodeBase64,
  escapeHtml,
} from '@/composables/markdownRenderer'

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

const scrollContainer = ref<HTMLElement | null>(null)

// Mermaid 全屏弹窗状态
const mermaidModalVisible = ref(false)
const mermaidModalSvg = ref('')

// 缩放相关状态
const zoomScale = ref(1)
const zoomTranslateX = ref(0)
const zoomTranslateY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const dragStartTranslateX = ref(0)
const dragStartTranslateY = ref(0)
const zoomContainerRef = ref<HTMLElement | null>(null)

const MIN_ZOOM = 0.2
const MAX_ZOOM = 5
const ZOOM_STEP = 0.15

const openMermaidModal = (svgContent: string) => {
  mermaidModalSvg.value = svgContent
  mermaidModalVisible.value = true
  // 重置缩放状态
  zoomScale.value = 1
  zoomTranslateX.value = 0
  zoomTranslateY.value = 0
  // 禁止背景滚动
  document.body.style.overflow = 'hidden'
}

const closeMermaidModal = () => {
  mermaidModalVisible.value = false
  mermaidModalSvg.value = ''
  // 恢复背景滚动
  document.body.style.overflow = ''
}

// 缩放百分比显示
const zoomPercent = computed(() => Math.round(zoomScale.value * 100))

// 鼠标滚轮缩放处理（以鼠标位置为中心缩放）
const handleWheelZoom = (e: WheelEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const container = zoomContainerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  // 鼠标相对于容器的位置
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const oldScale = zoomScale.value
  const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
  const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldScale + delta * oldScale))

  if (newScale === oldScale) return

  // 以鼠标位置为中心进行缩放
  const scaleRatio = newScale / oldScale
  zoomTranslateX.value = mouseX - scaleRatio * (mouseX - zoomTranslateX.value)
  zoomTranslateY.value = mouseY - scaleRatio * (mouseY - zoomTranslateY.value)
  zoomScale.value = newScale
}

// 重置缩放
const resetZoom = () => {
  zoomScale.value = 1
  zoomTranslateX.value = 0
  zoomTranslateY.value = 0
}

// 适应窗口大小
const fitToView = () => {
  const container = zoomContainerRef.value
  if (!container) return
  const svgEl = container.querySelector('svg')
  if (!svgEl) return

  const containerRect = container.getBoundingClientRect()
  const svgWidth = svgEl.getAttribute('width') ? parseFloat(svgEl.getAttribute('width')!) : svgEl.getBoundingClientRect().width
  const svgHeight = svgEl.getAttribute('height') ? parseFloat(svgEl.getAttribute('height')!) : svgEl.getBoundingClientRect().height

  if (svgWidth === 0 || svgHeight === 0) return

  const scaleX = (containerRect.width - 40) / svgWidth
  const scaleY = (containerRect.height - 40) / svgHeight
  const newScale = Math.min(scaleX, scaleY, 2) // 最大不超过200%

  zoomScale.value = newScale
  // 居中显示
  zoomTranslateX.value = (containerRect.width - svgWidth * newScale) / 2
  zoomTranslateY.value = (containerRect.height - svgHeight * newScale) / 2
}

// 拖拽平移处理
const handleDragStart = (e: MouseEvent) => {
  // 只响应左键
  if (e.button !== 0) return
  isDragging.value = true
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  dragStartTranslateX.value = zoomTranslateX.value
  dragStartTranslateY.value = zoomTranslateY.value
  e.preventDefault()
}

const handleDragMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  const dx = e.clientX - dragStartX.value
  const dy = e.clientY - dragStartY.value
  zoomTranslateX.value = dragStartTranslateX.value + dx
  zoomTranslateY.value = dragStartTranslateY.value + dy
}

const handleDragEnd = () => {
  isDragging.value = false
}

// 缩放变换样式
const zoomTransformStyle = computed(() => ({
  transform: `translate(${zoomTranslateX.value}px, ${zoomTranslateY.value}px) scale(${zoomScale.value})`,
  transformOrigin: '0 0',
  cursor: isDragging.value ? 'grabbing' : 'grab',
  transition: isDragging.value ? 'none' : 'transform 0.15s ease-out',
}))

// 监听 ESC 键关闭弹窗
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && mermaidModalVisible.value) {
    closeMermaidModal()
  }
}

/**
 * 从 Base64 编码的字符串中解码出原始 Mermaid 代码
 */
const decodeMermaidCode = decodeBase64

/**
 * 使用自定义 dagre 渲染器渲染流程图，或使用时序图渲染器
 * 替代 Mermaid，彻底解决重复节点、连线丢失、文字消失等问题
 */
const renderFlowchart = (code: string): string | null => {
  // 先尝试时序图
  if (isSequenceDiagram(code)) {
    return renderSequenceDiagramSVG(code, isDark.value)
  }
  // 再尝试流程图
  const data = parseMermaidGraph(code)
  if (!data) return null
  return renderFlowchartSVG(data, isDark.value)
}

// 渲染页面中的流程图（使用自定义 dagre 渲染器）
let renderRAF: number | null = null
const renderMermaidDiagrams = () => {
  // 使用 requestAnimationFrame 避免阻塞主线程
  if (renderRAF) cancelAnimationFrame(renderRAF)
  renderRAF = requestAnimationFrame(() => {
    renderRAF = null
    if (!scrollContainer.value) return

    const mermaidElements = scrollContainer.value.querySelectorAll('.mermaid-pending')
    for (const el of mermaidElements) {
      const encodedCode = el.getAttribute('data-mermaid-code')
      if (!encodedCode) continue

      const code = decodeMermaidCode(encodedCode)

      try {
        const svgResult = renderFlowchart(code)

        if (svgResult) {
          el.innerHTML = `<div class="mermaid-svg-wrap">${svgResult}</div>
            <div class="mermaid-zoom-hint" title="点击放大查看">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
              </svg>
            </div>`
        } else {
          // 解析失败，显示原始代码
          el.innerHTML = `<div class="p-4 text-xs text-amber-500 bg-amber-500/5 border border-amber-500/10 rounded-lg">
            <div class="flex items-center gap-2 mb-2 font-semibold">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              暂不支持此类型图表
            </div>
            <pre class="whitespace-pre-wrap text-gray-400 text-[11px] leading-relaxed">${escapeHtml(code)}</pre>
          </div>`
          el.classList.remove('mermaid-pending')
          continue
        }

        // 保留 data-mermaid-code 属性，以便主题切换时可以重新渲染
        el.setAttribute('data-mermaid-code', encodedCode)
        el.classList.remove('mermaid-pending')
        el.classList.add('mermaid-rendered')

        // 绑定点击放大事件
        el.addEventListener('click', () => {
          const svgEl = el.querySelector('svg')
          if (svgEl) {
            openMermaidModal(svgEl.outerHTML)
          }
        })
        // 设置鼠标样式
        ;(el as HTMLElement).style.cursor = 'pointer'
      } catch (err) {
        console.warn('流程图渲染失败:', err)
        // 渲染失败时显示原始代码
        el.innerHTML = `<div class="p-4 text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg">
          <div class="flex items-center gap-2 mb-2 font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            图表渲染失败
          </div>
          <pre class="whitespace-pre-wrap text-gray-400">${escapeHtml(code)}</pre>
        </div>`
        el.classList.remove('mermaid-pending')
      }
    }
  })
}

// localStorage 统一存储滚动位置的 key
const SCROLL_CACHE_KEY = 'question_scroll_positions'

// 从 localStorage 读取滚动位置缓存对象
const getScrollCache = (): Record<string, number> => {
  try {
    const cached = localStorage.getItem(SCROLL_CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (e) {
    // 解析失败时静默忽略
  }
  return {}
}

// 保存滚动位置到 localStorage（统一对象）
const saveScrollPosition = () => {
  if (!scrollContainer.value || !props.question?.id) return
  const scrollTop = scrollContainer.value.scrollTop
  try {
    const cache = getScrollCache()
    cache[String(props.question.id)] = scrollTop
    localStorage.setItem(SCROLL_CACHE_KEY, JSON.stringify(cache))
  } catch (e) {
    // localStorage 写入失败时静默忽略
  }
}

// 恢复滚动位置
const restoreScrollPosition = (questionId?: number) => {
  if (!scrollContainer.value || !questionId) return
  try {
    const cache = getScrollCache()
    const saved = cache[String(questionId)]
    if (saved !== undefined) {
      scrollContainer.value.scrollTop = saved
    } else {
      scrollContainer.value.scrollTop = 0
    }
  } catch (e) {
    scrollContainer.value.scrollTop = 0
  }
}

// 节流定时器
let scrollTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 代码块「复制」按钮：内容由 v-html 渲染，无法直接绑定，用事件委托处理
 */
const handleContentClick = handleCodeCopyClick

const handleScroll = () => {
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    saveScrollPosition()
  }, 500)
}

// Watch for question changes and restore scroll position
watch(() => props.question?.id, (newId, oldId) => {
  if (newId === oldId) return
  nextTick(() => {
    restoreScrollPosition(newId)
    // 题目切换后重新渲染 Mermaid 图表
    renderMermaidDiagrams()
  })
})

// 监听暗色模式切换，重新渲染流程图
watch(isDark, () => {
  nextTick(() => {
    // 将已渲染的图表重置为待渲染状态
    if (scrollContainer.value) {
      const rendered = scrollContainer.value.querySelectorAll('.mermaid-rendered')
      rendered.forEach(el => {
        const encodedCode = el.getAttribute('data-mermaid-code')
        if (encodedCode) {
          // 清空已渲染的 SVG 内容
          el.innerHTML = `<div class="flex items-center gap-2 text-sm text-gray-400">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            图表加载中...
          </div>`
        }
        el.classList.remove('mermaid-rendered')
        el.classList.add('mermaid-pending')
      })
    }
    renderMermaidDiagrams()
  })
})

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  }
  // 监听键盘事件
  document.addEventListener('keydown', handleKeydown)
  // 监听全局鼠标事件（用于拖拽）
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  // 初始加载时恢复滚动位置
  nextTick(() => {
    restoreScrollPosition(props.question?.id)
    // 初始加载时渲染 Mermaid 图表
    renderMermaidDiagrams()
  })
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  if (scrollTimer) clearTimeout(scrollTimer)
  // 确保关闭弹窗时恢复滚动
  document.body.style.overflow = ''
})

const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
}

defineExpose({ scrollToTop })

const renderedContent = computed(() => {
  if (!props.question?.content) return ''
  let content = props.question.content
  // Remove the leading title (## ...) since it's already shown in the header
  content = content.replace(/^\s*##\s+.+\n+/, '')
  return renderMarkdown(content, { mermaid: true, copyButton: true })
})


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