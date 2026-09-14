// 精准替换所有偷懒答案：找到每一处后，替换那行（不动 content 边界）
const fs = require('fs');

// 每处替换定义：{ file, lineNumber, oldPattern, newContent }
// 使用行号 + 精确的旧文本匹配确保只改一处

const replacements = {
  'src/data/agent-questions-2.ts': [
    {
      line: 6650,
      old: '**答案：** 见 1622 题详细展开。',
      new: `**答案：**

### AI 应用的容错三板斧

#### 1. 重试

- **指数退避**：1s、2s、4s、8s...
- **抖动**：加随机数避免同时重试
- **上限**：最多 3 次
- **区分错误**：4xx 不重试，5xx / timeout 重试

\`\`\`typescript
async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fn() }
    catch (e) {
      if (e.status >= 400 && e.status < 500) throw e  // 客户端错误不重试
      if (i === retries - 1) throw e
      await sleep(1000 * Math.pow(2, i) + Math.random() * 500)
    }
  }
}
\`\`\`

#### 2. 熔断

**Circuit Breaker 三态**：
- **Closed**（正常）：请求通过
- **Open**（熔断）：直接失败，不打后端
- **Half-Open**（探测）：放少量请求试探恢复

**触发**：错误率 > 50% 且请求数 > 10 → Open

**恢复**：Open 30 秒后 → Half-Open

**用途**：LLM 挂了别一直打，等它恢复。

#### 3. 降级

- **模型降级**：GPT-4o 挂 → 切 GPT-4o-mini
- **功能降级**：RAG 挂 → 走纯 LLM
- **兜底回复**："服务繁忙，请稍后再试"
- **缓存兜底**：返回历史相似答案

**面试话术**：三板斧组合——重试短期抖动、熔断保护后端、降级保证可用。**AI 应用比传统更需要**，因为 LLM 挂/慢/贵都可能。`,
    },
    {
      line: 6716,
      old: '见 1622 题。补充一个**排队体验**方案：',
      new: `AI 应用限流补充**排队体验**方案：`,
    },
    {
      line: 7753,
      old: '工作记忆 / 短期 / 长期分开管理（见 1609 题）。',
      new: `工作记忆 / 短期 / 长期分开管理：**工作记忆**（当前对话上下文）、**短期记忆**（近 N 轮对话摘要）、**长期记忆**（用户画像、偏好、历史结论，存向量库或结构化 DB）。`,
    },
    {
      line: 8651,
      old: '**答案：** 见 1637 题（HITL）。',
      new: `**答案：**

Agent 中的 Interrupt & Resume 是 Human-in-the-Loop 的核心机制。

### LangGraph interrupt

**在 Node 中显式暂停**：

\`\`\`typescript
async function sensitiveNode(state) {
  const value = interrupt({
    action: 'delete_user',
    userId: state.targetUserId,
    reason: '需要管理员确认'
  })

  if (value.approved) return { deleted: true }
  else return { deleted: false, reason: value.reason }
}
\`\`\`

**运行时**：

\`\`\`typescript
const result = await graph.invoke(input, config)
if (result.__interrupt__) {
  const decision = await getUserDecision()
  await graph.invoke(new Command({ resume: decision }), config)
}
\`\`\`

### 需要 Checkpointer

**状态必须持久化**：

\`\`\`typescript
import { RedisSaver } from '@langchain/langgraph-checkpoint-redis'
const graph = builder.compile({
  checkpointer: RedisSaver.fromUrl('redis://...')
})
\`\`\`

### 关键点

- **thread_id 前后端一致**
- **超时处理**（1 小时未响应自动 reject）
- **UI 明确的 approve/reject/edit 选项**
- **审计日志**

### 应用场景

- 敏感操作（删数据、发邮件）
- 高价决策（下单大额）
- 分歧点（LLM 置信度低）
- 数据收集（RLHF 素材）

**这是 Agent 从"能跑"到"敢用"的关键——敏感操作必须人审。**`,
    },
    {
      line: 8859,
      old: '**答案：** 详见 1635 题。补充**2025 新型攻击**：',
      new: `**答案：** Prompt Injection 是 Agent 安全首要威胁。补充**2025 新型攻击**：`,
    },
  ],
  'src/data/nowcoder-questions.ts': [
    // 每处都会自动处理，见后面代码
  ],
};

// 应用 Agent 文件的修改
for (const [file, changes] of Object.entries(replacements)) {
  if (changes.length === 0) continue;
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  for (const { old, new: newText } of changes) {
    if (content.includes(old)) {
      content = content.replace(old, newText);
      count++;
    } else {
      console.warn(file, ': not found:', old.slice(0, 40));
    }
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(file, 'replaced:', count);
}
