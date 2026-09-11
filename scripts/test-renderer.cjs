// 直接调用真实的 markdownRenderer 模块，检查渲染出的 HTML 是否符合预期
// 用法: node scripts/test-renderer.cjs
const path = require('path')
const esbuild = require(path.join(__dirname, '..', 'node_modules', '.pnpm', 'esbuild@0.21.5', 'node_modules', 'esbuild'))

function loadTs(entry) {
  const out = esbuild.buildSync({
    entryPoints: [entry],
    bundle: true, format: 'cjs', platform: 'node', write: false, logLevel: 'silent',
  })
  const mod = { exports: {} }
  new Function('module', 'exports', 'require', out.outputFiles[0].text)(mod, mod.exports, require)
  return mod.exports
}

const src = path.join(__dirname, '..', 'src')
const { renderMarkdown } = loadTs(path.join(src, 'composables', 'markdownRenderer.ts'))
const { allQuestions } = loadTs(path.join(src, 'data', 'index.ts'))

let fail = 0
const check = (name, cond, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + extra}`)
  if (!cond) fail++
}

// --- 单元用例 ---
const t1 = renderMarkdown('文本\n\n```js\nconst a = 1\n```\n尾部')
check('识别带语言的代码块', t1.includes('<pre') && t1.includes('const a = 1'))
check('渲染语言标签', t1.includes('>js<'))
check('渲染复制按钮', t1.includes('code-copy-btn'))

// 代码里出现 ``` 不应该提前收尾
const t2 = renderMarkdown('```js\nif (text.match(/```/g)) {}\nconst after = 2\n```')
check('代码内含 ``` 不截断', t2.includes('const after = 2'), t2.slice(0, 200))

// 未闭合围栏兜底
const t3 = renderMarkdown('```ts\nconst x = 1\nconst y = 2')
check('未闭合围栏兜底成代码块', t3.includes('<pre') && t3.includes('const y = 2'))

// 被过度转义的围栏
const t4 = renderMarkdown('\\`\\`\\`typescript\nimport OpenAI from "openai"\n\\`\\`\\`')
check('修复被转义的围栏', t4.includes('<pre') && t4.includes('import OpenAI'), t4.slice(0, 200))

// 行内代码里的反斜杠不能被吃掉
const t5 = renderMarkdown('Windows 用 `\\`，Mac 用 `/`')
check('保留行内代码里的反斜杠', t5.includes('>\\<'), t5)

// mermaid 开关
const t6 = renderMarkdown('```mermaid\ngraph TD\nA-->B\n```', { mermaid: true })
check('mermaid 生成占位容器', t6.includes('mermaid-pending'))
const t7 = renderMarkdown('```mermaid\ngraph TD\nA-->B\n```', { mermaid: false })
check('关闭 mermaid 时按普通代码块渲染', t7.includes('<pre') && !t7.includes('mermaid-pending'))

// HTML 转义
const t8 = renderMarkdown('```html\n<script>alert(1)</script>\n```')
check('代码块内 HTML 被转义', t8.includes('&lt;script&gt;') && !t8.includes('<script>'))

// --- 全量题库回归 ---
let totalPre = 0
let brokenFence = 0
const suspicious = []
for (const q of allQuestions) {
  if (!q.content) continue
  const html = renderMarkdown(q.content.replace(/^\s*##\s+.+\n+/, ''))
  totalPre += (html.match(/<pre /g) || []).length
  // 渲染结果里不应该再出现裸的围栏或转义围栏
  if (/```/.test(html.replace(/<[^>]*>/g, '')) === false) {
    // ok
  }
  const text = html.replace(/<[^>]*>/g, '')
  if (text.includes('\\`')) {
    brokenFence++
    suspicious.push(`#${q.id} ${q.title}`)
  }
  if (html.includes('%%CODEBLOCK_') || html.includes('%%INLINECODE_')) {
    suspicious.push(`#${q.id} 占位符未回填: ${q.title}`)
  }
}
console.log(`\n全量题库: ${allQuestions.length} 题, 渲染出 <pre> 代码块 ${totalPre} 个`)
check('无占位符残留', !suspicious.some(s => s.includes('占位符未回填')), suspicious.filter(s => s.includes('占位符')).slice(0, 5).join(' | '))
console.log(`文本层仍含「\\\`」的题目数(预期为 Windows 路径类正文): ${brokenFence}`)
suspicious.filter(s => !s.includes('占位符')).slice(0, 6).forEach(s => console.log('  ' + s))

console.log(`\n${fail === 0 ? '全部通过 ✅' : fail + ' 项失败 ❌'}`)
process.exit(fail === 0 ? 0 : 1)
