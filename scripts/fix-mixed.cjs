// 修复混合行：给未转义反引号加转义
const fs = require('fs');

function fixFile(path) {
  const c = fs.readFileSync(path, 'utf8');
  const lines = c.split('\n');

  const BS = String.fromCharCode(92);
  const BT = String.fromCharCode(96);

  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    let escaped = 0;
    let unescaped = 0;
    for (let j = 0; j < l.length; j++) {
      if (l[j] === BT) {
        if (j > 0 && l[j - 1] === BS) escaped++;
        else unescaped++;
      }
    }
    if (escaped > 0 && unescaped > 0) {
      // 修复：给未转义反引号加转义
      let newLine = '';
      for (let j = 0; j < l.length; j++) {
        if (l[j] === BT && (j === 0 || l[j - 1] !== BS)) {
          newLine += BS + BT;
        } else {
          newLine += l[j];
        }
      }
      lines[i] = newLine;
      fixCount++;
    }
  }

  if (fixCount > 0) fs.writeFileSync(path, lines.join('\n'), 'utf8');
  console.log(path, 'fixed:', fixCount);
}

fixFile('src/data/agent-questions-2.ts');
fixFile('src/data/agent-questions.ts');
fixFile('src/data/nowcoder-questions.ts');
