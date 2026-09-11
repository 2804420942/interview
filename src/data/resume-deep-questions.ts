import type { Question } from './types'

export const resumeDeepQuestions: Question[] = [
  {
    id: 1101,
    title: '你在 QQ 运动首页实现骨架屏方案时，是如何设计骨架屏与真实内容的切换时机的？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['骨架屏', 'CLS', '加载优化', 'Kuikly'],
    content: `## 答案

骨架屏的切换时机设计是关键，不能简单地"数据返回就切换"，否则会出现闪烁。我的方案分三层：

### 第一层：立即展示缓存数据

页面初始化时，先读取客户端本地缓存（Kuikly 提供的本地存储 API），如果有缓存数据，直接渲染真实内容，跳过骨架屏。这是最优路径，用户感知不到任何加载过程。

### 第二层：骨架屏 + 并行请求

无缓存时展示骨架屏，同时发起接口请求。骨架屏的尺寸严格对齐真实内容的布局（通过设计稿标注的固定高度），避免切换时的 CLS（累积布局偏移）。

### 第三层：渐进式替换

数据返回后，不是整体替换，而是按模块渐进替换（先替换首屏可见区域，再替换折叠区域），配合 \`opacity: 0 → 1\` 的 200ms 过渡动画，视觉上更平滑。

**切换时机的精确控制：**

\`\`\`javascript
// 等待关键图片加载完成再切换，避免图片空白
async function switchFromSkeleton(data) {
  const criticalImages = data.banners.map(b => preloadImage(b.url));
  await Promise.race([
    Promise.all(criticalImages),
    timeout(1500) // 最多等 1.5s，超时也切换
  ]);
  showRealContent(data);
}
\`\`\`

### 追问：如果接口返回很快（< 100ms），骨架屏会出现闪烁，你是如何处理的？

这是骨架屏的经典问题，叫"骨架屏闪烁"（Skeleton Flash）。解决方案——**延迟显示骨架屏策略：**

\`\`\`javascript
let skeletonTimer = null;
let dataLoaded = false;

// 延迟 150ms 才显示骨架屏
skeletonTimer = setTimeout(() => {
  if (!dataLoaded) showSkeleton();
}, 150);

fetchData().then(data => {
  dataLoaded = true;
  clearTimeout(skeletonTimer);
  showRealContent(data);
});
\`\`\`

**原理：** 如果接口在 150ms 内返回，用户根本看不到骨架屏，直接展示真实内容。只有接口超过 150ms 才显示骨架屏，这个阈值是人眼感知延迟的临界点。`
  },
  {
    id: 1102,
    title: '你提到"建立完善的性能监控上报体系，覆盖 Kuikly 加载耗时"，请详细说明这套体系的架构设计。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['性能监控', '上报体系', 'Kuikly', '分位数统计'],
    content: `## 答案

这套体系分为**采集层、传输层、存储层、分析层**四个部分：

### 采集层 - 精确打点

\`\`\`javascript
class PerformanceTracker {
  private marks = new Map();

  mark(name) {
    this.marks.set(name, performance.now());
  }

  measure(name, start, end) {
    const duration = this.marks.get(end) - this.marks.get(start);
    return { name, duration, timestamp: Date.now() };
  }
}

// Kuikly 生命周期打点
tracker.mark('kuikly_js_start');      // JS Bundle 开始加载
tracker.mark('kuikly_js_end');        // JS Bundle 加载完成
tracker.mark('kuikly_render_start');  // 开始渲染
tracker.mark('kuikly_fcp');           // 首个内容绘制完成
tracker.mark('kuikly_lcp');           // 最大内容绘制完成
\`\`\`

### 关键指标定义

- \`js_load_time\`：JS Bundle 下载 + 解析时间
- \`render_time\`：从渲染开始到 FCP 的时间
- \`total_load_time\`：从页面进入到 LCP 的总时间
- \`ad_show_time\`：广告请求到展示的时间

### 传输层 - 批量上报

\`\`\`javascript
const queue = [];
function report(metric) {
  queue.push(metric);
  if (queue.length >= 10) flush();
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});
function flush() {
  if (!queue.length) return;
  navigator.sendBeacon('/monitor/perf', JSON.stringify(queue.splice(0)));
}
\`\`\`

### 分析层 - 分位数统计

不看平均值，看 P50/P75/P95 分位数。P95 代表最慢的 5% 用户的体验，是优化的重点。

### 追问：你如何区分"Kuikly 本身慢"和"网络慢"导致的加载耗时增加？

通过拆分指标来区分：
- \`networkTime = kuikly_js_end - kuikly_js_start\`（网络耗时）
- \`runtimeTime = kuikly_lcp - kuikly_js_end\`（运行时耗时）
- 同时上报 \`navigator.connection.effectiveType\`（网络类型）

按网络类型分组分析，区分是网络问题还是渲染问题。`
  },
  {
    id: 1103,
    title: '你在 AIGC 平台设计了多级审核流程，状态机是如何设计的？如何防止状态非法流转？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['状态机', '审核流程', '并发控制', '乐观锁'],
    content: `## 答案

### 状态定义（有限状态机）

\`\`\`typescript
enum AssetStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  OFFLINE = 'offline'
}

const VALID_TRANSITIONS = {
  draft: ['pending'],
  pending: ['reviewing', 'draft'],
  reviewing: ['approved', 'rejected'],
  approved: ['published', 'draft'],
  rejected: ['draft'],
  published: ['offline'],
  offline: ['published', 'draft']
};
\`\`\`

### 前端防止非法流转

\`\`\`typescript
function canTransition(current, target) {
  return VALID_TRANSITIONS[current]?.includes(target) ?? false;
}

// 操作按钮根据当前状态动态渲染
const availableActions = computed(() => {
  const actions = [];
  if (canTransition(asset.status, 'pending')) {
    actions.push({ label: '提交审核', target: 'pending' });
  }
  if (canTransition(asset.status, 'published') && isReviewer) {
    actions.push({ label: '通过并上架', target: 'published' });
  }
  return actions;
});
\`\`\`

**后端双重校验：** 前端的状态机只是 UI 层保护，后端同样维护状态流转表，接口层校验。

### 追问：审核员同时打开同一个素材进行审核，如何防止并发冲突？

采用**乐观锁 + 状态锁定**双重机制：

- **状态锁定：** 审核员打开素材时，将状态从 PENDING 改为 REVIEWING，记录锁定人和锁定时间
- **超时自动释放：** 锁定超过 30 分钟自动释放（后端定时任务），前端每 5 分钟心跳续期
- **乐观锁：** 提交审核结果时携带 version 字段，后端检查版本号是否匹配，不匹配返回 409 冲突`
  },
  {
    id: 1104,
    title: 'Canvas 主题预览中，你是如何计算"主题字体颜色"的？算法原理是什么？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Canvas', 'WCAG', '对比度算法', '颜色计算'],
    content: `## 答案

字体颜色计算的核心是**对比度算法**，确保文字在背景上清晰可读。

### 第一步：获取背景主色（区域采样）

\`\`\`javascript
function getDominantColor(canvas, region) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(region.x, region.y, region.width, region.height);
  const data = imageData.data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 16) { // 每隔4像素采样
    r += data[i]; g += data[i+1]; b += data[i+2];
    count++;
  }
  return { r: r/count, g: g/count, b: b/count };
}
\`\`\`

### 第二步：计算相对亮度（WCAG 标准）

\`\`\`javascript
function getRelativeLuminance({ r, g, b }) {
  const toLinear = c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
\`\`\`

### 第三步：计算对比度并选色

\`\`\`javascript
function getTextColor(bgColor) {
  const bgLuminance = getRelativeLuminance(bgColor);
  const whiteContrast = 1.05 / (bgLuminance + 0.05);
  const blackContrast = (bgLuminance + 0.05) / 0.05;
  if (whiteContrast >= blackContrast) return '#FFFFFF';
  return bgLuminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
}
\`\`\`

### 追问：如果背景是渐变图，文字跨越深色和浅色区域，如何处理？

解决方案是**文字描边 + 阴影**，而非单纯选择一种颜色。另外在文字背景区域叠加半透明蒙层（如 \`rgba(0,0,0,0.2)\`），确保文字在任何背景下都清晰可读，这也是 iOS 系统通知栏的常见做法。`
  },
  {
    id: 1105,
    title: '你的脚手架 publish 命令集成了 simple-git，请描述完整的发布流程和异常处理机制。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['脚手架', 'simple-git', '发布流程', '异常处理'],
    content: `## 答案

### 完整发布流程（9 个步骤）

1. 环境检查（Node版本、Git是否安装）
2. 读取项目配置（package.json、.clirc）
3. Git 状态检查（冲突、未提交修改）
4. 版本号确认（semver bump）
5. 本地构建（npm run build）
6. WebSocket 连接云构建服务
7. 上传文件到阿里云 OSS
8. 云端构建 + 部署
9. 发布成功通知

### 关键步骤的异常处理

\`\`\`javascript
async function checkGitStatus(git) {
  const status = await git.status();
  if (status.conflicted.length > 0) {
    throw new Error('存在未解决的冲突文件：' + status.conflicted.join(', '));
  }
  if (status.modified.length > 0) {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: \`有 \${status.modified.length} 个文件未提交，是否继续？\`,
      default: false
    }]);
    if (!confirm) process.exit(0);
  }
  await git.fetch();
  const behind = (await git.status()).behind;
  if (behind > 0) {
    throw new Error(\`本地分支落后远程 \${behind} 个提交，请先 git pull\`);
  }
}
\`\`\`

### WebSocket 断线重连与超时处理

\`\`\`javascript
const BUILD_TIMEOUT = 5 * 60 * 1000;
const buildPromise = new Promise((resolve, reject) => {
  ws.on('message', msg => {
    const { type, payload } = JSON.parse(msg);
    if (type === 'BUILD_SUCCESS') resolve(payload);
    if (type === 'BUILD_ERROR') reject(new Error(payload.message));
  });
});
await Promise.race([buildPromise, new Promise((_, reject) =>
  setTimeout(() => reject(new Error('构建超时')), BUILD_TIMEOUT)
)]);
\`\`\`

### 追问：如果发布过程中断，如何实现断点续传？

每次发布生成唯一的 publishId（基于 git commit hash）。上传 OSS 前检查已上传的文件列表，只上传未完成的文件。OSS 的分片上传本身支持断点续传。`
  },
  {
    id: 1106,
    title: '你实现了"前后端双校验权限方案"，请详细说明这套方案的设计思路和安全边界。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['权限管理', '动态路由', '安全边界', 'RBAC'],
    content: `## 答案

### 设计思路：前端控制体验，后端保障安全

前端权限架构：

1. 登录成功 → 获取用户信息 + 权限列表（后端返回）
2. Vuex 存储权限数据
3. 动态路由注入（addRoutes）
4. 导航守卫拦截（路由级权限）
5. 指令/组件控制（按钮级权限）

### 权限数据结构

\`\`\`typescript
interface UserPermission {
  routes: string[];        // 可访问的路由 path 列表
  actions: string[];       // 可执行的操作 ['user:create', 'user:delete']
  dataScope: 'all' | 'dept' | 'self'; // 数据权限范围
}
\`\`\`

### 安全边界说明

前端权限只做两件事：
- 隐藏无权限的菜单和按钮（用户体验）
- 拦截直接输入 URL 访问无权限页面（防止误操作）

用户可以通过 DevTools 修改 Vuex 数据、直接调用 API 绕过前端。所以后端每个接口都必须独立鉴权。

### 追问：权限变更后，前端如何实时感知并更新？

三种方案：
- **方案一：** 403 响应时强制重新登录
- **方案二：** 每 5 分钟轮询权限数据
- **方案三（推荐）：** WebSocket 推送权限变更通知，前端收到后重新获取权限并更新路由，如果当前页面权限被撤销则跳转首页`
  },
  {
    id: 1107,
    title: '你在决策引擎项目中实现了 ElementPlus 主题色动态替换，请说明完整实现方案和遇到的坑。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['ElementPlus', '主题色', 'CSS变量', 'tinycolor'],
    content: `## 答案

### 完整实现方案

\`\`\`javascript
import tinycolor from 'tinycolor2';

function generateColorPalette(primary) {
  const palette = {};
  // 生成 light 变体（混入白色）
  for (let i = 1; i <= 9; i++) {
    const lightColor = tinycolor.mix(primary, '#ffffff', i * 10);
    palette[\`--el-color-primary-light-\${i}\`] = lightColor.toHexString();
  }
  // 生成 dark 变体
  for (let i = 1; i <= 2; i++) {
    const darkColor = tinycolor.mix(primary, '#000000', i * 10);
    palette[\`--el-color-primary-dark-\${i}\`] = darkColor.toHexString();
  }
  return palette;
}

function changeTheme(newColor) {
  document.documentElement.style.setProperty('--el-color-primary', newColor);
  const palette = generateColorPalette(newColor);
  Object.entries(palette).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  localStorage.setItem('theme-color', newColor);
}
\`\`\`

### 遇到的坑

**坑 1：CSS 变量版本差异**
新版 ElementPlus（v2.2+）使用 CSS 变量，旧版使用硬编码颜色值，需要区分处理。

**坑 2：颜色格式不统一**
CSS 中颜色可能是 \`#409EFF\`、\`rgb(64,158,255)\` 等多种格式，需要统一处理。

### 追问：如何保证主题色刷新不丢失？

在 \`index.html\` 的 \`<head>\` 中内联脚本，在 CSS 加载之前设置 CSS 变量：

\`\`\`html
<script>
  const c = localStorage.getItem('theme-color');
  if (c) document.documentElement.style.setProperty('--el-color-primary', c);
</script>
\`\`\`

关键是要在 CSS 加载之前设置 CSS 变量，否则会出现先显示默认蓝色再切换到自定义颜色的闪烁。`
  },
  {
    id: 1108,
    title: '你实现了虚拟滚动处理万级数据，请说明 el-table-v2 的动态行列合并是如何实现的？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['虚拟滚动', 'el-table-v2', '行列合并', '性能优化'],
    content: `## 答案

\`el-table-v2\` 是虚拟化表格，不支持原生的 \`rowspan/colspan\`。需要在**数据层面**预计算合并信息。

### 预计算合并信息

\`\`\`typescript
function preprocessMerge(data) {
  const result = [...data];
  let i = 0;
  while (i < result.length) {
    let j = i + 1;
    while (j < result.length && result[j].category === result[i].category) {
      result[j]._isHidden = true;
      j++;
    }
    result[i]._rowSpan = j - i;
    i = j;
  }
  return result;
}
\`\`\`

### 自定义 Cell Renderer 实现合并效果

被合并的行不渲染内容，第一行撑开合并后的高度。

### 性能关键点

预计算在数据加载时执行一次（O(n)），渲染时直接读取预计算结果（O(1)），不影响虚拟滚动性能。

### 追问：万级数据的表格，除了虚拟滚动，还有哪些性能优化手段？

- **数据分片加载：** 先加载前 100 条，滚动到底部时加载下一批
- **搜索/过滤在服务端执行：** 前端不做全量 filter
- **列的懒渲染：** 横向虚拟滚动
- **避免响应式深度监听：** 使用 \`shallowRef\` 或 \`markRaw\`

\`\`\`javascript
const tableData = shallowRef([]); // 只监听数组引用变化
\`\`\``
  },
  {
    id: 1109,
    title: '你在 QQ 运动项目中负责跑步轨迹的实时构建与可视化，请说明技术实现细节。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['GPS轨迹', '卡尔曼滤波', '高德地图', '实时可视化'],
    content: `## 答案

### 数据流设计

GPS 传感器（每秒上报） → 卡尔曼滤波（平滑噪点） → 道路吸附（可选） → 轨迹点数组 → 高德地图 Polyline 渲染

### 卡尔曼滤波简化实现（平滑 GPS 噪点）

\`\`\`javascript
class GPSKalmanFilter {
  constructor() { this.accuracy = 0; }

  filter(lat, lng, accuracy, timestamp) {
    if (this.accuracy === 0) {
      this.accuracy = accuracy;
      this.lastLat = lat; this.lastLng = lng;
      this.lastTimestamp = timestamp;
      return [lat, lng];
    }
    const decay = 3;
    const elapsed = (timestamp - this.lastTimestamp) / 1000;
    this.accuracy = Math.sqrt(this.accuracy ** 2 + (decay * elapsed) ** 2);
    const weight = this.accuracy / (this.accuracy + accuracy);
    const filteredLat = weight * this.lastLat + (1 - weight) * lat;
    const filteredLng = weight * this.lastLng + (1 - weight) * lng;
    this.accuracy = 1 / (1/this.accuracy + 1/accuracy);
    this.lastLat = filteredLat; this.lastLng = filteredLng;
    this.lastTimestamp = timestamp;
    return [filteredLat, filteredLng];
  }
}
\`\`\`

### 增量更新轨迹

\`\`\`javascript
let polyline;
const pathPoints = [];
function addTrackPoint(lat, lng) {
  pathPoints.push([lat, lng]);
  if (!polyline) {
    polyline = new AMap.Polyline({ path: pathPoints, strokeColor: '#FF6B35' });
    map.add(polyline);
  } else {
    polyline.setPath(pathPoints);
  }
  map.setCenter([lng, lat]);
}
\`\`\`

### 追问：历史轨迹回放功能是如何实现的？

模拟 GPS 数据的时序播放，按实际时间间隔播放（除以速度倍率），支持 0.5x、1x、2x、4x 倍速，使用 setTimeout 递归调度。`
  },
  {
    id: 1110,
    title: '你在卫盈智信实现了"图片上传流程，支持自动旋转、裁剪和压缩"，请说明技术细节。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['图片上传', 'EXIF', 'Canvas压缩', 'OSS直传'],
    content: `## 答案

### 完整上传流程

用户选择图片 → 读取 EXIF 信息（获取旋转角度） → Canvas 绘制（应用旋转矫正） → cropperjs 裁剪 → Canvas 压缩 → 上传到阿里云 OSS → 返回 CDN URL

### EXIF 自动旋转

\`\`\`javascript
async function fixImageOrientation(file) {
  const orientation = await getExifOrientation(file);
  if (orientation <= 1) return file;
  const img = await loadImage(URL.createObjectURL(file));
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const rotationMap = { 3: 180, 6: 90, 8: -90 };
  const rotation = rotationMap[orientation] || 0;
  if (rotation === 90 || rotation === -90) {
    canvas.width = img.height; canvas.height = img.width;
  } else {
    canvas.width = img.width; canvas.height = img.height;
  }
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));
}
\`\`\`

### 压缩策略（自适应质量）

\`\`\`javascript
async function compressImage(blob, maxSizeKB = 500) {
  let quality = 0.9, compressed = blob;
  while (compressed.size > maxSizeKB * 1024 && quality > 0.3) {
    const img = await loadImage(URL.createObjectURL(compressed));
    const canvas = document.createElement('canvas');
    const maxDim = 1920;
    let { width, height } = img;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width *= ratio; height *= ratio;
    }
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    compressed = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
    quality -= 0.1;
  }
  return compressed;
}
\`\`\`

### 追问：直传 OSS 如何保证安全？

使用 STS 临时凭证（有效期 15 分钟），前端通过后端获取临时凭证后直接上传到 OSS。文件路径包含 userId 防止覆盖他人文件，后端验证路径合法性后才保存到数据库。`
  },
  {
    id: 1111,
    title: '你在 Lerna Monorepo 中"通过子进程调用充分利用多核 CPU"，请说明具体实现方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Monorepo', 'child_process', '多核并行', 'IPC'],
    content: `## 答案

Node.js 是单线程的，但可以通过 \`child_process\` 模块创建子进程，利用多核 CPU 并行执行任务。

### 并行构建方案

\`\`\`javascript
const { fork } = require('child_process');
const os = require('os');
const CONCURRENCY = Math.max(1, os.cpus().length - 1);

async function buildPackages(packages) {
  const results = [];
  for (let i = 0; i < packages.length; i += CONCURRENCY) {
    const batch = packages.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(pkg => buildPackage(pkg)));
    results.push(...batchResults);
  }
  return results;
}

function buildPackage(pkgPath) {
  return new Promise((resolve, reject) => {
    const child = fork('./build-worker.js', [pkgPath], {
      stdio: 'pipe',
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', d => stdout += d);
    child.stderr.on('data', d => stderr += d);
    child.on('exit', code => {
      if (code === 0) resolve({ pkg: pkgPath, stdout });
      else reject(new Error('构建失败: ' + stderr));
    });
    setTimeout(() => { child.kill(); reject(new Error('构建超时')); }, 300000);
  });
}
\`\`\`

### 追问：fork、spawn、exec 三种方式有什么区别？

| 方法 | 特点 | 适用场景 |
|------|------|---------|
| exec | 启动 shell 执行，缓冲输出，有大小限制 | 简单命令 |
| spawn | 直接启动进程，流式输出 | 长时间运行 |
| fork | spawn 的特殊形式，自动建立 IPC 通道 | Node.js 子进程通信 |

选择 fork 的原因：子进程也是 Node.js 脚本，自动建立 IPC 通道可双向通信，比 exec 更安全（不经过 shell）。`
  },
  {
    id: 1112,
    title: '你实现了"虚拟任务栈机制"用于移动端路由管理，请详细说明设计思路。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['移动端', '虚拟任务栈', '路由管理', 'JSBridge'],
    content: `## 答案

移动端的路由体验与 PC 端不同：移动端有"页面栈"的概念，Web 应用的 history 栈和移动端页面栈不一致会导致返回按钮行为异常。

### 虚拟任务栈设计

\`\`\`typescript
class VirtualTaskStack {
  private stack = [];

  push(page) {
    this.stack.push(page);
    sessionStorage.setItem('page_stack', JSON.stringify(this.stack));
  }

  pop() {
    const page = this.stack.pop();
    sessionStorage.setItem('page_stack', JSON.stringify(this.stack));
    return page;
  }

  canGoBack() { return this.stack.length > 1; }

  popTo(path) {
    const index = this.stack.findLastIndex(p => p.path === path);
    if (index >= 0) this.stack = this.stack.slice(0, index + 1);
  }
}
\`\`\`

### 与 Vue Router 集成

\`\`\`javascript
router.afterEach((to, from) => {
  if (to.meta.isBack) {
    taskStack.pop();
  } else {
    taskStack.push({ path: to.fullPath, query: to.query, state: {}, timestamp: Date.now() });
  }
});

// 拦截 App 的返回按钮
window.onAppBack = () => {
  if (taskStack.canGoBack()) router.back();
  else JSBridge.closeWebView();
};
\`\`\`

### 追问：如何保存和恢复页面的滚动位置？

离开页面时保存 \`scrollTop\` 到当前页面的 state 中，返回时通过 \`nextTick\` 恢复滚动位置，前进时滚动到顶部。`
  },
  {
    id: 1113,
    title: '你在 QQ 运动项目中"实现活动卡券占位显示功能"，请说明如何避免 CLS（累积布局偏移）。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['CLS', 'Core Web Vitals', '占位布局', 'PerformanceObserver'],
    content: `## 答案

CLS 是 Core Web Vitals 中衡量视觉稳定性的指标。卡券异步加载是导致 CLS 的典型场景——初始高度为 0，数据加载后突然撑开，导致下方内容移动。

### 解决方案：预留固定高度占位

骨架屏占位高度与真实卡券一致，如果实际数量少于预期，用空白填充保持高度一致。

### expectedCount 的来源

1. 从上次缓存中读取（最准确）
2. 从接口的 X-Expected-Count 响应头读取
3. 使用固定值（如 3 张）

### 图片导致的 CLS

\`\`\`css
.coupon-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
}
\`\`\`

### 追问：如何用 PerformanceObserver 监控 CLS 并上报？

\`\`\`javascript
let clsValue = 0;
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
});
observer.observe({ type: 'layout-shift', buffered: true });

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/monitor', JSON.stringify({
      metric: 'CLS', value: clsValue, url: location.href
    }));
  }
});
\`\`\``
  },
  {
    id: 1114,
    title: '你在 AIGC 平台"基于 AI 供需数据驱动模型自动生成生产任务"，前端如何展示 AI 生成进度？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['SSE', 'AI生成', '流式推送', '任务恢复'],
    content: `## 答案

AI 生成是耗时操作（通常 10-60 秒），需要实时反馈进度。

### 技术方案：SSE（Server-Sent Events）流式推送

\`\`\`javascript
function startAIGeneration(taskId) {
  const eventSource = new EventSource('/api/ai/generate/stream?taskId=' + taskId);
  eventSource.addEventListener('progress', e => {
    const { step, percent, message } = JSON.parse(e.data);
    updateProgress({ step, percent, message });
  });
  eventSource.addEventListener('result', e => {
    const { imageUrl, index } = JSON.parse(e.data);
    addGeneratedImage(imageUrl, index);
  });
  eventSource.addEventListener('done', e => {
    eventSource.close();
    showCompletionSummary(JSON.parse(e.data));
  });
  eventSource.onerror = () => {
    eventSource.close();
    showError('生成过程中断，请重试');
  };
}
\`\`\`

### 追问：如果用户关闭页面后重新打开，如何恢复正在进行的 AI 生成任务？

页面加载时检查 localStorage 中的 pending_ai_task，通过接口查询任务状态：running 则重连 SSE，completed 则展示结果，failed 则提示失败。`
  },
  {
    id: 1115,
    title: '你实现了"基于路由信息生成菜单数据源，结合 fuse.js 实现模糊搜索"，请说明搜索质量优化方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['fuse.js', '模糊搜索', '拼音搜索', '搜索高亮'],
    content: `## 答案

fuse.js 的默认配置搜索质量不够好，需要针对菜单搜索场景调优。

### 优化配置

\`\`\`javascript
const fuse = new Fuse(menuItems, {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'keywords', weight: 0.2 },
    { name: 'pinyin', weight: 0.1 }
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 1,
  includeScore: true,
  includeMatches: true
});
\`\`\`

### 拼音搜索支持

\`\`\`javascript
import pinyin from 'pinyin';
const menuItems = routes.map(route => ({
  title: route.meta.title,
  path: route.path,
  pinyin: pinyin(route.meta.title, { style: pinyin.STYLE_NORMAL }).flat().join(''),
  pinyinAbbr: pinyin(route.meta.title, { style: pinyin.STYLE_FIRST_LETTER }).flat().join('')
}));
\`\`\`

### 搜索结果高亮

通过 fuse.js 返回的 matches.indices 信息，在匹配位置插入 \`<mark>\` 标签。

### 追问：搜索性能如何优化？

- 索引预构建：应用初始化时构建一次
- 搜索结果缓存：Map 缓存最近 50 条查询
- 权限过滤：结果中过滤掉用户无权限的菜单`
  },
  {
    id: 1116,
    title: '你在 QQ 运动项目中"针对 iOS/Android 平台动画差异进行适配处理"，请举一个具体的差异案例。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['跨平台', '动画适配', 'GPU渲染', '性能分级'],
    content: `## 答案

### 案例：弹性滚动动画在 Android 上的卡顿问题

iOS 上流畅（60fps），Android 中端机上只有 30fps。

**问题根因：** Android 的 GPU 对多个属性同时动画（transform + opacity）的合成处理比 iOS 慢。

### 解决方案：设备性能分级

\`\`\`javascript
function getDevicePerformanceLevel() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  if (cores >= 8 && memory >= 6) return 'high';
  if (cores >= 4 && memory >= 3) return 'medium';
  return 'low';
}

const ANIMATION_CONFIG = {
  high: { duration: 400, hasSpring: true, hasBlur: true },
  medium: { duration: 300, hasSpring: true, hasBlur: false },
  low: { duration: 200, hasSpring: false, hasBlur: false }
};
\`\`\`

Android 使用简化动画（仅 opacity 过渡），iOS 使用完整弹性动画。

### 追问：如何建立自动化的跨平台动画测试？

- 帧率监控：requestAnimationFrame 统计 FPS，低于 50 上报
- 视觉回归测试：Playwright 录制关键帧截图对比
- 真机测试矩阵：覆盖 iOS/Android 高中低端设备`
  },
  {
    id: 1117,
    title: '你在决策引擎项目中实现了"拖拽构建决策表，集成基尼系数计算"，请说明基尼系数在决策树中的作用。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['决策树', '基尼系数', '数据驱动', '可视化'],
    content: `## 答案

**基尼系数（Gini Impurity）** 是决策树算法中评估特征分裂质量的指标，值越低说明分裂后子集越"纯净"。

**公式：** Gini(D) = 1 - Σ(p_i²)

### 在贷款决策中的应用

\`\`\`javascript
function calculateGini(data, condition) {
  const { trueSet, falseSet } = splitByCondition(data, condition);
  const total = data.length;
  const giniTrue = giniImpurity(trueSet);
  const giniFalse = giniImpurity(falseSet);
  return (trueSet.length / total) * giniTrue + (falseSet.length / total) * giniFalse;
}

function giniImpurity(data) {
  const total = data.length;
  if (total === 0) return 0;
  const approved = data.filter(d => d.result === 'approved').length;
  const pApproved = approved / total;
  const pRejected = (total - approved) / total;
  return 1 - (pApproved ** 2 + pRejected ** 2);
}
\`\`\`

### 追问：客服人员不懂机器学习，如何让他们理解基尼系数？

将技术指标转化为业务语言：不展示"基尼系数: 0.23"，而是展示"区分度: 高"。同时提供柱状图展示在该条件下通过/拒绝的分布情况。`
  },
  {
    id: 1118,
    title: '你在卫盈智信实现了"图片瀑布流布局与长列表加载"，请说明瀑布流的布局算法和性能优化。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['瀑布流', '贪心算法', '虚拟化', '懒加载'],
    content: `## 答案

### 瀑布流布局算法（贪心算法）

\`\`\`javascript
class WaterfallLayout {
  constructor(containerWidth, columnCount, gap = 12) {
    this.columnHeights = new Array(columnCount).fill(0);
    this.columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
    this.gap = gap;
  }

  addItem(imageHeight) {
    const minHeight = Math.min(...this.columnHeights);
    const columnIndex = this.columnHeights.indexOf(minHeight);
    const x = columnIndex * (this.columnWidth + this.gap);
    const y = minHeight + (minHeight > 0 ? this.gap : 0);
    this.columnHeights[columnIndex] = y + imageHeight;
    return { x, y, width: this.columnWidth, height: imageHeight };
  }

  getTotalHeight() { return Math.max(...this.columnHeights); }
}
\`\`\`

### 关键性能优化

- **图片高度预知：** 后端返回图片宽高信息，按列宽计算显示高度
- **虚拟化：** 只渲染可视区域内的图片（上下各预渲染 200px）
- **图片懒加载 + LQIP：** 先加载低质量预览图，再加载高清图

### 追问：瀑布流中如何处理图片加载失败？

显示占位图、保持预计算高度不变、重试机制（最多 2 次，指数退避）、上报错误。`
  },
  {
    id: 1119,
    title: '你在 QQ 运动项目中"建立完善的自测流程与监控机制"，请说明这套自测流程的具体内容。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['自测流程', '质量保障', '性能标准', 'Checklist'],
    content: `## 答案

### 自测流程分为四个维度

**1. 功能自测 Checklist**
- 核心功能：首页加载、骨架屏、卡券展示、跑步轨迹
- 边界情况：网络断开降级、数据为空、超长文本、图片加载失败
- 多端验证：iOS 最新版/低版本、Android 高端/中端机

**2. 性能自测**

\`\`\`javascript
const PERF_STANDARDS = {
  kuikly_load_time: 1500,  // < 1.5s
  fcp: 800,                // < 800ms
  ad_show_time: 2000       // < 2s
};
\`\`\`

**3. 动画流畅度自测**
使用 Xcode Instruments / Android Studio Profiler 录制帧率，关键动画保持 60fps。

**4. 监控告警验证**
故意触发错误确认监控平台能收到告警。

### 追问：如何量化"自测覆盖率"？

建立测试用例库，每次发版记录执行情况，P0 用例必须 100% 执行，否则禁止发版。`
  },
  {
    id: 1120,
    title: '你在卫盈智信实现了"高性能状态管理，通过内存级缓存使高频访问数据响应速度提升 40%"，请说明具体方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['状态管理', '内存缓存', 'LRU', '请求合并'],
    content: `## 答案

### 问题背景

客服人员频繁查询同一用户的信用评分、历史记录，每次都发接口请求，响应慢。

### 内存级缓存方案

\`\`\`javascript
// Vuex 中的缓存层
async function getUserData(userId) {
  // 1. 检查内存缓存
  const cached = userDataCache.get(userId);
  if (cached && cached.expireAt > Date.now()) return cached.data;

  // 2. 检查 localStorage 持久化缓存
  const persisted = localStorage.getItem('user_' + userId);
  if (persisted) {
    const { data, expireAt } = JSON.parse(persisted);
    if (expireAt > Date.now()) {
      userDataCache.set(userId, { data, expireAt });
      return data;
    }
  }

  // 3. 发起接口请求
  const data = await api.getUserData(userId);
  const expireAt = Date.now() + 5 * 60 * 1000; // 缓存5分钟
  userDataCache.set(userId, { data, expireAt });
  localStorage.setItem('user_' + userId, JSON.stringify({ data, expireAt }));
  return data;
}
\`\`\`

### 缓存失效策略

- 主动失效：用户数据更新后清除缓存
- 被动失效：读取时检查 expireAt
- 内存限制：LRU 策略，超过 100 条删除最旧的

### 追问：缓存穿透和缓存击穿如何处理？

- **缓存穿透：** 对不存在的数据也缓存空值（缓存时间短）
- **缓存击穿：** 请求合并——同一时间同一 userId 的多个请求只发一次接口

\`\`\`javascript
const pendingRequests = new Map();
async function getUserData(userId) {
  if (pendingRequests.has(userId)) return pendingRequests.get(userId);
  const promise = api.getUserData(userId).finally(() => pendingRequests.delete(userId));
  pendingRequests.set(userId, promise);
  return promise;
}
\`\`\``
  },
  {
    id: 1121,
    title: '你的脚手架通过 WebSocket 实现云构建实时日志推送，请说明 WebSocket 的消息协议设计。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['WebSocket', '云构建', '消息协议', '断线重连'],
    content: `## 答案

### 消息协议设计

\`\`\`javascript
// 统一消息格式
const MessageType = {
  LOG: 'log',           // 构建日志
  PROGRESS: 'progress', // 进度更新
  ERROR: 'error',       // 错误信息
  COMPLETE: 'complete'  // 构建完成
};

// 消息结构
{
  type: MessageType,
  timestamp: Date.now(),
  payload: {
    level: 'info' | 'warn' | 'error',
    message: string,
    percent: number  // 仅 progress 类型
  }
}
\`\`\`

### 断线重连机制

\`\`\`javascript
class ReconnectableWebSocket {
  constructor(url, maxRetries = 5) {
    this.url = url;
    this.retries = 0;
    this.maxRetries = maxRetries;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onclose = () => {
      if (this.retries < this.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, this.retries), 30000);
        setTimeout(() => { this.retries++; this.connect(); }, delay);
      }
    };
    this.ws.onopen = () => { this.retries = 0; };
  }
}
\`\`\`

### 终端日志展示

使用 ora 库在终端显示 spinner + 实时日志，不同 level 用不同颜色区分。`
  },
  {
    id: 1122,
    title: '你实现了"国际化方案与语言包管理"，请说明在 Vue 项目中的完整实现。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['国际化', 'vue-i18n', '语言包', 'Intl API'],
    content: `## 答案

### 技术栈：vue-i18n + 按模块懒加载

\`\`\`javascript
import { createI18n } from 'vue-i18n';
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': () => import('./locales/zh-CN.json'),
    'en-US': () => import('./locales/en-US.json')
  }
});
\`\`\`

### 语言包管理策略

- 按模块拆分语言包，减少初始加载体积
- 公共文案（按钮、提示）放在全局包
- 页面级文案按路由懒加载

### 日期/数字格式化

\`\`\`javascript
// 使用 Intl API
const formatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: locale === 'zh-CN' ? 'CNY' : 'USD'
});
formatter.format(1234.5); // ¥1,234.50 或 $1,234.50
\`\`\`

### 追问：如何处理动态内容的国际化（如后端返回的数据）？

后端返回多语言字段（如 \`{ name_zh: '用户', name_en: 'User' }\`），前端根据当前语言选择对应字段。`
  },
  {
    id: 1123,
    title: '你在卫盈智信"主导 Vuex 模块化架构重构"，请说明重构过程和遇到的挑战。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Vuex', '模块化', '架构重构', '渐进式迁移'],
    content: `## 答案

### 重构背景

原有 Vuex 是一个巨大的 store 文件（2000+ 行），所有状态混在一起，维护困难。

### 重构方案：按业务域拆分模块

\`\`\`
store/
├── index.ts          // 根 store
├── modules/
│   ├── user.ts       // 用户模块
│   ├── permission.ts // 权限模块
│   ├── decision.ts   // 决策引擎模块
│   └── asset.ts      // 素材管理模块
\`\`\`

### 渐进式迁移策略

不是一次性重构，而是分阶段：
1. 新功能直接用模块化方式编写
2. 每次修改旧功能时，顺便将相关状态迁移到对应模块
3. 最后清理根 store 中的遗留代码

### 遇到的挑战

- **命名空间冲突：** 使用 \`namespaced: true\` 后，所有调用方都需要加模块前缀
- **跨模块通信：** 通过 \`rootGetters\` 和 \`rootState\` 访问其他模块
- **Git 冲突：** 拆分文件后，多人同时修改同一模块的概率降低

### 追问：如果现在重做，会选 Pinia 还是 Vuex？

选 Pinia——更简洁的 API、天然 TypeScript 支持、不需要 mutations。`
  },
  {
    id: 1124,
    title: '你提到"快速上手 NTCompose 并完成跨端开发"，请说明你的学习方法论和跨端适配策略。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['跨端开发', '学习方法', 'NTCompose', '平台适配'],
    content: `## 答案

### 快速上手方法论

1. **先跑通官方 Demo：** 理解框架的基本运行机制和构建流程
2. **对比已知框架：** NTCompose 类似 Jetpack Compose，与 Vue 的响应式模型对比学习
3. **从小功能入手：** 先实现一个简单的列表页，逐步添加交互
4. **阅读源码关键路径：** 理解渲染管线、事件传递机制

### 跨端适配策略

\`\`\`javascript
// 平台适配层
const platformAdapter = {
  ios: {
    safeAreaTop: 44,
    scrollBehavior: 'smooth',
    hapticFeedback: true
  },
  android: {
    safeAreaTop: 24,
    scrollBehavior: 'auto',
    hapticFeedback: false
  }
};

function getPlatformConfig() {
  const platform = detectPlatform();
  return platformAdapter[platform];
}
\`\`\`

### 追问：跨端开发中最常见的坑是什么？

- 字体渲染差异：iOS 和 Android 的默认字体不同，需要指定统一字体
- 滚动行为差异：iOS 有弹性滚动，Android 没有
- 键盘弹起布局：iOS 和 Android 对软键盘的处理方式不同`
  },
  {
    id: 1125,
    title: '你在 QQ 运动项目中优化了"广告展示耗时"，请说明优化方案和效果。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['广告优化', 'SDK预加载', '超时控制', '降级方案'],
    content: `## 答案

### 广告展示耗时拆解

广告展示耗时 = SDK 初始化 + 广告请求 + 素材下载 + 渲染展示

### 优化方案

**1. SDK 预加载（最大优化项）**

\`\`\`javascript
// 在页面 idle 时预加载广告 SDK
requestIdleCallback(() => {
  preloadAdSDK();
});
// 或者在用户操作间隙预加载
document.addEventListener('touchend', () => {
  if (!adSDKLoaded) preloadAdSDK();
}, { once: true });
\`\`\`

**2. 广告位预请求**

\`\`\`javascript
// 进入页面时立即请求广告数据（不等用户滚动到广告位）
const adPromise = fetchAd(adSlotId);
// 当广告位进入可视区域时，直接使用已请求的数据
onAdSlotVisible(() => {
  adPromise.then(renderAd);
});
\`\`\`

**3. 超时控制 + 降级方案**

\`\`\`javascript
const AD_TIMEOUT = 3000;
const adResult = await Promise.race([
  fetchAd(adSlotId),
  new Promise((_, reject) => setTimeout(() => reject(new Error('广告超时')), AD_TIMEOUT))
]).catch(() => {
  // 超时或失败时显示默认运营位
  return getDefaultBanner();
});
\`\`\`

### 优化效果

- SDK 预加载：初始化时间从 800ms 降到 0ms
- 广告预请求：整体展示耗时从 2.5s 降到 1.2s
- 超时降级：保证用户最多等待 3s，降级率 < 2%`
  },
]
