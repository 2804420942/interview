<template>
  <div
    class="flex flex-col overflow-hidden shrink-0"
    :class="
      isMobile
        ? 'w-full h-full bg-white dark:bg-nuxt-dark-100/20'
        : 'w-full h-full bg-gray-50/50 dark:bg-nuxt-dark-100/20'
    "
  >
    <!-- Answer Header -->
    <div
      class="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span class="text-sm font-semibold text-gray-900 dark:text-white"
          >作答区域</span
        >
        <span
          class="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
          :class="
            mode === 'edit'
              ? 'bg-nuxt-green/10 text-nuxt-green border border-nuxt-green/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10'
          "
        >
          {{ mode === 'edit' ? '编辑中' : '查看' }}
        </span>
      </div>
      <div class="flex items-center gap-1.5">
        <span
          v-if="isAnswered"
          class="inline-flex items-center gap-1 text-[10px] text-nuxt-green bg-nuxt-green/10 px-2 py-0.5 rounded-full border border-nuxt-green/20"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          已作答
        </span>
        <span class="text-[10px] text-gray-400 dark:text-gray-600">
          {{ charCount }} 字
        </span>
        <button
          v-if="showClose"
          @click="$emit('close')"
          class="ml-1 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title="关闭作答区域"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Toolbar (edit mode only) -->
    <div
      v-if="mode === 'edit'"
      class="px-3 sm:px-4 pt-2.5 flex flex-wrap items-center gap-1"
    >
      <button
        v-for="tool in toolbar"
        :key="tool.cmd + (tool.value || '')"
        @mousedown.prevent
        @click="applyCmd(tool.cmd, tool.value)"
        :title="tool.title"
        class="h-7 min-w-[28px] px-1.5 rounded-md text-xs font-semibold flex items-center justify-center transition-colors bg-white dark:bg-white/5 hover:bg-nuxt-green/10 hover:text-nuxt-green text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
      >
        <span v-if="tool.icon" v-html="tool.icon"></span>
        <span v-else :style="tool.style">{{ tool.label }}</span>
      </button>
      <div class="mx-1 h-4 w-px bg-gray-200 dark:bg-white/10"></div>
      <button
        @mousedown.prevent
        @click="clearFormat"
        title="清除格式"
        class="h-7 px-2 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors bg-white dark:bg-white/5 hover:bg-amber-500/10 hover:text-amber-500 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10"
      >
        清除格式
      </button>
      <button
        v-if="hasContent"
        @mousedown.prevent
        @click="clearAnswer"
        title="清空答案"
        class="h-7 px-2 rounded-md text-[11px] font-medium flex items-center justify-center transition-colors bg-white dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 ml-auto"
      >
        清空
      </button>
    </div>

    <!-- Rich Content Area -->
    <div class="flex-1 overflow-hidden flex flex-col p-3 sm:p-4">
      <!-- View Mode -->
      <div v-if="mode === 'view'" class="flex-1 relative flex flex-col">
        <div
          v-if="hasContent"
          class="rich-view flex-1 overflow-y-auto bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-3 sm:p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
          v-html="displayHtml"
          :style="isMobile ? 'min-height: 200px' : ''"
        ></div>
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-center bg-white dark:bg-white/[0.03] border border-dashed border-gray-200 dark:border-white/10 rounded-xl p-6 text-sm text-gray-400 dark:text-gray-500"
          :style="isMobile ? 'min-height: 200px' : ''"
        >
          <svg
            class="w-10 h-10 mb-3 opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <p class="mb-1">还没有作答内容</p>
          <p class="text-xs">点击右下角 “编辑” 开始作答</p>
        </div>
        <button
          @click="enterEdit"
          class="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-nuxt-green/10 text-nuxt-green border border-nuxt-green/20 hover:bg-nuxt-green/20 transition-colors"
          title="进入编辑"
        >
          <svg
            class="w-3.5 h-3.5"
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
          编辑
        </button>
      </div>

      <!-- Edit Mode -->
      <div v-else class="flex-1 relative flex flex-col">
        <div
          ref="editorRef"
          contenteditable="true"
          @input="handleRichInput"
          @paste="handlePaste"
          @blur="handleBlur"
          :data-placeholder="placeholderText"
          class="rich-editor flex-1 overflow-y-auto bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-xl p-3 sm:p-4 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 focus:bg-white dark:focus:bg-white/[0.05] transition-all leading-relaxed"
          :style="isMobile ? 'min-height: 200px' : ''"
        ></div>
        <button
          @click="exitEdit"
          class="absolute top-2 right-2 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
          title="完成编辑"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          完成
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
      <!-- Submit -->
      <button
        @click="$emit('submit')"
        :disabled="!hasContent"
        class="w-full py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300"
        :class="
          hasContent
            ? 'bg-nuxt-green text-nuxt-dark hover:bg-nuxt-green-400 shadow-lg shadow-nuxt-green/20 hover:shadow-nuxt-green/40 hover:scale-[1.02]'
            : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-white/5'
        "
      >
        <svg
          class="w-4 h-4 inline-block mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ isAnswered ? '更新答案' : '提交答案' }}
      </button>

      <!-- Navigation -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('prev')"
          :disabled="isFirst"
          class="flex-1 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
          :class="
            isFirst
              ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
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
        <button
          @click="$emit('next')"
          :disabled="isLast"
          class="flex-1 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
          :class="
            isLast
              ? 'bg-gray-50 dark:bg-white/[0.02] text-gray-300 dark:text-gray-700 cursor-not-allowed border border-gray-100 dark:border-white/[0.03]'
              : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10'
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
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';

