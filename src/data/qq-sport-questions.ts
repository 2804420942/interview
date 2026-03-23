import type { Question } from './types'

export const qqSportQuestions: Question[] = [
  {
    id: 1301,
    title: '首页四个 Tab 页面是如何切换的？keepAlive 是如何实现的？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['Tab切换', 'keepAlive', 'Kuikly', '状态管理'],
    content: `## 首页四个 Tab 页面是如何切换的？keepAlive 是如何实现的？

**答案：**

项目中有四个 Tab：**首页（HOME）、排行榜（RANKING）、跑步（RUN）、活力中心（VITALITY_CENTER）**，对应 \`NavigationTab\` 枚举。

### Tab 切换核心流程

Tab 切换由 \`MainStore.navigateToTabPage(tab)\` 统一管理：

\`\`\`kotlin
fun navigateToTabPage(tab: NavigationTab) {
    if (tabIndex == tab) return

    val prevTabIndex = tabIndex
    // 1. 触发即将隐藏页面的 viewWillDisappear
    QQSportContext.currentPage?.view?.viewWillDisappear()

    // 2. 检查目标页面是否已加载
    var nextPageConfig = pages.find { item -> item.tabIndex == tab }
    if (nextPageConfig == null) {
        // 首次切换：将 PageConfig 加入 pages 列表，触发渲染
        nextPageConfig = tabs.find { item -> item.tabIndex == tab }
        nextPageConfig?.let { pages.add(it) }
    } else {
        // 已加载：直接触发 viewWillAppear
        QQSportContext.getPageView(tab)?.view?.viewWillAppear()
    }

    // 3. 更新 tabIndex，通过 visibility 控制显隐
    tabIndex = tab

    // 4. 等待下一帧渲染完毕后触发 appear/disappear
    setTimeout(1) {
        QQSportContext.getPageView(prevTabIndex)?.view?.viewDidDisappear()
        QQSportContext.currentPage?.view?.viewDidAppear()
    }
}
\`\`\`

### keepAlive 实现原理

在 \`IndexPage.body()\` 中，通过 \`vfor\` 遍历 \`pages\` 列表渲染各 Tab，每个 Tab 设置了 \`keepAlive(true)\` 和 \`visibility(MainStore.tabIndex == page.tabIndex)\`：

\`\`\`kotlin
vfor({ MainStore.pages }) { page ->
    when (page.tabIndex) {
        NavigationTab.HOME -> HomePage {
            attr {
                keepAlive(true)           // 保活，不销毁
                config(page)
                visibility(MainStore.tabIndex == page.tabIndex) // 控制显隐
            }
        }
        // ...其他 Tab 同理
    }
}
\`\`\`

**关键点：**
- \`pages\` 列表初始只有首次展示的 Tab，切换时才懒加载其他 Tab（按需渲染）
- \`keepAlive(true)\` 保证切走后不销毁，再次切回时直接复用
- \`visibility\` 控制显隐而非销毁重建，保留了页面状态

---

**追问：** 为什么 Tab 切换要用 \`setTimeout(1)\` 延迟触发 \`viewDidAppear\`？

**答案：**

因为 \`tabIndex\` 变更后，Kuikly 框架需要在下一个事件循环（宏任务）中完成 DOM 的 diff 和渲染。如果立即调用 \`viewDidAppear\`，新页面的视图树可能还未挂载完毕，导致在 \`viewDidAppear\` 中操作视图（如滚动到顶部、刷新数据）时找不到对应的 View 引用。\`setTimeout(1)\` 确保等待渲染完成后再触发生命周期回调。`
  },
  {
    id: 1302,
    title: '步数授权流程是怎样的？iOS 和 Android 有什么区别？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['健康授权', 'iOS', 'Android', 'HealthKit', '传感器'],
    content: `## 步数授权流程是怎样的？iOS 和 Android 有什么区别？

**答案：**

步数授权是 QQ 运动的核心功能，由 \`HealthTools\` 和 \`HealthStore\` 协同完成，iOS 和 Android 的授权体系完全不同。

### 整体流程

\`\`\`
页面 created()
    └── MainStore.showLocalSteps()
            ├── checkAuthStatus()  // 先检查是否已授权
            ├── [iOS] 未授权 → openIOSRequestHeathKitStepAuthPop()
            └── [Android] 强制拉起 → openAndroidRequestStepAuthPop()
                                    └── (9.2.20+) openAndroidAuthSDKPop()
\`\`\`

### iOS 授权（双重授权体系）

iOS 需要同时处理两种权限：**HealthKit（健康App）** 和 **运动与健身**：

\`\`\`kotlin
suspend fun checkIOSAuthStatus(): Boolean {
    val heathKitAuthCode = checkIOSHeathKitAuthStatus()
    return when (heathKitAuthCode) {
        AuthRetCode.AUTHED -> true  // HealthKit 已授权，直接通过
        AuthRetCode.NOT_SUPPORT -> {
            // 设备不支持 HealthKit，降级检查运动与健身
            checkIOSMotionAndFitnessAuthStatus() == AuthRetCode.AUTHED
        }
        else -> {
            // HealthKit 未授权，检查运动与健身作为兜底
            checkIOSMotionAndFitnessAuthStatus() == AuthRetCode.AUTHED
        }
    }
}
\`\`\`

iOS 授权有**限频机制**：通过 \`QQSportCache\` 记录今日是否已弹过授权弹窗（\`IOS_HEATH_KIT_STEP_AUTH\`、\`IOS_MOTION_AND_FITNESS_STEP_AUTH\`），避免每次进入都打扰用户。

### Android 授权（双层授权体系）

Android 9.2.20+ 引入了**厂商 SDK 授权**（华为、小米等），在系统传感器权限之上增加了一层：

\`\`\`kotlin
// 第一层：系统传感器权限
var isAuthed = openAndroidRequestStepAuthPop(true)
// 第二层：厂商 SDK 权限（9.2.20+）
if (isAuthed && QQUtils.compare("9.2.20") >= 0 && isExpired) {
    isAuthed = openAndroidAuthSDKPop(true, true) == AuthSDKStatus.AUTHED
}
\`\`\`

Android 授权状态分三种：\`NOT_SUPPORT(-1)\`、\`NOT_AUTH(0)\`、\`AUTHED(1)\`。

### 授权后的步数同步

授权成功后，会先显示**本地步数**（即时反馈），再请求网络步数，并做本地/远程步数对比同步：

\`\`\`kotlin
// 本地步数 > 远程步数时，同步本地步数到后台
if (localSteps > todayRemoteSteps) {
    val isSyncSuccessed = HealthTools.instance.syncLocalStepsToRemote()
    if (isSyncSuccessed) {
        // 500ms 后重新拉取数据
        setTimeout(500) { requestPageData() }
    }
}
\`\`\`

---

**追问：** 为什么要先显示本地步数，再请求网络步数？

**答案：**

这是一种**乐观更新（Optimistic Update）**策略，目的是提升用户体验：

1. **即时反馈**：网络请求有延迟（几百毫秒到几秒），先展示本地传感器数据，用户立刻能看到步数，避免白屏等待
2. **数据兜底**：网络请求失败时，本地步数仍可展示，不会出现步数为 0 的异常情况
3. **数据校正**：网络数据返回后，比较本地和远程步数，取较大值（本地步数更实时），并将差异同步给后台，保证数据一致性
4. **过滤异常**：本地步数超过 10 万步时视为异常数据，不展示（\`if (localSteps < 100000)\`）`
  },
  {
    id: 1303,
    title: '项目中的 Store 架构是如何设计的？为什么用 object 单例而不是 ViewModel？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['Store', '状态管理', 'observable', 'Kuikly', '响应式'],
    content: `## 项目中的 Store 架构是如何设计的？为什么用 object 单例而不是 ViewModel？

**答案：**

### Store 架构设计

项目采用**分层 Store 架构**，类似前端的 Vuex/Pinia 模式：

\`\`\`
MainStore（全局状态：Tab、用户信息、导航栏）
    ├── HomeStore（首页聚合 Store）
    │   ├── HomeTopStore（顶部步数模块）
    │   ├── HomeVitalityStore（活力中心模块）
    │   ├── HomeRankingStore（首页排行模块）
    │   ├── BenefitsCenterStore（福利中心模块）
    │   ├── HomeBulletinBoardStore（公告栏模块）
    │   └── ...（其他子模块）
    ├── RankingStore（排行榜 Store）
    │   ├── RankingDateStore(today)
    │   ├── RankingDateStore(yesterday)
    │   └── RankingDateStore(month)
    ├── HealthStore（健康授权 & 步数）
    ├── ABTestStore（AB 实验）
    └── AdStore（广告）
\`\`\`

### 响应式状态管理

所有状态通过 \`observable\` 委托声明，框架自动追踪依赖，状态变更时精准更新 UI：

\`\`\`kotlin
object MainStore {
    var tabIndex by observable(NavigationTab.HOME)  // 变更时自动触发 UI 更新
    var pages by observableList<PageConfig>()        // 列表变更也能响应
    var isShowNavigationBar by observable(true)
}
\`\`\`

### 为什么用 object 单例

1. **跨页面共享**：QQ 运动是单 Page 多 Tab 架构，各 Tab 需要共享同一份状态（如步数、授权状态），单例天然满足
2. **Kuikly 框架特性**：Kuikly 的 \`observable\` 响应式系统不依赖 Android ViewModel 的生命周期感知，单例 + observable 已能满足状态管理需求
3. **简化依赖注入**：直接引用 \`MainStore.tabIndex\` 比通过 ViewModel 注入更简洁，减少样板代码
4. **跨平台一致性**：Kotlin Multiplatform 场景下，object 单例在 iOS 和 Android 行为一致，ViewModel 是 Android 特有的

---

**追问：** \`ReactiveObserver.bindValueChange\` 是做什么用的？

**答案：**

\`bindValueChange\` 用于**监听某个 observable 值的变化，执行副作用逻辑**，类似 Vue 的 \`watch\`：

\`\`\`kotlin
// 当 tabIndex 变化时，同步更新 currentTabConfig
ReactiveObserver.bindValueChange(tabs) {
    currentTabConfig = tabs.find { item -> item.tabIndex == tabIndex }
}

// 当 isNeedNavigationBar 变化时，重新计算导航栏显示状态
ReactiveObserver.bindValueChange(isNeedNavigationBar) {
    isShowNavigationBar = isNeedNavigationBar && (currentPageConfig?.isShowNavigationBar ?: true)
}
\`\`\`

与 UI 层的 \`observable\` 自动绑定不同，\`bindValueChange\` 用于 Store 内部的**计算属性联动**，保证派生状态的一致性。`
  },
  {
    id: 1304,
    title: '首页数据加载流程是怎样的？首屏性能是如何优化的？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['首屏优化', '性能监控', '预加载', '并发请求'],
    content: `## 首页数据加载流程是怎样的？首屏性能是如何优化的？

**答案：**

### 数据加载流程

\`\`\`
IndexPage.created()
    ├── MainStore.init()                    // 初始化全局状态
    ├── GlobalScope.launch {
    │   ├── async { checkRedPoint() }       // 检查红点跳转
    │   ├── async { showLocalSteps() }      // 授权 + 显示本地步数
    │   ├── async { UITools.registerFont() }// 预加载字体
    │   ├── async { AdStore.requestTianshuAds() } // 请求广告
    │   └── async { ABTestStore.requestBenefitsCenter() } // AB实验
    │   }
    └── HomeStore.loadFirstScreenData()     // 预加载首屏数据（并行）
            └── async { requestMainData() } // 首屏接口（步数+排行+活力+勋章）
\`\`\`

### 首屏性能优化策略

**1. 并行请求（async 并发）**

\`\`\`kotlin
GlobalScope.launch {
    async { checkRedPoint() }
    async { MainStore.showLocalSteps() }  // 这些请求并行执行
    async { UITools.registerFont() }
    async { AdStore.requestTianshuAds() }
}
// 同时，首屏数据也在并行加载
HomeStore.loadFirstScreenData()
\`\`\`

**2. 本地缓存兜底**

\`\`\`kotlin
// 先读缓存，立即渲染，再等网络数据更新
QQSportCache.getContentCache(QQSportCache.Keys.KUIKLY_PAGE_CONFIG)?.let {
    remotePageConfigHandler(it, true)   // 用缓存先渲染
    HomeStore.remotePageConfigHandler(it)
}
\`\`\`

**3. 首屏数据合并接口**

\`requestFirstScreenData\` 是一个聚合接口，一次请求返回：步数数据、排行数据、活力数据、勋章数据、公告栏数据、AB 实验配置，减少请求次数。

**4. 首屏渲染耗时上报**

\`\`\`kotlin
fun reportFirstScreenDataDisplay() {
    // 必须同时满足：已 load + 已 appear + 已 layout + 数据已返回
    if (!isLoaded || !isAppeared || !isLayout || !isNeedReportFirstScreenDisplay) return

    setTimeout(1) {  // 等待下一帧渲染完成
        val cost = firstScreenDataDisplayTimestamp - launchTimestamps.openPage
        Logger.home.firstScreenDataDisplay(LOG_KEY, JSONObject().apply {
            put("firstScreenDataDisplayCost", cost)
            // 记录各阶段时间点：资源加载、引擎初始化、页面构建、layout...
        })
    }
}
\`\`\`

---

**追问：** 首屏数据加载时，步数为什么要做"本地步数 < 10万"的过滤？

**答案：**

这是一个**数据异常过滤**机制。部分 Android 设备（尤其是华为、小米等）的步数传感器在某些情况下会返回异常大的数值（如累计步数而非当日步数，可能达到几十万甚至更多）。直接展示会严重影响用户体验和数据准确性。

10 万步约等于 70~80 公里，正常人一天不可能走这么多，因此以 10 万为阈值过滤掉明显异常的数据，保证展示的步数在合理范围内。`
  },
  {
    id: 1305,
    title: '排行榜页面的今日/昨日/本月 Tab 切换是如何实现的？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['排行榜', 'Tab切换', 'RankingStore', '数据分离'],
    content: `## 排行榜页面的今日/昨日/本月 Tab 切换是如何实现的？

**答案：**

### 数据分离设计

排行榜的三个 Tab 数据完全分离存储，避免切换时数据混乱：

\`\`\`kotlin
object RankingStore {
    val yesterday by lazy { RankingDateStore(RankingDateType.yesterday) }
    val today     by lazy { RankingDateStore(RankingDateType.today) }
    val month     by lazy { RankingDateStore(RankingDateType.month) }

    var tabIndex by observable(RankingDateType.today)

    // 当前数据根据 tabIndex 动态切换
    var currentData by observable<RankingDateStore>(today)
}
\`\`\`

### Tab 切换流程

\`\`\`kotlin
fun changeTabIndex(tab: RankingDateType, callback: (() -> Unit)? = null) {
    if (tabIndex == tab || isExposeAd) return  // 广告曝光中禁止切换

    tabIndex = tab

    // 切换后滚动列表回顶部
    QQSportContext.getPageView(NavigationTab.RANKING)?.view?.let {
        if (it is RankingPageView) {
            it.listRef?.view?.setContentOffset(0f, 0f, false)
        }
    }

    // 月度 Tab 显示"去月度赛事"按钮
    isShowGoMonthCompetitionButton = tab === RankingDateType.month

    // 请求对应 Tab 的数据
    GlobalScope.launch {
        currentData.requestRankingData(0)
        callback?.invoke()
    }
}
\`\`\`

### 联动首页的今日/昨日

排行榜 Tab 的初始状态与首页步数展示保持联动：

\`\`\`kotlin
// 切换到排行榜时，同步首页的今日/昨日状态
NavigationTab.RANKING -> {
    RankingStore.tabIndex = if (HomeStore.isShowTodayData)
        RankingDateType.today else RankingDateType.yesterday
}
\`\`\`

### 加入/退出排行榜开关

用户可以控制是否参与排行，状态通过跨页面通知同步：

\`\`\`kotlin
// 监听其他页面（如 WebView）切换排行榜开关
joinRankingSwitchChangedNotifyRef = notifyModule.addNotify(
    Constants.Events.JOIN_RANKING_SWITCH_CHANGED
) { it ->
    val userSelfState = JoinRankState.parse(it.optInt("state"))
    if (userSelfState != RankingStore.userSelfState) {
        RankingStore.userSelfState = userSelfState
        GlobalScope.launch {
            RankingStore.currentData.requestRankingData(0)  // 刷新数据
        }
    }
}
\`\`\`

---

**追问：** 排行榜的点赞功能为什么只支持今日 Tab？

**答案：**

点赞是一个**实时互动行为**，有以下业务逻辑限制：

1. **时效性**：昨日和本月的数据已经定型，点赞对历史数据没有实际意义
2. **后端限制**：后端接口只支持对当日排行数据进行点赞操作
3. **用户体验**：点击昨日/本月的点赞按钮时，会弹出提示"昨日/本月排行暂不支持点赞"，引导用户去查看今日排行

代码中通过判断 \`tabIndex\` 来拦截：
\`\`\`kotlin
if (tabIndex == RankingDateType.yesterday || tabIndex == RankingDateType.month) {
    UITools.showTips("\${text}排行暂不支持点赞")
    return
}
\`\`\``
  },
  {
    id: 1306,
    title: 'Kuikly 与 WebView 之间是如何通信的？有哪些通信场景？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['Kuikly', 'WebView', '跨端通信', 'NotifyModule', 'JSBridge'],
    content: `## Kuikly 与 WebView 之间是如何通信的？有哪些通信场景？

**答案：**

项目中 Kuikly 原生层与 WebView（H5）之间通过 \`NotifyModule\` 进行双向通信，类似 JSBridge 机制。

### 通信方式

**Kuikly 监听 WebView 消息（H5 → Kuikly）：**

\`\`\`kotlin
val notifyModule = acquireModule<NotifyModule>(NotifyModule.MODULE_NAME)

// 监听 WebView 发来的切换 Tab 通知
changeNavigationBarTabIndexNotifyRef = notifyModule.addWebViewNotify(
    Constants.Events.CHANGE_NAVIGATION_BAR_TAB_INDEX
) { data ->
    val tabIndex = data?.optInt("tab_index") ?: return@addWebViewNotify
    if (tabIndex in 0..3) {
        MainStore.navigateToTabPage(NavigationTab.parse(tabIndex))
    }
}
\`\`\`

**Kuikly 向 WebView 发送消息（Kuikly → H5）：**

\`\`\`kotlin
val notifyModule = QQSportContext.acquireModule<NotifyModule>(NotifyModule.MODULE_NAME)
notifyModule.postWebViewNotify(
    Constants.Events.QQSPORT_TOGGLE_SELECT,
    listOf(Constants.DomainList.YUN_DONG),  // 指定目标 WebView 域
    JSONObject()
)
\`\`\`

### 主要通信场景

| 事件名 | 方向 | 用途 |
|--------|------|------|
| \`CHANGE_NAVIGATION_BAR_TAB_INDEX\` | H5 → Kuikly | H5 页面请求切换底部 Tab |
| \`QQSPORT_TOGGLE_KUIKLY_NAV\` | H5 → Kuikly | H5 控制导航栏显隐（如全屏视频） |
| \`QQSPORT_SWITCH_RUN_TAB\` | H5 → Kuikly | 跑步页切换"跑步/健走"文案 |
| \`JOIN_RANKING_SWITCH_CHANGED\` | H5 → Kuikly | H5 页面切换加入排行榜开关 |
| \`CLEAR_MSG_SRC_URL_CACHE\` | H5 → Kuikly | H5 通知清除消息来源 URL 缓存 |
| \`QQSPORT_TOGGLE_SELECT\` | Kuikly → H5 | 跳转活力中心设置页 |

### 注意事项

1. **及时移除监听**：在 \`pageWillDestroy\` 中必须调用 \`removeWebViewNotify\` 移除所有监听，防止内存泄漏
2. **ref 校验**：部分通知需要校验 \`pagerId\`，确保只响应当前页面的通知，避免多实例时的串扰
3. **异常捕获**：所有 \`addWebViewNotify\` 和 \`removeWebViewNotify\` 都包裹在 try-catch 中，防止模块未注册时崩溃

---

**追问：** 为什么 \`JOIN_RANKING_SWITCH_CHANGED\` 事件同时注册了 \`addNotify\` 和 \`addWebViewNotify\` 两个监听？

**答案：**

因为切换排行榜开关的操作可能来自**两种来源**：

1. **原生 Kuikly 页面**（如排行榜设置页）：通过 \`addNotify\` 监听原生通知
2. **WebView H5 页面**（如活力中心 H5）：通过 \`addWebViewNotify\` 监听 WebView 通知

两种通知的传输通道不同，需要分别注册，但回调逻辑完全相同（同一个 \`callback\` lambda），保证无论从哪个入口修改开关状态，排行榜数据都能正确刷新。`
  },
  {
    id: 1307,
    title: '福利中心的激励视频广告是如何实现的？完成任务后的弹窗逻辑是什么？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['激励视频', '广告', '任务系统', '金豆', '弹窗'],
    content: `## 福利中心的激励视频广告是如何实现的？完成任务后的弹窗逻辑是什么？

**答案：**

### 激励视频广告流程

\`\`\`
用户点击"看视频得金豆"
    └── BenefitsCenterStore.watchVideoAd(sessionID)
            ├── 检查是否有正在进行的广告（防重复）
            ├── 检查网络状态（无网络提示）
            ├── 创建 RewardedVideoAd 实例
            └── GlobalScope.launch {
                    val isFinished = rewardedVideoAd.show()  // 挂起等待用户看完
                    if (isFinished) {
                        // 解析后端返回的奖励信息
                        val rewardCoins = remoteBusiBuffer.coinInfo.reward_coins
                        val hasNextTask = remoteBusiBuffer.has_next_task  // 是否有膨胀任务
                        showDialog(taskItem, rewardCoins, sessionID, hasNextTask)
                    }
                }
\`\`\`

### 膨胀任务机制

看完一条视频后，后端可能返回 \`has_next_task = true\`，表示有**膨胀任务**（奖励翻倍的额外视频）：

\`\`\`kotlin
val buttonText = when {
    hasNextTask -> "再看一条视频，得120+金豆"      // 有膨胀任务
    item != null && !item.canDo -> "去获得更多金豆" // 所有视频任务已完成
    else -> "领取并观看下一条"                      // 还有普通视频任务
}
\`\`\`

### 弹窗确认后的分支逻辑

\`\`\`kotlin
isShowModal = BenefitsCenterModalInfo(...) { isConfirm, isClose ->
    isShowModal = null
    if (isConfirm) {
        if (hasNextTask) {
            // 继续看膨胀任务视频
            watchVideoAd(sessionID, isPlus = true, subTaskID = item?.subData?.taskId)
        } else if (item != null && !item.canDo) {
            // 跳转福利中心页面获取更多金豆
            UITools.openUrl("\${UrlConstants.Page.KUIKLY_BENEFITS_CENTER}&from=qqsport_card_bean")
        } else {
            // 继续看下一条普通视频
            watchVideoAd(sessionID)
        }
    }
}
\`\`\`

### 防重复机制

\`\`\`kotlin
fun watchVideoAd(...) {
    if (rewardedVideoAd != null) {
        UITools.showTips("有正在进行的广告")
        return  // 防止重复拉起
    }
    // ...
    rewardedVideoAd = null  // 广告结束后清空，允许下次拉起
}
\`\`\`

---

**追问：** 为什么要在看视频前检查网络状态？

**答案：**

激励视频广告需要**实时加载视频流**，无网络时：
1. 视频无法加载，用户等待后看到失败提示，体验极差
2. 后端无法记录观看行为，即使用户"看完"了也无法发放奖励
3. 提前检查网络并给出友好提示（"暂无网络，请稍后再试"），比让用户等待加载失败更好

通过 \`QQKuiklyPlatformApi.getNetworkType()\` 获取网络状态，\`NOT_REACHABLE\` 时直接拦截，避免无效的广告请求。`
  },
  {
    id: 1308,
    title: '今日/昨日步数切换是如何实现的？切换引导图是怎么做的？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['步数切换', '引导图', '缓存', 'APNG', '动画'],
    content: `## 今日/昨日步数切换是如何实现的？切换引导图是怎么做的？

**答案：**

### 今日/昨日切换实现

顶部步数区域（\`HomeTopStepsView\`）通过 \`HomeStore.isShowTodayData\` 控制显示今日还是昨日数据：

\`\`\`kotlin
// 步数显示值：根据 isShowTodayData 动态切换
var stepNum: Int = 0
    get() = if (HomeStore.isShowTodayData) HealthStore.todayStep else HealthStore.yesterdayStep

// 切换按钮点击事件
event {
    click {
        ctx.isShowChangeDateGuide = false  // 隐藏引导图
        val isShowTodayData = !HomeStore.isShowTodayData
        HomeStore.isShowTodayData = isShowTodayData
        GlobalScope.launch {
            HomeStore.requestPageData(isShowTodayData)  // 重新请求对应日期的数据
        }
        AttaReporter.reportClick(QQSportConstantAttaMain.TOP_CHANGE_DATE_BUTTON)
    }
}
\`\`\`

切换按钮文案和箭头方向也随之变化：
\`\`\`kotlin
Text { attr { text(if (HomeStore.isShowTodayData) "今日" else "昨日") } }
Image { attr { src(if (HomeStore.isShowTodayData) ImageConstants.RIGHT_TRIANGLE else ImageConstants.LEFT_TRIANGLE) } }
\`\`\`

### 切换引导图的显示逻辑

引导图（\`CHANGE_DATE_GUIDE\`）只在**用户首次进入**时显示，通过缓存标记实现：

\`\`\`kotlin
override fun created() {
    super.created()
    // 检查缓存：如果今天还没显示过引导图，则显示
    isShowChangeDateGuide = QQSportCache.checkFlagExpired(QQSportCache.Keys.CHANGE_DATE_GUIDE)
    if (isShowChangeDateGuide) {
        // 标记今日已显示，明天才能再次显示
        QQSportCache.setFlagCache(QQSportCache.Keys.CHANGE_DATE_GUIDE)
    }
}
\`\`\`

引导图点击后消失：
\`\`\`kotlin
vif({ ctx.isShowChangeDateGuide && HealthStore.isAuthed }) {
    Image {
        attr { src(ImageConstants.CHANGE_DATE_GUIDE) }
        event {
            click { ctx.isShowChangeDateGuide = false }
        }
    }
}
\`\`\`

### 公益日动画效果

在 99 公益日（\`HomeStore.isWelfareDay\`），捐步按钮会显示 APNG 动画：

\`\`\`kotlin
vif({ HomeStore.isWelfareDay }) {
    APNG {
        attr {
            src(ImageConstants.DONATE_STEP_ANIMATION)
            repeatCount(2)   // 播放 2 次
            autoPlay(true)
        }
    }
}
\`\`\`

---

**追问：** \`QQSportCache.checkFlagExpired\` 的限频机制是如何实现的？

**答案：**

\`checkFlagExpired\` 是一个**基于时间戳的限频工具**，通过本地存储记录上次触发时间：

- 返回 \`true\`：表示缓存已过期（或从未设置），可以执行操作
- 返回 \`false\`：表示缓存未过期，需要限频

不同的 Key 有不同的过期时间（如每日重置、每次进入重置等），用于控制：
- 授权弹窗每日只弹一次（\`ANDROID_STEP_AUTH\`、\`IOS_HEATH_KIT_STEP_AUTH\`）
- 引导图每日只显示一次（\`CHANGE_DATE_GUIDE\`）
- 红点消息来源 URL 的缓存有效期（\`MSG_SRC_URL\`）

这种设计避免了频繁打扰用户，同时保证关键引导信息能在合适时机展示。`
  },
  {
    id: 1309,
    title: '项目中的弹窗优先级管理是如何实现的？多个弹窗如何避免同时出现？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['弹窗管理', '优先级', '广告', '授权弹窗', '状态机'],
    content: `## 项目中的弹窗优先级管理是如何实现的？多个弹窗如何避免同时出现？

**答案：**

项目中存在多种弹窗：步数授权弹窗、iOS 健康数据授权弹窗、天枢蒙层广告、好友步数 PK 弹窗。通过 \`MainStore.checkAllModalShow()\` 统一管理显示优先级。

### 弹窗优先级（从高到低）

\`\`\`
1. 步数授权弹窗（系统级，最优先）
2. iOS 健康数据授权弹窗（HealthKit）
3. GDT 蒙层广告（客户端广告）
4. 天枢蒙层广告（运营广告）
5. 好友步数 PK 弹窗（业务弹窗，最低）
\`\`\`

### 核心检查逻辑

\`\`\`kotlin
fun checkAllModalShow() {
    if (
        !BaseConstants.isBlock                              // 非审核/青少年/适老模式
        && (HealthStore.isAuthed || !HealthStore.isWaitingForAuth) // 步数授权已完成
        && (!HealthStore.appleHealthKitStore.isShow || !HealthStore.isShowAuthModal) // 健康授权已完成
        && !AdStore.isWaitingGdtMaskAdResponse             // GDT 广告已处理
        && !AdStore.canGdtMaskAdPlay                       // 无 GDT 广告待播
        && !AdStore.isLoadingTianshuAdInfo                 // 天枢广告已加载完
    ) {
        // 所有前置条件满足后，按优先级显示
        if (AdStore.tianshuPushMaskModalInfo != null) {
            AdStore.isShowTianshuPushMaskModal = true  // 优先显示天枢广告
            return
        }
        if (tabIndex == NavigationTab.HOME && HomeStore.friendStepPKInfo != null) {
            HomeStore.isShowStepPKModal = true          // 再显示好友 PK 弹窗
            return
        }
    }
}
\`\`\`

### 触发时机

\`checkAllModalShow\` 在多个时机被调用，确保条件满足时及时显示：

\`\`\`kotlin
// 1. 页面 appear 时
override fun pageDidAppear() { MainStore.checkAllModalShow() }

// 2. 首屏数据加载完成后
HomeStore.loadFirstScreenData() {
    async { requestMainData() }
    MainStore.checkAllModalShow()  // 数据就绪后检查
}

// 3. 步数授权完成后
MainStore.showLocalSteps() {
    // 授权弹窗关闭后
    MainStore.checkAllModalShow()
}

// 4. 广告信息返回后
AdStore.requestTianshuAds() {
    MainStore.checkAllModalShow()
}
\`\`\`

### 在 body() 中的渲染控制

\`\`\`kotlin
// 天枢广告弹窗
vif({ AdStore.isShowTianshuPushMaskModal }) {
    Modal { QQSportTianshuPushDialog { } }
}

// iOS 健康授权弹窗（好友PK弹窗显示时不显示）
vif({ HealthStore.isShowAuthModal && !HomeStore.isShowStepPKModal }) {
    Modal { HealthKitAuthModal { } }
}
\`\`\`

---

**追问：** 为什么审核模式（isReview）、青少年模式（isStudyMode）要屏蔽所有弹窗？

**答案：**

1. **审核模式（isReview）**：App 提交应用商店审核时，审核员会检查 App 行为。广告弹窗、步数授权弹窗等可能被认为是"强制弹窗骚扰用户"，导致审核不通过。审核模式下屏蔽这些弹窗，保证审核流程顺利通过
2. **青少年模式（isStudyMode）**：根据国家未成年人保护相关法规，青少年模式下需要限制广告展示和部分功能，保护未成年用户
3. **适老模式（isBlock 包含）**：适老模式下界面简化，减少干扰性弹窗，提升老年用户体验

这是合规性要求，也是大型 App 必须处理的场景。`
  },
  {
    id: 1310,
    title: '项目中的数据上报（Atta 埋点）是如何设计的？曝光和点击如何区分？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['埋点', 'Atta', '数据上报', '曝光', '点击', '性能监控'],
    content: `## 项目中的数据上报（Atta 埋点）是如何设计的？曝光和点击如何区分？

**答案：**

### 埋点架构

项目使用腾讯内部的 **Atta 数据上报系统**，通过 \`AttaReporter\` 统一封装：

\`\`\`kotlin
object AttaReporter {
    // 点击上报
    fun reportClick(eventData: Map<String, Any>) { ... }
    // 曝光上报
    fun reportExposure(eventData: Map<String, Any>) { ... }
}
\`\`\`

### 埋点常量管理

所有埋点 ID 按模块分文件管理，避免硬编码：

\`\`\`kotlin
// 首页主模块埋点
object QQSportConstantAttaMain {
    val TOP_CHANGE_DATE_BUTTON = mapOf("act_id" to "change_date_btn", ...)
    val HEADER_TAB_RANK = mapOf("act_id" to "tab_rank", ...)
    val SDK_AUTH = mapOf("act_id" to "sdk_auth", ...)
}

// 活力中心埋点
object QQSportConstantAttaVitality {
    val USER_CURRENT_SCORE = mapOf("act_id" to "vitality_score", ...)
}
\`\`\`

### 点击上报

在用户交互事件中直接调用：

\`\`\`kotlin
event {
    click {
        AttaReporter.reportClick(
            QQSportConstantAttaMain.TOP_CHANGE_DATE_BUTTON
        )
    }
}
\`\`\`

### 曝光上报

通过 Kuikly 的 \`expose\` 事件，在元素进入视口时自动触发：

\`\`\`kotlin
event {
    expose {
        AttaReporter.reportExposure(
            QQSportConstantAttaVitality.USER_CURRENT_SCORE + mapOf(
                "ext1" to "\${HomeStore.vitality.remainScore}"
            )
        )
    }
}
\`\`\`

### 携带业务参数

埋点支持通过 \`ext1\`~\`ext3\` 携带业务参数，用于数据分析：

\`\`\`kotlin
// 授权状态上报：ext1 记录授权 SDK 状态，ext2 记录今日步数
AttaReporter.reportExposure(
    QQSportConstantAttaMain.SDK_AUTH + mapOf(
        "ext1" to "\${HealthStore.authedSDKStatus.value}",
        "ext2" to "\${HealthStore.todayStep}"
    )
)

// 点赞上报：ext1 记录是否今日，ext3 记录页面来源
AttaReporter.reportClick(
    QQSportConstantRankingAttaMain.PRAISE_FRIEND + mapOf(
        "ext1" to if (isTodayTab) "1" else "0",
        "ext3" to "2"  // 2 = kuikly 页面
    )
)
\`\`\`

### 首屏性能上报

除了业务埋点，还有专门的**性能监控上报**，记录各阶段耗时：

\`\`\`kotlin
Logger.home.firstScreenDataDisplay(LOG_KEY, JSONObject().apply {
    put("openPage", launchTimestamps.openPage)
    put("fetchContextStart", launchTimestamps.fetchContextStart)  // 资源加载开始
    put("renderContextEnd", launchTimestamps.renderContextEnd)    // 引擎加载完成
    put("firstScreenDataDisplay", firstScreenDataDisplayTimestamp)
    put("firstScreenDataDisplayCost", cost)  // 总耗时
})
\`\`\`

---

**追问：** 为什么首屏性能上报要同时满足 isLoaded、isAppeared、isLayout 三个条件？

**答案：**

这三个条件对应页面生命周期的三个关键节点，缺一不可：

- **isLoaded**：页面 \`viewDidLoad\` 已执行，View 树已构建完毕
- **isAppeared**：页面 \`pageDidAppear\` 已执行，页面已对用户可见
- **isLayout**：页面 \`viewDidLayout\` 已执行，布局计算已完成

只有三个条件都满足，才说明用户**真正看到了完整渲染的首屏内容**。如果只满足部分条件（如数据返回了但页面还没 appear），上报的时间点不能代表真实的用户感知时间，会导致性能数据失真。`
  },
  {
    id: 1311,
    title: '跑步页面的状态机是如何设计的？为什么要引入"请求中"过渡态？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['状态机', 'TraceManager', '并发控制', 'Vue3'],
    content: `## 跑步页面的状态机是如何设计的？为什么要引入"请求中"过渡态？

**答案：**
跑步页面的核心是 \`TraceManager\` 单例类，整个运动流程被抽象为 **9 个状态**：

\`\`\`
unknow(0) → init(1) → ready(2) → requestStart(3) → start(4)
                                                        ↓
                                              requestPause(5) → pause(6)
                                                        ↓
                                              requestResume(7) → start(4)
                                                        ↓
                                              requestStop(8) → uploadRecords(9) → ready(2)
\`\`\`

每个操作（开始/暂停/继续/结束）都有对应的"请求中"过渡态，例如 \`requestPause\`、\`requestStop\`。

**引入过渡态的原因：防止并发重复操作。** 用户在网络慢时可能连续点击"暂停"按钮，如果没有过渡态，第一次点击发出请求后状态仍是 \`start\`，第二次点击会再次触发请求，导致接口被重复调用。引入 \`requestPause\` 后，第一次点击立即将状态切换为 \`requestPause\`，后续点击检测到状态不是 \`start\` 就直接拦截，彻底解决并发问题。

\`\`\`typescript
// 点击暂停时先检查状态
if (trace.status !== TraceStatus.start) return; // 非 start 状态直接拦截
trace.setStatus(TraceStatus.requestPause);       // 立即切换为过渡态
await trace.pauseTrace();                         // 发起请求
trace.setStatus(TraceStatus.pause);              // 请求成功后切换为最终态
\`\`\`

**追问：** 如果请求失败了，状态应该怎么处理？

**答案：**
请求失败时需要将状态**回滚**到操作前的状态，否则用户会卡在过渡态无法继续操作。以暂停失败为例：

\`\`\`typescript
try {
  trace.setStatus(TraceStatus.requestPause);
  await trace.pauseTrace();
  trace.setStatus(TraceStatus.pause);
} catch (e) {
  trace.setStatus(TraceStatus.start); // 回滚到 start，让用户可以重试
  showToast('暂停失败，请重试');
}
\`\`\`

同时需要区分**可重试错误**（网络超时）和**不可重试错误**（服务端数据异常），前者回滚状态让用户重试，后者直接强制结束运动并上报错误。`
  },
  {
    id: 1312,
    title: 'iOS 和 Android 的 GPS 定位授权机制有什么差异？项目中是如何处理的？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['iOS', 'Android', 'GPS', 'mqq', '跨平台'],
    content: `## iOS 和 Android 的 GPS 定位授权机制有什么差异？项目中是如何处理的？

**答案：**
两个平台的定位授权机制存在根本性差异：

| 平台| iOS | Android |
|---|---|---|
| 授权方式 | 进入页面主动调用获取 | 分模块授权，授权后通过事件推送 |
| 数据获取 | 调用 \`mqq.sensor.getLocation\` 直接回调返回 | 监听 \`PathTraceSend\` 事件被动接收 |
| 初始化顺序 | 必须先调用 \`PathTraceInit\` 再调用 \`PathTraceStart\` | 直接调用 \`PathTraceStart\` |

项目中的处理方式：

\`\`\`typescript
// iOS 进入页面后主动获取一次定位，确保权限已授予
if (browser.isIOS()) {
  mqq.sensor.getLocation(param, (retCode, latitude, longitude) => {
    if (retCode === 0) {
      // 定位成功，更新初始位置
    }
  });
}

// iOS 需要在 PathTraceStart 之前先调用 PathTraceInit
// 确保事件监听已经打开，否则会丢失第一个定位点
if (browser.isIOS()) {
  await initTrace(); // iOS 特有的预初始化步骤
}
await startTrace(); // 两端都需要调用
\`\`\`

**追问：** 如果用户拒绝了定位权限，页面应该如何处理？

**答案：**
需要分场景处理：

1. **首次拒绝**：弹出引导弹窗，说明定位权限的必要性，引导用户去系统设置开启
2. **永久拒绝（iOS "不允许"）**：通过 \`mqq.app.openAppSetting\` 直接跳转到 App 的系统设置页
3. **运动中途权限被撤销**：监听定位数据中断事件，暂停计时并提示用户，避免产生错误的运动数据

\`\`\`typescript
// 检测定位权限状态
mqq.sensor.checkLocationPermission((status) => {
  if (status === 'denied') {
    showPermissionGuide(); // 展示引导弹窗
  } else if (status === 'permanentlyDenied') {
    mqq.app.openAppSetting(); // 跳转系统设置
  }
});
\`\`\``
  },
  {
    id: 1313,
    title: '跑步页面的防作弊算法是如何实现的？为什么选用 Vincenty 公式而不是 Haversine？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['防作弊', 'Vincenty', 'GPS', '算法', 'path-manager'],
    content: `## 跑步页面的防作弊算法是如何实现的？为什么选用 Vincenty 公式而不是 Haversine？

**答案：**
防作弊算法在 \`path-manager.ts\` 中实现，核心逻辑是**检测超速轨迹段**：

\`\`\`typescript
// 检测超速轨迹点（速度超过 7m/s 视为异常，人类百米世界纪录约 10.4m/s，跑步上限取 7m/s）
export const findFraudDis = (path: IPathItem[], max = 7) => {
  let allDis = 0;
  let allDuration = 0;

  for (let k = 1; k < path.length; k++) {
    const eachPath = path[k];
    const eachPrevPath = path[k - 1];

    if (eachPath.speed > max) {
      // 使用 Vincenty 公式精确计算两点间距离
      const pathDis = getDistanceFromLatLonInKm(eachPath, eachPrevPath);
      allDis += pathDis;
      allDuration += (eachPath.timestamp - eachPrevPath.timestamp) / 1000;
    }
  }

  return [Math.round(allDis * 10) / 10, allDuration];
};
\`\`\`

当累计异常距离超过 **500m** 时，弹出"真实运动倡导"提示，告知用户检测到异常轨迹。

**为什么用 Vincenty 而不是 Haversine：**
- **Haversine**：将地球视为完美球体，误差约 0.3%，在长距离计算时误差可达数百米
- **Vincenty**：基于 WGS84 椭球体模型（GPS 标准坐标系），精度可达 0.5mm，误差极小

跑步场景中轨迹点密集（每秒多个点），相邻两点距离很短（几米到几十米），Haversine 的相对误差在短距离下会被放大，累积后影响总距离计算的准确性。使用 Vincenty 能保证防作弊判断的精确性，避免误判正常用户。

**追问：** 除了速度检测，还有哪些防作弊手段？

**答案：**
1. **轨迹漂移过滤**：GPS 信号弱时会产生漂移点（位置突然跳变），通过设置**最大加速度阈值**过滤掉不合理的跳变点
2. **轨迹平滑处理**：对连续轨迹点做滑动平均，消除 GPS 抖动带来的距离虚增
3. **服务端二次校验**：前端上报的轨迹数据在服务端再次做速度和距离校验，前端校验只是第一道防线
4. **短距离提示**：跑步距离小于 100m 时弹出提示，防止用户原地抖动刷步数`
  },
  {
    id: 1314,
    title: '跑步计时器在页面切后台时如何保证时间准确性？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['visibilitychange', '计时器', '后台', 'Page Visibility API'],
    content: `## 跑步计时器在页面切后台时如何保证时间准确性？

**答案：**
前端 \`setInterval\` 计时器在页面切到后台时会被浏览器**节流甚至暂停**（Chrome 后台 Tab 最低降频到 1 次/分钟），导致计时不准。

项目通过监听 **\`Page Visibility API\`** 的 \`visibilitychange\` 事件来补偿后台时长：

\`\`\`typescript
const handleVisibilityChange = () => {
  if (!trace.isSportStart) return; // 非运动中不处理

  if (document.hidden) {
    // 切入后台：记录时间戳，停止前端计时器
    trace.qbrowserHiddenTimestamp = Date.now();
    trace.stopTraceTimer();
  } else {
    // 切回前台：计算后台时长，补偿到总时间
    const nowTimestamp = Date.now();
    const backgroundDuration = Math.round(
      (nowTimestamp - trace.qbrowserHiddenTimestamp) / 1000
    );
    trace.setTraceTotalTime(trace.recordData.totalTime + backgroundDuration);
    trace.startTraceTimer(); // 重启计时器
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
\`\`\`

**核心思路**：不依赖 \`setInterval\` 的累计次数来计算时间，而是用**时间戳差值**来计算后台经过的真实时长，再补偿到总时间中。

**追问：** 如果用户在后台停留了 90 分钟以上，应该怎么处理？

**答案：**
项目中有**暂停超时自动结束**的逻辑：

\`\`\`typescript
// 暂停状态下，超过 90 分钟自动结束运动
const PAUSE_TIMEOUT = 90 * 60 * 1000; // 90分钟

const checkPauseTimeout = () => {
  if (trace.status === TraceStatus.pause) {
    const pauseDuration = Date.now() - trace.pauseStartTime;
    if (pauseDuration >= PAUSE_TIMEOUT) {
      // 自动结束运动，避免用户忘记结束导致数据异常
      trace.stopTrace();
      showToast('运动已自动结束（暂停超过90分钟）');
    }
  }
};
\`\`\`

同时在页面重新可见时，需要先判断是否超时，超时则直接走结束流程，而不是继续补偿时间。`
  },
  {
    id: 1315,
    title: '项目的 SSR 渲染流程是怎样的？Pinia 状态注水（Hydration）解决了什么问题？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['SSR', 'Pinia', 'Hydration', 'Vue3', '首屏优化'],
    content: `## 项目的 SSR 渲染流程是怎样的？Pinia 状态注水（Hydration）解决了什么问题？

**答案：**
项目的 SSR 渲染流程分为三个阶段：

\`\`\`
1. syncFunc()        → 服务端并行预取接口数据，写入 Pinia Store
2. renderToString()  → Vue3 SSR 渲染，生成完整 HTML 字符串
3. 注入 piniaState   → 将 Pinia 状态序列化后注入 HTML，返回给浏览器
\`\`\`

**状态注水的实现：**

\`\`\`typescript
// 服务端：序列化 Pinia 状态注入 HTML
const piniaState = JSON.stringify(pinia.state.value);
const html = template
  .replace('<!--app-html-->', appHtml)
  .replace('<!--pinia-state-->', \`
    <script>window.__INITIAL_STATE__ = \${piniaState};</script>
  \`);

// 客户端：从 window 恢复 Pinia 状态
if (window.__INITIAL_STATE__) {
  pinia.state.value = window.__INITIAL_STATE__;
}
\`\`\`

**解决的问题：**
没有状态注水时，SSR 返回了完整 HTML，但客户端 JS 加载后 Pinia Store 是空的，Vue 会重新发起接口请求来填充数据，这个过程中页面会出现**闪烁（FOUC）**——先显示服务端渲染的内容，然后数据清空，再重新填充。

有了状态注水，客户端直接从 \`window.__INITIAL_STATE__\` 恢复状态，**不需要重新请求接口**，Vue hydration 时 DOM 和状态完全匹配，页面无闪烁，同时节省了一次网络请求。

**追问：** SSR 渲染时如果某个接口请求失败了，页面会怎样？

**答案：**
项目使用 \`Promise.allSettled\` 而非 \`Promise.all\` 来并行预取数据：

\`\`\`typescript
const [pageData, cardTask] = await Promise.allSettled([
  pageDataRequest,
  cardTaskRequest,
]);

// allSettled 不会因为单个失败而中断，每个结果都有 status
if (pageData.status === 'fulfilled') {
  store.setPageData(pageData.value);
} else {
  // 接口失败时使用默认值，保证页面能正常渲染
  store.setPageData(defaultPageData);
}
\`\`\`

使用 \`allSettled\` 的好处是**单个接口失败不影响整体渲染**，页面用默认值降级展示，而不是直接报错白屏。`
  },
  {
    id: 1316,
    title: 'Node 服务层的页面配置缓存是如何防止并发穿透的？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['缓存', '并发穿透', 'Node.js', 'Promise', '性能优化'],
    content: `## Node 服务层的页面配置缓存是如何防止并发穿透的？

**答案：**
项目在 \`src/pages/config.ts\` 中实现了一个精细的**三态内存缓存**，专门解决并发穿透问题：

\`\`\`typescript
// 缓存可能处于三种状态之一
type CacheValue =
  | IPageConfig          // 已加载完成
  | IPageConfigPromise   // 加载中（含 promiseCallback）
  | IPageConfigError;    // 加载失败

const PageCache: Record<string, CacheValue> = {};

const getPageConfig = async (configPath: string) => {
  const pageConfig = PageCache[configPath];

  if (!pageConfig) {
    // 状态1：首次请求，触发 IO，存入 Promise 占位
    let resolve: Function;
    const promiseCallback = new Promise(r => resolve = r);
    PageCache[configPath] = { promiseCallback }; // 先占位！

    const config = await import(configPath); // 异步加载
    PageCache[configPath] = config; // 替换为真实配置
    resolve(config);
    return config;

  } else if ('promiseCallback' in pageConfig) {
    // 状态2：加载中，复用同一个 Promise，不重复触发 IO
    return pageConfig.promiseCallback;

  } else {
    // 状态3：已缓存，直接返回
    return Promise.resolve(pageConfig);
  }
};
\`\`\`

**关键设计**：在触发 IO 之前就先往缓存里写入一个带 \`promiseCallback\` 的占位对象。后续并发请求检测到占位对象，直接等待同一个 Promise，而不是各自发起新的 IO，彻底避免了缓存穿透。

**追问：** 这种缓存策略有什么缺点？生产环境如何处理配置更新？

**答案：**
**缺点**：内存缓存是进程级别的，一旦写入就不会自动过期。如果页面配置文件在运行时被修改，缓存不会自动失效，需要**重启进程**才能生效。

**生产环境的处理方式：**
1. **发布时重启**：通过 PM2 的 \`reload\` 命令优雅重启，新进程加载新配置，旧进程处理完存量请求后退出，做到**零停机更新**
2. **开发环境不缓存**：通过环境变量判断，开发环境每次请求都重新读取配置文件，方便调试

\`\`\`typescript
// 开发环境跳过缓存
if (process.env.NODE_ENV === 'development') {
  return await import(configPath + '?t=' + Date.now()); // 加时间戳绕过 Node 模块缓存
}
\`\`\``
  },
  {
    id: 1317,
    title: '跑步结束按钮的长按防误触是如何实现的？CSS 动画在其中起什么作用？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['长按', '防误触', 'Touch事件', 'CSS动画', 'UX'],
    content: `## 跑步结束按钮的长按防误触是如何实现的？CSS 动画在其中起什么作用？

**答案：**
结束跑步是高风险操作，误触会导致运动数据丢失，因此设计了**长按 2 秒才触发**的防误触机制：

\`\`\`typescript
// running-view.vue
const touchStartTime = ref(0);
const touchStart = ref(false); // 控制 CSS 动画

const onTouchStart = () => {
  touchStartTime.value = Date.now();
  touchStart.value = true;  // 触发进度圆环动画开始
};

const onTouchEnd = async () => {
  touchStart.value = false; // 动画立即停止并重置
  const duration = Date.now() - touchStartTime.value;

  if (duration >= 2000) {
    // 长按满 2 秒才执行
    if (await checkShortDistance()) return; // 距离过短时拦截
    endRunning();
  }
  // 不足 2 秒：什么都不做，动画已重置
};
\`\`\`

**CSS 动画的作用：**
纯逻辑判断对用户不透明，用户不知道还需要按多久。CSS 动画提供**实时视觉反馈**：

\`\`\`css
/* 按下时，圆环进度条从 0% 到 100% 用 2 秒完成 */
.end-btn-progress {
  stroke-dashoffset: 100%;
  transition: stroke-dashoffset 2s linear; /* 与长按时间完全同步 */
}

.end-btn-progress.pressing {
  stroke-dashoffset: 0%; /* 触发动画 */
}
\`\`\`

当用户松手时，\`touchStart.value = false\` 移除 \`pressing\` 类，动画立即重置，给用户明确的"操作取消"反馈。

**追问：** 如果用户手指滑出按钮区域，应该如何处理？

**答案：**
需要同时监听 \`touchcancel\` 和 \`touchmove\` 事件：

\`\`\`typescript
const onTouchCancel = () => {
  // 系统中断（来电、通知等）触发 touchcancel
  touchStart.value = false;
  touchStartTime.value = 0;
};

const onTouchMove = (e: TouchEvent) => {
  // 手指移动超出按钮范围时取消
  const touch = e.touches[0];
  const btn = btnRef.value?.getBoundingClientRect();
  if (btn && (touch.clientX < btn.left || touch.clientX > btn.right ||
              touch.clientY < btn.top  || touch.clientY > btn.bottom)) {
    touchStart.value = false;
    touchStartTime.value = 0;
  }
};
\`\`\``
  },
  {
    id: 1318,
    title: '项目中 TRPC 转发层是如何工作的？相比直接调用后端接口有什么优势？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['TRPC', 'Node.js', 'Koa', '登录态', '类型安全'],
    content: `## 项目中 TRPC 转发层是如何工作的？相比直接调用后端接口有什么优势？

**答案：**
项目的 Node 服务作为 BFF（Backend For Frontend）层，TRPC 路由负责将前端请求转发到后端微服务：

\`\`\`
前端 → /(v2|v3)/trpc/:action/:cmd → Node BFF → 后端 TRPC 微服务
\`\`\`

Node 层在转发前会做以下处理：

\`\`\`typescript
// src/index.ts
router.post('/(v2|v3)/trpc/:action/:cmd', async (ctx) => {
  // 1. 登录态校验：从 Cookie 中提取 uin/skey，验证有效性
  const loginInfo = await checkLogin(ctx);
  if (!loginInfo.isLogin) {
    ctx.body = { retCode: -1, retMsg: '未登录' };
    return;
  }

  // 2. 注入用户信息到请求头，后端无需再做鉴权
  ctx.request.headers['x-uin'] = loginInfo.uin;

  // 3. 转发到后端微服务
  await trpcProxy(ctx);
});
\`\`\`

**相比前端直接调用后端的优势：**

| 维度 | 直接调用 | 经过 BFF 层 |
|---|---|---|
| 登录态 | 每个后端服务都要做鉴权 | BFF 统一鉴权，后端信任 BFF |
| 跨域 | 需要后端配置 CORS | 同域请求，无跨域问题 |
| 接口聚合 | 前端多次请求 | BFF 合并为一次请求 |
| 类型安全 | 手写类型定义 | TRPC 自动推导，前后端类型共享 |
| 监控 | 分散在各服务 | BFF 统一接入伽利略全链路追踪 |

**追问：** 项目中的伽利略监控是如何集成的？监控了哪些指标？

**答案：**
项目集成了**伽利略（Galileo）分布式追踪** + **OpenTelemetry 自动插桩**：

\`\`\`typescript
// 自动插桩：对所有 HTTP 请求和 TRPC 调用自动生成 Span
import { GalileoTracer } from '@tencent/galileo-tracer';

const tracer = new GalileoTracer({
  serviceName: 'yundong-node',
  endpoint: 'http://galileo-collector/traces',
});

// 每个 TRPC 请求自动记录：
// - 请求耗时
// - 请求参数（脱敏后）
// - 响应状态码
// - 错误堆栈（失败时）
// - TraceID（用于跨服务链路追踪）
\`\`\`

通过 TraceID 可以在伽利略控制台追踪一个请求从前端 → Node BFF → 后端微服务的完整链路，快速定位性能瓶颈和错误根因。`
  },
  {
    id: 1319,
    title: '项目的 Vite 构建是如何实现现代包和兼容包双轨输出的？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['Vite', 'Legacy', 'polyfill', '构建优化', 'esbuild'],
    content: `## 项目的 Vite 构建是如何实现现代包和兼容包双轨输出的？

**答案：**
项目使用 \`@vitejs/plugin-legacy\` 实现双轨输出，在 \`website/vite.config.ts\` 中配置：

\`\`\`typescript
import legacy from '@vitejs/plugin-legacy';
import { vitePluginEsBuild } from 'vite-plugin-esbuild';

export default defineConfig({
  plugins: [
    // 1. esbuild 做语法降级（比 Babel 快 10-100 倍）
    vitePluginEsBuild({
      target: 'chrome70',
      include: /\\.(vue|js|ts)$/,
    }),

    // 2. legacy 插件生成兼容包
    legacy({
      targets: ['Android >= 8'],
      modernPolyfills: true, // 为现代浏览器按需注入 polyfill
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        // 3. 手动分包：Vue 和 Pinia 单独打成 vendor 包
        manualChunks(id) {
          if (id.includes('/node_modules/pinia') ||
              id.includes('/node_modules/vue')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
\`\`\`

**双轨输出的工作原理：**
- **现代浏览器**：加载 ES Module 格式的精简包，无多余 polyfill
- **老版本 Android**：加载 legacy 包（SystemJS 格式），包含完整 polyfill

HTML 中通过 \`type="module"\` 和 \`nomodule\` 属性自动区分：

\`\`\`html
<!-- 现代浏览器加载 -->
<script type="module" src="/assets/index.abc123.js"></script>

<!-- 老浏览器加载（现代浏览器忽略 nomodule） -->
<script nomodule src="/assets/index-legacy.def456.js"></script>
\`\`\`

**追问：** vendor 分包对性能有什么具体提升？

**答案：**
vendor 分包利用了**浏览器的长效缓存**机制：

- Vue 和 Pinia 的代码几乎不变，打成 \`vendor.[hash].js\` 后，只要内容不变 hash 就不变
- 用户第一次访问后，\`vendor\` 包被缓存到本地
- 后续业务代码迭代发布时，只有业务包的 hash 变化，\`vendor\` 包直接命中缓存，**不需要重新下载**
- 对于 Vue（~100KB gzip）+ Pinia（~10KB gzip）这样的大依赖，每次发版都能节省约 110KB 的下载量`
  },
  {
    id: 1320,
    title: '跑步页面异常退出后如何恢复运动数据？TraceManager 的单例设计有什么意义？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['异常恢复', '单例模式', 'TraceManager', '数据持久化', '用户体验'],
    content: `## 跑步页面异常退出后如何恢复运动数据？TraceManager 的单例设计有什么意义？

**答案：**
**异常退出恢复流程：**

用户跑步中途 App 崩溃或被系统杀死，重新进入页面时，\`TraceManager\` 初始化时会向服务端查询上次运动状态：

\`\`\`typescript
// TraceManager 初始化时检测未完成的运动
const initRes = await trpc.trace.init.query();

if (initRes.retCode === TraceResponseRetCode.unexpectedStop) {
  // 服务端检测到上次运动未正常结束
  this.startTime = initRes.startTime;  // 恢复开始时间
  this.inPrevPageSend = true;          // 标记为异常恢复状态

  // 弹窗让用户决策
  mqq.ui.showDialog({
    title: '提示',
    text: '你有跑步/健走锻炼进行中，需要终止当前的锻炼吗？',
    okBtnText: '终止当前锻炼',
    cancelBtnText: '查看当前锻炼',
  }, async ({ button }) => {
    if (button === 'ok') {
      await this.stopTrace(); // 用户选择终止，上传已有数据
    } else {
      await this.resumeTrace(); // 用户选择继续，恢复运动
    }
  });
}
\`\`\`

**TraceManager 单例设计的意义：**

跑步页面由多个组件共同操作同一份运动数据：
- \`App.vue\`：负责地图轨迹绘制
- \`RunningView.vue\`：负责数据展示和控制按钮
- \`HomeView.vue\`：负责开始/结束入口

如果每个组件各自持有一个 \`TraceManager\` 实例，会导致：
1. **状态不同步**：A 组件暂停了，B 组件的状态还是运行中
2. **重复初始化**：多次调用 \`init\` 接口，产生脏数据
3. **事件监听重复**：GPS 数据被处理多次，距离计算翻倍

单例模式保证全局只有一个 \`TraceManager\` 实例，所有组件通过**事件总线（mitt）** 订阅状态变化，实现解耦：

\`\`\`typescript
// 单例实现
class TraceManager {
  private static instance: TraceManager;

  static getInstance(): TraceManager {
    if (!TraceManager.instance) {
      TraceManager.instance = new TraceManager();
    }
    return TraceManager.instance;
  }
}

// 组件中使用
const trace = TraceManager.getInstance();

// 通过事件总线解耦，组件不直接调用 TraceManager 的方法
trace.on('statusChange', (status) => {
  // 各组件独立响应状态变化
});
\`\`\`

**追问：** 单例模式在 Vue3 中有什么需要注意的地方？

**答案：**
Vue3 的 SSR 场景下，单例模式会有**跨请求状态污染**问题：

服务端渲染时，多个用户的请求共享同一个 Node.js 进程，如果 \`TraceManager\` 是模块级单例，用户 A 的运动数据可能被用户 B 的请求读取到。

解决方案：
1. **SSR 中不使用单例**：服务端每次请求创建新实例，只在客户端使用单例
2. **请求级隔离**：通过 \`AsyncLocalStorage\` 为每个请求维护独立的上下文

\`\`\`typescript
// 区分 SSR 和 CSR 环境
const getTraceManager = () => {
  if (import.meta.env.SSR) {
    return new TraceManager(); // SSR：每次新建
  }
  return TraceManager.getInstance(); // CSR：单例
};
\`\`\``
  },
  {
    id: 1321,
    title: '整个项目的请求链路是怎样的？前端发起一次 TRPC 请求到后台经历了哪些步骤？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['TRPC', 'BFF', 'Koa', '请求链路', '全栈'],
    content: `## 整个项目的请求链路是怎样的？前端发起一次 TRPC 请求到后台经历了哪些步骤？

**答案：**
完整的请求链路分为 **5 个层次**：

\`\`\`
前端 Vue 组件
    ↓ axios POST /v3/trpc/{action}/{cmd}?g_tk=xxx
Nginx（反向代理）
    ↓ 转发到 Node 服务 :80
Koa BFF 层（src/index.ts）
    ↓ router.all('/(v2|v3)/trpc/:action/:cmd')
    ↓ publicTrpcRequest.request(action, cmd, data, { ctx })
    ↓ commonBeforeHandler 注入请求头（uin/pskey/platform/ip等）
后端 TRPC 微服务（user_server / rank_server / score_server 等）
    ↓ 返回数据
Koa BFF 层 → 前端
\`\`\`

**前端请求封装**（来自 \`website/lib/request.ts\`）：

\`\`\`typescript
// 前端统一用 createTrpcRequest 工厂函数创建请求
export const createTrpcRequest = <P, R>(action: string, cmd: string) =>
  async (data?: P) => {
    const response = await axios.request<R>({
      url: \\\`https://yundong.qq.com/v3/trpc/\\\${action}/\\\${cmd}?g_tk=\\\${user.getToken('p_skey')}\\\`,
      method: 'post',
      data,
      withCredentials: true, // 携带 Cookie（uin/skey/pskey）
      timeout: 60 * 1000,
    });
    return response;
  };
\`\`\`

**Node BFF 层请求头注入**（来自 \`src/trpc/qqsport-common-header.ts\`）：

\`\`\`typescript
// commonBeforeHandler 在每次 TRPC 请求前自动注入
const requestHeader = {
  uid: user.getUin(),       // QQ号
  type: '27',               // 登录态类型（pskey=27）
  sig: pskey,               // 登录态签名
  domain_id: '539',         // 业务域ID
  platform: '109/110',      // Android=109, iOS=110
  qq_version: '...',        // 手Q版本号
  client_ip: ip,            // 客户端真实IP
};
\`\`\`

**后端微服务注册**（来自 \`src/trpc/public.ts\`）：

\`\`\`typescript
export const publicTrpcRequest = new TrpcController({
  user_server: userServerConfig,    // 用户服务
  rank_server: rankServerConfig,    // 排行榜服务
  score_server: scoreServerConfig,  // 积分服务
  orbit_server: orbitServerConfig,  // 轨迹服务
  share_server: shareServerConfig,  // 分享服务
});
\`\`\`

**追问：** URL 中的 \`g_tk\` 参数是什么？为什么要带它？

**答案：**
\`g_tk\` 是基于 \`p_skey\` 计算出的 **CSRF Token**，防止跨站请求伪造攻击。

计算方式：
\`\`\`typescript
// user.getToken('p_skey') 内部实现
const getGTK = (skey: string): number => {
  let hash = 5381;
  for (let i = 0; i < skey.length; i++) {
    hash += (hash << 5) + skey.charCodeAt(i);
  }
  return hash & 0x7fffffff;
};
\`\`\`

服务端会校验请求中的 \`g_tk\` 与 Cookie 中的 \`p_skey\` 是否匹配，不匹配则拒绝请求。由于攻击者无法读取其他域的 Cookie，所以无法伪造有效的 \`g_tk\`。`
  },
  {
    id: 1322,
    title: 'SSR 页面的完整渲染流程是怎样的？从用户输入 URL 到看到页面经历了哪些步骤？',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['SSR', 'Koa中间件', '登录态', '页面渲染', '全流程'],
    content: `## SSR 页面的完整渲染流程是怎样的？从用户输入 URL 到看到页面经历了哪些步骤？

**答案：**
以访问 \`/v3/page/run/\` 为例，完整流程如下：

\`\`\`
1. 用户访问 /v3/page/run/
2. Nginx 转发到 Node 服务
3. Koa 路由匹配 /v3/page/:action/
4. 中间件链依次执行：
   ├── getPageName     → 解析 action="run"，写入 ctx.pageName
   ├── checkBrowser    → 检查浏览器环境（TODO: 版本检测）
   ├── checkPageNeedLogin → 校验登录态
   │   ├── 读取 ssr-config.json 中 run 的配置
   │   ├── ignorePtlogin=false → 需要登录
   │   ├── 从 Cookie 读取 uin + pskey
   │   ├── 调用 verifyUinAndPSkey 校验登录态
   │   └── 校验失败 → 重定向到 ptlogin2 登录页
   └── pageRequest     → 执行 SSR 渲染
       ├── getPageConfig('run') → 加载页面配置（含缓存）
       │   ├── 读取 dist/client/pages/run/index.html（模板）
       │   ├── import dist/server/run.js（render函数）
       │   └── import dist/pages/sync/run.js（syncFunc）
       ├── syncFunc(ctx) → 服务端预取数据，写入 Pinia
       ├── render(url, pageData) → Vue3 SSR 渲染，返回 [appHtml, modules, piniaState]
       ├── getPageManifest() → 读取 ssrManifest，获取资源清单
       ├── renderPreloadLinks(modules, manifest) → 生成精准预加载标签
       └── 拼装 HTML → 注入 piniaState + preloadLinks + appHtml → 返回
\`\`\`

**登录态校验的核心代码**（来自 \`src/pages/index.ts\`）：

\`\`\`typescript
export const checkPageNeedLogin = async (ctx: Context, next: Next) => {
  const pageConfig = SSR_PAGES?.[pageName];

  if (!pageConfig.ignorePtlogin) {
    const pskey = getPskey(ctx); // 从 Cookie 读取 p_skey
    if (!pskey) {
      // QQ内：重定向到 ptlogin2 刷新登录态
      ctx.redirect(\\\`https://ui.ptlogin2.qq.com/cgi-bin/login?...&s_url=\\\${encodeURIComponent(ctx.url)}\\\`);
      return;
    }

    // 非本地环境：调用腾讯登录验证服务
    const { result } = await verifyUinAndPSkey(\\\`\\\${uin}\\\`, pskey, DOMAIN_ID);
    if (result !== 1) {
      // 鉴权失败处理
    }
  }

  await next(); // 登录态验证通过，继续渲染
};
\`\`\`

**追问：** v2 路由（如 \`/v2/sport/run/\`）是如何兼容的？

**答案：**
通过 \`V2RouteMapping\` 路由映射表，将旧路由转换为新的 \`pageName\`：

\`\`\`typescript
// src/pages/handle-v2-path.ts
export const getV2PageName = async (ctx: Context, next: Next) => {
  const { module, action } = ctx.params;
  const v2Path = \\\`\\\${module}/\\\${action}\\\`; // 如 "sport/run"

  // 查映射表，转换为 v3 的 pageName
  const pageName = V2RouteMapping[v2Path] ?? '';
  ctx.pageName = pageName; // 如 "run"

  await next(); // 后续流程与 v3 完全一致
};
\`\`\`

这样 v2 和 v3 路由共用同一套渲染逻辑，只是入口不同，维护成本极低。`
  },
  {
    id: 1323,
    title: 'Node 服务是如何集成伽利略（Galileo）全链路监控的？监控了哪些维度？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['伽利略', 'OpenTelemetry', '监控', '链路追踪', 'Node.js'],
    content: `## Node 服务是如何集成伽利略（Galileo）全链路监控的？监控了哪些维度？

**答案：**
项目在 \`src/index.ts\` 中通过 **OpenTelemetry 自动插桩** 集成伽利略监控，分为两个维度：

**1. 链路追踪（Tracing）**

\`\`\`typescript
// 注册 TracerProvider
const tracerProvider = registerTracerProvider(new Resource({
  [GalileoTraceResourceAttributes.TARGET]: SERVER_TARGET,
  [GalileoTraceResourceAttributes.SERVICE_NAME]: SERVER_NAME,
  [GalileoTraceResourceAttributes.HOST_IP]: process.env.POD_IP,
  [GalileoTraceResourceAttributes.ENV_NAME]: SERVER_ENV_NAME,
  [GalileoTraceResourceAttributes.CONTAINER_NAME]: SERVER_CONTAINER,
}));

// 自动插桩：无需手动埋点
registerInstrumentations({
  instrumentations: [
    new TrpcClientInstrumentation(), // 自动追踪所有 TRPC 调用
    new HttpInstrumentation({        // 自动追踪所有 HTTP 请求
      applyCustomAttributesOnSpan: (span) => {
        span.setAttribute(GalileoTraceAttributes.TRPC_NAMESPACE, 'Production');
        span.setAttribute(GalileoTraceAttributes.TRPC_ENV_NAME, SERVER_ENV_NAME);
      },
    }),
  ],
});
\`\`\`

**2. 指标上报（Metrics）**

\`\`\`typescript
// 注册 MeterProvider
registerMeterProvider(new Resource({
  [GalileoResourceAttributes.Target]: SERVER_TARGET,
  [GalileoResourceAttributes.ServiceName]: SERVER_NAME,
  [GalileoResourceAttributes.Namespace]: IS_PROD ? 'Production' : 'Development',
}));

// 在 TRPC 路由中上报指标
setTrpcGlobalConfig({
  beforeHook: (ctx) => {
    ctx.metricReportStartTimestamp = Date.now();
    metricReporter.trpc.activeStarted();
  },
  afterHook: (res, ctx) => {
    const duration = Date.now() - ctx.metricReportStartTimestamp;
    metricReporter.trpc.activeHandled(duration, res);
  },
});
\`\`\`

**监控维度总结：**

| 维度 | 内容 |
|---|---|
| 链路追踪 | 每个 TRPC 调用和 HTTP 请求的完整 Span，含 TraceID |
| 请求耗时 | TRPC 请求从发起到返回的耗时 |
| 错误率 | 请求失败的比例和错误类型 |
| 并发数 | 当前活跃请求数 |
| 环境信息 | Pod IP、容器名、环境名，方便定位问题机器 |

**追问：** 本地开发环境为什么不注册监控？

**答案：**
\`\`\`typescript
if (!IS_LOCAL) {
  // 只在测试/生产环境注册
  registerTracerProvider(...);
  registerMeterProvider(...);
}
\`\`\`

原因有三：
1. **性能**：OpenTelemetry 插桩有一定性能开销，本地开发不需要
2. **网络**：本地环境无法访问内网的伽利略 Collector 端点
3. **噪音**：本地调试产生的数据会污染监控大盘，影响告警准确性`
  },
  {
    id: 1324,
    title: '项目中 Koa 中间件是如何组织的？trackId 和 asyncStore 解决了什么问题？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['Koa', '中间件', 'AsyncLocalStorage', '链路追踪', 'trackId'],
    content: `## 项目中 Koa 中间件是如何组织的？trackId 和 asyncStore 解决了什么问题？

**答案：**
Koa 中间件按以下顺序组织（来自 \`src/index.ts\`）：

\`\`\`typescript
// 1. 全局日志中间件：生成 trackId，记录请求耗时
app.use(async (ctx, next) => {
  ctx.startTime = Date.now();
  ctx.trackId = \\\`\\\${pmId}-\\\${nanoid()}\\\`; // PM2进程ID + 随机ID，全局唯一
  console.log(\\\`[ \\\${ctx.trackId} ][ \\\${ctx.url} ] - start\\\`);
  await next();
  const duration = Date.now() - ctx.startTime;
  logger.info(\\\`[ \\\${ctx.trackId} ][ \\\${ctx.url} ] - end cost \\\${duration}ms\\\`);
});

// 2. asyncStore：将 ctx 存入 AsyncLocalStorage
app.use(asyncStore(defaultStoreMaker));

// 3. bodyParser：解析请求体
app.use(bodyParser());

// 4. 路由中间件（TRPC / CGI / SSR / 健康检查）
app.use(router.routes());
\`\`\`

**trackId 的作用：**
每个请求生成唯一的 \`trackId\`（格式：\`{pm2进程ID}-{nanoid}\`），所有日志都带上这个 ID，方便在海量日志中**过滤出同一个请求的完整日志链**，快速定位问题。

**asyncStore 解决的问题：**
Node.js 是单线程异步模型，多个请求并发时共享同一个进程。\`asyncStore\` 基于 \`AsyncLocalStorage\` 实现**请求级别的上下文隔离**：

\`\`\`typescript
// 在 TRPC 请求头注入时，需要读取当前请求的 ctx（含 Cookie）
// 但 TrpcController 的 beforeHandler 不直接接收 ctx 参数
// 通过 asyncStore 可以在任意异步调用栈中获取当前请求的 ctx
const ctx = getAsyncStore<Context>();
const pskey = ctx.cookies.get('p_skey'); // 读取当前请求的 Cookie
\`\`\`

没有 \`asyncStore\` 的话，请求 A 的 Cookie 可能被请求 B 读取，造成用户数据混乱。

**追问：** nanoid 相比 UUID 有什么优势？

**答案：**
| 特性 | UUID v4 | nanoid |
|---|---|---|
| 长度 | 36字符（含连字符） | 默认21字符 |
| 字符集 | 16进制 | URL安全字符（A-Za-z0-9_-） |
| 碰撞概率 | 极低 | 同等长度下更低 |
| 性能 | 较慢 | 比 UUID 快约 60% |
| 包体积 | 较大 | 极小（~130B） |

在日志 ID 场景下，nanoid 更短、更快、URL 安全，是更好的选择。`
  },
  {
    id: 1325,
    title: '项目中前端的 useTrpcRequest 和 createTrpcRequest 有什么区别？分别适用什么场景？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['Vue3', 'Composition API', 'axios', '请求封装', 'TypeScript'],
    content: `## 项目中前端的 useTrpcRequest 和 createTrpcRequest 有什么区别？分别适用什么场景？

**答案：**
两者都在 \`website/lib/request.ts\` 中定义，底层都调用同一个 \`trpcRequest\` 函数，区别在于**是否集成 Vue 响应式**：

\`\`\`typescript
// createTrpcRequest：纯函数，不含响应式状态
// 适用于：工具函数、非组件上下文、SSR syncFunc 中
export const createTrpcRequest = <P, R>(action: string, cmd: string) =>
  async (data?: P) => trpcRequest(action, cmd, data);

// 使用示例
const fetchUserInfo = createTrpcRequest<{uin: string}, IUserInfo>('user_server', 'GetUserInfo');
const result = await fetchUserInfo({ uin: '123456' });


// useTrpcRequest：Composition API Hook，含 isLoading 响应式状态
// 适用于：Vue 组件内，需要展示 loading 状态
export const useTrpcRequest = <P, R>(action: string, cmd: string) => {
  const isLoading = ref(false);

  const request = async (data?: P) => {
    isLoading.value = true;
    const result = await trpcRequest(action, cmd, data);
    isLoading.value = false;
    return result;
  };

  return [request, isLoading] as const;
};

// 使用示例
const [fetchRanking, isLoading] = useTrpcRequest<void, IRankingData>('rank_server', 'GetRanking');
// 模板中直接绑定 isLoading
// <LoadingSpinner v-if="isLoading" />
\`\`\`

**响应检查机制：**

\`\`\`typescript
// responseCheckHandler：自定义成功判断逻辑
const fetchData = createTrpcRequest('score_server', 'GetScore', {
  responseCheckHandler: (response) => response.data?.retCode === 0,
});
\`\`\`

**追问：** useTrpcRequest 中 isLoading 在请求失败时不会重置，你会怎么修复？

**答案：**
使用 \`try/finally\` 确保无论成功失败都重置 loading：

\`\`\`typescript
const request = async (data?: P) => {
  isLoading.value = true;
  try {
    return await trpcRequest(action, cmd, data);
  } finally {
    isLoading.value = false;
  }
};
\`\`\`

同时还可以增加**错误状态**：

\`\`\`typescript
const isLoading = ref(false);
const error = ref<unknown>(null);

const request = async (data?: P) => {
  isLoading.value = true;
  error.value = null;
  try {
    return await trpcRequest(action, cmd, data);
  } catch (e) {
    error.value = e;
    throw e;
  } finally {
    isLoading.value = false;
  }
};

return [request, isLoading, error] as const;
\`\`\``
  },
  {
    id: 1326,
    title: '项目中地图 SDK 是如何按需加载的？暗黑模式下地图有什么特殊处理？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['腾讯地图', '按需加载', '暗黑模式', 'SSR', '性能优化'],
    content: `## 项目中地图 SDK 是如何按需加载的？暗黑模式下地图有什么特殊处理？

**答案：**
地图 SDK 只有需要地图的页面才加载，在 \`src/pages/index.ts\` 的 \`pageRequest\` 中实现：

\`\`\`typescript
// 常量配置：哪些页面需要地图
const NEED_MAP_PAGES = ['run', 'end', 'share']; // 跑步、结束、分享页需要地图

// 暗黑模式下使用不同的地图 Key（对应不同的地图主题）
const MAP_KEY_LIGHT = 'xxx-light-key';
const MAP_KEY_DARK  = 'xxx-dark-key';

const isNeedMap = NEED_MAP_PAGES.includes(action);
const isDarkMode = browser.isDarkMode(); // 检测系统暗黑模式

if (isNeedMap) {
  // 根据暗黑模式选择不同的 Key，地图服务端会返回对应主题的瓦片
  const mapKey = isDarkMode ? MAP_KEY_DARK : MAP_KEY_LIGHT;
  const mapTemplate = \\\`
    <script charset="utf-8"
      src="https://map.qq.com/api/gljs?libraries=geometry&v=1.exp&key=\\\${mapKey}">
    </script>
  \\\`;
  preloadLinks = mapTemplate + preloadLinks; // 注入到 HTML head 中
}
\`\`\`

**暗黑模式的额外处理：**

\`\`\`typescript
// 暗黑模式下额外引入 QUI Token CSS，避免主题色影响组件样式
const isDarkMode = browser.isDarkMode();
let preloadLinks = \\\`
  \\\${isDarkMode ? '<link rel="stylesheet" href="https://qq-web.cdn-go.cn/qui/latest/qui/token.css">' : ''}
\\\`;
\`\`\`

**为什么用两个不同的地图 Key 而不是动态切换主题？**
腾讯地图的暗黑主题是通过不同的 API Key 配置在服务端的，同一个 Key 只能对应一种地图样式。在 SSR 阶段就确定好 Key，避免客户端 JS 加载后再切换导致地图闪烁。

**追问：** 如果用户在跑步过程中切换了系统暗黑模式，地图会怎样？

**答案：**
SSR 阶段已经确定了地图 Key，客户端 hydration 后地图 SDK 已经加载完毕，此时切换暗黑模式**不会自动切换地图主题**。

处理方案：
\`\`\`typescript
// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    // 切换到暗黑模式：重新初始化地图，使用暗黑 Key
    map.destroy();
    initMap(MAP_KEY_DARK);
  } else {
    map.destroy();
    initMap(MAP_KEY_LIGHT);
  }
});
\`\`\`

但实际上跑步中途切换主题是极低频操作，项目中可以接受不处理这个边界情况，保持简单。`
  },
  {
    id: 1327,
    title: '项目中 vConsole 是如何按环境注入的？非生产环境的调试工具链是怎样的？',
    category: 'QQ运动',
    difficulty: 'easy',
    tags: ['vConsole', '调试', '环境变量', 'SSR', '工程化'],
    content: `## 项目中 vConsole 是如何按环境注入的？非生产环境的调试工具链是怎样的？

**答案：**
vConsole 在 SSR 渲染阶段按环境条件注入，来自 \`src/pages/index.ts\`：

\`\`\`typescript
// 非生产环境（本地 + 测试）才注入 vConsole
if (!IS_PROD) {
  const vconsoleTemplate = await loadHTML(EHTMLType.vconsole);
  preloadLinks = \\\`
    \\\${vconsoleTemplate}  // vConsole 脚本放在最前面，确保最早加载
    \\\${preloadLinks}
  \\\`;
}
\`\`\`

**完整的调试工具链：**

| 工具 | 环境 | 作用 |
|---|---|---|
| vConsole | 本地 + 测试 | 移动端 H5 调试控制台，查看 console/network/storage |
| Vite HMR | 仅本地 | 热更新，修改代码即时生效 |
| Vite SSR Fix | 仅本地 | \`vite.ssrFixStacktrace\` 修复 SSR 错误堆栈，指向源码而非编译后代码 |
| whistle 代理 | 本地开发 | 将线上域名代理到本地服务，模拟真实环境 |

**SSR 错误堆栈修复：**

\`\`\`typescript
// src/pages/index.ts
} catch (error) {
  if (IS_LOCAL && error instanceof Error) {
    const vite = await getViteServer();
    vite.ssrFixStacktrace(error); // 将编译后的行号映射回源码行号
  }
  // 渲染失败时降级到 error 页面
  await pageRequest(ctx, 'error');
}
\`\`\`

没有这个处理，SSR 报错时堆栈指向的是 \`dist/server/xxx.js\` 的编译后代码，行号完全对不上，调试极其困难。

**追问：** 本地开发时为什么需要 whistle 代理？直接访问 localhost 不行吗？

**答案：**
不行，原因有三：

1. **Cookie 域名限制**：QQ 登录的 Cookie（\`uin\`、\`skey\`、\`p_skey\`）绑定在 \`yundong.qq.com\` 域名下，\`localhost\` 无法读取这些 Cookie，导致登录态校验失败
2. **mqq SDK 限制**：手Q 的 \`mqq\` JS Bridge 只在特定域名下才能正常工作，\`localhost\` 会被拦截
3. **HTTPS 要求**：部分 API（如 GPS 定位）要求 HTTPS 环境，\`localhost\` 是 HTTP

通过 whistle 将 \`yundong.qq.com\` 代理到 \`127.0.0.1:本地端口\`，既保留了真实域名的 Cookie 和 SDK 支持，又能访问本地开发服务器。`
  },
  {
    id: 1328,
    title: '项目中 Aegis（TAM）前端监控是如何集成的？监控了哪些前端指标？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['Aegis', 'TAM', '前端监控', '性能', '错误上报'],
    content: `## 项目中 Aegis（TAM）前端监控是如何集成的？监控了哪些前端指标？

**答案：**
Aegis 通过 SSR 模板注入的方式集成，在 \`src/pages/index.ts\` 的 \`pageRequest\` 中：

\`\`\`typescript
// 加载 Aegis v2 模板（包含初始化脚本）
const aegisV2Template = await loadHTML(EHTMLType.aegisV2);

let preloadLinks = \\\`
  \\\${aegisV2Template.replace('<!--project-env-->', IS_PROD ? 'production' : 'development')}
  \\\${manifest ? renderPreloadLinks(ctxModules || [], manifest) : ''}
\\\`;
\`\`\`

Aegis 模板会在 HTML head 中注入初始化脚本，根据 \`project-env\` 区分上报到不同的监控项目（生产/开发）。

**监控的前端指标：**

| 类型 | 具体指标 |
|---|---|
| **性能指标** | FCP（首次内容绘制）、LCP（最大内容绘制）、FID（首次输入延迟）、CLS（累积布局偏移） |
| **错误监控** | JS 运行时错误、Promise 未捕获异常、资源加载失败 |
| **接口监控** | TRPC 请求成功率、耗时、错误码分布 |
| **自定义上报** | 业务关键路径（如跑步开始/结束成功率） |

**前端自定义上报示例**（来自 \`website/lib/atta/\` 目录）：

\`\`\`typescript
// website/lib/atta/run.ts
import { aegis } from './base';

// 跑步开始成功率上报
export const reportRunStart = (success: boolean) => {
  aegis.reportEvent({
    name: 'run_start',
    ext1: success ? 'success' : 'fail',
  });
};

// 跑步结束上报（含距离、时长等关键数据）
export const reportRunEnd = (data: { distance: number; duration: number }) => {
  aegis.reportEvent({
    name: 'run_end',
    ext1: String(data.distance),
    ext2: String(data.duration),
  });
};
\`\`\`

**追问：** Aegis 和伽利略（Galileo）监控有什么区别？为什么要同时用两套？

**答案：**
两套监控面向不同的层次：

| | Aegis（TAM） | 伽利略（Galileo） |
|---|---|---|
| 监控层 | **前端**（浏览器端） | **后端**（Node.js 服务端） |
| 数据来源 | 用户浏览器上报 | Node 进程内采集 |
| 核心能力 | 页面性能、JS 错误、用户行为 | 服务调用链路、接口耗时、服务健康 |
| 典型场景 | 页面白屏、JS 报错、慢页面 | TRPC 调用失败、Node 服务 OOM |

两套监控互补：Aegis 告诉你"用户侧出了什么问题"，伽利略告诉你"服务侧哪个环节出了问题"，结合 TraceID 可以打通前后端的完整问题链路。`
  },
  {
    id: 1329,
    title: '项目中 rem 适配方案是如何实现的？TO428_PAGES 是什么？',
    category: 'QQ运动',
    difficulty: 'easy',
    tags: ['rem', '移动端适配', '响应式', 'SSR', '设计稿'],
    content: `## 项目中 rem 适配方案是如何实现的？TO428_PAGES 是什么？

**答案：**
项目使用 **rem 动态适配**方案，在 SSR 渲染时根据页面类型注入不同的 rem 基准脚本：

\`\`\`typescript
// src/pages/index.ts
// TO428_PAGES：基于 428px 设计稿的页面（如分享页，需要适配更宽的屏幕）
const remTemplate = TO428_PAGES.includes(action)
  ? await loadHTML(EHTMLType.rem428)  // 428px 基准
  : await loadHTML(EHTMLType.rem);    // 375px 基准（默认）

const html = template
  .replace('<!--body-start-->', \\\`\\\${remTemplate}\\\`); // 注入到 body 最开始
\`\`\`

**rem 脚本的核心逻辑：**

\`\`\`javascript
// rem.js（375px 设计稿基准）
(function() {
  const setRem = () => {
    const width = document.documentElement.clientWidth;
    // 以 375px 为基准，1rem = 设计稿中的 1px
    // 屏幕宽度 375px 时：1rem = 1px（font-size = 1px，实际用100倍：1rem=100px）
    const fontSize = (width / 375) * 100; // 100 是为了方便计算
    document.documentElement.style.fontSize = fontSize + 'px';
  };
  setRem();
  window.addEventListener('resize', setRem);
})();

// rem428.js（428px 设计稿基准，用于分享页等宽屏设计）
const fontSize = (width / 428) * 100;
\`\`\`

**为什么注入到 body-start 而不是 head？**
rem 脚本需要在页面内容渲染前执行，避免出现**FOUC（无样式内容闪烁）**——如果脚本加载慢，页面会先以默认字体大小渲染，然后突然跳变到正确大小，用户会看到明显的布局抖动。

**追问：** rem 方案和 vw/vh 方案相比有什么优缺点？

**答案：**

| | rem | vw/vh |
|---|---|---|
| 兼容性 | 更好，支持老版本 Android | 现代浏览器均支持 |
| 实现复杂度 | 需要 JS 动态设置 font-size | 纯 CSS，无需 JS |
| 最大宽度限制 | 可以通过 JS 设置上限，防止在 iPad 上过大 | 需要 CSS media query 配合 |
| 字体大小影响 | 用户调整系统字体大小会影响布局 | 不受系统字体影响 |

项目选择 rem 的主要原因是**兼容性**（需要支持较老版本的 Android QQ）和**可以通过 JS 灵活控制最大宽度**，防止在平板等大屏设备上布局过于宽松。`
  },
  {
    id: 1330,
    title: '项目中 PM2 多进程部署是如何工作的？trackId 中为什么要包含 PM2 进程 ID？',
    category: 'QQ运动',
    difficulty: 'medium',
    tags: ['PM2', '多进程', 'Node.js', '部署', '日志追踪'],
    content: `## 项目中 PM2 多进程部署是如何工作的？trackId 中为什么要包含 PM2 进程 ID？

**答案：**
项目使用 **PM2 cluster 模式**部署，根据 CPU 核心数启动多个 Node.js 进程，共同监听 80 端口：

\`\`\`
                    ┌─────────────────────────────────┐
                    │         Nginx :443              │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │      PM2 Cluster Master          │
                    └──┬──────┬──────┬──────┬─────────┘
                       │      │      │      │
                  ┌────▼─┐ ┌──▼──┐ ┌─▼───┐ ┌▼────┐
                  │ PM2  │ │ PM2 │ │ PM2 │ │ PM2 │
                  │ ID:0 │ │ ID:1│ │ ID:2│ │ ID:3│  ← 每个进程独立处理请求
                  └──────┘ └─────┘ └─────┘ └─────┘
\`\`\`

**trackId 包含 PM2 进程 ID 的原因：**

\`\`\`typescript
// src/index.ts
const pmId = getPmID(); // 获取当前进程的 PM2 ID（0, 1, 2, 3...）

app.use(async (ctx, next) => {
  ctx.trackId = \\\`\\\${pmId}-\\\${nanoid()}\\\`; // 如 "2-V1StGXR8_Z5jdHi6B-myT"
  // ...
});
\`\`\`

**原因：**
1. **日志定位**：多进程并发时，同一时刻有多个进程在处理请求，日志混在一起。通过 \`pmId\` 前缀可以快速过滤出**某个进程**的所有日志，判断是否是进程级别的问题（如内存泄漏只影响某个进程）
2. **问题复现**：当某个进程出现异常时，可以通过 \`pm2 restart {id}\` 只重启问题进程，不影响其他进程继续服务
3. **负载均衡验证**：通过统计各 \`pmId\` 的请求量，可以验证 PM2 的负载均衡是否均匀

**追问：** PM2 的 cluster 模式和 fork 模式有什么区别？项目为什么选 cluster？

**答案：**

| | fork 模式 | cluster 模式 |
|---|---|---|
| 进程数 | 通常1个 | CPU核心数个 |
| 端口共享 | 每个进程独立端口 | 所有进程共享同一端口 |
| 负载均衡 | 需要 Nginx 分发 | PM2 内置负载均衡 |
| 内存 | 较少 | 较多（多个进程） |
| 适用场景 | 简单部署、微服务 | 高并发、充分利用多核 |

项目选择 cluster 模式的原因：
1. **充分利用多核 CPU**：Node.js 单线程，cluster 模式可以利用服务器的所有 CPU 核心
2. **高可用**：某个进程崩溃时，PM2 自动重启，其他进程继续服务，不影响用户
3. **零停机发布**：\`pm2 reload\` 逐个重启进程，始终保持有进程在服务`
  },
  {
    id: 1331,
    title: 'QQ运动项目的难点和亮点是什么？（面试总结）',
    category: 'QQ运动',
    difficulty: 'hard',
    tags: ['项目亮点', '项目难点', 'SSR', 'BFF', '面试话术'],
    content: `## QQ运动项目的难点和亮点是什么？（面试总结）


## 🔥 项目亮点

### 1. BFF 层架构设计（全栈类型安全）
前端用 \`createTrpcRequest<P, R>\` 工厂函数，泛型约束请求参数和返回值类型；Node BFF 层用 \`TrpcController\` 统一管理后端微服务注册（\`user_server\`/\`rank_server\`/\`score_server\`/\`orbit_server\`/\`share_server\`），前后端类型完全对齐，接口变更时 TypeScript 编译阶段就能发现问题，而不是运行时报错。

### 2. SSR + Pinia 状态注水（首屏零二次请求）
\`\`\`
syncFunc 服务端预取数据 → Vue3 SSR render → piniaState 序列化注入 HTML
→ 客户端 hydration 直接从 window.__INITIAL_STATE__ 恢复状态
→ 不需要重新发起任何接口请求
\`\`\`
用户拿到的是**已填充真实数据的完整 HTML**，首屏白屏时间极短，同时 SEO 友好。

### 3. 页面配置防并发穿透缓存
\`src/pages/config.ts\` 中的 \`PageCache\` 设计非常精细：
- **已缓存** → 直接返回内存对象
- **加载中** → 复用同一个 \`Promise\`，不重复触发文件 IO
- **未加载** → 触发 IO 并缓存

这个"三态缓存"在高并发场景下避免了**缓存击穿**问题，是很好的工程实践。

### 4. 基于 SSR Manifest 的精准资源预加载
\`src/pages/preload-links.ts\` 中，SSR 渲染时会收集**当前页面实际用到的模块列表**（\`ctxModules\`），再通过 \`ssrManifest\` 映射到具体文件，只为这些文件生成 \`<link rel="modulepreload">\` 标签。不是全量预加载，而是**精准预加载**，避免浪费带宽。

### 5. 跑步页面 TraceManager 单例 + 事件总线解耦
地图层（\`App.vue\`）和控制层（\`RunningView.vue\`）通过 \`mitt\` 事件总线通信，\`TraceManager\` 作为核心引擎不直接依赖任何 Vue 组件，可以独立测试，也方便后续迁移到其他框架。

### 6. 双套监控体系互补
- **Aegis（TAM）**：前端侧，监控页面性能（FCP/LCP）、JS 错误、用户行为
- **伽利略 + OpenTelemetry**：服务端侧，监控 TRPC 调用链路、接口耗时、Pod 健康

两套监控通过 TraceID 打通，出问题时可以从前端报错一路追溯到后端哪个微服务的哪次调用出了问题。

---

## 💪 项目难点

### 难点一：iOS / Android GPS 授权机制完全不同
\`\`\`typescript
// iOS：需要主动调用一次 getLocation 触发授权弹窗
if (browser.isIOS()) {
  mqq.sensor.getLocation(param, callback);
}

// iOS：还需要在 PathTraceStart 之前调用 PathTraceInit 确保监听打开
if (browser.isIOS()) {
  await initTrace(); // Android 不需要这步
}

// Android：分模块授权，不直接返回定位，通过 PathTraceSend 事件推送
\`\`\`
两套完全不同的授权和数据推送机制，需要在同一套代码里分别处理，稍有遗漏就会出现某个平台定位不工作的 Bug。

### 难点二：跑步状态机的并发控制（9个状态）
\`\`\`
unknow → init → ready → requestStart → start
                                          ↓
                                 requestPause → pause
                                          ↓
                                 requestResume → start
                                          ↓
                                 requestStop → uploadRecords → ready
\`\`\`
每个操作都有对应的"请求中"过渡态（如 \`requestPause\`），用户在网络慢时可能连续点击，过渡态的存在防止了重复触发。这个状态机设计需要对所有状态转换路径都考虑清楚，漏掉任何一个边界情况都会导致跑步数据丢失。

### 难点三：切后台时间补偿
\`\`\`typescript
// 切后台：记录时间戳，停止前端计时器
if (document.hidden) {
  trace.qbrowserHiddenTimestamp = Date.now();
  trace.stopTraceTimer();
}
// 切回前台：计算后台时长，补偿到总时间
else {
  const bgDuration = Math.round((Date.now() - trace.qbrowserHiddenTimestamp) / 1000);
  trace.setTraceTotalTime(trace.recordData.totalTime + bgDuration);
  trace.startTraceTimer();
}
\`\`\`
用户跑步时切换 App 是高频操作，前端计时器暂停但实际时间在流逝，必须精确补偿，否则跑步时长数据会偏小。

### 难点四：防作弊算法（Vincenty 公式）
用 **Vincenty 椭球体公式**（比 Haversine 更精确）计算轨迹点间距离，检测速度超过 \`7m/s\`（人类极限）的异常轨迹段，累计异常距离超过 \`500m\` 则判定作弊，弹出提示。难点在于：
- 需要在移动端实时计算大量轨迹点，性能要求高
- 阈值的设定需要平衡误判率（正常跑步被误判）和漏判率（作弊被放过）

### 难点五：AsyncLocalStorage 实现请求级上下文隔离
Node.js 多请求并发时，\`commonBeforeHandler\` 需要读取**当前请求**的 Cookie（\`pskey\`/\`skey\`），但 \`TrpcController\` 的 \`beforeHandler\` 不直接接收 \`ctx\` 参数。通过 \`asyncStore\`（基于 \`AsyncLocalStorage\`）在任意异步调用栈中获取当前请求的 \`ctx\`，实现请求级别的上下文隔离，防止请求 A 的 Cookie 被请求 B 读取。

### 难点六：Vite 5.x CommonJS 兼容性
Vite 5.x 默认不支持 CommonJS 模块，但项目依赖的部分 Node.js 库（如 \`@tencent/qlib\`）是 CJS 格式，需要用 \`vite-plugin-cjs-interop\` 处理模块格式转换，否则 SSR 构建时会报 \`require is not defined\` 错误。

---

## 💡 面试话术

### 被问"项目最大的亮点"时：
> "我觉得最大的亮点是 SSR + Pinia 状态注水的组合。服务端通过 \`syncFunc\` 并行预取所有接口数据，渲染完 HTML 后把 Pinia 状态序列化注入到页面里，客户端 hydration 后直接从 \`window.__INITIAL_STATE__\` 恢复，完全不需要重新请求接口，首屏体验非常好。另外页面配置的三态缓存设计也很精细，解决了高并发下的缓存击穿问题。"

### 被问"项目最难的地方"时：
> "跑步页面最难的是两块：一是 iOS 和 Android 的 GPS 授权机制完全不同，iOS 需要主动调用获取定位并预初始化监听，Android 是分模块授权后通过事件推送，两套逻辑都要处理；二是切后台的时间补偿，用户跑步时切 App 是高频操作，前端计时器暂停但实际时间在流逝，通过监听 \`visibilitychange\` 事件精确补偿后台时长，保证计时准确。"`
  },
  {
    id: 1332,
    title: 'QQ运动项目面试难点与亮点讲解（Kuikly 跨端框架）',
    category: 'QQ运动',
    difficulty: 'hard',
    content: `## QQ运动项目面试难点与亮点讲解（Kuikly 跨端框架）

> 以下内容按"**一句话结论 → 展开说 → 一句话收尾**"的结构组织，方便背诵和口头表达。

---

## 📋 一句话总结（面试开场白）

> 这个项目是基于腾讯自研的 **Kuikly 跨端框架**，用 **Kotlin Multiplatform** 开发的 QQ 运动模块，实现了 iOS/Android 双端代码共享。核心难点在于**步数授权的双平台差异处理**、**本地与远程步数的一致性同步**、以及**多弹窗的优先级调度**。亮点是用 **observable 响应式状态管理** + **分层 Store 架构** 实现了清晰的数据流，以及 **Tab keepAlive + 懒加载** 保证了切换性能。

---

## ✨ 亮点一：Kuikly 跨端框架 + Kotlin Multiplatform

**一句话：** 整个项目用 Kotlin 写一套代码，同时跑在 iOS 和 Android 上，不是 RN 也不是 Flutter，是腾讯自研的 Kuikly 框架。

**展开说：**
- 业务逻辑（Store、网络请求、状态管理）全部用 Kotlin 编写，iOS 和 Android 共用同一份代码
- UI 层用 Kuikly 的 DSL 声明式语法写，类似 Compose/SwiftUI 的风格
- 框架底层在 iOS 上编译为 Objective-C 框架，在 Android 上编译为 DEX，性能接近原生
- 相比 RN/Flutter，Kuikly 的渲染层直接调用平台原生组件，没有额外的渲染引擎开销

**收尾：** 这让我们一套代码维护两端，大幅降低了开发和维护成本。

---

## ✨ 亮点二：响应式状态管理（observable + 分层 Store）

**一句话：** 项目用 \`observable\` 委托实现了类似 Vue 的响应式系统，状态变了 UI 自动更新，不需要手动 \`notifyDataSetChanged\`。

**展开说：**
\\\`\\\`\\\`kotlin
// 声明响应式状态，变更时 UI 自动重渲染
var tabIndex by observable(NavigationTab.HOME)
var pages by observableList<PageConfig>()
\\\`\\\`\\\`
- Store 按模块分层：\`MainStore\`（全局）→ \`HomeStore\`（首页聚合）→ \`HomeTopStore\`、\`HomeVitalityStore\` 等子模块
- \`ReactiveObserver.bindValueChange\` 用于 Store 内部的计算属性联动，类似 Vue 的 \`watch\`
- 所有 Store 都是 \`object\` 单例，跨 Tab 共享状态，不依赖 Android ViewModel 的生命周期

**收尾：** 这套架构让数据流向非常清晰，调试和维护都很方便。

---

## ✨ 亮点三：Tab keepAlive + 懒加载设计

**一句话：** 四个 Tab 页面切换时不销毁，用 \`keepAlive(true)\` + \`visibility\` 控制显隐，同时做了懒加载，首次切换才渲染。

**展开说：**
- \`pages\` 列表初始只有第一个 Tab，切换时才把新 Tab 加入列表（懒加载，按需渲染）
- 已加载的 Tab 通过 \`visibility(tabIndex == page.tabIndex)\` 控制显隐，不销毁不重建
- Tab 切换时用 \`setTimeout(1)\` 延迟触发 \`viewDidAppear\`，等待下一帧渲染完成，避免操作未挂载的 View

\\\`\\\`\\\`kotlin
// body() 中的核心代码
vfor({ MainStore.pages }) { page ->
    HomePage {
        attr {
            keepAlive(true)                                    // 保活
            visibility(MainStore.tabIndex == page.tabIndex)   // 控制显隐
        }
    }
}
\\\`\\\`\\\`

**收尾：** 这样既保证了切换流畅，又保留了每个 Tab 的滚动位置和数据状态。

---

## 💪 难点一：步数授权的双平台、双层授权体系

**一句话：** iOS 要同时处理 HealthKit 和"运动与健身"两套权限，Android 9.2.20 以上还要额外处理华为/小米等厂商 SDK 授权，逻辑非常复杂。

**展开说（iOS）：**
\\\`\\\`\\\`
checkIOSAuthStatus()
  ├── checkIOSHeathKitAuthStatus()   → AUTHED → 直接通过
  ├── NOT_SUPPORT → 降级检查运动与健身
  └── NOT_AUTH → 也检查运动与健身作为兜底
\\\`\\\`\\\`
- iOS 有**限频机制**：通过 \`QQSportCache\` 记录今日是否已弹过授权弹窗，避免每次进入都打扰用户
- \`suspendCoroutine\` 把回调式的原生 API 包装成挂起函数，让授权流程可以用顺序代码写

**展开说（Android）：**
\\\`\\\`\\\`
openAndroidRequestStepAuthPop()   // 第一层：系统传感器权限
    ↓ 授权成功 && 版本 >= 9.2.20
openAndroidAuthSDKPop()           // 第二层：厂商 SDK 权限（华为/小米等）
\\\`\\\`\\\`
- Android 授权回调是**立刻返回**的（不等用户点击），需要在回调里判断 \`permission && systemPermission\`

**收尾：** 这块是整个项目里平台差异最大、最容易出 bug 的地方，需要花很多时间梳理各种边界情况。

---

## 💪 难点二：步数数据的本地/远程一致性同步

**一句话：** 本地传感器步数和后台步数可能不一致，需要比较后决定展示哪个，并在必要时把本地步数同步给后台。

**展开说：**
\\\`\\\`\\\`kotlin
// checkStepsSync() 的逻辑
if (localSteps > todayRemoteSteps) {
    // 本地步数更多，同步给后台
    val isSyncSuccessed = HealthTools.instance.syncLocalStepsToRemote()
    if (isSyncSuccessed) {
        // 同步成功后等 500ms 再重新拉取数据（等后台处理完）
        setTimeout(500) { requestPageData() }
    }
} else {
    // 远程步数更多，直接用远程的
    todayStep = todayRemoteSteps
}
\\\`\\\`\\\`
- 先显示**本地步数**（即时反馈），再等网络数据回来校正，是一种乐观更新策略
- 过滤掉 10 万步以上的异常数据（部分 Android 设备传感器会返回累计步数）
- 凌晨 0~2 点进入时，默认展示昨日数据（\`hours < 2\` 时 \`isShowTodayData = false\`）

**收尾：** 这块涉及多个异步时序，稍有不慎就会出现步数闪烁或数据不一致的问题。

---

## 💪 难点三：多弹窗优先级管理

**一句话：** 页面里有步数授权弹窗、HealthKit 授权弹窗、GDT 广告、天枢广告、好友 PK 弹窗，需要严格按优先级排队，不能同时出现。

**展开说：**
\\\`\\\`\\\`
优先级（高 → 低）：
1. 步数授权弹窗（系统级）
2. iOS HealthKit 授权弹窗
3. GDT 蒙层广告（客户端广告）
4. 天枢蒙层广告（运营广告）
5. 好友步数 PK 弹窗
\\\`\\\`\\\`
- \`checkAllModalShow()\` 是统一的检查入口，在**页面 appear、首屏数据加载完、授权完成、广告信息返回**等多个时机都会调用
- 审核模式（\`isReview\`）、青少年模式（\`isStudyMode\`）、适老模式下，所有弹窗全部屏蔽（合规要求）
- 弹窗之间有互斥逻辑：\`HealthKitAuthModal\` 在好友 PK 弹窗显示时不显示

**收尾：** 这种多状态联动的弹窗管理，如果没有统一的调度入口，很容易出现弹窗叠加或漏显的 bug。

---

## 💪 难点四：首屏性能监控与多阶段耗时上报

**一句话：** 首屏渲染耗时上报需要同时满足 \`isLoaded\`、\`isAppeared\`、\`isLayout\`、\`isNeedReportFirstScreenDisplay\` 四个条件，精确捕捉用户真正看到内容的时刻。

**展开说：**
\\\`\\\`\\\`kotlin
fun reportFirstScreenDataDisplay() {
    // 四个条件缺一不可
    if (isFirstScreenReported || !isLoaded || !isAppeared || !isLayout || !isNeedReportFirstScreenDisplay) return

    setTimeout(1) {  // 等下一帧渲染完成
        val cost = firstScreenDataDisplayTimestamp - launchTimestamps.openPage
        Logger.home.firstScreenDataDisplay(LOG_KEY, JSONObject().apply {
            put("fetchContextStart", ...)   // 资源加载开始
            put("renderContextEnd", ...)    // 引擎初始化完成
            put("viewLoadEnd", ...)         // 页面 body 构建完成
            put("layoutEnd", ...)           // 布局计算完成
            put("firstScreenDataDisplayCost", cost)  // 总耗时
        })
    }
}
\\\`\\\`\\\`
- 记录了从"用户点击"到"首屏数据渲染完成"的完整链路，包含资源加载、引擎初始化、页面构建、布局、数据请求各阶段
- 用 \`isFirstScreenReported\` 标志位防止重复上报

**收尾：** 这套监控让我们能精确定位性能瓶颈在哪个阶段，是做性能优化的数据基础。`,
    tags: ['QQ运动', 'Kuikly', 'Kotlin Multiplatform', '跨端开发', '面试总结', '状态管理', '性能监控']
  },
  {
    id: 1350,
    title: '项目中 PM2 多进程部署是如何工作的？trackId 中为什么要包含 PM2 进程 ID？',
    category: 'QQ运动',
    difficulty: 'medium',
    content: `## 项目中 PM2 多进程部署是如何工作的？trackId 中为什么要包含 PM2 进程 ID？

**答案：**
项目使用 **PM2 cluster 模式**部署，根据 CPU 核心数启动多个 Node.js 进程，共同监听 80 端口：

\`\`\`
┌─────────────────────────────────┐
│           Nginx :443            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│       PM2 Cluster Master        │
└──┬──────┬──────┬──────┬─────────┘
   │      │      │      │
┌────▼─┐ ┌──▼──┐ ┌─▼───┐ ┌▼────┐
│ PM2  │ │ PM2 │ │ PM2 │ │ PM2 │
│ ID:0 │ │ ID:1│ │ ID:2│ │ ID:3│ ← 每个进程独立处理请求
└──────┘ └─────┘ └─────┘ └─────┘
\`\`\`

**trackId 包含 PM2 进程 ID 的原因：**

\`\`\`typescript
// src/index.ts
const pmId = getPmID(); // 获取当前进程的 PM2 ID（0, 1, 2, 3...）

app.use(async (ctx, next) => {
  ctx.trackId = \\\`\\\${pmId}-\\\${nanoid()}\\\`; // 如 "2-V1StGXR8_Z5jdHi6B-myT"
  // ...
});
\`\`\`

**原因：**
1. **日志定位**：多进程并发时，同一时刻有多个进程在处理请求，日志混在一起。通过 \`pmId\` 前缀可以快速过滤出**某个进程**的所有日志，判断是否是进程级别的问题（如内存泄漏只影响某个进程）
2. **问题复现**：当某个进程出现异常时，可以通过 \`pm2 restart {id}\` 只重启问题进程，不影响其他进程继续服务
3. **负载均衡验证**：通过统计各 \`pmId\` 的请求量，可以验证 PM2 的负载均衡是否均匀

**追问：** PM2 的 cluster 模式和 fork 模式有什么区别？项目为什么选 cluster？

**答案：**

| 模式| fork 模式 | cluster 模式 |
|---|---|---|
| 进程数 | 通常1个 | CPU核心数个 |
| 端口共享 | 每个进程独立端口 | 所有进程共享同一端口 |
| 负载均衡 | 需要 Nginx 分发 | PM2 内置负载均衡 |
| 内存 | 较少 | 较多（多个进程） |
| 适用场景 | 简单部署、微服务 | 高并发、充分利用多核 |

项目选择 cluster 模式的原因：
1. **充分利用多核 CPU**：Node.js 单线程，cluster 模式可以利用服务器的所有 CPU 核心
2. **高可用**：某个进程崩溃时，PM2 自动重启，其他进程继续服务，不影响用户
3. **零停机发布**：\`pm2 reload\` 逐个重启进程，始终保持有进程在服务`,
    tags: ['PM2', '多进程', 'Node.js', '部署', '日志追踪']
  },
]