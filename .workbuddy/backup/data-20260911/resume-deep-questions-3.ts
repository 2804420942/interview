import type { Question } from './types'

export const resumeDeepQuestions3: Question[] = [
  {
    id: 1151,
    title: '你在脚手架中使用 inquirer 实现命令行交互，如何设计多步骤交互流程和动态选项？',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['脚手架', 'inquirer', '命令行交互', 'CLI设计'],
    content: `## 答案

脚手架的 init 命令需要收集大量信息，用户体验要求：步骤清晰、选项动态、可回退。

### 多步骤交互设计

\`\`\`javascript
async function initProject() {
  // 第一步：基本信息
  const baseInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '项目名称：',
      validate: (input) => {
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return '项目名只能包含小写字母、数字和短横线，且以字母开头';
        }
        if (fs.existsSync(path.resolve(input))) {
          return '目录已存在，请换一个名称';
        }
        return true;
      },
      default: 'my-project'
    }
  ]);

  // 第二步：模板选择（从远程接口获取动态列表）
  const templates = await fetchTemplateList();
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '选择项目模板：',
      choices: templates.map(t => ({
        name: \`\${t.name} - \${t.description}\`,
        value: t.id,
        short: t.name
      })),
      pageSize: 10
    }
  ]);

  // 第三步：根据选择的模板动态生成选项
  const templateConfig = templates.find(t => t.id === template);
  const extraOptions = await inquirer.prompt(
    templateConfig.options.map(opt => ({
      type: opt.type,        // 'confirm', 'list', 'checkbox'
      name: opt.name,
      message: opt.message,
      choices: opt.choices,
      default: opt.default,
      when: opt.condition     // 条件显示
    }))
  );

  return { ...baseInfo, template, ...extraOptions };
}
\`\`\`

### 动态选项与条件显示

\`\`\`javascript
// when 字段实现条件显示
{
  type: 'list',
  name: 'cssPreprocessor',
  message: 'CSS 预处理器：',
  choices: ['scss', 'less', 'none'],
  // 只有选了 Vue 模板才问 CSS 预处理器
  when: (answers) => answers.template.includes('vue')
},
{
  type: 'confirm',
  name: 'useTypeScript',
  message: '是否使用 TypeScript？',
  default: true,
  // TypeScript 模板不需要再问
  when: (answers) => !answers.template.includes('-ts')
}
\`\`\`

### 追问：如何实现交互流程的"回退"功能（用户想修改上一步的选择）？

**答案：**
inquirer 本身不支持回退，我的解决方案是将每一步的 prompt 封装成独立函数，用循环 + 状态机控制流程：

\`\`\`javascript
const steps = [promptBasicInfo, promptTemplate, promptOptions];
let currentStep = 0;
const results = {};

while (currentStep < steps.length) {
  const { data, action } = await steps[currentStep](results);
  if (action === 'back' && currentStep > 0) {
    currentStep--;
  } else {
    Object.assign(results, data);
    currentStep++;
  }
}
\`\`\``
  },
  {
    id: 1152,
    title: '你在 AIGC 平台实现了素材版本管理，如何设计版本控制方案以支持回滚和对比？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['版本管理', 'AIGC', '素材回滚', 'Diff对比'],
    content: `## 答案

AIGC 平台的素材经过多轮 AI 生成和人工调整，需要保留每个版本的记录，支持随时回滚和版本对比。

### 版本数据结构

\`\`\`typescript
interface AssetVersion {
  versionId: string;           // 版本唯一标识
  assetId: string;             // 所属素材 ID
  versionNumber: number;       // 版本号（递增）
  createdAt: string;           // 创建时间
  createdBy: string;           // 操作人
  source: 'ai_generate' | 'manual_edit' | 'ai_regenerate';
  files: {
    main: string;              // 主图 URL
    thumbnail: string;         // 缩略图 URL
    layers?: string[];         // 图层文件 URLs
  };
  metadata: {
    prompt?: string;           // AI 生成时的 prompt
    model?: string;            // 使用的 AI 模型
    quality_score?: number;    // 质量评分
    changes?: string;          // 变更说明
  };
  status: 'draft' | 'active' | 'archived';
}
\`\`\`

### 版本列表与对比 UI

\`\`\`javascript
// 版本时间线组件
function renderVersionTimeline(versions) {
  return versions.map((v, i) => ({
    version: \`v\${v.versionNumber}\`,
    time: formatRelativeTime(v.createdAt),
    author: v.createdBy,
    source: v.source === 'ai_generate' ? '🤖 AI 生成' : '✏️ 手动编辑',
    isCurrent: v.status === 'active',
    canRestore: v.status === 'archived',
    diffWithPrev: i > 0 ? calculateDiff(versions[i-1], v) : null
  }));
}

// 版本对比（图片叠加滑块对比）
function initImageCompare(containerEl, oldImageUrl, newImageUrl) {
  // 两张图片叠加，通过 CSS clip-path 控制显示范围
  // 用户拖动滑块改变 clip-path 的 inset 值
  let clipPercent = 50;
  const slider = containerEl.querySelector('.compare-slider');
  slider.addEventListener('input', (e) => {
    clipPercent = e.target.value;
    containerEl.querySelector('.new-image').style.clipPath =
      \`inset(0 \${100 - clipPercent}% 0 0)\`;
  });
}
\`\`\`

### 回滚操作

\`\`\`javascript
async function rollbackToVersion(assetId, targetVersionId) {
  // 1. 将当前 active 版本标记为 archived
  await api.patch(\`/assets/\${assetId}/versions/current\`, { status: 'archived' });
  // 2. 将目标版本标记为 active
  await api.patch(\`/assets/\${assetId}/versions/\${targetVersionId}\`, { status: 'active' });
  // 3. 同时创建一个新版本记录（保留回滚操作的审计轨迹）
  await api.post(\`/assets/\${assetId}/versions\`, {
    source: 'rollback',
    metadata: { rollbackFrom: currentVersionId, rollbackTo: targetVersionId }
  });
}
\`\`\`

### 追问：版本数据量大时，存储如何优化？

**答案：**
1. **增量存储**：只存储与上一版本的 diff，而非完整文件（适用于文本类）
2. **图片引用**：同一张图片只存一份，版本记录中存 URL 引用
3. **过期清理**：超过 30 天的非 active 版本自动归档到冷存储
4. **缩略图策略**：版本列表只展示缩略图，查看详情时再加载原图`
  },
  {
    id: 1153,
    title: '你在前端项目中集成了 Sentry 错误监控，请说明从接入到告警的完整方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['错误监控', 'Sentry', 'SourceMap', '告警策略'],
    content: `## 答案

前端错误监控是保障线上质量的关键，Sentry 是我在多个项目中使用的核心工具。

### 接入方案

\`\`\`javascript
// Vue 项目接入
import * as Sentry from '@sentry/vue';

Sentry.init({
  app,
  dsn: 'https://xxx@sentry.example.com/1',
  environment: import.meta.env.MODE, // development | production
  release: __APP_VERSION__,           // 与 SourceMap 关联
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['api.example.com'],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router)
    }),
    new Sentry.Replay({ maskAllText: false, blockAllMedia: false })
  ],
  tracesSampleRate: 0.1,    // 10% 性能采样
  replaysSessionSampleRate: 0.01, // 1% 会话回放
  replaysOnErrorSampleRate: 1.0,  // 100% 错误时回放
  beforeSend(event) {
    // 过滤无意义错误
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null;
    }
    // 添加业务上下文
    event.tags = {
      ...event.tags,
      userId: store.getters.userId,
      page: router.currentRoute.value.name
    };
    return event;
  }
});
\`\`\`

### SourceMap 上传（构建时自动上传）

\`\`\`javascript
// vite.config.ts
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: { sourcemap: true },
  plugins: [
    sentryVitePlugin({
      org: 'my-org',
      project: 'my-project',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './dist/**',
        // 上传后删除本地 sourcemap，不暴露源码
        filesToDeleteAfterUpload: './dist/**/*.map'
      }
    })
  ]
});
\`\`\`

### 告警策略

\`\`\`javascript
// Sentry 告警规则配置
const alertRules = [
  {
    name: '新增错误类型告警',
    condition: 'first_seen',     // 首次出现的错误
    action: 'notify_oncall'      // 通知值班人
  },
  {
    name: '错误频率激增告警',
    condition: 'frequency > 100 in 5min', // 5分钟内同一错误超过100次
    action: 'notify_team'        // 通知整个团队
  },
  {
    name: '关键接口错误告警',
    condition: 'tag:api_path in [/api/payment, /api/auth]',
    action: 'notify_oncall + page' // 紧急呼叫
  }
];
\`\`\`

### 追问：线上出现一个 "Cannot read property 'xxx' of undefined" 错误，你是如何定位的？

**答案：**
1. **Sentry 面板**查看错误堆栈（SourceMap 映射到源码）
2. 查看 **面包屑（Breadcrumbs）**——用户操作轨迹和最近的网络请求
3. 查看 **Session Replay**——回放用户操作场景
4. 查看 **设备信息**——浏览器版本、OS
5. 结合堆栈和上下文，定位到具体代码行，检查 null 判断缺失`
  },
  {
    id: 1154,
    title: '你在卫盈智信实现了大文件分片上传，请说明分片策略、断点续传和秒传方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['分片上传', '断点续传', 'MD5秒传', 'Web Worker'],
    content: `## 答案

金融系统中需要上传合同扫描件、证件照等大文件（可能超过 100MB），普通上传容易超时失败。

### 分片策略

\`\`\`javascript
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 一片

function createChunks(file) {
  const chunks = [];
  let start = 0;
  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    chunks.push({
      index: chunks.length,
      blob: file.slice(start, end),
      start,
      end,
      size: end - start
    });
    start = end;
  }
  return chunks;
}
\`\`\`

### 断点续传核心逻辑

\`\`\`javascript
async function uploadWithResume(file) {
  // 1. 计算文件 Hash（Web Worker 中计算，不阻塞 UI）
  const fileHash = await calculateFileHash(file);

  // 2. 查询服务器已上传的分片
  const { uploadedChunks, uploadId } = await api.post('/upload/init', {
    fileHash, fileName: file.name, fileSize: file.size,
    totalChunks: Math.ceil(file.size / CHUNK_SIZE)
  });

  // 3. 秒传检测
  if (uploadedChunks === 'COMPLETE') {
    return { url: uploadedChunks.url, instant: true };
  }

  // 4. 过滤已上传的分片，只上传剩余部分
  const chunks = createChunks(file);
  const pendingChunks = chunks.filter(c => !uploadedChunks.includes(c.index));

  // 5. 并发上传（限制并发数）
  const CONCURRENCY = 3;
  const results = [];
  for (let i = 0; i < pendingChunks.length; i += CONCURRENCY) {
    const batch = pendingChunks.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(chunk =>
      uploadChunk(uploadId, chunk, fileHash)
    ));
    results.push(...batchResults);
    // 更新进度
    onProgress((uploadedChunks.length + results.length) / chunks.length * 100);
  }

  // 6. 通知服务器合并分片
  return api.post('/upload/merge', { uploadId, fileHash });
}
\`\`\`

### Web Worker 计算文件 Hash

\`\`\`javascript
// hash-worker.js
self.onmessage = async (e) => {
  const { file } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  const chunkSize = 2 * 1024 * 1024;
  let offset = 0;

  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    const buffer = await chunk.arrayBuffer();
    spark.append(buffer);
    offset += chunkSize;
    self.postMessage({ type: 'progress', percent: offset / file.size * 100 });
  }

  self.postMessage({ type: 'done', hash: spark.end() });
};
\`\`\`

### 追问：如何实现"秒传"？

**答案：**
秒传的原理是**文件内容相同则 Hash 相同**。上传前先计算文件 MD5 发给服务器，服务器检查数据库中是否已有相同 Hash 的文件。如果有，直接返回已存在的 URL，无需实际上传。对于用户来说，大文件"秒传"完成。`
  },
  {
    id: 1155,
    title: '你在项目中实现了 WebSocket 心跳保活机制，请说明设计方案和异常处理。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['WebSocket', '心跳保活', '断线重连', '网络异常'],
    content: `## 答案

WebSocket 连接在实际网络环境中可能被各种中间件（Nginx、负载均衡器、防火墙）静默断开，必须通过心跳检测连接状态。

### 心跳保活方案

\`\`\`javascript
class HeartbeatWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.heartbeatInterval = options.heartbeatInterval || 30000; // 30秒
    this.heartbeatTimeout = options.heartbeatTimeout || 10000;   // 10秒无回复视为断开
    this.reconnectDelay = options.reconnectDelay || 1000;
    this.maxReconnects = options.maxReconnects || 10;
    this.reconnectCount = 0;
    this.handlers = new Map();
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      this.reconnectCount = 0;
      this.startHeartbeat();
      this.handlers.get('open')?.forEach(fn => fn());
    };
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'pong') {
        this.handlePong();
        return;
      }
      this.handlers.get('message')?.forEach(fn => fn(data));
    };
    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.reconnect();
    };
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        // 设置超时检测
        this.pongTimeout = setTimeout(() => {
          // 超时未收到 pong，主动断开触发重连
          this.ws.close();
        }, this.heartbeatTimeout);
      }
    }, this.heartbeatInterval);
  }

  handlePong() {
    clearTimeout(this.pongTimeout);
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
    clearTimeout(this.pongTimeout);
  }

  reconnect() {
    if (this.reconnectCount >= this.maxReconnects) {
      this.handlers.get('error')?.forEach(fn => fn(new Error('重连次数超限')));
      return;
    }
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectCount);
    this.reconnectCount++;
    setTimeout(() => this.connect(), Math.min(delay, 30000));
  }

  on(event, handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event).push(handler);
  }
}
\`\`\`

### 追问：Nginx 的 proxy_read_timeout 默认 60 秒就会断开空闲连接，心跳间隔如何设置？

**答案：**
心跳间隔必须小于 Nginx 的 \`proxy_read_timeout\`。建议设为超时时间的一半（如 Nginx 设 60s，心跳设 25-30s），留出网络延迟的余量。同时建议 Nginx 配置 \`proxy_read_timeout 120s\` 以减少不必要的心跳频率。`
  },
  {
    id: 1156,
    title: '你负责了前端灰度发布方案的实现，请说明从用户分流到版本切换的完整技术方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['灰度发布', '分流策略', 'Feature Flag', '版本控制'],
    content: `## 答案

灰度发布的核心是**让一部分用户使用新版本，观察是否正常，再逐步放量**。

### 前端灰度架构

\`\`\`
用户请求 → Nginx/CDN → 分流判断 → 返回新版or旧版HTML
                            ↓
                   灰度配置服务（后端）
\`\`\`

### 方案一：HTML 入口分流（服务端）

\`\`\`nginx
# Nginx 灰度配置
map $cookie_gray_version $backend {
    "new"   /dist-new/index.html;
    default /dist-old/index.html;
}

server {
    location / {
        # 通过后端接口设置 Cookie 控制灰度
        try_files $backend =404;
    }
}
\`\`\`

### 方案二：前端 Feature Flag（更灵活）

\`\`\`javascript
class FeatureFlagService {
  private flags = {};
  private userId = '';

  async init(userId) {
    this.userId = userId;
    // 从后端获取该用户的灰度配置
    this.flags = await api.get('/api/feature-flags', {
      params: { userId }
    });
    // 缓存到 localStorage，防止接口异常时无法判断
    localStorage.setItem('feature_flags', JSON.stringify({
      flags: this.flags,
      expireAt: Date.now() + 5 * 60 * 1000
    }));
  }

  isEnabled(flagName) {
    return this.flags[flagName]?.enabled ?? false;
  }

  // 用于 A/B 测试的变体获取
  getVariant(flagName) {
    return this.flags[flagName]?.variant ?? 'control';
  }
}

// 使用方式
if (featureFlags.isEnabled('new_dashboard')) {
  renderNewDashboard();
} else {
  renderOldDashboard();
}
\`\`\`

### 灰度放量策略

\`\`\`javascript
// 后端分流逻辑（前端不感知）
function shouldEnableFeature(userId, flag) {
  // 白名单直接开启（内部测试）
  if (flag.whitelist.includes(userId)) return true;
  // 按用户 ID 哈希取模实现稳定分流
  const hash = murmurhash3(userId) % 100;
  return hash < flag.percentage; // percentage: 0-100
}
\`\`\`

### 追问：灰度发布过程中发现新版本有问题，如何秒级回滚？

**答案：**
1. **Feature Flag 方案**：后台将 percentage 设为 0，所有用户立即走旧版逻辑
2. **HTML 分流方案**：Nginx 配置切回旧版 HTML
3. **CDN 回滚**：CDN 支持版本切换，切回上一个版本的静态资源
4. 关键是**新旧版本的静态资源同时保留在 CDN**，而不是覆盖部署`
  },
  {
    id: 1157,
    title: '你在决策引擎中实现了复杂的表单校验引擎，请说明校验规则的动态配置方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['表单校验', '规则引擎', 'ElementPlus', '动态校验'],
    content: `## 答案

决策引擎中，贷款申请表单的校验规则需要根据产品类型动态变化（如个人贷款需要身份证，企业贷款需要营业执照），不能硬编码。

### 校验规则数据结构

\`\`\`typescript
interface ValidationRule {
  field: string;            // 字段名
  type: 'required' | 'regex' | 'range' | 'custom' | 'async';
  message: string;          // 错误提示
  params?: Record<string, any>; // 规则参数
  trigger?: 'blur' | 'change'; // 触发时机
  when?: string;            // 条件表达式（如 "loanType === 'personal'"）
}

// 后端下发的校验配置
const validationConfig = {
  personal_loan: [
    { field: 'idCard', type: 'required', message: '请输入身份证号' },
    { field: 'idCard', type: 'regex', params: { pattern: '^\\\\d{17}[\\\\dX]$' }, message: '身份证格式不正确' },
    { field: 'income', type: 'range', params: { min: 3000, max: 1000000 }, message: '月收入需在3000-100万之间' },
    { field: 'phone', type: 'async', params: { api: '/api/validate/phone' }, message: '手机号已被注册' }
  ],
  enterprise_loan: [
    { field: 'businessLicense', type: 'required', message: '请上传营业执照' },
    { field: 'registeredCapital', type: 'range', params: { min: 100000 }, message: '注册资本不低于10万' }
  ]
};
\`\`\`

### 转换为 ElementPlus 校验规则

\`\`\`javascript
function convertToElRules(config) {
  const rules = {};
  for (const rule of config) {
    if (!rules[rule.field]) rules[rule.field] = [];
    switch (rule.type) {
      case 'required':
        rules[rule.field].push({ required: true, message: rule.message, trigger: rule.trigger || 'blur' });
        break;
      case 'regex':
        rules[rule.field].push({
          pattern: new RegExp(rule.params.pattern),
          message: rule.message, trigger: rule.trigger || 'blur'
        });
        break;
      case 'range':
        rules[rule.field].push({
          validator: (_, value, callback) => {
            const num = Number(value);
            if (rule.params.min !== undefined && num < rule.params.min) callback(new Error(rule.message));
            else if (rule.params.max !== undefined && num > rule.params.max) callback(new Error(rule.message));
            else callback();
          },
          trigger: rule.trigger || 'blur'
        });
        break;
      case 'async':
        rules[rule.field].push({
          asyncValidator: async (_, value, callback) => {
            const { valid } = await api.post(rule.params.api, { value });
            valid ? callback() : callback(new Error(rule.message));
          },
          trigger: 'blur'
        });
        break;
    }
  }
  return rules;
}
\`\`\`

### 追问：异步校验（如手机号查重）如何防止频繁请求？

**答案：**
1. **防抖**：输入停止 500ms 后才触发异步校验
2. **缓存**：相同值的校验结果缓存 1 分钟，不重复请求
3. **取消**：新的校验请求发出时，取消上一个 pending 的请求（AbortController）
4. **格式前置**：先通过正则校验格式，格式正确才触发异步校验`
  },
  {
    id: 1158,
    title: '你在项目中使用 Vite 构建，请说明你做过哪些 Vite 构建优化和遇到的坑。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Vite', '构建优化', '代码分割', 'bundle分析'],
    content: `## 答案

### 构建优化措施

**1. 代码分割策略**

\`\`\`javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 框架核心单独打包（长效缓存）
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 库单独打包
          'element-plus': ['element-plus'],
          // 工具库单独打包
          'utils': ['lodash-es', 'dayjs', 'axios'],
          // ECharts 按需引入
          'echarts': ['echarts/core', 'echarts/charts', 'echarts/components']
        }
      }
    },
    // gzip 压缩后小于此值的文件内联为 base64
    assetsInlineLimit: 4096,
    // chunk 大小警告阈值
    chunkSizeWarningLimit: 1000
  }
});
\`\`\`

**2. 依赖预构建优化**

\`\`\`javascript
export default defineConfig({
  optimizeDeps: {
    include: [
      'element-plus/es/components/table/style/css',
      'element-plus/es/components/form/style/css',
      // 预构建常用深层导入，避免开发时大量请求
    ],
    exclude: ['@vueuse/core'] // 已是 ESM 格式，无需预构建
  }
});
\`\`\`

**3. 资源压缩**

\`\`\`javascript
import viteCompression from 'vite-plugin-compression';
export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240, // 10KB 以上才压缩
      ext: '.gz'
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ]
});
\`\`\`

### 遇到的坑

**坑 1：开发环境首次加载慢**
Vite 开发时按需编译，首次访问大页面可能触发几百个模块请求。
解决：\`optimizeDeps.include\` 预构建常用依赖。

**坑 2：生产环境 CSS 顺序不一致**
多个组件 import 同一个 CSS 文件，打包后顺序可能与开发不同。
解决：全局样式放在 main.ts 最前面 import，组件样式使用 scoped。

**坑 3：动态 import 路径不支持完全动态**
\`\`\`javascript
// ❌ 不工作
const module = await import(path)
// ✅ 需要有静态部分
const module = await import(\`./views/\${name}.vue\`)
\`\`\`

### 追问：如何分析 Vite 打包后的 bundle 大小？

**答案：**
使用 \`rollup-plugin-visualizer\` 插件生成可视化报告，一眼看出哪个依赖最大，针对性优化。`
  },
  {
    id: 1159,
    title: '你在项目中封装了通用组件库，请说明组件设计原则和 API 设计规范。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['组件库', 'API设计', 'Props设计', '组件封装'],
    content: `## 答案

在多个项目中，我沉淀了一套业务组件库，提升团队开发效率。

### 组件设计原则

1. **单一职责**：一个组件只做一件事
2. **Props 入、Events 出**：数据通过 props 传入，变化通过 emit 通知
3. **受控 + 非受控**：同时支持 v-model（受控）和内部状态（非受控）
4. **样式可定制**：通过 CSS 变量 / class 覆盖 / slot 三种方式定制

### API 设计示例——SearchSelect 组件

\`\`\`typescript
// 好的 Props 设计
interface SearchSelectProps {
  // --- 数据 ---
  modelValue: string | string[];          // v-model 绑定值
  options?: Option[];                      // 静态选项
  remote?: boolean;                        // 是否远程搜索
  remoteMethod?: (query: string) => Promise<Option[]>; // 远程搜索方法
  
  // --- 行为 ---
  multiple?: boolean;                      // 是否多选
  filterable?: boolean;                    // 是否可搜索
  clearable?: boolean;                     // 是否可清空
  disabled?: boolean;                      // 是否禁用
  loading?: boolean;                       // 加载状态
  
  // --- 展示 ---
  placeholder?: string;
  size?: 'small' | 'default' | 'large';
  maxTagCount?: number;                    // 多选时最多显示几个标签
  
  // --- 校验 ---
  maxSelectCount?: number;                 // 最多选几个
  minSelectCount?: number;                 // 最少选几个
}

// 好的 Event 设计
interface SearchSelectEmits {
  'update:modelValue': [value: string | string[]];
  'change': [value: string | string[], option: Option | Option[]];
  'search': [query: string];
  'focus': [];
  'blur': [];
  'clear': [];
}

// 好的 Slot 设计
// #option="{ item }"   - 自定义选项渲染
// #tag="{ item }"      - 自定义多选标签渲染
// #empty               - 空状态
// #prefix              - 前缀图标
\`\`\`

### 避免的反模式

\`\`\`typescript
// ❌ 反模式：Props 太多、职责不清
interface BadProps {
  data: any;              // 类型不明确
  showHeader: boolean;    // 布尔 Props 堆砌
  showFooter: boolean;
  showBorder: boolean;
  headerStyle: object;    // 样式通过 Props 传递
  onSubmit: Function;     // 事件混在 Props 里
}

// ✅ 好的做法：类型明确、通过 Slot 扩展
interface GoodProps {
  data: TableRow[];       // 明确类型
  bordered?: boolean;     // 默认值合理
}
// 通过 Slot 扩展：#header、#footer
// 通过 CSS 变量定制样式
\`\`\`

### 追问：如何保证组件库的向后兼容性？

**答案：**
1. **语义化版本**：破坏性变更升 major 版本
2. **Props 只增不删**：废弃的 Props 标记 @deprecated，打印 console.warn
3. **默认值不变**：新增 Props 的默认值保持与旧版行为一致
4. **迁移指南**：重大变更提供 codemod 脚本自动迁移`
  },
  {
    id: 1160,
    title: '你在 QQ 运动项目中处理移动端复杂手势交互，请说明手势识别和冲突解决方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['手势交互', '触摸事件', '手势冲突', '惯性滚动'],
    content: `## 答案

QQ 运动首页包含横向轮播、纵向列表、下拉刷新、卡片左滑等多种手势，它们之间会产生冲突。

### 手势识别器

\`\`\`javascript
class GestureRecognizer {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.handlers = {};

    element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    element.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    element.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  onTouchStart(e) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
    this.direction = null;   // 方向未确定
    this.locked = false;     // 未锁定
  }

  onTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;

    // 方向锁定：移动超过 10px 后确定方向
    if (!this.direction && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      this.direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      this.locked = true;
    }

    if (this.locked) {
      if (this.direction === 'horizontal') {
        e.preventDefault(); // 阻止纵向滚动
        this.handlers.panX?.({ deltaX, direction: deltaX > 0 ? 'right' : 'left' });
      } else {
        this.handlers.panY?.({ deltaY, direction: deltaY > 0 ? 'down' : 'up' });
      }
    }
  }

  onTouchEnd(e) {
    const duration = Date.now() - this.startTime;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;
    const velocity = Math.abs(deltaX) / duration;

    // 快速滑动识别（flick/swipe）
    if (duration < 300 && velocity > 0.5) {
      this.handlers.swipe?.({
        direction: this.direction === 'horizontal'
          ? (deltaX > 0 ? 'right' : 'left')
          : (deltaY > 0 ? 'down' : 'up'),
        velocity
      });
    }

    // 点击识别（移动距离 < 10px 且时间 < 200ms）
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && duration < 200) {
      this.handlers.tap?.({ x: touch.clientX, y: touch.clientY });
    }
  }

  on(gesture, handler) {
    this.handlers[gesture] = handler;
  }
}
\`\`\`

### 手势冲突解决——方向锁定

核心策略是**一旦确定方向就锁定**：触摸开始后，根据第一个超过阈值的移动方向判断是横向还是纵向，锁定后只触发对应方向的手势。

### 追问：下拉刷新和列表纵向滚动如何区分？

**答案：**
关键判断：当列表 \`scrollTop === 0\` 且用户向下滑动时才触发下拉刷新，否则是普通滚动。
\`\`\`javascript
onTouchMove(e) {
  if (this.direction === 'vertical' && listEl.scrollTop === 0 && deltaY > 0) {
    e.preventDefault(); // 阻止默认滚动
    triggerPullRefresh(deltaY);
  }
}
\`\`\``
  },
  {
    id: 1161,
    title: '你在项目中实现了前端数据埋点系统，请说明自动埋点与手动埋点的技术方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['数据埋点', '自动埋点', 'IntersectionObserver', 'sendBeacon'],
    content: `## 答案

### 手动埋点——精确但维护成本高

\`\`\`javascript
// 统一的上报 API
class Tracker {
  constructor(config) {
    this.appId = config.appId;
    this.queue = [];
    this.commonParams = {
      platform: getPlatform(),
      version: __APP_VERSION__,
      userId: '',
      sessionId: generateSessionId()
    };
  }

  // 页面浏览
  trackPV(pageName, params = {}) {
    this.report({ type: 'pv', page: pageName, ...params });
  }

  // 点击事件
  trackClick(elementId, params = {}) {
    this.report({ type: 'click', element: elementId, ...params });
  }

  // 自定义事件
  trackEvent(eventName, params = {}) {
    this.report({ type: 'event', event: eventName, ...params });
  }

  report(data) {
    const payload = { ...this.commonParams, ...data, timestamp: Date.now() };
    this.queue.push(payload);
    if (this.queue.length >= 10) this.flush();
  }

  flush() {
    if (!this.queue.length) return;
    const data = this.queue.splice(0);
    // sendBeacon 保证页面卸载时也能发送
    navigator.sendBeacon('/api/track', JSON.stringify(data));
  }
}
\`\`\`

### 自动埋点——低维护成本

\`\`\`javascript
// 基于 data-track 属性的自动点击埋点
function initAutoTrack() {
  document.addEventListener('click', (e) => {
    const trackEl = e.target.closest('[data-track-click]');
    if (trackEl) {
      tracker.trackClick(trackEl.dataset.trackClick, {
        text: trackEl.textContent?.trim().slice(0, 50),
        page: location.pathname
      });
    }
  }, true);
}

// 基于 IntersectionObserver 的自动曝光埋点
function initAutoExposure() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const trackId = el.dataset.trackExposure;
        if (trackId && !el.__exposed) {
          el.__exposed = true; // 防止重复上报
          tracker.trackEvent('exposure', { element: trackId });
        }
      }
    });
  }, { threshold: 0.5 }); // 50% 可见才算曝光

  document.querySelectorAll('[data-track-exposure]').forEach(el => {
    observer.observe(el);
  });
}
\`\`\`

### Vue 指令封装

\`\`\`javascript
// v-track-click="'button_submit'"
app.directive('track-click', {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      tracker.trackClick(binding.value);
    });
  }
});

// v-track-exposure="'banner_001'"
app.directive('track-exposure', {
  mounted(el, binding) {
    exposureObserver.observe(el);
    el.dataset.trackExposure = binding.value;
  },
  unmounted(el) {
    exposureObserver.unobserve(el);
  }
});
\`\`\`

### 追问：埋点数据丢失率如何降低？

**答案：**
1. **sendBeacon**：页面卸载时用 sendBeacon 代替 XMLHttpRequest
2. **IndexedDB 缓存**：发送失败的数据存入 IndexedDB，下次访问时补发
3. **采样验证**：定期从后端数据反查前端是否有遗漏
4. **预防性 flush**：visibilitychange 事件触发时立即 flush`
  },
  {
    id: 1162,
    title: '你在 Kuikly 项目中处理了 iOS 和 Android 的字体渲染差异，请说明具体方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['字体渲染', '跨平台一致性', '字体适配', '文字排版'],
    content: `## 答案

iOS 和 Android 的默认字体和渲染引擎不同，导致同一份设计稿在两端的文字表现差异明显。

### 字体差异分析

| 特性 | iOS | Android |
|------|-----|---------|
| 默认中文字体 | PingFang SC | Noto Sans CJK / 厂商自定义 |
| 字重支持 | 9 级字重（100-900） | 通常只有 Regular/Bold |
| 行高计算 | 基于 ascent + descent | 基于 font metrics + extra padding |
| 文字截断 | 精确到像素 | 可能多留 1-2px |

### 解决方案

**1. 统一字体栈**

\`\`\`kotlin
// Kuikly 中定义统一字体
val commonFontFamily = FontFamily(
    Font(name = "PingFang SC", weight = FontWeight.Normal),   // iOS
    Font(name = "Noto Sans SC", weight = FontWeight.Normal),  // Android
    Font(name = "sans-serif", weight = FontWeight.Normal)     // fallback
)
\`\`\`

**2. 行高归一化**

\`\`\`kotlin
// iOS 和 Android 行高计算方式不同
// 统一使用行高倍数（如 1.5），而非固定像素值
@Composable
fun StyledText(text: String, fontSize: Int) {
    Text(
        text = text,
        style = TextStyle(
            fontSize = fontSize.sp,
            lineHeight = (fontSize * 1.5).sp,  // 使用倍数
            fontFamily = commonFontFamily,
            // Android 需要额外设置去除默认 padding
            platformStyle = PlatformTextStyle(
                includeFontPadding = false  // Android 特有
            )
        )
    )
}
\`\`\`

**3. 字重映射**

\`\`\`kotlin
// 设计稿标注 Medium(500)，Android 上没有 500 字重
// 需要做字重映射
fun adaptFontWeight(designWeight: Int): FontWeight {
    val platform = getPlatform()
    if (platform == Platform.ANDROID) {
        return when {
            designWeight <= 400 -> FontWeight.Normal   // 100-400 → Normal
            designWeight <= 600 -> FontWeight.Medium   // 500-600 → Medium
            else -> FontWeight.Bold                     // 700-900 → Bold
        }
    }
    return FontWeight(designWeight) // iOS 直接使用
}
\`\`\`

### 追问：文字截断（ellipsis）在两端表现不一致怎么办？

**答案：**
1. 不依赖系统默认截断，自己实现文字测量和截断逻辑
2. 使用 \`TextOverflow.Ellipsis\` + \`maxLines\` 确保两端行为一致
3. 对于关键文字（如价格、标题），预设最大字符数做二次保护
4. 如果仍有差异，通过平台判断微调字体大小（Android 减小 0.5sp）`
  },
  {
    id: 1163,
    title: '你在项目中实现了前端代码分割与路由懒加载，请说明分割策略和加载体验优化。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['代码分割', '懒加载', '预加载', 'webpack magic comments'],
    content: `## 答案

代码分割的目标是减少首屏加载体积，按需加载非首屏资源。

### 路由级懒加载

\`\`\`javascript
const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    // 访问率高的页面，预加载
    meta: { preload: true }
  },
  {
    path: '/report',
    // 访问率低的页面，不预加载
    component: () => import('@/views/Report.vue')
  }
];
\`\`\`

### 智能预加载策略

\`\`\`javascript
// 基于路由关系的预加载
router.afterEach((to) => {
  // 当前页面加载完成后，预加载相邻页面
  const adjacentRoutes = getAdjacentRoutes(to.path);
  adjacentRoutes.forEach(route => {
    if (route.component && typeof route.component === 'function') {
      // requestIdleCallback 在浏览器空闲时预加载
      requestIdleCallback(() => route.component());
    }
  });
});

// 基于用户行为的预加载
document.addEventListener('mouseover', (e) => {
  const link = e.target.closest('a[href]');
  if (link) {
    const route = router.resolve(link.getAttribute('href'));
    if (route.matched[0]?.components?.default) {
      const component = route.matched[0].components.default;
      if (typeof component === 'function') component();
    }
  }
}, { passive: true });
\`\`\`

### 组件级懒加载

\`\`\`javascript
// 大型组件（如 ECharts 图表、富文本编辑器）懒加载
const HeavyChart = defineAsyncComponent({
  loader: () => import('@/components/HeavyChart.vue'),
  loadingComponent: ChartSkeleton,  // 加载中显示骨架屏
  delay: 200,                       // 200ms 内加载完不显示 loading
  timeout: 10000,                   // 10s 超时
  errorComponent: LoadError         // 加载失败组件
});
\`\`\`

### 追问：懒加载的 chunk 加载失败怎么处理？

**答案：**
1. **自动重试**：\`import().catch(() => import())\` 重试一次
2. **版本不一致处理**：发版后旧 chunk 可能被删除，捕获 ChunkLoadError 后 \`location.reload()\` 强制刷新
3. **降级 UI**：显示"模块加载失败，请刷新页面"的友好提示
4. **上报**：Chunk 加载失败上报 Sentry，便于监控 CDN 问题`
  },
  {
    id: 1164,
    title: '你在 Node.js 服务中遇到过内存泄漏问题，请说明排查过程和解决方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['内存泄漏', 'Node.js', 'heapdump', '排查方法'],
    content: `## 答案

在 AIGC 平台的 Node Canvas 服务中，运行一段时间后内存持续增长，最终触发 OOM 重启。

### 排查过程

**第一步：确认内存泄漏**

\`\`\`javascript
// 定时打印内存使用
setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    rss: (mem.rss / 1024 / 1024).toFixed(2) + 'MB',      // 常驻内存
    heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2) + 'MB',
    heapTotal: (mem.heapTotal / 1024 / 1024).toFixed(2) + 'MB',
    external: (mem.external / 1024 / 1024).toFixed(2) + 'MB'
  });
}, 10000);
// 观察 heapUsed 是否持续增长不回落
\`\`\`

**第二步：生成 Heap Snapshot**

\`\`\`javascript
const v8 = require('v8');
const fs = require('fs');

// 每隔 5 分钟生成一次快照
function takeHeapSnapshot() {
  const snapshotStream = v8.writeHeapSnapshot();
  console.log('Heap snapshot written to', snapshotStream);
}
// 也可以通过 HTTP 接口触发
app.get('/debug/heap', (req, res) => {
  const file = v8.writeHeapSnapshot();
  res.json({ file });
});
\`\`\`

**第三步：Chrome DevTools 分析**

1. 打开 Chrome DevTools → Memory 面板
2. 加载两个时间点的 Heap Snapshot
3. 使用 Comparison 视图对比，找到增量最大的对象
4. 追溯 Retainers（引用链），找到泄漏的根引用

**第四步：定位根因**

发现是 Canvas 对象和 Image 对象没有正确释放：

\`\`\`javascript
// ❌ 泄漏代码
async function generatePreview(data) {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext('2d');
  const img = await loadImage(data.imageBuffer);
  ctx.drawImage(img, 0, 0);
  return canvas.toBuffer('image/png');
  // canvas 和 img 被闭包引用，无法 GC
}

// ✅ 修复：手动释放
async function generatePreview(data) {
  const canvas = createCanvas(1080, 1920);
  const ctx = canvas.getContext('2d');
  try {
    const img = await loadImage(data.imageBuffer);
    ctx.drawImage(img, 0, 0);
    const result = canvas.toBuffer('image/png');
    return result;
  } finally {
    // 手动释放原生资源
    canvas.width = 0;
    canvas.height = 0;
  }
}
\`\`\`

### 追问：还有哪些常见的 Node.js 内存泄漏场景？

**答案：**
1. **事件监听器未移除**：\`emitter.on\` 没有对应的 \`off\`
2. **全局缓存无上限**：Map/Object 无限增长，需要 LRU 或过期策略
3. **闭包引用大对象**：回调函数持有不再需要的大数组/Buffer
4. **定时器未清除**：\`setInterval\` 回调中引用了大对象
5. **Stream 未正确关闭**：可读流/可写流未调用 \`destroy()\``
  },
  {
    id: 1165,
    title: '你在项目中的性能优化取得了具体数据提升，请说明你是如何度量和证明优化效果的。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['性能度量', '性能基线', 'A/B测试', '数据驱动'],
    content: `## 答案

性能优化不能靠"感觉快了"，必须有数据支撑。

### 度量方法论

**1. 建立性能基线（优化前）**

\`\`\`javascript
// 在优化前持续采集 1-2 周的数据作为基线
const baselineMetrics = {
  LCP: { p50: 2800, p75: 3500, p95: 5200 },  // ms
  FCP: { p50: 1200, p75: 1800, p95: 2800 },
  TTI: { p50: 3200, p75: 4100, p95: 6000 },
  bundleSize: { js: 1.8, css: 0.3 },           // MB
  apiAvgTime: 450                               // ms
};
\`\`\`

**2. 定义优化目标**

\`\`\`javascript
const targets = {
  LCP_p75: '<= 2500ms',      // Core Web Vitals 标准
  FCP_p75: '<= 1800ms',
  bundleSize_js: '<= 1.2MB', // 减少 30%
  apiAvgTime: '<= 300ms'
};
\`\`\`

**3. 分维度对比**

\`\`\`javascript
// 按设备分组对比
function analyzeByDimension(beforeData, afterData) {
  const dimensions = ['device_type', 'network_type', 'os_version'];
  return dimensions.map(dim => {
    const grouped = groupBy(afterData, dim);
    return Object.entries(grouped).map(([group, data]) => ({
      dimension: dim,
      group,
      before: percentile(beforeData.filter(d => d[dim] === group), 75),
      after: percentile(data, 75),
      improvement: calculateImprovement(before, after)
    }));
  });
}
\`\`\`

### 具体案例：QQ 运动首页优化数据

| 指标 | 优化前（P75） | 优化后（P75） | 提升 |
|------|-------------|-------------|------|
| 首屏加载 | 3.5s | 1.2s | 65.7% |
| LCP | 2.8s | 1.5s | 46.4% |
| JS Bundle | 1.8MB | 0.9MB | 50% |
| 广告展示耗时 | 2.5s | 1.2s | 52% |

**优化措施与效果关联：**
- 骨架屏 + 缓存优先 → 首屏从 3.5s 降到 1.2s
- SDK 预加载 + 广告预请求 → 广告耗时从 2.5s 降到 1.2s
- Tree-shaking + 代码分割 → JS 从 1.8MB 降到 0.9MB

### 追问：如何确保优化效果不会在后续迭代中退化？

**答案：**
1. **CI 性能门禁**：每次 PR 自动检测 bundle size，超标则阻止合并
2. **性能预算**：设定各项指标的上限，超过自动告警
3. **定期性能报告**：每周自动生成性能趋势报告
4. **Lighthouse CI**：每次部署自动运行 Lighthouse，分数低于阈值则回滚`
  },
  {
    id: 1166,
    title: '你在 AIGC 平台中对接了多个 AI 模型接口，请说明 AI 模型调用的前端适配层设计。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['AI模型', '适配层', '策略模式', '流式响应'],
    content: `## 答案

AIGC 平台需要对接多个 AI 模型（文生图、图生图、超分辨率、风格迁移等），每个模型的 API 格式、参数结构、返回格式都不同，前端需要设计统一的适配层。

### 适配层架构

\`\`\`typescript
// 统一的 AI 任务接口
interface AITask {
  model: string;           // 模型标识
  input: AIInput;          // 统一输入格式
  options: AIOptions;      // 统一参数格式
  callback: AICallback;    // 统一回调格式
}

// 模型适配器基类
abstract class ModelAdapter {
  abstract transformInput(input: AIInput): any;
  abstract transformOutput(raw: any): AIOutput;
  abstract getEndpoint(): string;
  abstract getHeaders(): Record<string, string>;

  async execute(task: AITask): Promise<AIOutput> {
    const payload = this.transformInput(task.input);
    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const raw = await response.json();
    return this.transformOutput(raw);
  }
}

// 文生图模型适配器
class TextToImageAdapter extends ModelAdapter {
  transformInput(input) {
    return {
      prompt: input.text,
      negative_prompt: input.negativePrompt || '',
      width: input.width || 1024,
      height: input.height || 1024,
      num_inference_steps: input.quality === 'high' ? 50 : 30,
      guidance_scale: 7.5
    };
  }
  transformOutput(raw) {
    return {
      type: 'image',
      url: raw.images[0].url,
      metadata: { seed: raw.seed, model: raw.model_version }
    };
  }
  getEndpoint() { return '/api/ai/text2img'; }
  getHeaders() { return { 'Content-Type': 'application/json' }; }
}

// 模型工厂
class ModelFactory {
  private adapters = new Map();
  register(name, adapter) { this.adapters.set(name, adapter); }
  get(name) {
    const adapter = this.adapters.get(name);
    if (!adapter) throw new Error('未注册的模型: ' + name);
    return adapter;
  }
}

const factory = new ModelFactory();
factory.register('text2img', new TextToImageAdapter());
factory.register('img2img', new ImageToImageAdapter());
factory.register('upscale', new UpscaleAdapter());
\`\`\`

### 流式生成的前端处理

\`\`\`javascript
// 部分模型支持流式返回中间结果（如扩散模型每步出图）
async function streamGenerate(task, onProgress) {
  const adapter = factory.get(task.model);
  const response = await fetch(adapter.getEndpoint(), {
    method: 'POST',
    headers: adapter.getHeaders(),
    body: JSON.stringify(adapter.transformInput(task.input))
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        onProgress(adapter.transformOutput(data));
      }
    }
  }
}
\`\`\`

### 追问：如何处理不同模型的超时时间差异？

**答案：**
每个适配器配置自己的超时时间（文生图 60s、超分辨率 120s、风格迁移 30s），通过 AbortController 实现统一的超时控制。超时后展示"生成时间较长，请耐心等待"而非直接报错，同时后台继续轮询任务状态。`
  },
  {
    id: 1167,
    title: '你在卫盈智信实现了复杂表格编辑器（可编辑单元格），请说明技术方案和性能优化。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['可编辑表格', 'el-table', '单元格编辑', '批量操作'],
    content: `## 答案

金融系统中需要在表格内直接编辑数据（类似 Excel），支持单元格点击编辑、Tab 键切换、批量操作。

### 单元格编辑方案

\`\`\`vue
<template>
  <el-table :data="tableData" @cell-click="handleCellClick">
    <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label">
      <template #default="{ row, column, $index }">
        <!-- 编辑态 -->
        <div v-if="isEditing($index, col.prop)" class="cell-editor">
          <el-input
            v-if="col.type === 'text'"
            :ref="el => setCellRef(el, $index, col.prop)"
            v-model="row[col.prop]"
            size="small"
            @blur="finishEdit($index, col.prop)"
            @keydown.tab.prevent="moveToNextCell($index, col.prop)"
            @keydown.enter="finishEdit($index, col.prop)"
            @keydown.escape="cancelEdit($index, col.prop)"
          />
          <el-select v-else-if="col.type === 'select'"
            v-model="row[col.prop]" size="small"
            @change="finishEdit($index, col.prop)">
            <el-option v-for="opt in col.options" :key="opt.value"
              :label="opt.label" :value="opt.value" />
          </el-select>
        </div>
        <!-- 展示态 -->
        <div v-else class="cell-display" :class="{ editable: col.editable }">
          {{ formatCellValue(row[col.prop], col) }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const editingCell = ref({ row: -1, col: '' });
const originalValue = ref(null); // 用于取消编辑时恢复
const cellRefs = new Map();

function isEditing(rowIndex, colProp) {
  return editingCell.value.row === rowIndex && editingCell.value.col === colProp;
}

function handleCellClick(row, column, cell, event) {
  const col = columns.find(c => c.prop === column.property);
  if (!col?.editable) return;
  const rowIndex = tableData.value.indexOf(row);
  originalValue.value = row[col.prop]; // 备份原始值
  editingCell.value = { row: rowIndex, col: col.prop };
  nextTick(() => {
    const inputRef = cellRefs.get(\`\${rowIndex}_\${col.prop}\`);
    inputRef?.focus();
  });
}

function moveToNextCell(rowIndex, colProp) {
  const editableCols = columns.filter(c => c.editable);
  const colIdx = editableCols.findIndex(c => c.prop === colProp);
  if (colIdx < editableCols.length - 1) {
    // 同行下一列
    startEdit(rowIndex, editableCols[colIdx + 1].prop);
  } else if (rowIndex < tableData.value.length - 1) {
    // 下一行第一列
    startEdit(rowIndex + 1, editableCols[0].prop);
  }
}

function cancelEdit(rowIndex, colProp) {
  tableData.value[rowIndex][colProp] = originalValue.value;
  editingCell.value = { row: -1, col: '' };
}
</script>
\`\`\`

### 性能优化

\`\`\`javascript
// 1. 使用 shallowRef 避免深度响应式
const tableData = shallowRef([]);

// 2. 更新单行数据时用新数组触发更新，但不深度监听
function updateRow(index, data) {
  const newData = [...tableData.value];
  newData[index] = { ...newData[index], ...data };
  tableData.value = newData;
}

// 3. 批量编辑——收集所有变更，一次性提交
const pendingChanges = ref([]);
function finishEdit(rowIndex, colProp) {
  pendingChanges.value.push({
    rowId: tableData.value[rowIndex].id,
    field: colProp,
    oldValue: originalValue.value,
    newValue: tableData.value[rowIndex][colProp]
  });
  editingCell.value = { row: -1, col: '' };
}

// 定时或手动批量提交
async function submitChanges() {
  if (!pendingChanges.value.length) return;
  await api.post('/batch-update', { changes: pendingChanges.value });
  pendingChanges.value = [];
}
\`\`\`

### 追问：如何支持撤销/重做（Undo/Redo）？

**答案：**
维护一个操作历史栈，每次编辑推入 { rowId, field, oldValue, newValue }。撤销时取出最后一个操作并恢复 oldValue，重做时恢复 newValue。限制历史栈长度（如最多 50 步）防止内存占用过大。`
  },
  {
    id: 1168,
    title: '你在 QQ 运动中使用了 Service Worker 做离线缓存，请说明缓存策略的选择。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Service Worker', '离线缓存', 'Workbox', '缓存策略'],
    content: `## 答案

QQ 运动的部分页面需要在弱网/离线场景下也能访问（如查看历史步数、已缓存的活动页），Service Worker 是实现离线体验的核心技术。

### 缓存策略选择

\`\`\`javascript
// 使用 Workbox 管理 Service Worker
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// 1. 静态资源——Cache First（优先缓存，长效）
registerRoute(
  ({ request }) => request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 3600 }),
      new CacheableResponsePlugin({ statuses: [0, 200] })
    ]
  })
);

// 2. API 数据——Network First（优先网络，离线用缓存）
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5, // 5秒超时切缓存
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 3600 })
    ]
  })
);

// 3. 图片——Stale While Revalidate（先用缓存，后台更新）
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7 * 24 * 3600 })
    ]
  })
);

// 4. HTML 页面——Network First
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] })
    ]
  })
);
\`\`\`

### Service Worker 更新策略

\`\`\`javascript
// 注册时处理更新
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  // 检测到新版本时提示用户
  wb.addEventListener('waiting', () => {
    showUpdateNotification('发现新版本，点击刷新更新', () => {
      wb.messageSkipWaiting(); // 通知新 SW 立即接管
      window.location.reload();
    });
  });
  wb.register();
}
\`\`\`

### 追问：Service Worker 缓存了旧版本的 JS，导致用户一直使用旧版怎么办？

**答案：**
1. **版本化文件名**：打包时文件名带 hash（如 app.abc123.js），新版本是新文件不会命中旧缓存
2. **HTML 不缓存或 Network First**：HTML 入口文件走网络优先策略
3. **SW 更新提示**：检测到新 SW 时弹窗提示用户刷新
4. **强制更新**：在 SW 中设置版本号，版本不匹配时清空所有缓存`
  },
  {
    id: 1169,
    title: '你在 AIGC 平台的审核流程中实现了操作日志和审计追踪，请说明前端的实现方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['操作日志', '审计追踪', '拦截器', '数据合规'],
    content: `## 答案

金融和内容安全领域对操作审计有严格要求，每个关键操作都需要记录谁、在什么时间、做了什么。

### 前端操作日志采集

\`\`\`javascript
class AuditLogger {
  constructor() {
    this.queue = [];
    this.userId = '';
    this.sessionId = generateSessionId();
  }

  // 记录关键操作
  log(action, detail) {
    this.queue.push({
      action,
      detail,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      page: location.pathname,
      userAgent: navigator.userAgent
    });
    if (this.queue.length >= 5) this.flush();
  }

  async flush() {
    if (!this.queue.length) return;
    const logs = this.queue.splice(0);
    await api.post('/api/audit/logs', { logs }).catch(() => {
      // 发送失败存入 localStorage，下次补发
      const failed = JSON.parse(localStorage.getItem('audit_pending') || '[]');
      failed.push(...logs);
      localStorage.setItem('audit_pending', JSON.stringify(failed.slice(-100)));
    });
  }
}
\`\`\`

### Axios 拦截器自动记录 API 操作

\`\`\`javascript
axios.interceptors.request.use(config => {
  // 只记录写操作（POST/PUT/DELETE）
  if (['post', 'put', 'delete'].includes(config.method)) {
    config._auditId = generateId();
    auditLogger.log('api_request', {
      auditId: config._auditId,
      method: config.method.toUpperCase(),
      url: config.url,
      // 脱敏处理敏感字段
      params: maskSensitiveFields(config.data, ['password', 'idCard', 'phone'])
    });
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    if (response.config._auditId) {
      auditLogger.log('api_response', {
        auditId: response.config._auditId,
        status: response.status,
        success: true
      });
    }
    return response;
  },
  error => {
    if (error.config?._auditId) {
      auditLogger.log('api_response', {
        auditId: error.config._auditId,
        status: error.response?.status,
        success: false,
        error: error.message
      });
    }
    return Promise.reject(error);
  }
);
\`\`\`

### 敏感字段脱敏

\`\`\`javascript
function maskSensitiveFields(data, sensitiveKeys) {
  if (!data || typeof data !== 'object') return data;
  const masked = { ...data };
  for (const key of sensitiveKeys) {
    if (masked[key]) {
      masked[key] = '***MASKED***';
    }
  }
  return masked;
}
\`\`\`

### 追问：操作日志量很大，如何控制存储成本？

**答案：**
1. **日志分级**：关键操作（审核、删除、发布）永久保存，普通操作保留 90 天
2. **前端采样**：页面浏览等高频操作按 10% 采样
3. **批量压缩**：日志批量上传时 gzip 压缩
4. **冷热分离**：3个月以上的日志转存到冷存储（如 OSS）`
  },
  {
    id: 1170,
    title: '你在脚手架中实现了 Lerna Monorepo 的依赖管理，请说明包之间的依赖关系处理。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['Lerna', 'Monorepo', '依赖管理', '拓扑排序'],
    content: `## 答案

脚手架项目采用 Lerna Monorepo 管理多个包（cli-core、cli-init、cli-publish、cli-utils 等），包之间存在依赖关系。

### 包依赖关系

\`\`\`
cli (主入口)
├── cli-core (核心逻辑)
│   ├── cli-utils (工具函数)
│   └── cli-log (日志)
├── cli-init (初始化命令)
│   ├── cli-core
│   └── cli-utils
├── cli-publish (发布命令)
│   ├── cli-core
│   ├── cli-utils
│   └── cli-git (Git操作)
└── cli-git
    └── cli-utils
\`\`\`

### Lerna 的依赖处理

\`\`\`json
// packages/cli-init/package.json
{
  "name": "@my-cli/init",
  "dependencies": {
    "@my-cli/core": "^1.0.0",   // 内部包依赖
    "@my-cli/utils": "^1.0.0",
    "inquirer": "^9.0.0"         // 外部依赖
  }
}
\`\`\`

\`\`\`javascript
// lerna.json 配置
{
  "packages": ["packages/*"],
  "version": "independent",  // 各包独立版本号
  "command": {
    "publish": {
      "conventionalCommits": true,  // 基于 Commit 自动确定版本号
      "message": "chore(release): publish"
    },
    "bootstrap": {
      "hoist": true  // 公共依赖提升到根目录
    }
  }
}
\`\`\`

### 构建顺序——拓扑排序

\`\`\`javascript
// Lerna 自动处理拓扑排序，但理解原理很重要
function topologicalSort(packages) {
  const inDegree = new Map();
  const adj = new Map();

  // 初始化
  packages.forEach(pkg => {
    inDegree.set(pkg.name, 0);
    adj.set(pkg.name, []);
  });

  // 构建有向图
  packages.forEach(pkg => {
    const deps = Object.keys(pkg.dependencies || {})
      .filter(d => packages.some(p => p.name === d));
    deps.forEach(dep => {
      adj.get(dep).push(pkg.name);
      inDegree.set(pkg.name, inDegree.get(pkg.name) + 1);
    });
  });

  // BFS
  const queue = [...inDegree.entries()]
    .filter(([_, degree]) => degree === 0)
    .map(([name]) => name);
  const order = [];

  while (queue.length) {
    const current = queue.shift();
    order.push(current);
    adj.get(current).forEach(next => {
      inDegree.set(next, inDegree.get(next) - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    });
  }

  return order;
  // 结果：['cli-utils', 'cli-log', 'cli-core', 'cli-git', 'cli-init', 'cli-publish', 'cli']
}
\`\`\`

### 追问：Lerna 和 pnpm workspace 有什么区别？如果现在重做会选哪个？

**答案：**
现在会选 **pnpm workspace**：
1. pnpm 原生支持 workspace，不需要额外的 Lerna
2. pnpm 的硬链接机制节省磁盘空间
3. 严格的依赖隔离（phantom dependencies 问题解决）
4. Lerna 现已被 Nx 接管，社区活跃度不如 pnpm
5. Turborepo + pnpm 的组合可以替代 Lerna 的所有功能`
  },
  {
    id: 1171,
    title: '你在运营平台实现了前端 Excel 导入导出功能，请说明大数据量 Excel 的处理方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Excel', 'SheetJS', 'Web Worker', '流式处理'],
    content: `## 答案

运营人员经常需要导入/导出 Excel 数据（用户列表、活动数据、报表等），数据量可能达到数万行。

### 导出方案

\`\`\`javascript
import * as XLSX from 'xlsx';

async function exportToExcel(data, columns, fileName) {
  // 大数据量放到 Worker 中处理
  if (data.length > 5000) {
    return exportInWorker(data, columns, fileName);
  }

  // 小数据量直接处理
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(row => {
      const obj = {};
      columns.forEach(col => {
        obj[col.label] = formatExportValue(row[col.prop], col.type);
      });
      return obj;
    })
  );

  // 设置列宽
  worksheet['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '数据');
  XLSX.writeFile(workbook, \`\${fileName}_\${formatDate(new Date())}.xlsx\`);
}

// 格式化导出值
function formatExportValue(value, type) {
  switch (type) {
    case 'date': return value ? new Date(value).toLocaleDateString('zh-CN') : '';
    case 'money': return value ? Number(value).toFixed(2) : '0.00';
    case 'status': return statusMap[value] || value;
    default: return value ?? '';
  }
}
\`\`\`

### 导入方案（含校验）

\`\`\`javascript
async function importExcel(file, expectedColumns) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // 校验表头
      const headers = rawData[0];
      const missingCols = expectedColumns.filter(
        col => !headers.includes(col.label)
      );
      if (missingCols.length) {
        reject(new Error('缺少必要列：' + missingCols.map(c => c.label).join('、')));
        return;
      }

      // 解析数据行
      const data = rawData.slice(1).map((row, rowIndex) => {
        const obj = {};
        const errors = [];
        expectedColumns.forEach(col => {
          const colIndex = headers.indexOf(col.label);
          const value = row[colIndex];
          // 校验
          if (col.required && (value === undefined || value === '')) {
            errors.push(\`第\${rowIndex + 2}行"\${col.label}"不能为空\`);
          }
          obj[col.prop] = value;
        });
        return { data: obj, errors, rowIndex: rowIndex + 2 };
      });

      const allErrors = data.flatMap(d => d.errors);
      resolve({
        data: data.map(d => d.data),
        errors: allErrors,
        totalRows: data.length,
        errorRows: data.filter(d => d.errors.length > 0).length
      });
    };
    reader.readAsArrayBuffer(file);
  });
}
\`\`\`

### 追问：10 万行数据导出 Excel 时页面会卡顿，怎么优化？

**答案：**
1. **Web Worker**：将 XLSX 的序列化工作放到 Worker 线程
2. **流式生成**：使用 \`XLSX.stream\` API 分片处理
3. **后端导出**：超大数据量（>5万行）改为后端生成 Excel，前端下载文件
4. **进度反馈**：Worker 分批处理时通过 postMessage 报告进度百分比`
  },
  {
    id: 1172,
    title: '你在 QQ 运动中实现了页面间通信，Kuikly 页面与 H5 页面如何双向通信？',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['页面通信', 'JSBridge', 'postMessage', '跨页面'],
    content: `## 答案

QQ 运动中同时存在 Kuikly 原生页面和 H5 页面，两种页面需要互相传递数据（如用户信息、登录态、活动状态）。

### 通信架构

\`\`\`
Kuikly 页面 ←→ 原生 App 层 ←→ H5 WebView 页面
       ↕                            ↕
  KuiklyBridge                 JSBridge/postMessage
\`\`\`

### Kuikly → H5 通信

\`\`\`kotlin
// Kuikly 侧：通过原生方法向 WebView 发送消息
fun sendToH5(webViewId: String, eventName: String, data: Map<String, Any>) {
    val json = JSONObject(data).toString()
    // 通过原生层调用 WebView 的 JS
    NativeBridge.evaluateJavaScript(
        webViewId,
        "window.dispatchEvent(new CustomEvent('kuikly_message', { detail: $json }))"
    )
}
\`\`\`

\`\`\`javascript
// H5 侧：监听来自 Kuikly 的消息
window.addEventListener('kuikly_message', (e) => {
  const { type, payload } = e.detail;
  switch (type) {
    case 'user_info':
      updateUserInfo(payload);
      break;
    case 'activity_update':
      refreshActivityData(payload);
      break;
  }
});
\`\`\`

### H5 → Kuikly 通信

\`\`\`javascript
// H5 侧：通过 JSBridge 发送消息
function sendToKuikly(eventName, data) {
  if (window.KuiklyJSBridge) {
    // 原生 JSBridge
    window.KuiklyJSBridge.postMessage(JSON.stringify({
      event: eventName,
      data: data
    }));
  } else {
    // 降级方案：URL Scheme
    const url = \`kuikly://message?event=\${eventName}&data=\${encodeURIComponent(JSON.stringify(data))}\`;
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 100);
  }
}

// 使用
sendToKuikly('share_result', { success: true, platform: 'wechat' });
\`\`\`

### 统一通信封装

\`\`\`javascript
class CrossPageBridge {
  constructor() {
    this.handlers = new Map();
    this.initListeners();
  }

  initListeners() {
    // 监听来自 Kuikly 的消息
    window.addEventListener('kuikly_message', (e) => {
      const { type, payload, callbackId } = e.detail;
      const handler = this.handlers.get(type);
      if (handler) {
        const result = handler(payload);
        // 如果需要回调，返回结果给 Kuikly
        if (callbackId) {
          sendToKuikly('callback', { callbackId, result });
        }
      }
    });
  }

  // 注册消息处理器
  on(event, handler) {
    this.handlers.set(event, handler);
  }

  // 发送消息并等待回调
  sendWithCallback(event, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const callbackId = generateId();
      const timer = setTimeout(() => reject(new Error('通信超时')), timeout);
      this.on('callback_' + callbackId, (result) => {
        clearTimeout(timer);
        resolve(result);
      });
      sendToKuikly(event, { ...data, callbackId });
    });
  }
}
\`\`\`

### 追问：JSBridge 调用可能失败（原生未注入），如何做降级处理？

**答案：**
1. **能力检测**：调用前检查 \`window.KuiklyJSBridge\` 是否存在
2. **超时机制**：带回调的调用设置超时（5s），超时走降级逻辑
3. **功能降级**：如分享功能在 JSBridge 不可用时，降级为复制链接
4. **环境标记**：在 URL 参数中标记运行环境（kuikly/h5/browser），提前决定可用功能`
  },
  {
    id: 1173,
    title: '你在项目中实现了前端日志系统，请说明日志采集、分级和上报的设计方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['前端日志', '日志分级', '错误上报', '日志格式化'],
    content: `## 答案

前端日志系统不同于错误监控（Sentry），它关注的是**运行时的行为记录**，用于问题排查和行为分析。

### 日志分级

\`\`\`typescript
enum LogLevel {
  DEBUG = 0,  // 开发调试
  INFO = 1,   // 关键信息
  WARN = 2,   // 潜在问题
  ERROR = 3,  // 运行错误
  FATAL = 4   // 致命错误
}

class Logger {
  private level: LogLevel;
  private buffer: LogEntry[] = [];
  private maxBufferSize = 50;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  debug(tag: string, message: string, data?: any) {
    this.log(LogLevel.DEBUG, tag, message, data);
  }

  info(tag: string, message: string, data?: any) {
    this.log(LogLevel.INFO, tag, message, data);
  }

  warn(tag: string, message: string, data?: any) {
    this.log(LogLevel.WARN, tag, message, data);
  }

  error(tag: string, message: string, data?: any) {
    this.log(LogLevel.ERROR, tag, message, data);
    // ERROR 级别立即上报
    this.flush();
  }

  private log(level: LogLevel, tag: string, message: string, data?: any) {
    if (level < this.level) return;

    const entry: LogEntry = {
      level: LogLevel[level],
      tag,
      message,
      data: data ? safeStringify(data) : undefined,
      timestamp: new Date().toISOString(),
      url: location.href,
      userAgent: navigator.userAgent
    };

    // 开发环境输出到控制台
    if (import.meta.env.DEV) {
      const colors = { DEBUG: '#888', INFO: '#2196F3', WARN: '#FF9800', ERROR: '#F44336', FATAL: '#9C27B0' };
      console.log(
        \`%c[\${entry.level}] [\${tag}]\`,
        \`color: \${colors[entry.level]}; font-weight: bold\`,
        message, data || ''
      );
    }

    this.buffer.push(entry);
    if (this.buffer.length >= this.maxBufferSize) this.flush();
  }

  flush() {
    if (!this.buffer.length) return;
    const logs = this.buffer.splice(0);
    navigator.sendBeacon('/api/logs', JSON.stringify(logs));
  }
}

// 全局单例
export const logger = new Logger(
  import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN
);
\`\`\`

### 使用示例

\`\`\`javascript
// 业务代码中
logger.info('Payment', '用户发起支付', { orderId, amount });
logger.warn('Cache', '缓存已过期，使用降级数据');
logger.error('API', '接口调用失败', { url, status, message });
\`\`\`

### 追问：如何防止日志中泄露用户隐私数据？

**答案：**
1. **自动脱敏**：在 logger 内部对常见敏感字段（手机号、身份证、银行卡）自动正则替换
2. **白名单策略**：只允许记录预定义的字段，拒绝记录整个 response 对象
3. **数据分类**：区分普通日志和含 PII（个人可识别信息）的日志，分开存储
4. **合规审计**：定期审查日志内容，确保符合隐私保护法规`
  },
  {
    id: 1174,
    title: '你在决策引擎中实现了条件规则的可视化编辑，请说明条件表达式的解析和执行方案。',
    category: '简历深度',
    difficulty: 'hard',
    tags: ['条件表达式', '规则引擎', 'AST解析', '安全执行'],
    content: `## 答案

决策引擎的核心功能之一是让业务人员通过可视化界面配置规则条件（如"信用评分 >= 700 且 月收入 > 10000"），而非写代码。

### 条件数据结构

\`\`\`typescript
interface Condition {
  type: 'simple' | 'group';
  // simple 类型
  field?: string;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'between' | 'contains';
  value?: any;
  // group 类型
  logic?: 'and' | 'or';
  children?: Condition[];
}

// 示例：信用评分 >= 700 且 (月收入 > 10000 或 资产 > 500000)
const rule: Condition = {
  type: 'group',
  logic: 'and',
  children: [
    { type: 'simple', field: 'credit_score', operator: 'gte', value: 700 },
    {
      type: 'group',
      logic: 'or',
      children: [
        { type: 'simple', field: 'monthly_income', operator: 'gt', value: 10000 },
        { type: 'simple', field: 'total_assets', operator: 'gt', value: 500000 }
      ]
    }
  ]
};
\`\`\`

### 条件执行引擎

\`\`\`javascript
function evaluateCondition(condition, data) {
  if (condition.type === 'simple') {
    return evaluateSimple(condition, data);
  }
  if (condition.type === 'group') {
    const results = condition.children.map(child => evaluateCondition(child, data));
    return condition.logic === 'and'
      ? results.every(Boolean)
      : results.some(Boolean);
  }
  return false;
}

function evaluateSimple(condition, data) {
  const fieldValue = getNestedValue(data, condition.field);
  const targetValue = condition.value;

  switch (condition.operator) {
    case 'eq': return fieldValue === targetValue;
    case 'neq': return fieldValue !== targetValue;
    case 'gt': return Number(fieldValue) > Number(targetValue);
    case 'gte': return Number(fieldValue) >= Number(targetValue);
    case 'lt': return Number(fieldValue) < Number(targetValue);
    case 'lte': return Number(fieldValue) <= Number(targetValue);
    case 'in': return targetValue.includes(fieldValue);
    case 'between': return fieldValue >= targetValue[0] && fieldValue <= targetValue[1];
    case 'contains': return String(fieldValue).includes(String(targetValue));
    default: return false;
  }
}
\`\`\`

### 可视化编辑器组件

\`\`\`vue
<template>
  <div class="condition-editor">
    <!-- group 类型 -->
    <div v-if="condition.type === 'group'" class="condition-group">
      <el-radio-group v-model="condition.logic" size="small">
        <el-radio-button label="and">且</el-radio-button>
        <el-radio-button label="or">或</el-radio-button>
      </el-radio-group>
      <div v-for="(child, i) in condition.children" :key="i" class="child-condition">
        <ConditionEditor v-model="condition.children[i]" :fields="fields" />
        <el-button @click="removeChild(i)" icon="Delete" circle size="small" />
      </div>
      <el-button @click="addSimple" size="small">添加条件</el-button>
      <el-button @click="addGroup" size="small">添加条件组</el-button>
    </div>
    <!-- simple 类型 -->
    <div v-else class="condition-simple">
      <el-select v-model="condition.field" placeholder="选择字段">
        <el-option v-for="f in fields" :key="f.name" :label="f.label" :value="f.name" />
      </el-select>
      <el-select v-model="condition.operator" placeholder="操作符">
        <el-option v-for="op in getOperators(condition.field)" :key="op.value"
          :label="op.label" :value="op.value" />
      </el-select>
      <ValueInput v-model="condition.value" :field="getField(condition.field)" />
    </div>
  </div>
</template>
\`\`\`

### 追问：条件规则存储后需要在后端也执行一遍，前后端如何保证逻辑一致？

**答案：**
1. **共享数据结构**：前后端使用同一套 JSON Schema 定义条件结构
2. **相同算法实现**：两端都实现 \`evaluateCondition\` 函数，逻辑完全一致
3. **单元测试对齐**：同一份测试用例同时在前端（Vitest）和后端运行
4. **前端只做预判**：最终以后端执行结果为准，前端预判只用于 UI 反馈`
  },
  {
    id: 1175,
    title: '你在多个项目中使用 Axios 封装了统一的请求层，请说明完整的封装方案。',
    category: '简历深度',
    difficulty: 'medium',
    tags: ['Axios', '请求封装', '拦截器', '错误处理'],
    content: `## 答案

统一的请求层是前端项目的基础设施，需要处理认证、错误、重试、取消等各种场景。

### 完整封装

\`\`\`typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ElMessage } from 'element-plus';

class HttpClient {
  private instance: AxiosInstance;
  private pendingRequests = new Map<string, AbortController>();

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 1. 添加 Token
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = \`Bearer \${token}\`;

        // 2. 防止重复请求
        const requestKey = \`\${config.method}_\${config.url}_\${JSON.stringify(config.params)}\`;
        if (this.pendingRequests.has(requestKey)) {
          this.pendingRequests.get(requestKey)!.abort();
        }
        const controller = new AbortController();
        config.signal = controller.signal;
        this.pendingRequests.set(requestKey, controller);

        return config;
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        this.removePending(response.config);
        const { code, data, message } = response.data;
        if (code === 0) return data;
        // 业务错误
        if (code === 401) {
          this.handleUnauthorized();
          return Promise.reject(new Error('登录已过期'));
        }
        ElMessage.error(message || '请求失败');
        return Promise.reject(new Error(message));
      },
      (error: AxiosError) => {
        this.removePending(error.config);
        if (axios.isCancel(error)) return Promise.reject(error);
        // HTTP 错误处理
        const status = error.response?.status;
        const errorMessages: Record<number, string> = {
          400: '请求参数错误',
          403: '无权限访问',
          404: '资源不存在',
          500: '服务器内部错误',
          502: '网关错误',
          503: '服务暂不可用'
        };
        ElMessage.error(errorMessages[status!] || '网络异常，请稍后重试');
        return Promise.reject(error);
      }
    );
  }

  // Token 过期处理
  private handleUnauthorized() {
    localStorage.removeItem('token');
    // 避免多次弹窗
    if (!this._isRedirecting) {
      this._isRedirecting = true;
      ElMessage.warning('登录已过期，请重新登录');
      setTimeout(() => {
        window.location.href = '/login?redirect=' + encodeURIComponent(location.pathname);
        this._isRedirecting = false;
      }, 1500);
    }
  }

  // 带重试的请求
  async requestWithRetry<T>(config: AxiosRequestConfig, retries = 2): Promise<T> {
    for (let i = 0; i <= retries; i++) {
      try {
        return await this.instance.request<any, T>(config);
      } catch (error) {
        if (i === retries) throw error;
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
    throw new Error('重试次数已用尽');
  }

  get<T>(url: string, params?: any) {
    return this.instance.get<any, T>(url, { params });
  }

  post<T>(url: string, data?: any) {
    return this.instance.post<any, T>(url, data);
  }

  put<T>(url: string, data?: any) {
    return this.instance.put<any, T>(url, data);
  }

  delete<T>(url: string) {
    return this.instance.delete<any, T>(url);
  }
}

export const http = new HttpClient();
\`\`\`

### 追问：Token 刷新期间有多个请求同时发出，如何保证只刷新一次？

**答案：**
使用"请求队列"模式：第一个检测到 Token 过期的请求发起刷新，后续请求暂存到队列。刷新成功后用新 Token 重发队列中的所有请求。

\`\`\`javascript
let isRefreshing = false;
let refreshQueue = [];

if (code === 401 && !config._isRetry) {
  if (!isRefreshing) {
    isRefreshing = true;
    const newToken = await refreshToken();
    isRefreshing = false;
    refreshQueue.forEach(cb => cb(newToken));
    refreshQueue = [];
  }
  return new Promise(resolve => {
    refreshQueue.push((token) => {
      config.headers.Authorization = 'Bearer ' + token;
      config._isRetry = true;
      resolve(instance.request(config));
    });
  });
}
\`\`\``
  },
]
