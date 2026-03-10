import type { Question } from './types'

export const performanceQuestions: Question[] = [
  {
    id: 601,
    title: '前端性能优化的维度有哪些？',
    category: '加载性能',
    difficulty: 'medium',
    content: `## 前端性能优化的维度有哪些？

**答案：**

**加载性能：**
1. 减少资源体积：代码压缩、Tree Shaking、图片压缩、gzip/Brotli
2. 减少请求数：合并资源、雪碧图、内联小资源
3. 加快资源加载：CDN、HTTP/2 多路复用、预加载（preload/prefetch）
4. 缓存策略：强缓存 + 协商缓存、Service Worker

**渲染性能：**
1. 减少重排重绘：使用 transform/opacity 做动画
2. 虚拟列表：大数据列表只渲染可视区域
3. 懒加载：图片、组件、路由按需加载
4. 骨架屏：提升感知性能

**代码性能：**
1. 防抖/节流：减少高频事件处理
2. Web Worker：CPU 密集型任务移到 Worker
3. 内存管理：避免内存泄漏

**追问：** 如何衡量前端性能？

**答案：**
使用 Core Web Vitals：
- **LCP**（最大内容绘制）：< 2.5s
- **FID/INP**（首次输入延迟/交互到下一帧）：< 100ms/200ms
- **CLS**（累积布局偏移）：< 0.1

工具：Chrome DevTools Performance、Lighthouse、WebPageTest、\`performance.getEntriesByType()\``,
    tags: ['性能优化', 'Core Web Vitals', '加载性能', '渲染性能']
  },
  {
    id: 602,
    title: '图片优化有哪些策略？',
    category: '加载性能',
    difficulty: 'medium',
    content: `## 图片优化有哪些策略？

**答案：**

1. **选择合适格式**：
   - WebP：比 JPEG 小 25-35%，比 PNG 小 26%，现代浏览器支持
   - AVIF：比 WebP 更小，但编码慢，兼容性较差
   - SVG：图标/矢量图，无限缩放
   - JPEG：照片，有损压缩
   - PNG：需要透明度的图片

2. **压缩**：使用 \`sharp\`、\`imagemin\` 等工具压缩

3. **响应式图片**：
\`\`\`html
<img srcset="img-320.jpg 320w, img-640.jpg 640w"
     sizes="(max-width: 320px) 280px, 640px"
     src="img-640.jpg" />
\`\`\`

4. **懒加载**：\`loading="lazy"\` 或 IntersectionObserver

5. **CDN + 图片处理**：阿里云 OSS 支持 URL 参数动态裁剪、压缩、格式转换

**追问：** 你是如何实现图片上传优化的？

**答案：**
1. **自动旋转**：读取 EXIF 信息，修正手机拍摄的旋转问题
2. **裁剪**：基于 \`cropperjs\` 让用户裁剪到合适比例
3. **压缩**：上传前用 Canvas 压缩图片（控制质量参数），降低服务器负载
4. **上传到 OSS**：直传 OSS（前端直接上传，不经过后端），减少服务器带宽`,
    tags: ['图片优化', 'WebP', '懒加载', 'CDN']
  },
  {
    id: 603,
    title: '什么是首屏优化？有哪些方案？',
    category: '加载性能',
    difficulty: 'hard',
    content: `## 什么是首屏优化？有哪些方案？

**答案：**
首屏优化目标：让用户尽快看到有意义的内容。

**方案：**
1. **路由懒加载**：只加载当前路由需要的代码
2. **组件懒加载**：\`defineAsyncComponent\`
3. **骨架屏**：在内容加载前显示占位骨架，提升感知速度
4. **SSR/SSG**：服务端渲染，直接返回完整 HTML
5. **预渲染**：构建时生成静态 HTML（适合内容不频繁变化的页面）
6. **关键 CSS 内联**：将首屏 CSS 内联到 HTML，避免阻塞渲染
7. **资源预加载**：\`<link rel="preload">\` 提前加载关键资源

**追问：** 你是如何优化首屏性能的？

**答案：**
1. **骨架屏加载**：首屏显示骨架屏，减少白屏时间
2. **优先展示客户端缓存数据**：先展示上次缓存的数据，同时后台请求最新数据
3. **加载耗时监控**：建立性能监控体系，持续追踪优化效果
4. **活动卡券占位显示**：异步加载的内容先显示占位，避免布局抖动（CLS）`,
    tags: ['首屏优化', '骨架屏', 'SSR', '懒加载']
  },
  {
    id: 604,
    title: '什么是虚拟滚动？如何实现？',
    category: '渲染性能',
    difficulty: 'hard',
    content: `## 什么是虚拟滚动？如何实现？

**答案：**
虚拟滚动只渲染可视区域内的列表项，其余用占位元素撑开高度，大幅减少 DOM 节点数量。

**实现原理：**
\`\`\`javascript
const itemHeight = 50
const containerHeight = 600
const visibleCount = Math.ceil(containerHeight / itemHeight) + 2

const scrollTop = container.scrollTop
const startIndex = Math.floor(scrollTop / itemHeight)
const endIndex = startIndex + visibleCount

// 渲染 startIndex 到 endIndex 的数据
// 用 transform: translateY 定位到正确位置
\`\`\`

使用 \`el-table-v2\`（ElementPlus 虚拟表格）处理万级数据，渲染性能提升 300%。

**追问：** 虚拟滚动如何处理不定高列表项？

**答案：**
1. **预估高度**：先用预估高度渲染，渲染后测量实际高度，更新缓存
2. **动态高度缓存**：维护每项的实际高度和累计高度数组
3. **二分查找**：根据 scrollTop 用二分查找确定起始索引（O(log n)）
4. 库推荐：\`vue-virtual-scroller\`（支持动态高度）`,
    tags: ['虚拟滚动', '虚拟列表', 'DOM优化', '大数据渲染']
  },
  {
    id: 605,
    title: '什么是懒加载？如何实现图片懒加载？',
    category: '加载性能',
    difficulty: 'easy',
    content: `## 什么是懒加载？如何实现图片懒加载？

**答案：**
懒加载是延迟加载非关键资源，只在需要时才加载。

**方案一：原生 loading="lazy"（推荐）**
\`\`\`html
<img src="image.jpg" loading="lazy" alt="..." />
\`\`\`

**方案二：IntersectionObserver**
\`\`\`javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      observer.unobserve(img)
    }
  })
}, { rootMargin: '200px' }) // 提前 200px 加载

document.querySelectorAll('img[data-src]')
  .forEach(img => observer.observe(img))
\`\`\`

**追问：** 你是如何实现图片懒加载的？

**答案：**
使用 IntersectionObserver 监听图片进入视口，配合 \`rootMargin\` 提前加载，避免用户看到空白图片。同时结合虚拟滚动，对超长列表只渲染可视区域的图片，大幅减少内存占用。`,
    tags: ['懒加载', 'IntersectionObserver', '图片优化']
  },
  {
    id: 606,
    title: '什么是 requestIdleCallback 在性能优化中的应用？',
    category: '代码性能',
    difficulty: 'medium',
    content: `## 什么是 requestIdleCallback 在性能优化中的应用？

**答案：**
\`requestIdleCallback\` 在浏览器空闲时执行低优先级任务，不影响关键渲染：

\`\`\`javascript
function processData(data) {
  let index = 0
  function process(deadline) {
    while (deadline.timeRemaining() > 0 && index < data.length) {
      doWork(data[index++])
    }
    if (index < data.length) {
      requestIdleCallback(process)
    }
  }
  requestIdleCallback(process)
}
\`\`\`

**应用场景：**
1. 非关键数据上报（埋点）
2. 预加载下一页数据
3. 大量数据的初始化处理
4. 清理过期缓存

**追问：** React Fiber 和 requestIdleCallback 的关系？

**答案：**
React Fiber 的时间切片思想与 \`requestIdleCallback\` 类似，但 React 没有直接使用它（因为调用频率不稳定，且不支持 IE）。React 自己实现了调度器（Scheduler），用 \`MessageChannel\` 模拟，在每帧的空闲时间执行渲染任务。`,
    tags: ['requestIdleCallback', '任务调度', 'React Fiber', '时间切片']
  },
  {
    id: 607,
    title: '如何优化 JavaScript 执行性能？',
    category: '代码性能',
    difficulty: 'medium',
    content: `## 如何优化 JavaScript 执行性能？

**答案：**
1. **避免长任务**：将超过 50ms 的任务分割（setTimeout/rIC）
2. **减少 DOM 操作**：批量操作，使用 DocumentFragment
3. **使用 Web Worker**：CPU 密集型计算移到 Worker
4. **避免内存泄漏**：及时清理事件监听、定时器、闭包引用
5. **使用合适的数据结构**：Map/Set 的查找是 O(1)，Array 是 O(n)
6. **避免频繁的垃圾回收**：复用对象，避免在循环中创建大量临时对象
7. **代码分割**：按需加载，减少初始 JS 体积

**追问：** 如何检测 JavaScript 性能瓶颈？

**答案：**
1. Chrome DevTools Performance 面板：录制运行时性能，查看 JS 执行时间、调用栈
2. \`console.time/timeEnd\`：简单计时
3. \`performance.mark/measure\`：精确测量
4. Lighthouse：综合性能评分和建议
5. 查找长任务：Performance 面板中红色标记的任务`,
    tags: ['JS性能', 'Web Worker', '内存泄漏', '长任务']
  },
  {
    id: 608,
    title: 'preload、prefetch、preconnect 的区别？',
    category: '加载性能',
    difficulty: 'easy',
    content: `## preload、prefetch、preconnect 的区别？

**答案：**

- **preload**：高优先级，加载当前页面**必须**的资源，不阻塞解析但提前下载
\`\`\`html
<link rel="preload" href="font.woff2" as="font" crossorigin>
<link rel="preload" href="critical.js" as="script">
\`\`\`

- **prefetch**：低优先级，加载**下一页**可能需要的资源，浏览器空闲时下载
\`\`\`html
<link rel="prefetch" href="/next-page.js">
\`\`\`

- **preconnect**：提前建立 TCP+TLS 连接，适合已知的第三方域名
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
\`\`\`

- **dns-prefetch**：只做 DNS 解析，比 preconnect 开销小

**追问：** 什么时候用 preload，什么时候用 prefetch？

**答案：**
- \`preload\`：当前页面关键资源（首屏字体、关键 CSS、Hero 图片），避免渲染阻塞
- \`prefetch\`：用户可能访问的下一页资源，如搜索结果页预加载详情页`,
    tags: ['preload', 'prefetch', 'preconnect', '资源预加载']
  },
  {
    id: 609,
    title: '如何优化 CSS 性能？',
    category: '渲染性能',
    difficulty: 'medium',
    content: `## 如何优化 CSS 性能？

**答案：**
1. **减少选择器复杂度**：避免深层嵌套，避免通配符
2. **避免使用 @import**：改用 \`<link>\`，并行加载
3. **关键 CSS 内联**：首屏 CSS 内联到 HTML，减少阻塞
4. **CSS 压缩**：\`cssnano\`
5. **移除未使用的 CSS**：PurgeCSS、Tailwind CSS 的 JIT 模式
6. **使用 will-change 提升合成层**：但不要滥用
7. **避免触发重排的属性**：用 \`transform\` 代替 \`top/left\`
8. **CSS 变量**：减少重复值，便于主题切换

**追问：** 如何检测未使用的 CSS？

**答案：**
1. Chrome DevTools Coverage 面板：显示每个文件中未使用的代码比例
2. PurgeCSS：分析 HTML/JS 文件，删除未使用的 CSS 类
3. Tailwind CSS JIT：只生成实际使用的工具类`,
    tags: ['CSS性能', 'PurgeCSS', '重排重绘', '关键CSS']
  },
  {
    id: 610,
    title: '什么是 Long Tasks API？如何监控长任务？',
    category: '性能监控',
    difficulty: 'medium',
    content: `## 什么是 Long Tasks API？如何监控长任务？

**答案：**
\`\`\`javascript
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (entry.duration > 50) {
      console.warn('长任务：', entry.duration, 'ms', entry.attribution)
      reportLongTask(entry)
    }
  })
})
observer.observe({ entryTypes: ['longtask'] })
\`\`\`

**追问：** 发现长任务后如何优化？

**答案：**
1. 分析调用栈，找到耗时的函数
2. 将大循环分割为小任务（\`setTimeout(0)\` 或 \`scheduler.yield()\`）
3. 将计算密集型任务移到 Web Worker
4. 使用 \`requestIdleCallback\` 延迟非关键任务
5. 优化算法复杂度（O(n²) → O(n log n)）`,
    tags: ['Long Tasks', 'PerformanceObserver', '性能监控', '长任务']
  },
  {
    id: 611,
    title: '如何优化 Web 字体加载？',
    category: '加载性能',
    difficulty: 'easy',
    content: `## 如何优化 Web 字体加载？

**答案：**
1. **font-display: swap**：先用系统字体显示，字体加载完后替换，避免 FOIT
2. **预加载关键字体**：\`<link rel="preload" href="font.woff2" as="font" crossorigin>\`
3. **只加载需要的字符集**：使用 \`unicode-range\` 按需加载
4. **使用 woff2 格式**：比 woff 小 30%
5. **字体子集化**：只包含实际使用的字符（如中文只包含常用汉字）
6. **系统字体栈**：尽量使用系统字体，避免加载外部字体

**追问：** font-display 有哪些值？

**答案：**
- \`auto\`：浏览器默认行为
- \`block\`：短暂不可见，然后显示（FOIT）
- \`swap\`：立即显示备用字体，加载完后替换（FOUT）
- \`fallback\`：极短暂不可见，然后显示备用字体，如果字体加载太慢则不替换
- \`optional\`：极短暂不可见，如果字体没有立即可用则不使用`,
    tags: ['Web字体', 'font-display', 'woff2', '字体优化']
  },
  {
    id: 612,
    title: '什么是 PerformanceObserver？如何监控页面性能？',
    category: '性能监控',
    difficulty: 'hard',
    content: `## 什么是 PerformanceObserver？如何监控页面性能？

**答案：**
\`\`\`javascript
// 监控 LCP
new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const lcp = entries[entries.length - 1]
  console.log('LCP:', lcp.startTime)
}).observe({ entryTypes: ['largest-contentful-paint'] })

// 监控 CLS
let clsValue = 0
new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (!entry.hadRecentInput) clsValue += entry.value
  })
}).observe({ entryTypes: ['layout-shift'] })

// 监控 FID
new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime)
  })
}).observe({ entryTypes: ['first-input'] })
\`\`\`

**追问：** 如何将性能数据上报到后端？

**答案：**
\`\`\`javascript
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/analytics', JSON.stringify({
      lcp: lcpValue, cls: clsValue,
      url: location.href, userAgent: navigator.userAgent
    }))
  }
})
\`\`\``,
    tags: ['PerformanceObserver', 'LCP', 'CLS', 'FID', '性能监控']
  },
  {
    id: 613,
    title: '如何优化 React/Vue 的渲染性能？',
    category: '渲染性能',
    difficulty: 'hard',
    content: `## 如何优化 React/Vue 的渲染性能？

**答案：**

**Vue 3 优化：**
1. \`v-memo\`：缓存模板子树
2. \`shallowRef/shallowReactive\`：避免不必要的深度响应
3. \`KeepAlive\`：缓存组件实例
4. \`defineAsyncComponent\`：异步加载组件
5. 合理使用 \`computed\`：缓存计算结果
6. 避免在模板中使用复杂表达式

**通用优化：**
1. 虚拟列表：大数据列表
2. 防抖/节流：高频事件
3. 图片懒加载
4. 代码分割：路由/组件懒加载

**追问：** Vue 3 的编译优化如何减少不必要的渲染？

**答案：**
1. **Patch Flag**：标记动态节点类型，diff 时只比较有标记的部分，跳过静态节点
2. **Block Tree**：将动态节点收集到 block 数组，diff 时直接比较 block 中的节点
3. **静态提升**：静态节点只创建一次，不在每次渲染时重新创建`,
    tags: ['Vue优化', 'React优化', '渲染性能', 'Patch Flag']
  },
  {
    id: 614,
    title: '什么是内存泄漏？如何检测和修复？',
    category: '代码性能',
    difficulty: 'hard',
    content: `## 什么是内存泄漏？如何检测和修复？

**答案：**

**常见内存泄漏：**
1. 未清除的事件监听器
2. 未清除的定时器（setInterval）
3. 闭包持有大对象引用
4. DOM 引用（JS 中保存了已删除 DOM 的引用）
5. 全局变量
6. 无限增长的缓存

**检测方法：**
1. Chrome DevTools Memory 面板：堆快照（Heap Snapshot）对比
2. 录制内存时间线：观察内存是否持续增长
3. \`performance.memory\`：监控 JS 堆内存

**修复：**
\`\`\`javascript
// Vue 3 中正确清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  clearInterval(timer)
  observer.disconnect()
  controller.abort() // 取消请求
})
\`\`\`

**追问：** 如何检测 Vue 组件的内存泄漏？

**答案：**
1. 在 Chrome DevTools Memory 中录制堆快照
2. 多次挂载/卸载组件
3. 再次录制堆快照
4. 比较两次快照，查找未被回收的组件实例
5. 常见原因：全局事件总线未解绑、Pinia store 中保存了组件引用`,
    tags: ['内存泄漏', 'Heap Snapshot', 'DevTools', '垃圾回收']
  },
  {
    id: 615,
    title: '什么是 Bundle Analyzer？如何分析打包体积？',
    category: '构建优化',
    difficulty: 'medium',
    content: `## 什么是 Bundle Analyzer？如何分析打包体积？

**答案：**
Bundle Analyzer 可视化展示打包后各模块的体积：

\`\`\`javascript
// Webpack
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
plugins: [new BundleAnalyzerPlugin()]

// Vite
import { visualizer } from 'rollup-plugin-visualizer'
plugins: [visualizer({ open: true })]
\`\`\`

**分析后的优化方向：**
1. 找出体积最大的包，考虑是否可以替换为更小的替代品
2. 检查是否有重复打包的模块
3. 确认第三方库是否支持 Tree Shaking
4. 将大型库改为 CDN 引入（externals）

**追问：** 如何减少 lodash 的打包体积？

**答案：**
1. 按需引入：\`import debounce from 'lodash/debounce'\`
2. 使用 \`lodash-es\`：ES Module 版本，支持 Tree Shaking
3. 使用 \`babel-plugin-lodash\`：自动转换为按需引入
4. 替换为更小的替代品：如用原生 \`Array.prototype\` 方法替代 lodash 数组方法`,
    tags: ['Bundle Analyzer', '打包体积', 'Tree Shaking', 'lodash']
  },
  {
    id: 616,
    title: '什么是 HTTP/2 Server Push？',
    category: '网络优化',
    difficulty: 'medium',
    content: `## 什么是 HTTP/2 Server Push？

**答案：**
HTTP/2 Server Push 允许服务器在客户端请求之前主动推送资源：

\`\`\`nginx
# Nginx 配置
location = /index.html {
  http2_push /style.css;
  http2_push /app.js;
}
\`\`\`

**优势：** 减少往返时间，客户端请求 HTML 时，服务器同时推送 CSS/JS

**局限性：**
1. 可能推送客户端已缓存的资源（浪费带宽）
2. HTTP/3 中已被废弃，推荐使用 \`103 Early Hints\` 替代

**追问：** 103 Early Hints 是什么？

**答案：**
\`103 Early Hints\` 是新的 HTTP 状态码，服务器在处理请求时提前发送资源提示，让浏览器提前开始加载资源，比 Server Push 更灵活（浏览器可以检查缓存，决定是否加载）。`,
    tags: ['HTTP/2', 'Server Push', 'Early Hints', '网络优化']
  },
  {
    id: 617,
    title: '如何优化动画性能？',
    category: '渲染性能',
    difficulty: 'medium',
    content: `## 如何优化动画性能？

**答案：**
1. **使用 transform 和 opacity**：只触发合成，不触发重排重绘
2. **will-change**：提前提升到合成层（GPU 加速）
3. **requestAnimationFrame**：与屏幕刷新同步，避免掉帧
4. **减少动画元素数量**：避免同时动画大量元素
5. **使用 CSS 动画而非 JS 动画**：CSS 动画可以在合成线程执行，不阻塞主线程
6. **避免在动画中触发重排**：不要在动画中读取 \`offsetWidth\` 等属性

**追问：** 你是如何优化动画性能的？

**答案：**
1. **监听页面退出事件自动暂停所有动画**：降低内存和 CPU 消耗
2. **针对 iOS/Android 差异适配**：不同平台的动画流畅度和样式渲染差异处理
3. **建立自测流程**：确保多端动画体验一致性`,
    tags: ['动画性能', 'transform', 'will-change', 'GPU加速']
  },
  {
    id: 618,
    title: 'Intersection Observer 在性能优化中的应用？',
    category: '渲染性能',
    difficulty: 'easy',
    content: `## Intersection Observer 在性能优化中的应用？

**答案：**
\`IntersectionObserver\` 是性能友好的可见性检测 API，替代滚动事件监听：

1. **图片懒加载**：元素进入视口时加载图片
2. **无限滚动**：底部哨兵元素进入视口时加载更多
3. **曝光统计**：元素可见时上报曝光事件
4. **动画触发**：元素进入视口时触发入场动画
5. **广告展示统计**

**性能优势：**
- 不在主线程执行，不阻塞渲染
- 不需要手动计算元素位置（避免触发重排）
- 浏览器原生优化

**追问：** 如何实现一个高性能的滚动动画？

**答案：**
\`\`\`javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in')
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.animate-target')
  .forEach(el => observer.observe(el))
\`\`\`
CSS 动画使用 \`transform\` 和 \`opacity\`，配合 \`will-change: transform\`。`,
    tags: ['IntersectionObserver', '懒加载', '曝光统计', '滚动优化']
  },
  {
    id: 619,
    title: '什么是 Critical Rendering Path 优化？',
    category: '渲染性能',
    difficulty: 'hard',
    content: `## 什么是 Critical Rendering Path（关键渲染路径）优化？

**答案：**
关键渲染路径是浏览器将 HTML/CSS/JS 转换为屏幕像素的过程。优化目标：减少关键资源数量和大小，缩短关键路径长度。

**优化策略：**
1. **减少关键资源**：延迟加载非关键 CSS/JS（defer/async）
2. **减少关键字节**：压缩 HTML/CSS/JS，gzip
3. **缩短关键路径长度**：减少阻塞渲染的资源
4. **内联关键 CSS**：首屏 CSS 内联，避免额外请求
5. **异步加载非关键 CSS**：\`<link rel="preload" as="style" onload="this.rel='stylesheet'">\`

**追问：** 什么是渲染阻塞资源？如何消除？

**答案：**
- **CSS**：默认阻塞渲染，优化：内联关键 CSS，异步加载非关键 CSS，使用媒体查询（\`media="print"\` 不阻塞）
- **JS**：默认阻塞 DOM 解析，优化：\`defer\`（延迟执行）、\`async\`（异步加载）、放在 \`</body>\` 前`,
    tags: ['关键渲染路径', 'CRP', '渲染阻塞', 'defer/async']
  },
  {
    id: 620,
    title: '如何实现前端监控系统？',
    category: '性能监控',
    difficulty: 'hard',
    content: `## 如何实现前端监控系统？

**答案：**

**监控维度：**
1. **性能监控**：LCP、FID、CLS、TTFB、页面加载时间
2. **错误监控**：JS 错误（\`window.onerror\`）、Promise 错误（\`unhandledrejection\`）、资源加载错误
3. **业务监控**：PV/UV、用户行为、转化率
4. **自定义指标**：加载耗时、广告展示耗时

**数据上报：**
\`\`\`javascript
// 错误监控
window.addEventListener('error', (e) => {
  report({ type: 'js_error', message: e.message, stack: e.error?.stack })
}, true)

window.addEventListener('unhandledrejection', (e) => {
  report({ type: 'promise_error', message: e.reason })
})

// 性能上报（页面隐藏时）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/monitor', JSON.stringify(metrics))
  }
})
\`\`\`

**追问：** 如何实现错误的精确定位（source map 还原）？

**答案：**
1. 生产环境生成 source map 但不公开（\`hidden-source-map\`）
2. 将 source map 上传到错误监控平台（如 Sentry）
3. 错误上报时包含错误堆栈（行号、列号）
4. 监控平台用 source map 将压缩后的行列号还原为源代码位置
5. 展示原始文件名、行号、代码片段`,
    tags: ['前端监控', 'Sentry', 'source map', '错误上报']
  },
]
