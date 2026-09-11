// QQ运动Kuikly项目解析 - 内容第3部分（性能监控+缓存+广告+跨端通信+动画+难点+亮点+演进）
export default `
## 九、性能监控与上报体系

### 9.1 首屏渲染耗时上报

精细化的首屏渲染耗时监控，覆盖从用户点击到数据渲染完成的全链路：openPage → fetchContextStart → fetchContextEnd → renderContextStart → renderContextEnd → viewLoadStart → viewLoadEnd → layoutStart → layoutEnd → contentViewCreated → firstScreenDataDisplay

### 9.2 新版性能上报

支持三种加载模式区分：TurboDisplay 模式、有缓存模式、无缓存模式

### 9.3 ATTA 数据上报

覆盖所有关键用户行为（曝光/点击），异步发送不阻塞主流程

---

## 十、缓存策略设计

\\\`\\\`\\\`kotlin
enum class QQSportCacheType {
    ONCE,       // 终身一次（如：首次授权引导）
    EVERY_DAY,  // 每天一次（如：授权弹窗限频）
}
\\\`\\\`\\\`

所有缓存 Key 集中在 QQSportCache.Keys 对象中管理（共20+个缓存Key），支持标志位缓存和内容缓存（页面配置缓存）

---

## 十一、广告系统集成

| 广告类型 | 位置 | 实现方式 |
|---|---|---|
| Banner 广告 | 打卡页列表中 | QQAdView 组件 |
| 天枢蒙层广告 | 全屏弹窗 | Modal + QQSportTianshuPushDialog |
| GDT 蒙层广告 | 全屏弹窗 | 客户端原生 |
| 激励视频广告 | 步数球气泡 | QQKuiklyRewardVideoModule |
| 首页广告 | 首页列表 | HomeFirstAdStore / HomeSecondAdStore |

**广告优先级与互斥逻辑：** 通过 checkAllModalShow() 统一调度，天枢广告 > 好友PK弹窗

---

## 十二、跨端通信机制

### 12.1 Kuikly 与 WebView 通信

\\\`\\\`\\\`kotlin
// 监听 WebView 消息
notifyModule.addWebViewNotify(Constants.Events.QQSPORT_SWITCH_RUN_TAB) { data -> ... }

// 向 WebView 发送消息
notifyModule.postWebViewNotify(Constants.WebViewEvent.UPDATE_VITALITY_CENTER_PAGE, ...)
\\\`\\\`\\\`

### 12.2 页面间通信

通过 NotifyModule 进行通信，所有事件名称集中在 Constants.Events 对象中管理

---

## 十三、动画与视觉亮点

### 13.1 圆形进度条动画

最复杂的动画实现，核心挑战：
1. 圆环颜色从起点到终点做渐变
2. 圆环可以超过 360°（多圈），最多显示最后三圈
3. 动画需要流畅，不能有卡顿
4. 圆环终点需要有阴影效果

**解决方案：** 使用系统时间驱动动画、AsyncChoreographer 帧调度、角度较小时分小段绘制（颜色渐变更流畅）、蒙层遮盖技术（CLEAR + OVER 混合模式）

### 13.2 数字滚动动画

步数更新时数字从旧值滚动到新值

### 13.3 PAG/APNG 动画支持

首页顶部背景支持 PAG 和 APNG 两种动画格式，支持动态替换文字

---

## 十四、难点与解决方案

### 14.1 双引擎并存的代码复用

**解决方案：** 工具类抽象（Utils.currentPage()）、健康工具统一（HealthTools）、缓存工具统一（QQSportCache）、上报工具统一（AttaReporter）

### 14.2 弹窗优先级与互斥

**解决方案：** checkAllModalShow() 统一调度函数，多个条件门控 + 优先级顺序 + 早返回确保互斥

### 14.3 步数本地与远程数据同步

**解决方案：** 先显示本地步数（快速响应），后用远程步数覆盖（准确性），过滤异常数据（>10万步）

### 14.4 版本兼容性管理

**解决方案：** Constants.init() 统一初始化版本特性开关

\\\`\\\`\\\`kotlin
fun init() {
    IS_SUPPORT_AD_MANAGER = QQUtils.compare("9.0.15") >= 0
    IS_SUPPORT_MODULE_AUTHORIZE = QQUtils.compare("9.0.20") >= 0
    IS_SUPPORT_AD_MARGIN_ZERO = QQUtils.compare("9.0.70") >= 0
    IS_SUPPORT_GO_SETTING_PAGE = QQUtils.compare("9.1.65") >= 0
}
\\\`\\\`\\\`

### 14.5 圆环动画的跨平台差异

**解决方案：** iOS 使用 boxShadow 实现阴影，Android 使用 graphicsLayer + shadow 实现

### 14.6 Tab 切换的生命周期管理

**解决方案：** 正确触发 viewWillDisappear → viewWillAppear → 更新 tabIndex → setTimeout(1) → viewDidDisappear + viewDidAppear

---

## 十五、亮点总结

### 15.1 架构亮点

1. **渐进式双引擎迁移策略** - 新页面用 NTCompose，旧页面保持 Kuikly，共享工具类和状态管理层
2. **分层清晰的 Store 设计** - 聚合 Store + 子 Store 模式
3. **统一的版本特性开关** - Constants.init() 集中管理

### 15.2 性能亮点

1. **首屏预加载** - created() 阶段就开始预加载首屏数据
2. **keepAlive Tab 缓存** - Tab 切换不销毁重建
3. **本地步数优先显示** - 快速响应 + 数据准确的平衡
4. **Bundle 预加载** - viewDidLoad() 阶段预加载其他 Kuikly Bundle

### 15.3 工程亮点

1. **完善的错误处理** - 错误码枚举、远程日志上报、用户友好提示
2. **精细化的数据上报** - ATTA 上报覆盖所有关键用户行为
3. **防抖与限频机制** - 缓存系统限频 + Utils.throttling() 防抖
4. **健壮的异常处理** - 关键操作包裹在 try-catch 中

### 15.4 用户体验亮点

1. **弹窗优先级管理** - 重要弹窗优先于广告弹窗
2. **夜间模式支持** - themeDidChanged 回调实时响应
3. **凌晨数据处理** - 凌晨0-2点默认显示昨日数据

---

## 十六、架构演进思考

### 16.1 当前架构的局限性

1. 双引擎维护成本高
2. 全局 Object Store 的线程安全问题
3. Store 间耦合较高
4. 测试困难（大量全局单例）

### 16.2 演进方向建议

1. **完全迁移到 NTCompose** - 统一技术栈
2. **引入依赖注入** - 提高可测试性
3. **单向数据流** - MVI 架构
4. **模块化拆分** - 通过接口依赖而非直接引用

---

## 结语

QQ 运动 Kuikly 模块是一个典型的大型跨端移动应用模块，在架构设计、跨平台处理、性能优化、工程规范和用户体验等维度上展现了较高的工程水准。双引擎并存带来的维护成本和全局单例的测试困难是当前架构的主要局限，随着业务发展，逐步向统一引擎和更好的模块化方向演进是合理的技术路径。

---

> **文档字数统计**：约 18,000 字  
> **覆盖文件数**：100+ 个 Kotlin 源文件  
> **分析深度**：架构设计 · 核心流程 · 关键算法 · 难点解决方案 · 亮点总结
`
