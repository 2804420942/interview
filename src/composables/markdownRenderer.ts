/**
 * 题目内容 Markdown 渲染器（QuestionPanel 与 QuestionManager 预览共用）
 *
 * 独立成模块的原因：此前两个组件各自维护了一份 simpleMarkdown，
 * 修了一边另一边依旧是旧逻辑，代码块渲染问题反复出现。
 */

/** 将任意字符串（含中文、换行）编码为 Base64，用于安全地放进 HTML 属性 */
export function encodeBase64(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_m, p1) =>
        String.fromCharCode(parseInt('0x' + p1, 16))
      )
    )
  } catch {
    return ''
  }
}

/** Base64 解码，失败时逐级降级 */
export function decodeBase64(encoded: string): string {
  try {
    return decodeURIComponent(
      atob(encoded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    try {
      return atob(encoded)
    } catch {
      return encoded
    }
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    // 避免内容里的 {{ }} 被 Vue 模板编译器当成插值
    .replace(/\{\{/g, '&#123;&#123;')
    .replace(/\}\}/g, '&#125;&#125;')
}

export function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 归一化内容里被过度转义的 Markdown 记号。
 *
 * 题库内容写在 TS 模板字符串里，模板字符串中要写 \\` 才能输出一个反引号。
 * 历史数据（以及 localStorage 旧缓存、用户在题目管理里粘贴的内容）可能残留成
 * 「反斜杠 + 反引号」，于是围栏变成 \\`\\`\\` 而不是 ```，代码块识别不出来，
 * 整段代码就被当成普通段落平铺展示。
 *
 * 只处理「连续三组 反斜杠+反引号」这种唯一可解释为代码围栏的情况，
 * 避免误伤正文里确实要展示反斜杠的行内代码（例如用 `\` 表示 Windows 路径分隔符）。
 */
export function normalizeEscapedMarkers(md: string): string {
  return md
    .replace(/(?:\\`){3}/g, '```')
    // 代码示例里的模板插值 \${x} -> ${x}
    .replace(/\\\$\{/g, '${')
}

/** 代码块渲染选项 */
export interface MarkdownOptions {
  /** 是否把 ```mermaid 渲染成流程图占位容器（题目详情页需要，编辑预览不需要） */
  mermaid?: boolean
  /** 是否在代码块头部显示复制按钮 */
  copyButton?: boolean
}

const COPY_ICON =
  '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" ' +
  'd="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>'

/** 生成代码块 HTML（语言标签 + 可选复制按钮 + 横向滚动的 pre） */
function buildCodeBlock(lang: string, rawCode: string, opts: MarkdownOptions): string {
  const code = rawCode.replace(/\s+$/, '')
  const escaped = escapeHtml(code)
  const langLabel = lang
    ? `<span class="text-[10px] text-gray-500 dark:text-gray-500 font-mono select-none lowercase">${escapeHtmlAttr(lang)}</span>`
    : '<span class="text-[10px] text-gray-500 font-mono select-none">code</span>'

  const copyBtn = opts.copyButton
    ? `<button type="button" class="code-copy-btn flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 hover:text-nuxt-green transition-colors" data-code="${encodeBase64(code)}" title="复制代码">${COPY_ICON}<span class="copy-label">复制</span></button>`
    : ''

  return (
    '<div class="code-block relative my-4 rounded-xl bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-white/5 overflow-hidden">' +
    '<div class="flex items-center justify-between gap-2 px-4 py-1.5 border-b border-gray-200 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">' +
    langLabel +
    copyBtn +
    '</div>' +
    '<pre class="p-4 overflow-x-auto text-sm leading-relaxed"><code class="text-slate-800 dark:text-gray-200 font-mono text-xs">' +
    escaped +
    '</code></pre></div>'
  )
}

/** 生成 Mermaid 待渲染占位容器 */
function buildMermaidBlock(rawCode: string): string {
  const encoded = encodeBase64(rawCode.replace(/\s+$/, ''))
  return `<div class="mermaid-pending my-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-nuxt-dark-50/50 p-4 overflow-x-auto flex items-center justify-center min-h-[120px]" data-mermaid-code="${encoded}">
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          图表加载中...
        </div>
      </div>`
}

/**
 * 按行提取 Markdown 代码围栏。
 *
 * 不用 /```([\s\S]*?)```/ 这类惰性正则的原因：题库里有不少题目在**代码示例内部**
 * 讨论 Markdown 围栏（例如流式渲染那题写了 text.match(/```/g)），
 * 惰性正则会在这种「出现在行中间的 ``` 」处提前收尾，
 * 结果代码被截断、剩下半截当成正文平铺出来。
 *
 * 按 CommonMark 规则判定：
 * - 起始围栏：行首（最多 3 个空格缩进）的 ```，其后是语言标识
 * - 结束围栏：整行只有 ```（允许尾部空白）
 * - 未闭合时吃到文末，保证代码仍以代码块形式展示而不是退化成段落
 */
function extractFencedBlocks(
  md: string,
  push: (block: string) => string,
  opts: MarkdownOptions
): string {
  const OPEN = /^ {0,3}```([^`]*)$/
  const CLOSE = /^ {0,3}```[ \t]*$/
  const lines = md.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const open = OPEN.exec(lines[i])
    if (!open) {
      result.push(lines[i])
      i++
      continue
    }

    const lang = open[1].trim()
    const body: string[] = []
    let j = i + 1
    let closed = false
    while (j < lines.length) {
      if (CLOSE.test(lines[j])) {
        closed = true
        break
      }
      body.push(lines[j])
      j++
    }

    const code = body.join('\n')
    const isMermaid = opts.mermaid && lang.toLowerCase() === 'mermaid'
    result.push(push(isMermaid ? buildMermaidBlock(code) : buildCodeBlock(lang, code, opts)))
    i = closed ? j + 1 : j
  }

  return result.join('\n')
}

/** 把题目内容的 Markdown 渲染成 HTML */
export function renderMarkdown(md: string, options: MarkdownOptions = {}): string {
  const opts: MarkdownOptions = { mermaid: true, copyButton: true, ...options }

  // 统一换行符后按行解析
  let html = normalizeEscapedMarkers(md).replace(/\r\n?/g, '\n')

  // Step 1: 代码围栏 -> 占位符
  const codeBlocks: string[] = []
  html = extractFencedBlocks(
    html,
    block => {
      codeBlocks.push(block)
      return `%%CODEBLOCK_${codeBlocks.length - 1}%%`
    },
    opts
  )

  // Step 2: 行内代码 -> 占位符（限制不跨行，避免把两处反引号误配成一段）
  const inlineCodes: string[] = []
  html = html.replace(/`([^`\n]+?)`/g, (_match, code: string) => {
    const inlineHtml = `<code class="px-1.5 py-0.5 bg-nuxt-green/10 text-emerald-600 dark:text-nuxt-green text-xs rounded font-mono border border-nuxt-green/10 break-words">${escapeHtml(code)}</code>`
    inlineCodes.push(inlineHtml)
    return `%%INLINECODE_${inlineCodes.length - 1}%%`
  })

  // Step 3: 表格
  html = html.replace(
    /(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/g,
    (_match, headerRow: string, _separator: string, bodyRows: string) => {
      const headers = headerRow
        .split('|')
        .filter(c => c.trim() !== '')
        .map(c => c.trim())
      const rows = bodyRows
        .trim()
        .split('\n')
        .map(row =>
          row
            .split('|')
            .filter(c => c.trim() !== '')
            .map(c => c.trim())
        )
      let table =
        '<div class="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-white/5"><table class="w-full text-sm">'
      table += '<thead><tr class="bg-gray-50 dark:bg-white/5">'
      headers.forEach(h => {
        table += `<th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-white/5">${h}</th>`
      })
      table += '</tr></thead><tbody>'
      rows.forEach((row, i) => {
        const bg = i % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-white/[0.02]'
        table += `<tr class="${bg}">`
        row.forEach(cell => {
          table += `<td class="px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-white/[0.03]">${cell}</td>`
        })
        table += '</tr>'
      })
      table += '</tbody></table></div>'
      return table
    }
  )

  // 标题
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 class="text-base font-semibold text-emerald-600 dark:text-nuxt-green/80 mt-6 mb-3 flex items-center gap-2"><span class="w-1 h-4 bg-nuxt-green/40 rounded-full inline-block"></span>$1</h3>'
  )
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 class="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-4">$1</h2>'
  )
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 class="text-xl font-bold text-gray-900 dark:text-white mb-4">$1</h1>'
  )
  // 加粗
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="text-gray-800 dark:text-white font-semibold">$1</strong>'
  )
  // 列表
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 mb-2.5"><span class="w-1.5 h-1.5 rounded-full bg-nuxt-green/50 mt-1.5 shrink-0"></span><span>$1</span></li>'
  )
  html = html.replace(
    /((<li[^>]*>.*?<\/li>\s*)+)/g,
    '<ul class="space-y-0.5 my-3">$1</ul>'
  )
  // 段落
  html = html.replace(
    /^(?!<[h|u|l|c|s|d|t|i])(?!%%CODEBLOCK_)(?!%%INLINECODE_)(.+)$/gm,
    match => {
      if (match.trim() === '') return ''
      return `<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">${match}</p>`
    }
  )
  html = html.replace(/\n\n/g, '<div class="h-2"></div>')

  // Step 4: 回填代码块与行内代码
  codeBlocks.forEach((block, i) => {
    html = html.replace(`%%CODEBLOCK_${i}%%`, () => block)
  })
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE_${i}%%`, () => code)
  })

  return html
}

/**
 * 代码块「复制」按钮的事件委托处理器。
 * 内容由 v-html 渲染，无法直接绑定 @click，统一挂到容器上。
 */
export function handleCodeCopyClick(e: MouseEvent): void {
  const btn = (e.target as HTMLElement | null)?.closest?.('.code-copy-btn') as HTMLElement | null
  if (!btn) return

  const code = decodeBase64(btn.getAttribute('data-code') || '')
  if (!code) return

  const label = btn.querySelector('.copy-label')
  const done = (ok: boolean) => {
    if (!label) return
    label.textContent = ok ? '已复制' : '复制失败'
    setTimeout(() => {
      label.textContent = '复制'
    }, 1500)
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(code)
      .then(() => done(true))
      .catch(() => done(false))
    return
  }

  // 降级：非安全上下文（如局域网 http 访问）下 Clipboard API 不可用
  try {
    const ta = document.createElement('textarea')
    ta.value = code
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    done(document.execCommand('copy'))
    document.body.removeChild(ta)
  } catch {
    done(false)
  }
}
