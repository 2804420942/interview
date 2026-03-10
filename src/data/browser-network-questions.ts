import type { Question } from './types'

export const browserNetworkQuestions: Question[] = [
  // ========== 网络协议 ==========
  {
    id: 401,
    title: '从输入 URL 到页面显示，发生了什么？',
    category: '网络协议',
    difficulty: 'hard',
    content: '## 从输入 URL 到页面显示，发生了什么？\n\n**答案：**\n\n1. **DNS 解析**：域名 → IP 地址（浏览器缓存 → 系统缓存 → 路由器缓存 → DNS 服务器）\n2. **TCP 连接**：三次握手建立连接\n3. **发送 HTTP 请求**：请求行 + 请求头 + 请求体\n4. **服务器处理并响应**：返回 HTML\n5. **浏览器解析 HTML**：构建 DOM 树\n6. **加载 CSS**：构建 CSSOM 树\n7. **合并 DOM + CSSOM**：生成渲染树（Render Tree）\n8. **布局（Layout/Reflow）**：计算元素位置和尺寸\n9. **绘制（Paint）**：将元素绘制到图层\n10. **合成（Composite）**：将图层合并显示\n\n### 追问：HTTPS 和 HTTP 的区别？\n\nHTTPS = HTTP + TLS/SSL 加密。区别：\n\n1. 安全性：HTTPS 加密传输，防止中间人攻击和数据窃取\n2. 端口：HTTP 默认 80，HTTPS 默认 443\n3. 证书：HTTPS 需要 CA 证书\n4. 性能：HTTPS 有 TLS 握手开销，但 HTTP/2 只支持 HTTPS，综合性能更好',
    tags: ['网络协议', 'DNS', 'HTTP', '浏览器渲染']
  },
  {
    id: 402,
    title: 'HTTP/1.1、HTTP/2、HTTP/3 的区别？',
    category: '网络协议',
    difficulty: 'hard',
    content: '## HTTP/1.1、HTTP/2、HTTP/3 的区别？\n\n**HTTP/1.1：**\n\n- 持久连接（keep-alive）\n- 管道化（pipelining，但有队头阻塞问题）\n- 文本协议\n\n**HTTP/2：**\n\n- **多路复用**：一个 TCP 连接上并行多个请求，解决队头阻塞\n- **头部压缩（HPACK）**：减少重复头部传输\n- **服务器推送**：服务器主动推送资源\n- **二进制协议**：更高效\n- 仍有 TCP 层的队头阻塞\n\n**HTTP/3：**\n\n- 基于 **QUIC 协议**（UDP），彻底解决队头阻塞\n- 更快的连接建立（0-RTT）\n- 连接迁移（网络切换不断连）\n\n### 追问：HTTP/2 的多路复用和 HTTP/1.1 的 keep-alive 有什么区别？\n\n- `keep-alive`：复用 TCP 连接，但请求仍然是串行的（一个请求完成才能发下一个）\n- 多路复用：在同一 TCP 连接上，多个请求/响应可以**并行**交错传输，互不阻塞',
    tags: ['网络协议', 'HTTP/2', 'HTTP/3', 'QUIC']
  },
  {
    id: 403,
    title: '什么是 TCP 三次握手和四次挥手？',
    category: '网络协议',
    difficulty: 'medium',
    content: '## 什么是 TCP 三次握手和四次挥手？\n\n**三次握手（建立连接）：**\n\n1. 客户端 → 服务器：SYN（我要连接）\n2. 服务器 → 客户端：SYN + ACK（好的，我也要连接）\n3. 客户端 → 服务器：ACK（收到）\n\n**四次挥手（断开连接）：**\n\n1. 客户端 → 服务器：FIN（我要断开）\n2. 服务器 → 客户端：ACK（收到，但我还有数据要发）\n3. 服务器 → 客户端：FIN（我也发完了，要断开）\n4. 客户端 → 服务器：ACK（收到）→ 等待 2MSL 后关闭\n\n### 追问：为什么是三次握手而不是两次？\n\n两次握手无法确认客户端的接收能力。三次握手确保双方都能发送和接收：\n\n- 第一次：服务器知道客户端能发送\n- 第二次：客户端知道服务器能发送和接收\n- 第三次：服务器知道客户端能接收',
    tags: ['网络协议', 'TCP', '握手', '挥手']
  },
  {
    id: 404,
    title: '什么是 HTTP 状态码？常见状态码有哪些？',
    category: '网络协议',
    difficulty: 'easy',
    content: '## 什么是 HTTP 状态码？常见状态码有哪些？\n\n**答案：**\n\n- **1xx**：信息性，如 101 Switching Protocols（WebSocket 升级）\n- **2xx**：成功，200 OK、201 Created、204 No Content\n- **3xx**：重定向，301 永久重定向、302 临时重定向、304 Not Modified（协商缓存命中）\n- **4xx**：客户端错误，400 Bad Request、401 Unauthorized（未认证）、403 Forbidden（无权限）、404 Not Found、429 Too Many Requests\n- **5xx**：服务器错误，500 Internal Server Error、502 Bad Gateway、503 Service Unavailable\n\n### 追问：301 和 302 的区别？\n\n- 301 永久重定向：浏览器会缓存重定向，下次直接访问新地址，搜索引擎会更新索引\n- 302 临时重定向：每次都会请求原地址，不缓存，搜索引擎保留原地址',
    tags: ['网络协议', 'HTTP', '状态码']
  },
  {
    id: 405,
    title: '什么是 HTTP 请求方法？GET 和 POST 的区别？',
    category: '网络协议',
    difficulty: 'easy',
    content: '## 什么是 HTTP 请求方法？GET 和 POST 的区别？\n\n**HTTP 方法：** GET、POST、PUT、PATCH、DELETE、HEAD、OPTIONS、CONNECT、TRACE\n\n**GET vs POST：**\n\n| | GET | POST |\n|--|-----|------|\n| 数据位置 | URL 查询参数 | 请求体 |\n| 数据大小 | URL 长度限制（~2KB） | 无限制 |\n| 安全性 | 参数暴露在 URL | 相对安全 |\n| 缓存 | 可以缓存 | 默认不缓存 |\n| 幂等性 | ✅ 幂等 | ❌ 非幂等 |\n| 语义 | 获取资源 | 提交数据 |\n\n### 追问：PUT 和 PATCH 的区别？\n\n- `PUT`：全量更新，替换整个资源（需要传完整数据）\n- `PATCH`：部分更新，只修改指定字段（只传需要修改的字段）',
    tags: ['网络协议', 'HTTP', 'GET', 'POST']
  },
  {
    id: 406,
    title: '什么是 RESTful API？',
    category: '网络协议',
    difficulty: 'easy',
    content: '## 什么是 RESTful API？\n\nREST（Representational State Transfer）是一种 API 设计风格：\n\n1. **资源**：URL 表示资源，名词复数，如 `/users`、`/users/1`\n2. **HTTP 方法**：GET（查）、POST（增）、PUT/PATCH（改）、DELETE（删）\n3. **无状态**：每个请求包含所有必要信息，服务器不保存会话状态\n4. **统一接口**：标准的请求/响应格式\n\n```\nGET    /users        # 获取用户列表\nPOST   /users        # 创建用户\nGET    /users/1      # 获取用户1\nPUT    /users/1      # 更新用户1（全量）\nDELETE /users/1      # 删除用户1\n```\n\n### 追问：GraphQL 和 RESTful 的区别？\n\n- REST：多个端点，每个端点返回固定数据结构，可能过度获取或获取不足\n- GraphQL：单一端点，客户端精确指定需要的字段，避免过度获取，适合复杂数据关系',
    tags: ['网络协议', 'REST', 'API', 'GraphQL']
  },
  {
    id: 407,
    title: '什么是 Content-Type？常见类型有哪些？',
    category: '网络协议',
    difficulty: 'easy',
    content: '## 什么是 Content-Type？常见类型有哪些？\n\n`Content-Type` 指定请求/响应体的媒体类型：\n\n- `application/json`：JSON 数据（最常用的 API 格式）\n- `application/x-www-form-urlencoded`：表单数据（`key=value&key2=value2`）\n- `multipart/form-data`：文件上传（包含二进制数据）\n- `text/html`：HTML 文档\n- `text/plain`：纯文本\n- `application/octet-stream`：二进制流（文件下载）\n- `image/jpeg`、`image/png`、`image/webp`：图片\n\n### 追问：上传文件时为什么要用 `multipart/form-data`？\n\n`multipart/form-data` 将表单数据分割为多个部分（part），每个部分有自己的 Content-Type，可以混合文本和二进制数据。文件是二进制数据，`application/json` 无法直接传输二进制，而 `multipart/form-data` 可以。',
    tags: ['网络协议', 'Content-Type', '文件上传']
  },
  {
    id: 408,
    title: '什么是 Keep-Alive 连接？',
    category: '网络协议',
    difficulty: 'easy',
    content: '## 什么是 Keep-Alive 连接？\n\nHTTP/1.1 默认开启持久连接（`Connection: keep-alive`），允许在同一 TCP 连接上发送多个 HTTP 请求，避免每次请求都重新建立 TCP 连接（三次握手开销）。\n\n**相关参数：**\n\n- `Keep-Alive: timeout=5, max=100`：连接保持 5 秒，最多 100 个请求\n\n### 追问：HTTP/2 还需要 Keep-Alive 吗？\n\nHTTP/2 的多路复用已经在单个 TCP 连接上处理所有请求，Keep-Alive 的概念在 HTTP/2 中不再重要。HTTP/2 连接默认是持久的，通过 PING 帧保持连接活跃。',
    tags: ['网络协议', 'Keep-Alive', 'TCP']
  },

  // ========== HTTP 缓存 ==========
  {
    id: 409,
    title: 'HTTP 缓存机制是什么？强缓存和协商缓存的区别？',
    category: 'HTTP 缓存',
    difficulty: 'hard',
    content: '## HTTP 缓存机制是什么？强缓存和协商缓存的区别？\n\n**强缓存（不发请求）：**\n\n- `Cache-Control: max-age=3600`：缓存 3600 秒（优先级高）\n- `Expires: Wed, 21 Oct 2025 07:28:00 GMT`：绝对过期时间（HTTP/1.0，受客户端时间影响）\n- 命中时返回 200（from cache）\n\n**协商缓存（发请求验证）：**\n\n- `Last-Modified` / `If-Modified-Since`：基于文件修改时间\n- `ETag` / `If-None-Match`：基于文件内容哈希（更精确，优先级高）\n- 命中时返回 304 Not Modified，不返回响应体\n\n**缓存策略：**\n\n- HTML：`no-cache`（每次验证）\n- JS/CSS：`max-age=31536000`（长期缓存，文件名带 hash）\n- 图片：`max-age=86400`\n\n### 追问：`Cache-Control: no-cache` 和 `no-store` 的区别？\n\n- `no-cache`：不使用强缓存，每次都发请求验证（协商缓存），如果内容未变则返回 304\n- `no-store`：完全不缓存，每次都重新下载完整响应',
    tags: ['HTTP 缓存', '强缓存', '协商缓存', 'ETag']
  },
  {
    id: 410,
    title: '什么是 ETag？如何生成？',
    category: 'HTTP 缓存',
    difficulty: 'medium',
    content: '## 什么是 ETag？如何生成？\n\n`ETag` 是资源的唯一标识符（通常是内容的哈希值），用于协商缓存：\n\n1. 服务器响应：`ETag: "abc123"`\n2. 客户端再次请求：`If-None-Match: "abc123"`\n3. 服务器比较 ETag，未变化返回 304，变化返回 200 + 新内容\n\n**生成方式：**\n\n- 文件内容的 MD5/SHA 哈希\n- 文件大小 + 修改时间的组合\n- 版本号\n\n### 追问：`ETag` 和 `Last-Modified` 哪个更准确？\n\n`ETag` 更准确：\n\n1. `Last-Modified` 精度只到秒，1 秒内多次修改无法区分\n2. 文件修改时间变了但内容没变（如 touch 命令），`Last-Modified` 会误判为变化\n3. 分布式服务器上同一文件的修改时间可能不一致',
    tags: ['HTTP 缓存', 'ETag', 'Last-Modified']
  },
  {
    id: 411,
    title: '什么是 gzip 压缩？如何在前端项目中使用？',
    category: 'HTTP 缓存',
    difficulty: 'medium',
    content: '## 什么是 gzip 压缩？如何在前端项目中使用？\n\ngzip 是服务器对响应内容进行压缩的技术，可以减少传输体积 60-80%。\n\n**工作流程：**\n\n1. 客户端请求头：`Accept-Encoding: gzip, deflate, br`\n2. 服务器压缩响应并设置：`Content-Encoding: gzip`\n3. 客户端自动解压\n\n**前端项目配置：**\n\n1. Nginx 开启 gzip：`gzip on; gzip_types text/javascript application/json;`\n2. Vite/Webpack 预压缩：`vite-plugin-compression` 生成 `.gz` 文件，Nginx 直接返回预压缩文件（更快）\n\n### 追问：Brotli（br）和 gzip 的区别？\n\nBrotli 是 Google 开发的压缩算法，压缩率比 gzip 高 15-25%，但压缩速度较慢（适合预压缩静态资源）。现代浏览器都支持 Brotli，HTTPS 下推荐使用。',
    tags: ['HTTP 缓存', 'gzip', 'Brotli', '压缩']
  },

  // ========== 跨域与安全 ==========
  {
    id: 412,
    title: '什么是 CORS？如何解决跨域问题？',
    category: '跨域与安全',
    difficulty: 'hard',
    content: '## 什么是 CORS？如何解决跨域问题？\n\nCORS（跨源资源共享）是浏览器的安全机制，限制不同源（协议+域名+端口）之间的请求。\n\n**解决方案：**\n\n1. **服务器设置响应头**（最常用）：\n```\nAccess-Control-Allow-Origin: https://example.com\nAccess-Control-Allow-Methods: GET, POST, PUT\nAccess-Control-Allow-Headers: Content-Type, Authorization\n```\n2. **开发环境代理**：Vite/Webpack devServer proxy，将请求转发到目标服务器\n3. **JSONP**：只支持 GET，利用 `<script>` 标签不受同源限制（已过时）\n4. **Nginx 反向代理**：生产环境将前后端部署在同一域名下\n\n### 追问：简单请求和预检请求（preflight）的区别？\n\n- **简单请求**：GET/POST/HEAD，Content-Type 为 text/plain、multipart/form-data、application/x-www-form-urlencoded，直接发送\n- **预检请求**：其他情况（如 PUT/DELETE、自定义头、application/json），先发 OPTIONS 请求询问服务器是否允许，服务器确认后再发实际请求',
    tags: ['跨域与安全', 'CORS', '跨域', '同源策略']
  },
  {
    id: 413,
    title: '什么是浏览器的同源策略？',
    category: '跨域与安全',
    difficulty: 'medium',
    content: '## 什么是浏览器的同源策略？\n\n同源策略（Same-Origin Policy）是浏览器的安全机制，限制不同源的文档或脚本之间的交互。\n\n**同源定义：** 协议 + 域名 + 端口 完全相同\n\n**限制内容：**\n\n- AJAX 请求（XMLHttpRequest/fetch）\n- Cookie、LocalStorage、IndexedDB 访问\n- DOM 访问（iframe 跨域）\n\n**不受限制：**\n\n- `<script src>`、`<img src>`、`<link href>`、`<iframe src>` 加载资源\n- 表单提交\n\n### 追问：`document.domain` 有什么用？\n\n两个子域名页面（如 `a.example.com` 和 `b.example.com`）可以通过设置 `document.domain = \'example.com\'` 实现跨子域通信（访问对方的 DOM）。但这个方法已被废弃，现代浏览器推荐使用 `postMessage`。',
    tags: ['跨域与安全', '同源策略', 'document.domain']
  },
  {
    id: 414,
    title: '什么是 preflight 预检请求？',
    category: '跨域与安全',
    difficulty: 'medium',
    content: '## 什么是 preflight 预检请求？\n\n当跨域请求满足以下条件之一时，浏览器会先发送 OPTIONS 预检请求：\n\n1. 请求方法不是 GET/POST/HEAD\n2. Content-Type 不是简单类型\n3. 包含自定义请求头\n\n预检请求询问服务器是否允许该跨域请求，服务器通过 `Access-Control-Allow-*` 响应头回答。\n\n### 追问：如何减少预检请求的频率？\n\n服务器设置 `Access-Control-Max-Age` 响应头，指定预检结果的缓存时间（秒），在此期间相同的跨域请求不再发预检：\n\n```\nAccess-Control-Max-Age: 86400\n```',
    tags: ['跨域与安全', 'preflight', 'OPTIONS', '跨域']
  },
  {
    id: 415,
    title: '什么是 XSS 和 CSRF？（浏览器安全角度）',
    category: '跨域与安全',
    difficulty: 'hard',
    content: '## 什么是 XSS 和 CSRF？（浏览器安全角度）\n\n**XSS（跨站脚本）：**\n攻击者注入恶意脚本，在用户浏览器中执行，可以窃取 Cookie、伪造操作。\n防御：输入转义、CSP、HttpOnly Cookie\n\n**CSRF（跨站请求伪造）：**\n攻击者诱导用户访问恶意页面，利用用户的登录状态发起伪造请求。\n防御：CSRF Token、SameSite Cookie、验证 Referer/Origin\n\n### 追问：CSP（内容安全策略）如何配置？\n\n通过 HTTP 响应头或 `<meta>` 标签配置：\n\n```\nContent-Security-Policy: default-src \'self\'; script-src \'self\' \'nonce-xxx\'; img-src *\n```\n\n- `default-src \'self\'`：默认只允许同源资源\n- `script-src \'nonce-xxx\'`：只允许带特定 nonce 的内联脚本\n- 可以有效防止 XSS 注入的脚本执行',
    tags: ['跨域与安全', 'XSS', 'CSRF', 'CSP']
  },
  {
    id: 416,
    title: '什么是 Content Security Policy（CSP）？',
    category: '跨域与安全',
    difficulty: 'medium',
    content: '## 什么是 Content Security Policy（CSP）？\n\nCSP 通过 HTTP 响应头限制页面可以加载的资源来源，防止 XSS 攻击：\n\n```\nContent-Security-Policy:\n  default-src \'self\';\n  script-src \'self\' https://cdn.example.com \'nonce-abc123\';\n  style-src \'self\' \'unsafe-inline\';\n  img-src * data:;\n  connect-src \'self\' https://api.example.com;\n```\n\n**指令：**\n\n- `default-src`：默认策略\n- `script-src`：JS 来源\n- `\'self\'`：同源\n- `\'nonce-xxx\'`：带特定 nonce 的内联脚本\n- `\'unsafe-inline\'`：允许内联（不推荐）\n\n### 追问：如何在 Vue 项目中配置 CSP？\n\n1. Nginx 配置响应头\n2. 使用 nonce：服务端生成随机 nonce，注入到 HTML 的 `<script nonce="xxx">` 中，CSP 中配置 `\'nonce-xxx\'`\n3. Vite 插件：`vite-plugin-csp` 自动处理 nonce',
    tags: ['跨域与安全', 'CSP', '安全策略']
  },
  {
    id: 417,
    title: '什么是 HSTS？',
    category: '跨域与安全',
    difficulty: 'medium',
    content: '## 什么是 HSTS？\n\nHSTS（HTTP Strict Transport Security）强制浏览器只通过 HTTPS 访问网站：\n\n```\nStrict-Transport-Security: max-age=31536000; includeSubDomains; preload\n```\n\n- `max-age`：HSTS 策略有效期（秒）\n- `includeSubDomains`：包含所有子域名\n- `preload`：加入浏览器预加载列表，即使第一次访问也强制 HTTPS\n\n**作用：** 防止 SSL 剥离攻击（攻击者将 HTTPS 降级为 HTTP）\n\n### 追问：HSTS 和 301 重定向的区别？\n\n- 301 重定向：每次 HTTP 请求都需要先到服务器，再重定向到 HTTPS，第一次请求不安全\n- HSTS：浏览器记住策略后，直接发 HTTPS 请求，不经过 HTTP，更安全更快',
    tags: ['跨域与安全', 'HSTS', 'HTTPS']
  },
  {
    id: 418,
    title: '什么是 Subresource Integrity（SRI）？',
    category: '跨域与安全',
    difficulty: 'medium',
    content: '## 什么是 Subresource Integrity（SRI）？\n\nSRI 通过哈希值验证外部资源的完整性，防止 CDN 被篡改：\n\n```html\n<script\n  src="https://cdn.example.com/jquery.min.js"\n  integrity="sha384-abc123..."\n  crossorigin="anonymous"\n></script>\n```\n\n浏览器下载资源后，计算哈希值与 `integrity` 属性比较，不匹配则拒绝执行。\n\n### 追问：什么情况下需要使用 SRI？\n\n使用第三方 CDN 加载资源时，如果 CDN 被攻击或资源被篡改，SRI 可以防止恶意代码执行。对于自己控制的 CDN，SRI 的必要性较低，但仍然是最佳实践。',
    tags: ['跨域与安全', 'SRI', 'CDN', '完整性']
  },
  {
    id: 419,
    title: '什么是 HTTPS 的 TLS 握手过程？',
    category: '跨域与安全',
    difficulty: 'hard',
    content: '## 什么是 HTTPS 的 TLS 握手过程？\n\n**TLS 1.3 握手（简化）：**\n\n1. 客户端发送：支持的加密套件、随机数、密钥共享参数\n2. 服务器发送：选定的加密套件、证书、随机数、密钥共享参数\n3. 客户端验证证书，双方用密钥共享参数（ECDHE）计算出相同的会话密钥\n4. 后续通信用会话密钥对称加密\n\n**TLS 1.3 相比 1.2 的改进：**\n\n- 握手从 2-RTT 减少到 1-RTT\n- 支持 0-RTT（会话恢复，有重放攻击风险）\n- 移除了不安全的加密算法\n\n### 追问：什么是证书链？如何验证证书？\n\n证书链：网站证书 → 中间 CA 证书 → 根 CA 证书。浏览器内置了受信任的根 CA 列表，通过验证证书链上每个证书的签名，确认网站证书的合法性。同时验证证书的域名、有效期、是否被吊销（OCSP）。',
    tags: ['跨域与安全', 'TLS', 'HTTPS', '证书']
  },
  {
    id: 420,
    title: '什么是 Cookie 的 SameSite 属性？',
    category: '跨域与安全',
    difficulty: 'medium',
    content: '## 什么是 Cookie 的 SameSite 属性？\n\n`SameSite` 控制 Cookie 在跨站请求中的发送行为：\n\n- `Strict`：完全禁止跨站发送 Cookie（包括从其他网站的链接跳转）\n- `Lax`（Chrome 80+ 默认）：允许顶级导航（链接跳转）携带，禁止跨站 AJAX/iframe 携带\n- `None`：允许跨站携带，但必须同时设置 `Secure`（HTTPS）\n\n### 追问：为什么 Chrome 80 将 SameSite 默认值改为 Lax？\n\n为了防止 CSRF 攻击。之前默认值相当于 `None`，跨站请求会自动携带 Cookie，容易被 CSRF 利用。改为 `Lax` 后，大多数跨站请求不再携带 Cookie，提高了安全性，同时对正常的页面跳转影响较小。',
    tags: ['跨域与安全', 'Cookie', 'SameSite', 'CSRF']
  },

  // ========== 认证授权 ==========
  {
    id: 421,
    title: '什么是 JWT？如何实现无状态认证？',
    category: '认证授权',
    difficulty: 'medium',
    content: '## 什么是 JWT？如何实现无状态认证？\n\nJWT（JSON Web Token）由三部分组成：Header.Payload.Signature\n\n- **Header**：算法类型（如 HS256）\n- **Payload**：用户信息（userId、roles、过期时间）\n- **Signature**：用密钥对 Header+Payload 签名，防篡改\n\n**无状态认证流程：**\n\n1. 用户登录，服务器生成 JWT 返回给客户端\n2. 客户端存储 JWT（localStorage 或 Cookie）\n3. 每次请求在 `Authorization: Bearer <token>` 头中携带\n4. 服务器验证签名，从 Payload 中获取用户信息，无需查数据库\n\n### 追问：JWT 的缺点是什么？如何解决 Token 失效问题？\n\n**缺点：**\n\n1. Token 一旦签发，在过期前无法主动失效（如用户登出、修改密码）\n2. Payload 是 Base64 编码，不加密，不能存敏感信息\n3. Token 较大，每次请求都携带\n\n**解决 Token 失效：**\n\n1. 短期 Access Token + 长期 Refresh Token\n2. 服务端维护 Token 黑名单（Redis）\n3. 修改密码时更新密钥版本，旧 Token 验证失败',
    tags: ['认证授权', 'JWT', 'Token', '认证']
  },
  {
    id: 422,
    title: '什么是 OAuth 2.0？',
    category: '认证授权',
    difficulty: 'hard',
    content: '## 什么是 OAuth 2.0？\n\nOAuth 2.0 是授权框架，允许第三方应用在用户授权下访问其资源，而不需要暴露用户密码。\n\n**授权码模式（最安全）：**\n\n1. 用户点击"QQ 登录"，跳转到 QQ 授权页\n2. 用户同意授权，QQ 返回授权码（code）给回调地址\n3. 前端将 code 发给自己的后端\n4. 后端用 code + client_secret 换取 access_token\n5. 后端用 access_token 获取用户信息\n\n### 追问：为什么不直接在前端用 code 换 token？\n\n因为换 token 需要 `client_secret`，这个密钥不能暴露在前端（会被用户看到）。必须在后端进行，保护 `client_secret` 的安全。',
    tags: ['认证授权', 'OAuth', '授权码', '第三方登录']
  },

  // ========== 浏览器原理 ==========
  {
    id: 423,
    title: '浏览器的渲染流程是什么？',
    category: '浏览器原理',
    difficulty: 'hard',
    content: '## 浏览器的渲染流程是什么？\n\n1. **解析 HTML** → DOM 树\n2. **解析 CSS** → CSSOM 树\n3. **合并** DOM + CSSOM → 渲染树（只包含可见节点）\n4. **布局（Layout）**：计算每个节点的位置和尺寸\n5. **分层（Layer）**：将渲染树分为多个图层\n6. **绘制（Paint）**：将每个图层绘制为位图\n7. **合成（Composite）**：将所有图层合并，显示到屏幕\n\n### 追问：CSS 和 JS 如何影响渲染？\n\n- CSS 不阻塞 DOM 解析，但阻塞渲染（需要 CSSOM 才能构建渲染树）\n- CSS 阻塞其后的 JS 执行（JS 可能操作样式）\n- JS（无 defer/async）阻塞 DOM 解析和渲染\n- 所以：CSS 放 `<head>`，JS 放 `</body>` 前或使用 `defer`',
    tags: ['浏览器原理', '渲染流程', 'DOM', 'CSSOM']
  },
  {
    id: 424,
    title: '什么是浏览器的进程和线程模型？',
    category: '浏览器原理',
    difficulty: 'hard',
    content: '## 什么是浏览器的进程和线程模型？\n\n**Chrome 多进程架构：**\n\n- **浏览器进程**：控制 UI、地址栏、书签等\n- **渲染进程**：每个标签页一个（沙箱隔离），包含多个线程\n- **GPU 进程**：处理 GPU 任务\n- **网络进程**：处理网络请求\n- **插件进程**：每个插件一个\n\n**渲染进程中的线程：**\n\n- **JS 引擎线程**：执行 JS（单线程）\n- **GUI 渲染线程**：渲染页面（与 JS 线程互斥）\n- **事件触发线程**：管理事件队列\n- **定时器线程**：处理 setTimeout/setInterval\n- **异步 HTTP 请求线程**：处理网络请求\n\n### 追问：为什么 JS 是单线程的？\n\nJS 设计之初是为了操作 DOM，如果多线程同时操作 DOM 会产生竞态条件（如一个线程删除节点，另一个线程修改同一节点），需要复杂的锁机制。单线程简化了编程模型，通过事件循环处理异步任务。Web Worker 提供了多线程能力，但不能操作 DOM。',
    tags: ['浏览器原理', '进程', '线程', 'Chrome']
  },
  {
    id: 425,
    title: '什么是浏览器的回流（Reflow）和重绘（Repaint）？',
    category: '浏览器原理',
    difficulty: 'medium',
    content: '## 什么是浏览器的回流（Reflow）和重绘（Repaint）？\n\n- **回流（Reflow）**：元素的几何属性变化（位置、尺寸、内容），浏览器重新计算布局，代价最高\n- **重绘（Repaint）**：元素外观变化（颜色、背景、阴影），不影响布局，只重新绘制\n- **合成（Composite）**：只有 transform/opacity 变化，在 GPU 合成层处理，代价最低\n\n**触发回流的操作：**\n\n- 修改 width/height/margin/padding/border\n- 添加/删除 DOM 节点\n- 读取 offsetWidth/scrollTop 等布局属性\n- 窗口 resize\n\n### 追问：如何批量 DOM 操作减少回流？\n\n1. 使用 `DocumentFragment` 批量添加节点\n2. 先 `display: none` 隐藏元素，修改完再显示（只触发 2 次回流）\n3. 使用 `requestAnimationFrame` 批量处理\n4. 避免在循环中读取布局属性（会强制刷新渲染队列）\n5. 使用 CSS class 批量修改样式，而非逐个修改',
    tags: ['浏览器原理', '回流', '重绘', '性能']
  },
  {
    id: 426,
    title: '浏览器的存储机制有哪些？',
    category: '浏览器原理',
    difficulty: 'medium',
    content: '## 浏览器的存储机制有哪些？\n\n1. **Cookie**：~4KB，可设置过期时间，随请求发送，支持 HttpOnly/Secure/SameSite\n2. **localStorage**：~5MB，永久存储，同源共享，同步 API\n3. **sessionStorage**：~5MB，标签页关闭清除，不跨标签页，同步 API\n4. **IndexedDB**：>50MB，异步，支持事务和索引，适合大量结构化数据\n5. **Cache API**（Service Worker）：缓存 HTTP 响应，用于离线应用\n6. **Web SQL**：已废弃\n\n### 追问：如何实现跨标签页通信？\n\n1. **localStorage + storage 事件**：一个标签页修改 localStorage，其他标签页监听 `storage` 事件\n2. **BroadcastChannel**：同源标签页间广播消息\n3. **SharedWorker**：共享 Worker 作为中间人\n4. **Service Worker**：通过 postMessage 广播',
    tags: ['浏览器原理', '存储', 'Cookie', 'localStorage']
  },
  {
    id: 427,
    title: '什么是 Service Worker 缓存策略？',
    category: '浏览器原理',
    difficulty: 'hard',
    content: '## 什么是 Service Worker 缓存策略？\n\n**常见缓存策略：**\n\n1. **Cache First**：先查缓存，有则返回，无则网络请求并缓存。适合静态资源\n2. **Network First**：先网络请求，失败则返回缓存。适合 API 请求\n3. **Stale While Revalidate**：返回缓存（快），同时后台更新缓存。适合非关键资源\n4. **Cache Only**：只用缓存，适合离线资源\n5. **Network Only**：只用网络，适合实时数据\n\n### 追问：Service Worker 的更新机制是什么？\n\n浏览器在每次页面加载时检查 SW 文件是否更新（字节级比较）。如果有更新，新 SW 进入 `waiting` 状态，等待旧 SW 控制的所有页面关闭后才激活。可以通过 `skipWaiting()` 强制立即激活，通过 `clients.claim()` 立即控制所有页面。',
    tags: ['浏览器原理', 'Service Worker', '缓存策略', 'PWA']
  },

  // ========== 浏览器 API ==========
  {
    id: 428,
    title: '什么是 WebSocket？和 HTTP 的区别？',
    category: '浏览器 API',
    difficulty: 'medium',
    content: '## 什么是 WebSocket？和 HTTP 的区别？\n\nWebSocket 是全双工通信协议，建立在 TCP 上，通过 HTTP 握手升级。\n\n**与 HTTP 的区别：**\n\n- HTTP：请求-响应模式，客户端主动，服务器被动\n- WebSocket：建立连接后，双方可以随时互发消息，实时双向通信\n\n**应用场景：** 实时聊天、在线游戏、股票行情、协同编辑、CI/CD 构建日志\n\n```javascript\nconst ws = new WebSocket(\'wss://example.com/ws\');\nws.onopen = () => ws.send(\'Hello\');\nws.onmessage = (e) => console.log(e.data);\nws.onclose = () => console.log(\'连接关闭\');\n```\n\n### 追问：WebSocket 如何保持连接（心跳机制）？\n\n定时发送心跳包（ping/pong），如果一定时间内没有收到响应，认为连接断开，触发重连逻辑：\n\n```javascript\nsetInterval(() => {\n  if (ws.readyState === WebSocket.OPEN) ws.send(\'ping\');\n}, 30000);\n```',
    tags: ['浏览器 API', 'WebSocket', '实时通信']
  },
  {
    id: 429,
    title: '什么是 Server-Sent Events（SSE）？',
    category: '浏览器 API',
    difficulty: 'medium',
    content: '## 什么是 Server-Sent Events（SSE）？\n\nSSE 是服务器向客户端单向推送数据的技术，基于 HTTP，比 WebSocket 更简单。\n\n```javascript\nconst es = new EventSource(\'/api/stream\');\nes.onmessage = (e) => console.log(e.data);\nes.addEventListener(\'custom\', (e) => console.log(e.data));\nes.onerror = () => es.close();\n```\n\n**与 WebSocket 的区别：**\n\n- SSE：单向（服务器 → 客户端），基于 HTTP，自动重连，文本数据\n- WebSocket：双向，独立协议，需要手动重连，支持二进制\n\n**应用：** 实时通知、进度推送、AI 流式输出（ChatGPT 的打字效果）\n\n### 追问：SSE 和轮询（Polling）的区别？\n\n- **短轮询**：客户端定时发请求，有延迟，浪费资源\n- **长轮询**：服务器保持连接直到有数据，有数据后立即响应，客户端再次发请求\n- **SSE**：一次连接，服务器持续推送，无延迟，资源消耗最小',
    tags: ['浏览器 API', 'SSE', '流式传输', '实时通信']
  },
  {
    id: 430,
    title: '什么是 WebRTC？',
    category: '浏览器 API',
    difficulty: 'hard',
    content: '## 什么是 WebRTC？\n\nWebRTC（Web Real-Time Communication）是浏览器原生支持的实时通信技术，支持点对点的音视频和数据传输，无需插件。\n\n**核心 API：**\n\n- `RTCPeerConnection`：建立 P2P 连接\n- `MediaStream`：获取摄像头/麦克风\n- `RTCDataChannel`：P2P 数据传输\n\n**应用：** 视频会议（腾讯会议 Web 版）、在线教育、P2P 文件传输\n\n### 追问：WebRTC 如何穿透 NAT？\n\n通过 ICE（Interactive Connectivity Establishment）框架：\n\n1. **STUN 服务器**：获取公网 IP 和端口\n2. **TURN 服务器**：当直连失败时，通过中继服务器转发（兜底方案）\n3. **信令服务器**：交换 SDP（会话描述）和 ICE 候选，通常用 WebSocket 实现',
    tags: ['浏览器 API', 'WebRTC', 'P2P', '音视频']
  },
  {
    id: 431,
    title: '什么是 fetch API？和 XMLHttpRequest 的区别？',
    category: '浏览器 API',
    difficulty: 'medium',
    content: '## 什么是 fetch API？和 XMLHttpRequest 的区别？\n\n`fetch` 是现代的网络请求 API，基于 Promise：\n\n```javascript\nconst response = await fetch(\'/api/data\', {\n  method: \'POST\',\n  headers: { \'Content-Type\': \'application/json\' },\n  body: JSON.stringify({ name: \'test\' }),\n});\nconst data = await response.json();\n```\n\n**与 XHR 的区别：**\n\n1. `fetch` 基于 Promise，代码更简洁\n2. `fetch` 不会因为 HTTP 错误状态（4xx/5xx）reject，需要手动检查 `response.ok`\n3. `fetch` 默认不携带 Cookie（需要 `credentials: \'include\'`）\n4. `fetch` 不支持请求进度监听（XHR 支持 `onprogress`）\n5. `fetch` 不支持超时（需要配合 AbortController）\n\n### 追问：如何用 fetch 实现上传进度监控？\n\n`fetch` 本身不支持上传进度，需要用 XHR 或 `ReadableStream`（实验性）。实际项目中通常用 axios（基于 XHR），它支持 `onUploadProgress` 回调。',
    tags: ['浏览器 API', 'fetch', 'XMLHttpRequest', '网络请求']
  },
  {
    id: 432,
    title: '什么是 axios 的拦截器？如何实现请求重试？',
    category: '浏览器 API',
    difficulty: 'medium',
    content: '## 什么是 axios 的拦截器？如何实现请求重试？\n\n```javascript\n// 请求拦截器\naxios.interceptors.request.use(\n  (config) => {\n    config.headers.Authorization = `Bearer ${token}`;\n    return config;\n  },\n  (error) => Promise.reject(error)\n);\n\n// 响应拦截器\naxios.interceptors.response.use(\n  (response) => response.data,\n  async (error) => {\n    if (error.response?.status === 401) {\n      // Token 过期，刷新 Token\n      const newToken = await refreshToken();\n      error.config.headers.Authorization = `Bearer ${newToken}`;\n      return axios(error.config); // 重试原请求\n    }\n    return Promise.reject(error);\n  }\n);\n```\n\n### 追问：如何防止 Token 刷新时的并发请求问题？\n\n用一个 Promise 锁，第一个 401 请求触发刷新，其他并发请求等待刷新完成：\n\n```javascript\nlet refreshPromise = null;\n// 响应拦截器中\nif (!refreshPromise) {\n  refreshPromise = refreshToken().finally(() => (refreshPromise = null));\n}\nawait refreshPromise;\nreturn axios(error.config);\n```',
    tags: ['浏览器 API', 'axios', '拦截器', 'Token 刷新']
  },
  {
    id: 433,
    title: '什么是 Intersection Observer 的 rootMargin 和 threshold？',
    category: '浏览器 API',
    difficulty: 'medium',
    content: '## 什么是 Intersection Observer 的 rootMargin 和 threshold？\n\n```javascript\nconst observer = new IntersectionObserver(callback, {\n  root: null,           // 视口（默认）或指定容器\n  rootMargin: \'100px 0px\', // 扩展/收缩根元素边界（类似 CSS margin）\n  threshold: [0, 0.5, 1],  // 触发回调的交叉比例阈值\n});\n```\n\n- `rootMargin: \'100px\'`：在元素进入视口前 100px 就触发（提前加载）\n- `threshold: 0.5`：元素 50% 可见时触发\n- `threshold: [0, 0.25, 0.5, 0.75, 1]`：在多个可见比例时触发，可以实现进度追踪\n\n### 追问：如何用 IntersectionObserver 实现曝光统计？\n\n```javascript\nconst observer = new IntersectionObserver(\n  (entries) => {\n    entries.forEach((entry) => {\n      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {\n        reportExposure(entry.target.dataset.id);\n        observer.unobserve(entry.target); // 只统计一次\n      }\n    });\n  },\n  { threshold: 0.5 }\n);\n```',
    tags: ['浏览器 API', 'IntersectionObserver', '懒加载', '曝光统计']
  },
  {
    id: 434,
    title: '什么是 navigator.sendBeacon？',
    category: '浏览器 API',
    difficulty: 'easy',
    content: '## 什么是 navigator.sendBeacon？\n\n`navigator.sendBeacon(url, data)` 在页面卸载时可靠地发送数据，不阻塞页面关闭：\n\n```javascript\nwindow.addEventListener(\'unload\', () => {\n  navigator.sendBeacon(\'/analytics\', JSON.stringify({ event: \'page_leave\' }));\n});\n```\n\n**优势：**\n\n1. 异步发送，不阻塞页面卸载\n2. 即使页面关闭也能保证发送\n3. 比 `unload` 中的同步 XHR 更可靠\n\n**应用：** 页面离开时的数据上报、用户行为统计\n\n### 追问：为什么不用 fetch 在 unload 中发送数据？\n\n页面卸载时，浏览器会取消所有未完成的网络请求（包括 fetch），数据可能丢失。`sendBeacon` 专门为此场景设计，浏览器保证在页面卸载后仍然完成发送。',
    tags: ['浏览器 API', 'sendBeacon', '数据上报']
  },
  {
    id: 435,
    title: '什么是 Permissions API？',
    category: '浏览器 API',
    difficulty: 'easy',
    content: '## 什么是 Permissions API？\n\n`Permissions API` 查询和监听浏览器权限状态（摄像头、麦克风、通知、地理位置等）：\n\n```javascript\nconst result = await navigator.permissions.query({ name: \'camera\' });\nconsole.log(result.state); // \'granted\' | \'denied\' | \'prompt\'\n\nresult.addEventListener(\'change\', () => {\n  console.log(\'权限状态变化：\', result.state);\n});\n```\n\n### 追问：如何优雅地请求用户权限？\n\n1. 先用 `Permissions API` 查询当前状态\n2. 如果是 `denied`，提示用户手动开启，不再弹出请求框\n3. 如果是 `prompt`，在用户明确需要该功能时才请求（如点击"开始录音"按钮时），而非页面加载时\n4. 提供清晰的说明，告知用户为什么需要该权限',
    tags: ['浏览器 API', 'Permissions', '权限管理']
  },

  // ========== 性能优化与网络请求 ==========
  {
    id: 436,
    title: '什么是 DNS 预解析？有哪些性能优化手段？',
    category: '性能优化与网络请求',
    difficulty: 'medium',
    content: '## 什么是 DNS 预解析？有哪些性能优化手段？\n\nDNS 预解析提前解析域名，减少用户点击链接时的等待时间：\n\n```html\n<link rel="dns-prefetch" href="//cdn.example.com" />\n```\n\n**其他资源预加载手段：**\n\n- `<link rel="preconnect">`：提前建立 TCP 连接（包含 DNS + TCP + TLS）\n- `<link rel="preload">`：提前加载当前页面需要的关键资源\n- `<link rel="prefetch">`：提前加载下一页可能需要的资源（低优先级）\n- `<link rel="prerender">`：提前渲染整个页面\n\n### 追问：preload 和 prefetch 的区别？\n\n- `preload`：高优先级，加载当前页面**必须**的资源（如字体、关键 CSS），不会延迟当前页面渲染\n- `prefetch`：低优先级，加载**未来**可能需要的资源，在浏览器空闲时下载，不影响当前页面',
    tags: ['性能优化与网络请求', 'DNS预解析', 'preload', 'prefetch']
  },
  {
    id: 437,
    title: '什么是 CDN？有什么作用？',
    category: '性能优化与网络请求',
    difficulty: 'easy',
    content: '## 什么是 CDN？有什么作用？\n\nCDN（内容分发网络）将静态资源分发到全球各地的边缘节点，用户从最近的节点获取资源。\n\n**作用：**\n\n1. **加速**：就近访问，减少网络延迟\n2. **减轻源服务器压力**：静态资源由 CDN 承担\n3. **高可用**：多节点冗余，单点故障不影响服务\n4. **防 DDoS**：CDN 可以吸收大量攻击流量\n\n### 追问：前端项目如何利用 CDN？\n\n1. 静态资源（JS/CSS/图片）上传到 CDN（如阿里云 OSS + CDN）\n2. 第三方库使用公共 CDN（如 unpkg、jsDelivr）\n3. Webpack/Vite 配置 `publicPath` 指向 CDN 域名\n4. 图片使用 CDN 域名，配合图片处理参数（压缩、裁剪）',
    tags: ['性能优化与网络请求', 'CDN', '加速', '部署']
  },
  {
    id: 438,
    title: '什么是浏览器的 Performance API？',
    category: '性能优化与网络请求',
    difficulty: 'medium',
    content: '## 什么是浏览器的 Performance API？\n\n`Performance API` 提供精确的性能测量工具：\n\n```javascript\n// 导航时间\nconst timing = performance.getEntriesByType(\'navigation\')[0];\nconst ttfb = timing.responseStart - timing.requestStart; // TTFB\nconst domLoad = timing.domContentLoadedEventEnd - timing.startTime;\n\n// 自定义性能标记\nperformance.mark(\'start\');\n// ... 执行代码 ...\nperformance.mark(\'end\');\nperformance.measure(\'duration\', \'start\', \'end\');\nconst measure = performance.getEntriesByName(\'duration\')[0];\nconsole.log(measure.duration);\n\n// 资源加载时间\nperformance.getEntriesByType(\'resource\').forEach((r) => {\n  console.log(r.name, r.duration);\n});\n```\n\n### 追问：什么是 Core Web Vitals？\n\nGoogle 定义的核心网页指标：\n\n- **LCP（Largest Contentful Paint）**：最大内容绘制，衡量加载性能，目标 < 2.5s\n- **FID（First Input Delay）**：首次输入延迟，衡量交互性，目标 < 100ms（已被 INP 替代）\n- **CLS（Cumulative Layout Shift）**：累积布局偏移，衡量视觉稳定性，目标 < 0.1\n- **INP（Interaction to Next Paint）**：交互到下一帧绘制，目标 < 200ms',
    tags: ['性能优化与网络请求', 'Performance API', 'Web Vitals', '性能监控']
  },
  {
    id: 439,
    title: '什么是 requestAnimationFrame 和浏览器渲染帧？',
    category: '性能优化与网络请求',
    difficulty: 'medium',
    content: '## 什么是 requestAnimationFrame 和浏览器渲染帧？\n\n浏览器以 60fps（每帧约 16.7ms）刷新屏幕。每帧的工作：\n\n1. 处理输入事件\n2. 执行 JS（包括 rAF 回调）\n3. 布局计算\n4. 绘制\n5. 合成\n\n`requestAnimationFrame` 在每帧渲染前执行，与屏幕刷新同步，适合动画。\n\n### 追问：什么是长任务（Long Task）？如何优化？\n\n超过 50ms 的 JS 任务称为长任务，会阻塞主线程，导致页面卡顿（掉帧）。\n\n优化方法：\n\n1. **任务分割**：用 `setTimeout(0)` 或 `scheduler.postTask()` 将长任务分割为小任务\n2. **Web Worker**：将计算密集型任务移到 Worker 线程\n3. **requestIdleCallback**：在空闲时执行非关键任务\n4. **React Fiber / Vue 3 编译优化**：框架层面的时间切片',
    tags: ['性能优化与网络请求', 'requestAnimationFrame', '渲染帧', '动画']
  },
  {
    id: 440,
    title: '什么是 requestAnimationFrame 的节流应用？',
    category: '性能优化与网络请求',
    difficulty: 'medium',
    content: '## 什么是 requestAnimationFrame 的节流应用？\n\n用 rAF 实现节流，确保每帧最多执行一次：\n\n```javascript\nfunction rafThrottle(fn) {\n  let rafId = null;\n  return function (...args) {\n    if (rafId) return;\n    rafId = requestAnimationFrame(() => {\n      fn.apply(this, args);\n      rafId = null;\n    });\n  };\n}\n\nwindow.addEventListener(\'scroll\', rafThrottle(handleScroll));\n```\n\n**优势：** 与屏幕刷新率同步，不会超过 60fps，比 `setTimeout(fn, 16)` 更精确。\n\n### 追问：什么时候用 rAF 节流，什么时候用 setTimeout 节流？\n\n- rAF 节流：视觉相关的操作（滚动动画、拖拽、canvas 绘制），需要与渲染帧同步\n- setTimeout 节流：非视觉操作（搜索请求、数据上报），需要精确控制时间间隔',
    tags: ['性能优化与网络请求', 'rAF节流', '性能优化', '节流']
  },
]
