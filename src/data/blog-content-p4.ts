// 技术博客 - 内容第4部分（脚手架架构+Lerna Monorepo+init命令+publish命令）
export default `
---

## 第三章：imooc-cli 脚手架源码深度剖析

---

### 面试官：聊聊你的脚手架项目吧。为什么要自己做脚手架？市面上不是有很多现成的吗？

这个问题我经常被问到。确实，市面上有 Yeoman、create-react-app、Vue CLI 等成熟的脚手架工具。但我们自研脚手架的核心原因是：**现有工具无法满足团队特定的工作流需求**。

具体来说，我们团队的研发流程有几个特殊需求：

1. **云构建**：我们不在本地构建，而是通过 WebSocket 连接云构建服务器，服务端执行构建，实时推送日志到 CLI 终端。这个功能没有任何现成工具支持。

2. **Git Flow 全自动化**：从初始化仓库、创建远程 repo、分支管理、冲突检测到代码推送，整个 Git 流程一键自动化。Yeoman 等工具只管项目初始化，不管后续的发布流程。

3. **企微消息推送审批**：发布前需要通过企业微信通知相关人员审批，这是内部流程的一部分。

4. **深度集成内部系统**：需要对接 GitHub/Gitee API、阿里云 OSS、企微 Webhook 等，这些都是高度定制化的需求。

所以，自研脚手架的核心价值是：**把团队开发中重复的、容易出错的流程全部自动化**，形成一套完整的研发工作流。

脚手架有两大核心命令：

\`\`\`bash
imooc-cli init        # 项目初始化
imooc-cli publish     # 项目发布
\`\`\`

---

### 面试官：为什么选择 Lerna Monorepo 架构？和普通的单仓库有什么区别？

脚手架项目由十多个子包组成，它们之间有复杂的依赖关系。选择 Lerna Monorepo 是经过深思熟虑的。

**项目结构：**

\`\`\`
imooc-cli/
├── packages/
│   ├── core/
│   │   ├── cli/           # CLI 入口包（bin 命令注册）
│   │   └── exec/          # 命令动态加载执行器
│   ├── commands/
│   │   ├── init/          # init 命令实现
│   │   └── publish/       # publish 命令实现
│   ├── models/
│   │   ├── package/       # npm 包管理类
│   │   ├── command/       # 命令基类
│   │   └── git/           # Git 操作封装
│   └── utils/
│       ├── log/           # 日志工具
│       ├── get-npm-info/  # npm 信息查询
│       ├── format-path/   # 路径格式化
│       └── utils/         # 通用工具函数
├── lerna.json
└── package.json
\`\`\`

**Monorepo 的好处：**

**第一，统一管理。** 多个包在一个仓库中，版本统一发布。以前如果 utils 包改了一个函数，需要先发布 utils 到 npm，然后逐一更新 init、publish、core 等包的依赖版本号，非常繁琐。Monorepo 下一次 commit 就能同时修改所有相关的包。

**第二，共享依赖。** 公共依赖（如 fs-extra、axios）提升到根目录的 node_modules，子包共享，减少重复安装。磁盘占用从原来的 500MB+ 降到 200MB 左右。

**第三，互相引用方便。** 开发时，\`@imooc-cli/utils\` 被多个包引用，Lerna 通过 \`npm link\` 自动建立软链接，修改 utils 后其他包立即生效，不需要先发布到 npm。

**第四，原子提交。** 一次 commit 可以同时修改多个包，保证关联修改的一致性。比如修改了 Command 基类的接口，同时更新所有继承它的命令包，一个 commit 搞定。

**Lerna 相比普通 Monorepo 的额外能力：**

普通 Monorepo（只用 npm/yarn/pnpm workspace）只解决了依赖安装和链接问题。Lerna 在此基础上提供了：

1. **版本管理**：\`lerna version\` 自动检测变更的包，更新版本号
2. **批量发布**：\`lerna publish\` 一键发布所有变更的包到 npm
3. **拓扑排序构建**：\`lerna run build\` 按依赖关系顺序构建（utils → models → commands → core）
4. **变更检测**：\`lerna changed\` 基于 git diff 只检测有变更的包，避免全量构建

---

### 面试官：为什么不用 pnpm workspace 替代 Lerna？现在 pnpm 不是更流行吗？

这是一个很好的问题。当时选择 Lerna 的原因和现在的思考：

| 对比维度 | Lerna | pnpm workspace |
|---|---|---|
| 版本管理 | 内置 version 和 publish 命令 | 需要配合 changesets 等工具 |
| 依赖安装 | 使用 npm/yarn，存在 phantom dependency | 严格的依赖隔离，不存在幽灵依赖 |
| 磁盘占用 | 普通 node_modules | 硬链接 + 软链接，磁盘占用更小 |
| 构建编排 | 内置拓扑排序 | 需要配合 turborepo 等工具 |
| 学习成本 | 文档成熟，社区案例多 | 需要理解其独特的 node_modules 结构 |

**当时选 Lerna 的原因：**
- Lerna 内置了版本管理和发布流程，开箱即用
- 社区案例多，遇到问题容易找到解决方案
- 团队成员对 Lerna 更熟悉

**如果现在重新选型：**
会考虑 **pnpm workspace + changesets + turborepo** 的组合：
- **pnpm**：更快的安装速度、严格的依赖隔离、更小的磁盘占用
- **changesets**：灵活的版本管理和 changelog 自动生成
- **turborepo**：增量构建、远程缓存、任务编排

但核心思路不变：Monorepo 管理多包，统一版本发布，拓扑排序构建。

---

### 面试官：脚手架最大的技术亮点是什么？

我觉得最大的亮点是 **动态加载 npm 包的插件化架构**。

**传统 CLI 的痛点：** 所有命令逻辑打包在 CLI 本体中，一旦有 bug 必须让用户重新 \`npm install -g\`，用户体验极差。

**我的方案：** CLI 本体只是一个壳（调度器），具体命令逻辑（init/publish）是独立的 npm 包，每次执行时动态从 npm 下载最新版本到本地缓存。

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
require(rootFile)(args) → 在子进程中执行命令逻辑
\`\`\`

**核心实现 - Package 类：**

\`\`\`javascript
class Package {
  constructor({ targetPath, storeDir, packageName, packageVersion }) {
    this.targetPath = targetPath;
    this.storeDir = storeDir;
    this.packageName = packageName;
    this.packageVersion = packageVersion;
  }
  
  // 检查包是否已缓存
  async exists() {
    const pkgDir = this.getSpecificCacheDir();
    return pathExists(pkgDir);
  }
  
  // 安装包到缓存目录
  async install() {
    await npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      registry: getDefaultRegistry(),
      pkgs: [{ name: this.packageName, version: this.packageVersion }]
    });
  }
  
  // 检查更新
  async update() {
    const latestVersion = await getNpmLatestVersion(this.packageName);
    if (latestVersion !== this.packageVersion) {
      this.packageVersion = latestVersion;
      await this.install();
    }
  }
  
  // 获取入口文件
  getRootFilePath() {
    const dir = this.getSpecificCacheDir();
    const pkgJson = require(path.resolve(dir, 'package.json'));
    return formatPath(path.resolve(dir, pkgJson.main));
  }
}
\`\`\`

**这个设计的好处：**
- 用户**不需要重新安装 CLI**
- 命令逻辑可以**随时更新**，用户下次执行自动用最新版
- 类似**微内核 + 插件化**架构，核心只负责调度，业务逻辑全部外置
- 本地缓存 + 版本对比，非首次执行速度极快（毫秒级）

---

### 面试官：init 命令的完整流程是怎样的？模板系统是怎么设计的？

init 命令是脚手架的核心功能之一，负责项目初始化。完整流程如下：

**第一步：环境检查**
- Node 版本检查（要求 >= 12.0.0）
- 用户主目录检查
- root 账户自动降级（避免权限问题）

**第二步：交互式获取项目信息**

\`\`\`javascript
// 使用 inquirer 进行命令行交互
const projectInfo = await inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: '请选择初始化类型',
    choices: [
      { name: '项目', value: 'project' },
      { name: '组件', value: 'component' },
    ],
  },
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称',
    validate: (v) => {
      // 合法性校验：首字符必须为英文
      return /^[a-zA-Z]+([-_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    },
  },
  {
    type: 'input',
    name: 'projectVersion',
    message: '请输入项目版本号',
    default: '1.0.0',
    validate: (v) => !!semver.valid(v),
  },
  {
    type: 'list',
    name: 'projectTemplate',
    message: '请选择项目模板',
    choices: templateChoices, // 从远程 API 获取的模板列表
  },
]);
\`\`\`

**第三步：下载模板**

模板本身也是 npm 包！通过 Package 类下载到 \`~/.imooc-cli/template/\` 目录：

\`\`\`javascript
const templateNpm = new Package({
  targetPath: path.resolve(userHome, '.imooc-cli', 'template'),
  storeDir: path.resolve(userHome, '.imooc-cli', 'template', 'node_modules'),
  packageName: templateInfo.npmName,
  packageVersion: templateInfo.version,
});

if (!await templateNpm.exists()) {
  await templateNpm.install();  // 首次下载
} else {
  await templateNpm.update();   // 检查更新
}
\`\`\`

**第四步：EJS 模板渲染**

将用户输入的信息注入模板文件：

\`\`\`javascript
// 模板文件中的 EJS 语法
// package.json: { "name": "<%= projectName %>", "version": "<%= version %>" }

async function ejsRender(templateDir, projectInfo) {
  const files = glob.sync('**/*', {
    cwd: templateDir,
    nodir: true,
    ignore: ['node_modules/**', '**/*.{png,jpg,gif,svg,ico,woff,woff2,ttf,eot}']
  });
  
  await Promise.all(files.map(async (file) => {
    const filePath = path.join(templateDir, file);
    
    // 跳过二进制文件（图片、字体等）
    if (isBinaryFile(filePath)) return;
    
    // EJS 渲染
    const result = await ejs.renderFile(filePath, projectInfo);
    fs.writeFileSync(filePath, result);
  }));
}
\`\`\`

**第五步：自动安装依赖并启动**

\`\`\`javascript
// 自动执行 npm install
await execAsync('npm', ['install'], { stdio: 'inherit', cwd: projectDir });

// 自动执行 npm run dev
await execAsync('npm', ['run', 'dev'], { stdio: 'inherit', cwd: projectDir });
\`\`\`

**模板系统的设计亮点：**

1. **模板即 npm 包**：模板独立维护和版本管理，更新模板不需要更新脚手架
2. **动态模板列表**：模板列表从远程 API 获取，可以随时添加新模板
3. **二进制文件检测**：EJS 渲染时自动跳过图片、字体等二进制文件，避免损坏
4. **并发渲染**：\`Promise.all\` 并行渲染所有文本文件，速度更快

---

### 面试官：publish 命令的流程呢？云构建是怎么实现的？

publish 命令是整个脚手架中最复杂的部分，涉及 Git 自动化、云构建、云发布三大模块。

**Git 自动化流程：**

\`\`\`
imooc-cli publish
    ↓
检查 package.json（name/version/build 命令）
    ↓
Git 初始化准备
├── 选择 Git 平台（GitHub/Gitee）
├── 获取/缓存 Token
├── 获取用户和组织信息
├── 自动创建远程仓库（如不存在）
├── 检查/生成 .gitignore
└── git init + git remote add
    ↓
代码自动提交
├── 自动生成版本分支 dev/1.0.1
├── 检查 stash 区
├── 检查代码冲突
├── git add + git commit
├── 切换到开发分支
├── 合并远程 master
└── git push 推送开发分支
    ↓
云构建 + 发布
├── WebSocket 连接云构建服务器
├── 服务端执行 git clone → npm install → npm run build
├── 实时推送构建日志到 CLI 终端
├── 构建产物上传阿里云 OSS
└── 下载 index.html 部署到服务器
    ↓
如果是 --prod 正式发布：
├── 打 tag（release/1.0.1）
├── 合并开发分支到 master
├── 推送 master
└── 删除本地和远程开发分支
\`\`\`

**云构建的 WebSocket 实时通信：**

\`\`\`javascript
// CLI 端 WebSocket 连接
const ws = new WebSocket(BUILD_SERVER_URL);

ws.on('open', () => {
  ws.send(JSON.stringify({ 
    type: 'build', 
    repo: gitRemoteUrl,
    branch: currentBranch,
    buildCmd: 'npm run build'
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  switch (msg.type) {
    case 'log':
      console.log(msg.content);  // 实时打印构建日志
      break;
    case 'success':
      console.log('构建成功！');
      resolve(msg.result);
      break;
    case 'error':
      console.error('构建失败：', msg.message);
      reject(new Error(msg.message));
      break;
  }
});

// 5分钟超时兜底
setTimeout(() => {
  ws.close();
  reject(new Error('构建超时'));
}, 5 * 60 * 1000);
\`\`\`

**为什么要云构建而不是本地构建？**

1. **环境一致性**：云端统一 Node 版本和构建环境，避免"我本地能跑"的问题
2. **安全性**：OSS AccessKey 等敏感凭证只存在服务端，不暴露给开发者
3. **资源利用**：构建服务器配置更高，构建更快
4. **可追溯**：每次构建都有日志记录，方便排查问题

**WebSocket 断线处理：**

1. **心跳检测**：定期发送 ping/pong，检测连接是否存活
2. **自动重连**：断线后指数退避重试（1s → 2s → 4s → 8s）
3. **断点续传**：服务端记录日志偏移量，重连后从断点继续推送
4. **超时兜底**：设置最大重试次数和总超时时间

---

### 面试官：Git 自动化中最难处理的是什么？

最难的是 **异常处理和回滚**。Git 操作涉及本地文件操作、网络请求（GitHub API）、远程交互（push），任何一步失败都需要正确回滚，否则会留下半成品状态。

**举几个典型的异常场景：**

**场景 1：创建远程仓库成功，但 push 失败**

\`\`\`javascript
async function gitAutomate() {
  const initialHead = await git.revparse(['HEAD']).catch(() => null);
  
  try {
    // 创建远程仓库
    const repo = await createRemoteRepo(projectName, token);
    await git.addRemote('origin', repo.clone_url);
    
    // push 失败
    await git.push('origin', branch); // ← 这里可能失败
    
  } catch (err) {
    // 回滚：reset 回初始状态
    if (initialHead) {
      await git.reset(['--hard', initialHead]);
    }
    // 注意：远程仓库已经创建了，需要通过 API 删除
    throw err;
  }
}
\`\`\`

**场景 2：远程有新提交，本地 push 冲突**

\`\`\`javascript
// 检测到未提交修改时的处理
const status = await git.status();
if (status.modified.length > 0 || status.not_added.length > 0) {
  await git.stash();                    // 暂存本地修改
  await git.pull('origin', branch);     // 拉取远程最新代码
  await git.stash(['pop']);             // 恢复本地修改
  // 如果 pop 时有冲突，提示用户手动解决
}
\`\`\`

**场景 3：GitHub API 限流**

GitHub API 每小时限制 5000 次调用。我们做了请求频率控制和缓存：

\`\`\`javascript
// Token 缓存到本地文件
const tokenPath = path.resolve(homePath, '.git_token');
let token = readFile(tokenPath);
if (!token || refreshToken) {
  // 引导用户输入 Token
  const { token: inputToken } = await inquirer.prompt({
    type: 'password',
    name: 'token',
    message: '请将 token 复制到这里',
  });
  token = inputToken;
  writeFile(tokenPath, token);
}
\`\`\`

**场景 4：版本号冲突**

\`\`\`javascript
// 自动检测远程发布分支，智能升版
async function getCorrectVersion() {
  const remoteBranches = await getRemoteBranchList('release');
  const latestRelease = remoteBranches[0]; // 最新的发布版本
  
  if (semver.lte(this.version, latestRelease)) {
    // 当前版本 <= 远程最新版本，需要升版
    const { incType } = await inquirer.prompt({
      type: 'list',
      message: '自动升级版本，请选择升级类型',
      choices: [
        { name: \`小版本 (patch): \${semver.inc(latestRelease, 'patch')}\`, value: 'patch' },
        { name: \`中版本 (minor): \${semver.inc(latestRelease, 'minor')}\`, value: 'minor' },
        { name: \`大版本 (major): \${semver.inc(latestRelease, 'major')}\`, value: 'major' },
      ],
    });
    this.version = semver.inc(latestRelease, incType);
  }
  
  this.branch = \`dev/\${this.version}\`;
}
\`\`\`

---

### 面试官：子进程是怎么使用的？Windows 兼容性怎么处理？

脚手架中大量使用了子进程，主要用于：
1. 执行系统命令（npm install、npm run build）
2. 在隔离环境中执行动态加载的命令逻辑
3. 利用多核 CPU 并行执行

**Windows 兼容性是最大的坑：**

\`\`\`javascript
// ❌ 错误：Windows 下会报 ENOENT
spawn('npm', ['install']);

// ✅ 正确：Windows 兼容处理
function spawnCompat(command, args, options) {
  const win32 = process.platform === 'win32';
  const cmd = win32 ? 'cmd' : command;
  const cmdArgs = win32 ? ['/c', command, ...args] : args;
  
  return spawn(cmd, cmdArgs, {
    cwd: process.cwd(),
    stdio: 'inherit',
    ...options
  });
}
\`\`\`

**为什么 Windows 下 spawn('npm') 会报错？**

因为 Windows 下 npm 实际上是 \`npm.cmd\`（一个批处理文件），\`spawn\` 默认不通过 shell 执行，所以找不到 \`npm\` 这个可执行文件。解决方案是通过 \`cmd /c\` 来执行，让 Windows 的命令解释器来处理。

**其他跨平台问题：**

1. **路径分隔符**：Windows 用 \`\\\`，Mac/Linux 用 \`/\`。统一用 \`path.join\` 和 \`formatPath\` 处理
2. **用户主目录**：\`os.homedir()\` 跨平台获取
3. **文件权限**：Unix 有可执行权限，Windows 没有，\`chmod\` 调用需要 try-catch
4. **环境变量**：用 \`cross-env\` 统一处理
5. **路径长度**：Windows 默认 260 字符限制，深层 node_modules 可能超限
`
