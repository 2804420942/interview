// 找所有"见 XX 题"偷懒答案
const fs = require('fs');
const files = [
  'src/data/agent-questions-2.ts',
  'src/data/agent-questions.ts',
  'src/data/nowcoder-questions.ts',
];

for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // 匹配 "见 XX 题" 或 "详见 XX 题" 类
    if (/(?:详)?见\s*\d{3,4}[\s\S、]*题/.test(l)) {
      console.log(f, ':', i + 1, ':', l.slice(0, 120));
    }
  }
}
