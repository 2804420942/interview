<template>
  <aside class="h-full flex flex-col overflow-hidden shrink-0"
    :class="isMobile
      ? 'w-full bg-white dark:bg-nuxt-dark-100'
      : 'w-72 border-r border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-nuxt-dark-100/50'">
    <!-- Header -->
    <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-white/5">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-4 h-4 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
        </svg>
        <span class="text-sm font-semibold text-gray-900 dark:text-white">题目列表</span>
        <span class="ml-auto text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">{{ questions.length }} 题</span>
        <!-- Mobile close button -->
        <button v-if="isMobile" @click="$emit('select', currentIndex)" class="ml-1 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchText"
          type="text"
          placeholder="搜索标题、答案内容..."
          class="w-full pl-9 pr-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 transition-all"
        />
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-1 px-3 sm:px-4 py-2.5 border-b border-gray-200 dark:border-white/5 flex-wrap">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        @click="activeFilter = tab.value"
        class="px-2.5 py-1 text-xs rounded-md font-medium transition-all"
        :class="activeFilter === tab.value 
          ? 'bg-nuxt-green/15 text-nuxt-green border border-nuxt-green/20' 
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Category Tabs (horizontal scrollable with drag support) -->
    <div class="border-b border-gray-200 dark:border-white/5">
      <div
        ref="categoryScrollRef"
        class="flex items-center overflow-x-auto px-2 py-2 gap-1 category-scroll"
        @mousedown="onCategoryMouseDown"
        @mousemove="onCategoryMouseMove"
        @mouseup="onCategoryMouseUp"
        @mouseleave="onCategoryMouseUp"
        @wheel.prevent="onCategoryWheel"
      >
        <button
          @click="scrollToTop()"
          class="shrink-0 px-2.5 py-1 text-[11px] rounded-md font-medium transition-all whitespace-nowrap"
          :class="activeCategory === 'all'
            ? 'bg-nuxt-green/15 text-nuxt-green border border-nuxt-green/20'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'"
        >
          全部分类
        </button>
        <button
          v-for="cat in allCategories"
          :key="cat"
          @click="scrollToCategory(cat)"
          class="shrink-0 px-2.5 py-1 text-[11px] rounded-md font-medium transition-all whitespace-nowrap"
          :class="activeCategory === cat
            ? 'bg-nuxt-green/15 text-nuxt-green border border-nuxt-green/20'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Question Items with Virtual Scroll -->
    <div ref="listContainerRef" class="flex-1 overflow-y-auto custom-scrollbar" @scroll="onScroll">
      <div :style="{ height: totalHeight + 'px', position: 'relative' }">
        <div :style="{ transform: `translateY(${offsetY}px)`, position: 'absolute', left: 0, right: 0, top: 0 }">
          <template v-for="item in visibleItems" :key="item.type === 'header' ? 'h-' + item.headerIndex : 'q-' + item.question?.id">
            <!-- Category Header -->
            <div v-if="item.type === 'header'"
              class="px-3 pt-3 pb-1.5"
              :style="{ height: HEADER_HEIGHT + 'px' }"
            >
              <div class="flex items-center gap-2">
                <div class="w-1 h-4 rounded-full bg-nuxt-green/60"></div>
                <span class="text-xs font-bold text-gray-900 dark:text-white">{{ item.category }}</span>
                <span class="text-[10px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full">{{ item.count }} 题</span>
              </div>
            </div>
            <!-- Question Item -->
            <button v-else
              @click="handleSelect(item.globalIndex!)"
              class="w-full text-left p-2.5 transition-all duration-200 group flex items-start gap-2.5"
              :style="{ height: ITEM_HEIGHT + 'px' }"
              :class="item.globalIndex === currentIndex 
                ? 'bg-nuxt-green/10' 
                : 'hover:bg-gray-100 dark:hover:bg-white/5'"
            >
              <!-- Number Badge -->
              <div class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                :class="getStatusClass(item.globalIndex!)">
                {{ item.globalIndex! + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-medium truncate leading-5"
                  :class="item.globalIndex === currentIndex ? 'text-nuxt-green' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'">
                  {{ item.question!.title }}
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[9px] px-1 py-0.5 rounded font-medium leading-none"
                    :class="getDifficultyClass(item.question!.difficulty)">
                    {{ getDifficultyLabel(item.question!.difficulty) }}
                  </span>
                  <span class="text-[9px] text-gray-400 dark:text-gray-600 truncate">{{ item.question!.category }}</span>
                </div>
              </div>
              <!-- Status Icon -->
              <div v-if="answeredMap[item.globalIndex!]" class="shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5 text-nuxt-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Footer Signature -->
    <div class="border-t border-gray-200 dark:border-white/5 p-3 text-center">
      <p class="text-[10px] text-gray-400 dark:text-gray-600">
        由 <a href="https://with.woa.com/" style="color: #8A2BE2;" target="_blank">With</a> 通过自然语言生成
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Question {
  id: number
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  tags: string[]
}

interface VirtualItem {
  type: 'header' | 'question'
  category?: string
  count?: number
  question?: Question
  globalIndex?: number
  headerIndex?: number
}

const props = withDefaults(defineProps<{
  questions: Question[]
  currentIndex: number
  answeredMap: Record<number, string>
  isMobile?: boolean
}>(), {
  isMobile: false
})

const emit = defineEmits<{
  select: [index: number]
}>()

const ITEM_HEIGHT = 56
const HEADER_HEIGHT = 40
const BUFFER = 8

const searchText = ref('')
const activeFilter = ref('all')
const activeCategory = ref('all')
const listContainerRef = ref<HTMLDivElement | null>(null)
const categoryScrollRef = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)
const containerHeight = ref(500)

// Category drag scroll state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragScrollLeft = ref(0)

const onCategoryMouseDown = (e: MouseEvent) => {
  if (!categoryScrollRef.value) return
  isDragging.value = true
  dragStartX.value = e.pageX - categoryScrollRef.value.offsetLeft
  dragScrollLeft.value = categoryScrollRef.value.scrollLeft
  categoryScrollRef.value.style.cursor = 'grabbing'
  categoryScrollRef.value.style.userSelect = 'none'
}

const onCategoryMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !categoryScrollRef.value) return
  e.preventDefault()
  const x = e.pageX - categoryScrollRef.value.offsetLeft
  const walk = (x - dragStartX.value) * 1.5
  categoryScrollRef.value.scrollLeft = dragScrollLeft.value - walk
}

