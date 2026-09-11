// QQ运动Node项目解析 - 内容第3部分（核心业务流程）
export default `
# QQ 运动 Node 服务项目深度剖析（第 2 部分）

> 接第 1 部分

---

## 五、核心业务流程深度剖析

### 5.1 跑步功能完整流程

#### 业务流程图

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant P as 跑步页面
    participant T as TraceManager
    participant M as MQQ SDK
    participant G as GPS硬件
    participant S as 后端服务
    U->>P: 1. 进入跑步页面
    P->>T: 2. trace.init()
    T->>M: 3. PathTraceInit
    M->>G: 4. 请求GPS权限
    G-->>M: 5. 返回初始位置
    M-->>T: 6. 返回初始化结果
    T-->>P: 7. 渲染地图
    U->>P: 8. 点击开始跑步
    P->>T: 9. trace.start()
    T->>M: 10. PathTraceStart
    M->>G: 11. 开始GPS追踪
    loop 每秒推送
        G->>M: 12. GPS数据
        M->>T: 13. PathTraceSend事件
        T->>T: 14. 计算距离/配速
        T-->>P: 15. 更新UI
        P->>P: 16. 绘制轨迹
    end
    U->>P: 17. 点击结束跑步
    P->>T: 18. trace.end()
    T->>M: 19. PathTraceEnd
    M-->>T: 20. 返回完整轨迹
    T->>S: 21. 上传运动数据
    S-->>T: 22. 返回结果
    T-->>P: 23. 跳转结束页
\`\`\`

#### 关键技术点

**1. iOS 与 Android 差异处理**
- iOS 需要先调用 PathTraceInit，Android 直接调用 PathTraceStart
- iOS 主动获取定位，Android 通过事件推送

**2. GPS 信号强度判断**
\`\`\`typescript
class GPSManager {
  setGPSAccuracy(gpsAccuracy?: number) {
    this.gpsAccuracy = gpsAccuracy || 80;
    if (this.gpsAccuracy < 20) this.gpsStatus = EGPSStatus.powerful;
    else if (this.gpsAccuracy < 50) this.gpsStatus = EGPSStatus.normal;
    else if (this.gpsAccuracy < 100) this.gpsStatus = EGPSStatus.weak;
    else this.gpsStatus = EGPSStatus.none;
  }
}
\`\`\`

**3. 防作弊算法**
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
// 当累计异常距离超过500m时，弹出提示
\`\`\`

**4. 页面隐藏时的处理** - 页面隐藏时停止计时器，显示时补偿隐藏期间的时间

---

### 5.2 登录态校验流程

\`\`\`mermaid
graph TB
    A[用户] --> B{是否在手Q内}
    B -->|是| C[Cookie中有uin/skey/pskey]
    B -->|否| D[跳转引导页]
    C --> E{pskey是否存在}
    E -->|否| F[跳转PTLogin刷新]
    E -->|是| G{GTK是否正确}
    G -->|否| H[返回GTK校验失败]
    G -->|是| I{PTLogin鉴权}
    I -->|失败| J[返回鉴权失败]
    I -->|成功| K[允许访问]
\`\`\`

**GTK 校验原理：**
\`\`\`typescript
const getGTK = (skey: string): number => {
  let hash = 5381;
  for (let i = 0; i < skey.length; i++) {
    hash += (hash << 5) + skey.charCodeAt(i);
  }
  return hash & 0x7fffffff;
};
\`\`\`

- GTK 基于 pskey 计算，攻击者无法读取其他域的 Cookie
- 每个用户的 GTK 都不同
- PTLogin 是腾讯统一登录平台，每次请求都校验 uin 和 pskey 是否匹配

---

### 5.3 监控上报体系

\`\`\`mermaid
graph TB
    subgraph 前端监控
        A1[Aegis SDK]
        A2[性能指标]
        A3[错误监控]
        A4[自定义埋点]
    end
    subgraph 后端监控
        B1[OpenTelemetry]
        B2[Trace追踪]
        B3[Metrics指标]
        B4[Logs日志]
    end
    subgraph 监控平台
        C1[Aegis平台]
        C2[伽利略平台]
        C3[日志中心]
    end
    A1 --> A2
    A1 --> A3
    A1 --> A4
    B1 --> B2
    B1 --> B3
    B1 --> B4
    A2 --> C1
    A3 --> C1
    A4 --> C1
    B2 --> C2
    B3 --> C2
    B4 --> C3
\`\`\`

**伽利略 Trace 追踪** - 注册 TracerProvider，自动插桩 TRPC 调用和 HTTP 请求

**伽利略 Metrics 指标** - 主调开始计数器、主调结束计数器、主调耗时直方图

**Aegis 前端监控** - 接口测速、静态资源测速、SPA 应用监控

**Winston 日志** - 按日期轮转，错误日志单独记录，保留7-14天
`
