<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="fixed inset-0 z-[200] flex items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="handleClose"></div>

        <!-- Modal -->
        <div class="relative bg-white dark:bg-nuxt-dark-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-white/10
          w-[100vw] h-[100vh] max-w-[100vw] sm:w-[95vw] sm:max-w-6xl sm:h-[90vh] sm:rounded-2xl rounded-none"
          @click.stop>
          <!-- Header -->
          <div class="shrink-0 px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50/80 dark:bg-nuxt-dark-100/50">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-nuxt-green/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-nuxt-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">题目管理</h2>
                <p class="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">新增、编辑、删除题目，支持 Markdown 格式</p>
              </div>
            </div>
            <button @click="handleClose" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content Area -->
          <div class="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">
            <!-- Mobile List Toggle Button -->
            <button
              v-if="isMobile && !mobileListVisible"
              @click="mobileListVisible = true"
              class="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-nuxt-dark-100/30 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-nuxt-green transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              <span>题目列表</span>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full">{{ questions.length }}</span>
              <svg class="w-3.5 h-3.5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Left: Question List -->
            <div
              v-show="!isMobile || mobileListVisible"
              class="shrink-0 border-r border-gray-200 dark:border-white/5 flex flex-col bg-gray-50/50 dark:bg-nuxt-dark-100/30 min-h-0"
              :class="isMobile ? 'w-full flex-1' : 'w-80'"
            >
              <!-- Mobile List Header (close button) -->
              <div class="sm:hidden flex items-center justify-between px-3 py-2.5 border-b border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-nuxt-dark-100/50">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">选择题目</span>
                <button @click="mobileListVisible = false" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Search & Add -->
              <div class="p-3 border-b border-gray-200 dark:border-white/5 space-y-2">
                <div class="relative">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    v-model="listSearch"
                    type="text"
                    placeholder="搜索题目..."
                    class="w-full pl-9 pr-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 transition-all"
                  />
                </div>
                <button @click="addNewQuestion" class="w-full py-2 rounded-lg text-sm font-semibold bg-nuxt-green/10 text-nuxt-green border border-nuxt-green/20 hover:bg-nuxt-green/20 transition-all flex items-center justify-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  新增题目
                </button>
              </div>

              <!-- List -->
              <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0" style="-webkit-overflow-scrolling: touch;">
                <div v-if="filteredListQuestions.length === 0" class="p-6 text-center">
                  <p class="text-sm text-gray-400 dark:text-gray-500">暂无匹配题目</p>
                </div>
                <button
                  v-for="(q, idx) in filteredListQuestions"
                  :key="q.id"
                  @click="selectForEditMobile(q)"
                  class="w-full text-left px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.03] transition-all group flex items-start gap-2.5"
                  :class="editingQuestion && editingQuestion.id === q.id
                    ? 'bg-nuxt-green/10'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5'"
                >
                  <div class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    :class="editingQuestion && editingQuestion.id === q.id
                      ? 'bg-nuxt-green/20 text-nuxt-green'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500'">
                    {{ q.id }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-medium truncate leading-5"
                      :class="editingQuestion && editingQuestion.id === q.id
                        ? 'text-nuxt-green'
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'">
                      {{ q.title }}
                    </div>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="text-[9px] px-1 py-0.5 rounded font-medium leading-none"
                        :class="getDifficultyClass(q.difficulty)">
                        {{ getDifficultyLabel(q.difficulty) }}
                      </span>
                      <span class="text-[9px] text-gray-400 dark:text-gray-600 truncate">{{ q.category }}</span>
                      <span v-if="isCustomQuestion(q.id)" class="text-[9px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-500 font-medium leading-none">自定义</span>
                    </div>
                  </div>
                </button>
              </div>

              <!-- Stats -->
              <div class="shrink-0 px-3 py-2 border-t border-gray-200 dark:border-white/5 text-center">
                <span class="text-[10px] text-gray-400 dark:text-gray-500">
                  共 {{ questions.length }} 题 · 自定义 {{ customCount }} 题
                </span>
              </div>
            </div>

            <!-- Right: Editor -->
            <div
              v-show="!isMobile || !mobileListVisible"
              class="flex-1 flex flex-col overflow-hidden min-h-0"
            >
              <template v-if="editingQuestion">
                <!-- Editor Toolbar -->
                <div class="shrink-0 px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-nuxt-dark/50">
                  <div class="flex items-center gap-2">
                    <!-- Mobile: back to list button -->
                    <button @click="mobileListVisible = true" class="sm:hidden p-1.5 -ml-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">
                      {{ isNewMode ? '新增题目' : '编辑题目' }}
                    </span>
                    <span v-if="!isNewMode" class="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                      ID: {{ editingQuestion.id }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="!isNewMode"
                      @click="confirmDelete"
                      class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                    >
                      <svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      删除
                    </button>
                    <button
                      @click="saveQuestion"
                      :disabled="!canSave"
                      class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                      :class="canSave
                        ? 'bg-nuxt-green text-nuxt-dark hover:bg-nuxt-green-400 shadow-md shadow-nuxt-green/20'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'"
                    >
                      <svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      {{ isNewMode ? '添加' : '保存' }}
                    </button>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="shrink-0 px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-nuxt-dark-100/20 space-y-3">
                  <!-- Title -->
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">题目名称 <span class="text-red-400">*</span></label>
                    <input
                      v-model="editForm.title"
                      type="text"
                      placeholder="请输入题目名称"
                      class="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 transition-all"
                    />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <!-- Category -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">分类 <span class="text-red-400">*</span></label>
                      <div class="relative">
                        <input
                          v-model="editForm.category"
                          type="text"
                          list="category-options"
                          placeholder="选择或输入分类"
                          class="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 transition-all"
                        />
                        <datalist id="category-options">
                          <option v-for="cat in existingCategories" :key="cat" :value="cat" />
                        </datalist>
                      </div>
                    </div>

                    <!-- Difficulty -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">难度 <span class="text-red-400">*</span></label>
                      <select
                        v-model="editForm.difficulty"
                        class="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="easy">简单</option>
                        <option value="medium">中等</option>
                        <option value="hard">困难</option>
                      </select>
                    </div>

                    <!-- Tags -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">标签 <span class="text-gray-400 font-normal">(逗号分隔)</span></label>
                      <input
                        v-model="editForm.tagsStr"
                        type="text"
                        placeholder="如：Vue, 性能优化"
                        class="w-full px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-nuxt-green/30 focus:ring-1 focus:ring-nuxt-green/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <!-- Markdown Editor / Preview Toggle -->
                <div class="shrink-0 px-3 sm:px-5 py-2 border-b border-gray-200 dark:border-white/5 flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-nuxt-dark/50 overflow-x-auto">
                  <button
                    @click="editorTab = 'edit'"
                    class="px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                    :class="editorTab === 'edit'
                      ? 'bg-nuxt-green/15 text-nuxt-green border border-nuxt-green/20'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-transparent'"
                  >
                    <svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    编辑 Markdown
                  </button>
                  <button
                    @click="editorTab = 'preview'"
                    class="px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                    :class="editorTab === 'preview'
                      ? 'bg-nuxt-green/15 text-nuxt-green border border-nuxt-green/20'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-transparent'"
                  >
                    <svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    预览
                  </button>
                  <button
                    @click="editorTab = 'split'"
                    class="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap"
                    :class="editorTab === 'split'
                      ? 'bg-nuxt-green/15 text-nuxt-green border border-nuxt-green/20'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-transparent'"
                  >
                    <svg class="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"/>
                    </svg>
                    分栏
                  </button>
                  <div class="flex-1"></div>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500">{{ editForm.content.length }} 字</span>
                </div>

                <!-- Editor Body -->
                <div class="flex-1 overflow-hidden flex">
                  <!-- Markdown Textarea -->
                  <div v-show="editorTab === 'edit' || editorTab === 'split'"
                    class="overflow-hidden flex flex-col"
                    :class="editorTab === 'split' ? 'w-1/2 border-r border-gray-200 dark:border-white/5' : 'w-full'">
                    <textarea
                      v-model="editForm.content"
                      placeholder="在此输入 Markdown 内容...&#10;&#10;支持的语法：&#10;# 标题&#10;## 二级标题&#10;### 三级标题&#10;**粗体** &#10;`行内代码`&#10;```javascript&#10;// 代码块&#10;```&#10;- 列表项&#10;| 表头 | 表头 |"
                      class="w-full h-full resize-none p-4 bg-white dark:bg-nuxt-dark/30 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none font-mono leading-relaxed"
                      spellcheck="false"
                    ></textarea>
                  </div>

                  <!-- Preview -->
                  <div v-show="editorTab === 'preview' || editorTab === 'split'"
                    class="overflow-y-auto custom-scrollbar"
                    :class="editorTab === 'split' ? 'w-1/2' : 'w-full'">
                    <div class="p-4 sm:p-6">
                      <div v-if="editForm.content" class="prose-content" v-html="renderedPreview"></div>
                      <div v-else class="text-center py-12">
                        <p class="text-sm text-gray-400 dark:text-gray-500">暂无内容，请在编辑区输入 Markdown</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Empty State -->
              <template v-else>
                <div class="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
                  <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">选择一道题目进行编辑</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">或点击「新增题目」创建新题</p>
                  </div>
                  <button @click="addNewQuestion" class="mt-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-nuxt-green text-nuxt-dark hover:bg-nuxt-green-400 transition-all shadow-lg shadow-nuxt-green/20">
                    <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    新增题目
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Delete Confirm Dialog -->
        <Transition name="modal-fade">
          <div v-if="showDeleteConfirm" class="fixed inset-0 z-[210] flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
            <div class="relative bg-white dark:bg-nuxt-dark-50 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-200 dark:border-white/10">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white">确认删除</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">此操作不可撤销</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
                确定要删除题目「<span class="font-medium text-gray-900 dark:text-white">{{ editingQuestion?.title }}</span>」吗？
              </p>
              <div class="flex items-center gap-3 justify-end">
                <button @click="showDeleteConfirm = false" class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/5">
                  取消
                </button>
                <button @click="doDelete" class="px-4 py-2 rounded-lg text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md shadow-red-500/20">
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Toast Notification -->
        <Transition name="toast-slide">
          <div v-if="toastMessage" class="fixed top-6 left-1/2 -translate-x-1/2 z-[220] px-5 py-3 rounded-xl text-sm font-medium shadow-xl border"
            :class="toastType === 'success'
              ? 'bg-nuxt-green/10 text-nuxt-green border-nuxt-green/20 backdrop-blur-xl'
              : 'bg-red-50 dark:bg-red-500/10 text-red-500 border-red-200 dark:border-red-500/20 backdrop-blur-xl'">
            <svg v-if="toastType === 'success'" class="w-4 h-4 inline-block mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            {{ toastMessage }}
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Question {
  id: number
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  tags: string[]
}

const STORAGE_KEY_CUSTOM = 'interview_custom_questions'

const props = defineProps<{
  visible: boolean
  questions: Question[]
  currentQuestionIndex?: number
}>()

const emit = defineEmits<{
  close: []
  'update:questions': [questions: Question[]]
}>()

const listSearch = ref('')
const editingQuestion = ref<Question | null>(null)
const isNewMode = ref(false)
const editorTab = ref<'edit' | 'preview' | 'split'>('split')
const showDeleteConfirm = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const mobileListVisible = ref(false)
const isMobile = ref(window.innerWidth < 640)

const editForm = ref({
  title: '',
  category: '',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  tagsStr: '',
  content: '',
})

// Load custom question IDs from localStorage
const loadCustomIds = (): Set<number> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CUSTOM)
    if (saved) return new Set(JSON.parse(saved))
  } catch {}
  return new Set()
}

