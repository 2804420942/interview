// 更简单：找所有 line 中含 ``` 的位置（不管是不是转义）
const fs = require('fs');

function scan(path) {
  const c = fs.readFileSync(path, 'utf8');
  const lines = c.split('\n');

  const BT = String.fromCharCode(96);
  const BS = String.fromCharCode(92);

  const bad = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    // 找 3 个连续 BT（不管有没转义）
    for (let j = 0; j < l.length - 2; j++) {
      if (l[j] === BT && l[j + 1] === BT && l[j + 2] === BT) {
        // 检查是不是转义的 \`\`\`
        const escaped =
          j >= 5 &&
          l[j - 1] === BT &&
          l[j - 2] === BS &&
          l[j - 3] === BT &&
          l[j - 4] === BS &&
          l[j - 5] === BS;
        // 简单版：判断此行是否是 \`\`\` （转义的）
        const isEscapedLine = l.includes(BS + BT + BS + BT + BS + BT);
        // 如果这行不是转义的三反引号，那就是原生 ``` 需要修
        if (!isEscapedLine) {
          bad.push({ line: i + 1, col: j + 1, content: l.slice(0, 80) });
          break;
        }
      }
    }
  }

  console.log(path, ':', bad.length);
  bad.slice(0, 30).forEach((p) => console.log(p.line, ':', p.content));
  return bad;
}

scan('src/data/agent-questions-2.ts');
scan('src/data/agent-questions.ts');
scan('src/data/nowcoder-questions.ts');
