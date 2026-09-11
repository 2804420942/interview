// QQ运动Kuikly项目解析 - 内容第2部分（状态管理+网络请求+健康授权+UI渲染）
export default `
## 五、状态管理体系

### 5.1 Kuikly 响应式状态

\`\`\`kotlin
object MainStore {
    var tabIndex by observable(NavigationTab.HOME)
    var isShowNavigationBar by observable(true)
    var pages by observableList<PageConfig>()

    private fun setObserver() {
        ReactiveObserver.bindValueChange(tabIndex) { checkCurrentData() }
        ReactiveObserver.bindValueChange(pages) {
            currentPageConfig = pages.find { it.tabIndex == tabIndex }
        }
    }
}
\`\`\`

### 5.2 NTCompose 状态管理

\`\`\`kotlin
class AppViewModel: BaseViewModel() {
    var dataDate by mutableStateOf(Date.now())
    var isToday by mutableStateOf(true)
    var calendarList = mutableStateListOf<CalendarItemModel>()
    var targetStep by mutableStateOf(0)
}
\`\`\`

### 5.3 跨 ViewModel 数据同步

通过 NotificationManager 进行数据同步：

\`\`\`kotlin
fun onDataSync(name: String, callback: (Any?) -> Unit) {
    syncDataNotifyRef = NotificationManager.addListener(
        NotificationManager.Keys.SYNC_DATA
    ) { data ->
        syncDataList.keys.forEach { key ->
            if (data?.has(key) == true) syncDataList[key]?.invoke(data.opt(key))
        }
    }
    syncDataList[name] = callback
}
\`\`\`

---

## 六、网络请求层设计

### 6.1 请求基类架构

\`\`\`kotlin
class BaseRequest private constructor() {
    companion object { val instance by lazy { BaseRequest() } }
    var requestSafetyDeviceHeader: JSONObject? = null

    suspend fun <Req: BaseRequestObject> sendRequest(request: Req): RequestResponse {
        // 1. 添加公共参数 scenes_from=sports_kuikly
        // 2. 获取安全设备头（QIMEI、设备型号等）
        // 3. 发起请求（含鉴权）QQRequest.requestWithAuth
        // 4. 记录耗时并上报
    }
}
\`\`\`

### 6.2 错误码体系

\`\`\`kotlin
enum class QQSportErrorCode(val value: Int) {
    SUCCESS(0),
    PSKEY_EMPTY(1001),
    MAIN_DATA_ERROR(1010),
    RANK_SERVER_QUERY_RANK_ERROR(1201),
    MARK_SERVER_CHECKIN_PAGE_ERROR(2001),
    // ... 共50+个错误码
}
\`\`\`

---

## 七、健康数据授权体系

### 7.1 iOS 授权体系

iOS 有两套健康数据来源：HealthKit（健康App）和 Motion & Fitness（运动与健身）

**限频机制：** 每日只弹一次健康授权弹窗

\`\`\`kotlin
val isExpired = QQSportCache.checkFlagExpired(Keys.IOS_HEATH_KIT_STEP_AUTH)
if (!isExpired) return false  // 今日已弹过
QQSportCache.setFlagCache(Keys.IOS_HEATH_KIT_STEP_AUTH)
healthModule.openHeathKitAuth(JSONObject()) { ... }
\`\`\`

### 7.2 Android 授权体系

两层授权：传感器权限 + 厂商 SDK 授权（9.1.70+）

\`\`\`kotlin
enum class AuthSDKStatus(val value: Int) {
    NOT_SUPPORT(-1),  // 设备不支持
    NOT_AUTH(0),      // 支持但未授权
    AUTHED(1);        // 已授权
}
\`\`\`

---

## 八、UI 渲染双引擎架构

### 8.1 Kuikly 引擎渲染机制

\`\`\`kotlin
override fun body(): ViewBuilder {
    return {
        attr { backgroundColor(ColorConstants.background) }
        vif({ MainStore.isShowNavigationBar }) { NavigationBar { } }
        vfor({ MainStore.pages }) { page ->
            when (page.tabIndex) {
                NavigationTab.HOME -> HomePage {
                    attr { keepAlive(true); visibility(MainStore.tabIndex == page.tabIndex) }
                }
            }
        }
        vif({ AdStore.isShowTianshuPushMaskModal }) {
            Modal { QQSportTianshuPushDialog { } }
        }
    }
}
\`\`\`

**keepAlive 机制：** 类似 Vue 的 keep-alive，Tab 切换时组件不销毁，通过 visibility 控制显隐

### 8.2 NTCompose 引擎渲染机制

基于 Jetpack Compose 思想，使用 @Composable 函数构建 UI

### 8.3 两套引擎的协同

\`\`\`kotlin
object Utils {
    val isNTCompose get() = (currentPager() as? BasePager) == null
    fun currentPage(): IPager = if (isNTCompose) currentActivity() else currentPager()
}
\`\`\`
`
