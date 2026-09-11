// 技术博客 - 内容第1部分（开篇+Node项目BFF架构+SSR性能优化）
export default `
# 三大核心项目技术深度剖析：面试实战问答录

> **写在前面**：这篇文章以面试问答的形式，完整还原了我在三个核心项目中的技术实践和思考。包括 QQ 运动 Node 服务端项目、QQ 运动 Kuikly 跨端项目、以及 imooc-cli 脚手架工具。每个项目都从架构设计、技术选型、难点攻克、性能优化等维度展开，力求让读者既能理解技术细节，又能感受到真实的工程决策过程。

---

## 第一章：QQ 运动 Node 服务端项目

---

### 面试官：先简单介绍一下你负责的 QQ 运动 Node 项目吧，整体架构是怎样的？

好的。QQ 运动是 QQ 内置的运动健康模块，日均 PV 超过 1000 万，UV 超过 500 万。我负责的是整个 Node 服务端的架构设计和核心功能开发。

整体架构采用的是 **BFF（Backend For Frontend）+ SSR** 的模式。简单来说，我们在前端和后端微服务之间加了一层 Node.js 中间层，这层 BFF 负责三件核心的事情：

1. **接口聚合**：把后端多个微服务的数据聚合成前端需要的格式
2. **SSR 渲染**：在服务端完成首屏 HTML 的渲染，直接返回给客户端
3. **统一鉴权**：所有请求在 BFF 层统一做登录态校验

技术栈方面，后端用的是 **Koa + TypeScript**，前端用 **Vue 3 + Vite**，通信协议用的是腾讯内部的 **TRPC**，进程管理用 **PM2**，监控用 **OpenTelemetry + Aegis**。

整个项目大概 5 万行代码，14 个 SSR 页面，20+ 个 CGI 接口，团队 3 个前端 + 2 个后端。

---

### 面试官：为什么要引入 BFF 层？直接前端调后端微服务不行吗？

这个问题问得很好，其实我们最早就是前端直接调后端微服务的，但遇到了很多痛点。

**第一个痛点是接口碎片化。** 比如首页需要展示用户步数、好友排行、打卡状态、活动信息，这些数据分散在 4 个不同的微服务里。前端需要发 4 个请求，然后自己做数据拼装。如果某个接口慢了或者挂了，整个页面的加载体验都会受影响。

引入 BFF 后，前端只需要调一个接口，BFF 内部用 \`Promise.allSettled\` 并发请求 4 个微服务，单个接口失败不影响整体：

\`\`\`typescript
// BFF 层并发请求多个微服务
const [entryPageDataRes, isBlockRes, rankDataRes, activityRes] = 
  await Promise.allSettled([
    trpcRequest.request('user_server', 'GetEntryPageData', { uin }),
    trpcRequest.request('user_server', 'IsBlock', { uin }),
    trpcRequest.request('rank_server', 'GetRankData', { uin }),
    trpcRequest.request('activity_server', 'GetActivity', { uin }),
  ]);

// 单个接口失败时降级处理，不影响整体渲染
const entryData = entryPageDataRes.status === 'fulfilled' 
  ? entryPageDataRes.value 
  : defaultEntryData;
\`\`\`

**第二个痛点是数据裁剪。** 后端微服务返回的数据往往包含很多前端不需要的字段，比如内部 ID、审计字段、冗余嵌套等。以前前端拿到一个 200 字段的大 JSON，实际只用 20 个字段，既浪费带宽又增加解析时间。BFF 层可以做精确的数据裁剪，只返回前端需要的字段。

**第三个痛点是鉴权分散。** 以前每个页面都要自己处理登录态校验，代码重复且容易遗漏。BFF 层统一在中间件里做鉴权，所有请求都经过同一套校验逻辑：

\`\`\`typescript
// Koa 中间件统一鉴权
app.use(async (ctx, next) => {
  const { uin, skey, pskey } = parseCookies(ctx);
  
  if (!pskey) {
    // pskey 不存在，跳转 PTLogin 刷新
    ctx.redirect(getPTLoginUrl());
    return;
  }
  
  // GTK 校验
  const gtk = getGTK(pskey);
  
  // PTLogin 二次鉴权
  const authResult = await ptLoginAuth(uin, pskey);
  if (!authResult.success) {
    ctx.status = 401;
    return;
  }
  
  ctx.state.user = { uin, gtk };
  await next();
});
\`\`\`

**第四个痛点是类型安全。** 前端直接调后端接口，接口文档经常过时，字段类型不确定。引入 BFF 后，我们用 TypeScript 定义了完整的接口类型，前后端共享类型定义，编译期就能发现类型不匹配的问题。

总结一下，引入 BFF 后的收益：
- 前端请求数从平均 4-5 个降到 1 个，**首屏请求减少 80%**
- 数据传输量减少约 60%（裁剪掉不需要的字段）
- 前端开发效率提升约 50%（不需要关心后端接口细节）
- 鉴权逻辑统一，安全漏洞减少

---

### 面试官：BFF 层会不会成为性能瓶颈？你们怎么保证 BFF 的性能和稳定性？

这确实是引入 BFF 后最需要关注的问题。我们从几个维度来保障：

**第一，多进程架构。** 我们用 PM2 管理 Node 进程，4 核 CPU 启动 4 个 Worker 进程，每个进程独立处理请求。单个进程挂了不影响其他进程，PM2 会自动重启：

\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'qq-sport',
    script: './dist/server/index.js',
    instances: 'max',        // 根据 CPU 核数启动进程
    exec_mode: 'cluster',    // cluster 模式
    max_memory_restart: '300M', // 内存超限自动重启
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    merge_logs: true,
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    }
  }]
};
\`\`\`

**第二，请求超时控制。** 所有 TRPC 请求都设置了超时时间，默认 3 秒。超时后立即返回降级数据，不会让用户一直等：

\`\`\`typescript
const response = await Promise.race([
  trpcRequest.request('user_server', 'GetData', params),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 3000)
  )
]);
\`\`\`

**第三，缓存策略。** 页面配置、模板等不经常变化的数据，在生产环境做了内存缓存。首次加载 150ms，缓存命中后只需 5ms，**性能提升 97%**。

**第四，健康检查。** PM2 配合 K8s 的 liveness probe 和 readiness probe，定期检查进程健康状态。不健康的 Pod 会被自动替换。

最终的稳定性指标：
- 可用性：**99.99%**
- 平均响应时间：**50ms**
- P99 响应时间：**200ms**
- 错误率：**0.01%**

---

### 面试官：SSR 这块具体是怎么做的？性能优化做了哪些？

SSR 是这个项目的核心亮点之一。我们用的是 **Vue 3 + Vite SSR**，整个渲染流程是这样的：

1. 用户请求到达 BFF 层
2. BFF 并发请求后端微服务获取数据
3. 将数据注入 Vue 组件，在服务端执行 \`renderToString\`
4. 生成完整的 HTML 字符串，包含首屏数据和预加载资源链接
5. 返回给客户端，客户端直接展示 HTML
6. 客户端 JS 加载完成后执行 Hydration（水合），接管交互

**性能优化方面，我们做了以下几个关键措施：**

**优化 1：并发数据预取**

这是收益最大的一个优化。之前数据请求是串行的，改成并发后 TTFB 从 800ms 降到 300ms：

\`\`\`typescript
// 优化前：串行请求
const userData = await getUserData(uin);      // 200ms
const rankData = await getRankData(uin);      // 200ms
const activityData = await getActivityData(); // 200ms
const configData = await getConfigData();     // 200ms
// 总耗时：800ms

// 优化后：并发请求
const [userData, rankData, activityData, configData] = 
  await Promise.allSettled([
    getUserData(uin),       // 200ms
    getRankData(uin),       // 200ms  ← 同时执行
    getActivityData(),      // 200ms  ← 同时执行
    getConfigData(),        // 200ms  ← 同时执行
  ]);
// 总耗时：200ms（取最慢的那个）
\`\`\`

| 方案 | TTFB | 首屏时间 | 改善 |
|---|---|---|---|
| 串行请求 | 800ms | 1200ms | - |
| 并发请求 | 300ms | 600ms | **50%↓** |

**优化 2：页面配置缓存**

页面配置（路由、组件映射、SEO 信息等）在生产环境做了内存缓存。第一次请求时从配置文件读取并缓存，后续请求直接从内存获取：

\`\`\`typescript
const configCache = new Map<string, PageConfig>();

function getPageConfig(pageName: string): PageConfig {
  if (process.env.NODE_ENV === 'production' && configCache.has(pageName)) {
    return configCache.get(pageName)!; // 缓存命中：5ms
  }
  
  const config = loadConfigFromFile(pageName); // 首次加载：150ms
  
  if (process.env.NODE_ENV === 'production') {
    configCache.set(pageName, config);
  }
  
  return config;
}
\`\`\`

首次加载 150ms，缓存命中 5ms，**提升 97%**。开发环境不缓存，保证修改配置后立即生效。

**优化 3：资源预加载**

根据 Vite SSR Manifest 文件，在 HTML 中自动注入 preload 链接，让浏览器提前下载关键资源：

\`\`\`typescript
function renderPreloadLinks(modules: Set<string>, manifest: Record<string, string[]>) {
  let links = '';
  modules.forEach(id => {
    const files = manifest[id];
    if (files) {
      files.forEach(file => {
        if (file.endsWith('.js')) {
          links += \`<link rel="modulepreload" crossorigin href="\${file}">\`;
        } else if (file.endsWith('.css')) {
          links += \`<link rel="stylesheet" href="\${file}">\`;
        }
      });
    }
  });
  return links;
}
\`\`\`

这个优化让 FCP（First Contentful Paint）提升了约 **30%**。

**优化 4：Hydration 问题处理**

SSR 最常见的坑就是 Hydration Mismatch（水合不匹配），就是服务端渲染的 HTML 和客户端渲染的不一致。我们遇到过几个典型场景：

1. **时间戳不一致**：服务端渲染时用的是服务器时间，客户端用的是用户本地时间。解决方案是服务端把时间戳通过 \`window.__SSR_DATA__\` 传给客户端，客户端统一使用服务端时间。

2. **随机数不一致**：有些组件用 \`Math.random()\` 生成 key，服务端和客户端生成的不一样。解决方案是用确定性的 key（如数据 ID）。

3. **浏览器特有 API**：服务端没有 \`window\`、\`document\` 等对象。解决方案是把这些逻辑放到 \`onMounted\` 生命周期中执行。

\`\`\`typescript
// ❌ 错误：服务端没有 window
const width = window.innerWidth;

// ✅ 正确：放到 onMounted 中
onMounted(() => {
  const width = window.innerWidth;
});
\`\`\`

**优化 5：包体积优化**

通过 Vite 的 Tree Shaking、代码分割、动态导入等手段，将包体积从 500KB 压缩到 200KB，**减少 60%**：

\`\`\`typescript
// 路由级别的代码分割
const RunPage = () => import('./pages/RunPage.vue');
const RankPage = () => import('./pages/RankPage.vue');
\`\`\`

**最终的性能指标：**

| 指标 | 优化前 | 优化后 | 改善 |
|---|---|---|---|
| **首屏时间** | 1200ms | 600ms | **50%↓** |
| **FCP** | 800ms | 300ms | **62%↓** |
| **LCP** | 1500ms | 600ms | **60%↓** |
| **TTI** | 2000ms | 800ms | **60%↓** |
| **包体积** | 500KB | 200KB | **60%↓** |

这些指标在行业内都属于优秀水平（FCP < 1s，LCP < 2.5s，TTI < 3.5s）。

---

### 面试官：SSR 的开发体验怎么样？HMR 热更新支持吗？

开发体验是我们非常重视的一个方面。Vite 天然支持 SSR 的 HMR，修改代码后不需要重启服务，页面自动刷新，HMR 延迟控制在 **200ms 以内**。

我们还做了一些额外的开发体验优化：

1. **命令行工具自动生成页面**：新建一个 SSR 页面只需要执行一条命令，自动生成路由配置、页面组件、数据获取逻辑等模板代码
2. **TypeScript 全覆盖**：所有代码都用 TypeScript 编写，IDE 有完整的类型提示和自动补全
3. **详细的错误提示**：开发环境下，SSR 渲染错误会在页面上直接显示错误堆栈，方便定位问题
4. **Mock 数据支持**：后端接口还没开发好时，可以用 Mock 数据先行开发前端页面

---

### 面试官：你提到了多进程架构，能详细说说 PM2 的配置和零停机重启是怎么实现的吗？

PM2 的 cluster 模式底层用的是 Node.js 的 \`cluster\` 模块。Master 进程负责管理 Worker 进程，Worker 进程负责处理实际请求。

**零停机重启的原理：**

当执行 \`pm2 reload\` 时，PM2 不会一次性杀掉所有 Worker，而是逐个重启：

1. 先启动一个新的 Worker 进程
2. 新 Worker 准备就绪后，将流量切到新 Worker
3. 等旧 Worker 处理完当前请求后，优雅关闭旧 Worker
4. 重复以上步骤，直到所有 Worker 都更新完毕

整个过程中始终有 Worker 在处理请求，用户完全无感知。

\`\`\`javascript
// 优雅关闭处理
process.on('SIGINT', async () => {
  // 停止接收新请求
  server.close();
  
  // 等待正在处理的请求完成（最多等 10 秒）
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // 关闭数据库连接等资源
  await cleanup();
  
  process.exit(0);
});
\`\`\`

**内存泄漏防护：**

PM2 配置了 \`max_memory_restart: '300M'\`，当单个 Worker 内存超过 300MB 时自动重启。这是一个兜底策略，防止内存泄漏导致服务不可用。

**日志管理：**

PM2 自带日志轮转功能，配合 \`pm2-logrotate\` 插件，按日期自动切割日志文件，避免单个日志文件过大。错误日志和普通日志分开存储，方便排查问题。
`
