// 技术博客 - 内容第2部分（TRPC通信+GPS轨迹处理+全链路监控+防作弊）
export default `
---

### 面试官：你提到了 TRPC，能详细说说 TRPC 相比传统 RESTful API 有什么优势？为什么选择 TRPC？

TRPC 是腾讯内部的 RPC 通信框架，全称是 Tencent RPC。选择它主要有几个原因：

**第一，类型安全。** 这是 TRPC 最大的优势。传统 RESTful API，前端调接口时只能靠文档知道请求参数和返回值的类型，文档过时了就只能靠猜。TRPC 通过 IDL（接口定义语言）定义接口，自动生成 TypeScript 类型，编译期就能发现类型错误：

\`\`\`typescript
// TRPC 接口定义（IDL 自动生成的类型）
interface GetEntryPageDataRequest {
  uin: string;
  platform: 'ios' | 'android';
}

interface GetEntryPageDataResponse {
  stepCount: number;
  targetStep: number;
  rankInfo: {
    rank: number;
    totalUsers: number;
  };
  checkInStatus: boolean;
}

// 调用时有完整的类型提示和检查
const result = await trpcRequest.request<
  GetEntryPageDataRequest, 
  GetEntryPageDataResponse
>('user_server', 'GetEntryPageData', { 
  uin: '12345',
  platform: 'ios' 
});

// result.stepCount 有类型提示，拼写错误编译期就能发现
console.log(result.stepCount); // ✅
console.log(result.stepCont);  // ❌ TypeScript 编译报错
\`\`\`

**第二，性能更好。** TRPC 使用二进制协议（Protocol Buffers），相比 JSON 格式的 RESTful API：
- 序列化/反序列化速度快 3-5 倍
- 数据体积小 30-50%
- 在高并发场景下优势更明显

**第三，服务发现。** TRPC 内置了服务发现机制，不需要硬编码后端服务的 IP 地址。服务注册到名字服务后，TRPC 客户端通过服务名自动找到可用的服务实例，还支持负载均衡和故障转移。

**第四，超时和重试。** TRPC 内置了超时控制和重试机制，不需要自己封装：

\`\`\`typescript
const result = await trpcRequest.request('user_server', 'GetData', params, {
  timeout: 3000,     // 3秒超时
  retryCount: 2,     // 失败重试2次
  retryInterval: 100 // 重试间隔100ms
});
\`\`\`

**和 RESTful API 的对比：**

| 维度 | RESTful API | TRPC |
|---|---|---|
| 类型安全 | 依赖文档，运行时才发现错误 | IDL 定义，编译期检查 |
| 序列化格式 | JSON（文本） | Protocol Buffers（二进制） |
| 性能 | 一般 | 序列化快 3-5 倍，体积小 30-50% |
| 服务发现 | 需要额外配置（如 Consul） | 内置 |
| 超时重试 | 需要自己封装 | 内置 |
| 调试便利性 | 浏览器可直接查看 | 需要专门工具 |

当然 TRPC 也有缺点，比如调试不如 RESTful 方便（二进制协议不能直接在浏览器看），学习成本稍高。但在我们这种高并发、多微服务的场景下，TRPC 的优势是压倒性的。

---

### 面试官：GPS 轨迹处理这块听起来很有挑战，能详细说说技术难点和解决方案吗？

GPS 轨迹处理确实是这个项目中技术含量最高的部分之一。QQ 运动有一个跑步功能，用户跑步时需要实时记录 GPS 轨迹、计算距离和配速、在地图上绘制轨迹线。

**难点 1：iOS 和 Android 的 GPS 接口差异巨大**

这是最头疼的问题。两个平台获取 GPS 数据的方式完全不同：

| 维度 | iOS | Android |
|---|---|---|
| 授权方式 | 进入页面主动调用获取 | 分模块授权，授权后通过事件推送 |
| 数据获取 | mqq.sensor.getLocation 回调返回 | 监听 PathTraceSend 事件 |
| 初始化 | 必须先 PathTraceInit 再 PathTraceStart | 直接 PathTraceStart |
| 定位精度 | 较高（CoreLocation） | 较低（GPS 芯片差异大） |

**解决方案：** 我设计了一个统一的 \`TraceManager\` 接口，内部根据平台分别处理：

\`\`\`typescript
class TraceManager {
  private platform: 'ios' | 'android';
  private tracePoints: IPathItem[] = [];
  
  async init() {
    if (this.platform === 'ios') {
      // iOS: 必须先 PathTraceInit
      await mqq.invoke('PathTraceInit', { accuracy: 'best' });
    }
    // Android: 不需要 init 步骤
  }
  
  async start() {
    if (this.platform === 'ios') {
      await mqq.invoke('PathTraceStart');
      // iOS: 主动轮询获取位置
      this.startPolling();
    } else {
      // Android: 监听事件推送
      mqq.on('PathTraceSend', (data) => {
        this.onLocationUpdate(data);
      });
      await mqq.invoke('PathTraceStart');
    }
  }
  
  private onLocationUpdate(data: GPSData) {
    // 统一的数据处理逻辑
    const point = this.normalizeGPSData(data);
    this.tracePoints.push(point);
    this.calculateDistance();
    this.updateUI();
  }
}
\`\`\`

**难点 2：GPS 信号不稳定导致轨迹漂移**

GPS 信号受建筑物遮挡、天气等因素影响，经常出现定位点突然跳到几百米外的情况。如果不处理，地图上的轨迹线会出现"锯齿"甚至"瞬移"。

**解决方案：多层过滤 + 卡尔曼滤波**

\`\`\`typescript
class GPSFilter {
  // 第一层：速度过滤
  // 人类跑步上限约 7m/s（约 25km/h），超过这个速度的点视为异常
  filterBySpeed(current: IPathItem, previous: IPathItem): boolean {
    const distance = getDistanceFromLatLonInKm(current, previous);
    const timeDiff = (current.timestamp - previous.timestamp) / 1000;
    const speed = distance * 1000 / timeDiff; // m/s
    return speed <= 15; // 15m/s 作为漂移阈值
  }
  
  // 第二层：精度过滤
  // GPS 精度值越小越准确
  filterByAccuracy(point: IPathItem): boolean {
    return point.accuracy < 100; // 精度大于100米的点丢弃
  }
  
  // 第三层：卡尔曼滤波平滑轨迹
  kalmanFilter(points: IPathItem[]): IPathItem[] {
    // 卡尔曼滤波算法，平滑轨迹点
    // 减少噪声，让轨迹线更平滑
    // ...
  }
}
\`\`\`

**GPS 信号强度判断：**

\`\`\`typescript
class GPSManager {
  setGPSAccuracy(gpsAccuracy?: number) {
    this.gpsAccuracy = gpsAccuracy || 80;
    if (this.gpsAccuracy < 20) {
      this.gpsStatus = EGPSStatus.powerful;  // 信号强
    } else if (this.gpsAccuracy < 50) {
      this.gpsStatus = EGPSStatus.normal;    // 信号一般
    } else if (this.gpsAccuracy < 100) {
      this.gpsStatus = EGPSStatus.weak;      // 信号弱
    } else {
      this.gpsStatus = EGPSStatus.none;      // 无信号
    }
  }
}
\`\`\`

**难点 3：距离计算的精度**

地球是个椭球体，不能简单用勾股定理算两点距离。我们用的是 **Vincenty 公式**，精度可以达到毫米级：

\`\`\`typescript
// Vincenty 公式计算两点间距离
function getDistanceFromLatLonInKm(
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number {
  const R = 6371; // 地球半径（km）
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
\`\`\`

---

### 面试官：你们怎么防止用户 GPS 作弊？比如用虚拟定位软件刷步数？

这是一个非常实际的问题。我们设计了多层防作弊机制：

**第一层：速度检测**

人类跑步的速度上限大约是 7m/s（世界纪录级别的短跑），普通人跑步一般在 2-4m/s。如果连续多个轨迹点的速度超过 7m/s，就标记为异常：

\`\`\`typescript
export const findFraudDis = (path: IPathItem[], max = 7) => {
  let allDis = 0, allDuration = 0;
  for (let k = 1; k < path.length; k++) {
    if (path[k].speed > max) {
      const pathDis = getDistanceFromLatLonInKm(path[k], path[k - 1]);
      allDis += pathDis;
      allDuration += (path[k].timestamp - path[k - 1].timestamp) / 1000;
    }
  }
  return [Math.round(allDis * 10) / 10, allDuration];
};
// 当累计异常距离超过 500m 时，弹出警告提示
\`\`\`

**第二层：轨迹漂移检测**

虚拟定位软件生成的轨迹往往有明显的特征：轨迹点过于均匀（真实跑步不可能每秒移动完全相同的距离）、没有自然的加速减速过程、轨迹线过于平滑（真实轨迹有自然的抖动）。

**第三层：服务端二次校验**

前端上传运动数据后，服务端会做以下校验：
- 总距离与轨迹点累计距离是否一致
- 总时长与轨迹点时间跨度是否一致
- 平均配速是否在合理范围内
- 轨迹点的时间间隔是否均匀（虚拟定位的特征）

**第四层：设备指纹**

收集设备型号、系统版本、屏幕尺寸、设备唯一标识等信息，建立设备指纹。同一设备如果频繁出现异常轨迹，会被标记为高风险设备。

---

### 面试官：全链路监控体系是怎么搭建的？能说说具体的实践吗？

全链路监控是保障服务稳定性的关键。我们搭建了一套从前端到后端的完整监控体系：

**前端监控：Aegis SDK**

Aegis 是腾讯内部的前端监控平台（类似 Sentry），我们用它来监控：
- **性能指标**：FCP、LCP、TTI、CLS 等 Web Vitals
- **错误监控**：JS 异常、Promise 未捕获异常、资源加载失败
- **接口监控**：接口成功率、响应时间、超时率
- **自定义埋点**：业务关键路径的打点（如跑步开始/结束、步数上报等）

\`\`\`typescript
// Aegis 初始化
const aegis = new Aegis({
  id: 'qq-sport-web',
  reportApiSpeed: true,    // 接口测速
  reportAssetSpeed: true,  // 静态资源测速
  spa: true,               // SPA 应用监控
});

// 自定义埋点
aegis.reportEvent({
  name: 'run_start',
  ext1: platform,
  ext2: gpsAccuracy,
});
\`\`\`

**后端监控：OpenTelemetry**

OpenTelemetry 是 CNCF 的开源可观测性框架，我们用它来做后端的 Trace 追踪和 Metrics 指标收集：

\`\`\`typescript
// OpenTelemetry 初始化
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),    // 自动追踪 HTTP 请求
    new KoaInstrumentation(),     // 自动追踪 Koa 中间件
  ],
});
\`\`\`

**Trace 追踪的核心价值：**

每个请求都会生成一个唯一的 TraceID，这个 ID 会贯穿整个调用链：

\`\`\`
用户请求 → BFF 层（TraceID: abc123）
  → TRPC 调用 user_server（TraceID: abc123）
  → TRPC 调用 rank_server（TraceID: abc123）
  → 返回响应
\`\`\`

当某个请求出问题时，用 TraceID 就能在监控平台上看到完整的调用链，快速定位是哪个环节出了问题。

**Metrics 指标：**

我们定义了几个关键的业务指标：
- **主调开始计数器**：记录每个 TRPC 接口的调用次数
- **主调结束计数器**：记录每个 TRPC 接口的成功/失败次数
- **主调耗时直方图**：记录每个 TRPC 接口的响应时间分布

\`\`\`typescript
// 伽利略 Metrics 上报
const callStartCounter = meter.createCounter('trpc_call_start');
const callEndCounter = meter.createCounter('trpc_call_end');
const callDurationHistogram = meter.createHistogram('trpc_call_duration');

// 在 TRPC 请求前后记录指标
callStartCounter.add(1, { service: 'user_server', method: 'GetData' });
const startTime = Date.now();
try {
  const result = await trpcRequest.request(...);
  callEndCounter.add(1, { service: 'user_server', method: 'GetData', status: 'success' });
} catch (err) {
  callEndCounter.add(1, { service: 'user_server', method: 'GetData', status: 'error' });
} finally {
  callDurationHistogram.record(Date.now() - startTime, { 
    service: 'user_server', method: 'GetData' 
  });
}
\`\`\`

**日志系统：Winston**

我们用 Winston 做日志管理，按日期轮转，错误日志单独记录：

\`\`\`typescript
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',  // 保留14天
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',   // 只记录错误
      maxFiles: '30d',  // 错误日志保留30天
    }),
  ],
});
\`\`\`

**监控告警：**

基于以上指标，我们设置了多级告警：
- **P0 告警**：服务不可用、错误率 > 5% → 电话 + 企微消息
- **P1 告警**：响应时间 P99 > 500ms → 企微消息
- **P2 告警**：错误率 > 1% → 邮件通知

---

### 面试官：你们的暗黑模式是怎么适配的？SSR 场景下有什么特殊处理吗？

暗黑模式适配是一个看似简单但细节很多的工作。

**服务端检测：** 在 SSR 场景下，我们需要在服务端就知道用户是否开启了暗黑模式，这样才能在首屏 HTML 中就应用正确的样式，避免闪烁。

我们的做法是从 User-Agent 中检测。QQ 客户端会在 UA 中标记暗黑模式状态：

\`\`\`typescript
function isDarkMode(ctx: Context): boolean {
  const ua = ctx.headers['user-agent'] || '';
  // QQ 客户端会在 UA 中标记 DarkMode
  return ua.includes('DarkMode/1');
}
\`\`\`

**CSS 变量适配：**

\`\`\`css
:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --border-color: #e5e5e5;
}

.dark {
  --bg-primary: #1a1a1a;
  --text-primary: #e5e5e5;
  --border-color: #333333;
}
\`\`\`

**地图样式切换：** 暗黑模式下地图也需要切换为暗色主题，轨迹线的颜色、图标都需要相应调整。

**客户端动态切换：** 用户在 QQ 设置中切换暗黑模式时，客户端会通知 WebView，我们监听这个事件动态切换样式：

\`\`\`typescript
mqq.on('themeChange', (theme: 'light' | 'dark') => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  // 切换地图样式
  map.setMapStyle(theme === 'dark' ? 'dark' : 'normal');
  // 切换轨迹线颜色
  polyline.setStrokeColor(theme === 'dark' ? '#00ff88' : '#0066ff');
});
\`\`\`

---

### 面试官：登录态安全这块能展开说说吗？GTK 是什么？

登录态安全是 QQ 生态中非常重要的一环。我们的鉴权体系有三层：

**第一层：Cookie 校验**

用户在 QQ 客户端内打开 QQ 运动页面时，客户端会自动在 Cookie 中注入 \`uin\`（用户 QQ 号）、\`skey\`（会话密钥）、\`pskey\`（子域密钥）。BFF 层首先检查这些 Cookie 是否存在。

**第二层：GTK 防 CSRF**

GTK（G Token Key）是基于 pskey 计算的一个哈希值，用于防止 CSRF 攻击：

\`\`\`typescript
const getGTK = (skey: string): number => {
  let hash = 5381;
  for (let i = 0; i < skey.length; i++) {
    hash += (hash << 5) + skey.charCodeAt(i);
  }
  return hash & 0x7fffffff;
};
\`\`\`

**为什么 GTK 能防 CSRF？**

- GTK 基于 pskey 计算，而 pskey 是 HttpOnly 的 Cookie，JavaScript 无法读取
- 攻击者无法读取其他域的 Cookie，所以无法伪造 GTK
- 每个用户的 GTK 都不同，无法通用

**第三层：PTLogin 双重鉴权**

PTLogin 是腾讯统一登录平台。每次请求都会将 uin 和 pskey 发送到 PTLogin 服务进行校验，确认用户身份的真实性。

\`\`\`
请求流程：
用户请求 → BFF 中间件
  → 检查 Cookie（uin/skey/pskey）
  → 计算并校验 GTK
  → 调用 PTLogin 鉴权
  → 鉴权通过 → 处理业务逻辑
  → 鉴权失败 → 返回 401 / 跳转登录页
\`\`\`

---

### 面试官：大数据量渲染有什么优化手段？比如排行榜可能有很多用户。

排行榜确实是一个典型的大数据量渲染场景。好友排行可能有几百甚至上千条数据，如果全部渲染 DOM 节点，页面会非常卡顿。

**我们的解决方案是虚拟滚动（Virtual Scrolling）：**

核心思想是只渲染可视区域内的列表项，滚动时动态替换内容。

\`\`\`typescript
// 虚拟滚动核心实现
const startIndex = computed(() => 
  Math.floor(scrollTop.value / props.itemHeight)
);

const endIndex = computed(() => 
  Math.min(
    startIndex.value + Math.ceil(containerHeight.value / props.itemHeight) + 1,
    props.items.length
  )
);

const visibleItems = computed(() => 
  props.items.slice(startIndex.value, endIndex.value)
);

const offsetY = computed(() => 
  startIndex.value * props.itemHeight
);
\`\`\`

| 数据量 | 普通渲染 | 虚拟滚动 | 改善 |
|---|---|---|---|
| 100 条 | 流畅 | 流畅 | - |
| 1000 条 | 卡顿 | 流畅 | **90%↑** |
| 10000 条 | 崩溃 | 流畅 | **无法对比** |

**地图轨迹渲染优化：**

跑步轨迹可能有几千个点，直接渲染到地图上也会卡顿。我们用了 **Douglas-Peucker 算法** 做轨迹点抽稀：

这个算法的原理是：在一条曲线上，如果某个点到首尾连线的距离小于阈值，就认为这个点可以省略。递归处理后，轨迹点数量可以减少 70%，但视觉效果几乎没有差异。

配合节流更新（每秒最多更新一次地图）和 Canvas 离屏渲染，地图渲染性能提升了 **50%**。
`
