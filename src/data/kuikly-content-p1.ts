// QQ运动Kuikly项目解析 - 内容第1部分（背景+架构+目录+核心流程）
export default `# QQ 运动 Kuikly 模块深度技术剖析

> **作者**：技术架构分析  
> **日期**：2026-04-14  
> **版本**：基于 QQKuiklyBiz 项目 qqsport 模块  
> **技术栈**：Kotlin Multiplatform · Kuikly · NTCompose · 响应式编程

---

## 一、项目背景与技术选型

### 1.1 业务背景

QQ 运动是腾讯 QQ App 内置的运动健康插件，承载了数亿用户的每日步数记录、好友排行、打卡签到、活力值兑换等核心功能。核心挑战：

- **跨平台一致性**：同时支持 iOS 和 Android，UI 表现高度一致
- **高性能要求**：毫秒级的首屏渲染
- **复杂业务逻辑**：步数授权、健康数据同步、广告系统、A/B 测试等
- **版本兼容**：兼容多个 QQ 客户端版本（9.0.x 到 9.2.x+）
- **双引擎并存**：Kuikly 渲染引擎与 NTCompose 引擎同时维护

### 1.2 技术选型

采用腾讯自研 **Kuikly** 跨端框架，基于 **Kotlin Multiplatform（KMP）**。

\`\`\`mermaid
graph TB
    subgraph BIZ["业务逻辑层 (Kotlin)"]
        K["Kuikly 引擎(旧版页面)"]
        C["NTCompose 引擎(新版页面)"]
        W["WebView(H5页面)"]
    end
    subgraph BRIDGE["平台桥接层"]
        M["Module System"]
    end
    subgraph NATIVE["原生层"]
        IOS["iOS Native"]
        AND["Android Native"]
    end
    BIZ --> BRIDGE
    BRIDGE --> NATIVE
\`\`\`

**选型理由：** Kotlin Multiplatform 共享业务逻辑、Kuikly 深度集成 QQ 客户端能力、响应式编程数据驱动 UI、协程统一异步操作

---

## 二、整体架构设计

### 2.1 宏观架构图

\`\`\`mermaid
graph TB
    subgraph ENTRY["入口层"]
        IP["IndexPage @Page(QQSport) Kuikly"]
        ICP["IndexComposePage NTCompose"]
    end
    subgraph PAGES["页面层"]
        HP["HomePage 首页"]
        RP["RankingPage 排行榜"]
        CIP["CheckInPage 打卡"]
        WP["WeekPage 周报"]
    end
    subgraph STORE["状态管理层"]
        MS["MainStore 全局状态"]
        HS["HomeStore 首页状态"]
        RS["RankingStore 排行状态"]
        HES["HealthStore 健康状态"]
    end
    subgraph CGI["网络请求层"]
        BR["BaseRequest"]
        QR["QQRequest.requestWithAuth"]
    end
    subgraph FOUNDATION["基础设施层"]
        HT["HealthTools"]
        QC["QQSportCache"]
        AR["AttaReporter"]
    end
    ENTRY --> PAGES
    PAGES --> STORE
    STORE --> CGI
    CGI --> FOUNDATION
\`\`\`

### 2.2 双引擎并存设计

| 特性 | Kuikly 引擎 | NTCompose 引擎 |
|---|---|---|
| 页面基类 | QQSportBasePager | BaseComposePager |
| 状态管理 | observable (Kuikly 响应式) | mutableStateOf (Compose 状态) |
| 生命周期 | created/viewDidLoad/pageDidAppear | onCreate/composeDidInit/onResume |
| 典型页面 | IndexPage, CheckInPage, WeekPage | IndexComposePage, CalendarComposePage |
| 适用场景 | 复杂列表、多 Tab 页面 | 动画丰富、交互复杂的单页面 |

---

## 三、目录结构深度解析

\`\`\`
qqsport/
├── base/                    # 基础框架层
│   ├── compose/             # NTCompose 基础类
│   ├── health/              # 健康数据授权层
│   └── kuikly/              # Kuikly 基础类
├── cgi/                     # 网络请求层
│   ├── BaseRequest.kt       # 请求基类（含安全头）
│   ├── MainDataCGI.kt       # 首页数据接口
│   ├── RankingCGI.kt        # 排行榜接口
│   └── ...                  # 其他接口
├── components/              # Kuikly 通用组件
├── components_compose/      # NTCompose 通用组件
│   ├── circular_compose/    # 圆形进度条（核心动画）
│   └── scroll_number_compose/ # 滚动数字组件
├── constants/               # 常量定义层
├── extension/               # Kotlin 扩展函数
├── models/                  # 数据模型
├── pages/                   # 页面层
│   ├── index/               # 主页（Kuikly）
│   ├── index_compose/       # 主页（NTCompose）
│   ├── checkin/             # 打卡页
│   ├── calendar_compose/    # 日历页（Compose）
│   └── ...                  # 其他页面
└── utils/                   # 工具类
    ├── QQSportCache.kt      # 缓存管理
    ├── AttaReporter.kt      # 数据上报
    └── Logger.kt            # 日志工具
\`\`\`

---

## 四、核心流程分析

### 4.1 页面启动流程

\`\`\`mermaid
flowchart TD
    A["用户点击QQ运动入口"] --> B["客户端创建容器"]
    B --> C["IndexPage.created()"]
    C --> D1["初始化常量"]
    C --> D2["初始化颜色主题"]
    C --> D3["初始化健康工具"]
    C --> D4["初始化 MainStore"]
    C --> E["并行启动多个异步任务"]
    E --> E1["checkRedPoint()"]
    E --> E2["showLocalSteps()"]
    E --> E3["registerFont()"]
    E --> E4["requestTianshuAds()"]
    E --> F["预加载首屏数据"]
    F --> G["body() 构建 UI 树"]
\`\`\`

### 4.2 步数授权完整流程

\`\`\`mermaid
flowchart TD
    A["showLocalSteps()"] --> B["checkAuthStatus()"]
    B --> IOS["iOS: checkIOSAuthStatus()"]
    B --> AND["Android: checkAndroidAuthStatus()"]
    B --> AUTH{"是否已授权?"}
    AUTH -- "已授权" --> G["getLocalSteps() 显示本地步数"]
    AUTH -- "未授权" --> UA["未授权分支"]
    UA --> UA_IOS["iOS: openRequestStepAuthPop()"]
    UA --> UA_AND["Android: openAndroidRequestStepAuthPop()"]
    UA_AND --> AND1["限频检查 EVERY_DAY"]
    AND1 --> AND2["requestStepCounterPermission"]
    AND2 --> AND3{"QQ版本 >= 9.1.70?"}
    AND3 -- "是" --> AND4["openAndroidAuthSDKPop() 厂商SDK授权"]
    AND3 -- "否" --> AND5["仅使用系统传感器权限"]
\`\`\`
`
