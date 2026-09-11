// QQ运动Node项目解析 - 内容第1部分（项目概述 + 技术栈 + 架构设计）
export default `# QQ 运动 Node 服务项目深度剖析（第 1 部分）

> 作者：AI 技术分析  
> 日期：2026-04-10  
> 项目：yundong.qq.com  
> 代码行数：约 50,000+行

---

## 一、项目概述

### 1.1 项目背景

QQ 运动是腾讯旗下的运动健康平台，集成在手机 QQ 中，为数亿用户提供运动记录、排行榜、健康数据管理等服务。本项目是 QQ 运动的**Node.js BFF（Backend For Frontend）服务**，承担着前端页面 SSR 渲染、TRPC 服务转发、CGI 聚合等核心职责。

### 1.2 项目规模

\`\`\`
项目统计数据：
├── 总代码行数：~50,000+ 行
├── 核心业务页面：14个SSR页面
├── 公共组件：10+ 个
├── TRPC服务：5个微服务对接
├── 日均PV：千万级
└── 部署方式：Docker + K8s + PM2集群
\`\`\`

### 1.3 核心功能模块

\`\`\`mermaid
graph TB
    A[QQ运动Node服务] --> B[SSR页面渲染]
    A --> C[TRPC服务转发]
    A --> D[CGI聚合]
    A --> E[登录态校验]
    B --> B1[跑步页面]
    B --> B2[结束页面]
    B --> B3[排行榜]
    B --> B4[个人中心]
    B --> B5[运动记录]
    C --> C1[用户服务]
    C --> C2[排行榜服务]
    C --> C3[积分服务]
    C --> C4[轨迹服务]
    C --> C5[分享服务]
    D --> D1[数据聚合]
    D --> D2[接口合并]
    E --> E1[Cookie校验]
    E --> E2[PTLogin鉴权]
\`\`\`

---

## 二、技术栈全景

### 2.1 核心技术栈

#### 后端技术栈

| 技术 | 版本 | 用途 |
|---|---|---|
| **Node.js** | v18.19.0 | 运行时环境 |
| **Koa** | ^2.15.3 | Web 框架 |
| **TypeScript** | ^5.4.5 | 类型系统 |
| **PM2** | - | 进程管理 |
| **TSW** | ^2.6.8 | 服务治理层 |
| **TRPC** | ^0.6.9 | RPC 通信框架 |
| **OpenTelemetry** | ^1.24.1 | 可观测性 |
| **Pinia** | ^2.1.7 | 状态管理（SSR） |

#### 前端技术栈

| 技术 | 版本 | 用途 |
|---|---|---|
| **Vue 3** | ^3.4.27 | 前端框架 |
| **Vite** | ^6.2.3 | 构建工具 |
| **Pinia** | ^2.1.7 | 状态管理 |
| **Less** | ^4.2.0 | CSS 预处理器 |
| **Axios** | ^1.13.1 | HTTP 客户端 |
| **Vitest** | ^1.6.0 | 单元测试 |
| **腾讯地图 SDK** | v1.exp | 地图服务 |

#### 监控与运维

| 技术 | 用途 |
|---|---|
| **伽利略（Galileo）** | 后端全链路追踪 |
| **Aegis（TAM）** | 前端性能监控 |
| **Winston** | 日志管理 |
| **Docker** | 容器化 |
| **TKEx（K8s）** | 容器编排 |

### 2.2 技术选型亮点

#### 1. SSR 架构选型

\`\`\`typescript
// 采用 Vite + Vue3 SSR 方案
// 优势：
// 1. 开发体验好：HMR热更新快
// 2. 构建速度快：esbuild编译
// 3. 生态完善：Vue3生态成熟
// 4. 类型安全：TypeScript全栈覆盖
\`\`\`

**对比传统方案：**

| 方案 | 开发体验 | 构建速度 | 首屏性能 | SEO |
|---|---|---|---|---|
| **Vite SSR** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Webpack SSR | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| CSR | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐ |

#### 2. BFF 层设计

\`\`\`
前端 → Node BFF → 后端微服务
\`\`\`

**BFF 层价值：**
- ✅ 统一登录态校验，后端服务无需重复鉴权
- ✅ 接口聚合，减少前端请求次数
- ✅ 数据裁剪，减少传输体积
- ✅ 类型共享，TRPC 自动推导类型
- ✅ 灰度发布，Node 层可独立灰度

#### 3. TRPC 通信框架

\`\`\`typescript
// TRPC 优势：
// 1. 类型安全：前后端类型自动同步
// 2. 性能高：二进制协议，比JSON快
// 3. 服务发现：自动负载均衡
// 4. 链路追踪：天然支持分布式追踪
\`\`\`

---

## 三、整体架构设计

### 3.1 系统架构图

\`\`\`mermaid
graph TB
    subgraph 用户层
        A1[手Q浏览器]
        A2[外部浏览器]
    end
    subgraph CDN层
        B1[腾讯云CDN]
        B2[静态资源]
    end
    subgraph 接入层
        C1[Nginx]
        C2[负载均衡]
    end
    subgraph Node服务层
        D1[PM2 Master]
        D2[TSW代理层]
        D3[Koa Worker 1]
        D4[Koa Worker 2]
        D5[Koa Worker N]
    end
    subgraph 后端服务层
        E1[用户服务]
        E2[排行榜服务]
        E3[积分服务]
        E4[轨迹服务]
        E5[分享服务]
    end
    subgraph 监控层
        F1[伽利略]
        F2[Aegis]
        F3[日志中心]
    end
    A1 --> C1
    A2 --> C1
    C1 --> B1
    C1 --> C2
    C2 --> D1
    D1 --> D2
    D2 --> D3
    D2 --> D4
    D2 --> D5
    D3 --> E1
    D3 --> E2
    D3 --> E3
    D3 --> E4
    D3 --> E5
    D4 --> E1
    D4 --> E2
    D4 --> E3
    D4 --> E4
    D4 --> E5
    D5 --> E1
    D5 --> E2
    D5 --> E3
    D5 --> E4
    D5 --> E5
    D3 --> F1
    D4 --> F1
    D5 --> F1
    A1 --> F2
    A2 --> F2
    D3 --> F3
    D4 --> F3
    D5 --> F3
\`\`\`

### 3.2 分层架构

#### 第一层：进程管理层（PM2）

\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'yundong.qq.com',
    script: './node_modules/@tswjs/tsw/dist/cli.js',
    instances: parseInt(TKEX_CPU, 10) || 4,
    exec_mode: 'cluster',
    wait_ready: true,
    kill_timeout: 10000,
  }],
};
\`\`\`

**PM2 职责：**
- 🔄 多进程管理：根据 CPU 核心数启动 Worker
- 🛡️ 进程守护：Worker 崩溃自动重启
- 📊 性能监控：CPU、内存实时监控
- 🔄 零停机重启：滚动重启不中断服务

#### 第二层：服务治理层（TSW）

\`\`\`javascript
// tsw/tswconfig.prod.js
module.exports = {
  winstonTransports: [
    new winston.transports.DailyRotateFile({
      dirname: 'log',
      filename: 'info-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxFiles: 5,
    }),
  ],
  plugins: [
    new OpenPlatformPlugin({
      reportStrategy: 'proxied',
      getUid,
    }),
  ],
};
\`\`\`

**TSW 职责：**
- 🎯 请求染色：TraceID 全链路追踪
- 📝 日志聚合：统一日志格式
- 🔍 性能分析：慢请求自动告警
- 🛡️ 流量控制：限流、熔断

#### 第三层：Web 框架层（Koa）

\`\`\`typescript
// src/index.ts
const app = new Koa();
const router = new Router();
app.use(asyncStore(defaultStoreMaker));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
router.all('/health/check', healthCheck);
router.all('/(v2|v3)/trpc/:action/:cmd', trpcProxy);
router.all('/(v2|v3)/cgi/:action/(.*)?', cgiHandler);
router.all('/v3/page/:action/(.*)?', ssrHandler);
\`\`\`

#### 第四层：业务逻辑层

\`\`\`
业务逻辑层
├── SSR渲染模块
│   ├── 页面配置管理
│   ├── 数据预取（syncFunc）
│   ├── Vue SSR渲染
│   └── HTML模板注入
├── TRPC转发模块
│   ├── 登录态校验
│   ├── 请求头注入
│   ├── TRPC调用
│   └── 响应处理
├── CGI聚合模块
│   ├── 多接口并发
│   ├── 数据合并
│   └── 错误降级
└── 监控上报模块
    ├── 伽利略Trace
    ├── 伽利略Metrics
    └── Aegis前端监控
\`\`\`

### 3.3 目录结构设计

\`\`\`
yundong.qq.com/
├── src/                          # Node服务端代码
│   ├── index.ts                  # 服务入口
│   ├── cgi/                      # CGI聚合处理
│   ├── pages/                    # SSR页面处理
│   │   ├── index.ts              # 页面路由
│   │   ├── config.ts             # 页面配置管理
│   │   ├── sync/                 # 数据预取
│   │   └── template/             # HTML模板
│   ├── trpc/                     # TRPC配置
│   ├── lib/                      # 工具库
│   ├── utils/                    # 工具函数
│   └── constants/                # 常量定义
├── website/                      # 前端代码
│   ├── pages/                    # 页面目录（每页独立目录）
│   ├── components/               # 公共组件
│   ├── lib/                      # 前端库
│   ├── utils/                    # 公共工具
│   ├── styles/                   # 公共样式
│   └── vite.config.ts            # Vite配置
├── tsw/                          # TSW配置
├── dist/                         # 编译产物
├── k8s/                          # K8s配置
├── Dockerfile                    # Docker镜像
├── ecosystem.config.js           # PM2配置
└── package.json
\`\`\`
`
