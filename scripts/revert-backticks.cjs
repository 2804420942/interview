// 精准恢复被错误替换的行内反引号
// 逻辑：追踪当前是否在模板字符串内（通过匹配 content: ` 和终止 `,）
// 只修复模板字符串内的、以 `, 结尾且不是仅由 `, 组成的行

const fs = require('fs');

function fixFile(path) {
  let c = fs.readFileSync(path, 'utf8');
  const lines = c.split('\n');

  let inTemplate = false;
  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.replace(/\r$/, '');

    if (!inTemplate) {
      // 检查是否进入模板字符串（content: ` 开始）
      if (/content:\s*`/.test(line)) {
        inTemplate = true;
      }
    } else {
      // 在模板字符串内
      // 单独一行 `, 表示模板字符串结束
      if (stripped === '`,') {
        inTemplate = false;
        continue;
      }
      // 如果行末是 `, 但不是单独的 `,行，说明是被错误改的
      if (stripped.endsWith('`,')) {
        // 恢复为 \`,
        lines[i] =
          stripped.slice(0, -2) + '\\`,' + (line.endsWith('\r') ? '\r' : '');
        fixCount++;
      }
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
  }
  console.log(path, 'fixed:', fixCount);
}

fixFile('src/data/agent-questions-2.ts');
fixFile('src/data/agent-questions.ts');
fixFile('src/data/nowcoder-questions.ts');
