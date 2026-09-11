// 校验题库内容的代码围栏是否成对、能否被渲染器识别
// 用法: node scripts/check-code-fences.cjs
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', 'src', 'data')
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts')

// 粗略提取每个 content: `...` 模板字符串（按 title 定位便于报告）
const problems = []
let totalQuestions = 0
let totalBlocks = 0
let residualEscape = 0

for (const file of files) {
  const src = fs.readFileSync(path.join(dataDir, file), 'utf8')

  // 残留的「反斜杠+反引号+反斜杠+反引号+反斜杠+反引号」源码形式（3 个反斜杠+反引号 × 3）
  const residual = src.match(/(?:\\\\\\`){3}/g)
  if (residual) residualEscape += residual.length

  // 按 title 切块，统计每块里的围栏数量（源码里正确写法是 \` ）
  const chunks = src.split(/\n    title: /).slice(1)
  for (const chunk of chunks) {
    totalQuestions++
    const title = (chunk.match(/^'([^']*)'|^"([^"]*)"/) || [])[0] || '(未知标题)'
    // 源码中的围栏写法：\`\`\`
    const fences = chunk.match(/(?:\\`){3}/g) || []
    totalBlocks += Math.floor(fences.length / 2)
    if (fences.length % 2 !== 0) {
      problems.push(`[围栏未闭合] ${file} -> ${title} (共 ${fences.length} 个围栏)`)
    }
  }
}

console.log(`扫描文件: ${files.length}`)
console.log(`题目块: ${totalQuestions}`)
console.log(`成对代码围栏: ${totalBlocks}`)
console.log(`残留过度转义围栏: ${residualEscape}`)
if (problems.length) {
  console.log(`\n发现 ${problems.length} 处问题:`)
  console.log(problems.join('\n'))
} else {
  console.log('\n未发现未闭合围栏 ✅')
}
