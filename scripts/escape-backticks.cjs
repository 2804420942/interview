// 批量转义模板字符串内所有未转义反引号
const fs = require('fs');

function fix(path) {
  const c = fs.readFileSync(path, 'utf8');
  const lines = c.split('\n');

  const BT = String.fromCharCode(96);
  const BS = String.fromCharCode(92);

  let inTemplate = false;
  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const stripped = l.replace(/\r$/, '');

    if (!inTemplate) {
      if (/content:\s*`/.test(l)) inTemplate = true;
      continue;
    }

    if (stripped === '`,') {
      inTemplate = false;
      continue;
    }

    // 转义所有未转义反引号
    let newLine = '';
    let modified = false;
    for (let j = 0; j < l.length; j++) {
      if (l[j] === BT && (j === 0 || l[j - 1] !== BS)) {
        newLine += BS + BT;
        modified = true;
      } else {
        newLine += l[j];
      }
    }
    if (modified) {
      lines[i] = newLine;
      fixCount++;
    }
  }

  if (fixCount > 0) fs.writeFileSync(path, lines.join('\n'), 'utf8');
  console.log(path, 'fixed:', fixCount);
}

fix('src/data/agent-questions-2.ts');
fix('src/data/agent-questions.ts');
fix('src/data/nowcoder-questions.ts');
