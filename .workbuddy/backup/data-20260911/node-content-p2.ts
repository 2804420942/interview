// QQ运动Node项目解析 - 内容第2部分（SSR渲染流程 + TRPC服务转发）
export default `
## 四、核心技术实现

### 4.1 SSR 渲染流程

#### 完整流程图

\\\`\\\`\\\`mermaid
sequenceDiagram
    participant U as 用户浏览器
    participant N as Nginx
    participant K as Koa Server
    participant S as syncFunc
    participant R as Vue Renderer
    participant T as TRPC Service
    U->>N: GET /v3/page/run
    N->>K: 转发请求
    K->>K: 1. 路由匹配
    K->>K: 2. 登录态校验
    K->>K: 3. 加载页面配置
    K->>S: 4. 执行数据预取
    S->>T: 并发请求多个接口
    T-->>S: 返回数据
    S-->>K: 返回pageData
    K->>R: 5. Vue SSR渲染
    R-->>K: 返回HTML + Pinia State
    K->>K: 6. 注入模板
    K->>K: 7. 注入Pinia状态
    K->>K: 8. 注入监控脚本
    K-->>N: 返回完整HTML
    N-->>U: 返回页面
    U->>U: 9. 客户端Hydration
    U->>U: 10. 恢复Pinia状态
    U->>U: 11. 绑定事件监听
\\\`\\\`\\\`

#### 核心代码实现

**步骤 1：路由匹配**

\\\`\\\`\\\`typescript
router.all('/v3/page/:action/(.*)?',
  htmlMetricReportMiddleware,
  getPageName,
  checkBrowser,
  checkPageNeedLogin,
  async (ctx) => { await pageRequest(ctx); }
);
\\\`\\\`\\\`

**步骤 2：登录态校验**

\\\`\\\`\\\`typescript
export const checkPageNeedLogin = async (ctx: Context, next: Next) => {
  const { pageName } = ctx;
  const pageConfig = SSR_PAGES?.[pageName];
  if (!pageConfig.ignorePtlogin) {
    const uin = user.getUin();
    const pskey = getPskey(ctx);
    if (!pskey) {
      ctx.redirect('https://ui.ptlogin2.qq.com/cgi-bin/login?...');
      return;
    }
    const { result } = await verifyUinAndPSkey(String(uin), pskey, DOMAIN_ID);
    if (result !== 1) return;
  }
  await next();
};
\\\`\\\`\\\`

**步骤 3：加载页面配置**

\\\`\\\`\\\`typescript
export const getPageConfig = <T>(configPath: string, routerUrl: string) => {
  if (!IS_LOCAL) {
    let pageConfig = PageCache[configPath];
    if (!pageConfig) {
      pageConfig = {
        template: fs.readFileSync('website/dist/client/pages/' + configPath + '/index.html'),
        render: require('website/dist/server/' + configPath + '.js').render,
        syncFunc: require('dist/pages/sync/' + configPath + '.js').default,
      };
      PageCache[configPath] = pageConfig;
    }
    return Promise.resolve(pageConfig);
  }
  return getDevPageConfig(configPath, routerUrl);
};
\\\`\\\`\\\`

**步骤 4：数据预取（syncFunc）**

\\\`\\\`\\\`typescript
export default async (ctx: Context): Promise<IRenderRunPageData> => {
  const uin = user.getUin();
  const [entryPageDataRes, isBlockRes] = await Promise.allSettled([
    publicTrpcRequest.request('user_server', 'GetEntryPageData', { uin }, { ctx }),
    publicTrpcRequest.request('user_server', 'IsBlock', { uin }, { ctx }),
  ]);
  const entryPageData = entryPageDataRes.status === 'fulfilled' ? entryPageDataRes.value : {};
  const isBlock = isBlockRes.status === 'fulfilled' ? isBlockRes.value.isBlock : false;
  return { entryPageData, isBlock, uin, currentDate: dayjs().format('YYYY-MM-DD') };
};
\\\`\\\`\\\`

**步骤 5：Vue SSR 渲染**

\\\`\\\`\\\`typescript
import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import { useMainStore } from './store';

export async function render(routerUrl: string, pageData: IRenderRunPageData) {
  const { app, pinia } = createApp();
  const store = useMainStore(pinia);
  store.remoteDataHandler(pageData);
  const ctx: Record<string, unknown> = {};
  const html = await renderToString(app, ctx);
  const state = JSON.stringify(pinia.state.value);
  return [html, ctx.modules, state];
}
\\\`\\\`\\\`

**步骤 6-8：HTML 模板注入**

\\\`\\\`\\\`typescript
export const pageRequest = async (ctx: Context) => {
  const { template, syncFunc, render } = await getPageConfig(configPath, routerUrl);
  const pageData = await syncFunc(ctx);
  const [appHtml, ctxModules, piniaState] = await render(routerUrl, pageData);
  const manifest = await getPageManifest();
  const preloadLinks = renderPreloadLinks(ctxModules, manifest);
  const aegisV2Template = await loadHTML(EHTMLType.aegisV2);
  const remTemplate = await loadHTML(EHTMLType.rem);
  const mqqTemplate = await loadHTML(EHTMLType.mqq);
  const html = template
    .replace('<!--pinia-state-->', '<script>window.__INITIAL_STATE__ = ' + piniaState + ';</script>')
    .replace('<!--preload-links-->', aegisV2Template + preloadLinks)
    .replace('<!--ssr-outlet-->', appHtml)
    .replace('<!--body-start-->', remTemplate)
    .replace('<!--body-end-->', mqqTemplate);
  ctx.body = html;
  ctx.type = 'html';
};
\\\`\\\`\\\`

**步骤 9-11：客户端 Hydration**

\\\`\\\`\\\`typescript
import { createApp } from './main';
const { app, pinia } = createApp();
if (window.__INITIAL_STATE__) {
  pinia.state.value = window.__INITIAL_STATE__;
}
app.mount('#app', true);
\\\`\\\`\\\`

#### SSR 性能优化

**1. 页面配置缓存** - 生产环境缓存页面配置，避免重复加载

**2. 并发数据预取** - 使用 Promise.allSettled 并发请求，单个失败不影响整体

**3. 资源预加载** - 根据 SSR Manifest 生成 preload 链接

**4. 状态注水（Hydration）** - 服务端序列化 Pinia 状态注入 HTML，客户端直接恢复

---

### 4.2 TRPC 服务转发

#### TRPC 架构图

\\\`\\\`\\\`mermaid
graph LR
    A[前端Vue] -->|POST /v3/trpc/user_server/GetUserInfo| B[Koa Router]
    B --> C[TrpcController]
    C --> D[TrpcProxy]
    D --> E[TrpcRequest]
    E -->|1. 校验GTK| E
    E -->|2. 校验PTLogin| E
    E -->|3. 注入请求头| E
    E -->|4. TRPC调用| F[后端微服务]
    F -->|返回数据| E
    E --> D
    D --> C
    C --> B
    B -->|JSON响应| A
\\\`\\\`\\\`

#### 核心代码实现

\\\`\\\`\\\`typescript
// 路由注册
router.all('/(v2|v3)/trpc/:action/:cmd', cgiMetricReportMiddleware, async (ctx) => {
  const { action, cmd } = ctx.params;
  const requestData = { ...ctx.query, ...ctx.request.body };
  try {
    const response = await publicTrpcRequest.request(action, cmd, requestData, { ctx });
    ctx.status = 200;
    ctx.body = response;
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'error';
  }
});

// TRPC Controller
export const publicTrpcRequest = new TrpcController({
  user_server: userServerConfig,
  rank_server: rankServerConfig,
  score_server: scoreServerConfig,
  orbit_server: orbitServerConfig,
  share_server: shareServerConfig,
});
\\\`\\\`\\\`

#### 请求头注入

\\\`\\\`\\\`typescript
export const commonBeforeHandler = async (requestInstance, invokeOptions) => {
  const ctx = requestInstance.requestOptions?.ctx;
  const uin = user.getUin();
  const pskey = ctx.cookies.get('p_skey');
  const requestParams = {
    ...requestInstance.requestData,
    uin, uid: String(uin),
    skey: ctx.cookies.get('skey'), pskey,
    platformid: PLATFORM_ID_MAP[browser.getPlatform()],
    qqversion: browser.getVersion().toString(),
    appid: 1600000889, daid: 539, domain: 'yundong.qq.com',
  };
  const requestHeader = {
    uid: String(uin), type: '27', sig: pskey,
    domain_id: '539',
    platform: browser.getPlatform() === 'iOS' ? '110' : '109',
    qq_version: browser.getVersion().toString(),
    client_ip: transIPv6ToIPv4(ctx.ip) || ctx.ip,
  };
  return { data: requestParams, options: { ...invokeOptions, context: requestHeader } };
};
\\\`\\\`\\\`
`