interface Question {
  id: number;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  tags: string[];
}

const props = withDefaults(
  defineProps<{
    question: Question | undefined;
    answer: string;
    isFirst: boolean;
    isLast: boolean;
    isAnswered: boolean;
    isMobile?: boolean;
    showClose?: boolean;
  }>(),
  {
    isMobile: false,
    showClose: false,
  },
);

const emit = defineEmits<{
  'update:answer': [val: string];
  prev: [];
  next: [];
  submit: [];
  close: [];
}>();

// 编辑器模式：初始化为查看模式（“编辑完成”状态）
const mode = ref<'view' | 'edit'>('view');
const editorRef = ref<HTMLDivElement | null>(null);

const placeholderText =
  '在此输入你的答案...\n\n💡 提示：可使用工具栏为文本添加加粗、列表、代码等格式';

// 判断字符串是否包含 HTML 标签（用于兼容旧的纯文本答案）
const looksLikeHtml = (s: string): boolean => /<[a-z][\s\S]*>/i.test(s);

// 将纯文本转成简单 HTML（保留换行）
const textToHtml = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .split(/\n{2,}/)
    .map((p) => '<p>' + p.replace(/\n/g, '<br>') + '</p>')
    .join('');
};

// 显示用的 HTML（无论存储的是 HTML 还是纯文本都能正常渲染）
const displayHtml = computed(() => {
  const raw = props.answer || '';
  if (!raw.trim()) return '';
  return looksLikeHtml(raw) ? raw : textToHtml(raw);
});

// 是否有实际内容（去 HTML 标签后判断）
const hasContent = computed(() => {
  const raw = props.answer || '';
  const plain = raw
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return plain.length > 0;
});

// 字符数（按纯文本计算）
const charCount = computed(() => {
  const raw = props.answer || '';
  return raw.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').length;
});

// 工具栏按钮定义
const toolbar = [
  { cmd: 'bold', label: 'B', title: '加粗 (Ctrl+B)', style: 'font-weight:700' },
  {
    cmd: 'italic',
    label: 'I',
    title: '斜体 (Ctrl+I)',
    style: 'font-style:italic',
  },
  {
    cmd: 'underline',
    label: 'U',
    title: '下划线 (Ctrl+U)',
    style: 'text-decoration:underline',
  },
  {
    cmd: 'strikeThrough',
    label: 'S',
    title: '删除线',
    style: 'text-decoration:line-through',
  },
  {
    cmd: 'formatBlock',
    value: 'H3',
    label: 'H',
    title: '小标题',
    style: 'font-weight:700',
  },
  { cmd: 'insertUnorderedList', label: '•', title: '无序列表' },
  { cmd: 'insertOrderedList', label: '1.', title: '有序列表' },
  { cmd: 'formatBlock', value: 'PRE', label: '</>', title: '代码块' },
] as Array<{
  cmd: string;
  value?: string;
  label: string;
  title: string;
  icon?: string;
  style?: string;
}>;

// 执行富文本命令
const applyCmd = (cmd: string, value?: string) => {
  if (mode.value !== 'edit') return;
  editorRef.value?.focus();
  try {
    document.execCommand(cmd, false, value);
  } catch (e) {
    console.warn('execCommand failed', cmd, e);
  }
  // 同步内容
  syncFromEditor();
};

const clearFormat = () => {
  if (mode.value !== 'edit') return;
  editorRef.value?.focus();
  try {
    document.execCommand('removeFormat', false);
    document.execCommand('formatBlock', false, 'P');
  } catch {}
  syncFromEditor();
};

