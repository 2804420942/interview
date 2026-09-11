// 技术博客 - 内容第3部分（Kuikly跨端项目完整解析）
export default `
---

## 第二章：QQ 运动 Kuikly 跨端项目

---

### 面试官：接下来聊聊 Kuikly 跨端项目吧。为什么选择 Kuikly 而不是 Flutter 或 React Native？

好的。QQ 运动的客户端部分采用的是腾讯自研的 **Kuikly** 跨端框架，基于 **Kotlin Multiplatform（KMP）** 技术。选择 Kuikly 而非 Flutter 或 React Native，主要有以下几个考量：

**第一，深度集成 QQ 客户端能力。** QQ 运动是 QQ App 内置的模块，需要大量调用 QQ 客户端的原生能力，比如步数传感器、健康数据授权、消息推送、分享等。Kuikly 是腾讯自研的，和 QQ 客户端的桥接层已经非常成熟，调用原生能力就像调用本地函数一样简单。如果用 Flutter 或 RN，需要自己写大量的 Bridge 代码，维护成本很高。

**第二，Kotlin Multiplatform 的优势。** KMP 允许用 Kotlin 编写共享的业务逻辑，同时保留各平台的原生 UI 渲染能力。这意味着：
- 业务逻辑（网络请求、数据处理、状态管理）只写一份，iOS 和 Android 共享
- UI 层可以使用各平台原生的渲染引擎，性能接近原生
- Kotlin 语言本身的协程、空安全、扩展函数等特性，开发体验很好

**第三，双引擎并存的灵活性。** 我们的项目同时使用了 Kuikly 引擎和 NTCompose 引擎。Kuikly 引擎适合复杂列表和多 Tab 页面，NTCompose 引擎（基于 Jetpack Compose 思想）适合动画丰富、交互复杂的单页面。两套引擎可以根据页面特点灵活选择。

**和其他方案的对比：**

| 维度 | Kuikly (KMP) | Flutter | React Native |
|---|---|---|---|
| 语言 | Kotlin | Dart | JavaScript |
| 渲染方式 | 原生渲染 | 自绘引擎 | 原生渲染 |
| 包体积 | 较小（共享原生库） | 较大（自带引擎） | 中等 |
| QQ 集成 | 原生支持 | 需要大量 Bridge | 需要大量 Bridge |
| 性能 | 接近原生 | 接近原生 | 略低于原生 |
| 热更新 | 支持 | 受限 | 支持 |

---

### 面试官：能详细说说 Kuikly 和 NTCompose 两套引擎的差异吗？为什么要同时维护两套？

这是一个很好的问题。两套引擎的存在有历史原因，也有技术原因。

**Kuikly 引擎** 是最早引入的，它的特点是：
- 使用自定义的 DSL 构建 UI（类似 SwiftUI 的声明式语法）
- 状态管理用 \`observable\` 响应式属性
- 生命周期：\`created → viewDidLoad → pageDidAppear\`
- 适合复杂列表、多 Tab 页面

\`\`\`kotlin
// Kuikly 引擎的 UI 构建方式
override fun body(): ViewBuilder {
    return {
        attr { backgroundColor(ColorConstants.background) }
        
        // 条件渲染：类似 Vue 的 v-if
        vif({ MainStore.isShowNavigationBar }) {
            NavigationBar { }
        }
        
        // 列表渲染：类似 Vue 的 v-for
        vfor({ MainStore.pages }) { page ->
            when (page.tabIndex) {
                NavigationTab.HOME -> HomePage {
                    attr { 
                        keepAlive(true)  // 类似 Vue 的 keep-alive
                        visibility(MainStore.tabIndex == page.tabIndex) 
                    }
                }
                NavigationTab.RANKING -> RankingPage { }
                NavigationTab.CHECKIN -> CheckInPage { }
            }
        }
    }
}
\`\`\`

**NTCompose 引擎** 是后来引入的，基于 Jetpack Compose 的思想：
- 使用 \`@Composable\` 函数构建 UI
- 状态管理用 \`mutableStateOf\`（和 Jetpack Compose 一致）
- 生命周期：\`onCreate → composeDidInit → onResume\`
- 适合动画丰富、交互复杂的单页面

\`\`\`kotlin
// NTCompose 引擎的状态管理
class AppViewModel : BaseViewModel() {
    var dataDate by mutableStateOf(Date.now())
    var isToday by mutableStateOf(true)
    var calendarList = mutableStateListOf<CalendarItemModel>()
    var targetStep by mutableStateOf(0)
    var currentStep by mutableStateOf(0)
}
\`\`\`

**为什么同时维护两套？**

1. **历史原因**：早期页面都是用 Kuikly 引擎开发的，后来 NTCompose 引擎成熟后，新页面开始用 NTCompose。但旧页面迁移成本太高，所以两套并存。
2. **各有优势**：Kuikly 的 \`vfor\` + \`keepAlive\` 在多 Tab 场景下表现更好（Tab 切换时组件不销毁），NTCompose 的动画系统更强大。
3. **渐进式迁移**：长期目标是统一到 NTCompose，但需要逐步迁移，不能一刀切。

**两套引擎的协同：**

\`\`\`kotlin
// 工具类判断当前使用的引擎
object Utils {
    val isNTCompose: Boolean
        get() = (currentPager() as? BasePager) == null
    
    fun currentPage(): IPager = 
        if (isNTCompose) currentActivity() else currentPager()
}
\`\`\`

---

### 面试官：响应式编程在业务中是怎么实践的？能举个具体的例子吗？

响应式编程是 Kuikly 项目的核心编程范式。简单来说就是"数据变了，UI 自动更新"。

**Kuikly 引擎的响应式：**

\`\`\`kotlin
object MainStore {
    // observable 属性：值变化时自动通知所有依赖它的 UI
    var tabIndex by observable(NavigationTab.HOME)
    var isShowNavigationBar by observable(true)
    var pages by observableList<PageConfig>()
    
    private fun setObserver() {
        // 监听 tabIndex 变化，自动执行回调
        ReactiveObserver.bindValueChange(tabIndex) { 
            checkCurrentData() 
        }
        
        // 监听 pages 列表变化
        ReactiveObserver.bindValueChange(pages) {
            currentPageConfig = pages.find { it.tabIndex == tabIndex }
        }
    }
}
\`\`\`

**举个具体的业务例子：步数更新流程**

用户的步数是实时变化的（手机传感器每隔几秒上报一次）。整个数据流是这样的：

\`\`\`
传感器上报步数 → HealthStore.currentStep 更新
    → 首页步数圆环动画自动更新
    → 排行榜中"我的步数"自动更新
    → 打卡页面的步数目标进度自动更新
\`\`\`

\`\`\`kotlin
object HealthStore {
    var currentStep by observable(0)
    var targetStep by observable(8000)
    
    // 步数进度（0.0 ~ 1.0）
    val progress: Float
        get() = if (targetStep > 0) 
            (currentStep.toFloat() / targetStep).coerceAtMost(1f) 
        else 0f
}

// 首页的步数圆环组件
// 只要 HealthStore.currentStep 变化，圆环就自动重绘
@Composable
fun StepCircle() {
    val progress = HealthStore.progress
    CircularProgressBar(
        progress = progress,
        animationDuration = 500  // 500ms 动画过渡
    )
    Text("\${HealthStore.currentStep} 步")
}
\`\`\`

**跨 ViewModel 数据同步：**

不同页面的 ViewModel 之间需要同步数据，我们通过 \`NotificationManager\` 实现：

\`\`\`kotlin
// 发送数据同步通知
NotificationManager.post(
    NotificationManager.Keys.SYNC_DATA,
    JSONObject().put("stepCount", newStepCount)
)

// 接收数据同步通知
fun onDataSync(name: String, callback: (Any?) -> Unit) {
    syncDataNotifyRef = NotificationManager.addListener(
        NotificationManager.Keys.SYNC_DATA
    ) { data ->
        syncDataList.keys.forEach { key ->
            if (data?.has(key) == true) {
                syncDataList[key]?.invoke(data.opt(key))
            }
        }
    }
    syncDataList[name] = callback
}
\`\`\`

这种方式类似于前端的 EventBus，但更加类型安全，而且可以精确控制哪些数据需要同步。

---

### 面试官：跨端一致性是怎么保障的？iOS 和 Android 的表现一致吗？

跨端一致性是跨端开发中最大的挑战之一。我们从几个层面来保障：

**第一，共享业务逻辑层。** 所有的业务逻辑（网络请求、数据处理、状态管理、缓存策略）都用 Kotlin 编写，iOS 和 Android 共享同一份代码。这从根本上保证了业务逻辑的一致性。

**第二，统一的设计规范。** UI 组件库有统一的设计规范，包括颜色、字体、间距、动画参数等，都定义在常量文件中：

\`\`\`kotlin
object ColorConstants {
    val background = if (isDarkMode) Color(0xFF1A1A1A) else Color(0xFFF5F5F5)
    val primaryText = if (isDarkMode) Color(0xFFE5E5E5) else Color(0xFF333333)
    val accentGreen = Color(0xFF00DC82)
}

object DimensConstants {
    val cardRadius = 12.dp
    val cardPadding = 16.dp
    val itemSpacing = 8.dp
}
\`\`\`

**第三，平台差异的抽象层。** 对于确实存在平台差异的部分（如健康数据授权、传感器接口），我们通过 \`expect/actual\` 机制做了抽象：

\`\`\`kotlin
// 共享代码中定义接口
expect class HealthModule {
    fun requestStepPermission(): Boolean
    fun getCurrentSteps(): Int
}

// iOS 实现
actual class HealthModule {
    actual fun requestStepPermission(): Boolean {
        // 调用 HealthKit API
        return healthKit.requestAuthorization()
    }
    actual fun getCurrentSteps(): Int {
        return healthKit.getStepCount()
    }
}

// Android 实现
actual class HealthModule {
    actual fun requestStepPermission(): Boolean {
        // 调用 Android 传感器 API
        return sensorManager.requestPermission()
    }
    actual fun getCurrentSteps(): Int {
        return sensorManager.getStepCount()
    }
}
\`\`\`

**第四，自动化测试。** 关键的 UI 组件和业务流程都有自动化测试覆盖，在 CI 中同时在 iOS 和 Android 模拟器上运行，确保两端表现一致。

---

### 面试官：健康数据授权这块挺复杂的，能详细说说吗？

健康数据授权确实是整个项目中最复杂的模块之一，因为 iOS 和 Android 的授权体系完全不同。

**iOS 授权体系：**

iOS 有两套健康数据来源：
1. **HealthKit**（健康 App）：需要用户在系统设置中授权
2. **Motion & Fitness**（运动与健身）：需要用户允许访问运动数据

而且 iOS 有一个很坑的限制：**每天只能弹一次健康授权弹窗**。如果用户拒绝了，当天就不能再弹了。所以我们做了限频机制：

\`\`\`kotlin
// iOS 健康授权限频
val isExpired = QQSportCache.checkFlagExpired(Keys.IOS_HEATH_KIT_STEP_AUTH)
if (!isExpired) return false  // 今日已弹过，不再弹
QQSportCache.setFlagCache(Keys.IOS_HEATH_KIT_STEP_AUTH)
healthModule.openHeathKitAuth(JSONObject()) { result ->
    // 处理授权结果
}
\`\`\`

**Android 授权体系：**

Android 的授权更复杂，有两层：
1. **传感器权限**：系统级别的运动传感器访问权限
2. **厂商 SDK 授权**（QQ 9.1.70+ 版本）：华为、小米等厂商的健康 SDK 授权

\`\`\`kotlin
enum class AuthSDKStatus(val value: Int) {
    NOT_SUPPORT(-1),  // 设备不支持
    NOT_AUTH(0),      // 支持但未授权
    AUTHED(1);        // 已授权
}

// Android 授权流程
suspend fun checkAndroidAuth() {
    // 第一步：检查传感器权限
    val sensorPermission = requestStepCounterPermission()
    if (!sensorPermission) {
        showPermissionGuide()
        return
    }
    
    // 第二步：检查 QQ 版本是否支持厂商 SDK
    if (qqVersion >= "9.1.70") {
        val sdkStatus = getAuthSDKStatus()
        when (sdkStatus) {
            AuthSDKStatus.NOT_SUPPORT -> {
                // 设备不支持，使用系统传感器
                useSystemSensor()
            }
            AuthSDKStatus.NOT_AUTH -> {
                // 弹出厂商 SDK 授权弹窗
                openAndroidAuthSDKPop()
            }
            AuthSDKStatus.AUTHED -> {
                // 已授权，直接获取步数
                getStepsFromSDK()
            }
        }
    } else {
        // 旧版本 QQ，仅使用系统传感器
        useSystemSensor()
    }
}
\`\`\`

**完整的步数授权流程图：**

\`\`\`
用户进入 QQ 运动
    ↓
showLocalSteps() → checkAuthStatus()
    ↓
  ┌─ iOS ──────────────────────────┐
  │ checkIOSAuthStatus()           │
  │   ├── 已授权 → getLocalSteps() │
  │   └── 未授权                    │
  │       ├── 今日已弹过 → 跳过     │
  │       └── 今日未弹 → 弹授权弹窗  │
  └────────────────────────────────┘
  ┌─ Android ──────────────────────┐
  │ checkAndroidAuthStatus()       │
  │   ├── 已授权 → getLocalSteps() │
  │   └── 未授权                    │
  │       ├── 限频检查              │
  │       ├── 请求传感器权限         │
  │       └── QQ >= 9.1.70?        │
  │           ├── 是 → 厂商SDK授权   │
  │           └── 否 → 仅传感器权限  │
  └────────────────────────────────┘
\`\`\`

---

### 面试官：网络请求层是怎么设计的？错误处理怎么做的？

网络请求层采用了单例模式 + 统一封装的设计：

\`\`\`kotlin
class BaseRequest private constructor() {
    companion object {
        val instance by lazy { BaseRequest() }
    }
    
    var requestSafetyDeviceHeader: JSONObject? = null
    
    suspend fun <Req : BaseRequestObject> sendRequest(request: Req): RequestResponse {
        // 1. 添加公共参数
        request.addParam("scenes_from", "sports_kuikly")
        
        // 2. 获取安全设备头（QIMEI、设备型号等）
        if (requestSafetyDeviceHeader == null) {
            requestSafetyDeviceHeader = getSafetyDeviceHeader()
        }
        
        // 3. 发起请求（含鉴权）
        val startTime = System.currentTimeMillis()
        val response = QQRequest.requestWithAuth(request)
        val duration = System.currentTimeMillis() - startTime
        
        // 4. 记录耗时并上报
        AttaReporter.reportRequestDuration(request.api, duration)
        
        return response
    }
}
\`\`\`

**错误码体系：**

我们定义了 50+ 个业务错误码，覆盖所有可能的错误场景：

\`\`\`kotlin
enum class QQSportErrorCode(val value: Int) {
    SUCCESS(0),
    PSKEY_EMPTY(1001),           // 登录态失效
    MAIN_DATA_ERROR(1010),       // 首页数据获取失败
    RANK_SERVER_QUERY_ERROR(1201), // 排行榜查询失败
    CHECKIN_PAGE_ERROR(2001),    // 打卡页面错误
    NETWORK_TIMEOUT(9001),       // 网络超时
    UNKNOWN_ERROR(9999),         // 未知错误
    // ... 共50+个错误码
}
\`\`\`

**错误处理策略：**

1. **登录态失效（1001）**：自动跳转到登录页面刷新 pskey
2. **网络超时（9001）**：显示重试按钮，用户点击后重新请求
3. **数据错误（1010）**：显示降级 UI（如缓存数据或默认数据）
4. **未知错误（9999）**：上报到监控平台，显示通用错误提示

---

### 面试官：缓存策略是怎么设计的？

缓存是提升用户体验的关键。我们设计了多级缓存策略：

\`\`\`kotlin
object QQSportCache {
    // 内存缓存：最快，但 App 退出后丢失
    private val memoryCache = HashMap<String, Any>()
    
    // 磁盘缓存：持久化存储
    private val diskCache = SharedPreferences(...)
    
    // 缓存读取策略：内存 → 磁盘 → 网络
    fun <T> get(key: String, loader: suspend () -> T): T {
        // 1. 先查内存缓存
        memoryCache[key]?.let { return it as T }
        
        // 2. 再查磁盘缓存
        diskCache.get(key)?.let { 
            memoryCache[key] = it  // 回填内存缓存
            return it as T 
        }
        
        // 3. 都没有，从网络加载
        val data = loader()
        memoryCache[key] = data
        diskCache.put(key, data)
        return data
    }
    
    // 限频标记（如每日只弹一次的弹窗）
    fun checkFlagExpired(key: String): Boolean {
        val lastTime = diskCache.getLong(key, 0)
        val now = System.currentTimeMillis()
        return now - lastTime > 24 * 60 * 60 * 1000 // 24小时过期
    }
    
    fun setFlagCache(key: String) {
        diskCache.putLong(key, System.currentTimeMillis())
    }
}
\`\`\`

**缓存的应用场景：**

1. **首页数据**：首次打开用缓存数据立即展示，后台静默更新
2. **排行榜数据**：缓存 5 分钟，减少服务端压力
3. **用户配置**：暗黑模式、字体大小等设置持久化
4. **授权状态**：避免重复弹授权弹窗
5. **广告数据**：预加载广告素材，展示时无需等待

---

### 面试官：数据上报和性能监控是怎么做的？

我们用的是腾讯内部的 **Atta 上报系统**，类似于前端的 Aegis，但是是客户端版本。

\`\`\`kotlin
object AttaReporter {
    // 页面加载耗时上报
    fun reportPageLoad(pageName: String, duration: Long) {
        report("page_load", mapOf(
            "page" to pageName,
            "duration" to duration,
            "platform" to getPlatform(),
            "version" to getQQVersion()
        ))
    }
    
    // 接口请求耗时上报
    fun reportRequestDuration(api: String, duration: Long) {
        report("api_duration", mapOf(
            "api" to api,
            "duration" to duration,
            "status" to "success"
        ))
    }
    
    // 错误上报
    fun reportError(errorCode: Int, message: String) {
        report("error", mapOf(
            "code" to errorCode,
            "message" to message,
            "stack" to getStackTrace()
        ))
    }
    
    // 自定义业务埋点
    fun reportEvent(eventName: String, params: Map<String, Any>) {
        report(eventName, params)
    }
}
\`\`\`

**关键监控指标：**

| 指标 | 目标值 | 实际值 |
|---|---|---|
| 首页加载时间 | < 500ms | 350ms |
| Tab 切换时间 | < 100ms | 60ms |
| 接口成功率 | > 99.5% | 99.8% |
| 崩溃率 | < 0.1% | 0.05% |
| 内存占用 | < 100MB | 80MB |

---

### 面试官：版本兼容是怎么处理的？不同 QQ 版本的功能差异大吗？

版本兼容是一个持续性的挑战。QQ 运动需要兼容多个 QQ 客户端版本（9.0.x 到 9.2.x+），不同版本支持的原生能力不同。

**我们的处理策略：**

\`\`\`kotlin
object VersionCompat {
    // 版本能力检测
    fun isSupported(feature: String): Boolean {
        val qqVersion = getQQVersion()
        return when (feature) {
            "auth_sdk" -> qqVersion >= "9.1.70"      // 厂商SDK授权
            "dark_mode" -> qqVersion >= "9.0.50"      // 暗黑模式
            "nt_compose" -> qqVersion >= "9.1.0"      // NTCompose引擎
            "step_sensor_v2" -> qqVersion >= "9.1.50" // 新版传感器API
            else -> true
        }
    }
    
    // 功能降级
    fun getStepSource(): StepSource {
        return when {
            isSupported("auth_sdk") -> StepSource.VENDOR_SDK  // 厂商SDK（最准确）
            isSupported("step_sensor_v2") -> StepSource.SENSOR_V2  // 新版传感器
            else -> StepSource.SENSOR_V1  // 旧版传感器（精度较低）
        }
    }
}
\`\`\`

**关键的版本分界点：**

| QQ 版本 | 新增能力 |
|---|---|
| 9.0.50 | 暗黑模式支持 |
| 9.1.0 | NTCompose 引擎 |
| 9.1.50 | 新版步数传感器 API |
| 9.1.70 | 厂商健康 SDK 授权 |
| 9.2.0 | 新版广告系统 |

对于不支持某个能力的旧版本，我们会做功能降级，而不是直接报错。比如不支持厂商 SDK 的版本，就退回到系统传感器获取步数，精度稍低但功能可用。
`
