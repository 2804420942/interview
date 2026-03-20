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
]
