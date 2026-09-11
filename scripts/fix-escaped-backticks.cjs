// 修复数据文件中过度转义的反引号 / 模板插值
//
// 背景：题库内容写在 TS 模板字符串里。模板字符串中 \` 才能输出一个反引号，
// 历史数据误写成 \\\`（= 转义反斜杠 + 转义反引号 = 输出「\`」），
// 于是 Markdown 拿到的是 \`\`\` 而不是 ``` 代码围栏，代码块无法渲染。
// 同理 \\\${ 会多输出一个反斜杠。
//
// 难点：源码里「3 个反斜杠 + 反引号」有两种含义
//   A. 误写的反引号转义（要修）       —— 例：fetch(\\\`/api\\\`)
//   B. 行内代码里真的要展示反斜杠（不能动）—— 例：Windows 用 \`\\\`
// 因此按「连续反斜杠的个数」分类处理，只动长度恰好为 3 且不处于行内代码收尾位置的，
// 并把无法确定的情况打印出来人工确认。
const fs = require('fs')
const path = require('path')

const dir = process.argv[2]
const write = process.argv.includes('--write')

const BT = '`'
const FENCE_BUG = '\\\\\\' + BT // 源码字面量：\\\`
const FENCE_BUG_3 = FENCE_BUG.repeat(3)
const FENCE_OK_3 = ('\\' + BT).repeat(3)

const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'))
const report = []
const skipped = []
let totalFence = 0
let totalInline = 0
let totalDollar = 0

for (const file of files) {
  const full = path.join(dir, file)
  const src = fs.readFileSync(full, 'utf8')
  let out = src
  let fence = 0
  let inline = 0

  // Step 1: 代码围栏 —— 连续三组「\\\`」，含义唯一，直接修
  out = out.split(FENCE_BUG_3).join(FENCE_OK_3)
  fence = (src.split(FENCE_BUG_3).length - 1) * 3

  // Step 2: 剩余的单个「\\\`」，按反斜杠运行长度判定
  out = out.replace(/(\\+)`/g, (match, slashes, offset, whole) => {
    if (slashes.length !== 3) return match // 1 = 正确转义；>=5 = 真的要展示反斜杠
    // 前面紧跟 \` 说明处在行内代码收尾，属于「展示反斜杠」语义，跳过
    const before = whole.slice(Math.max(0, offset - 2), offset)
    if (before === '\\' + BT) {
      skipped.push(`${file}: ${whole.slice(Math.max(0, offset - 40), offset + 10).replace(/\n/g, '\\n')}`)
      return match
    }
    inline++
    return '\\' + BT
  })

  // Step 3: \\\${ -> \${
  const dollarRe = /\\\\\\\$\{/g
  const dollar = (out.match(dollarRe) || []).length
  out = out.replace(dollarRe, '\\${')

  if (out === src) continue

  totalFence += fence
  totalInline += inline
  totalDollar += dollar
  report.push(`${file}: fence=${fence} inline=${inline} dollar=${dollar}`)
  if (write) fs.writeFileSync(full, out, 'utf8')
}

if (report.length) console.log(report.join('\n'))
if (skipped.length) {
  console.log('\n[保留不动 · 行内代码里的真实反斜杠]')
  console.log(skipped.join('\n'))
}
console.log(`---\nfiles=${report.length} fence=${totalFence} inline=${totalInline} dollar=${totalDollar} write=${write}`)
