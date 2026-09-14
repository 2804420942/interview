// 找所有含未转义反引号的行（在模板字符串内）
const fs = require('fs');

function scan(path) {
  const c = fs.readFileSync(path, 'utf8');
  const lines = c.split('\n');

  const BT = String.fromCharCode(96);
  const BS = String.fromCharCode(92);

  const bad = [];
  let inTemplate = false;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const stripped = l.replace(/\r$/, '');

    if (!inTemplate) {
      if (/content:\s*`/.test(l)) inTemplate = true;
      continue;
    }

    // 在模板字符串内
    if (stripped === '`,') {
      inTemplate = false;
      continue;
    }

    // 计数未转义反引号
    let unescaped = 0;
    for (let j = 0; j < l.length; j++) {
      if (l[j] === BT) {
        if (j === 0 || l[j - 1] !== BS) unescaped++;
      }
    }

    if (unescaped > 0) {
      bad.push({ line: i + 1, unescaped, content: l.slice(0, 100) });
    }
  }

  console.log(path, ':', bad.length);
  bad
    .slice(0, 30)
    .forEach((p) => console.log(p.line, '(u=' + p.unescaped + '):', p.content));
}

scan('src/data/agent-questions-2.ts');
scan('src/data/agent-questions.ts');
scan('src/data/nowcoder-questions.ts');
