// 修复所有独占行的 ``` (未转义) 为 \`\`\` (转义)
// 但只在 template literal 内做
const fs = require('fs');

function fix(path) {
  const c = fs.readFileSync(path, 'utf8');
  const lines = c.split('\n');

  const BT = String.fromCharCode(96);
  const BS = String.fromCharCode(92);
  const TRIPLE = BT + BT + BT;
  const ESC_TRIPLE = BS + BT + BS + BT + BS + BT;

  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 如果这行含有未转义的 ``` (行首或行内)
    // 简单：把所有 ``` 序列 → \`\`\` （但只在这些序列不是紧跟着 \ 时）
    if (line.includes(TRIPLE) && !line.includes(ESC_TRIPLE)) {
      // 这行的 ``` 需要转义
      lines[i] = line.split(TRIPLE).join(ESC_TRIPLE);
      fixCount++;
    }
  }

  if (fixCount > 0) fs.writeFileSync(path, lines.join('\n'), 'utf8');
  console.log(path, 'fixed:', fixCount);
}

fix('src/data/agent-questions-2.ts');
fix('src/data/nowcoder-questions.ts');