const customIds = ref(loadCustomIds())

const saveCustomIds = () => {
  localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify([...customIds.value]))
}

const isCustomQuestion = (id: number) => customIds.value.has(id)

const customCount = computed(() => {
  return props.questions.filter(q => customIds.value.has(q.id)).length
})

// Existing categories for autocomplete
const existingCategories = computed(() => {
  const seen = new Set<string>()
  for (const q of props.questions) {
    seen.add(q.category)
  }
  return [...seen].sort()
})

// Filtered question list
const filteredListQuestions = computed(() => {
  if (!listSearch.value) return props.questions
  const keyword = listSearch.value.toLowerCase()
  return props.questions.filter(q =>
    q.title.toLowerCase().includes(keyword) ||
    q.category.toLowerCase().includes(keyword) ||
    q.tags.some(t => t.toLowerCase().includes(keyword)) ||
    String(q.id).includes(keyword)
  )
})

const canSave = computed(() => {
  return editForm.value.title.trim() &&
    editForm.value.category.trim() &&
    editForm.value.content.trim()
})

// Select a question for editing
const selectForEdit = (q: Question) => {
  isNewMode.value = false
  editingQuestion.value = q
  editForm.value = {
    title: q.title,
    category: q.category,
    difficulty: q.difficulty,
    tagsStr: q.tags.join(', '),
    content: q.content,
  }
}