const clearAnswer = () => {
  if (editorRef.value) editorRef.value.innerHTML = '';
  emit('update:answer', '');
};

// 粘贴时只保留纯文本，避免带入外部样式
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const text = e.clipboardData?.getData('text/plain') || '';
  try {
    document.execCommand('insertText', false, text);
  } catch {
    // 降级：直接插入到当前光标处
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
    }
  }
  syncFromEditor();
};

const syncFromEditor = () => {
  if (!editorRef.value) return;
  const html = editorRef.value.innerHTML;
  // 编辑器为空时（如只剩 <br>），存储空字符串
  const isEmpty =
    html === '<br>' ||
    html === '<p><br></p>' ||
    html.replace(/<[^>]+>/g, '').trim() === '';
  emit('update:answer', isEmpty ? '' : html);
};

const handleRichInput = () => {
  syncFromEditor();
};

const handleBlur = () => {
  syncFromEditor();
};

// 把当前 answer 内容填入编辑器 DOM
const fillEditor = () => {
  if (!editorRef.value) return;
  const raw = props.answer || '';
  if (!raw.trim()) {
    editorRef.value.innerHTML = '';
    return;
  }
  editorRef.value.innerHTML = looksLikeHtml(raw) ? raw : textToHtml(raw);
};

const enterEdit = () => {
  mode.value = 'edit';
  nextTick(() => {
    fillEditor();
    editorRef.value?.focus();
    // 将光标移至末尾
    const el = editorRef.value;
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  });
};

const exitEdit = () => {
  syncFromEditor();
  mode.value = 'view';
};

// 切换题目时，自动回到查看模式（“编辑完成”状态）
watch(
  () => props.question?.id,
  () => {
    mode.value = 'view';
  },
);
</script>

<style scoped>
/* 富文本查看/编辑区域的基础排版样式 */
.rich-view :deep(h1),
.rich-editor :deep(h1) {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0.75rem 0 0.5rem;
}
.rich-view :deep(h2),
.rich-editor :deep(h2) {
  font-size: 1rem;
  font-weight: 700;
  margin: 0.75rem 0 0.5rem;
}
.rich-view :deep(h3),
.rich-editor :deep(h3) {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #059669;
  margin: 0.75rem 0 0.5rem;
}
:global(.dark) .rich-view :deep(h3),
:global(.dark) .rich-editor :deep(h3) {
  color: rgba(0, 220, 130, 0.9);
}

.rich-view :deep(p),
.rich-editor :deep(p) {
  margin: 0.375rem 0;
}

.rich-view :deep(ul),
.rich-editor :deep(ul),
.rich-view :deep(ol),
.rich-editor :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.rich-view :deep(ul) {
  list-style: disc;
}
.rich-view :deep(ol) {
  list-style: decimal;
}
.rich-editor :deep(ul) {
  list-style: disc;
}
.rich-editor :deep(ol) {
  list-style: decimal;
}
.rich-view :deep(li),
.rich-editor :deep(li) {
  margin: 0.25rem 0;
}

.rich-view :deep(strong),
.rich-editor :deep(strong) {
  font-weight: 700;
  color: #111827;
}
:global(.dark) .rich-view :deep(strong),
:global(.dark) .rich-editor :deep(strong) {
  color: #fff;
}

.rich-view :deep(em),
.rich-editor :deep(em) {
  font-style: italic;
}

.rich-view :deep(pre),
.rich-editor :deep(pre) {
  background: #f3f4f6;
  color: #1e293b;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid #e5e7eb;
}
:global(.dark) .rich-view :deep(pre),
:global(.dark) .rich-editor :deep(pre) {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  border-color: rgba(255, 255, 255, 0.08);
}

.rich-view :deep(code),
.rich-editor :deep(code) {
  background: rgba(0, 220, 130, 0.08);
  color: #059669;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.25rem;
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.8125rem;
}
:global(.dark) .rich-view :deep(code),
:global(.dark) .rich-editor :deep(code) {
  background: rgba(0, 220, 130, 0.12);
  color: #00dc82;
}
.rich-view :deep(pre) code,
.rich-editor :deep(pre) code {
  background: transparent;
  color: inherit;
  padding: 0;
}

.rich-view :deep(a),
.rich-editor :deep(a) {
  color: #059669;
  text-decoration: underline;
}
:global(.dark) .rich-view :deep(a),
:global(.dark) .rich-editor :deep(a) {
  color: #00dc82;
}

/* 编辑器 placeholder */
.rich-editor:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  white-space: pre-line;
  pointer-events: none;
}
:global(.dark) .rich-editor:empty::before {
  color: #4b5563;
}
</style>
