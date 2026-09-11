import type { Question } from './types'

export const resumeDeepQuestions2: Question[] = [
  {
    id: 1126,
    title: 'Kuikly 框架的渲染原理是什么？与 Flutter 和 React Native 有什么本质区别？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Kuikly', '跨端框架', '原生渲染', 'KMP'],
    content: `## 答案

Kuikly 是腾讯基于 **Kotlin Multiplatform（KMP）** 技术的跨端开发框架，与 Flutter、React Native 在渲染架构上有本质不同。

### 三大框架渲染原理对比

| 框架 | 渲染方式 | 语言 | 产物 |
|------|---------|------|------|
| **Flutter** | 自绘引擎（Skia/Impeller） | Dart | 像素级渲染，不依赖原生控件 |
| **React Native** | JS Bridge 驱动原生控件 | JavaScript | 映射到原生 View |
| **Kuikly** | 编译为原生产物 + 原生控件渲染 | Kotlin | Android .aar / iOS .framework |

### Kuikly 的核心优势

**1. 编译为原生产物：**
- Android 端编译为 \`.aar\`（Dex 字节码），直接运行在 ART 虚拟机上
- iOS 端通过 KMP 编译为原生 \`.framework\`
- 不需要 JS Bridge，没有通信开销

**2. 原生控件渲染：**
Kuikly 使用各平台的原生 UI 控件（如 Android 的 View、iOS 的 UIView），而非自绘。这意味着：
- 动画跟手性与原生一致
- 无障碍功能天然支持
- 平台视觉风格天然适配

**3. 框架体积极小：**
- Android 端增量约 300KB
- iOS 端约 1.2MB
- 远小于 Flutter 引擎（约 4MB+）

### 在 QQ 运动中的实际体验

在 QQ 运动首页的开发中，使用 Kuikly 可以实现与原生几乎无差别的滚动流畅度和动画体验，特别是在列表滚动和手势交互方面，比我之前用 React Native 的项目体验好很多。

### 追问：Kuikly 支持动态化更新吗？如果线上出了 Bug 能热修复吗？

**答案：**
Kuikly 支持一定程度的动态化：
- **Android 端**：可以通过 Dex 动态下发实现热更新
- **iOS 端**：支持 JS 动态更新方案（因为 Apple 不允许原生代码动态下发）
- 但动态化能力不如 React Native 灵活（RN 天然就是 JS Bundle 下发）
- 实际项目中，我们对关键业务逻辑做了降级方案：如果 Kuikly 页面加载失败，自动降级到 H5 页面`
  },
  {
    id: 1127,
    title: 'NTCompose 与 Jetpack Compose 的 API 兼容度如何？你是如何从 Vue 思维切换到声明式 UI 的？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['NTCompose', 'Jetpack Compose', '声明式UI', '思维转换'],
    content: `## 答案

NTCompose 是腾讯内部的声明式 UI 框架，API 设计大量参考了 Jetpack Compose，但针对腾讯内部场景做了定制化。

### NTCompose vs Jetpack Compose

| 特性 | Jetpack Compose | NTCompose |
|------|----------------|-----------|
| 语言 | Kotlin | Kotlin |
| 状态管理 | remember/mutableStateOf | 类似机制 |
| 布局 | Column/Row/Box | 兼容 + 扩展组件 |
| 主题 | MaterialTheme | 自定义主题系统 |
| 平台 | Android | Android + iOS + 鸿蒙 |

### 从 Vue 到声明式 UI 的思维转换

**Vue 的响应式思维：**
\`\`\`javascript
// Vue：模板 + 响应式数据 → 自动更新 DOM
const count = ref(0)
// template: <div>{{ count }}</div>
\`\`\`

**NTCompose 的声明式思维：**
\`\`\`kotlin
// NTCompose：函数描述 UI → 状态变化自动重组
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    Column {
        Text("Count: $count")
        Button(onClick = { count++ }) { Text("Add") }
    }
}
\`\`\`

### 最大的思维差异

1. **Vue 是模板驱动**：HTML 模板中嵌入指令（v-if、v-for），编译器处理
2. **Compose 是函数驱动**：UI 是纯函数的返回值，条件渲染就是 if/else

我的适应策略是**类比学习**：
- \`ref()\` → \`mutableStateOf()\`
- \`computed()\` → \`derivedStateOf()\`
- \`watch()\` → \`LaunchedEffect()\`
- \`v-if\` → Kotlin \`if/else\`
- \`v-for\` → \`LazyColumn { items() }\`

### 追问：NTCompose 中遇到的最大坑是什么？

**答案：**
**重组（Recomposition）性能问题。** Compose 中状态变化会触发包含该状态的 Composable 函数重新执行。如果不注意，一个顶层状态变化会导致整棵 UI 树重组。

解决方案：
- 将状态下沉到最小的 Composable 中
- 使用 \`remember\` 缓存计算结果
- 对列表使用 \`key\` 参数避免不必要的重组
- 用 Layout Inspector 工具检测重组次数`
  },
  {
    id: 1128,
    title: '你在 Node 端使用 Canvas 实现主题预览，请详细描述从 ZIP 解压到最终合成图的完整流程。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Node Canvas', 'sharp', '图层合成', 'ZIP解压'],
    content: `## 答案

这是 AIGC 平台中主题预览功能的核心实现，整个流程在 **Node.js 服务端**完成，而非浏览器端。

### 完整流程

\`\`\`
后台传入 ZIP 文件
  → 1. 解压 ZIP 获取素材文件
  → 2. 解析配置文件（确定图层顺序和位置）
  → 3. 分析三联图计算主题字体颜色
  → 4. 按图层顺序叠加渲染
  → 5. 绘制文字（使用计算出的颜色）
  → 6. 导出合成图
\`\`\`

### 1. ZIP 解压

\`\`\`javascript
const AdmZip = require('adm-zip');
const path = require('path');

async function extractThemeAssets(zipBuffer) {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();
  const assets = {};

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const ext = path.extname(entry.entryName).toLowerCase();
    if (['.png', '.jpg', '.webp'].includes(ext)) {
      assets[entry.entryName] = entry.getData(); // Buffer
    } else if (entry.entryName.endsWith('config.json')) {
      assets.config = JSON.parse(entry.getData().toString());
    }
  }
  return assets;
}
\`\`\`

### 2. 三联图计算字体颜色

三联图是主题的背景图，需要根据背景的明暗度来决定文字使用白色还是深色。

\`\`\`javascript
const { createCanvas, loadImage } = require('canvas');

async function calculateTextColor(imageBuffer) {
  const img = await loadImage(imageBuffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // 对文字区域采样（通常是顶部状态栏和底部导航栏区域）
  const regions = [
    { x: 0, y: 0, w: img.width, h: img.height * 0.1 },        // 顶部 10%
    { x: 0, y: img.height * 0.85, w: img.width, h: img.height * 0.15 } // 底部 15%
  ];

  let totalLuminance = 0;
  let sampleCount = 0;

  for (const region of regions) {
    const imageData = ctx.getImageData(region.x, region.y, region.w, region.h);
    const data = imageData.data;
    // 每隔 8 像素采样一次，提高性能
    for (let i = 0; i < data.length; i += 32) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // WCAG 相对亮度公式
      const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
      totalLuminance += luminance;
      sampleCount++;
    }
  }

  const avgLuminance = totalLuminance / sampleCount;
  // 亮度 > 0.5 用深色文字，否则用白色文字
  return avgLuminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
}

function toLinear(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
\`\`\`

### 3. 图层叠加合成

\`\`\`javascript
async function compositeTheme(assets, textColor) {
  const config = assets.config;
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');

  // 按图层顺序渲染（从底层到顶层）
  for (const layer of config.layers) {
    const imgBuffer = assets[layer.file];
    if (!imgBuffer) continue;
    const img = await loadImage(imgBuffer);
    ctx.globalAlpha = layer.opacity ?? 1;
    ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
  }

  // 绘制文字（使用计算出的颜色）
  ctx.globalAlpha = 1;
  ctx.fillStyle = textColor;
  ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  // 模拟状态栏时间
  ctx.fillText('12:30', canvas.width / 2, 32);

  return canvas.toBuffer('image/png');
}
\`\`\`

### 追问：处理大量主题预览图生成时，如何保证性能？

**答案：**
1. **Worker 线程池**：使用 \`worker_threads\` 创建线程池，避免阻塞主线程
2. **Canvas 复用**：不每次 new Canvas，而是复用实例并 clearRect
3. **图片缓存**：相同素材的 Image 对象缓存，避免重复解码
4. **并发控制**：使用 p-limit 限制同时处理的数量（CPU 核心数 - 1）
5. **流式返回**：生成完一张立即返回，不等全部完成`
  },
  {
    id: 1129,
    title: '你在 Kuikly 中实现了"监听页面退出事件自动暂停所有动画"，请说明具体实现方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Kuikly', '生命周期', '动画管理', '内存优化'],
    content: `## 答案

QQ 运动首页有多个动画元素（轮播、进度条、活动卡片动效），如果用户切换到其他页面但不销毁当前页面，动画继续执行会白白消耗 CPU 和内存。

### 页面生命周期监听

在 Kuikly 中，页面的可见性变化通过框架提供的生命周期钩子监听：

\`\`\`kotlin
// Kuikly 生命周期
override fun onPageVisible() {
    // 页面可见，恢复动画
    AnimationManager.resumeAll()
}

override fun onPageInvisible() {
    // 页面不可见，暂停动画
    AnimationManager.pauseAll()
}
\`\`\`

但实际比这复杂——因为动画可能分布在多个组件中，不能在每个组件里单独写暂停逻辑。

### 统一动画管理器

\`\`\`javascript
class AnimationManager {
  private static animations = new Set();
  private static isPaused = false;

  static register(animation) {
    this.animations.add(animation);
    // 如果当前页面已经不可见，注册时就暂停
    if (this.isPaused) animation.pause();
  }

  static unregister(animation) {
    animation.cancel();
    this.animations.delete(animation);
  }

  static pauseAll() {
    this.isPaused = true;
    for (const anim of this.animations) {
      anim.pause();
    }
  }

  static resumeAll() {
    this.isPaused = false;
    for (const anim of this.animations) {
      anim.resume();
    }
  }

  // 页面销毁时清理所有动画
  static disposeAll() {
    for (const anim of this.animations) {
      anim.cancel();
    }
    this.animations.clear();
    this.isPaused = false;
  }
}
\`\`\`

### 定时器也需要管理

除了动画，还有定时器（轮播自动播放、倒计时等）：

\`\`\`javascript
class TimerManager {
  private static timers = new Map();

  static setInterval(callback, interval, key) {
    const id = setInterval(callback, interval);
    this.timers.set(key, { id, callback, interval, type: 'interval' });
    return key;
  }

  static pauseAll() {
    for (const [key, timer] of this.timers) {
      clearInterval(timer.id);
    }
  }

  static resumeAll() {
    for (const [key, timer] of this.timers) {
      timer.id = setInterval(timer.callback, timer.interval);
    }
  }
}
\`\`\`

### 追问：如何验证动画暂停后确实减少了 CPU 消耗？

**答案：**
- **Android**：通过 Android Studio Profiler 查看 CPU 使用率，暂停前后对比
- **iOS**：通过 Xcode Instruments 的 Time Profiler 对比
- **数据上报**：在暂停/恢复事件中上报时间戳，后台统计平均暂停时长，计算节省的资源
- 实测结果：暂停后 CPU 占用从 15-20% 降到 2-3%（idle 状态）`
  },
  {
    id: 1130,
    title: '无极低代码平台搭建 AIGC 系统，你是如何处理低代码平台的局限性的？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['低代码', '无极平台', '自定义组件', '扩展性'],
    content: `## 答案

无极是腾讯内部的低代码平台，虽然拖拽搭建效率高，但在实现复杂业务逻辑时会遇到平台能力不足的情况。

### 遇到的典型局限性

**1. 复杂表单联动：**
无极的表单组件只支持简单的显隐联动，但 AIGC 平台的素材生产流程需要多级联动（选择素材类型 → 动态切换生产参数 → 根据参数校验规则）。

**解决方案：自定义组件注入**
\`\`\`javascript
// 在无极平台中注册自定义组件
wuji.registerComponent('aigc-production-form', {
  props: {
    assetType: String,
    productionConfig: Object
  },
  template: \`<div id="aigc-form"></div>\`,
  mounted() {
    // 挂载自己的 Vue 组件
    const app = createApp(AIGCProductionForm, {
      assetType: this.assetType,
      config: this.productionConfig
    });
    app.mount('#aigc-form');
  }
});
\`\`\`

**2. 审核流程的状态流转：**
无极的流程引擎不支持我们需要的多分支审核流程（评级 → 不同级别走不同审核路径）。

**解决方案：前端自己实现状态机，无极只做页面容器**
\`\`\`javascript
// 将复杂业务逻辑放在自定义 JS 中
// 无极页面只负责数据展示和基础交互
const stateMachine = {
  transitions: {
    'draft->pending': { guard: validateDraft },
    'pending->reviewing': { guard: checkReviewer },
    'reviewing->approved': { guard: checkApproval },
    'reviewing->rejected': { action: notifyDesigner }
  }
};
\`\`\`

**3. Canvas 预览功能：**
无极没有 Canvas 组件，需要完全自定义。

**解决方案：** 将 Canvas 预览封装为独立的自定义组件，通过 PostMessage 与无极页面通信。

### 经验总结

低代码平台适合**标准化的管理后台页面**（列表、详情、简单表单），但对于**复杂业务逻辑**，最好的方式是：
- 页面框架用低代码搭建（导航、布局、列表、基础交互）
- 核心业务逻辑用自定义组件或自定义 JS 实现
- 不要强行用低代码实现所有功能，那样反而比直接写代码更慢

### 追问：如果让你重新选型，你还会选低代码平台吗？

**答案：**
会，但会更清晰地划分边界：
- **用低代码**：管理后台的 CRUD 页面、数据报表、审核列表
- **不用低代码**：Canvas 预览、复杂表单联动、AI 任务流管理
- 关键是评估项目中"标准化页面"和"定制化页面"的比例，如果标准化占 60% 以上，低代码就有价值`
  },
  {
    id: 1131,
    title: '你在 AIGC 平台实现了"AI 全自动生产→自动流转至审核→产品决策上架"，请描述这个自动化闭环。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['自动化闭环', 'AI生产', '审核流程', '调度系统'],
    content: `## 答案

这套系统实现了从 AI 自动生成素材到上架 QQ 个性化商城的全流程自动化。

### 全流程架构

\`\`\`
AI供需数据 → 生产调度 → AI生成素材 → 质量检测 → 自动审核 → 人工终审 → 天权平台上架 → 数据监控
\`\`\`

### 1. 供需数据驱动

产品人员通过配置面板设置每周生产策略：

\`\`\`javascript
// 生产策略配置
{
  weekly_target: 100,           // 每周生产目标
  category_distribution: {
    theme: 0.4,                 // 主题 40%
    avatar_pendant: 0.3,        // 头像挂件 30%
    bubble: 0.2,                // 气泡 20%
    icon: 0.1                   // Icon 10%
  },
  style_preferences: ['简约', '二次元', '节日'],
  auto_mode: true,              // 全自动模式开关
  auto_review_threshold: 0.85   // AI评分 > 0.85 自动通过
}
\`\`\`

### 2. AI 生成任务自动创建

\`\`\`javascript
// 定时任务：根据策略自动创建生产任务
async function createAutoTasks(strategy) {
  const gap = strategy.weekly_target - getCurrentWeekProduction();
  if (gap <= 0) return;

  // 按品类分配数量
  for (const [category, ratio] of Object.entries(strategy.category_distribution)) {
    const count = Math.ceil(gap * ratio);
    // 调用 AI 关键词生成服务
    const keywords = await aiService.generateKeywords(category, count, strategy.style_preferences);
    // 批量创建生产任务
    for (const keyword of keywords) {
      await createProductionTask({
        category, keyword,
        auto_generated: true,
        pipeline: getProductionPipeline(category)
      });
    }
  }
}
\`\`\`

### 3. 生产流水线（以主题为例）

\`\`\`
AI生成主图 → AI生成三联图 → 选择三联图 → AI生成动图/扩图 
→ AI生成Icon → AI生成气泡 → 图层合成预览 → 质量评分 → 审核
\`\`\`

每个步骤的状态通过 SSE 实时推送到前端：

\`\`\`javascript
// 前端监听生产进度
const evtSource = new EventSource('/api/production/stream/' + taskId);
evtSource.addEventListener('step_complete', (e) => {
  const { step, result, score } = JSON.parse(e.data);
  updatePipelineUI(step, result, score);
});
\`\`\`

### 4. 自动审核 + 人工终审

\`\`\`javascript
// AI 评分 > 阈值：自动流转到终审
// AI 评分 < 阈值：自动打回重新生成
async function autoReview(asset) {
  const score = await aiService.evaluateQuality(asset);
  if (score >= strategy.auto_review_threshold) {
    await asset.transitionTo('pending_final_review');
    notifyReviewer(asset);
  } else {
    await asset.transitionTo('regenerating');
    await regenerateAsset(asset, { feedback: score.details });
  }
}
\`\`\`

### 追问：全自动模式下如何保证上架素材的质量？

**答案：**
多重质量保障：
1. **AI 质量评分**：对比度、清晰度、美学评分
2. **规则校验**：分辨率、文件大小、格式规范
3. **人工终审兜底**：即使 AI 评分通过，最终仍需产品人员确认才上架
4. **数据反馈**：上架后监控用户下载率、评分，低质量素材自动下架`
  },
  {
    id: 1132,
    title: '你打通了"生产系统与天权平台数据通道"实现自动上架，请说明系统间对接的技术方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['系统对接', '数据通道', 'API网关', '幂等性'],
    content: `## 答案

天权平台是 QQ 个性化装扮的管理后台，AIGC 生产系统生成的素材需要同步到天权平台才能展示在 QQ 客户端。

### 对接架构

\`\`\`
AIGC 生产系统
    ↓ (审核通过)
素材数据打包（图片 + 元数据）
    ↓
调用天权平台 API
    ↓
天权平台入库 + CDN 分发
    ↓
QQ 客户端拉取展示
\`\`\`

### 数据同步方案

\`\`\`javascript
async function publishToTianquan(asset) {
  // 1. 上传素材文件到 CDN
  const fileUrls = {};
  for (const [key, file] of Object.entries(asset.files)) {
    fileUrls[key] = await uploadToCDN(file);
  }

  // 2. 构造天权平台要求的数据格式
  const payload = {
    asset_id: asset.id,
    category: mapCategory(asset.category), // 映射到天权平台的品类编码
    name: asset.name,
    resources: fileUrls,
    metadata: {
      designer: asset.designer,
      ai_generated: asset.auto_generated,
      quality_score: asset.quality_score,
      tags: asset.tags
    },
    // 幂等键，防止重复上架
    idempotency_key: \`aigc_\${asset.id}_\${asset.version}\`
  };

  // 3. 调用天权 API（带重试机制）
  const result = await retryWithBackoff(
    () => tianquanAPI.publish(payload),
    { maxRetries: 3, baseDelay: 1000 }
  );

  // 4. 更新本地状态
  await asset.updateStatus('published', { tianquan_id: result.id });
  
  // 5. 触发数据监控
  reportPublishMetrics(asset, result);
}
\`\`\`

### 幂等性保证

\`\`\`javascript
// 重试机制 + 幂等键，确保不会重复上架
async function retryWithBackoff(fn, { maxRetries, baseDelay }) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries) throw error;
      // 如果是"已存在"错误，说明上次已成功，直接返回
      if (error.code === 'DUPLICATE_ENTRY') {
        return await tianquanAPI.getByIdempotencyKey(error.idempotency_key);
      }
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
}
\`\`\`

### 前端展示同步状态

\`\`\`javascript
// 实时展示上架进度
function renderPublishStatus(asset) {
  const statusMap = {
    'publishing': { text: '上架中...', icon: 'loading', color: 'blue' },
    'published': { text: '已上架', icon: 'check', color: 'green' },
    'publish_failed': { text: '上架失败', icon: 'error', color: 'red', action: 'retry' },
    'syncing': { text: '同步CDN中...', icon: 'loading', color: 'orange' }
  };
  return statusMap[asset.publishStatus];
}
\`\`\`

### 追问：如果天权平台 API 不稳定，上架失败率高怎么办？

**答案：**
1. **消息队列**：不直接调 API，而是投递到消息队列（如 Kafka），由消费者异步处理，失败自动重试
2. **补偿机制**：定时任务扫描"上架中"超过 10 分钟的素材，自动重新尝试
3. **降级方案**：天权 API 完全不可用时，素材暂存本地，恢复后批量同步
4. **监控告警**：上架失败率超过 5% 自动告警`
  },
  {
    id: 1133,
    title: '你在 AIGC 平台"建立数据监控体系，统计各环节耗时、审核通过率、AI 自动生产成功率"，请说明前端的数据可视化方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['数据监控', 'ECharts', '可视化', '运营指标'],
    content: `## 答案

AIGC 平台的数据监控看板是产品人员和管理层了解系统运行状况的关键工具。

### 核心指标设计

**效率指标：**
- 各环节平均耗时（主图生成、三联图生成、审核时间）
- 端到端生产耗时（从任务创建到上架完成）
- 日/周产出量趋势

**质量指标：**
- AI 自动生产成功率（一次通过率）
- 人工审核通过率
- 上架后用户下载率 / 好评率
- 各品类质量评分分布

**AI 模型指标：**
- 不同关键词的生成质量对比
- 各风格的成功率
- 重新生成次数分布

### ECharts 可视化方案

\`\`\`javascript
// 生产效率漏斗图
function renderProductionFunnel(data) {
  return {
    series: [{
      type: 'funnel',
      data: [
        { value: data.total_tasks, name: '任务创建' },
        { value: data.ai_generated, name: 'AI生成完成' },
        { value: data.quality_passed, name: '质量检测通过' },
        { value: data.review_passed, name: '审核通过' },
        { value: data.published, name: '成功上架' }
      ],
      label: {
        formatter: '{b}: {c} ({d}%)'
      }
    }]
  };
}

// 各环节耗时分布（箱线图）
function renderTimeDistribution(data) {
  return {
    xAxis: { type: 'category', data: ['主图生成', '三联图', '审核', '上架'] },
    series: [{
      type: 'boxplot',
      data: data.map(d => [d.min, d.q1, d.median, d.q3, d.max])
    }]
  };
}

// 日产出量趋势（面积图）
function renderDailyProduction(data) {
  return {
    xAxis: { type: 'category', data: data.dates },
    series: [
      { name: '主题', type: 'line', areaStyle: {}, data: data.themes },
      { name: '头像挂件', type: 'line', areaStyle: {}, data: data.pendants },
      { name: '气泡', type: 'line', areaStyle: {}, data: data.bubbles }
    ]
  };
}
\`\`\`

### 实时数据更新

\`\`\`javascript
// 轮询 + 增量更新
let lastUpdateTime = 0;
async function refreshDashboard() {
  const data = await api.get('/dashboard/metrics', {
    params: { since: lastUpdateTime }
  });
  lastUpdateTime = Date.now();
  // 增量更新图表，而非全量重绘
  charts.forEach(chart => chart.appendData(data));
}
// 每 30 秒刷新一次
setInterval(refreshDashboard, 30000);
\`\`\`

### 追问：产品人员反馈看板数据太多看不过来，你怎么优化？

**答案：**
1. **分层展示**：概览页只展示 3-5 个核心指标（大数字卡片），详情页展示完整数据
2. **异常高亮**：正常指标灰色展示，异常指标（如成功率低于 80%）红色高亮
3. **智能摘要**：每天早上自动生成数据报告推送到企业微信
4. **自定义看板**：支持拖拽编排卡片，每个人关注的指标不同`
  },
  {
    id: 1134,
    title: '你在卫盈智信实现了 QQ 登录与微信扫码登录，请说明 OAuth2.0 在前端的完整流程。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['OAuth2.0', 'QQ登录', '微信登录', '第三方登录'],
    content: `## 答案

QQ 登录和微信扫码登录都基于 **OAuth 2.0 授权码模式**，但实现细节有差异。

### QQ 登录完整流程

\`\`\`
1. 用户点击"QQ登录"按钮
2. 前端跳转到 QQ 授权页面（带上 redirect_uri）
3. 用户在 QQ 页面确认授权
4. QQ 重定向回 redirect_uri，URL 中带 authorization_code
5. 前端将 code 发给后端
6. 后端用 code 换取 access_token（后端到 QQ 服务器）
7. 后端用 token 获取用户信息
8. 后端返回自己系统的 JWT Token
\`\`\`

\`\`\`javascript
// 第一步：跳转QQ授权页
function loginWithQQ() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: QQ_APP_ID,
    redirect_uri: encodeURIComponent(window.location.origin + '/auth/qq/callback'),
    state: generateRandomState(),  // CSRF防护
    scope: 'get_user_info'
  });
  // 保存 state 用于回调验证
  sessionStorage.setItem('oauth_state', params.get('state'));
  window.location.href = 'https://graph.qq.com/oauth2.0/authorize?' + params;
}

// 第二步：回调页面处理
async function handleQQCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');

  // 验证 state 防 CSRF
  if (state !== sessionStorage.getItem('oauth_state')) {
    throw new Error('安全验证失败');
  }

  // 将 code 发给后端换 token
  const { token, userInfo } = await api.post('/auth/qq', { code });
  localStorage.setItem('jwt_token', token);
  router.push('/');
}
\`\`\`

### 微信扫码登录的差异

微信扫码登录需要在**页面内嵌入二维码**（不跳转），使用微信 JS SDK：

\`\`\`javascript
function showWechatQR() {
  new WxLogin({
    self_redirect: false,     // 在新窗口打开
    id: 'wechat-qr-container', // 容器 ID
    appid: WECHAT_APP_ID,
    scope: 'snsapi_login',
    redirect_uri: encodeURIComponent(CALLBACK_URL),
    state: generateRandomState(),
    style: 'black',           // 二维码颜色
    href: ''                  // 自定义CSS
  });
}
\`\`\`

### 追问：OAuth 中的 state 参数为什么能防止 CSRF？

**答案：**
攻击场景：攻击者构造一个带有自己 QQ 账号 code 的回调 URL，诱导受害者点击。受害者点击后，系统将攻击者的 QQ 账号绑定到受害者账户。

state 参数的防护原理：
1. 登录前生成随机 state 存入 sessionStorage
2. 回调时验证 URL 中的 state 与本地存储的是否一致
3. 攻击者构造的 URL 中 state 与受害者本地不匹配 → 拒绝处理
4. state 的随机性保证攻击者无法预测`
  },
  {
    id: 1135,
    title: '你实现了"微信公众号模板可视化编辑器，支持拖拽布局、样式实时预览"，请说明实现方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['可视化编辑', '拖拽', 'vue-draggable', 'JSON Schema'],
    content: `## 答案

这是运营平台中的核心功能，运营人员不写代码，通过拖拽组件来编辑微信公众号消息模板。

### 整体架构

\`\`\`
组件面板 ←→ 编辑画布 ←→ 属性面板
    ↓              ↓            ↓
组件列表     拖拽排列/嵌套    样式/内容编辑
                   ↓
            JSON Schema 数据
                   ↓
          实时预览 / 导出HTML
\`\`\`

### 数据结构设计

\`\`\`typescript
interface TemplateBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'columns';
  props: Record<string, any>;
  style: CSSProperties;
  children?: TemplateBlock[]; // 嵌套组件
}

// 模板数据示例
const template: TemplateBlock[] = [
  {
    id: '1', type: 'image',
    props: { src: 'banner.jpg', alt: '活动横幅' },
    style: { width: '100%', borderRadius: '8px' }
  },
  {
    id: '2', type: 'text',
    props: { content: '亲爱的{{nickname}}' },
    style: { fontSize: '16px', color: '#333', padding: '16px' }
  },
  {
    id: '3', type: 'button',
    props: { text: '立即参与', url: '{{activity_url}}' },
    style: { backgroundColor: '#07C160', color: '#fff' }
  }
]
\`\`\`

### 拖拽实现（vue-draggable）

\`\`\`vue
<template>
  <div class="editor-canvas">
    <draggable v-model="blocks" item-key="id" handle=".drag-handle"
      :animation="200" ghost-class="ghost-block">
      <template #item="{ element }">
        <div class="block-wrapper"
          :class="{ active: selectedId === element.id }"
          @click="selectBlock(element.id)">
          <div class="drag-handle">⋮⋮</div>
          <component :is="getRenderer(element.type)"
            v-bind="element.props" :style="element.style" />
          <div class="block-actions">
            <button @click.stop="duplicateBlock(element.id)">复制</button>
            <button @click.stop="deleteBlock(element.id)">删除</button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>
\`\`\`

### 实时预览

\`\`\`javascript
// 将 JSON Schema 转换为微信公众号兼容的 HTML
function renderToWechatHTML(blocks) {
  return blocks.map(block => {
    const style = Object.entries(block.style)
      .map(([k, v]) => \`\${camelToKebab(k)}:\${v}\`)
      .join(';');
    
    switch (block.type) {
      case 'text':
        return \`<p style="\${style}">\${block.props.content}</p>\`;
      case 'image':
        return \`<img src="\${block.props.src}" style="\${style}" />\`;
      case 'button':
        return \`<a href="\${block.props.url}" style="\${style}; display:block; text-align:center; text-decoration:none; padding:12px; border-radius:4px;">\${block.props.text}</a>\`;
      default:
        return '';
    }
  }).join('');
}
\`\`\`

### 追问：微信公众号的 HTML 有什么限制？

**答案：**
1. **不支持 JavaScript**：所有交互只能靠链接跳转
2. **CSS 限制**：不支持 position、float 等属性，布局只能靠 table 或 inline 样式
3. **图片限制**：图片必须上传到微信素材库，不能用外链
4. **不支持外部字体**：只能用系统默认字体
5. 所以编辑器需要在用户编辑时就做限制，只提供微信支持的组件和样式选项`
  },
  {
    id: 1136,
    title: '你实现了"短信模板变量插值引擎"，请说明插值引擎的解析和安全校验机制。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['模板引擎', '变量插值', '正则解析', 'XSS防护'],
    content: `## 答案

短信模板中包含动态变量（如 \`{{nickname}}\`、\`{{amount}}\`），需要在发送时替换为真实数据。前端负责模板编辑、变量插入和实时预览。

### 插值引擎核心实现

\`\`\`typescript
class TemplateEngine {
  private varPattern = /\\{\\{(\\w+(?:\\.\\w+)*)(?:\\|(\\w+))?\\}\\}/g;
  // 匹配 {{name}} 或 {{user.name}} 或 {{amount|currency}}

  // 解析模板，提取所有变量
  parse(template: string): TemplateVariable[] {
    const vars: TemplateVariable[] = [];
    let match;
    while ((match = this.varPattern.exec(template)) !== null) {
      vars.push({
        fullMatch: match[0],
        path: match[1],           // user.name
        formatter: match[2],      // currency
        index: match.index
      });
    }
    return vars;
  }

  // 渲染模板
  render(template: string, data: Record<string, any>): string {
    return template.replace(this.varPattern, (match, path, formatter) => {
      const value = this.getNestedValue(data, path);
      if (value === undefined) return match; // 未找到变量保留原样
      const formatted = formatter ? this.format(value, formatter) : String(value);
      return this.sanitize(formatted); // 安全处理
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  private format(value: any, type: string): string {
    switch (type) {
      case 'currency': return '¥' + Number(value).toFixed(2);
      case 'date': return new Date(value).toLocaleDateString('zh-CN');
      case 'phone': return String(value).replace(/(\\d{3})\\d{4}(\\d{4})/, '$1****$2');
      default: return String(value);
    }
  }

  private sanitize(value: string): string {
    // 短信场景：限制长度，过滤特殊字符
    return value.slice(0, 100).replace(/[<>&"']/g, '');
  }
}
\`\`\`

### 编辑器中的变量插入交互

\`\`\`javascript
// 点击变量标签，在光标位置插入变量
function insertVariable(textarea, varName) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const varText = \`{{\${varName}}}\`;
  textarea.value = text.slice(0, start) + varText + text.slice(end);
  // 将光标移到变量后面
  textarea.selectionStart = textarea.selectionEnd = start + varText.length;
  textarea.focus();
}
\`\`\`

### 追问：如何防止变量注入攻击？

**答案：**
1. **白名单校验**：只允许预定义的变量名，拒绝未注册的变量
2. **长度限制**：变量值限制最大长度（如 100 字符）
3. **类型校验**：数字变量只接受数字，日期变量只接受合法日期
4. **输出转义**：渲染后做 HTML 实体转义（短信场景较少，但邮件/网页需要）
5. **模板审核**：新模板需要审核通过后才能使用`
  },
  {
    id: 1137,
    title: '你在 Kuikly 中实现了跑步轨迹可视化，Kuikly 是怎么调用原生地图 API 的？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Kuikly', '地图API', '原生桥接', '跨端组件'],
    content: `## 答案

Kuikly 中使用原生地图组件（如高德地图、腾讯地图）不是直接在 Kotlin 中调用 JS API，而是通过**原生组件桥接**的方式。

### 原生组件桥接机制

\`\`\`
Kuikly 逻辑层（Kotlin）
    ↓ 发送指令
原生渲染层
    ↓ 创建原生 MapView
平台 SDK（高德/腾讯地图）
\`\`\`

Kuikly 的设计理念是**用原生控件渲染**，地图就是一个原生 View，由 Kuikly 在渲染树中标记其位置和大小。

### 跑步轨迹绘制的实现

\`\`\`kotlin
// Kuikly 侧：声明地图组件和轨迹数据
@Composable
fun RunMap(trackPoints: List<LatLng>) {
    NativeMapView(
        modifier = Modifier.fillMaxSize(),
        center = trackPoints.lastOrNull() ?: defaultCenter,
        zoom = 16f,
        overlays = listOf(
            Polyline(
                points = trackPoints,
                color = Color(0xFFFF6B35),
                width = 6f,
                // 渐变色轨迹：根据配速变化颜色
                gradientColors = trackPoints.mapIndexed { i, _ ->
                    paceToColor(calculatePace(trackPoints, i))
                }
            ),
            // 起点终点标记
            Marker(position = trackPoints.first(), icon = startIcon),
            Marker(position = trackPoints.last(), icon = endIcon)
        )
    )
}

// 根据配速计算轨迹颜色（慢=红色，正常=绿色，快=蓝色）
fun paceToColor(paceMinPerKm: Float): Color {
    return when {
        paceMinPerKm > 8f -> Color.Red       // 慢于 8min/km
        paceMinPerKm > 5f -> Color.Green     // 5-8 min/km
        else -> Color.Blue                    // 快于 5min/km
    }
}
\`\`\`

### Web 端降级方案

因为跑步页面也需要支持 Web 端（分享链接在浏览器中打开），Web 端使用高德地图 JS API：

\`\`\`javascript
// Web 端地图初始化
const map = new AMap.Map('container', {
  zoom: 16,
  center: trackPoints[trackPoints.length - 1]
});

// 绘制轨迹
const polyline = new AMap.Polyline({
  path: trackPoints.map(p => [p.lng, p.lat]),
  strokeColor: '#FF6B35',
  strokeWeight: 6,
  strokeOpacity: 0.9
});
map.add(polyline);
map.setFitView([polyline]); // 自动缩放到适合显示轨迹
\`\`\`

### 追问：GPS 轨迹数据量很大（每秒一个点，跑 1 小时就 3600 个点），如何优化？

**答案：**
1. **Douglas-Peucker 算法简化**：在保持轨迹形状的前提下减少点数（通常可减少 70-80%）
2. **分段加载**：长轨迹分段请求，先加载可视区域
3. **LOD 策略**：缩放级别低时用简化轨迹，放大时用精细轨迹
4. **WebWorker 计算**：轨迹简化和配速计算放在 Worker 中，避免阻塞主线程`
  },
  {
    id: 1138,
    title: '你在脚手架中使用 EJS 模板引擎嵌入项目配置，请说明模板渲染的完整流程。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['EJS', '模板引擎', '脚手架', '代码生成'],
    content: `## 答案

脚手架的 init 命令需要根据用户输入的项目配置（项目名、作者、是否使用 TypeScript 等）来生成定制化的项目文件。

### 完整流程

\`\`\`
用户执行 init 命令
    → 1. 命令行交互收集配置
    → 2. 下载/读取模板文件
    → 3. EJS 渲染模板
    → 4. 写入目标目录
    → 5. 安装依赖
\`\`\`

### 命令行交互（inquirer）

\`\`\`javascript
const inquirer = require('inquirer');

async function collectConfig() {
  return inquirer.prompt([
    { type: 'input', name: 'projectName', message: '项目名称：', validate: validatePackageName },
    { type: 'input', name: 'author', message: '作者：', default: getGitUser() },
    { type: 'list', name: 'template', message: '选择模板：', choices: ['vue3-ts', 'vue3-js', 'react-ts'] },
    { type: 'confirm', name: 'useESLint', message: '是否使用 ESLint？', default: true },
    { type: 'confirm', name: 'usePrettier', message: '是否使用 Prettier？', default: true },
    { type: 'list', name: 'cssPreprocessor', message: 'CSS 预处理器：', choices: ['scss', 'less', 'none'] }
  ]);
}
\`\`\`

### EJS 模板示例

\`\`\`json
// package.json.ejs
{
  "name": "<%= projectName %>",
  "version": "1.0.0",
  "author": "<%= author %>",
  "scripts": {
    "dev": "vite",
    "build": "<% if (useTypeScript) { %>vue-tsc && <% } %>vite build"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    <% if (useESLint) { %>
    "eslint": "^8.0.0",
    <% } %>
    <% if (usePrettier) { %>
    "prettier": "^3.0.0",
    <% } %>
    <% if (cssPreprocessor === 'scss') { %>
    "sass": "^1.69.0",
    <% } else if (cssPreprocessor === 'less') { %>
    "less": "^4.2.0",
    <% } %>
    "vite": "^5.0.0"
  }
}
\`\`\`

### 递归渲染目录

\`\`\`javascript
const ejs = require('ejs');
const glob = require('glob');

async function renderTemplates(templateDir, targetDir, config) {
  const files = glob.sync('**/*', { cwd: templateDir, dot: true, nodir: true });

  for (const file of files) {
    const sourcePath = path.join(templateDir, file);
    let targetPath = path.join(targetDir, file);
    const content = fs.readFileSync(sourcePath, 'utf-8');

    if (file.endsWith('.ejs')) {
      // EJS 文件：渲染后去掉 .ejs 后缀
      const rendered = ejs.render(content, config);
      targetPath = targetPath.replace(/\\.ejs$/, '');
      fs.ensureDirSync(path.dirname(targetPath));
      fs.writeFileSync(targetPath, rendered);
    } else {
      // 非 EJS 文件：直接复制
      fs.ensureDirSync(path.dirname(targetPath));
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
\`\`\`

### 追问：EJS 模板中如果配置值包含特殊字符（如引号），怎么处理？

**答案：**
- EJS 的 \`<%= %>\` 会自动 HTML 转义，但 JSON 文件不需要 HTML 转义
- 使用 \`<%- %>\` 输出原始值
- 对于 JSON 文件，用 \`JSON.stringify()\` 确保值格式正确
- 项目名用正则校验，只允许 \`a-z0-9-_\` 字符
- \`validate\` 函数在 inquirer 阶段就拒绝非法输入`
  },
  {
    id: 1139,
    title: '你提到"Vuex + vuex-persistedstate 实现状态持久化"，请说明持久化策略和踩过的坑。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Vuex', '持久化', 'vuex-persistedstate', '序列化'],
    content: `## 答案

\`vuex-persistedstate\` 将 Vuex 状态序列化后存入 localStorage，页面刷新后自动恢复。

### 配置方案

\`\`\`javascript
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
  plugins: [
    createPersistedState({
      // 只持久化需要的模块，而非全部
      paths: [
        'user.token',
        'user.userInfo',
        'permission.routes',
        'settings.themeColor',
        'settings.language'
      ],
      // 自定义存储（可以用 sessionStorage 或其他）
      storage: {
        getItem: key => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: key => localStorage.removeItem(key)
      }
    })
  ]
});
\`\`\`

### 踩过的坑

**坑 1：序列化 Date 对象丢失类型**

\`\`\`javascript
// 存入时：{ expireAt: Date('2024-01-01') }
// 恢复后：{ expireAt: "2024-01-01T00:00:00.000Z" }  ← 变成了字符串！

// 解决：自定义序列化
createPersistedState({
  reducer: (state) => ({
    ...state,
    user: {
      ...state.user,
      // Date 转时间戳存储
      tokenExpire: state.user.tokenExpire?.getTime()
    }
  }),
  // 恢复时手动转换
  getState: (key) => {
    const state = JSON.parse(localStorage.getItem(key));
    if (state?.user?.tokenExpire) {
      state.user.tokenExpire = new Date(state.user.tokenExpire);
    }
    return state;
  }
});
\`\`\`

**坑 2：版本升级后状态结构变化**

新版本增加了字段，但 localStorage 中还是旧数据结构，导致页面报错。

\`\`\`javascript
// 解决：版本号校验
const STATE_VERSION = 'v2.1';
createPersistedState({
  getState: (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const state = JSON.parse(raw);
    // 版本不匹配时清除旧数据
    if (state.__version !== STATE_VERSION) {
      localStorage.removeItem(key);
      return undefined;
    }
    return state;
  },
  setState: (key, state) => {
    localStorage.setItem(key, JSON.stringify({ ...state, __version: STATE_VERSION }));
  }
});
\`\`\`

**坑 3：多标签页数据不同步**

\`\`\`javascript
// 监听 storage 事件，同步其他标签页的变化
window.addEventListener('storage', (e) => {
  if (e.key === 'vuex') {
    const newState = JSON.parse(e.newValue);
    store.replaceState(Object.assign(store.state, newState));
  }
});
\`\`\`

### 追问：如果让你现在重新设计，还会用 vuex-persistedstate 吗？

**答案：**
如果是新项目（Vue 3），会用 **Pinia + pinia-plugin-persistedstate**：
- API 更简洁，支持按 store 单独配置
- 天然支持 TypeScript
- 可以选择 sessionStorage、cookie 等多种存储
- 支持自定义序列化器`
  },
  {
    id: 1140,
    title: '你在决策引擎中"基于 vue-draggable 实现拖拽构建决策表"，请说明拖拽交互的技术细节。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['vue-draggable', '拖拽交互', '决策表', '可视化配置'],
    content: `## 答案

决策表是客服人员配置贷款审批规则的工具。通过拖拽将条件字段组合成决策规则，而非手写代码。

### 决策表数据结构

\`\`\`typescript
interface DecisionTable {
  conditions: ConditionColumn[];  // 条件列
  actions: ActionColumn[];        // 结果列
  rules: Rule[];                  // 规则行
}

interface ConditionColumn {
  id: string;
  field: string;        // 如 'credit_score', 'income'
  label: string;        // '信用评分', '月收入'
  type: 'number' | 'select' | 'range';
  operator: 'gt' | 'lt' | 'eq' | 'between' | 'in';
}

interface Rule {
  id: string;
  conditions: Record<string, any>;  // { credit_score: '>= 700', income: '>= 10000' }
  action: string;                    // 'approved' | 'rejected' | 'manual_review'
  priority: number;
}
\`\`\`

### 拖拽实现

\`\`\`vue
<template>
  <div class="decision-table-builder">
    <!-- 字段面板（拖拽源） -->
    <div class="field-panel">
      <h3>可用字段</h3>
      <draggable :list="availableFields" :group="{ name: 'fields', pull: 'clone', put: false }"
        :sort="false" item-key="id">
        <template #item="{ element }">
          <div class="field-chip">
            <span class="field-icon">{{ getFieldIcon(element.type) }}</span>
            {{ element.label }}
          </div>
        </template>
      </draggable>
    </div>

    <!-- 条件列区域（拖拽目标） -->
    <div class="condition-area">
      <draggable :list="table.conditions" group="fields" item-key="id"
        @add="onConditionAdd" :animation="200">
        <template #item="{ element, index }">
          <div class="condition-column">
            <div class="column-header">
              {{ element.label }}
              <button @click="removeCondition(index)">×</button>
            </div>
            <!-- 每行的条件值输入 -->
            <div v-for="rule in table.rules" :key="rule.id" class="condition-cell">
              <ConditionInput :column="element" v-model="rule.conditions[element.field]" />
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
\`\`\`

### 关键交互细节

\`\`\`javascript
// 拖拽时的视觉反馈
const onConditionAdd = (evt) => {
  const field = evt.item.__draggable_context.element;
  // 自动为每条规则添加该字段的默认值
  table.rules.forEach(rule => {
    rule.conditions[field.field] = getDefaultValue(field.type);
  });
  // 弹出操作符选择
  showOperatorSelector(field);
};

// 拖拽排序影响规则优先级
const onRuleReorder = () => {
  // 规则按顺序从上到下匹配，第一个命中即生效
  table.rules.forEach((rule, index) => {
    rule.priority = index;
  });
};
\`\`\`

### 追问：决策表的规则冲突如何处理？

**答案：**
1. **冲突检测**：前端在保存前检查是否有重叠的条件范围
2. **优先级**：规则按顺序匹配，冲突时以排在前面的规则为准
3. **可视化高亮**：冲突的规则行用红色高亮提示
4. **测试模式**：输入测试数据，展示命中了哪条规则，帮助客服理解规则效果`
  },
  {
    id: 1141,
    title: '你在 QQ 运动"配合产品与运营团队快速响应运营活动需求"，一个典型的运营活动页开发流程是什么？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['运营活动', '快速迭代', '模板化', 'AB测试'],
    content: `## 答案

QQ 运动的运营活动（如春节步数挑战、世界杯竞猜、全民健身日等）有个共同特点：**开发周期短（通常 3-5 天）、上线时间固定、一次性使用**。

### 典型开发流程

\`\`\`
Day 1：需求评审 + 技术方案
Day 2-3：UI 开发 + 接口联调
Day 4：自测 + 提交体验
Day 5：修改 + 上线
\`\`\`

### 提效策略——活动模板化

多次活动后我沉淀了一套活动模板，新活动基于模板修改，开发效率提升 50%+。

\`\`\`javascript
// 活动页通用框架
class ActivityPage {
  constructor(config) {
    this.config = config;
  }

  // 通用模块
  async init() {
    await this.checkLogin();      // 登录态检查
    await this.loadActivityData(); // 活动数据拉取
    this.initShare();              // 分享配置
    this.initReport();             // 埋点上报
    this.render();                 // 页面渲染
  }

  // 通用的登录态检查
  async checkLogin() {
    const token = await KuiklyBridge.getLoginToken();
    if (!token) {
      KuiklyBridge.showLoginDialog();
      throw new Error('未登录');
    }
    this.token = token;
  }

  // 通用的分享配置
  initShare() {
    KuiklyBridge.setShareConfig({
      title: this.config.shareTitle,
      desc: this.config.shareDesc,
      imageUrl: this.config.shareImage,
      url: this.config.shareUrl
    });
  }

  // 通用的埋点
  initReport() {
    reportPV({ activity_id: this.config.activityId });
  }
}

// 具体活动继承模板
class SpringFestivalActivity extends ActivityPage {
  constructor() {
    super({
      activityId: 'spring_2024',
      shareTitle: '春节步数挑战',
      shareDesc: '一起来走路赢红包！',
      // ...
    });
  }

  render() {
    // 只需要写活动特有的 UI 逻辑
  }
}
\`\`\`

### 追问：活动页上线后发现严重 Bug，如何快速热修复？

**答案：**
1. **Kuikly 动态更新**：如果是 Kuikly 页面，可以通过动态下发更新
2. **配置开关**：关键功能设计开关，后台一键关闭有问题的模块
3. **降级 H5**：Kuikly 页面出问题时降级到 H5 备份页面
4. **灰度发布**：活动上线时先灰度 10% 用户，确认无误再全量`
  },
  {
    id: 1142,
    title: '你在决策引擎中"实现了 tagViewList 动态数据源，根据路由变化实时更新标签页列表"，请说明实现细节。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['标签页', '路由', '多标签管理', 'KeepAlive'],
    content: `## 答案

tagViewList 是中后台系统的多标签页功能——用户打开的每个页面都会在顶部生成一个标签，可以快速切换、关闭。

### 核心数据结构

\`\`\`typescript
interface TagView {
  path: string;
  fullPath: string;
  title: string;
  name: string;    // 组件名（用于 KeepAlive）
  query: Record<string, string>;
  affix?: boolean;  // 固定标签（首页等不可关闭）
}

// Vuex 存储
const tagViewModule = {
  state: {
    visitedViews: [] as TagView[],    // 已访问的标签
    cachedViews: [] as string[],       // 需要缓存的组件名
  },
  mutations: {
    ADD_VISITED_VIEW(state, view: TagView) {
      // 防止重复添加
      if (state.visitedViews.some(v => v.path === view.path)) return;
      state.visitedViews.push({
        ...view,
        title: view.title || '未命名页面'
      });
    },
    DEL_VISITED_VIEW(state, path: string) {
      const index = state.visitedViews.findIndex(v => v.path === path);
      if (index > -1) state.visitedViews.splice(index, 1);
    }
  }
};
\`\`\`

### 与 Vue Router 联动

\`\`\`javascript
router.afterEach((to) => {
  // 每次路由变化时添加标签
  if (to.meta?.title) {
    store.commit('ADD_VISITED_VIEW', {
      path: to.path,
      fullPath: to.fullPath,
      title: to.meta.title,
      name: to.name,
      query: to.query
    });
    // 添加到 KeepAlive 缓存
    if (to.meta.keepAlive !== false) {
      store.commit('ADD_CACHED_VIEW', to.name);
    }
  }
});
\`\`\`

### 标签关闭逻辑

\`\`\`javascript
function closeTag(targetPath) {
  const views = store.state.visitedViews;
  const targetIndex = views.findIndex(v => v.path === targetPath);
  
  // 关闭标签
  store.commit('DEL_VISITED_VIEW', targetPath);
  store.commit('DEL_CACHED_VIEW', views[targetIndex].name);

  // 如果关闭的是当前页，需要跳转
  if (targetPath === router.currentRoute.value.path) {
    // 跳转到右侧标签，没有则跳左侧，再没有则首页
    const nextView = views[targetIndex] || views[targetIndex - 1];
    router.push(nextView?.fullPath || '/');
  }
}
\`\`\`

### 右键菜单操作

\`\`\`javascript
const contextMenuActions = [
  { label: '关闭当前', action: (path) => closeTag(path) },
  { label: '关闭其他', action: (path) => closeOtherTags(path) },
  { label: '关闭左侧', action: (path) => closeLeftTags(path) },
  { label: '关闭右侧', action: (path) => closeRightTags(path) },
  { label: '全部关闭', action: () => closeAllTags() }
];
\`\`\`

### 追问：KeepAlive 缓存的页面越来越多，内存如何控制？

**答案：**
1. **最大缓存数**：\`<KeepAlive :max="10">\`，超过自动淘汰最久未访问的
2. **关闭标签清缓存**：关闭标签时从 cachedViews 移除，触发组件销毁
3. **手动刷新**：右键菜单提供"刷新当前页"选项，强制重新加载
4. **exclude 名单**：大数据量页面不缓存（如报表页）`
  },
  {
    id: 1143,
    title: '你在 Kuikly 和 NTCompose 的跨端开发中，如何处理 iOS 和 Android 的安全区域适配？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['安全区域', 'Safe Area', '刘海屏', '跨端适配'],
    content: `## 答案

iOS 和 Android 的安全区域（刘海屏、底部手势条、状态栏）差异较大，是跨端开发必须处理的问题。

### 安全区域差异

| 平台 | 顶部 | 底部 |
|------|------|------|
| iPhone（刘海屏） | 状态栏 44px + 刘海 | 手势条 34px |
| iPhone（非刘海） | 状态栏 20px | 0 |
| Android | 状态栏 24-28px（不同厂商不同） | 导航栏 48px（可隐藏） |

### Kuikly 中的处理方式

\`\`\`kotlin
@Composable
fun SafeAreaLayout(content: @Composable () -> Unit) {
    val safeArea = LocalSafeArea.current
    // safeArea.top / safeArea.bottom 由框架自动获取当前设备的安全区域

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(
                top = safeArea.top.dp,
                bottom = safeArea.bottom.dp
            )
    ) {
        content()
    }
}
\`\`\`

### Web 端降级方案

\`\`\`css
/* CSS env() 变量获取安全区域 */
.page-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* 底部固定按钮需要额外处理 */
.fixed-bottom-button {
  position: fixed;
  bottom: 0;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
\`\`\`

### 实际踩坑

**坑 1：Android 不同厂商状态栏高度不同**

华为、小米、OPPO 的状态栏高度可能不一样（24-32dp），不能硬编码。

\`\`\`kotlin
// 动态获取
fun getStatusBarHeight(context: Context): Int {
    val resourceId = context.resources.getIdentifier("status_bar_height", "dimen", "android")
    return if (resourceId > 0) context.resources.getDimensionPixelSize(resourceId) else 0
}
\`\`\`

**坑 2：Android 全面屏手势与虚拟按键**

用户可能使用虚拟导航栏（48dp）或全面屏手势（底部手势条更窄），需要监听导航模式变化。

### 追问：你们是如何测试安全区域适配的？

**答案：**
1. **真机矩阵**：覆盖 iPhone 14 Pro（灵动岛）、iPhone SE（非刘海）、Android 高中低端
2. **模拟器**：Android Studio 创建不同屏幕尺寸的虚拟设备
3. **视觉回归**：截图对比工具检测布局是否正确
4. **自动化**：CI 中集成截图测试，每次提交自动对比`
  },
  {
    id: 1144,
    title: '你在卫盈智信"构建 PC 端与移动端统一的路由基础架构"，如何实现一套代码适配两端？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['响应式路由', '多端适配', '路由架构', '自适应布局'],
    content: `## 答案

钱夹谷谷项目同时支持 PC 端和移动端（WebView 内嵌），但两端的交互模式完全不同（PC 是左右布局，移动端是页面栈），所以路由架构需要统一管理但差异化表现。

### 路由配置设计

\`\`\`typescript
// 统一路由配置，通过 meta 区分端表现
const routes: RouteConfig[] = [
  {
    path: '/account',
    component: () => import('@/views/Account.vue'),
    meta: {
      title: '账户管理',
      pc: { layout: 'sidebar' },      // PC端：侧边栏布局
      mobile: { transition: 'slide' }  // 移动端：滑入动画
    }
  }
];
\`\`\`

### 设备检测与布局切换

\`\`\`javascript
const isMobile = ref(false);

function detectDevice() {
  // 优先通过 UserAgent 判断
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad/i.test(ua)) return true;
  // 其次通过屏幕宽度
  return window.innerWidth < 768;
}

// 响应式监听
const mediaQuery = window.matchMedia('(max-width: 768px)');
mediaQuery.addEventListener('change', (e) => {
  isMobile.value = e.matches;
});
\`\`\`

### PC 端：左右布局

\`\`\`vue
<!-- PC 布局 -->
<template v-if="!isMobile">
  <div class="flex h-screen">
    <Sidebar />              <!-- 固定左侧菜单 -->
    <div class="flex-1">
      <TagViewList />         <!-- 标签页栏 -->
      <KeepAlive :include="cachedViews">
        <router-view />
      </KeepAlive>
    </div>
  </div>
</template>
\`\`\`

### 移动端：页面栈 + 虚拟任务栈

\`\`\`vue
<!-- 移动端布局 -->
<template v-else>
  <div class="h-screen flex flex-col">
    <MobileHeader :title="currentRoute.meta.title" @back="goBack" />
    <transition :name="transitionName">
      <router-view class="flex-1" />
    </transition>
    <MobileTabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
// 移动端路由动画方向判断
const transitionName = computed(() => {
  if (isGoingBack.value) return 'slide-right'; // 返回时右滑
  return 'slide-left'; // 前进时左滑
});
</script>
\`\`\`

### 追问：同一个列表页在 PC 端显示为表格，在移动端显示为卡片，如何复用逻辑？

**答案：**
逻辑层完全复用，只在 UI 层分叉：

\`\`\`vue
<!-- 共用数据和逻辑 -->
<script setup>
const { data, loading, pagination, refresh } = useListData('/api/accounts');
</script>

<!-- PC 表格 -->
<el-table v-if="!isMobile" :data="data" />

<!-- 移动端卡片 -->
<div v-else class="card-list">
  <div v-for="item in data" class="card">{{ item.name }}</div>
</div>
\`\`\``
  },
  {
    id: 1145,
    title: '你在 AIGC 平台中使用 Canvas 做图层叠加，如何处理不同尺寸素材的自适应缩放？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Canvas', '图层缩放', '自适应布局', '图片处理'],
    content: `## 答案

AIGC 平台的主题预览需要将不同尺寸的素材（主图、气泡、头像挂件、Icon）叠加在一起，每种素材的原始尺寸不同，需要按规则缩放到正确位置。

### 缩放策略

\`\`\`javascript
// 图层缩放模式
const ScaleMode = {
  FILL: 'fill',         // 填满区域，可能裁剪
  FIT: 'fit',           // 适应区域，可能有留白
  STRETCH: 'stretch',   // 拉伸填满（可能变形）
  NONE: 'none'          // 不缩放，原始尺寸
};

function calculateDrawParams(img, targetRect, scaleMode) {
  const { width: tw, height: th, x: tx, y: ty } = targetRect;
  const { width: iw, height: ih } = img;

  switch (scaleMode) {
    case ScaleMode.FILL: {
      // 等比缩放后裁剪
      const scale = Math.max(tw / iw, th / ih);
      const sw = tw / scale, sh = th / scale;
      const sx = (iw - sw) / 2, sy = (ih - sh) / 2;
      return { sx, sy, sw, sh, dx: tx, dy: ty, dw: tw, dh: th };
    }
    case ScaleMode.FIT: {
      // 等比缩放，留白居中
      const scale = Math.min(tw / iw, th / ih);
      const dw = iw * scale, dh = ih * scale;
      const dx = tx + (tw - dw) / 2, dy = ty + (th - dh) / 2;
      return { sx: 0, sy: 0, sw: iw, sh: ih, dx, dy, dw, dh };
    }
    case ScaleMode.STRETCH:
      return { sx: 0, sy: 0, sw: iw, sh: ih, dx: tx, dy: ty, dw: tw, dh: th };
    default:
      return { sx: 0, sy: 0, sw: iw, sh: ih, dx: tx, dy: ty, dw: iw, dh: ih };
  }
}

// 绘制图层
function drawLayer(ctx, img, layer) {
  const params = calculateDrawParams(img, layer.rect, layer.scaleMode);
  ctx.save();
  ctx.globalAlpha = layer.opacity ?? 1;
  if (layer.rotation) {
    const cx = params.dx + params.dw / 2;
    const cy = params.dy + params.dh / 2;
    ctx.translate(cx, cy);
    ctx.rotate(layer.rotation * Math.PI / 180);
    ctx.translate(-cx, -cy);
  }
  ctx.drawImage(img, params.sx, params.sy, params.sw, params.sh,
    params.dx, params.dy, params.dw, params.dh);
  ctx.restore();
}
\`\`\`

### 不同素材的缩放规则

| 素材类型 | 缩放模式 | 说明 |
|---------|---------|------|
| 主图/三联图 | FILL | 作为背景铺满 |
| 头像挂件 | FIT | 保持原始比例，居中在头像区域 |
| 气泡 | STRETCH | 宽度适应文字长度，高度按比例 |
| Icon | NONE/FIT | 固定尺寸，不缩放 |

### 追问：Canvas 绘制大量图层时性能如何优化？

**答案：**
1. **离屏 Canvas**：复杂图层先在离屏 Canvas 绘制，再一次性合成到主 Canvas
2. **缓存不变图层**：背景图等不变的图层只绘制一次，缓存为 ImageBitmap
3. **降采样**：预览时使用低分辨率，导出时才用高分辨率
4. **批量操作**：尽量减少 save/restore 调用，合并同类操作`
  },
  {
    id: 1146,
    title: '你负责了 CI/CD 流水线搭建，请说明前端项目的 CI/CD 完整方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['CI/CD', '自动化部署', 'GitHub Actions', 'Docker'],
    content: `## 答案

前端项目的 CI/CD 从代码提交到部署上线，需要经过多个自动化阶段。

### 完整流水线

\`\`\`
代码提交
  → Pre-commit Hook（lint-staged + husky）
  → Push to Git
  → CI 触发
    → 安装依赖
    → 代码检查（ESLint + TypeScript）
    → 单元测试（Vitest）
    → 构建（vite build）
    → 产物分析（bundle size check）
  → CD 触发
    → Docker 镜像构建
    → 推送到镜像仓库
    → 部署到预发布环境
    → 自动化 E2E 测试
    → 人工验收
    → 部署到生产环境
\`\`\`

### GitHub Actions 配置

\`\`\`yaml
# .github/workflows/ci.yml
name: Frontend CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test -- --coverage
      - run: npm run build
      # 构建产物大小检查
      - name: Bundle Size Check
        run: |
          SIZE=$(du -sb dist | cut -f1)
          if [ $SIZE -gt 5242880 ]; then
            echo "Bundle size exceeds 5MB limit!"
            exit 1
          fi

  deploy-preview:
    needs: ci
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Preview
        # 部署到预览环境，评论在 PR 中
        run: echo "Preview URL: https://preview-\${{ github.event.number }}.example.com"

  deploy-production:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Image
        run: docker build -t frontend:\${{ github.sha }} .
      - name: Deploy
        run: kubectl set image deployment/frontend frontend=frontend:\${{ github.sha }}
\`\`\`

### 追问：如何实现前端部署的灰度发布？

**答案：**
1. **Nginx 分流**：根据 Cookie 或 IP 哈希将 10% 流量导向新版本
2. **CDN 多版本**：新旧版本的静态资源同时存在 CDN，通过 HTML 入口控制加载哪个版本
3. **Feature Flag**：前端代码内置功能开关，后端动态控制用户看到的版本
4. **监控联动**：灰度期间监控错误率，异常自动回滚`
  },
  {
    id: 1147,
    title: '你在 Kuikly 中"通过优先展示客户端缓存数据减少白屏时间"，请说明缓存架构设计。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['缓存策略', 'Stale-While-Revalidate', '客户端缓存', '白屏优化'],
    content: `## 答案

QQ 运动首页数据量大（步数、排行榜、活动卡券、广告），如果等接口返回才渲染，白屏时间 > 2s。通过缓存优先策略实现"秒开"。

### 缓存架构（三级缓存）

\`\`\`
Level 1: 内存缓存（最快，页面生命周期内）
Level 2: 客户端本地存储（Kuikly 提供的 KV 存储）
Level 3: HTTP 缓存（CDN + 浏览器缓存）
\`\`\`

### Stale-While-Revalidate 策略

\`\`\`javascript
async function fetchWithCache(key, fetcher, options = {}) {
  const { maxAge = 5 * 60 * 1000, staleAge = 30 * 60 * 1000 } = options;

  // 1. 先读缓存
  const cached = await readCache(key);
  const now = Date.now();

  if (cached) {
    const age = now - cached.timestamp;

    if (age < maxAge) {
      // 新鲜数据，直接使用
      return { data: cached.data, source: 'cache', fresh: true };
    }

    if (age < staleAge) {
      // 过期但仍可用——先返回旧数据，后台更新
      refreshInBackground(key, fetcher);
      return { data: cached.data, source: 'stale-cache', fresh: false };
    }
  }

  // 2. 无缓存或缓存太旧，请求接口
  try {
    const data = await fetcher();
    await writeCache(key, data);
    return { data, source: 'network', fresh: true };
  } catch (error) {
    // 网络失败，返回过期缓存（总比白屏强）
    if (cached) return { data: cached.data, source: 'fallback-cache', fresh: false };
    throw error;
  }
}

// 后台静默更新
async function refreshInBackground(key, fetcher) {
  try {
    const data = await fetcher();
    await writeCache(key, data);
    // 更新 UI（如果用户还在当前页面）
    emitUpdate(key, data);
  } catch {
    // 后台更新失败静默忽略
  }
}
\`\`\`

### 缓存粒度设计

\`\`\`javascript
// 不同数据不同缓存策略
const CACHE_CONFIG = {
  'user_steps': { maxAge: 60000, staleAge: 300000 },      // 步数：1分钟新鲜，5分钟可用
  'ranking': { maxAge: 300000, staleAge: 1800000 },        // 排行榜：5分钟新鲜，30分钟可用
  'activity_list': { maxAge: 600000, staleAge: 3600000 },  // 活动：10分钟新鲜，1小时可用
  'user_profile': { maxAge: 86400000, staleAge: 604800000 } // 个人信息：1天新鲜，7天可用
};
\`\`\`

### 追问：缓存数据和最新数据不一致时，用户体验如何处理？

**答案：**
1. **静默更新**：数据更新后自动替换 UI，用户无感知（适合列表数据）
2. **提示更新**：顶部显示"有新数据，点击刷新"横条（适合排行榜）
3. **版本对比**：关键数据（如步数）展示时标注"数据更新于 x 分钟前"
4. **乐观更新**：用户操作（如点赞）立即在 UI 上生效，后台异步同步`
  },
  {
    id: 1148,
    title: '你提到在项目中"短时间内上手 React"，从 Vue 转到 React 你最大的不适应是什么？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Vue转React', '框架对比', 'Hooks', '心智模型'],
    content: `## 答案

作为 6 年 Vue 开发者，转到 React 时最大的不适应来自**心智模型的差异**。

### 最大的三个不适应

**1. 没有"响应式"，每次状态变化整个函数重新执行**

\`\`\`javascript
// Vue：ref 变化 → 精准更新用到这个 ref 的 DOM
const count = ref(0)  // 只有用到 count 的地方更新

// React：setState → 整个组件函数重新执行
function Counter() {
  const [count, setCount] = useState(0) // 每次 count 变化，整个函数重新执行
  console.log('组件重新渲染')           // 每次都打印！
  return <div>{count}</div>
}
\`\`\`

**适应方式**：理解 React 的"不可变数据"理念——不是"修改数据让 UI 跟着变"，而是"创建新数据让 React 对比后更新"。

**2. useEffect 的依赖数组陷阱**

\`\`\`javascript
// Vue：watch 很直观
watch(userId, async (newId) => {
  const data = await fetchUser(newId)
  userData.value = data
})

// React：useEffect 容易写出 Bug
useEffect(() => {
  fetchUser(userId).then(setUserData)
}, [userId]) // 忘记加 userId 到依赖数组 → Bug
            // 加了不该加的依赖 → 无限循环
\`\`\`

**3. 闭包陷阱**

\`\`\`javascript
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // 这里的 count 永远是 0（闭包捕获了初始值）
      console.log(count)        // 永远打印 0
      setCount(count + 1)       // 永远设置为 1
      // 正确方式：setCount(c => c + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])
}
\`\`\`

### 从 Vue 到 React 的映射

| Vue | React |
|-----|-------|
| ref / reactive | useState |
| computed | useMemo |
| watch | useEffect |
| provide / inject | useContext |
| onMounted | useEffect(fn, []) |
| v-if | 条件表达式 |
| v-for | array.map() |
| emit | props 回调函数 |
| slot | children / render props |

### 追问：Vue 和 React 你更喜欢哪个？为什么？

**答案：**
各有优势，取决于场景：
- **Vue 更适合快速交付**：模板直观、API 简洁、学习曲线平缓，适合中小型项目和团队新手多的场景
- **React 更适合复杂应用**：函数式编程、社区生态更大、TypeScript 集成更自然，适合大型项目
- 我个人更熟悉 Vue，但掌握两者让我能够根据项目需求做最佳选择`
  },
  {
    id: 1149,
    title: '你在 Kuikly 项目中开发了多个运营活动，如何保证活动的稳定性和可回滚性？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['运营活动', '稳定性', '灰度发布', '回滚机制'],
    content: `## 答案

运营活动的特点是时间敏感（活动开始后不能出问题）、用户量大（QQ 运动日活上亿），所以稳定性是第一优先级。

### 活动发布流程

\`\`\`
开发完成
  → 代码 Review
  → 提测（测试环境）
  → 体验环境验收
  → 灰度发布（1% → 10% → 50% → 100%）
  → 全量发布
\`\`\`

### 灰度策略

\`\`\`javascript
// 灰度控制通过后台配置
async function shouldShowNewVersion(userId) {
  const config = await fetchGrayConfig('activity_spring_2024');
  // 按用户 ID 哈希取模实现稳定分流
  const hash = hashCode(userId) % 100;
  return hash < config.grayPercent; // grayPercent: 1 表示 1%
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // 转32位整数
  }
  return Math.abs(hash);
}
\`\`\`

### 回滚机制

**1. Kuikly 动态更新回滚：**
\`\`\`javascript
// 每次发布保留上一个版本的 Bundle
// 发现问题时，后台一键将版本号回退到上一版本
// 客户端下次拉取时自动获取旧版本
\`\`\`

**2. 配置开关：**
\`\`\`javascript
// 每个活动功能都有开关
const featureFlags = await fetchFeatureFlags();
if (!featureFlags.spring_activity_enabled) {
  showFallbackPage(); // 展示"活动维护中"
  return;
}
\`\`\`

**3. 降级方案：**
Kuikly 页面异常时自动降级到 H5 备份页面：
\`\`\`javascript
// 客户端层面的降级逻辑
try {
  loadKuiklyPage('spring_activity');
} catch (e) {
  // Kuikly 加载失败，降级到 H5
  loadWebView('https://h5.qq.com/spring_activity');
  reportError('kuikly_fallback', e);
}
\`\`\`

### 监控与告警

\`\`\`javascript
// 活动期间加强监控
const ACTIVITY_METRICS = {
  error_rate_threshold: 0.01,     // 错误率超 1% 告警
  api_timeout_threshold: 3000,     // 接口超 3s 告警
  pv_drop_threshold: 0.3           // PV 突降 30% 告警
};
\`\`\`

### 追问：活动上线后 5 分钟发现严重 Bug，你的应急处理流程是什么？

**答案：**
1. **立即止血**：后台关闭活动开关，展示"活动维护中"
2. **评估影响**：查看监控数据，确认受影响用户范围
3. **紧急修复 or 回滚**：简单问题紧急修复后灰度验证，复杂问题直接回滚到上一版本
4. **通知相关方**：告知产品和运营当前状况和预计恢复时间
5. **复盘**：问题修复后做 RCA（根因分析），避免下次再犯`
  },
  {
    id: 1150,
    title: '你的 Node Canvas 需要处理后台传来的 ZIP 文件，在高并发场景下如何保证服务稳定性？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Node.js', '高并发', '任务队列', '资源管理'],
    content: `## 答案

主题预览生成是 CPU 密集型操作（解压 ZIP + 图片解码 + Canvas 渲染），如果不做控制，高并发请求会导致 Node.js 进程 OOM 或响应超时。

### 并发控制方案

\`\`\`javascript
const pLimit = require('p-limit');

// 根据 CPU 核心数限制并发
const cpuCount = require('os').cpus().length;
const limit = pLimit(cpuCount - 1); // 留一个核给主线程

// 请求队列
async function handlePreviewRequest(req, res) {
  try {
    const result = await limit(() => generatePreview(req.body.zipBuffer));
    res.send(result);
  } catch (err) {
    if (err.message === 'QUEUE_FULL') {
      res.status(503).send('服务繁忙，请稍后重试');
    } else {
      res.status(500).send('生成失败');
    }
  }
}
\`\`\`

### Worker 线程池

\`\`\`javascript
const { Worker } = require('worker_threads');
const genericPool = require('generic-pool');

// 创建 Worker 线程池
const workerPool = genericPool.createPool({
  create: () => new Promise((resolve, reject) => {
    const worker = new Worker('./canvas-worker.js');
    worker.once('online', () => resolve(worker));
    worker.once('error', reject);
  }),
  destroy: (worker) => {
    worker.terminate();
    return Promise.resolve();
  }
}, {
  min: 2,
  max: cpuCount - 1,
  acquireTimeoutMillis: 30000 // 30秒获取不到Worker则超时
});

async function generatePreview(zipBuffer) {
  const worker = await workerPool.acquire();
  try {
    return await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('生成超时'));
      }, 60000);

      worker.postMessage({ type: 'generate', data: zipBuffer });
      worker.once('message', (result) => {
        clearTimeout(timeout);
        resolve(result);
      });
      worker.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  } finally {
    workerPool.release(worker);
  }
}
\`\`\`

### 内存管理

\`\`\`javascript
// Canvas Worker 中的内存管理
function generateInWorker(zipBuffer) {
  let canvas, ctx, images = [];
  try {
    const assets = extractZip(zipBuffer);
    canvas = createCanvas(assets.config.width, assets.config.height);
    ctx = canvas.getContext('2d');

    // 逐层绘制
    for (const layer of assets.config.layers) {
      const img = loadImageSync(assets[layer.file]);
      images.push(img);
      drawLayer(ctx, img, layer);
    }

    const result = canvas.toBuffer('image/png');
    return result;
  } finally {
    // 主动释放资源
    images.forEach(img => img.src = null);
    images = [];
    if (canvas) {
      ctx = null;
      canvas.width = 0;
      canvas.height = 0;
      canvas = null;
    }
    // 建议 GC（不保证立即执行）
    if (global.gc) global.gc();
  }
}
\`\`\`

### 监控与告警

\`\`\`javascript
// 监控关键指标
setInterval(() => {
  const memUsage = process.memoryUsage();
  const metrics = {
    heapUsed: memUsage.heapUsed / 1024 / 1024, // MB
    workerPoolSize: workerPool.size,
    workerPoolAvailable: workerPool.available,
    workerPoolPending: workerPool.pending,
    queueLength: pendingRequests
  };
  reportMetrics(metrics);

  // 内存超过阈值告警
  if (metrics.heapUsed > 512) {
    alertOncall('Canvas 服务内存使用超 512MB');
  }
}, 10000);
\`\`\`

### 追问：如果 Worker 线程挂了（OOM），如何保证服务不中断？

**答案：**
1. **Worker 健康检查**：每 30 秒发心跳消息，无响应则标记为不健康
2. **自动重建**：不健康的 Worker 被销毁，线程池自动创建新 Worker 补充
3. **进程守护**：PM2 监控主进程，OOM 自动重启
4. **请求超时**：单个请求最多等 60 秒，超时返回错误，不无限阻塞
5. **限流**：队列满时直接返回 503，保护服务不被打垮`
  },
]