// Mobile: select and close list
const selectForEditMobile = (q: Question) => {
  selectForEdit(q)
  // 移动端选中后自动关闭列表面板
  if (isMobile.value) {
    mobileListVisible.value = false
  }
}

// Create new question
const addNewQuestion = () => {
  isNewMode.value = true
  const maxId = props.questions.reduce((max, q) => Math.max(max, q.id), 0)
  const newQ: Question = {
    id: maxId + 1,
    title: '',
    category: '',
    difficulty: 'medium',
    content: '',
    tags: [],
  }
  editingQuestion.value = newQ
  editForm.value = {
    title: '',
    category: '',
    difficulty: 'medium',
    tagsStr: '',
    content: '',
  }
  editorTab.value = 'edit'
  // 移动端新增时关闭列表面板
  if (isMobile.value) {
    mobileListVisible.value = false
  }
}

// Save question (add or update)
const saveQuestion = () => {
  if (!canSave.value || !editingQuestion.value) return

  const tags = editForm.value.tagsStr
    .split(/[,，]/)
    .map(t => t.trim())
    .filter(Boolean)

  const updatedQ: Question = {
    id: editingQuestion.value.id,
    title: editForm.value.title.trim(),
    category: editForm.value.category.trim(),
    difficulty: editForm.value.difficulty,
    content: editForm.value.content,
    tags,
  }

  const newList = [...props.questions]

  if (isNewMode.value) {
    newList.push(updatedQ)
    customIds.value.add(updatedQ.id)
    saveCustomIds()
    showToast('题目添加成功！', 'success')
  } else {
    const idx = newList.findIndex(q => q.id === updatedQ.id)
    if (idx >= 0) {
      newList[idx] = updatedQ
      // Track that this existing question has been modified
      if (!customIds.value.has(updatedQ.id)) {
        modifiedIds.value.add(updatedQ.id)
        saveModifiedIds()
      }
      showToast('题目保存成功！', 'success')
    }
  }

  emit('update:questions', newList)
  isNewMode.value = false
  editingQuestion.value = updatedQ
  // Save to localStorage
  saveCustomQuestions(newList)
}