const onCategoryMouseUp = () => {
  isDragging.value = false
  if (categoryScrollRef.value) {
    categoryScrollRef.value.style.cursor = 'grab'
    categoryScrollRef.value.style.userSelect = ''
  }
}

const onCategoryWheel = (e: WheelEvent) => {
  if (!categoryScrollRef.value) return
  // Convert vertical scroll to horizontal scroll
  categoryScrollRef.value.scrollLeft += e.deltaY || e.deltaX
}

const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '未答', value: 'unanswered' },
  { label: '已答', value: 'answered' },
]

// Get all unique categories in order
const allCategories = computed(() => {
  const seen = new Set<string>()
  const cats: string[] = []
  for (const q of props.questions) {
    if (!seen.has(q.category)) {
      seen.add(q.category)
      cats.push(q.category)
    }
  }
  return cats
})

// Filter questions
const filteredQuestions = computed(() => {
  let list = props.questions.map((q, idx) => ({ question: q, globalIndex: idx }))

  if (searchText.value) {
    const keyword = searchText.value.toLowerCase()
    list = list.filter(({ question: q }) =>
      q.title.toLowerCase().includes(keyword) ||
      q.category.toLowerCase().includes(keyword) ||
      q.tags.some(t => t.toLowerCase().includes(keyword)) ||
      q.content.toLowerCase().includes(keyword)
    )
  }

  if (activeFilter.value === 'answered') {
    list = list.filter(({ globalIndex }) => props.answeredMap[globalIndex])
  } else if (activeFilter.value === 'unanswered') {
    list = list.filter(({ globalIndex }) => !props.answeredMap[globalIndex])
  }

  return list
})

// Build flat list with category headers (grouped by category)
const flatItems = computed<VirtualItem[]>(() => {
  const items: VirtualItem[] = []

  // Group by category while preserving the first-seen order
  const categoryOrder: string[] = []
  const categoryMap: Record<string, { question: Question; globalIndex: number }[]> = {}

  for (const entry of filteredQuestions.value) {
    const cat = entry.question.category
    if (!categoryMap[cat]) {
      categoryMap[cat] = []
      categoryOrder.push(cat)
    }
    categoryMap[cat].push(entry)
  }

  let headerIdx = 0
  for (const cat of categoryOrder) {
    const group = categoryMap[cat]
    items.push({
      type: 'header',
      category: cat,
      count: group.length,
      headerIndex: headerIdx++,
    })
    for (const { question, globalIndex } of group) {
      items.push({
        type: 'question',
        question,
        globalIndex,
      })
    }
  }

  return items
})

// Calculate positions for virtual scroll (variable height: headers vs items)
const itemPositions = computed(() => {
  const positions: { top: number; height: number }[] = []
  let top = 0
  for (const item of flatItems.value) {
    const h = item.type === 'header' ? HEADER_HEIGHT : ITEM_HEIGHT
    positions.push({ top, height: h })
    top += h
  }
  return positions
})

const totalHeight = computed(() => {
  if (itemPositions.value.length === 0) return 0
  const last = itemPositions.value[itemPositions.value.length - 1]
  return last.top + last.height
})

// Binary search to find start index
const findStartIndex = (scrollTop: number): number => {
  const positions = itemPositions.value
  let low = 0
  let high = positions.length - 1
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (positions[mid].top + positions[mid].height <= scrollTop) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return Math.max(0, low - BUFFER)
}

const startIndex = computed(() => findStartIndex(scrollTop.value))

