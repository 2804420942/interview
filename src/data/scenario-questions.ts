import type { Question } from './types'

export const scenarioQuestions: Question[] = [
  {
    id: 1001,
    title: '脚手架工具是如何实现模板下载和缓存的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 脚手架工具是如何实现模板下载和缓存的？

**答案：**
1. **模板获取**：通过接口请求获取可用模板列表，用户选择后下载对应模板
2. **下载方式**：使用 \`download-git-repo\` 或直接 HTTP 下载 zip 包，解压到临时目录
3. **EJS 渲染**：用 EJS 模板引擎将项目配置信息（项目名、作者、描述）注入模板文件
4. **缓存策略**：下载的模板缓存到用户目录（\`~/.my-cli/templates/\`），下次使用同一模板时直接使用缓存，通过 ETag 或版本号判断是否需要更新

**追问：** 如何处理模板更新？

**答案：**
每次使用模板时，先请求接口获取最新版本号，与本地缓存的版本号对比。如果有更新，提示用户并下载新版本；如果网络不可用，使用本地缓存并提示用户。`,
    tags: ['脚手架', '模板缓存', 'EJS', 'download-git-repo']
  },
  {
    id: 1002,
    title: '脚手架的 publish 命令是如何检测 Git 冲突的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 脚手架的 publish 命令是如何检测 Git 冲突的？

**答案：**
使用 \`simple-git\` 库：

\`\`\`javascript
const git = simpleGit(projectPath)
const status = await git.status()
// 检查是否有未提交的冲突文件
if (status.conflicted.length > 0) {
  throw new Error(\\\`存在冲突文件：\\\${status.conflicted.join(', ')}\\\`)
}
// 检查是否有未暂存的修改
if (status.modified.length > 0 || status.not_added.length > 0) {
  const answer = await inquirer.prompt([{
    type: 'confirm', message: '有未提交的修改，是否继续？'
  }])
  if (!answer.confirm) process.exit(0)
}
\`\`\`

**追问：** 如何处理远程仓库不存在的情况？

**答案：**
通过 GitHub/GitLab API 检查仓库是否存在，不存在则自动创建：
\`\`\`javascript
const octokit = new Octokit({ auth: token })
try {
  await octokit.repos.get({ owner, repo })
} catch (e) {
  if (e.status === 404) {
    await octokit.repos.createForAuthenticatedUser({ name: repo })
  }
}
\`\`\``,
    tags: ['脚手架', 'Git', 'simple-git', 'publish']
  },
  {
    id: 1003,
    title: '云构建系统中 WebSocket 通信是如何设计的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 云构建系统中 WebSocket 通信是如何设计的？

**答案：**
**通信协议设计：**
\`\`\`javascript
{
  type: 'BUILD_START' | 'BUILD_LOG' | 'BUILD_SUCCESS' | 'BUILD_ERROR',
  payload: { ... },
  timestamp: Date.now()
}
\`\`\`

**流程：**
1. 脚手架连接 WebSocket 服务器，发送 BUILD_START 消息
2. 服务器接收后，将项目文件上传到 OSS，触发构建任务
3. 构建过程中，服务器实时推送 BUILD_LOG 消息
4. 构建完成后，推送 BUILD_SUCCESS 或 BUILD_ERROR
5. 脚手架根据结果展示成功/失败信息

**追问：** 如何处理 WebSocket 断线重连？

**答案：**
\`\`\`javascript
function createWebSocket(url) {
  let ws, reconnectTimer
  const connect = () => {
    ws = new WebSocket(url)
    ws.onclose = () => {
      reconnectTimer = setTimeout(connect, 3000)
    }
    ws.onerror = () => ws.close()
  }
  connect()
  return { send: (data) => ws.readyState === 1 && ws.send(data) }
}
\`\`\``,
    tags: ['WebSocket', '云构建', '实时通信', '断线重连']
  },
  {
    id: 1004,
    title: 'Lerna Monorepo 中如何管理包之间的依赖？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## Lerna Monorepo 中如何管理包之间的依赖？

**答案：**
脚手架项目的包结构：
\`\`\`
packages/
  cli/          # 命令行入口
  core/         # 核心逻辑
  utils/        # 工具函数
  commands/     # 各命令实现
    init/
    publish/
\`\`\`

**依赖管理：**
1. cli 依赖 core，core 依赖 commands/*
2. 在 package.json 中声明内部依赖：\`"@my-cli/core": "^1.0.0"\`
3. Lerna 的 bootstrap 命令会将内部包通过符号链接连接

**追问：** 如何用子进程提升构建性能？

**答案：**
\`\`\`javascript
const { fork } = require('child_process')
const tasks = packages.map(pkg => {
  return new Promise((resolve, reject) => {
    const child = fork('./build-worker.js', [pkg])
    child.on('exit', code => code === 0 ? resolve() : reject())
  })
})
await Promise.all(tasks) // 并行执行，充分利用多核 CPU
\`\`\``,
    tags: ['Monorepo', 'Lerna', '子进程', '并行构建']
  },
  {
    id: 1005,
    title: '脚手架如何实现自动安装依赖和启动项目？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 脚手架如何实现自动安装依赖和启动项目？

**答案：**
\`\`\`javascript
const { execSync, spawn } = require('child_process')

// 安装依赖
function installDeps(projectPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install'], {
      cwd: projectPath,
      stdio: 'inherit', // 将子进程的输出直接显示在终端
    })
    child.on('close', code =>
      code === 0 ? resolve() : reject(new Error('安装失败'))
    )
  })
}

// 启动项目
function startProject(projectPath) {
  spawn('npm', ['run', 'dev'], {
    cwd: projectPath,
    stdio: 'inherit',
    detached: true, // 独立进程
  }).unref()
}
\`\`\`

**追问：** 如何检测用户使用的是 npm 还是 yarn/pnpm？

**答案：**
\`\`\`javascript
function detectPackageManager() {
  if (fs.existsSync('yarn.lock')) return 'yarn'
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  if (process.env.npm_execpath?.includes('yarn')) return 'yarn'
  return 'npm'
}
\`\`\``,
    tags: ['脚手架', 'npm', 'spawn', '包管理器检测']
  },
  {
    id: 1006,
    title: '骨架屏是如何实现的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 骨架屏是如何实现的？

**答案：**
**实现方案：**
1. **CSS 骨架屏**：用灰色块模拟内容布局，配合 shimmer 动画
\`\`\`css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
\`\`\`
2. **优先展示缓存数据**：页面加载时先读取本地缓存，立即渲染，同时后台请求最新数据

**追问：** 如何避免骨架屏和真实内容切换时的布局抖动（CLS）？

**答案：**
1. 骨架屏的尺寸与真实内容保持一致（预留相同的高度）
2. 使用 \`min-height\` 为动态内容预留空间
3. 图片使用 \`aspect-ratio\` 预留宽高比
4. 避免内容加载后插入新元素导致布局偏移`,
    tags: ['骨架屏', 'CSS动画', 'CLS', '首屏优化']
  },
  {
    id: 1007,
    title: '如何实现活动卡券的占位显示？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 如何实现活动卡券的占位显示？

**答案：**
活动卡券是异步加载的，为避免加载完成后页面跳动：
1. **预留占位空间**：在卡券位置渲染固定高度的占位元素（骨架屏样式）
2. **异步加载**：请求卡券数据，加载完成后替换占位元素
3. **过渡动画**：使用 opacity 过渡，避免突兀的内容切换

\`\`\`javascript
const [couponData, setCouponData] = useState(null)
const [isLoading, setIsLoading] = useState(true)
useEffect(() => {
  fetchCoupon().then(data => {
    setCouponData(data)
    setIsLoading(false)
  })
}, [])
return isLoading ? <CouponSkeleton /> : <CouponCard data={couponData} />
\`\`\`

**追问：** 如何处理卡券请求失败的情况？

**答案：**
1. 请求失败时隐藏占位元素（不显示错误状态）
2. 或显示降级内容（如"暂无活动"）
3. 记录错误日志，上报监控`,
    tags: ['占位显示', '骨架屏', '异步加载', '降级处理']
  },
  {
    id: 1008,
    title: '如何实现页面退出时自动暂停动画？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 如何实现页面退出时自动暂停动画？

**答案：**
\`\`\`javascript
onPageHide(() => {
  animationRefs.forEach(ref => ref.pause())
  timers.forEach(timer => clearInterval(timer))
})
onPageShow(() => {
  animationRefs.forEach(ref => ref.resume())
})
\`\`\`

**为什么重要：** 页面不可见时动画仍在运行会持续消耗 CPU/GPU 资源，导致电量消耗和设备发热。

**追问：** 如何统一管理页面中的所有动画？

**答案：**
创建动画管理器（AnimationManager），所有动画通过管理器注册：

\`\`\`javascript
class AnimationManager {
  animations = new Set()
  register(animation) { this.animations.add(animation) }
  unregister(animation) { this.animations.delete(animation) }
  pauseAll() { this.animations.forEach(a => a.pause()) }
  resumeAll() { this.animations.forEach(a => a.resume()) }
}
\`\`\``,
    tags: ['动画管理', '页面生命周期', '性能优化', 'AnimationManager']
  },
  {
    id: 1009,
    title: '如何建立加载耗时的性能监控？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 如何建立加载耗时的性能监控？

**答案：**
\`\`\`javascript
class PerformanceMonitor {
  marks = {}
  queue = []
  mark(name) { this.marks[name] = Date.now() }
  measure(name, startMark, endMark) {
    const duration = this.marks[endMark] - this.marks[startMark]
    this.report({ name, duration, timestamp: Date.now() })
  }
  report(data) {
    this.queue.push(data)
    if (this.queue.length >= 10) this.flush()
  }
  flush() {
    navigator.sendBeacon('/monitor/perf', JSON.stringify(this.queue))
    this.queue = []
  }
}

// 使用
monitor.mark('init_start')
// ... 初始化 ...
monitor.mark('init_end')
monitor.measure('init_load', 'init_start', 'init_end')
\`\`\`

**追问：** 如何分析性能数据，找到优化点？

**答案：**
1. 建立性能基线（P50、P75、P95 分位数）
2. 按设备型号、系统版本、网络类型分组分析
3. 对比发版前后的数据，识别性能退化
4. 找出 P95 慢的用户群体，针对性优化`,
    tags: ['性能监控', 'sendBeacon', 'P95', '性能基线']
  },
  {
    id: 1010,
    title: '如何处理 iOS/Android 平台的动画差异？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 如何处理 iOS/Android 平台的动画差异？

**答案：**
**常见差异：**
1. iOS 的 Core Animation 对 transform 支持更好，Android 某些版本有渲染 bug
2. Android 低端机的 GPU 性能差，复杂动画容易掉帧
3. 两端对某些 CSS 属性的解析不同

**处理方案：**
\`\`\`javascript
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
const isAndroid = /Android/.test(navigator.userAgent)

const animationConfig = isIOS
  ? { duration: 300, easing: 'ease-out' }
  : { duration: 250, easing: 'linear' }

const isLowEndDevice = navigator.hardwareConcurrency <= 4
if (isLowEndDevice) {
  // 禁用复杂动画，使用简单过渡
}
\`\`\`

**追问：** 如何建立跨平台自测流程？

**答案：**
1. 建立测试设备矩阵（iOS 高中低端、Android 高中低端）
2. 制定自测 Checklist（功能、动画、性能、边界情况）
3. 使用真机测试，不只依赖模拟器
4. 关键功能录制视频对比两端表现`,
    tags: ['跨平台', 'iOS/Android', '动画差异', '低端机适配']
  },
  {
    id: 1011,
    title: 'Canvas 主题预览功能是如何实现的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## Canvas 主题预览功能是如何实现的？

**答案：**
**实现流程：**
1. **接收 zip 文件**：后台传来包含多个图片的 zip 文件
2. **解压**：使用 jszip 解压，获取各图层图片
3. **颜色计算**：分析主图颜色，计算适合的文字颜色
4. **Canvas 合成**：将背景图、气泡、头像挂件、Icon 等多层素材叠加渲染

\`\`\`javascript
async function renderThemePreview(zipBuffer) {
  const zip = await JSZip.loadAsync(zipBuffer)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const bgImage = await loadImage(await zip.file('background.png').async('blob'))
  const bubbleImage = await loadImage(await zip.file('bubble.png').async('blob'))
  const textColor = getContrastColor(getAverageColor(ctx, bgImage))
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(bubbleImage, bubbleX, bubbleY)
  ctx.fillStyle = textColor
  ctx.fillText('示例文字', textX, textY)
  return canvas.toDataURL()
}
\`\`\`

**追问：** 如何计算图片的平均颜色？

**答案：**
\`\`\`javascript
function getAverageColor(ctx, image) {
  ctx.drawImage(image, 0, 0, 1, 1) // 缩放到 1x1 像素
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return { r, g, b }
}
function getContrastColor({ r, g, b }) {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#333333' : '#ffffff'
}
\`\`\``,
    tags: ['Canvas', 'JSZip', '图片合成', '颜色计算']
  },
  {
    id: 1012,
    title: '多级审核流程系统是如何设计的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 多级审核流程系统是如何设计的？

**答案：**
**状态机设计：**
\`\`\`
草稿 → 提交审核 → 审核中 → 审核通过 → 上架
                          ↓
                        打回修改 → 草稿（重新提交）
\`\`\`

**前端实现：**
1. **状态流转**：每个状态对应不同的操作按钮和展示内容
2. **权限控制**：设计师只能提交/修改，审核人员只能通过/打回
3. **评级系统**：审核时可以给素材评级（A/B/C），影响推荐权重
4. **操作记录**：记录每次状态变更的操作人、时间、备注

**追问：** 如何处理并发审核冲突？

**答案：**
1. **乐观锁**：素材有版本号，提交审核结果时携带版本号，服务端检查是否匹配
2. **状态锁定**：审核人打开素材时，服务端将状态改为"审核中（锁定）"
3. **超时释放**：锁定超过 30 分钟自动释放`,
    tags: ['审核流程', '状态机', '乐观锁', '权限控制']
  },
  {
    id: 1013,
    title: 'AI 自动生产流程是如何实现的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## AI 自动生产流程是如何实现的？

**答案：**
**流程设计：**
1. **需求预测**：AI 供需数据驱动模型分析历史数据，预测需要的素材类型和数量
2. **任务生成**：根据预测结果自动创建生产任务
3. **AI 生成**：调用 AI 服务（文生图、图生图）生成素材
4. **自动流转**：生成的素材自动进入审核流程
5. **开关控制**：产品人员可以通过开关控制是否启用全自动模式

**前端实现：**
- 配置页面：设置每周生产总数、生产策略、AI 参数
- 任务监控：实时展示自动生产任务的进度和状态
- 数据看板：统计 AI 自动生产成功率、审核通过率

**追问：** 如何处理 AI 生成失败的情况？

**答案：**
1. 失败重试：自动重试 3 次，每次间隔递增
2. 降级处理：AI 失败后，将任务转为人工生产
3. 告警通知：失败率超过阈值时通知相关人员
4. 失败原因记录：用于优化 AI 模型`,
    tags: ['AIGC', 'AI自动生产', '任务调度', '降级处理']
  },
  {
    id: 1014,
    title: '如何实现素材的三联图合成？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 如何实现素材的三联图合成？

**答案：**
三联图是将三张图片合成为一张展示图：

\`\`\`javascript
async function compositeTripleImage(images) {
  const canvas = document.createElement('canvas')
  const totalWidth = images.reduce((sum, img) => sum + img.width, 0) + GAP * 2
  const maxHeight = Math.max(...images.map(img => img.height))
  canvas.width = totalWidth
  canvas.height = maxHeight
  const ctx = canvas.getContext('2d')
  let x = 0
  for (const img of images) {
    const y = (maxHeight - img.height) / 2
    ctx.drawImage(img, x, y, img.width, img.height)
    x += img.width + GAP
  }
  return canvas.toDataURL('image/png')
}
\`\`\`

**追问：** Canvas 绘制跨域图片时会遇到什么问题？

**答案：**
跨域图片会导致 Canvas 被"污染"（tainted），无法调用 \`toDataURL()\` 或 \`getImageData()\`。

解决方案：
1. 图片服务器设置 \`Access-Control-Allow-Origin\` 响应头
2. 图片元素设置 \`crossOrigin="anonymous"\`
3. 或将图片转为 Blob URL（通过 fetch 下载后创建 Object URL）`,
    tags: ['Canvas', '图片合成', '跨域', 'CORS']
  },
  {
    id: 1015,
    title: '如何实现主题上架与天权平台的数据通道？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 如何实现主题上架与天权平台的数据通道？

**答案：**
**数据同步流程：**
1. 审核通过后，前端调用上架接口
2. 后端将素材数据同步到天权平台
3. 天权平台处理后，素材出现在 QQ 个性化首页

**前端实现：**
1. **状态轮询**：上架后轮询状态，直到同步完成
2. **WebSocket 推送**：或使用 WebSocket 接收同步结果通知
3. **失败处理**：同步失败时显示错误原因，支持重新上架

**追问：** 如何监控上架成功率？

**答案：**
1. 记录每次上架操作的结果（成功/失败/超时）
2. 统计上架成功率、平均耗时
3. 按时间维度分析，发现异常波动
4. 设置告警阈值，成功率低于 95% 时告警`,
    tags: ['数据同步', '上架流程', '监控告警', '状态轮询']
  },
  {
    id: 1016,
    title: '动态主题色替换是如何实现的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 动态主题色替换是如何实现的？

**答案：**
结合 ElementPlus 主题色替换：

\`\`\`javascript
async function changeTheme(newColor) {
  // 1. 获取 ElementPlus 的 CSS
  const cssText = await fetch('/element-plus.css').then(r => r.text())
  // 2. 计算颜色变体
  const colorMap = generateColorMap('#409EFF', newColor)
  // 3. 正则替换所有颜色
  let newCss = cssText
  Object.entries(colorMap).forEach(([oldColor, newColorVal]) => {
    newCss = newCss.replace(new RegExp(oldColor, 'gi'), newColorVal)
  })
  // 4. 注入新样式
  const style = document.getElementById('theme-style') || document.createElement('style')
  style.id = 'theme-style'
  style.textContent = newCss
  document.head.appendChild(style)
}
\`\`\`

**追问：** 如何生成颜色的深浅变体？

**答案：**
使用 tinycolor2 或手动计算：
\`\`\`javascript
import tinycolor from 'tinycolor2'
function generateColorMap(baseColor, newColor) {
  const map = {}
  for (let i = 1; i <= 9; i++) {
    const oldVariant = tinycolor(baseColor).lighten(i * 5).toHexString()
    const newVariant = tinycolor(newColor).lighten(i * 5).toHexString()
    map[oldVariant] = newVariant
  }
  map[baseColor] = newColor
  return map
}
\`\`\``,
    tags: ['主题色', 'ElementPlus', 'CSS变量', 'tinycolor2']
  },
  {
    id: 1017,
    title: '菜单模糊搜索是如何实现的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 菜单模糊搜索是如何实现的？

**答案：**
使用 fuse.js 实现：

\`\`\`javascript
import Fuse from 'fuse.js'
const menuItems = routes.map(route => ({
  title: route.meta.title,
  path: route.path,
  keywords: route.meta.keywords || [],
}))
const fuse = new Fuse(menuItems, {
  keys: ['title', 'keywords'],
  threshold: 0.3,
  includeScore: true,
})
function searchMenu(query) {
  return fuse.search(query).map(result => result.item)
}
\`\`\`

**追问：** 为什么选择 fuse.js 而不是简单的字符串匹配？

**答案：**
简单字符串匹配（\`includes\`）只能精确匹配，用户输入"用户管理"找不到"用户列表"。fuse.js 使用模糊匹配算法（Bitap 算法），可以处理拼写错误、部分匹配，搜索体验更好。同时支持多字段搜索和权重配置。`,
    tags: ['模糊搜索', 'fuse.js', 'Bitap算法', '菜单搜索']
  },
  {
    id: 1018,
    title: 'tagViewList 动态标签页是如何实现的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## tagViewList 动态标签页是如何实现的？

**答案：**
\`\`\`javascript
// Pinia store
const useTagViewStore = defineStore('tagView', {
  state: () => ({ tags: [] }),
  actions: {
    addTag(route) {
      if (this.tags.some(t => t.path === route.path)) return
      this.tags.push({ title: route.meta.title, path: route.path, query: route.query })
    },
    removeTag(path) {
      this.tags = this.tags.filter(t => t.path !== path)
    },
    removeOtherTags(currentPath) {
      this.tags = this.tags.filter(t => t.path === currentPath || t.meta?.affix)
    },
  }
})
\`\`\`

**追问：** 如何实现标签页的拖拽排序？

**答案：**
使用 vue-draggable-plus 或 sortablejs：
\`\`\`vue
<draggable v-model="tags" item-key="path">
  <template #item="{ element }">
    <div class="tag-item">{{ element.title }}</div>
  </template>
</draggable>
\`\`\``,
    tags: ['标签页', 'Pinia', '动态路由', '拖拽排序']
  },
  {
    id: 1019,
    title: '右键菜单（contextMenu）是如何实现的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 右键菜单（contextMenu）是如何实现的？

**答案：**
\`\`\`javascript
function useContextMenu() {
  const visible = ref(false)
  const position = ref({ x: 0, y: 0 })
  function show(e, target) {
    e.preventDefault()
    visible.value = true
    position.value = { x: e.clientX, y: e.clientY }
    nextTick(() => adjustPosition())
  }
  function hide() { visible.value = false }
  onMounted(() => document.addEventListener('click', hide))
  onUnmounted(() => document.removeEventListener('click', hide))
  return { visible, position, show, hide }
}
\`\`\`

**追问：** 如何防止右键菜单超出视口边界？

**答案：**
\`\`\`javascript
function adjustPosition() {
  const menu = menuRef.value
  const { x, y } = position.value
  const { innerWidth, innerHeight } = window
  const { offsetWidth, offsetHeight } = menu
  position.value = {
    x: x + offsetWidth > innerWidth ? x - offsetWidth : x,
    y: y + offsetHeight > innerHeight ? y - offsetHeight : y,
  }
}
\`\`\``,
    tags: ['右键菜单', 'contextMenu', '视口边界', 'Composable']
  },
  {
    id: 1020,
    title: '拖拽构建决策表是如何实现的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 拖拽构建决策表是如何实现的？

**答案：**
**数据结构：**
\`\`\`javascript
{
  columns: [
    { id: 'col1', name: '年龄', type: 'number', conditions: [] },
    { id: 'col2', name: '收入', type: 'number', conditions: [] }
  ],
  rows: [
    { id: 'row1', cells: { col1: '>18', col2: '>5000' }, result: '通过' }
  ]
}
\`\`\`

**拖拽实现：**
1. 列可以拖拽排序（调整决策条件顺序）
2. 行可以拖拽排序（调整决策优先级）
3. 使用 vue-draggable-plus 实现

**追问：** 如何处理决策表的数据验证？

**答案：**
1. 条件格式验证：数字类型只允许 >、<、=、>=、<=、between 等操作符
2. 完整性验证：每行必须有结果值
3. 冲突检测：检查是否有两行条件完全相同
4. 实时验证：输入时即时反馈`,
    tags: ['决策表', '拖拽', 'vue-draggable', '数据验证']
  },
  {
    id: 1021,
    title: '动态路由是如何实现的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 动态路由是如何实现的？

**答案：**
\`\`\`javascript
// 1. 登录后获取用户权限
const { permissions } = await getUserInfo()
// 2. 根据权限过滤路由
const accessRoutes = filterRoutes(allRoutes, permissions)
// 3. 动态添加路由
accessRoutes.forEach(route => router.addRoute(route))
// 4. 重定向到目标页面
router.replace(to.fullPath)

function filterRoutes(routes, permissions) {
  return routes.filter(route => {
    if (!route.meta?.permission) return true
    if (!permissions.includes(route.meta.permission)) return false
    if (route.children) {
      route.children = filterRoutes(route.children, permissions)
    }
    return true
  })
}
\`\`\`

**追问：** 权限变更后如何重置路由？

**答案：**
Vue Router 4 中需要手动移除动态路由：
\`\`\`javascript
function resetRouter() {
  dynamicRoutes.forEach(route => router.removeRoute(route.name))
}
\`\`\``,
    tags: ['动态路由', '权限控制', 'addRoute', 'Vue Router']
  },
  {
    id: 1022,
    title: '细粒度权限控制（功能权限、数据权限）是如何实现的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 细粒度权限控制是如何实现的？

**答案：**
**功能权限（按钮级别）：**
\`\`\`javascript
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding // 'admin:delete'
    const permissions = store.state.user.permissions
    if (!permissions.includes(value)) {
      el.parentNode?.removeChild(el)
    }
  }
})
// 使用
// <button v-permission="'admin:delete'">删除</button>
\`\`\`

**数据权限（行级别）：**
数据权限通常由后端控制（查询时过滤），前端只需要处理展示逻辑。

**追问：** 如何处理权限缓存和实时更新？

**答案：**
1. 权限数据缓存在 Pinia store 中（内存级缓存）
2. 页面刷新时重新获取权限
3. 权限变更时，通过 WebSocket 推送通知，前端重新获取权限并刷新路由`,
    tags: ['权限控制', '自定义指令', 'v-permission', '数据权限']
  },
  {
    id: 1023,
    title: '首屏加载优化中路由懒加载是如何实现的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 首屏加载优化中路由懒加载是如何实现的？

**答案：**
\`\`\`javascript
const routes = [
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
  },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/User.vue'),
  },
]
\`\`\`

**优化效果：**
- 路由懒加载 + 组件异步加载：首屏资源体积减少 60%
- KeepAlive 缓存高频页面：二次访问速度提升 70%

**追问：** 如何预加载可能访问的路由？

**答案：**
\`\`\`javascript
router.getRoutes().forEach(route => {
  if (route.meta?.preload) {
    requestIdleCallback(() => { import(route.component) })
  }
})
\`\`\``,
    tags: ['路由懒加载', '代码分割', 'KeepAlive', '预加载']
  },
  {
    id: 1024,
    title: '虚拟滚动在万级数据中是如何应用的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 虚拟滚动在万级数据中是如何应用的？

**答案：**
使用 el-table-v2（ElementPlus 虚拟表格）：

\`\`\`vue
<el-table-v2 :columns="columns" :data="data" :width="700" :height="400" fixed />
\`\`\`

**动态行列合并：**
虚拟表格的行列合并需要在数据层面处理：
\`\`\`javascript
function calculateSpans(data) {
  return data.map((row, index) => ({
    ...row,
    _rowSpan: calculateRowSpan(data, index, 'category'),
    _colSpan: calculateColSpan(row),
  }))
}
\`\`\`

**追问：** 虚拟表格和普通表格在性能上的差异？

**答案：**
普通表格渲染 10000 行：DOM 节点数 = 10000 × 列数，内存占用大，滚动卡顿。虚拟表格只渲染可视区域（约 20-30 行），DOM 节点数固定，渲染性能提升 300%。`,
    tags: ['虚拟滚动', 'el-table-v2', '大数据渲染', '行列合并']
  },
  {
    id: 1025,
    title: '微信公众号模板可视化编辑器是如何实现的？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 微信公众号模板可视化编辑器是如何实现的？

**答案：**
**核心功能：**
1. **拖拽布局**：使用 vue-draggable-plus 实现组件拖拽排序
2. **样式实时预览**：修改样式时实时更新预览区域
3. **组件库**：文本、图片、按钮、分割线等基础组件
4. **属性面板**：选中组件后显示对应的属性配置

**数据结构：**
\`\`\`javascript
{
  components: [{
    id: 'comp1',
    type: 'text',
    props: { content: '标题', fontSize: 18, color: '#333' },
    style: { margin: '10px 0' },
  }]
}
\`\`\`

**追问：** 如何实现撤销/重做功能？

**答案：**
使用命令模式，维护操作历史栈：
\`\`\`javascript
const history = []
const redoStack = []
function execute(action) {
  action.do()
  history.push(action)
  redoStack.length = 0
}
function undo() {
  const action = history.pop()
  action?.undo()
  redoStack.push(action)
}
\`\`\``,
    tags: ['可视化编辑器', '拖拽', '撤销重做', '命令模式']
  },
  {
    id: 1026,
    title: '如何实现一个高性能的图片瀑布流？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个高性能的图片瀑布流？

**答案：**
\`\`\`javascript
function waterfallLayout(images, columnCount) {
  const columns = Array(columnCount).fill(0) // 每列的当前高度
  const positions = []
  images.forEach(img => {
    const minHeight = Math.min(...columns)
    const columnIndex = columns.indexOf(minHeight)
    positions.push({
      x: columnIndex * (containerWidth / columnCount),
      y: minHeight,
    })
    columns[columnIndex] += img.height * (containerWidth / columnCount / img.width)
  })
  return positions
}
\`\`\`

**性能优化：**
1. 图片懒加载（IntersectionObserver）
2. 虚拟滚动（只渲染可视区域）
3. 图片尺寸预知（避免布局抖动）

**追问：** 如何处理图片加载前不知道高度的问题？

**答案：**
1. 后端返回图片的宽高信息，前端根据列宽计算显示高度
2. 或使用固定宽高比的占位元素（aspect-ratio），图片加载后自动填充`,
    tags: ['瀑布流', '懒加载', '虚拟滚动', 'IntersectionObserver']
  },
  {
    id: 1027,
    title: '如何实现一个防止重复提交的按钮？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个防止重复提交的按钮？

**答案：**
\`\`\`javascript
// 方案一：loading 状态
async function handleSubmit() {
  if (loading.value) return
  loading.value = true
  try { await submitForm() }
  finally { loading.value = false }
}

// 方案二：防抖
const debouncedSubmit = debounce(submitForm, 1000, { leading: true, trailing: false })

// 方案三：请求去重（axios 层面）
const pendingRequests = new Map()
axios.interceptors.request.use(config => {
  const key = \\\`\\\${config.method}-\\\${config.url}\\\`
  if (pendingRequests.has(key)) {
    pendingRequests.get(key).cancel('重复请求')
  }
  const source = axios.CancelToken.source()
  config.cancelToken = source.token
  pendingRequests.set(key, source)
  return config
})
\`\`\`

**追问：** 如何处理网络超时后的重试？

**答案：**
\`\`\`javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fetch(url, options) }
    catch (e) {
      if (i === maxRetries - 1) throw e
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}
\`\`\``,
    tags: ['防重复提交', '防抖', 'CancelToken', '指数退避']
  },
  {
    id: 1028,
    title: '如何实现一个大文件上传？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个大文件上传？

**答案：**
**分片上传：**
\`\`\`javascript
async function uploadLargeFile(file) {
  const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
  const chunks = Math.ceil(file.size / CHUNK_SIZE)
  const fileHash = await calculateHash(file) // MD5 哈希

  // 检查已上传的分片（断点续传）
  const { uploadedChunks } = await checkUploadStatus(fileHash)

  const uploadTasks = []
  for (let i = 0; i < chunks; i++) {
    if (uploadedChunks.includes(i)) continue
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    uploadTasks.push(uploadChunk(chunk, i, fileHash))
  }

  // 控制并发数
  await concurrentRun(uploadTasks, 3)
  // 合并分片
  await mergeChunks(fileHash, chunks)
}
\`\`\`

**追问：** 如何计算文件的 MD5 哈希而不阻塞主线程？

**答案：**
使用 Web Worker 在后台线程计算：
\`\`\`javascript
// hash-worker.js
importScripts('spark-md5.min.js')
self.onmessage = ({ data: file }) => {
  const spark = new SparkMD5.ArrayBuffer()
  const reader = new FileReaderSync()
  spark.append(reader.readAsArrayBuffer(file))
  self.postMessage(spark.end())
}
\`\`\``,
    tags: ['大文件上传', '分片上传', '断点续传', 'Web Worker']
  },
  {
    id: 1029,
    title: '如何实现一个实时协同编辑功能？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个实时协同编辑功能？

**答案：**
**简化方案（Y.js + CRDT）：**
\`\`\`javascript
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

const doc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'room-name', doc)
const yText = doc.getText('content')

editor.on('change', delta => { yText.applyDelta(delta) })
yText.observe(() => { editor.setContents(yText.toDelta()) })
\`\`\`

**追问：** CRDT 和 OT 的区别？

**答案：**
- **OT（操作转换）**：需要中央服务器协调，实现复杂，Google Docs 使用
- **CRDT（无冲突复制数据类型）**：去中心化，无需服务器协调，自动合并，Figma 使用`,
    tags: ['协同编辑', 'CRDT', 'OT', 'Y.js', 'WebSocket']
  },
  {
    id: 1030,
    title: '如何实现一个前端路由（Hash 模式）？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个前端路由（Hash 模式）？

**答案：**
\`\`\`javascript
class HashRouter {
  constructor() {
    this.routes = {}
    window.addEventListener('hashchange', this.handleHashChange.bind(this))
    window.addEventListener('load', this.handleHashChange.bind(this))
  }
  register(path, callback) {
    this.routes[path] = callback
    return this
  }
  handleHashChange() {
    const hash = window.location.hash.slice(1) || '/'
    const handler = this.routes[hash]
    if (handler) handler()
    else this.routes['*']?.()
  }
  push(path) { window.location.hash = path }
}
\`\`\`

**追问：** History 模式的路由如何实现？

**答案：**
\`\`\`javascript
class HistoryRouter {
  push(path) {
    history.pushState({ path }, '', path)
    this.handleRouteChange(path)
  }
  replace(path) {
    history.replaceState({ path }, '', path)
    this.handleRouteChange(path)
  }
  constructor() {
    window.addEventListener('popstate', e => {
      this.handleRouteChange(e.state?.path || '/')
    })
  }
}
\`\`\``,
    tags: ['前端路由', 'Hash模式', 'History模式', 'pushState']
  },
  {
    id: 1031,
    title: '如何实现一个 Toast 通知组件？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个 Toast 通知组件？

**答案：**
使用 Teleport 将 Toast 渲染到 body，通过 createApp 动态创建 Vue 实例，支持队列管理和自动消失。

\`\`\`javascript
// toast.js
import { createApp, ref } from 'vue'
import ToastComponent from './Toast.vue'

const toasts = ref([])
let container = null

function showToast(message, options = {}) {
  if (!container) {
    container = document.createElement('div')
    document.body.appendChild(container)
    createApp({ setup: () => ({ toasts }), template: '<ToastContainer :toasts="toasts" />' }).mount(container)
  }
  const id = Date.now()
  const toast = { id, message, type: options.type || 'info', ...options }
  toasts.value.push(toast)
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, options.duration || 3000)
}

export default { success: (msg) => showToast(msg, { type: 'success' }), error: (msg) => showToast(msg, { type: 'error' }) }
\`\`\``,
    tags: ['Toast', 'Teleport', 'createApp', '通知组件']
  },
  {
    id: 1032,
    title: '如何实现一个无限滚动加载？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个无限滚动加载？

**答案：**
使用 IntersectionObserver 监听底部哨兵元素，进入视口时触发加载：

\`\`\`javascript
function useInfiniteScroll(loadMore) {
  const sentinelRef = ref(null)
  const loading = ref(false)
  const hasMore = ref(true)

  onMounted(() => {
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && !loading.value && hasMore.value) {
        loading.value = true
        try {
          const result = await loadMore()
          if (result.length === 0) hasMore.value = false
        } finally {
          loading.value = false
        }
      }
    }, { rootMargin: '200px' })

    if (sentinelRef.value) observer.observe(sentinelRef.value)
    onUnmounted(() => observer.disconnect())
  })

  return { sentinelRef, loading, hasMore }
}
\`\`\``,
    tags: ['无限滚动', 'IntersectionObserver', '分页加载', '哨兵元素']
  },
  {
    id: 1033,
    title: '如何实现一个图片裁剪功能？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个图片裁剪功能？

**答案：**
使用 cropperjs：初始化 Cropper 实例，用户拖拽选择裁剪区域，调用 \`getCroppedCanvas()\` 获取裁剪后的 Canvas，转为 Blob 上传。

\`\`\`javascript
import Cropper from 'cropperjs'

const image = document.getElementById('image')
const cropper = new Cropper(image, {
  aspectRatio: 1, // 1:1 裁剪
  viewMode: 1,
  guides: true,
  autoCropArea: 0.8,
})

// 获取裁剪结果
function getCroppedImage() {
  return new Promise(resolve => {
    cropper.getCroppedCanvas({
      width: 200,
      height: 200,
      imageSmoothingQuality: 'high'
    }).toBlob(blob => resolve(blob), 'image/jpeg', 0.9)
  })
}
\`\`\``,
    tags: ['图片裁剪', 'cropperjs', 'Canvas', 'Blob']
  },
  {
    id: 1034,
    title: '如何实现一个虚拟任务栈（移动端路由）？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个虚拟任务栈（移动端路由）？

**答案：**
维护一个路由栈数组，push 时添加新页面（从右滑入），pop 时移除（从右滑出），支持手势返回。

\`\`\`javascript
class RouterStack {
  stack = [{ path: '/', component: HomePage }]

  push(route) {
    this.stack.push(route)
    this.animate('slide-in-right')
  }

  pop() {
    if (this.stack.length <= 1) return
    this.animate('slide-out-right')
    this.stack.pop()
  }

  replace(route) {
    this.stack[this.stack.length - 1] = route
  }

  // 手势返回
  handleSwipe(direction) {
    if (direction === 'right' && this.stack.length > 1) {
      this.pop()
    }
  }
}
\`\`\`

**追问：** 如何配合 KeepAlive 实现页面缓存？

**答案：**
只缓存栈中存在的页面组件：
\`\`\`vue
<KeepAlive :include="stackComponentNames">
  <RouterView />
</KeepAlive>
\`\`\``,
    tags: ['路由栈', '移动端路由', '手势返回', 'KeepAlive']
  },
  {
    id: 1035,
    title: '如何实现 QQ 登录和微信扫码登录？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现 QQ 登录和微信扫码登录？

**答案：**
**QQ 登录：** 引入 QQ 互联 SDK，调用 \`QC.Login.showPopup()\` 弹出授权窗口，获取 access_token 后传给后端换取用户信息。

**微信扫码：** 后端生成二维码（含 scene_id），前端展示二维码，轮询或 WebSocket 监听扫码状态。

\`\`\`javascript
// 微信扫码登录轮询
async function pollScanStatus(sceneId) {
  while (true) {
    const { status, token } = await checkScanStatus(sceneId)
    if (status === 'confirmed') {
      localStorage.setItem('token', token)
      router.push('/dashboard')
      return
    }
    if (status === 'expired') { refreshQRCode(); return }
    await sleep(2000) // 2秒轮询
  }
}
\`\`\``,
    tags: ['QQ登录', '微信登录', 'OAuth', '扫码登录']
  },
  {
    id: 1036,
    title: '如何实现一个拖拽排序列表？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个拖拽排序列表？

**答案：**
使用 vue-draggable-plus（基于 Sortable.js），绑定 v-model 到数组，拖拽时自动更新数组顺序。

\`\`\`vue
<template>
  <VueDraggable v-model="list" :animation="150" @end="onDragEnd">
    <div v-for="item in list" :key="item.id" class="drag-item">
      {{ item.name }}
    </div>
  </VueDraggable>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'

const list = ref([
  { id: 1, name: '项目A', sort: 1 },
  { id: 2, name: '项目B', sort: 2 },
])

async function onDragEnd() {
  // 保存排序结果到后端
  const sortData = list.value.map((item, index) => ({ id: item.id, sort: index }))
  await saveSortOrder(sortData)
}
</script>
\`\`\``,
    tags: ['拖拽排序', 'Sortable.js', 'vue-draggable-plus']
  },
  {
    id: 1037,
    title: '如何实现一个富文本编辑器？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个富文本编辑器？

**答案：**
使用 Quill.js 或 TipTap，配置工具栏（加粗、斜体、链接、图片），处理图片上传（拦截 base64，上传到 OSS 后替换为 URL），配合 DOMPurify 防 XSS。

\`\`\`javascript
import Quill from 'quill'

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, 3, false] }],
      ['link', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ]
  }
})

// 自定义图片上传（避免 base64）
quill.getModule('toolbar').addHandler('image', () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files[0]
    const url = await uploadToOSS(file)
    const range = quill.getSelection()
    quill.insertEmbed(range.index, 'image', url)
  }
  input.click()
})
\`\`\``,
    tags: ['富文本编辑器', 'Quill.js', 'TipTap', 'DOMPurify']
  },
  {
    id: 1038,
    title: '如何实现一个数据大屏（ECharts）？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个数据大屏（ECharts）？

**答案：**
使用 ECharts，配合 ResizeObserver 监听容器尺寸变化自动 resize，使用 requestAnimationFrame 优化数据更新频率。

\`\`\`javascript
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, CanvasRenderer])

function initChart(el) {
  const chart = echarts.init(el)
  const observer = new ResizeObserver(() => chart.resize())
  observer.observe(el)

  // 大数据量使用 dataset
  chart.setOption({
    dataset: { source: data },
    dataZoom: [{ type: 'slider' }],
    series: [{ type: 'bar', encode: { x: 'date', y: 'value' } }]
  })
  return { chart, dispose: () => { observer.disconnect(); chart.dispose() } }
}
\`\`\``,
    tags: ['ECharts', '数据大屏', 'ResizeObserver', '按需引入']
  },
  {
    id: 1039,
    title: '如何实现一个 PDF 预览功能？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个 PDF 预览功能？

**答案：**
使用 pdf.js 库，将 PDF 渲染到 Canvas，支持翻页、缩放。

\`\`\`javascript
import * as pdfjsLib from 'pdfjs-dist'

async function renderPDF(url, container) {
  const pdf = await pdfjsLib.getDocument(url).promise
  const totalPages = pdf.numPages

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i)
    const scale = 1.5
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')
    await page.render({ canvasContext: ctx, viewport }).promise
    container.appendChild(canvas)
  }
}
\`\`\`

或直接使用 iframe 嵌入浏览器原生 PDF 查看器（简单但样式不可控）。`,
    tags: ['PDF预览', 'pdf.js', 'Canvas渲染', '文档预览']
  },
  {
    id: 1040,
    title: '如何实现一个地图轨迹绘制？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个地图轨迹绘制？

**答案：**
使用高德地图 API，通过 Polyline 绘制轨迹线，实时更新时使用 setPath 更新折线坐标。

\`\`\`javascript
import AMapLoader from '@amap/amap-jsapi-loader'

async function drawTrajectory(points) {
  const AMap = await AMapLoader.load({ key: 'your-key', version: '2.0' })
  const map = new AMap.Map('container', { zoom: 15, center: points[0] })

  // 绘制轨迹线
  const polyline = new AMap.Polyline({
    path: points,
    strokeColor: '#00DC82',
    strokeWeight: 4,
    lineJoin: 'round',
  })
  map.add(polyline)

  // 起终点标记
  new AMap.Marker({ position: points[0], map, label: { content: '起点' } })
  new AMap.Marker({ position: points[points.length - 1], map, label: { content: '终点' } })

  map.setFitView() // 自动调整视野
}
\`\`\``,
    tags: ['地图', '轨迹绘制', '高德地图', 'Polyline']
  },
  {
    id: 1041,
    title: '如何实现一个短信模板变量插值引擎？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个短信模板变量插值引擎？

**答案：**
解析模板字符串中的变量占位符（如 \`{{name}}\`），提供变量选择器，预览时替换为示例值。

\`\`\`javascript
// 模板引擎
function parseTemplate(template, variables) {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match
  })
}

// 光标位置插入变量
function insertVariable(textarea, variable) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  textarea.value = text.substring(0, start) + \\\`{{\\\${variable}}}\\\` + text.substring(end)
  textarea.selectionStart = textarea.selectionEnd = start + variable.length + 4
  textarea.focus()
}

// 预览
const preview = parseTemplate(
  '尊敬的{{name}}，您的订单{{orderId}}已发货',
  { name: '张三', orderId: 'ORD20240101' }
)
// => "尊敬的张三，您的订单ORD20240101已发货"
\`\`\``,
    tags: ['模板引擎', '变量插值', '正则替换', '短信模板']
  },
  {
    id: 1042,
    title: '如何实现一个可视化配置的低代码平台？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个可视化配置的低代码平台？

**答案：**
核心架构：组件库（拖拽）+ 画布（渲染）+ 属性面板（配置）+ 数据绑定（接口）+ 预览/发布。

**Schema 驱动渲染：**
\`\`\`javascript
// 页面 Schema
{
  components: [
    {
      type: 'Table',
      props: { columns: [...], dataSource: '{{api.userList}}' },
      events: { onRowClick: { type: 'navigate', params: { path: '/user/{{row.id}}' } } }
    }
  ],
  apis: {
    userList: { url: '/api/users', method: 'GET', params: {} }
  }
}

// 渲染引擎
function renderComponent(schema) {
  const Component = componentMap[schema.type]
  const resolvedProps = resolveBindings(schema.props, context)
  return h(Component, resolvedProps, renderChildren(schema.children))
}
\`\`\``,
    tags: ['低代码', 'Schema驱动', '可视化配置', '渲染引擎']
  },
  {
    id: 1043,
    title: '如何实现多语言切换不刷新页面？',
    category: '综合场景题',
    difficulty: 'easy',
    content: `## 如何实现多语言切换不刷新页面？

**答案：**
使用 vue-i18n，切换语言时更新 \`i18n.global.locale.value\`，Vue 的响应式系统会自动更新所有使用 \`$t()\` 的地方。

\`\`\`javascript
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'zh-CN',
  messages: {
    'zh-CN': { greeting: '你好', submit: '提交' },
    'en-US': { greeting: 'Hello', submit: 'Submit' },
  }
})

// 切换语言
function changeLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
  // 更新请求头
  axios.defaults.headers['Accept-Language'] = locale
}
\`\`\``,
    tags: ['国际化', 'vue-i18n', '多语言切换', '响应式']
  },
  {
    id: 1044,
    title: '如何实现一个图片懒加载组件？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个图片懒加载组件？

**答案：**
封装 LazyImage 组件，内部使用 IntersectionObserver，未进入视口时显示占位图，进入视口后加载真实图片。

\`\`\`vue
<template>
  <div ref="containerRef" class="lazy-image-wrapper">
    <img v-if="loaded" :src="src" :alt="alt" @load="onLoad" class="fade-in" />
    <div v-else class="skeleton-placeholder" :style="{ aspectRatio }"></div>
  </div>
</template>

<script setup>
const props = defineProps({ src: String, alt: String, aspectRatio: { type: String, default: '16/9' } })
const containerRef = ref(null)
const loaded = ref(false)
const shouldLoad = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      shouldLoad.value = true
      loaded.value = true
      observer.disconnect()
    }
  }, { rootMargin: '200px' })
  observer.observe(containerRef.value)
})
</script>
\`\`\``,
    tags: ['图片懒加载', 'IntersectionObserver', '占位图', '渐进加载']
  },
  {
    id: 1045,
    title: '如何实现一个全局错误处理？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个全局错误处理？

**答案：**
Vue 3 中使用 \`app.config.errorHandler\` 捕获组件错误，\`window.onerror\` 捕获全局 JS 错误，\`window.addEventListener('unhandledrejection')\` 捕获未处理的 Promise 错误。

\`\`\`javascript
// Vue 组件错误
app.config.errorHandler = (err, vm, info) => {
  reportError({ type: 'vue', error: err.message, info, stack: err.stack })
}

// 全局 JS 错误
window.onerror = (message, source, line, column, error) => {
  reportError({ type: 'js', message, source, line, column, stack: error?.stack })
}

// 未处理的 Promise 错误
window.addEventListener('unhandledrejection', event => {
  reportError({ type: 'promise', reason: event.reason?.message || String(event.reason) })
})

// 资源加载错误
window.addEventListener('error', event => {
  if (event.target?.tagName) {
    reportError({ type: 'resource', tag: event.target.tagName, src: event.target.src })
  }
}, true) // 捕获阶段
\`\`\``,
    tags: ['错误处理', 'errorHandler', 'onerror', 'unhandledrejection']
  },
  {
    id: 1046,
    title: '如何实现一个请求并发控制？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个请求并发控制？

**答案：**
\`\`\`javascript
async function concurrentRequests(tasks, limit) {
  const results = []
  const executing = new Set()

  for (const [index, task] of tasks.entries()) {
    const p = task().then(result => {
      executing.delete(p)
      return result
    })
    executing.add(p)
    results[index] = p

    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }

  return Promise.all(results)
}

// 使用示例
const tasks = urls.map(url => () => fetch(url))
const results = await concurrentRequests(tasks, 3) // 最多 3 个并发
\`\`\`

**追问：** 如何在并发控制中加入失败重试？

**答案：**
包装每个 task，失败时自动重试：
\`\`\`javascript
function withRetry(task, maxRetries = 3) {
  return async () => {
    for (let i = 0; i < maxRetries; i++) {
      try { return await task() }
      catch (e) { if (i === maxRetries - 1) throw e }
    }
  }
}
\`\`\``,
    tags: ['并发控制', 'Promise.race', '请求调度', '失败重试']
  },
  {
    id: 1047,
    title: '如何实现一个前端缓存层？',
    category: '综合场景题',
    difficulty: 'hard',
    content: `## 如何实现一个前端缓存层？

**答案：**
封装 useCache Composable，内部使用 Map 存储缓存，支持 TTL（过期时间）、LRU 淘汰策略。

\`\`\`javascript
class CacheLayer {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  get(key) {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (entry.expireAt && Date.now() > entry.expireAt) {
      this.cache.delete(key)
      return null
    }
    // LRU：访问时移到最后
    this.cache.delete(key)
    this.cache.set(key, entry)
    return entry.value
  }

  set(key, value, ttl) {
    if (this.cache.size >= this.maxSize) {
      // 删除最久未使用的（Map 的第一个元素）
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, {
      value,
      expireAt: ttl ? Date.now() + ttl : null
    })
  }
}

// 配合请求使用
async function cachedFetch(url, ttl = 60000) {
  const cached = cache.get(url)
  if (cached) return cached
  const data = await fetch(url).then(r => r.json())
  cache.set(url, data, ttl)
  return data
}
\`\`\``,
    tags: ['缓存层', 'LRU', 'TTL', 'Map']
  },
  {
    id: 1048,
    title: '如何实现一个组件的按需加载？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个组件的按需加载？

**答案：**
使用 \`defineAsyncComponent\` + 动态 \`import()\`，配合 \`Suspense\` 显示加载状态。

\`\`\`vue
<template>
  <Suspense>
    <template #default>
      <AsyncHeavyChart :data="chartData" />
    </template>
    <template #fallback>
      <div class="loading-skeleton">图表加载中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncHeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSkeleton,
  errorComponent: ErrorFallback,
  delay: 200, // 延迟 200ms 再显示 loading
  timeout: 10000, // 超时时间
})
</script>
\`\`\`

Webpack/Vite 会自动将异步组件打包为独立 chunk，实现代码分割。`,
    tags: ['按需加载', 'defineAsyncComponent', 'Suspense', '代码分割']
  },
  {
    id: 1049,
    title: '如何实现一个前端水印？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个前端水印？

**答案：**
使用 Canvas 生成水印图片（用户名、时间），转为 base64 作为背景图，使用 MutationObserver 防止水印被删除。

\`\`\`javascript
function createWatermark(text) {
  const canvas = document.createElement('canvas')
  canvas.width = 300
  canvas.height = 200
  const ctx = canvas.getContext('2d')

  ctx.rotate(-20 * Math.PI / 180)
  ctx.font = '14px Arial'
  ctx.fillStyle = 'rgba(180, 180, 180, 0.3)'
  ctx.fillText(text, 50, 100)
  ctx.fillText(new Date().toLocaleDateString(), 50, 120)

  const watermarkDiv = document.createElement('div')
  watermarkDiv.style.cssText = \\\`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 99999;
    background: url(\\\${canvas.toDataURL()}) repeat;
  \\\`
  document.body.appendChild(watermarkDiv)

  // 防篡改：MutationObserver 监听
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.removedNodes.length) {
        for (const node of mutation.removedNodes) {
          if (node === watermarkDiv) {
            document.body.appendChild(watermarkDiv)
          }
        }
      }
    }
  })
  observer.observe(document.body, { childList: true })
}
\`\`\``,
    tags: ['水印', 'Canvas', 'MutationObserver', '防篡改']
  },
  {
    id: 1050,
    title: '如何实现一个 SSE 流式输出（类 ChatGPT 打字效果）？',
    category: '综合场景题',
    difficulty: 'medium',
    content: `## 如何实现一个 SSE 流式输出（类 ChatGPT 打字效果）？

**答案：**
\`\`\`javascript
// 方案一：EventSource（原生 SSE）
function streamChat(message) {
  const content = ref('')
  const es = new EventSource(\\\`/api/chat?message=\\\${encodeURIComponent(message)}\\\`)

  es.onmessage = (e) => {
    if (e.data === '[DONE]') { es.close(); return }
    content.value += JSON.parse(e.data).delta
  }
  es.onerror = () => es.close()
  return content
}

// 方案二：fetch + ReadableStream（支持 POST 请求）
async function streamChatFetch(message) {
  const content = ref('')
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: { 'Content-Type': 'application/json' }
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    // 解析 SSE 格式
    const lines = text.split('\\n').filter(line => line.startsWith('data: '))
    for (const line of lines) {
      const data = line.replace('data: ', '')
      if (data === '[DONE]') return
      content.value += JSON.parse(data).delta
    }
  }
  return content
}
\`\`\`

**追问：** 如何实现打字机效果的动画？

**答案：**
实际的 SSE 数据流已经是逐步到达的，天然具有打字效果。如果需要更平滑，可以将接收到的文本放入队列，用 requestAnimationFrame 逐字显示。`,
    tags: ['SSE', 'EventSource', 'ReadableStream', '流式输出', 'ChatGPT']
  },
]