// Delete question
const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const doDelete = () => {
  if (!editingQuestion.value) return
  const deleteId = editingQuestion.value.id
  const newList = props.questions.filter(q => q.id !== deleteId)
  customIds.value.delete(deleteId)
  saveCustomIds()
  modifiedIds.value.delete(deleteId)
  saveModifiedIds()
  emit('update:questions', newList)
  editingQuestion.value = null
  isNewMode.value = false
  showDeleteConfirm.value = false
  showToast('题目已删除', 'success')
  saveCustomQuestions(newList)
}

// Toast
let toastTimer: ReturnType<typeof setTimeout> | null = null
const showToast = (msg: string, type: 'success' | 'error') => {
  toastMessage.value = msg
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

// Save custom modifications to localStorage
const STORAGE_KEY_MODIFIED = 'interview_modified_questions'
// Track IDs of questions that have been modified (not custom-added, but edited from originals)
const modifiedIds = ref<Set<number>>((() => {
  try {
    const saved = localStorage.getItem('interview_modified_ids')
    if (saved) return new Set(JSON.parse(saved) as number[])
  } catch {}
  return new Set<number>()
})())

const saveModifiedIds = () => {
  localStorage.setItem('interview_modified_ids', JSON.stringify([...modifiedIds.value]))
}

const saveCustomQuestions = (list: Question[]) => {
  // Only save questions that are custom (newly added) or have been modified by the user
  const modifiedOrCustom = list.filter(q => customIds.value.has(q.id) || modifiedIds.value.has(q.id))
  localStorage.setItem(STORAGE_KEY_MODIFIED, JSON.stringify(modifiedOrCustom))
}

const handleClose = () => {
  editingQuestion.value = null
  isNewMode.value = false
  mobileListVisible.value = false
  emit('close')
}

// Reset state when modal opens
watch(() => props.visible, (val) => {
  if (val) {
    editingQuestion.value = null
    isNewMode.value = false
    listSearch.value = ''
    // 移动端打开时默认显示题目列表
    isMobile.value = window.innerWidth < 640
    mobileListVisible.value = isMobile.value
    // 移动端默认编辑模式，桌面端默认分栏模式
    editorTab.value = isMobile.value ? 'edit' : 'split'
    // Auto-select current question if provided
    if (props.currentQuestionIndex !== undefined && props.currentQuestionIndex >= 0 && props.currentQuestionIndex < props.questions.length) {
      selectForEdit(props.questions[props.currentQuestionIndex])
      // 如果有当前题目，移动端直接进入编辑状态而不是显示列表
      if (isMobile.value) {
        mobileListVisible.value = false
      }
    }
  }
})

// 监听窗口尺寸变化
let resizeHandler: (() => void) | null = null

onMounted(() => {
  resizeHandler = () => {
    isMobile.value = window.innerWidth < 640
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})

// Simple Markdown renderer (same as QuestionPanel)
const renderedPreview = computed(() => {
  if (!editForm.value.content) return ''
  return simpleMarkdown(editForm.value.content)
})

function simpleMarkdown(md: string): string {
  let html = md

  const codeBlocks: string[] = []
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const escaped = escapeHtml(code.trimEnd())
    const langLabel = lang ? `<span class="absolute top-2 right-3 text-[10px] text-gray-400 dark:text-gray-500 font-mono select-none">${lang}</span>` : ''
    const block = `<div class="relative my-4 rounded-xl bg-gray-900 dark:bg-[#0d1117] border border-gray-200 dark:border-white/5 overflow-hidden">${langLabel}<pre class="p-4 overflow-x-auto text-sm leading-relaxed"><code class="text-gray-300 font-mono text-xs">${escaped}</code></pre></div>`
    codeBlocks.push(block)
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`
  })

  const inlineCodes: string[] = []
  html = html.replace(/`([^`]+?)`/g, (_match, code) => {
    const escaped = escapeHtml(code)
    const inlineHtml = `<code class="px-1.5 py-0.5 bg-nuxt-green/10 text-emerald-600 dark:text-nuxt-green text-xs rounded font-mono border border-nuxt-green/10">${escaped}</code>`
    inlineCodes.push(inlineHtml)
    return `%%INLINECODE_${inlineCodes.length - 1}%%`
  })

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

  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-emerald-600 dark:text-nuxt-green/80 mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-4 bg-nuxt-green/40 rounded-full inline-block"></span>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-4">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-800 dark:text-white font-semibold">$1</strong>')
  html = html.replace(/^- (.+)$/gm, '<li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 mb-2.5"><span class="w-1.5 h-1.5 rounded-full bg-nuxt-green/50 mt-1.5 shrink-0"></span><span>$1</span></li>')
  html = html.replace(/((<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="space-y-0.5 my-3">$1</ul>')
  html = html.replace(/^(?!<[h|u|l|c|s|d|t])(?!%%CODEBLOCK_)(?!%%INLINECODE_)(.+)$/gm, (match) => {
    if (match.trim() === '') return ''
    return `<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">${match}</p>`
  })
  html = html.replace(/\n\n/g, '<div class="h-2"></div>')

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

const getDifficultyClass = (diff: string) => {
  switch (diff) {
    case 'easy': return 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
    case 'medium': return 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
    case 'hard': return 'bg-red-500/10 text-red-500 dark:text-red-400'
    default: return 'bg-gray-100 dark:bg-white/5 text-gray-400'
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
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.toast-slide-enter-active {
  transition: all 0.3s ease;
}
.toast-slide-leave-active {
  transition: all 0.2s ease;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>