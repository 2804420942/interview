// 打印指定题目的代码块解析结果，用于人工核对
// 用法: node scripts/dump-question.cjs <关键词>
const path = require('path')
const esbuild = require(path.join(__dirname, '..', 'node_modules', '.pnpm', 'esbuild@0.21.5', 'node_modules', 'esbuild'))

const result = esbuild.buildSync({
  entryPoints: [path.join(__dirname, '..', 'src', 'data', 'index.ts')],
  bundle: true, format: 'cjs', platform: 'node', write: false, logLevel: 'silent',
})
const mod = { exports: {} }
new Function('module', 'exports', 'require', result.outputFiles[0].text)(mod, mod.exports, require)

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
    if (!open) { result.push(lines[i]); i++; continue }
    const lang = open[1].trim()
    const body = []
    let j = i + 1, closed = false
    while (j < lines.length) {
      if (CLOSE.test(lines[j])) { closed = true; break }
      body.push(lines[j]); j++
    }
    result.push(push({ lang, code: body.join('\n'), closed }))
    i = closed ? j + 1 : j
  }
  return result.join('\n')
}

const keyword = process.argv[2] || 'Function Calling'
const q = mod.exports.allQuestions.find(x => x.title.includes(keyword))
if (!q) { console.log('未找到题目:', keyword); process.exit(1) }

const md = normalizeEscapedMarkers(q.content).replace(/\r\n?/g, '\n')
const blocks = []
extractFencedBlocks(md, b => { blocks.push(b); return `%%CODEBLOCK_${blocks.length - 1}%%` })

console.log(`#${q.id} ${q.title}`)
console.log(`代码块数: ${blocks.length}\n`)
blocks.forEach((b, i) => {
  const lines = b.code.split('\n')
  console.log(`--- [${i}] lang=${b.lang || '(无)'} closed=${b.closed} lines=${lines.length} ---`)
  console.log(lines.slice(0, 6).map(l => '  ' + l).join('\n'))
  if (lines.length > 6) console.log(`  ... (还有 ${lines.length - 6} 行)`)
  console.log()
})
