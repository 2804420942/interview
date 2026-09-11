// 用真实题库数据验证代码块渲染是否正确
// 用法: node scripts/verify-render.cjs
const path = require('path')
// pnpm 扁平化后 esbuild 只在 .pnpm 里，显式定位
const esbuild = require(path.join(__dirname, '..', 'node_modules', '.pnpm', 'esbuild@0.21.5', 'node_modules', 'esbuild'))

// 1. 把题库打包成 CJS 并取出数据
const result = esbuild.buildSync({
  entryPoints: [path.join(__dirname, '..', 'src', 'data', 'index.ts')],
  bundle: true,
  format: 'cjs',
  platform: 'node',
  write: false,
  logLevel: 'silent',
})
const mod = { exports: {} }
new Function('module', 'exports', 'require', result.outputFiles[0].text)(mod, mod.exports, require)
const allQuestions = mod.exports.allQuestions

// 2. 复刻 QuestionPanel.vue 里的围栏解析逻辑
function normalizeEscapedMarkers(md) {
  return md.replace(/(?:\\`){3}/g, '```').replace(/\\\$\{/g, '${')
}

function extractFencedBlocks(md, push) {
  const OPEN = /^ {0,3}```([^`]*)$/
  const CLOSE = /^ {0,3}```[ \t]*$/
  const lines = md.split('\n')
  const result = []
  let i = 0
  while (i < lines.length) {
    const open = OPEN.exec(lines[i])
    if (!open) {
      result.push(lines[i])
      i++
      continue
    }
    const lang = open[1].trim()
    const body = []
    let j = i + 1
    let closed = false
    while (j < lines.length) {
      if (CLOSE.test(lines[j])) { closed = true; break }
      body.push(lines[j])
      j++
    }
    result.push(push({ lang, code: body.join('\n'), closed }))
    i = closed ? j + 1 : j
  }
  return result.join('\n')
}

// 3. 统计
let totalBlocks = 0
let unclosed = 0
let emptyBlocks = 0
const residualEscape = []
const stillFlat = []
const langs = new Map()

for (const q of allQuestions) {
  if (!q.content) continue
  const md = normalizeEscapedMarkers(q.content).replace(/\r\n?/g, '\n')

  // 归一化后仍残留 \` 的（说明还有漏改的转义）
  if (/\\`/.test(md)) {
    const sample = md.match(/.{0,30}\\`.{0,30}/)
    residualEscape.push(`#${q.id} ${q.title} :: ${sample ? sample[0].replace(/\n/g, '\\n') : ''}`)
  }

  const blocks = []
  const out = extractFencedBlocks(md, (b) => { blocks.push(b); return `%%CODEBLOCK_${blocks.length - 1}%%` })
  totalBlocks += blocks.length
  for (const b of blocks) {
    if (!b.closed) unclosed++
    if (!b.code.trim()) emptyBlocks++
    const key = b.lang || '(无语言)'
    langs.set(key, (langs.get(key) || 0) + 1)
  }

  // 检测「代码没进代码块」：剩余正文里出现明显的代码特征行
  const leftover = out.split('\n').filter(l => !/^%%CODEBLOCK_/.test(l)).join('\n')
  if (/^\s*(import |export |const |function |class |if \(|for \()/m.test(leftover)) {
    const line = leftover.match(/^\s*(import |export |const |function |class |if \(|for \().*/m)
    stillFlat.push(`#${q.id} ${q.title} :: ${line ? line[0].trim().slice(0, 70) : ''}`)
  }
}

console.log(`题目总数: ${allQuestions.length}`)
console.log(`识别到代码块: ${totalBlocks}`)
console.log(`未闭合围栏(已兜底成代码块): ${unclosed}`)
console.log(`空代码块: ${emptyBlocks}`)
console.log(`\n语言分布 Top10:`)
console.log([...langs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `  ${k}: ${v}`).join('\n'))

console.log(`\n残留未归一化的转义反引号: ${residualEscape.length}`)
residualEscape.slice(0, 10).forEach(s => console.log('  ' + s))

console.log(`\n疑似代码未被围栏包裹: ${stillFlat.length}`)
stillFlat.slice(0, 15).forEach(s => console.log('  ' + s))