const endIndex = computed(() => {
  const positions = itemPositions.value
  const bottom = scrollTop.value + containerHeight.value
  let idx = startIndex.value
  while (idx < positions.length && positions[idx].top < bottom) {
    idx++
  }
  return Math.min(positions.length, idx + BUFFER)
})

const offsetY = computed(() => {
  if (startIndex.value >= itemPositions.value.length) return 0
  return itemPositions.value[startIndex.value].top
})

const visibleItems = computed(() => {
  return flatItems.value.slice(startIndex.value, endIndex.value)
})

const onScroll = () => {
  if (listContainerRef.value) {
    scrollTop.value = listContainerRef.value.scrollTop
    // Update active category based on scroll position
    updateActiveCategoryByScroll()
  }
}

// Track which category header is currently visible at the top of the list
const updateActiveCategoryByScroll = () => {
  const currentScroll = scrollTop.value
  // Find the last header that is at or above the current scroll position
  let lastVisibleCategory = 'all'
  for (let i = 0; i < flatItems.value.length; i++) {
    const item = flatItems.value[i]
    if (item.type === 'header' && i < itemPositions.value.length) {
      if (itemPositions.value[i].top <= currentScroll + 10) {
        lastVisibleCategory = item.category || 'all'
      } else {
        break
      }
    }
  }
  // Only update if at top, set to 'all'
  if (currentScroll < 10) {
    activeCategory.value = 'all'
  } else {
    activeCategory.value = lastVisibleCategory
  }
}

// Update container height on mount and resize
const updateContainerHeight = () => {
  if (listContainerRef.value) {
    containerHeight.value = listContainerRef.value.clientHeight
  }
}

let resizeObserver: ResizeObserver | null = null

import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  updateContainerHeight()
  if (listContainerRef.value) {
    resizeObserver = new ResizeObserver(() => updateContainerHeight())
    resizeObserver.observe(listContainerRef.value)
  }
  // Auto-scroll to current question on mount
  nextTick(() => {
    setTimeout(() => {
      scrollToQuestion(props.currentIndex)
    }, 100)
  })
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

// Scroll to current question when it changes externally
const scrollToQuestion = (globalIndex: number) => {
  const flatIdx = flatItems.value.findIndex(
    item => item.type === 'question' && item.globalIndex === globalIndex
  )
  if (flatIdx >= 0 && flatIdx < itemPositions.value.length && listContainerRef.value) {
    const targetTop = itemPositions.value[flatIdx].top
    const viewBottom = listContainerRef.value.scrollTop + containerHeight.value
    if (targetTop < listContainerRef.value.scrollTop || targetTop > viewBottom - ITEM_HEIGHT) {
      listContainerRef.value.scrollTop = Math.max(0, targetTop - containerHeight.value / 3)
    }
  }
}

watch(() => props.currentIndex, (newIdx) => {
  nextTick(() => scrollToQuestion(newIdx))
})

// When search text changes (especially when cleared), scroll to current question
watch(searchText, () => {
  nextTick(() => {
    setTimeout(() => {
      scrollToQuestion(props.currentIndex)
    }, 50)
  })
})

// When filter tab changes, scroll to current question
watch(activeFilter, () => {
  nextTick(() => {
    setTimeout(() => {
      scrollToQuestion(props.currentIndex)
    }, 50)
  })
})

const handleSelect = (globalIndex: number) => {
  emit('select', globalIndex)
}

const getStatusClass = (idx: number) => {
  if (idx === props.currentIndex) return 'bg-nuxt-green/20 text-nuxt-green'
  if (props.answeredMap[idx]) return 'bg-nuxt-green/10 text-nuxt-green/70'
  return 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'
}

const getDifficultyClass = (diff: string) => {
  switch (diff) {
    case 'easy': return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
    case 'medium': return 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
    case 'hard': return 'bg-red-500/10 text-red-500 dark:text-red-400'
    default: return 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'
  }
}

const getDifficultyLabel = (diff: string) => {
  switch (diff) {
    case 'easy': return '简单'
    case 'medium': return '中等'
    case 'hard': return '困难'
    default: return diff
  }
}

const scrollToTop = () => {
  activeCategory.value = 'all'
  if (listContainerRef.value) {
    listContainerRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const scrollToCategory = (category: string) => {
  activeCategory.value = category
  const headerIdx = flatItems.value.findIndex(
    item => item.type === 'header' && item.category === category
  )
  if (headerIdx >= 0 && headerIdx < itemPositions.value.length && listContainerRef.value) {
    const targetTop = itemPositions.value[headerIdx].top
    listContainerRef.value.scrollTo({ top: targetTop, behavior: 'smooth' })
  }
}

defineExpose({ scrollToQuestion })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.category-scroll {
  cursor: grab;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,220,130,0.3) transparent;
}
.category-scroll::-webkit-scrollbar {
  height: 3px;
}
.category-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.category-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,220,130,0.3);
  border-radius: 3px;
}
.category-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0,220,130,0.5);
}
</style>