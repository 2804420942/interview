import type { Question } from './types'

/**
 * 前端脚手架项目 - STAR 法则面试讲述（独立分类：面试项目）
 * 用 Situation / Task / Action / Result 结构，串联脚手架开发全流程，
 * 并完整覆盖过程中的难点、亮点与踩坑经历。
 */
export const scaffoldStarQuestions: Question[] = [
  {
    id: 1410,
    title: '【STAR 法则】前端脚手架项目开发全流程：难点、亮点与踩坑复盘',
    category: '面试项目',
    difficulty: 'hard',
    content: `# 【STAR 法则】前端脚手架项目开发全流程

> 用 **STAR 法则**（Situation 情境 → Task 任务 → Action 行动 → Result 结果）系统讲述一个前端工程化脚手架（imooc-cli 风格）的研发全过程，并在最后完整复盘开发中的**难点、亮点与踩坑经历**。适合在面试中作为「项目深度讲述」直接输出。

---

## 一、S — Situation（项目背景与情境）

我所在的团队在做前端项目交付时，长期存在一套「靠人肉、靠口口相传」的研发流程，主要痛点集中在三个方面：

| 痛点 | 具体表现 | 带来的后果 |
|---|---|---|
| **项目初始化无标准** | 每个人手动配 webpack、eslint、目录结构、CI 配置 | 配置五花八门，新人接手成本高 |
| **发布流程纯手工** | 手动 git init → 建远程仓库 → 手动构建 → 手动传服务器 | 流程繁琐、易出错、无审计 |
| **环境不一致** | 「我本地能跑、上了机器就挂」 | 线上事故频发，排查成本高 |

> 当时团队约 8 人，维护 20+ 个前端项目，每新建/发布一个项目平均要花 **半天以上**，且发布失误（漏传文件、传错环境）每月都会发生 1～2 次。

**核心情境一句话总结：** 团队缺少一套统一、自动化、可审计的「项目初始化 + 发布上线」工具链，重复劳动多、出错率高、标准不统一。

---

## 二、T — Task（我的目标与职责）

我作为该工具链的**主导设计与核心开发者**，需要交付一个 CLI 脚手架，目标拆解为：

1. **统一初始化**：一条命令拉起符合团队规范的项目骨架（模板可选、可扩展）。
2. **自动化发布**：把 Git 操作、审批、云构建、上线部署串成一条全自动闭环。
3. **可持续演进**：命令逻辑能热更新，不必让用户反复 \`npm i -g\`。
4. **环境一致性**：把构建搬到云端统一环境，杜绝「本地能跑」问题。
5. **可维护**：多包工程能统一版本、统一发布、互相调试。

> 衡量标准（我给自己定的验收线）：初始化从「半天」降到「分钟级」；发布从「手工多步」降到「一条命令」；发布失误率趋近于 0。

---

## 三、A — Action（具体做了什么）

整体采用 **Monorepo + Lerna** 组织，CLI 本体只做调度，命令逻辑独立成包并**动态加载**。两条主线命令：\`init\`（初始化）与 \`publish\`（发布）。

\`\`\`
imooc-cli init        →  项目初始化
imooc-cli publish     →  项目发布
\`\`\`

### 3.1 工程架构：Monorepo + Lerna

\`\`\`
packages/
├── core/      # 入口，命令解析（commander）
├── init/      # init 命令逻辑
├── publish/   # publish 命令逻辑
├── models/    # Package 等数据模型
└── utils/     # 公共工具（log、request、格式化等）
\`\`\`

**为什么这么做：** 多包统一管理、公共依赖提升、包间免发布直接引用调试、一次提交可原子修改多包，配合 \`lerna version\` / \`lerna publish\` 做拓扑排序的批量发布。

### 3.2 动态加载：CLI 只是「壳」

传统 CLI 把所有逻辑打进本体，改个 bug 用户就要重装。我的做法是：CLI 本体只是调度器，\`init\`/\`publish\` 是独立 npm 包，运行时按需从 npm 下载到本地缓存（\`~/.imooc-cli/\`），有缓存则检查更新、无则安装。

\`\`\`javascript
async function execCommand(packageName, packageVersion, args) {
  const targetPath = path.resolve(homePath, '.imooc-cli', 'dependencies')
  const pkg = new Package({
    targetPath,
    storeDir: path.resolve(targetPath, 'node_modules'),
    packageName,
    packageVersion,
  })
  if (await pkg.exists()) {
    await pkg.update()   // 本地有缓存 → 检查更新
  } else {
    await pkg.install()  // 本地无 → 从 npm 下载
  }
  const rootFile = pkg.getRootFilePath()
  require(rootFile)(args) // 拿到入口文件并执行
}
\`\`\`

> 效果：命令逻辑可随时更新，用户下次执行自动拿到最新版，**无需重装 CLI**。

### 3.3 init 流程（初始化）

1. **环境检查**：Node 版本、用户主目录是否存在。
2. **动态加载** \`@imooc-cli/init\` 包。
3. **交互式询问**（inquirer）：项目名、版本号、选择模板。
4. **拉取模板列表**：模板本身也是 npm 包，按需下载。
5. **EJS 模板渲染**：把用户输入注入到 \`package.json\` 等文件。
6. **自动 \`npm install\` + \`npm run serve\`**：开箱即用。

EJS 渲染的关键是**区分文本与二进制文件**，否则会把图片/字体渲染坏：

\`\`\`javascript
function isBinaryFile(filePath) {
  const buffer = Buffer.alloc(512)
  const fd = fs.openSync(filePath, 'r')
  const bytesRead = fs.readSync(fd, buffer, 0, 512, 0)
  fs.closeSync(fd)
  for (let i = 0; i < bytesRead; i++) {
    if (buffer[i] === 0) return true // 含 NULL 字节 → 判定为二进制
  }
  return false
}
\`\`\`

### 3.4 publish 流程（发布）

1. **Git 自动化**：\`simple-git\` + GitHub/Gitee API 自动建仓、关联 remote、冲突检测、规范分支（\`feature/x.y.z\`）、提交推送。
2. **企微消息推送审批**：通知相关人审批，保证流程合规可审计。
3. **云构建（WebSocket 实时通信）**：CLI 连云端，服务端跑 \`git clone → npm install → npm run build\`，实时回传日志。
4. **云发布**：构建产物传阿里云 OSS，再部署到目标环境，形成闭环。

Git 自动化核心：

\`\`\`javascript
async function gitAutomate() {
  if (!await git.checkIsRepo()) await git.init()
  const { data } = await axios.post('https://api.github.com/user/repos',
    { name: projectName, private: true },
    { headers: { Authorization: \`token \${token}\` } })
  await git.addRemote('origin', data.clone_url)
  const status = await git.status()
  if (status.conflicted.length > 0) throw new Error('存在代码冲突，请先解决')
  await git.checkout(['-b', \`feature/\${version}\`])
  await git.add('.')
  await git.commit(\`feat: init project v\${version}\`)
  await git.push('origin', \`feature/\${version}\`)
}
\`\`\`

云构建的 WebSocket 实时日志：

\`\`\`javascript
function connectBuildServer(taskId) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(BUILD_SERVER_URL)
    const timeout = setTimeout(() => { ws.close(); reject(new Error('构建超时')) }, 5 * 60 * 1000)
    ws.on('open', () => ws.send(JSON.stringify({ type: 'build', taskId })))
    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      if (msg.type === 'log') console.log(msg.content)
      else if (msg.type === 'success') { clearTimeout(timeout); resolve(msg.result) }
      else if (msg.type === 'error') { clearTimeout(timeout); reject(new Error(msg.message)) }
    })
    ws.on('error', (err) => { clearTimeout(timeout); reject(err) })
  })
}
\`\`\`

---

## 四、R — Result（成果与量化收益）

| 指标 | 优化前 | 优化后 | 收益 |
|---|---|---|---|
| **项目初始化耗时** | 半天+ | 分钟级 | **效率 10 倍+** |
| **发布操作步骤** | 10+ 手工步骤 | 1 条命令 | 全流程自动化 |
| **发布失误率** | 每月 1～2 次 | 趋近于 0 | 流程可审计、可回滚 |
| **配置一致性** | 各人各样 | 模板统一 | 新人上手成本大幅下降 |
| **CLI 升级成本** | 用户需重装 | 动态加载自动更新 | 几乎为 0 |

**对团队的价值：** 把「重复、易错、不可控」的流程沉淀成「自动、统一、可审计」的工具，让开发者把精力集中在业务本身；同时这套工程化思路（Monorepo、动态加载、云构建）也复用到了后续多个内部工具。

---

## 五、难点 & 解决方案（Challenges）

### 难点 1：动态加载的缓存路径解析

npm 缓存后的目录结构特殊（如 \`_@imooc-cli_init@1.0.0@@imooc-cli/init/\`），需要读 \`package.json\` 的 \`main\`/\`module\` 字段定位入口；还要处理**跨平台路径**（Windows \`\\\\\` vs Mac/Linux \`/\`）：

\`\`\`javascript
function formatPath(p) {
  if (p && process.platform === 'win32') return p.replace(/\\\\/g, '/')
  return p
}
\`\`\`

### 难点 2：EJS 渲染误伤二进制文件

最早全量 EJS 渲染，导致图片、字体被「渲染坏」。解决：glob ignore 已知二进制后缀 + 文件头 NULL 字节检测双保险（见 3.3）。

### 难点 3：WebSocket 断线导致构建日志中断

云构建时间长，网络抖动会断开连接。解决方案：
- **心跳检测**：定期 ping/pong 探活；
- **自动重连**：指数退避（1s/2s/4s…）；
- **断点续传**：服务端记录日志偏移量，重连后从断点续推；
- **超时兜底**：最大重试次数 + 总超时，超时给出明确提示。

### 难点 4：OSS 上传的安全性

不能把永久 AccessKey 放在客户端。解决：**STS 临时凭证**（限时限权）+ 服务端签名 + Bucket 策略限制目录/类型/大小 + CDN+HTTPS 全链路加密。

### 难点 5：Git 操作的异常与回滚

网络异常设超时；token 过期引导重新授权；冲突时先 stash 再 pull 后 pop；**记录初始 HEAD**，操作失败时回滚到操作前状态，避免把用户仓库搞乱。

---

## 六、亮点（Highlights）

1. **插件化 + 动态加载架构**：CLI 本体只是壳，命令逻辑热更新，用户无感升级 —— 这是整个项目最核心的设计亮点。
2. **全流程闭环自动化**：Git → 审批 → 云构建 → 上线，一条命令贯穿，且每步可审计。
3. **云构建保证环境一致性**：彻底解决「本地能跑、线上挂」，构建密钥不下放到本地。
4. **Monorepo + Lerna 工程化**：拓扑排序构建、统一版本、批量发布，包间免发布调试。
5. **模板即 npm 包**：模板可独立维护升级，不必更新 CLI 本体。

---

## 七、踩过的坑（Pitfalls，真实复盘）

> 面试中讲「踩坑」往往最能体现深度，以下是真实遇到并解决的问题：

1. **幽灵依赖（phantom dependency）**：Lerna + npm hoist 把依赖提到根目录，某个包没在自己 \`package.json\` 声明却能用，单独发布后在用户机器上炸了。**教训**：每个包必须显式声明自己的依赖，后来评估迁移 pnpm 的严格隔离。
2. **\`require()\` 缓存导致热更新不生效**：动态加载的包更新了，但同进程内 \`require\` 命中旧缓存。**解法**：放到**子进程**执行，隔离环境、用完即销毁。
3. **inquirer 在某些 CI 环境卡死**：交互式命令在无 TTY 的 CI 里会一直等待输入。**解法**：检测 \`process.stdout.isTTY\`，CI 下走「全参数非交互模式」。
4. **EJS 特殊字符注入**：项目描述里带 \`<%\` 之类字符直接让渲染崩溃。**解法**：对用户输入做转义/校验，并限制可用字符集。
5. **OSS 上传大量小文件慢**：串行 \`put\` 上传几百个文件极慢。**解法**：\`Promise.all\` 并发上传（再加并发上限控制，避免被限流）。
6. **跨平台换行 / 路径问题**：Windows 的 CRLF 和反斜杠路径导致脚本在 Mac 上跑挂。**解法**：统一 \`formatPath\`，配置 \`.gitattributes\` 强制 LF。

---

## 八、面试追问预案

- **Q：为什么不用 Yeoman？** 通用工具难匹配团队特定工作流（云构建、企微审批），自研可深度集成内部系统、每个环节可控、学习成本只在自家流程上。
- **Q：现在重新选型会怎么做？** 倾向 \`pnpm workspace + changesets + turborepo\`：更快安装、严格依赖隔离、灵活版本管理与增量构建/远程缓存。
- **Q：如何保证动态加载安全？** 限制只从官方 registry 下载、锁定最低版本、npm 自带 integrity 校验、下载失败降级到本地缓存。

---

> **一句话收尾（电梯陈述）**：我主导设计并落地了一套 Monorepo + 动态加载的前端脚手架，把项目初始化与发布上线全流程自动化，初始化从半天降到分钟级、发布失误率趋近于 0，核心亮点是「CLI 即调度器、命令逻辑热更新」和「云构建闭环」，过程中重点攻克了动态加载路径解析、WebSocket 断点续传、依赖隔离等难题。`,
    tags: [
      '脚手架', 'CLI', 'STAR法则', '面试项目', 'Monorepo', 'Lerna',
      '动态加载', 'npm', 'EJS', '云构建', 'WebSocket', 'OSS',
      'Git自动化', 'simple-git', '工程化', '项目复盘', '难点', '亮点',
    ],
  },
]
