const fs = require('fs');
const files = [
  'src/data/agent-questions-2.ts',
  'src/data/agent-questions.ts',
  'src/data/nowcoder-questions.ts',
];

for (const p of files) {
  let c = fs.readFileSync(p, 'utf8');
  const lines = c.split('\n');
  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    // 找 "^\`,$" 这样的整行（可能有 \r 结尾）
    // 前一道题结束应该是 `,  但是被错误写成 \`,
    const stripped = lines[i].replace(/\r$/, '');
    if (stripped === '\\`,') {
      lines[i] = '`,' + (lines[i].endsWith('\r') ? '\r' : '');
      fixCount++;
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(p, lines.join('\n'), 'utf8');
  }
  console.log(p, ':', fixCount);
}
