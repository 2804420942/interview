import type { Question } from './types'

export const scaffoldProjectQuestions: Question[] = [
  {
    id: 1201,
    title: '为什么要做脚手架项目？整体流程是怎样的？',
    category: '脚手架项目详解',
    difficulty: 'hard',
    content: `## 为什么要做脚手架项目？整体流程是怎样的？

### 为什么要做？

在团队开发中，每次新建项目都需要手动配置 webpack、eslint、目录结构等，不同人配置不一样，**标准不统一**。发布上线也是手动操作 git、手动构建、手动上传服务器，**流程繁琐且容易出错**。所以设计了这个脚手架工具，把这些重复的工作自动化，让开发者只需要关注业务代码本身。

### 整体流程

脚手架有两大核心命令：

\`\`\`
imooc-cli init        →  项目初始化
imooc-cli publish     →  项目发布
\`\`\`

### Init 流程

1. **检查运行环境** —— node版本检查、用户主目录检查
2. **动态加载 @imooc-cli/init 包** —— 本地有缓存则检查更新，没有则从npm下载到 \`~/.imooc-cli/\`
3. **交互式询问用户(inquirer)** —— 项目名称、版本号、选择模板
4. **从接口获取模板列表** —— 模板本身也是npm包，动态下载
5. **EJS模板渲染** —— 把用户填写的信息注入模板文件（如 package.json 里的 name/version）
6. **自动执行 npm install + npm run serve** —— 减少人工干预，开箱即用

### Publish 流程

1. **Git 自动化** —— 初始化本地仓库、调用 GitHub/Gitee API 自动创建远程仓库、检测代码冲突、规范分支（feature/1.0.0）、自动提交推送代码
2. **企微消息推送审批** —— 通知相关人员审批，确保发布流程规范安全
3. **云构建（WebSocket实时通信）** —— CLI连接云构建服务器，服务端执行 \`git clone → npm install → npm run build\`，实时推送构建日志到CLI终端
4. **云发布** —— 构建产物上传阿里云OSS，从OSS下载 index.html 部署到目标服务器，完成自动化发布闭环

### 追问：如果重新设计这个脚手架，你会做哪些改进？

**答案：**
1. 引入**插件系统**，让脚手架更易扩展（类似 Vite 插件）
2. 增加**模板版本管理**，支持模板升级
3. 优化**错误提示**，提供更友好的错误信息和修复建议
4. 增加**单元测试覆盖率**
5. 支持 **monorepo 项目**的初始化

### 追问：为什么选择自研而非现有工具（如 Yeoman）？

**答案：**
1. 现有工具功能过于通用，无法完全匹配团队的**特定工作流**（如云构建、企微审批）
2. 自研可以深度集成内部系统（Git 平台 API、OSS、消息推送）
3. 对脚手架的**每个环节可控**，出问题能快速定位修复
4. 学习成本方面，自研脚手架团队只需要了解自己的流程，而通用工具需要学习框架本身的概念`,
    tags: ['脚手架', 'CLI', 'Node.js', '研发工作流', '项目架构']
  },
  {
    id: 1202,
    title: '脚手架的动态加载npm包机制是怎么实现的？',
    category: '脚手架项目详解',
    difficulty: 'hard',
    content: `## 脚手架的动态加载npm包机制是怎么实现的？

### 传统 CLI 的痛点

传统 CLI 把所有命令逻辑打包在 CLI 本体中，一旦有 bug 必须让用户重新 \`npm install -g\`，用户体验极差。

### 我的方案：插件化 + 动态加载

**核心思想：** CLI 本体只是一个壳（调度器），具体命令逻辑（init/publish）是独立的 npm 包，每次执行时动态从 npm 下载最新版本到本地缓存。

\`\`\`javascript
// 动态加载的核心流程
async function execCommand(packageName, packageVersion) {
  // 1. 检查本地缓存目录 ~/.imooc-cli/dependencies/
  const targetPath = path.resolve(homePath, '.imooc-cli', 'dependencies')
  
  // 2. 创建 Package 实例（封装了npm包的操作）
  const pkg = new Package({
    targetPath,
    storeDir: path.resolve(targetPath, 'node_modules'),
    packageName,
    packageVersion
  })
  
  // 3. 判断本地是否存在
  if (await pkg.exists()) {
    // 存在 → 检查是否有更新
    await pkg.update()
  } else {
    // 不存在 → 从npm下载
    await pkg.install()
  }
  
  // 4. 获取入口文件路径并执行
  const rootFile = pkg.getRootFilePath()
  require(rootFile)(args)
}
\`\`\`

### 效果

- 用户**不需要重新安装CLI**
- 命令逻辑可以**随时更新**，用户下次执行自动用最新版
- 类似**插件化架构**

### 追问：npm包缓存后的路径解析有什么难点？

**答案：**
npm 包缓存后的目录结构比较特殊：

\`\`\`
// 实际路径示例
_@imooc-cli_init@1.0.0@@imooc-cli/init/
\`\`\`

需要根据 \`package.json\` 中的 \`main\` 或 \`module\` 字段找到入口文件。还有**跨平台路径问题**，Windows 用 \`\\\`，Mac 用 \`/\`，\`require()\` 路径必须统一处理：

\`\`\`javascript
function formatPath(p) {
  if (p && process.platform === 'win32') {
    return p.replace(/\\\\/g, '/')
  }
  return p
}
\`\`\`

### 追问：如何保证动态加载的安全性？

**答案：**
1. **限制来源**：只从 npm 官方 registry 下载，不允许自定义源
2. **版本控制**：可以锁定最低版本，防止加载过旧的有漏洞版本
3. **完整性校验**：npm install 自带 integrity check（shasum 校验）
4. **异常处理**：下载失败时降级到本地缓存版本，而不是直接报错`,
    tags: ['脚手架', '动态加载', 'npm', '插件化', 'Node.js']
  },
  {
    id: 1203,
    title: '脚手架为什么用 Monorepo + Lerna 架构？',
    category: '脚手架项目详解',
    difficulty: 'medium',
    content: `## 脚手架为什么用 Monorepo + Lerna 架构？

### 项目结构

\`\`\`
packages/
├── core/      # 入口，命令解析
├── init/      # init命令逻辑
├── publish/   # publish命令逻辑
├── models/    # Package等数据模型
└── utils/     # 公共工具（log、格式化等）
\`\`\`

### Monorepo 的好处

1. **统一管理**：多个包在一个仓库中，版本统一发布，避免版本不一致问题
2. **共享依赖**：公共依赖提升到根目录，减少重复安装，节省磁盘空间
3. **互相引用方便**：包之间可以直接引用，不需要先发布到 npm 才能调试
4. **原子提交**：一次 commit 可以同时修改多个包，保证关联修改的一致性
5. **统一的 CI/CD**：所有包共享同一套构建、测试、发布流程

### Lerna 构建的好处

1. **自动版本管理**：\`lerna version\` 自动检测变更的包，更新版本号
2. **批量发布**：\`lerna publish\` 一键发布所有变更的包到 npm
3. **依赖拓扑排序**：按依赖关系顺序构建，保证被依赖的包先构建
4. **变更检测**：\`lerna changed\` 只检测有变更的包，避免全量构建
5. **子进程并行执行**：\`lerna run build --parallel\` 充分利用多核 CPU

### 追问：为什么不用 pnpm workspace 替代 Lerna？

**答案：**

这是一个很好的问题，现在 pnpm workspace 确实越来越流行。当时选择 Lerna 的原因：

| 对比维度 | Lerna | pnpm workspace |
|---------|-------|----------------|
| 版本管理 | 内置 version 和 publish 命令 | 需要配合 changesets 等工具 |
| 依赖安装 | 使用 npm/yarn，存在 phantom dependency | 严格的依赖隔离，不存在幽灵依赖 |
| 磁盘占用 | 普通 node_modules | 硬链接 + 软链接，磁盘占用更小 |
| 构建编排 | 内置拓扑排序 | 需要配合 turborepo 等工具 |
| 学习成本 | 文档成熟，社区案例多 | 需要理解其独特的 node_modules 结构 |

**如果现在重新选型**，会考虑 pnpm workspace + changesets + turborepo 的组合：
- **pnpm**：更快的安装速度、严格的依赖隔离、更小的磁盘占用
- **changesets**：灵活的版本管理和 changelog 生成
- **turborepo**：增量构建、远程缓存、任务编排

### 追问：Lerna 和普通 monorepo 有什么区别？

**答案：**
"普通 monorepo" 通常指只用 npm/yarn/pnpm workspace 管理多包，只解决了依赖安装和链接问题。Lerna 在此基础上提供了：
1. **版本管理**：independent 或 fixed 模式
2. **发布流程**：自动检测变更、更新版本号、发布到 npm
3. **任务执行**：\`lerna run\` 按拓扑排序执行脚本
4. **变更检测**：基于 git diff 判断哪些包有变更`,
    tags: ['Monorepo', 'Lerna', 'pnpm', '架构设计', '工程化']
  },
  {
    id: 1204,
    title: '脚手架的 Git 流程自动化是怎么实现的？',
    category: '脚手架项目详解',
    difficulty: 'hard',
    content: `## 脚手架的 Git 流程自动化是怎么实现的？

### 以前的发布痛点

\`\`\`
手动 git init → 手动去 GitHub 建仓库 → 手动关联 remote
手动检查冲突 → 手动切分支 → 手动 push
\`\`\`

### 自动化方案

使用 \`simple-git\` 库操作 Git，配合 GitHub/Gitee REST API 实现全流程自动化：

\`\`\`javascript
// Git 自动化核心流程
async function gitAutomate() {
  // 1. 初始化 Git 仓库
  if (!await git.checkIsRepo()) {
    await git.init()
  }
  
  // 2. 调用 GitHub API 创建远程仓库
  const { data } = await axios.post('https://api.github.com/user/repos', {
    name: projectName,
    private: true
  }, { headers: { Authorization: \`token \${token}\` } })
  
  // 3. 关联远程仓库
  await git.addRemote('origin', data.clone_url)
  
  // 4. 检测代码冲突
  const status = await git.status()
  if (status.conflicted.length > 0) {
    throw new Error('存在代码冲突，请先解决')
  }
  
  // 5. 规范分支管理
  await git.checkout(['-b', \`feature/\${version}\`])
  
  // 6. 提交并推送
  await git.add('.')
  await git.commit(\`feat: init project v\${version}\`)
  await git.push('origin', \`feature/\${version}\`)
}
\`\`\`

### 分支规范强制检查

脚手架会自动检查并强制执行分支规范：
- **开发分支**：\`feature/x.y.z\`
- **修复分支**：\`hotfix/x.y.z\`
- **发布分支**：\`release/x.y.z\`
- 禁止直接在 master/main 分支上开发

### 追问：simple-git 怎么检测代码冲突的？

**答案：**
\`simple-git\` 的 \`status()\` 方法返回工作区状态，其中 \`conflicted\` 数组包含所有冲突文件。底层原理是执行 \`git status --porcelain\` 命令，解析输出中的冲突标记（UU、AA 等）。

### 追问：如何处理 Git 操作中的异常？

**答案：**
1. **网络异常**：设置超时时间，失败后提示用户检查网络
2. **权限问题**：token 过期时引导用户重新授权
3. **冲突处理**：自动 stash 未提交的修改，pull 后再 pop
4. **回滚机制**：操作失败时回到操作前的状态（记录初始 HEAD）`,
    tags: ['Git', 'simple-git', 'GitHub API', '自动化', 'CI/CD']
  },
  {
    id: 1205,
    title: '脚手架的云构建和自动化发布是怎么实现的？',
    category: '脚手架项目详解',
    difficulty: 'hard',
    content: `## 脚手架的云构建和自动化发布是怎么实现的？

### 为什么需要云构建？

1. **环境一致性**：本地环境各不相同（Node版本、操作系统），云端统一环境避免"我本地能跑"的问题
2. **安全性**：构建密钥（OSS AccessKey 等）不暴露在开发者本地
3. **资源利用**：构建服务器配置更高，构建更快

### WebSocket 实时通信架构

\`\`\`
CLI客户端          云构建服务器          阿里云 OSS
   │                  │                    │
   │ ── ws连接 ──→    │                    │
   │ ── 发送构建指令 → │                    │
   │                  │ ── git clone        │
   │ ←── 实时日志 ──  │ ── npm install      │
   │ ←── 实时日志 ──  │ ── npm run build    │
   │                  │ ── 上传构建产物 ──→  │
   │ ←── 构建完成 ──  │                    │
   │                  │                    │
\`\`\`

### 核心实现

\`\`\`javascript
// CLI 端 WebSocket 连接
function connectBuildServer(taskId) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(BUILD_SERVER_URL)
    
    // 设置超时
    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error('构建超时'))
    }, 5 * 60 * 1000) // 5分钟超时
    
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'build', taskId }))
    })
    
    ws.on('message', (data) => {
      const msg = JSON.parse(data)
      switch (msg.type) {
        case 'log':
          // 实时打印构建日志
          console.log(msg.content)
          break
        case 'success':
          clearTimeout(timeout)
          resolve(msg.result)
          break
        case 'error':
          clearTimeout(timeout)
          reject(new Error(msg.message))
          break
      }
    })
    
    ws.on('error', (err) => {
      clearTimeout(timeout)
      reject(err)
    })
    
    ws.on('close', () => {
      clearTimeout(timeout)
    })
  })
}
\`\`\`

### OSS 上传与部署

\`\`\`javascript
// 使用阿里云 OSS SDK
const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: process.env.OSS_AK,
  accessKeySecret: process.env.OSS_SK,
  bucket: 'project-bucket'
})

// 上传构建产物
async function uploadToOSS(buildDir) {
  const files = glob.sync('**/*', { cwd: buildDir, nodir: true })
  await Promise.all(files.map(file => 
    client.put(\`/project/\${version}/\${file}\`, 
      path.join(buildDir, file))
  ))
}
\`\`\`

### 追问：WebSocket 断线了怎么处理？

**答案：**
1. **心跳检测**：定期发送 ping/pong，检测连接是否存活
2. **自动重连**：断线后指数退避重试（1s、2s、4s...）
3. **断点续传**：服务端记录日志偏移量，重连后从断点继续推送
4. **超时兜底**：设置最大重试次数和总超时时间，超时后提示用户

### 追问：OSS 上传怎么保证安全？

**答案：**
1. **STS 临时凭证**：不使用永久 AccessKey，通过 STS 获取临时凭证，有效期和权限可控
2. **服务端签名**：上传策略由服务端生成签名，客户端只负责上传
3. **Bucket 策略**：限制上传目录、文件类型、大小
4. **CDN + HTTPS**：部署时通过 CDN 加速，全链路 HTTPS`,
    tags: ['云构建', 'WebSocket', 'OSS', '阿里云', '自动化发布']
  },
  {
    id: 1206,
    title: '脚手架中 EJS 模板渲染是怎么工作的？',
    category: '脚手架项目详解',
    difficulty: 'medium',
    content: `## 脚手架中 EJS 模板渲染是怎么工作的？

### 模板渲染的作用

用户通过 inquirer 输入的项目信息（名称、版本、描述等），需要注入到模板文件中。例如 \`package.json\` 中的 name、version 字段。

### 核心流程

\`\`\`javascript
const ejs = require('ejs')
const glob = require('glob')

async function renderTemplates(templateDir, projectInfo) {
  // 1. 获取所有需要渲染的文件
  const files = glob.sync('**/*', {
    cwd: templateDir,
    nodir: true,
    ignore: [
      'node_modules/**',
      'public/**/*.{png,jpg,gif,svg,ico}',
      '**/*.{woff,woff2,ttf,eot}'
    ]
  })
  
  // 2. 并发渲染所有文本文件
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(templateDir, file)
      
      // 判断是否为文本文件（二进制文件不能用 EJS 渲染）
      if (isBinaryFile(filePath)) return
      
      // EJS 渲染
      const result = await ejs.renderFile(filePath, projectInfo)
      
      // 写回文件
      fs.writeFileSync(filePath, result)
    })
  )
}
\`\`\`

### 模板示例

\`\`\`json
// package.json 模板
{
  "name": "<%= projectName %>",
  "version": "<%= projectVersion %>",
  "description": "<%= projectDescription %>"
}
\`\`\`

### 追问：EJS 渲染时怎么处理二进制文件？

**答案：**
二进制文件（图片、字体等）不能用 EJS 渲染，否则会**损坏文件内容**。处理方式：

1. **文件扩展名过滤**：通过 glob 的 ignore 选项排除已知的二进制格式
2. **文件头检测**：读取文件前几个字节，检测是否为文本文件

\`\`\`javascript
function isBinaryFile(filePath) {
  const buffer = Buffer.alloc(512)
  const fd = fs.openSync(filePath, 'r')
  const bytesRead = fs.readSync(fd, buffer, 0, 512, 0)
  fs.closeSync(fd)
  
  // 检测是否包含 NULL 字节（二进制文件特征）
  for (let i = 0; i < bytesRead; i++) {
    if (buffer[i] === 0) return true
  }
  return false
}
\`\`\`

### 追问：模板文件本身是怎么管理的？

**答案：**
模板本身也是 **npm 包**，托管在 npm registry 上。

1. 用户选择模板后，脚手架从 npm 下载模板包到本地缓存
2. 解压后获取模板文件，进行 EJS 渲染
3. 下次使用同一模板时，检查本地缓存版本是否最新
4. 好处：模板可以**独立维护和更新**，不需要更新脚手架本身`,
    tags: ['EJS', '模板渲染', 'Node.js', '二进制检测']
  },
  {
    id: 1207,
    title: '脚手架中子进程是怎么使用的？',
    category: '脚手架项目详解',
    difficulty: 'medium',
    content: `## 脚手架中子进程是怎么使用的？

### 为什么需要子进程？

1. **执行系统命令**：如 \`npm install\`、\`npm run build\` 等
2. **隔离执行环境**：动态加载的 npm 包在子进程中执行，避免污染主进程
3. **利用多核 CPU**：耗时操作放到子进程并行执行

### 使用的 Node API

\`\`\`javascript
const { spawn, exec, fork } = require('child_process')

// 1. spawn：流式输出，适合长时间运行的命令
function execCommand(command, args, options) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit', // 继承父进程的标准IO
    ...options
  })
  
  return new Promise((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(\`Command failed with code \${code}\`))
    })
  })
}

// 使用示例：执行 npm install
await execCommand('npm', ['install'], { cwd: projectDir })

// 2. fork：执行 JS 文件，支持父子进程通信
const child = fork(scriptPath, args, {
  cwd: process.cwd(),
  env: process.env
})

child.on('message', (msg) => {
  console.log('子进程消息:', msg)
})

child.send({ type: 'start', data: taskInfo })
\`\`\`

### Windows 兼容性处理

Windows 下 \`spawn\` 执行 npm 需要特殊处理：

\`\`\`javascript
// Windows 下 npm 实际是 npm.cmd
function execCommandCompatible(command, args, options) {
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c', command, ...args] : args
  
  return spawn(cmd, cmdArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    ...options
  })
}
\`\`\`

### 追问：spawn 和 exec 的区别？

**答案：**

| 对比 | spawn | exec |
|------|-------|------|
| 输出方式 | 流式输出（stream） | 缓冲输出（buffer） |
| 适用场景 | 长时间运行、大量输出 | 短命令、小输出 |
| 内存 | 不缓冲，内存占用小 | 全部缓冲到内存 |
| shell | 默认不通过 shell | 默认通过 shell |
| 回调 | 通过事件监听 | callback 或 Promise |

### 追问：子进程执行失败怎么处理？

**答案：**
1. **监听 error 事件**：捕获进程启动失败（如命令不存在）
2. **检查退出码**：exit code 非 0 表示执行失败
3. **超时控制**：设置最大执行时间，超时后 kill 子进程
4. **优雅退出**：先发 SIGTERM，等待一段时间后再发 SIGKILL`,
    tags: ['子进程', 'spawn', 'exec', 'fork', 'Node.js']
  },
  {
    id: 1208,
    title: '脚手架的缓存机制是怎么设计的？',
    category: '脚手架项目详解',
    difficulty: 'medium',
    content: `## 脚手架的缓存机制是怎么设计的？

### 缓存目录结构

\`\`\`
~/.imooc-cli/
├── dependencies/           # 命令包缓存
│   └── node_modules/
│       ├── @imooc-cli/init/
│       └── @imooc-cli/publish/
├── templates/              # 项目模板缓存
│   └── node_modules/
│       ├── imooc-cli-template-vue3/
│       └── imooc-cli-template-react/
└── .imooc-cli-config.json  # 配置文件（token等）
\`\`\`

### 缓存策略

\`\`\`javascript
class Package {
  constructor({ targetPath, storeDir, packageName, packageVersion }) {
    this.targetPath = targetPath
    this.storeDir = storeDir
    this.packageName = packageName
    this.packageVersion = packageVersion
  }
  
  // 检查包是否已缓存
  async exists() {
    const pkgDir = this.getSpecificCacheDir()
    return pathExists(pkgDir)
  }
  
  // 安装包到缓存目录
  async install() {
    await npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{
        name: this.packageName,
        version: this.packageVersion
      }]
    })
  }
  
  // 检查更新
  async update() {
    // 获取 npm 上的最新版本
    const latestVersion = await getNpmLatestVersion(this.packageName)
    
    // 对比本地缓存版本
    if (latestVersion !== this.packageVersion) {
      // 安装最新版本
      this.packageVersion = latestVersion
      await this.install()
    }
  }
  
  // 获取入口文件
  getRootFilePath() {
    const dir = this.getSpecificCacheDir()
    const pkgJson = require(path.resolve(dir, 'package.json'))
    return path.resolve(dir, pkgJson.main || pkgJson.lib || 'index.js')
  }
}
\`\`\`

### 版本检查机制

\`\`\`javascript
// 获取 npm 包的最新版本
async function getNpmLatestVersion(packageName) {
  const { data } = await axios.get(
    \`https://registry.npmjs.org/\${packageName}\`
  )
  return data['dist-tags'].latest
}
\`\`\`

### 追问：缓存什么时候清理？

**答案：**
1. **手动清理**：提供 \`imooc-cli clean\` 命令清空缓存
2. **版本淘汰**：更新时自动删除旧版本缓存
3. **磁盘空间**：暂未实现自动清理（可以参考 npm cache 的 LRU 策略）

### 追问：如果 npm registry 不可用怎么办？

**答案：**
1. 本地有缓存时，直接使用缓存版本（跳过更新检查）
2. 支持配置**私有 registry**（如公司内部 npm 镜像）
3. 设置合理的**请求超时**（5秒），超时后直接使用本地缓存
4. 离线模式：检测网络不可用时，直接使用本地缓存`,
    tags: ['缓存机制', 'npm', 'Package', 'Node.js']
  },
  {
    id: 1209,
    title: '如何保证脚手架的跨平台兼容性？',
    category: '脚手架项目详解',
    difficulty: 'medium',
    content: `## 如何保证脚手架的跨平台兼容性？

### 主要兼容性问题

1. **路径分隔符**：Windows 用 \`\\\`，Mac/Linux 用 \`/\`
2. **命令执行**：Windows 下 npm 是 \`npm.cmd\`
3. **环境变量**：Windows 用 \`%VAR%\`，Unix 用 \`$VAR\`
4. **用户主目录**：Windows 是 \`C:\\Users\\xxx\`，Mac 是 \`/Users/xxx\`
5. **文件权限**：Unix 有可执行权限概念，Windows 没有

### 解决方案

\`\`\`javascript
// 1. 路径统一化
const path = require('path')
function formatPath(p) {
  if (p && process.platform === 'win32') {
    return p.replace(/\\\\/g, '/')
  }
  return p
}
// 推荐使用 path.join/path.resolve 而非手动拼接

// 2. 用户主目录
const os = require('os')
const homedir = os.homedir() // 跨平台获取主目录
// 或 process.env.HOME || process.env.USERPROFILE

// 3. 命令执行兼容
const { spawn } = require('child_process')
function spawnCompat(command, args, options) {
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c', command, ...args] : args
  return spawn(cmd, cmdArgs, options)
}

// 4. 环境变量设置
// 使用 cross-env 包解决
// package.json: "build": "cross-env NODE_ENV=production webpack"

// 5. 文件权限
// chmod 在 Windows 下静默忽略即可
try {
  fs.chmodSync(filePath, 0o755)
} catch (e) {
  // Windows 下忽略
}
\`\`\`

### 追问：有没有遇到过特别棘手的兼容性问题？

**答案：**
遇到过 Windows 下 \`spawn\` 执行 npm 脚本时，如果路径中有空格会失败。解决方案是将路径用引号包裹，或者使用 \`shell: true\` 选项让 spawn 通过 shell 执行。

还有一个是 Windows 下文件路径长度限制（260字符），在 \`node_modules\` 嵌套很深时会出问题。解决方案是使用 npm 3+ 的扁平化安装，或启用 Windows 的长路径支持。

### 追问：你们测试是怎么覆盖多平台的？

**答案：**
1. 开发时在 Mac 上开发，Windows 虚拟机上验证
2. CI/CD 中配置多平台矩阵（GitHub Actions 支持 ubuntu、windows、macos）
3. 核心路径处理函数编写单元测试，mock 不同 \`process.platform\``,
    tags: ['跨平台', 'Windows', 'Mac', 'Linux', 'Node.js']
  },
  {
    id: 1210,
    title: '脚手架项目的一句话总结和面试官追问清单',
    category: '脚手架项目详解',
    difficulty: 'easy',
    content: `## 脚手架项目的一句话总结和面试官追问清单

### 一句话总结（面试结尾用）

> 这个项目的核心价值是**把团队开发中重复的、容易出错的流程全部自动化**。最大的技术亮点是**动态加载npm包实现插件化架构**，让脚手架本体和业务逻辑解耦，可以随时热更新命令逻辑而不需要用户重新安装。整个 init 到 publish 形成了一套完整的**研发工作流自动化**方案。

### 项目亮点速记

| 亮点 | 关键词 | 一句话描述 |
|------|--------|-----------|
| 动态加载 | npm包热更新 | CLI是壳，命令逻辑动态下载，自动更新 |
| Monorepo | Lerna多包管理 | 统一版本、原子提交、拓扑构建 |
| Git自动化 | simple-git + API | 建仓库、检冲突、切分支全自动 |
| 云构建 | WebSocket实时 | 服务端构建，实时日志推送 |
| 云发布 | OSS + 自动部署 | 构建产物自动上传并部署 |

### 面试官可能的追问清单

**技术实现类：**
1. 动态加载 npm 包具体怎么实现的？（Package 类、require 动态加载）
2. Lerna 和普通 monorepo 有什么区别？（版本管理、发布流程、任务编排）
3. 子进程是怎么用的？用了哪个 Node API？（spawn/exec/fork，Windows 兼容）
4. EJS 模板渲染时怎么处理二进制文件？（文件头检测、扩展名过滤）
5. simple-git 怎么检测代码冲突的？（status() + conflicted 数组）

**架构设计类：**
6. WebSocket 断线了怎么处理？（心跳检测、指数退避重连、断点续传）
7. OSS 上传用的什么 SDK？怎么保证安全？（STS临时凭证、服务端签名）
8. 缓存机制具体是怎么设计的？（Package 类、版本比对、离线降级）

**工程实践类：**
9. 怎么保证 Windows 和 Mac 都能用？（路径格式化、spawn 兼容、cross-env）
10. 企微消息推送怎么实现的？（Webhook API、审批流）

### 项目地址

GitHub: [imooc-lego/imooc-cli](https://github.com/imooc-lego/imooc-cli)

### 回答技巧

1. **用 STAR 法则**：Situation（背景）→ Task（任务）→ Action（行动）→ Result（结果）
2. **先总后分**：先说整体架构和核心价值，再展开细节
3. **数据说话**：如"将发布流程从 30 分钟手动操作减少到 1 条命令 2 分钟完成"
4. **展示思考**：不只是说做了什么，还要说为什么这样设计、有什么权衡取舍`,
    tags: ['面试技巧', 'STAR法则', '项目总结', '追问清单']
  },
  {
    id: 1211,
    title: '脚手架项目的难点和亮点是什么？（面试总结）',
    category: '脚手架项目详解',
    difficulty: 'hard',
    tags: ['项目亮点', '项目难点', 'CLI', 'Monorepo', '面试话术'],
    content: `## 脚手架项目的难点和亮点是什么？（面试总结）

> 以下内容按"**一句话结论 → 展开说 → 一句话收尾**"的结构组织，方便背诵和口头表达。
> 项目地址：[imooc-lego/imooc-cli](https://github.com/imooc-lego/imooc-cli)

---

## 📋 一句话总结（面试开场白）

> 这个项目是一个企业级前端 CLI 脚手架工具，基于 **Node.js + Lerna Monorepo** 架构，实现了项目初始化、Git Flow 自动化、云构建和自动发布的完整研发工作流。核心亮点是 **动态加载 npm 包的插件化架构** 实现命令热更新，以及 **WebSocket 实时通信的云构建系统**。核心难点在于 **npm 缓存包的路径解析与版本管理**、**Git 多分支自动化流程的异常处理**，以及 **跨平台兼容性（Windows/Mac/Linux）**。

---

## ✨ 亮点一：动态加载 npm 包，CLI 本体零更新

**一句话：** CLI 本体只是一个调度壳，所有命令逻辑（init/publish）都是独立的 npm 包，每次执行时动态下载最新版本，用户不需要重新 \`npm install -g\`。

**展开说：**

\`\`\`
用户执行 imooc-cli init
        ↓
CLI Core 解析命令 → 确定需要 @imooc-cli/init 包
        ↓
检查本地缓存 ~/.imooc-cli/dependencies/
   ├── 没有缓存 → 从 npm registry 下载最新版到本地
   └── 有缓存   → 对比版本号，有更新则增量更新
        ↓
读取 package.json → main 字段 → 获取入口文件路径
        ↓
require(rootFile)(args) → 执行命令逻辑
\`\`\`

\`\`\`javascript
// Package 类核心实现
class Package {
  async exists() {
    // 检查 _@imooc-cli_init@1.0.0@@imooc-cli/init/ 是否存在
    return pathExists(this.getSpecificCacheDir())
  }

  async update() {
    const latestVersion = await getNpmLatestVersion(this.packageName)
    if (latestVersion !== this.packageVersion) {
      this.packageVersion = latestVersion
      await this.install() // 自动更新到最新版
    }
  }

  getRootFilePath() {
    const pkgJson = require(path.resolve(dir, 'package.json'))
    return formatPath(path.resolve(dir, pkgJson.main))
  }
}
\`\`\`

- 类似**微内核 + 插件化**架构，核心只负责调度，业务逻辑全部外置
- 本地缓存 + 版本对比，非首次执行速度极快（毫秒级）
- 命令逻辑有 bug 时，修复后发布新版本，用户下次执行自动拉取，**无需通知用户更新**

**收尾：** 这种架构让 CLI 具备了"热更新"能力，发布新版本后所有用户自动生效，大幅降低了维护成本。

---

## ✨ 亮点二：Lerna Monorepo + 拓扑排序构建

**一句话：** 用 Lerna 管理十多个子包，依赖关系自动拓扑排序，一键批量构建和发布，保证关联修改的原子性。

**展开说：**

\`\`\`
imooc-cli/
├── packages/
│   ├── core/         # 入口，命令解析和调度
│   ├── init/         # init 命令逻辑
│   ├── publish/      # publish 命令逻辑
│   ├── models/       # Package、Command 等数据模型
│   ├── utils/        # 公共工具（log、格式化、请求）
│   └── ...
├── lerna.json        # Lerna 配置
└── package.json      # 根配置
\`\`\`

- **依赖提升**：公共依赖（如 fs-extra、axios）提升到根目录，子包共享，减少重复安装
- **互相引用**：\`@imooc-cli/utils\` 被多个包引用，开发时通过软链接直接调试，不需要先发布
- **拓扑排序构建**：\`lerna run build\` 自动按依赖关系顺序构建，utils → models → init/publish → core
- **变更检测**：\`lerna changed\` 只检测有变更的包，发布时不会误发没修改的包
- **原子提交**：一次 commit 同时修改 utils 和依赖它的 init，保证版本一致性

**收尾：** 相比各自独立仓库管理，Monorepo 让多包协作的开发效率提升了一个量级，代码复用和版本管理都更简单。

---

## ✨ 亮点三：WebSocket 实时通信的云构建系统

**一句话：** 本地不执行构建，通过 WebSocket 连接云构建服务器，服务端执行 git clone → npm install → npm run build，实时推送日志到 CLI 终端。

**展开说：**

\`\`\`
CLI 客户端              云构建服务器              阿里云 OSS
   │                       │                       │
   │── WebSocket 连接 ──→  │                       │
   │── 发送构建指令 ──→     │                       │
   │                       │── git clone            │
   │ ←── 实时日志推送 ──   │── npm install          │
   │ ←── 实时日志推送 ──   │── npm run build        │
   │                       │── 上传构建产物 ──→     │
   │ ←── 构建完成通知 ──   │                       │
\`\`\`

\`\`\`javascript
// CLI 端 WebSocket 连接核心
const ws = new WebSocket(BUILD_SERVER_URL)

ws.on('message', (data) => {
  const msg = JSON.parse(data)
  switch (msg.type) {
    case 'log':     console.log(msg.content)       // 实时打印构建日志
    case 'success': resolve(msg.result)             // 构建成功
    case 'error':   reject(new Error(msg.message))  // 构建失败
  }
})
\`\`\`

- **环境一致性**：云端统一 Node 版本和构建环境，避免"我本地能跑"的问题
- **安全性**：OSS AccessKey 等敏感凭证只存在服务端，不暴露给开发者
- **心跳检测 + 断线重连**：WebSocket 断开后自动指数退避重连（1s → 2s → 4s），5 分钟超时兜底
- 构建产物自动上传 OSS，再从 OSS 下载 index.html 部署到目标服务器，形成完整闭环

**收尾：** 这套架构让构建过程对开发者完全透明，只需一条命令就能完成从代码推送到线上部署的全流程。

---

## ✨ 亮点四：Git Flow 全流程自动化

**一句话：** 从初始化仓库、创建远程 repo、分支管理、冲突检测到代码推送，整个 Git 流程一键自动化，强制执行分支规范。

**展开说：**

\`\`\`
imooc-cli publish
        ↓
检查 .git 是否存在
   └── 不存在 → git init
        ↓
调用 GitHub/Gitee REST API → 自动创建远程仓库
        ↓
git remote add origin {url}
        ↓
git status → 检测冲突
   └── conflicted.length > 0 → 报错，提示手动解决
        ↓
自动切换到规范分支 feature/{version}
        ↓
git add . → git commit → git push
\`\`\`

\`\`\`javascript
// 调用 GitHub API 自动创建远程仓库
const { data } = await axios.post('https://api.github.com/user/repos', {
  name: projectName,
  private: true
}, { headers: { Authorization: \`token \${token}\` } })

await git.addRemote('origin', data.clone_url)
\`\`\`

- **分支规范强制**：只允许 \`feature/x.y.z\`、\`hotfix/x.y.z\`、\`release/x.y.z\`，禁止在 master 直接开发
- **冲突自动处理**：检测到未提交修改时自动 stash，pull 后再 pop
- 支持 **GitHub 和 Gitee** 双平台，通过交互式选择

**收尾：** 这彻底消除了团队中 Git 操作不规范的问题，新人入职不需要学习 Git 流程，一条命令就搞定。

---

## 💪 难点一：npm 缓存包的路径解析

**一句话：** npm 包缓存后的目录结构非常特殊（带 \`@\` 和版本号前缀），需要自己解析 package.json 找入口文件，还要处理 Windows/Mac 路径差异。

**展开说：**

\`\`\`
npm 缓存后的实际路径（非常规）：
~/.imooc-cli/dependencies/node_modules/
  └── _@imooc-cli_init@1.0.0@@imooc-cli/
        └── init/
              ├── package.json   ← 从这里读 main 字段
              └── lib/
                    └── index.js ← 实际入口文件
\`\`\`

\`\`\`javascript
// 路径解析核心逻辑
getRootFilePath() {
  const dir = this.getSpecificCacheDir()
  // 1. 读 package.json
  const pkgJson = require(path.resolve(dir, 'package.json'))
  // 2. 优先 main，兜底 lib/index.js
  const entry = pkgJson.main || pkgJson.lib || 'index.js'
  // 3. 跨平台路径格式化
  return formatPath(path.resolve(dir, entry))
}

// Windows 路径统一化：反斜杠 → 正斜杠
function formatPath(p) {
  if (p && process.platform === 'win32') {
    return p.replace(/\\\\/g, '/')
  }
  return p
}
\`\`\`

- **版本号拼接**：缓存目录名格式为 \`_@{scope}_{name}@{version}@{scope}/{name}\`，需要手动拼接
- **符号链接问题**：部分 npm 版本用 symlink 指向实际目录，\`fs.realpathSync\` 才能拿到真实路径
- **入口字段兼容**：有些包用 \`main\`，有些用 \`module\`，有些用 \`exports\`，需要按优先级逐个尝试

**收尾：** 这块踩了很多坑，因为 npm 的缓存结构在不同版本之间还有差异，只能通过大量测试覆盖各种情况。

---

## 💪 难点二：子进程执行的跨平台兼容

**一句话：** 脚手架需要调用 \`npm install\`、\`npm run build\` 等系统命令，但 Windows 下 \`spawn('npm')\` 会直接报错，因为 npm 在 Windows 上实际是 \`npm.cmd\`。

**展开说：**

\`\`\`javascript
// ❌ 错误写法：Windows 下会报 ENOENT
spawn('npm', ['install'])

// ✅ 正确写法：Windows 兼容处理
function spawnCompat(command, args, options) {
  const win32 = process.platform === 'win32'
  const cmd = win32 ? 'cmd' : command
  const cmdArgs = win32 ? ['/c', command, ...args] : args

  return spawn(cmd, cmdArgs, {
    cwd: process.cwd(),
    stdio: 'inherit', // 继承父进程 IO，实时输出
    ...options
  })
}
\`\`\`

其他跨平台问题：
- **路径长度限制**：Windows 默认 260 字符限制，\`node_modules\` 嵌套深时会报错，需要启用长路径支持或使用扁平化安装
- **文件权限**：Unix 有可执行权限（\`chmod +x\`），Windows 没有这个概念，\`chmod\` 调用需要 try-catch 包裹
- **环境变量**：Windows 用 \`%VAR%\`，Unix 用 \`$VAR\`，需要 \`cross-env\` 包统一处理
- **用户主目录**：\`os.homedir()\` 跨平台获取，不能硬编码 \`~\` 或 \`/Users/\`
- **行尾符**：Windows 是 CRLF，Unix 是 LF，EJS 模板渲染后需要统一

**收尾：** 跨平台兼容是 CLI 工具最容易被忽略但最影响用户体验的问题，每一个"在我电脑上能用"的背后都可能是一个平台差异 bug。

---

## 💪 难点三：EJS 模板渲染的二进制文件识别

**一句话：** 模板目录中混合了文本文件和二进制文件（图片、字体），EJS 如果渲染二进制文件会直接损坏文件内容，需要准确识别并跳过。

**展开说：**

\`\`\`javascript
// glob 获取所有文件后，逐个判断是否为二进制
const files = glob.sync('**/*', {
  cwd: templateDir,
  nodir: true,
  ignore: ['node_modules/**', '**/*.{png,jpg,gif,svg,ico,woff,woff2,ttf,eot}']
})

await Promise.all(files.map(async (file) => {
  const filePath = path.join(templateDir, file)

  // 二进制文件检测：读取文件头 512 字节
  if (isBinaryFile(filePath)) return // 跳过二进制文件

  // EJS 渲染文本文件
  const result = await ejs.renderFile(filePath, projectInfo)
  fs.writeFileSync(filePath, result)
}))

function isBinaryFile(filePath) {
  const buffer = Buffer.alloc(512)
  const fd = fs.openSync(filePath, 'r')
  const bytesRead = fs.readSync(fd, buffer, 0, 512, 0)
  fs.closeSync(fd)

  // 包含 NULL 字节(0x00) → 二进制文件
  for (let i = 0; i < bytesRead; i++) {
    if (buffer[i] === 0) return true
  }
  return false
}
\`\`\`

- **双重过滤**：先用 glob ignore 排除已知扩展名，再用文件头检测兜底未知格式
- **并发渲染**：\`Promise.all\` 并行渲染所有文本文件，模板文件多时速度显著提升
- **模板本身也是 npm 包**：独立维护和版本管理，更新模板不需要更新脚手架

**收尾：** 这个问题如果不处理，用户 init 完项目发现图片全花了，体验极差，而且很难定位是 EJS 渲染导致的。

---

## 💪 难点四：Git 自动化中的异常处理与回滚

**一句话：** Git 操作涉及网络请求（GitHub API）、本地文件操作（.git）、远程交互（push），任何一步失败都需要正确回滚，否则会留下半成品状态。

**展开说：**

\`\`\`javascript
async function gitAutomate() {
  // 记录初始状态，用于失败回滚
  const initialHead = await git.revparse(['HEAD']).catch(() => null)

  try {
    // Step 1: 初始化仓库
    if (!await git.checkIsRepo()) {
      await git.init()
    }

    // Step 2: 调用 GitHub API 创建远程仓库
    const repo = await createRemoteRepo(projectName, token)

    // Step 3: 关联远程
    await git.addRemote('origin', repo.clone_url)

    // Step 4: 检测冲突
    const status = await git.status()
    if (status.conflicted.length > 0) {
      throw new Error('存在代码冲突，请先手动解决')
    }

    // Step 5: stash → pull → pop（处理远程有新代码的情况）
    if (status.modified.length > 0) {
      await git.stash()
      await git.pull('origin', branch)
      await git.stash(['pop'])
    }

    // Step 6: 提交推送
    await git.add('.').commit(msg).push('origin', branch)

  } catch (err) {
    // 回滚：如果是新建的仓库，通过 API 删除
    // 如果是 push 失败，reset 回 initialHead
    if (initialHead) {
      await git.reset(['--hard', initialHead])
    }
    throw err
  }
}
\`\`\`

异常场景处理：
- **GitHub API 限流**：每小时 5000 次调用限制，超限时缓存 token 并提示用户等待
- **token 过期**：请求返回 401 时引导用户重新授权，更新本地缓存的 token
- **push 冲突**：远程有新提交时，先 pull --rebase 再 push，如果 rebase 冲突则提示用户手动处理
- **网络断开**：设置 5 秒超时，超时后使用本地缓存版本继续

**收尾：** Git 自动化最怕的就是"做了一半失败了"，留下一个不一致的状态，所以每一步都需要有对应的回滚方案。

---

## 💡 面试话术

### 被问"项目最大的亮点"时：
> "我觉得最大的亮点是**动态加载 npm 包的插件化架构**。CLI 本体只是一个调度壳，所有命令逻辑都是独立的 npm 包，用户执行命令时自动检查本地缓存，有更新就增量拉取最新版本。这样做的好处是命令逻辑有 bug 时，我们发布新版本后用户下次执行自动生效，完全不需要通知用户重新安装。另外云构建系统也很亮眼，通过 WebSocket 实时推送构建日志，让整个构建过程对开发者透明可控。"

### 被问"项目最难的地方"时：
> "最难的是两块：一是**npm 缓存包的路径解析**，npm 缓存后的目录结构非常特殊，带 @ 符号和版本号前缀，还要兼容不同 npm 版本的缓存结构差异，以及 Windows 和 Mac 的路径分隔符差异。二是**Git 自动化的异常处理**，整个流程涉及本地 Git 操作、GitHub API 调用、远程 push 三方交互，任何一步失败都需要正确回滚，避免留下半成品状态。"

### 被问"为什么选 Monorepo"时：
> "因为脚手架本身就是多个包协同工作（core、init、publish、models、utils），如果各自独立仓库，修改一个公共工具函数需要先发布 utils，再更新所有依赖它的包的版本号，非常繁琐。Monorepo 让我们可以一次 commit 同时修改多个包，Lerna 自动按拓扑排序构建和发布，效率提升很大。如果现在重新选型，可能会考虑 pnpm workspace + turborepo 的组合，安装速度更快，依赖隔离更严格。"

### 被问"和现有工具（如 Yeoman）的区别"时：
> "现有工具功能太通用，无法匹配我们团队的特定工作流。比如云构建、企微审批推送、Git Flow 强制规范这些，Yeoman 都没有。自研的好处是每个环节都可控，出问题能快速定位，同时可以深度集成内部系统（GitHub/Gitee API、阿里云 OSS、企微 Webhook）。"`
  },
  {
    id: 1212,
    title: 'imooc-cli 脚手架源码深度剖析：从 Lerna Monorepo 架构到 init/publish 全流程',
    category: '脚手架项目详解',
    difficulty: 'hard',
    content: `## imooc-cli 脚手架源码深度剖析：从 Lerna Monorepo 架构到 init/publish 全流程

> 本文基于 https://github.com/imooc-lego/imooc-cli 项目源码，从项目架构、package.json 配置、CLI 启动流程、命令注册与动态加载、init 命令、publish 命令六大维度进行逐行级别的深度分析，总计超过 1 万字。

---

## 一、项目整体架构：Lerna Monorepo 设计

### 1.1 为什么选择 Monorepo？

imooc-cli 是一个典型的 **Lerna Monorepo** 项目。所谓 Monorepo，就是把多个相互关联的 npm 包放在同一个 Git 仓库中管理。与之对应的是 Multirepo（每个包一个仓库）。

**选择 Monorepo 的原因：**

- 脚手架由多个包协同工作（core、init、publish、exec、models、utils 等），如果各自独立仓库，修改一个公共工具函数需要先发布 utils，再逐一更新所有依赖它的包的版本号，非常繁琐
- Monorepo 允许一次 commit 同时修改多个包，Lerna 自动按拓扑排序构建和发布
- 本地开发时，Lerna 通过 \`npm link\` 自动建立包之间的软链接，无需手动 link

### 1.2 项目目录结构

\`\`\`
imooc-cli/
├── lerna.json                 # Lerna 配置文件
├── package.json               # 根 package.json
├── packages/
│   ├── core/                  # 核心模块
│   │   ├── cli/               # CLI 入口包（bin 命令注册）
│   │   └── exec/              # 命令动态加载执行器
│   ├── commands/              # 命令包
│   │   ├── init/              # init 命令实现
│   │   └── publish/           # publish 命令实现
│   ├── models/                # 数据模型
│   │   ├── package/           # npm 包管理类
│   │   ├── command/           # 命令基类
│   │   └── git/               # Git 操作封装
│   └── utils/                 # 工具包
│       ├── log/               # 日志工具
│       ├── get-npm-info/      # npm 信息查询
│       ├── format-path/       # 路径格式化
│       └── utils/             # 通用工具函数
\`\`\`

### 1.3 lerna.json 配置解析

\`\`\`json
{
  "packages": [
    "packages/core/*",
    "packages/commands/*",
    "packages/models/*",
    "packages/utils/*"
  ],
  "version": "1.0.0"
}
\`\`\`

- \`packages\` 字段定义了 Lerna 管理的包的路径模式，使用通配符匹配四个子目录下的所有包
- \`version\` 采用固定模式（Fixed），所有包共享同一版本号。每次发布时 Lerna 会自动检测哪些包有变更，统一升版发布

### 1.4 根 package.json 的关键配置

\`\`\`json
{
  "name": "@imooc-cli/imooc-cli",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "lerna": "^4.0.0"
  },
  "scripts": {
    "clean": "lerna clean",
    "bootstrap": "lerna bootstrap",
    "publish": "lerna publish"
  }
}
\`\`\`

**关键点：**
- \`"private": true\` —— 根包不会被发布到 npm，它只是一个管理容器
- \`lerna clean\` —— 删除所有子包的 node_modules
- \`lerna bootstrap\` —— 为所有子包安装依赖，并自动建立包间软链接
- \`lerna publish\` —— 检测变更、升版、发布到 npm

---

## 二、CLI 入口包：如何让脚手架成为系统命令

### 2.1 package.json 的 bin 字段——核心中的核心

\`\`\`json
// packages/core/cli/package.json
{
  "name": "@imooc-cli/cli",
  "version": "1.0.0",
  "bin": {
    "imooc-cli": "bin/index.js"
  },
  "dependencies": {
    "@imooc-cli/exec": "^1.0.0",
    "@imooc-cli/log": "^1.0.0",
    "commander": "^7.0.0",
    "import-local": "^3.0.2",
    "npmlog": "^4.1.2"
  }
}
\`\`\`

**\`bin\` 字段是让脚手架成为系统命令的关键！** 它的工作原理如下：

1. 当用户执行 \`npm install -g @imooc-cli/cli\` 全局安装时，npm 会读取 package.json 中的 \`bin\` 字段
2. npm 在全局的 bin 目录（如 \`/usr/local/bin/\`）下创建一个名为 \`imooc-cli\` 的**软链接**（symlink），指向 \`bin/index.js\` 文件
3. 之后用户在终端输入 \`imooc-cli\` 时，操作系统通过 PATH 环境变量找到这个软链接，进而执行 \`bin/index.js\`

**本地开发时的 npm link 机制：**

\`\`\`bash
# 在 packages/core/cli 目录下执行
npm link
\`\`\`

这会在全局 bin 目录创建软链接，效果等同于全局安装，但指向的是本地源码，方便开发调试。

### 2.2 bin/index.js —— Shebang 与 import-local

\`\`\`javascript
#!/usr/bin/env node

const importLocal = require('import-local');

if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用 imooc-cli 本地版本');
} else {
  require('../lib')(process.argv.slice(2));
}
\`\`\`

**逐行分析：**

**第 1 行：\`#!/usr/bin/env node\`（Shebang）**

这是 Unix/Linux 系统的特殊注释，告诉操作系统用 node 来执行这个文件。\`/usr/bin/env\` 是一个查找程序的工具，它会在 PATH 中找到 node 的实际路径。这样写比直接写 \`#!/usr/local/bin/node\` 更具可移植性，因为不同系统 node 的安装路径可能不同。

**第 3-7 行：import-local 优先使用本地版本**

\`import-local\` 是一个非常巧妙的库。它检查当前项目的 node_modules 中是否安装了同名包：
- 如果项目本地有 \`@imooc-cli/cli\`（比如在 devDependencies 中），则优先使用本地版本，打印提示信息
- 如果没有，则使用全局安装的版本，调用 \`../lib\` 目录下的核心逻辑

**这个设计的好处：** 允许不同项目使用不同版本的脚手架，避免全局版本和项目需求不一致的问题。

**第 8 行：\`process.argv.slice(2)\`**

\`process.argv\` 是 Node.js 的命令行参数数组：
- \`process.argv[0]\` = node 可执行文件路径
- \`process.argv[1]\` = 当前脚本路径
- \`process.argv[2...]\` = 用户传入的参数

\`slice(2)\` 截取用户参数部分，传给核心逻辑处理。

---

## 三、核心启动流程：core/cli/lib/index.js

这是整个脚手架的"大脑"，负责启动前的一系列检查和命令注册。

### 3.1 完整的 core 函数

\`\`\`javascript
'use strict';

const path = require('path');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const commander = require('commander');
const pkg = require('../package.json');
const log = require('@imooc-cli/log');
const exec = require('@imooc-cli/exec');

const program = new commander.Command();

async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (e) {
    log.error(e.message);
    if (program.debug) {
      console.log(e);
    }
  }
}

module.exports = core;
\`\`\`

核心函数非常简洁：先执行准备阶段 \`prepare()\`，再注册命令 \`registerCommand()\`。所有异常统一捕获，debug 模式下输出完整堆栈。

### 3.2 prepare() —— 启动前的 7 项检查

\`\`\`javascript
async function prepare() {
  checkPkgVersion();    // 1. 检查当前版本号
  checkRoot();          // 2. root 账户降级
  checkUserHome();      // 3. 检查用户主目录
  checkEnv();           // 4. 检查环境变量
  await checkGlobalUpdate(); // 5. 检查是否需要全局更新
}
\`\`\`

**① checkPkgVersion() —— 检查版本号**

\`\`\`javascript
function checkPkgVersion() {
  log.info('cli', pkg.version);
}
\`\`\`

启动时打印当前脚手架版本号，让用户知道正在使用哪个版本。

**② checkRoot() —— root 账户自动降级**

\`\`\`javascript
function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck();
}
\`\`\`

在 Linux/Mac 系统中，如果用 \`sudo\` 执行脚手架，进程会以 root 身份运行。root 创建的文件其他用户无法修改，会导致后续操作权限问题。\`root-check\` 库通过调用 \`process.setuid(501)\` 将进程降级为普通用户，避免权限问题。

**③ checkUserHome() —— 检查用户主目录**

\`\`\`javascript
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'));
  }
}
\`\`\`

脚手架需要在用户主目录下创建缓存目录（\`~/.imooc-cli/\`），如果主目录不存在则直接报错退出。

**④ checkEnv() —— 检查环境变量**

\`\`\`javascript
function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  if (pathExists(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  }
  createDefaultConfig();
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, '.imooc-cli');
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}
\`\`\`

这段代码做了两件事：
1. 读取用户主目录下的 \`.env\` 文件，加载自定义环境变量
2. 设置脚手架的缓存主目录，默认为 \`~/.imooc-cli/\`，用户可通过 \`CLI_HOME\` 环境变量自定义

**⑤ checkGlobalUpdate() —— 检查全局更新**

\`\`\`javascript
async function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const { getNpmSemverVersion } = require('@imooc-cli/get-npm-info');
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(
      \\\`请手动更新 \\\${npmName}，当前版本：\\\${currentVersion}，最新版本：\\\${lastVersion}
      更新命令：npm install -g \\\${npmName}\\\`
    ));
  }
}
\`\`\`

每次启动时，通过 npm registry API 查询最新版本号，如果有更新则提示用户。这里使用 \`semver\` 库进行语义化版本比较。

\`getNpmSemverVersion\` 的实现原理：
\`\`\`javascript
// utils/get-npm-info/lib/index.js
const axios = require('axios');
const semver = require('semver');

async function getNpmInfo(npmName, registry) {
  const npmInfoUrl = \\\`\\\${registry || 'https://registry.npmjs.org'}/\\\${npmName}\\\`;
  const response = await axios.get(npmInfoUrl);
  return response.data;
}

async function getNpmVersions(npmName) {
  const data = await getNpmInfo(npmName);
  return Object.keys(data.versions);
}

function getSemverVersions(baseVersion, versions) {
  return versions
    .filter(v => semver.satisfies(v, \\\`>\\\${baseVersion}\\\`))
    .sort((a, b) => semver.gt(b, a) ? 1 : -1);
}

async function getNpmSemverVersion(baseVersion, npmName) {
  const versions = await getNpmVersions(npmName);
  const newVersions = getSemverVersions(baseVersion, versions);
  return newVersions.length > 0 ? newVersions[0] : null;
}
\`\`\`

---

## 四、命令注册与动态加载机制

### 4.1 registerCommand() —— 基于 Commander.js 的命令注册

\`\`\`javascript
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '');

  // 注册 init 命令
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(exec);

  // 注册 publish 命令
  program
    .command('publish')
    .option('--refreshServer', '强制更新远程Git仓库')
    .option('--refreshToken', '强制更新远程仓库token')
    .option('--refreshOwner', '强制更新远程仓库类型')
    .option('--buildCmd <buildCmd>', '构建命令')
    .option('--prod', '是否正式发布')
    .option('--sshUser <sshUser>', '模板服务器用户名')
    .option('--sshIp <sshIp>', '模板服务器IP或域名')
    .option('--sshPath <sshPath>', '模板服务器上传路径')
    .action(exec);

  // 开启 debug 模式
  program.on('option:debug', function() {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
  });

  // 指定 targetPath
  program.on('option:targetPath', function() {
    process.env.CLI_TARGET_PATH = program.opts().targetPath;
  });

  // 对未知命令的监听
  program.on('command:*', function(obj) {
    const availableCommands = program.commands.map(cmd => cmd.name());
    log.info(colors.red('未知的命令：' + obj[0]));
    if (availableCommands.length > 0) {
      log.info(colors.red('可用命令：' + availableCommands.join(',')));
    }
  });

  program.parse(process.argv);

  // 未输入命令时打印帮助信息
  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}
\`\`\`

**关键设计点：**

1. **所有命令的 action 都指向同一个 \`exec\` 函数** —— 这是动态加载架构的核心，exec 负责根据命令名动态加载对应的 npm 包
2. **\`--debug\` 全局选项** —— 开启后将日志级别设为 verbose，输出详细调试信息
3. **\`--targetPath\` 全局选项** —— 允许指定本地代码路径，用于开发调试时直接执行本地代码而非 npm 缓存包
4. **未知命令处理** —— 用户输入错误命令时给出友好提示

### 4.2 exec 模块 —— 命令动态加载的核心

这是整个脚手架最精妙的设计之一。exec 模块负责根据命令名动态加载对应的 npm 包并执行。

\`\`\`javascript
// core/exec/lib/index.js
'use strict';

const path = require('path');
const Package = require('@imooc-cli/package');
const log = require('@imooc-cli/log');

// 命令名到 npm 包名的映射
const SETTINGS = {
  init: '@imooc-cli/init',
  publish: '@imooc-cli/publish',
};

const CACHE_DIR = 'dependencies';

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = '';
  let pkg;

  log.verbose('targetPath', targetPath);
  log.verbose('homePath', homePath);

  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';

  if (!targetPath) {
    // 没有指定本地路径，使用缓存目录
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');
    log.verbose('targetPath', targetPath);
    log.verbose('storeDir', storeDir);

    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });

    if (await pkg.exists()) {
      // 缓存包已存在，检查更新
      await pkg.update();
    } else {
      // 缓存包不存在，执行安装
      await pkg.install();
    }
  } else {
    // 指定了本地路径，直接使用
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    });
  }

  // 获取入口文件路径并执行
  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    try {
      // 在子进程中执行命令，避免阻塞主进程
      const args = Array.from(arguments);
      const cmd = args[args.length - 1];
      const o = Object.create(null);
      Object.keys(cmd).forEach(key => {
        if (cmd.hasOwnProperty(key) &&
            !key.startsWith('_') &&
            key !== 'parent') {
          o[key] = cmd[key];
        }
      });
      args[args.length - 1] = o;

      const code = \\\`require('\\\${rootFile}').call(null, \\\${JSON.stringify(args)})\\\`;
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      child.on('error', e => {
        log.error(e.message);
        process.exit(1);
      });

      child.on('exit', e => {
        log.verbose('命令执行成功:' + e);
        process.exit(e);
      });
    } catch (e) {
      log.error(e.message);
    }
  }
}

module.exports = exec;
\`\`\`

**exec 的执行流程图：**

\`\`\`
用户输入 imooc-cli init
        │
        ▼
  commander 解析命令
        │
        ▼
  调用 exec() 函数
        │
        ▼
  是否指定了 --targetPath？
    ├── 是 → 直接使用本地路径创建 Package 实例
    └── 否 → 使用缓存目录 ~/.imooc-cli/dependencies/
                │
                ▼
          Package 实例是否已缓存？
            ├── 是 → pkg.update() 检查更新
            └── 否 → pkg.install() 下载安装
                │
                ▼
        pkg.getRootFilePath() 获取入口文件
                │
                ▼
        spawn 子进程执行命令逻辑
\`\`\`

### 4.3 Package 类 —— npm 包管理的核心抽象

\`\`\`javascript
// models/package/lib/index.js
'use strict';

const path = require('path');
const pkgDir = require('pkg-dir').sync;
const pathExists = require('path-exists').sync;
const fse = require('fs-extra');
const npminstall = require('npminstall');
const { isObject } = require('@imooc-cli/utils');
const formatPath = require('@imooc-cli/format-path');
const {
  getDefaultRegistry,
  getNpmLatestVersion,
} = require('@imooc-cli/get-npm-info');

class Package {
  constructor(options) {
    if (!options) throw new Error('Package类的options参数不能为空！');
    if (!isObject(options)) throw new Error('Package类的options参数必须为对象！');
    // npm 包的目标路径
    this.targetPath = options.targetPath;
    // npm 包的缓存路径
    this.storeDir = options.storeDir;
    // npm 包的 name
    this.packageName = options.packageName;
    // npm 包的 version
    this.packageVersion = options.packageVersion;
    // npm 包缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  async prepare() {
    // 如果缓存目录不存在，则创建
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }
    // 将 latest 转换为具体版本号
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
  }

  get cacheFilePath() {
    // npm 缓存包的实际路径
    // 例如：_@imooc-cli_init@1.0.0@@imooc-cli/init
    return path.resolve(
      this.storeDir,
      \\\`_\\\${this.cacheFilePathPrefix}@\\\${this.packageVersion}@\\\${this.packageName}\\\`
    );
  }

  getSpecificCacheFilePath(packageVersion) {
    return path.resolve(
      this.storeDir,
      \\\`_\\\${this.cacheFilePathPrefix}@\\\${packageVersion}@\\\${this.packageName}\\\`
    );
  }

  // 判断当前 Package 是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare();
      return pathExists(this.cacheFilePath);
    } else {
      return pathExists(this.targetPath);
    }
  }

  // 安装 Package
  async install() {
    await this.prepare();
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{
        name: this.packageName,
        version: this.packageVersion,
      }],
    });
  }

  // 更新 Package
  async update() {
    await this.prepare();
    // 获取最新版本号
    const latestVersion = await getNpmLatestVersion(this.packageName);
    // 查询最新版本号对应的缓存路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestVersion);
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        registry: getDefaultRegistry(),
        pkgs: [{
          name: this.packageName,
          version: latestVersion,
        }],
      });
      this.packageVersion = latestVersion;
    } else {
      this.packageVersion = latestVersion;
    }
  }

  // 获取入口文件路径
  getRootFilePath() {
    function _getRootFile(targetPath) {
      // 1. 获取 package.json 所在目录
      const dir = pkgDir(targetPath);
      if (dir) {
        // 2. 读取 package.json
        const pkgFile = require(path.resolve(dir, 'package.json'));
        // 3. 寻找 main/lib 入口
        if (pkgFile && pkgFile.main) {
          // 4. 路径兼容（macOS/Windows）
          return formatPath(path.resolve(dir, pkgFile.main));
        }
      }
      return null;
    }

    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath);
    } else {
      return _getRootFile(this.targetPath);
    }
  }
}

module.exports = Package;
\`\`\`

**Package 类的核心职责：**

1. **exists()** —— 判断 npm 包是否已缓存到本地
2. **install()** —— 使用 npminstall 库下载安装 npm 包到缓存目录
3. **update()** —— 检查是否有新版本，有则增量安装
4. **getRootFilePath()** —— 解析 package.json 的 main 字段，找到入口文件

**缓存路径的特殊格式：**

npm 缓存后的目录结构非常特殊，以 \`@imooc-cli/init@1.0.0\` 为例：
\`\`\`
~/.imooc-cli/dependencies/node_modules/
  _@imooc-cli_init@1.0.0@@imooc-cli/
    init/
      lib/
        index.js    ← 这就是入口文件
      package.json
\`\`\`

注意 \`@\` 符号被替换为 \`_\`，版本号嵌入路径中。这是 npminstall 库的缓存格式，与标准 npm 不同。

---

## 五、init 命令全流程深度分析

### 5.1 Command 基类 —— 命令的统一抽象

所有命令都继承自 Command 基类，它定义了命令执行的标准生命周期：

\`\`\`javascript
// models/command/lib/index.js
'use strict';

const semver = require('semver');
const colors = require('colors/safe');
const log = require('@imooc-cli/log');

const LOWEST_NODE_VERSION = '12.0.0';

class Command {
  constructor(argv) {
    if (!argv) throw new Error('参数不能为空！');
    if (!Array.isArray(argv)) throw new Error('参数必须为数组！');
    if (argv.length < 1) throw new Error('参数列表为空！');
    this._argv = argv;
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch(err => {
        log.error(err.message);
      });
    });
  }

  checkNodeVersion() {
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(colors.red(
        \\\`imooc-cli 需要安装 v\\\${lowestVersion} 以上版本的 Node.js\\\`
      ));
    }
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
  }

  init() {
    throw new Error('init 必须实现！');
  }

  exec() {
    throw new Error('exec 必须实现！');
  }
}

module.exports = Command;
\`\`\`

**生命周期链：**
\`\`\`
checkNodeVersion() → initArgs() → init() → exec()
\`\`\`

子类必须实现 \`init()\` 和 \`exec()\` 方法，否则抛出异常。这是经典的**模板方法设计模式**。

### 5.2 InitCommand —— init 命令的完整实现

\`\`\`javascript
// commands/init/lib/index.js
'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const semver = require('semver');
const userHome = require('user-home');
const glob = require('glob');
const ejs = require('ejs');
const Command = require('@imooc-cli/command');
const Package = require('@imooc-cli/package');
const log = require('@imooc-cli/log');
const { spinnerStart, sleep, execAsync } = require('@imooc-cli/utils');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    this.force = this._cmd.force;
    log.verbose('projectName', this.projectName);
    log.verbose('force', this.force);
  }

  async exec() {
    try {
      // 1. 准备阶段
      const projectInfo = await this.prepare();
      if (projectInfo) {
        log.verbose('projectInfo', JSON.stringify(projectInfo));
        this.projectInfo = projectInfo;
        // 2. 下载模板
        await this.downloadTemplate();
        // 3. 安装模板
        await this.installTemplate();
      }
    } catch (e) {
      log.error(e.message);
      if (process.env.LOG_LEVEL === 'verbose') {
        console.log(e);
      }
    }
  }
}

function init(argv) {
  return new InitCommand(argv);
}

module.exports = init;
module.exports.InitCommand = InitCommand;
\`\`\`

### 5.3 prepare() —— 交互式获取项目信息

\`\`\`javascript
async prepare() {
  // 1. 判断项目模板是否存在（从远程 API 获取模板列表）
  const template = await getProjectTemplate();
  if (!template || template.length === 0) {
    throw new Error('项目模板不存在');
  }
  this.template = template;

  const localPath = process.cwd();

  // 2. 判断当前目录是否为空
  if (!this.isDirEmpty(localPath)) {
    let ifContinue = false;
    // 如果没有 --force 参数，询问用户是否继续
    if (!this.force) {
      ifContinue = (await inquirer.prompt({
        type: 'confirm',
        name: 'ifContinue',
        default: false,
        message: '当前文件夹不为空，是否继续创建项目？',
      })).ifContinue;
      if (!ifContinue) return;
    }
    // 3. 是否强制清空当前目录
    if (ifContinue || this.force) {
      const { confirmDelete } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmDelete',
        default: false,
        message: '是否确认清空当前目录下的文件？',
      });
      if (confirmDelete) {
        fse.emptyDirSync(localPath);
      }
    }
  }

  return this.getProjectInfo();
}
\`\`\`

### 5.4 getProjectInfo() —— 命令行交互收集信息

\`\`\`javascript
async getProjectInfo() {
  let projectInfo = {};
  // 1. 选择创建项目或组件
  const { type } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: '请选择初始化类型',
    default: TYPE_PROJECT,
    choices: [
      { name: '项目', value: TYPE_PROJECT },
      { name: '组件', value: TYPE_COMPONENT },
    ],
  });

  // 过滤出对应类型的模板
  this.template = this.template.filter(t =>
    t.tag.includes(type)
  );

  const title = type === TYPE_PROJECT ? '项目' : '组件';

  // 2. 获取项目基本信息
  const projectPrompt = [
    {
      type: 'input',
      name: 'projectName',
      message: \\\`请输入\\\${title}名称\\\`,
      default: '',
      validate: function(v) {
        // 合法性校验：首字符必须为英文，只允许 "-_" 连接
        const done = this.async();
        setTimeout(function() {
          if (!/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)) {
            done(\\\`请输入合法的\\\${title}名称\\\`);
            return;
          }
          done(null, true);
        }, 0);
      },
      filter: function(v) { return v; },
    },
    {
      type: 'input',
      name: 'projectVersion',
      message: \\\`请输入\\\${title}版本号\\\`,
      default: '1.0.0',
      validate: function(v) {
        const done = this.async();
        setTimeout(function() {
          if (!(!!semver.valid(v))) {
            done('请输入合法的版本号');
            return;
          }
          done(null, true);
        }, 0);
      },
      filter: function(v) {
        return !!semver.valid(v) ? semver.valid(v) : v;
      },
    },
    {
      type: 'list',
      name: 'projectTemplate',
      message: \\\`请选择\\\${title}模板\\\`,
      choices: this.createTemplateChoice(),
    },
  ];

  const project = await inquirer.prompt(projectPrompt);
  projectInfo = { type, ...project };

  // 生成 className（驼峰转短横线）
  if (projectInfo.projectName) {
    projectInfo.className = require('kebab-case')(projectInfo.projectName).replace(/^-/, '');
  }
  if (projectInfo.projectVersion) {
    projectInfo.version = projectInfo.projectVersion;
  }

  return projectInfo;
}
\`\`\`

### 5.5 downloadTemplate() —— 模板下载

\`\`\`javascript
async downloadTemplate() {
  const { projectTemplate } = this.projectInfo;
  const templateInfo = this.template.find(
    item => item.npmName === projectTemplate
  );
  const targetPath = path.resolve(userHome, '.imooc-cli', 'template');
  const storeDir = path.resolve(
    userHome, '.imooc-cli', 'template', 'node_modules'
  );
  const { npmName, version } = templateInfo;
  this.templateInfo = templateInfo;

  const templateNpm = new Package({
    targetPath,
    storeDir,
    packageName: npmName,
    packageVersion: version,
  });

  if (!await templateNpm.exists()) {
    const spinner = spinnerStart('正在下载模板...');
    await sleep(1000);
    try {
      await templateNpm.install();
    } catch (e) {
      throw e;
    } finally {
      spinner.stop(true);
      if (await templateNpm.exists()) {
        log.success('下载模板成功');
        this.templateNpm = templateNpm;
      }
    }
  } else {
    const spinner = spinnerStart('正在更新模板...');
    await sleep(1000);
    try {
      await templateNpm.update();
    } catch (e) {
      throw e;
    } finally {
      spinner.stop(true);
      if (await templateNpm.exists()) {
        log.success('更新模板成功');
        this.templateNpm = templateNpm;
      }
    }
  }
}
\`\`\`

**模板下载的核心思路：** 模板本身也是 npm 包！通过 Package 类下载到 \`~/.imooc-cli/template/\` 目录。这样模板的版本管理、更新检查都可以复用 npm 的基础设施。

### 5.6 installTemplate() —— 模板安装与 EJS 渲染

\`\`\`javascript
async installTemplate() {
  if (this.templateInfo) {
    if (!this.templateInfo.type) {
      this.templateInfo.type = 'normal';
    }
    if (this.templateInfo.type === 'normal') {
      // 标准安装
      await this.installNormalTemplate();
    } else if (this.templateInfo.type === 'custom') {
      // 自定义安装
      await this.installCustomTemplate();
    } else {
      throw new Error('无法识别项目模板类型！');
    }
  }
}

async installNormalTemplate() {
  // 1. 将模板文件拷贝到当前目录
  const spinner = spinnerStart('正在安装模板...');
  const templatePath = path.resolve(
    this.templateNpm.cacheFilePath, 'template'
  );
  const targetPath = process.cwd();
  fse.ensureDirSync(templatePath);
  fse.ensureDirSync(targetPath);
  fse.copySync(templatePath, targetPath);
  spinner.stop(true);
  log.success('模板安装成功');

  // 2. EJS 模板渲染
  const templateIgnore = this.templateInfo.ignore || [];
  const ignore = ['**/node_modules/**', ...templateIgnore];
  await this.ejsRender({ ignore });

  // 3. 自动安装依赖
  const { installCommand, startCommand } = this.templateInfo;
  // 执行 npm install
  if (installCommand) {
    const installCmd = installCommand.split(' ');
    const cmd = installCmd[0];
    const args = installCmd.slice(1);
    const ret = await execAsync(cmd, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    if (ret !== 0) {
      throw new Error('依赖安装过程中失败！');
    }
  }
  // 执行 npm run dev
  if (startCommand) {
    const startCmd = startCommand.split(' ');
    const cmd = startCmd[0];
    const args = startCmd.slice(1);
    await execAsync(cmd, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  }
}
\`\`\`

### 5.7 ejsRender() —— EJS 模板引擎渲染

\`\`\`javascript
async ejsRender(options) {
  const dir = process.cwd();
  const projectInfo = this.projectInfo;
  return new Promise((resolve, reject) => {
    // 使用 glob 匹配所有文件
    glob('**', {
      cwd: dir,
      ignore: options.ignore || '',
      nodir: true,
    }, (err, files) => {
      if (err) { reject(err); }
      Promise.all(files.map(file => {
        const filePath = path.join(dir, file);
        return new Promise((resolve1, reject1) => {
          // 对每个文件执行 EJS 渲染
          ejs.renderFile(filePath, projectInfo, {}, (err, result) => {
            if (err) {
              reject1(err);
            } else {
              // 将渲染结果写回文件
              fse.writeFileSync(filePath, result);
              resolve1(result);
            }
          });
        });
      })).then(() => resolve())
        .catch(err => reject(err));
    });
  });
}
\`\`\`

**EJS 渲染的作用：** 模板文件中可以使用 EJS 语法（如 \`<%= projectName %>\`），渲染时会被替换为用户输入的实际值。例如模板的 package.json：

\`\`\`json
{
  "name": "<%= className %>",
  "version": "<%= version %>"
}
\`\`\`

渲染后变为：
\`\`\`json
{
  "name": "my-project",
  "version": "1.0.0"
}
\`\`\`

### 5.8 init 命令完整流程图

\`\`\`
imooc-cli init my-project
        │
        ▼
  exec() 动态加载 @imooc-cli/init
        │
        ▼
  Command 基类生命周期
  checkNodeVersion() → initArgs() → init() → exec()
        │
        ▼
  prepare() 准备阶段
  ├── 从 API 获取模板列表
  ├── 检查当前目录是否为空
  ├── 询问是否清空目录
  └── getProjectInfo() 交互式收集信息
      ├── 选择项目/组件类型
      ├── 输入项目名称（合法性校验）
      ├── 输入版本号（semver 校验）
      └── 选择项目模板
        │
        ▼
  downloadTemplate() 下载模板
  ├── 创建 Package 实例
  ├── 检查缓存是否存在
  ├── 不存在 → pkg.install() 下载
  └── 已存在 → pkg.update() 更新
        │
        ▼
  installTemplate() 安装模板
  ├── 拷贝模板文件到当前目录
  ├── ejsRender() EJS 渲染
  │   ├── glob 匹配所有文件
  │   ├── 排除 node_modules 等
  │   └── 逐文件渲染替换变量
  ├── 执行 npm install
  └── 执行 npm run dev
        │
        ▼
  项目创建完成，浏览器自动打开
\`\`\`

---

## 六、publish 命令全流程深度分析

### 6.1 PublishCommand 概览

publish 命令是整个脚手架中最复杂的部分，涉及 Git 自动化、云构建、云发布三大模块。

\`\`\`javascript
// commands/publish/lib/index.js
class PublishCommand extends Command {
  init() {
    // 解析命令行参数
    this.options = {
      refreshServer: this._cmd.refreshServer,
      refreshToken: this._cmd.refreshToken,
      refreshOwner: this._cmd.refreshOwner,
      buildCmd: this._cmd.buildCmd,
      prod: this._cmd.prod,
      sshUser: this._cmd.sshUser,
      sshIp: this._cmd.sshIp,
      sshPath: this._cmd.sshPath,
    };
  }

  async exec() {
    try {
      const startTime = new Date().getTime();
      // 1. 初始化检查
      this.prepare();
      // 2. Git Flow 自动化
      const git = new Git(this.projectInfo, this.options);
      await git.prepare();   // Git 初始化准备
      await git.commit();    // 代码自动提交
      await git.publish();   // 云构建 + 云发布
      const endTime = new Date().getTime();
      log.info('本次发布耗时：',
        Math.floor((endTime - startTime) / 1000) + '秒');
    } catch (e) {
      log.error(e.message);
      if (process.env.LOG_LEVEL === 'verbose') {
        console.log(e);
      }
    }
  }

  prepare() {
    // 1. 确认项目是否为 npm 项目
    const projectPath = process.cwd();
    const pkgPath = path.resolve(projectPath, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      throw new Error('package.json 不存在！');
    }
    // 2. 确认是否包含 name、version、build 命令
    const pkg = fse.readJsonSync(pkgPath);
    const { name, version, scripts } = pkg;
    if (!name || !version || !scripts || !scripts.build) {
      throw new Error('package.json 信息不全！');
    }
    this.projectInfo = { name, version, dir: projectPath };
  }
}
\`\`\`

### 6.2 Git 类 —— Git 自动化的核心

\`\`\`javascript
// models/git/lib/index.js
const SimpleGit = require('simple-git');
const CloudBuild = require('@imooc-cli/cloudbuild');

class Git {
  constructor(projectInfo, options) {
    this.name = projectInfo.name;
    this.version = projectInfo.version;
    this.dir = projectInfo.dir;
    this.git = SimpleGit(this.dir);
    this.gitServer = null;
    this.homePath = null;
    this.token = null;
    this.user = null;
    this.orgs = null;
    this.owner = null;      // 远程仓库类型：个人/组织
    this.login = null;      // 远程仓库登录名
    this.repo = null;       // 远程仓库信息
    this.refreshServer = options.refreshServer;
    this.refreshToken = options.refreshToken;
    this.refreshOwner = options.refreshOwner;
    this.branch = null;     // 本地开发分支
    this.buildCmd = options.buildCmd;
    this.prod = options.prod;
    this.sshUser = options.sshUser;
    this.sshIp = options.sshIp;
    this.sshPath = options.sshPath;
  }
}
\`\`\`

### 6.3 git.prepare() —— Git 初始化准备

\`\`\`javascript
async prepare() {
  this.checkHomePath();           // 检查缓存主目录
  await this.checkGitServer();    // 检查 Git 远程仓库类型
  await this.checkGitToken();     // 获取远程仓库 Token
  await this.getUserAndOrgs();    // 获取用户和组织信息
  await this.checkGitOwner();     // 确认远程仓库类型
  await this.checkRepo();         // 检查并创建远程仓库
  this.checkGitIgnore();          // 检查 .gitignore
  await this.init();              // 初始化本地仓库
}
\`\`\`

**① checkGitServer() —— 选择 Git 平台**

\`\`\`javascript
async checkGitServer() {
  const gitServerPath = this.createPath('.git_server');
  let gitServer = readFile(gitServerPath);
  if (!gitServer || this.refreshServer) {
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择您想要托管的Git平台',
      default: 'github',
      choices: [
        { name: 'GitHub', value: 'github' },
        { name: 'Gitee', value: 'gitee' },
      ],
    });
    gitServer = type;
    writeFile(gitServerPath, gitServer);
    log.success('git server 写入成功', gitServer);
  }
  this.gitServer = createGitServer(gitServer);
}
\`\`\`

**② checkGitToken() —— 获取 Token**

\`\`\`javascript
async checkGitToken() {
  const tokenPath = this.createPath('.git_token');
  let token = readFile(tokenPath);
  if (!token || this.refreshToken) {
    log.warn(this.gitServer.type + ' token 未生成',
      '请先生成 ' + this.gitServer.type + ' token，' +
      this.gitServer.getTokenHelpUrl());
    const { token: inputToken } = await inquirer.prompt({
      type: 'password',
      name: 'token',
      message: '请将token复制到这里',
      default: '',
    });
    token = inputToken;
    writeFile(tokenPath, token);
    log.success('token 写入成功', tokenPath);
  }
  this.token = token;
  this.gitServer.setToken(token);
}
\`\`\`

**③ checkRepo() —— 自动创建远程仓库**

\`\`\`javascript
async checkRepo() {
  let repo = await this.gitServer.getRepo(this.login, this.name);
  if (!repo) {
    let spinner = spinnerStart('开始创建远程仓库...');
    try {
      if (this.owner === 'user') {
        repo = await this.gitServer.createRepo(this.name);
      } else {
        repo = await this.gitServer.createOrgRepo(this.name, this.login);
      }
    } finally {
      spinner.stop(true);
    }
    if (repo) {
      log.success('远程仓库创建成功');
    } else {
      throw new Error('远程仓库创建失败');
    }
  }
  this.repo = repo;
}
\`\`\`

这里通过 GitHub/Gitee API 自动创建远程仓库，开发者无需手动到网页上操作。

### 6.4 git.commit() —— 代码自动提交

\`\`\`javascript
async commit() {
  // 1. 生成开发分支
  await this.getCorrectVersion();
  // 2. 检查 stash 区
  await this.checkStash();
  // 3. 检查代码冲突
  await this.checkConflicted();
  // 4. 检查未提交代码
  await this.checkNotCommitted();
  // 5. 切换开发分支
  await this.checkoutBranch(this.branch);
  // 6. 合并远程 master 分支到开发分支
  await this.pullRemoteMasterAndBranch();
  // 7. 推送开发分支到远程仓库
  await this.pushRemoteRepo(this.branch);
}
\`\`\`

**getCorrectVersion() —— 自动生成版本分支**

\`\`\`javascript
async getCorrectVersion() {
  // 1. 获取远程发布分支（release/x.y.z）
  const remoteBranchList = await this.getRemoteBranchList('release');
  let releaseVersion = null;
  if (remoteBranchList && remoteBranchList.length > 0) {
    releaseVersion = remoteBranchList[0];
  }
  // 2. 生成本地开发分支
  const devVersion = this.version;
  if (!releaseVersion) {
    // 远程没有发布分支，直接使用当前版本
    this.branch = \\\`dev/\\\${devVersion}\\\`;
  } else if (semver.gt(this.version, releaseVersion)) {
    // 当前版本大于远程发布版本
    this.branch = \\\`dev/\\\${devVersion}\\\`;
  } else {
    // 当前版本小于等于远程发布版本，需要升版
    log.info('当前版本小于线上最新版本',
      \\\`\\\${devVersion} < \\\${releaseVersion}\\\`);
    const incType = (await inquirer.prompt({
      type: 'list',
      name: 'incType',
      message: '自动升级版本, 请选择升级版本类型',
      default: 'patch',
      choices: [
        { name: \\\`小版本 (\\\${releaseVersion} -> \\\${semver.inc(releaseVersion, 'patch')})\\\`, value: 'patch' },
        { name: \\\`中版本 (\\\${releaseVersion} -> \\\${semver.inc(releaseVersion, 'minor')})\\\`, value: 'minor' },
        { name: \\\`大版本 (\\\${releaseVersion} -> \\\${semver.inc(releaseVersion, 'major')})\\\`, value: 'major' },
      ],
    })).incType;
    const incVersion = semver.inc(releaseVersion, incType);
    this.branch = \\\`dev/\\\${incVersion}\\\`;
    this.version = incVersion;
  }
  log.verbose('本地开发分支', this.branch);
  // 同步版本号到 package.json
  this.syncVersionToPackageJson();
}
\`\`\`

### 6.5 git.publish() —— 云构建与云发布

\`\`\`javascript
async publish() {
  let ret = false;
  if (this.isComponent()) {
    // 组件发布到 npm
    log.info('开始发布组件到npm');
    await this.saveComponentToDB();
    // ... 组件发布逻辑
  } else {
    // 项目发布：云构建
    await this.prePublish();
    const cloudBuild = new CloudBuild(this, {
      buildCmd: this.buildCmd,
      type: this.gitPublish,
      prod: this.prod,
    });
    await cloudBuild.prepare();
    await cloudBuild.init();
    ret = await cloudBuild.build();
    if (ret) {
      await this.uploadTemplate();
    }
  }
  if (this.prod && ret) {
    // 正式发布：打 tag，合并到 master，删除开发分支
    await this.checkTag();
    await this.checkoutBranch('master');
    await this.mergeBranchToMaster();
    await this.pushRemoteRepo('master');
    await this.deleteLocalBranch();
    await this.deleteRemoteBranch();
  }
}
\`\`\`

### 6.6 CloudBuild —— WebSocket 实时云构建

\`\`\`javascript
// models/cloudbuild/lib/index.js
const io = require('socket.io-client');

class CloudBuild {
  constructor(git, options) {
    this.git = git;
    this.buildCmd = options.buildCmd;
    this.type = options.type;
    this.prod = options.prod;
    this.timeout = 5 * 60 * 1000; // 5分钟超时
  }

  async init() {
    // 连接云构建服务器
    this.socket = io('http://build-server:7001', {
      query: {
        repo: this.git.remote,
        name: this.git.name,
        branch: this.git.branch,
        version: this.git.version,
        buildCmd: this.buildCmd,
        prod: this.prod,
      },
    });
  }

  build() {
    return new Promise((resolve, reject) => {
      this.socket.on('build', msg => {
        // 实时输出构建日志
        console.log(msg);
      });
      this.socket.on('building', msg => {
        console.log(msg);
      });
      this.socket.on('disconnect', () => {
        resolve(false);
      });
      this.socket.on('build result', ret => {
        resolve(ret);
      });

      // 发送构建指令
      this.socket.emit('build');

      // 超时处理
      this.timer = setTimeout(() => {
        this.socket.disconnect();
        reject(new Error('云构建超时'));
      }, this.timeout);
    });
  }
}
\`\`\`

**云构建的工作流程：**

\`\`\`
CLI 客户端                    云构建服务器
    │                              │
    │── WebSocket 连接 ──────────→│
    │   (携带 repo/branch/cmd)     │
    │                              │
    │── emit('build') ───────────→│
    │                              ├── git clone
    │                              ├── npm install
    │←── on('building', log) ─────├── npm run build
    │←── on('building', log) ─────│
    │←── on('building', log) ─────│
    │                              ├── 上传构建产物到 OSS
    │←── on('build result') ──────│
    │                              │
    │── disconnect ───────────────│
\`\`\`

### 6.7 publish 命令完整流程图

\`\`\`
imooc-cli publish --prod
        │
        ▼
  prepare() 检查 package.json
        │
        ▼
  git.prepare() Git 初始化
  ├── 选择 Git 平台（GitHub/Gitee）
  ├── 获取/缓存 Token
  ├── 获取用户和组织信息
  ├── 自动创建远程仓库（如不存在）
  ├── 检查/生成 .gitignore
  └── git init + git remote add
        │
        ▼
  git.commit() 代码提交
  ├── 自动生成版本分支 dev/1.0.1
  ├── 检查 stash 区
  ├── 检查代码冲突
  ├── git add + git commit
  ├── 切换到开发分支
  ├── 合并远程 master
  └── git push 推送开发分支
        │
        ▼
  git.publish() 云构建 + 发布
  ├── WebSocket 连接云构建服务器
  ├── 服务端执行 git clone → npm install → npm run build
  ├── 实时推送构建日志到 CLI 终端
  ├── 构建产物上传阿里云 OSS
  ├── 下载 index.html 部署到服务器
  │
  └── 如果是 --prod 正式发布：
      ├── 打 tag（release/1.0.1）
      ├── 合并开发分支到 master
      ├── 推送 master
      └── 删除本地和远程开发分支
\`\`\`

---

## 七、关键设计模式与架构亮点总结

### 7.1 插件化架构（动态加载）

CLI 本体只是一个调度壳，所有命令逻辑都是独立的 npm 包。用户执行命令时自动检查本地缓存，有更新就增量拉取最新版本。**好处：命令逻辑有 bug 时，发布新版本后用户下次执行自动生效，完全不需要通知用户重新安装。**

### 7.2 模板方法模式（Command 基类）

所有命令继承 Command 基类，基类定义了 \`checkNodeVersion → initArgs → init → exec\` 的标准生命周期，子类只需实现 \`init()\` 和 \`exec()\`。

### 7.3 策略模式（Git 平台适配）

通过 \`createGitServer(type)\` 工厂函数创建不同平台的 Git 操作实例（GitHub/Gitee），它们实现相同的接口（\`getRepo\`、\`createRepo\`、\`getTokenHelpUrl\` 等），上层代码无需关心具体平台差异。

### 7.4 子进程执行（性能优化）

命令逻辑在子进程中执行（\`spawn('node', ['-e', code])\`），避免阻塞主进程。同时通过 \`stdio: 'inherit'\` 让子进程共享主进程的标准输入输出，用户体验无感知。

### 7.5 缓存机制

- **npm 包缓存**：命令包和模板包都缓存在 \`~/.imooc-cli/\` 目录，避免重复下载
- **Git Token 缓存**：Token 缓存在本地文件，避免每次都要输入
- **Git 平台选择缓存**：用户选择的 Git 平台缓存在本地，下次直接使用

---

## 八、核心依赖库速查表

| 库名 | 用途 |
|------|------|
| commander | 命令行参数解析和命令注册 |
| inquirer | 命令行交互式问答 |
| semver | 语义化版本号比较和操作 |
| npminstall | npm 包安装（比 npm install 更快） |
| simple-git | Git 操作的 Node.js 封装 |
| ejs | 模板引擎，用于渲染项目模板 |
| glob | 文件路径模式匹配 |
| fs-extra | fs 模块的增强版 |
| socket.io-client | WebSocket 客户端，用于云构建通信 |
| import-local | 优先使用本地安装的包 |
| root-check | root 用户降级 |
| dotenv | 环境变量加载 |
| colors | 终端彩色输出 |
| ora | 终端 loading 动画 |
| lerna | Monorepo 管理工具 |

---

## 九、总结

imooc-cli 是一个架构设计非常精良的企业级脚手架项目。它的核心价值在于：

1. **Lerna Monorepo** 管理多包，统一版本发布
2. **bin + Shebang** 机制让 npm 包成为系统命令
3. **import-local** 优先使用本地版本，兼容多版本共存
4. **动态加载架构** 让命令逻辑热更新，无需用户重装
5. **Package 类** 统一封装 npm 包的安装、更新、缓存、入口解析
6. **Command 基类** 用模板方法模式规范命令生命周期
7. **init 命令** 实现了从交互式问答到模板下载、EJS 渲染、自动安装的完整闭环
8. **publish 命令** 实现了 Git 自动化 + WebSocket 云构建 + OSS 云发布的完整 DevOps 流程

理解这个项目，不仅能掌握脚手架开发的核心技术，更能学到企业级工程化的架构思维。`,
    tags: ['脚手架', 'Lerna', 'Monorepo', 'CLI', 'commander', 'npm', 'init', 'publish', '云构建', 'WebSocket', '源码分析']
  },
]
