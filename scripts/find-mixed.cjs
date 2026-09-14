// 找出所有"混合行"（既有转义反引号又有未转义反引号）
const fs = require('fs');
const path = 'src/data/agent-questions-2.ts';
const c = fs.readFileSync(path, 'utf8');
const lines = c.split('\n');

const BS = String.fromCharCode(92); // \
const BT = String.fromCharCode(96); // `

const problems = [];
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
    problems.push({ line: i + 1, content: l.slice(0, 100) });
  }
}

console.log('Total problems:', problems.length);
problems.slice(0, 30).forEach((p) => console.log(p.line, ':', p.content));
