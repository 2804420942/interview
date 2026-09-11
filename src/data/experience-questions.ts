import type { Question } from './types'

export const experienceQuestions: Question[] = [
  {
    id: 901,
    title: '介绍一下你做过的最有挑战性的项目？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 介绍一下你做过的最有挑战性的项目？

**答案（结合简历）：**
最有挑战性的是**前端脚手架工具**项目。

**挑战点：**
1. **架构设计**：采用 Lerna Monorepo 管理多个包，需要合理划分包的职责和依赖关系
2. **云构建系统**：通过 WebSocket 实现实时通信，协调本地脚手架、云构建服务、阿里云 OSS 三方的交互
3. **可靠性保障**：publish 流程中需要处理 Git 冲突检测、网络异常、构建失败等各种异常情况
4. **性能优化**：通过子进程充分利用多核 CPU，模板文件缓存避免重复下载

**收获：** 深入理解了 Node.js 的进程管理、流式处理、WebSocket 通信，以及 CI/CD 的完整流程。

**追问：** 如果重新设计这个脚手架，你会做哪些改进？

**答案：**
1. 引入插件系统，让脚手架更易扩展（类似 Vite 插件）
2. 增加模板版本管理，支持模板升级
3. 优化错误提示，提供更友好的错误信息和修复建议
4. 增加单元测试覆盖率
5. 支持 monorepo 项目的初始化`,
    tags: ['项目经验', '脚手架', 'Monorepo', 'WebSocket']
  },
  {
    id: 902,
    title: '你是如何进行代码 Review 的？',
    category: '项目经验',
    difficulty: 'easy',
    content: `## 你是如何进行代码 Review 的？

**答案：**
**Review 关注点：**
1. **功能正确性**：逻辑是否正确，边界情况是否处理
2. **代码质量**：命名是否清晰，函数是否单一职责，是否有重复代码
3. **性能**：是否有明显的性能问题（不必要的重渲染、内存泄漏）
4. **安全性**：是否有 XSS 风险，敏感信息是否暴露
5. **可维护性**：是否有必要的注释，复杂逻辑是否有说明
6. **规范遵守**：是否符合团队代码规范

**Review 原则：**
- 对事不对人，提建议而非命令
- 给出具体的改进方案，而非只指出问题
- 区分必须修改和建议修改

**追问：** 如何处理 Code Review 中的分歧？

**答案：**
1. 先理解对方的出发点，可能有我不了解的背景
2. 用数据说话（性能测试、规范文档）
3. 如果是风格问题，遵循团队规范
4. 重大分歧可以拉更多人讨论，或找 Tech Lead 决策
5. 保持开放心态，承认自己可能是错的`,
    tags: ['Code Review', '团队协作', '代码质量']
  },
  {
    id: 903,
    title: '你是如何处理技术债务的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你是如何处理技术债务的？

**答案：**
**识别技术债务：**
1. 代码复杂度高（圈复杂度）
2. 测试覆盖率低
3. 过时的依赖
4. 重复代码
5. 性能瓶颈

**处理策略：**
1. **量化**：用工具（SonarQube、ESLint）量化技术债务
2. **优先级**：按影响范围和修复成本排序
3. **渐进式重构**：不做大爆炸式重写，在迭代中逐步改进（Boy Scout Rule：让代码比你发现时更好）
4. **争取时间**：向产品/管理层说明技术债务的业务影响
5. **防止新增**：通过 Code Review、ESLint 规则防止新的技术债务

**追问：** 你有没有主导过一次大规模重构？

**答案：**
在项目中主导了前端架构优化，将原有的混乱状态管理重构为规范的 Vuex 模块化架构，同时引入 ESLint + Prettier 统一代码风格，建立 Git Commit 规范。重构过程中采用渐进式策略，先在新功能中使用新架构，再逐步迁移旧代码，避免大规模改动带来的风险。`,
    tags: ['技术债务', '重构', '代码质量', 'SonarQube']
  },
  {
    id: 904,
    title: '你是如何学习新技术的？',
    category: '项目经验',
    difficulty: 'easy',
    content: `## 你是如何学习新技术的？

**答案：**
**学习路径：**
1. **官方文档**：最权威的来源，先看 Getting Started 和核心概念
2. **实践**：做一个小项目或在现有项目中尝试
3. **源码阅读**：理解底层原理，不只是会用
4. **社区**：GitHub Issues、Stack Overflow、掘金、知乎
5. **输出**：写博客或分享，加深理解（费曼学习法）

**追问：** 你最近学习了什么新技术？

**答案：**
最近在深入学习 Vue 3.4/3.5 的新特性（\`defineModel\`、\`useTemplateRef\`），以及 TypeScript 5.x 的新特性。同时关注 AI 辅助开发工具（GitHub Copilot、Cursor），探索如何提升开发效率。`,
    tags: ['学习方法', '费曼学习法', '技术成长']
  },
  {
    id: 905,
    title: '你是如何保证前端代码质量的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你是如何保证前端代码质量的？

**答案：**
**工具层面：**
1. **ESLint + Prettier**：代码规范和格式化
2. **TypeScript**：类型安全
3. **husky + lint-staged**：提交前自动检查
4. **单元测试**：Vitest/Jest，关键逻辑测试覆盖
5. **E2E 测试**：Playwright/Cypress，核心流程测试

**流程层面：**
1. **Code Review**：至少一人审查
2. **CI 检查**：自动化测试和 lint
3. **分支策略**：feature 分支开发，PR 合并

**文化层面：**
1. 团队共识的编码规范
2. 定期技术分享
3. 鼓励重构和改进

**追问：** 你们团队的测试覆盖率是多少？如何提升？

**答案：**
前端测试覆盖率通常较低，重点对工具函数、状态管理逻辑、复杂业务逻辑进行单元测试。UI 组件测试成本高，优先保证核心交互流程的 E2E 测试。逐步提升覆盖率，而非追求 100%（边际效益递减）。`,
    tags: ['代码质量', 'ESLint', 'TypeScript', '测试', 'CI/CD']
  },
  {
    id: 906,
    title: '你是如何与后端协作的？',
    category: '项目经验',
    difficulty: 'easy',
    content: `## 你是如何与后端协作的？

**答案：**
**接口设计阶段：**
1. 参与接口设计评审，从前端视角提出需求（分页、过滤、字段命名）
2. 使用 Swagger/OpenAPI 文档，前后端共同维护
3. 约定数据格式（统一的响应结构、错误码）

**开发阶段：**
1. **Mock 数据**：使用 Mock.js 或 Apifox 模拟接口，前后端并行开发
2. **接口联调**：使用代理解决跨域，及时沟通接口变更
3. **错误处理**：约定错误码含义，前端统一处理

**追问：** 如何处理前后端接口不一致的问题？

**答案：**
1. 建立接口文档（Apifox/Swagger），作为唯一真相来源
2. 接口变更需要通知前端，给出迁移时间
3. 前端做好接口适配层（adapter），隔离后端数据格式变化
4. 使用 TypeScript 定义接口类型，类型不匹配时编译报错`,
    tags: ['前后端协作', 'Mock', 'API文档', 'Swagger']
  },
  {
    id: 907,
    title: '你遇到过最难的 Bug 是什么？如何解决的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你遇到过最难的 Bug 是什么？如何解决的？

**答案：**
在跨端项目中，遇到过 iOS/Android 平台动画不一致的问题。

**问题描述：** 同一段动画代码，在 iOS 上流畅，在 Android 上出现卡顿和样式错位。

**排查过程：**
1. 先用性能监控确认问题存在（帧率数据）
2. 对比 iOS/Android 的渲染差异，发现 Android 对某些 CSS 属性的处理不同
3. 通过二分法缩小问题范围，定位到特定的动画属性
4. 查阅内部文档和 Android 渲染机制

**解决方案：** 针对 Android 平台使用不同的动画实现方式，建立平台差异适配层，并将解决方案文档化，避免团队其他成员踩坑。

**追问：** 你是如何建立自测流程的？

**答案：**
建立了多端自测 Checklist：
1. 功能测试：核心功能在 iOS/Android 两端验证
2. 性能测试：关键页面的加载时间、帧率
3. 边界测试：网络异常、数据为空、超长文本等
4. 兼容性测试：不同系统版本、不同屏幕尺寸`,
    tags: ['Bug排查', '跨端开发', '调试技巧', '二分法']
  },
  {
    id: 908,
    title: '你是如何进行前端性能监控的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 你是如何进行前端性能监控的？

**答案：**
建立了完善的性能监控上报体系：

**监控指标：**
1. **加载耗时**：从初始化到首屏渲染完成
2. **广告展示耗时**：广告请求到展示的时间
3. **关键性能指标**：LCP、FID、CLS

**实现方式：**
\`\`\`javascript
// 自定义性能标记
performance.mark('init_start')
// ... 初始化 ...
performance.mark('init_end')
performance.measure('init_load', 'init_start', 'init_end')

// 上报
const measure = performance.getEntriesByName('init_load')[0]
reportMetric({ name: 'init_load', value: measure.duration })
\`\`\`

**数据应用：** 建立性能基线，每次发版后对比数据，发现性能退化及时修复。

**追问：** 如何设置性能告警？

**答案：**
1. 设置性能指标阈值（如 LCP > 3s 告警）
2. 监控平台接收上报数据
3. 超过阈值时触发告警（邮件/企业微信）
4. 结合发版记录，快速定位是哪次发版引入的性能问题`,
    tags: ['性能监控', 'Performance API', 'LCP', 'Web Vitals']
  },
  {
    id: 909,
    title: '你是如何处理跨团队协作的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你是如何处理跨团队协作的？

**答案：**
**沟通层面：**
1. 明确需求文档，避免理解偏差
2. 定期同步进度，及时暴露风险
3. 接口变更提前通知，给对方足够的响应时间

**技术层面：**
1. 制定清晰的接口规范（API 文档、数据格式）
2. 版本化接口，避免破坏性变更
3. 建立共享的类型定义（TypeScript 类型包）

**追问：** 你是如何推动技术改进的？

**答案：**
1. **数据驱动**：用数据说明问题（性能数据、Bug 数量、开发效率）
2. **小步快跑**：先在一个小项目中验证，成功后推广
3. **降低成本**：提供完整的迁移方案和文档，降低团队的学习成本
4. **获得支持**：先说服 Tech Lead，再推广到团队`,
    tags: ['跨团队协作', '技术推动', '沟通']
  },
  {
    id: 910,
    title: '你对前端未来发展的看法？',
    category: '项目经验',
    difficulty: 'easy',
    content: `## 你对前端未来发展的看法？

**答案：**
**技术趋势：**
1. **AI 辅助开发**：Copilot、Cursor 等工具提升开发效率，但不会替代开发者
2. **WebAssembly**：高性能计算场景（图像处理、游戏、CAD）
3. **边缘计算**：Cloudflare Workers、Vercel Edge Functions
4. **跨端开发**：Flutter、React Native 等跨端方案持续演进
5. **低代码/无代码**：提升非技术人员的生产力，但复杂场景仍需专业开发

**追问：** 你认为 AI 会取代前端开发者吗？

**答案：**
不会完全取代，但会改变工作方式。AI 擅长重复性工作（样板代码、简单组件），但复杂的业务逻辑、系统架构设计、用户体验优化、跨团队协作仍需要人类。前端开发者需要提升的是：系统思维、业务理解、AI 工具使用能力，将精力集中在 AI 不擅长的高价值工作上。`,
    tags: ['前端趋势', 'AI', 'WebAssembly', '职业规划']
  },
  {
    id: 911,
    title: '你是如何做技术选型的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你是如何做技术选型的？

**答案：**
**评估维度：**
1. **技术成熟度**：社区活跃度、版本稳定性、长期维护
2. **团队熟悉度**：学习成本、现有技能匹配
3. **性能**：是否满足业务需求
4. **生态**：周边工具、插件、文档质量
5. **许可证**：开源协议是否符合商业使用

**决策过程：**
1. 明确需求和约束条件
2. 调研候选方案，做 POC（概念验证）
3. 对比优缺点，输出选型文档
4. 团队评审，达成共识

**追问：** 你是如何在 Vue 2 和 Vue 3 之间做选择的？

**答案：**
新项目直接选 Vue 3：Composition API 更好的逻辑复用、更好的 TypeScript 支持、更好的性能。旧项目迁移需要评估：依赖的第三方库是否支持 Vue 3、团队迁移成本、业务价值。对于大型旧项目，可以采用渐进式迁移（Vue 2.7 + Composition API 过渡）。`,
    tags: ['技术选型', 'POC', 'Vue2迁移Vue3']
  },
  {
    id: 912,
    title: '你是如何做前端安全防护的？',
    category: '项目经验',
    difficulty: 'hard',
    content: `## 你是如何做前端安全防护的？

**答案：**
**XSS 防护：**
1. Vue 模板默认转义，避免 \`v-html\` 使用用户输入
2. 使用 DOMPurify 对富文本内容进行 sanitize
3. 配置 CSP 响应头

**CSRF 防护：**
1. 使用 CSRF Token（axios 拦截器自动携带）
2. Cookie 设置 \`SameSite=Lax\`

**敏感信息保护：**
1. 不在前端存储敏感信息（密码、密钥）
2. HTTPS 传输
3. 敏感操作二次验证

**依赖安全：**
1. 定期运行 \`npm audit\`
2. 使用 Dependabot 自动更新依赖

**追问：** 如何防止前端代码被逆向？

**答案：**
完全防止是不可能的（浏览器必须能执行代码）。可以增加逆向难度：
1. 代码混淆（Terser、JavaScript Obfuscator）
2. 关键逻辑放在服务端
3. 接口鉴权（Token、签名）
4. 反调试技术（检测 DevTools 打开）`,
    tags: ['安全防护', 'XSS', 'CSRF', 'CSP', 'DOMPurify']
  },
  {
    id: 913,
    title: '你是如何做前端国际化的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你是如何做前端国际化的？

**答案：**
**技术方案：**
1. **vue-i18n**：管理语言包，支持插值、复数、日期格式化
2. **语言包管理**：按模块拆分语言包，避免单文件过大
3. **接口国际化**：请求头携带 \`Accept-Language\`，后端返回对应语言的数据
4. **动态切换**：切换语言时更新 \`i18n.locale\`，无需刷新页面

**注意事项：**
1. 文本不要硬编码，全部通过 \`$t()\` 引用
2. 日期、数字、货币格式化使用 \`Intl\` API
3. RTL（从右到左）语言的布局适配
4. 图片中的文字需要单独处理

**追问：** 如何管理大量的翻译文本？

**答案：**
1. 使用翻译管理平台（如 Crowdin、Lokalise），支持非技术人员翻译
2. 自动化提取：用工具扫描代码中的 \`$t()\` 调用，生成待翻译列表
3. CI 检查：确保所有语言包的 key 完整，没有遗漏翻译
4. 按模块拆分语言包，按需加载`,
    tags: ['国际化', 'vue-i18n', 'Intl API', 'RTL']
  },
  {
    id: 914,
    title: '你是如何做前端埋点的？',
    category: '项目经验',
    difficulty: 'medium',
    content: `## 你是如何做前端埋点的？

**答案：**
**埋点类型：**
1. **PV/UV**：页面访问量
2. **点击事件**：按钮点击、链接点击
3. **曝光事件**：元素进入视口（IntersectionObserver）
4. **性能数据**：LCP、FID、自定义指标
5. **错误数据**：JS 错误、接口错误

**实现方式：**
1. **手动埋点**：在关键位置调用上报函数，精确但维护成本高
2. **自动埋点**：通过 DOM 属性（\`data-track\`）自动收集，维护成本低但不够精确
3. **可视化埋点**：通过管理后台配置埋点，无需发版

**上报策略：**
- 实时上报：关键事件（支付、注册）
- 批量上报：普通行为数据，减少请求数
- 页面卸载时上报：使用 \`sendBeacon\`

**追问：** 如何保证埋点数据的准确性？

**答案：**
1. 去重：同一事件短时间内不重复上报（防抖）
2. 数据校验：上报前验证必填字段
3. 采样：高频事件按比例采样，减少数据量
4. 对账：定期与后端数据对比，发现异常`,
    tags: ['埋点', 'IntersectionObserver', 'sendBeacon', '数据上报']
  },
  {
    id: 915,
    title: '你的职业规划是什么？',
    category: '项目经验',
    difficulty: 'easy',
    content: `## 你的职业规划是什么？

**答案：**
**短期（1-2 年）：**
1. 深化前端技术深度，特别是性能优化、工程化、跨端开发
2. 提升系统设计能力，能够独立设计中大型前端系统
3. 扩展全栈能力，更好地理解整体技术架构

**中期（3-5 年）：**
1. 成为技术专家或 Tech Lead，带领团队解决复杂技术问题
2. 在某个垂直领域（如跨端开发、性能优化）建立深度
3. 参与开源项目，提升技术影响力

**长期：**
保持技术热情，持续学习，在技术和业务之间找到平衡，创造真正的用户价值。

**追问：** 你为什么选择前端方向？

**答案：**
前端是最直接影响用户体验的技术方向，能够快速看到自己工作的成果。同时前端技术栈广泛（UI、性能、工程化、跨端），有很大的深度和广度可以探索。随着 Web 技术的发展，前端的边界也在不断扩展（Node.js、WebAssembly、PWA），充满挑战和机遇。`,
    tags: ['职业规划', '技术成长', 'Tech Lead']
  },
  {
    id: 916,
    title: '请用STAR法则描述你在前端项目中遇到的最大技术挑战？',
    category: '面试项目',
    difficulty: 'hard',
    content: `## 请用STAR法则描述你在前端项目中遇到的最大技术挑战？

**答案（结合简历）：**
在前端职业生涯中，我遇到过两次极具挑战性的技术难题，分别涉及**大型前端框架升级**和**海量数据性能优化**，这两段经历让我对**前端架构设计**、**工程化实践**和**性能调优**有了深刻且体系化的理解，也直接推动我从一名业务开发者成长为能够主导技术方案设计的核心工程师。

---

### 📌 挑战一：QQ运动 H5 项目全链路技术栈升级（Vue2 → Vue3 + Vuex → Pinia + Webpack → Vite + CSR → SSR + JS → TS + 直连 CGI → BFF）

#### S（情境-Situation）

**项目背景与业务体量：**
QQ 运动是手 Q 内置的运动健康插件，承载亿级用户的步数记录、跑步轨迹、好友排行、签到打卡、活力值兑换等核心功能。我所在团队维护的 QQ 运动 H5 端在升级前已经迭代了 3 年多，覆盖 14 个 SSR 页面、20+ CGI 接口、5 个 TRPC 服务，前端代码超过 4.5 万行，日均 PV 1000 万+、UV 500 万+。

**老项目存在的多维问题（不只是 Vue2 老）：**
| 维度 | 升级前 | 痛点 |
|---|---|---|
| **框架** | Vue 2 + Options API | 单组件 2000+ 行，data/methods/computed 交错，逻辑无法跨组件复用 |
| **状态管理** | Vuex 3 | mutation/action 模板代码冗长，TS 类型推断弱，无法配合 SSR 注水 |
| **构建工具** | Vue CLI + Webpack 4 | 本地冷启动 3 分钟、HMR 2-3 秒、生产构建 12 分钟 |
| **渲染模式** | 纯 CSR | FCP 800ms、LCP 1500ms、TTI 2000ms，分享到 QQ/微信无预览，SEO 差 |
| **类型系统** | JavaScript（少量 .d.ts） | 前后端字段约定靠口头沟通，CGI 字段改名经常引发线上故障 |
| **后端架构** | 前端直连 20+ 个后端 CGI | 鉴权（GTK + PTLogin）逻辑散落各页面，接口聚合靠前端串行请求 |
| **包加载** | 单一 ES5 大包 | 现代浏览器也被迫加载所有 polyfill，Android 8 以下却又跑不动新语法 |
| **监控** | 仅有简单的 console + 错误邮件 | 线上问题靠用户反馈，TraceID 无法贯穿前后端，平均定位时间 1 天 |

**升级紧迫性：**
1. Vue2 在 2023 年底进入仅安全维护模式，新生态（Element Plus、Vite 5、Pinia）已不再适配
2. 业务侧抱怨首屏慢、白屏明显，分享到群里只看到一个 favicon，运营转化率上不去
3. 团队接入腾讯内部新一代监控（伽利略 OpenTelemetry + Aegis），老架构无法埋点
4. 用户体量大（DAU 500 万+），任何线上故障都会直接影响品牌口碑，**升级必须做到零事故**

#### T（任务-Task）

作为 QQ 运动 H5 端的前端技术负责人，我需要在不冻结业务迭代、不影响线上用户的前提下，主导完成一次**横跨框架/状态/构建/渲染/类型/架构/监控七个维度的整体升级**：

1. **框架与状态升级**：Vue 2 → Vue 3.4（Composition API + \`<script setup>\`），Vuex 3 → Pinia 2，并保证 SSR 状态可序列化注水
2. **构建工具升级**：Vue CLI/Webpack 4 → Vite 6 + esbuild，将冷启动从分钟级压到秒级
3. **渲染模式升级**：CSR → Vite SSR（Vue 3 \`renderToString\` + Pinia \`__INITIAL_STATE__\` 注水），首屏 SEO 友好
4. **后端架构升级**：前端直连 CGI → **Koa BFF 层**，统一登录态校验（GTK + PTLogin），TRPC 聚合后端微服务
5. **类型系统升级**：JavaScript 全量 → TypeScript 全栈，前后端通过 TRPC 自动推导类型，**零 \`any\`**
6. **包加载升级**：单包 → \`@vitejs/plugin-legacy\` 现代/兼容包双轨，配合 vendor 分包做长效缓存
7. **监控升级**：接入 Aegis（前端）+ OpenTelemetry/伽利略（后端）+ Winston，TraceID 贯穿全链路
8. **过程控制**：渐进式分批迁移、灰度发布、错误率自动回滚，**整个过程零 P0/P1 事故**

#### A（行动-Action）

**第一步：技术选型 & 风险评估（2 周）**

逐条对照 Vue 3、Vite、Pinia 的破坏性变更清单，盘出受影响的 API（不可能列全，列一些团队代码里真实命中的）：
- \`Vue.set\` / \`Vue.delete\` / \`Vue.prototype.xxx\` / \`filters\` / \`$listeners\` / \`EventBus\` 全部废弃
- 异步组件改用 \`defineAsyncComponent\`，函数式组件需重写为 \`<script setup>\`
- Vue Router 3 → 4：\`new Router({ mode })\` → \`createRouter({ history: createWebHistory() })\`，\`router.addRoutes\` → \`router.addRoute\`
- Vuex → Pinia：mutation 取消，setup store 直接用 ref/computed
- Webpack 别名/loader 链 → Vite 插件体系，CommonJS 依赖需要在 SSR 下做 \`noExternal\`

**第二步：构建工具：Webpack → Vite（贯穿前 4 周）**

直接放出最终生产配置（来自 \`website/vite.config.ts\` 的真实落地）：

\`\`\`typescript
import legacy from '@vitejs/plugin-legacy'
import { vitePluginEsBuild } from 'vite-plugin-esbuild'

export default defineConfig({
  plugins: [
    vue(),
    // 1. esbuild 做语法降级，比 Babel 快 10~100 倍
    vitePluginEsBuild({ target: 'chrome70', include: /\\.(vue|js|ts)$/ }),
    // 2. legacy 插件生成 SystemJS 兼容包，仅老 Android 加载
    legacy({ targets: ['Android >= 8'], modernPolyfills: true }),
  ],
  build: {
    rollupOptions: {
      output: {
        // 3. vendor 分包：vue + pinia 单独 hash，长效缓存
        manualChunks(id) {
          if (id.includes('/node_modules/pinia') || id.includes('/node_modules/vue')) return 'vendor'
        },
      },
    },
  },
})
\`\`\`

HTML 中 \`<script type="module">\` 与 \`<script nomodule>\` 自动分流，现代浏览器只加载 ESM 精简包，老 Android 才回退到 legacy 包，**vendor（Vue+Pinia ~110KB gzip）做长效缓存，业务迭代发版不需要重新下载**。

**第三步：CSR → Vite + Vue3 SSR（同步进行 6 周）**

SSR 是这次升级的"皇冠上的明珠"，单独画一下完整链路（这套流程后来沉淀进了团队的最佳实践）：

\`\`\`mermaid
sequenceDiagram
  participant U as 浏览器
  participant K as Koa BFF
  participant S as syncFunc(数据预取)
  participant R as Vue3 Renderer
  participant T as TRPC 微服务
  U->>K: GET /v3/page/run
  K->>K: 1. 路由匹配 + GTK/PTLogin 校验
  K->>S: 2. 加载页面配置(生产环境缓存)
  S->>T: 3. Promise.allSettled 并发预取
  T-->>S: 返回 pageData
  S-->>K: 返回 pageData
  K->>R: 4. renderToString(app)
  R-->>K: 返回 [appHtml, modules, piniaState]
  K->>K: 5. 注入 __INITIAL_STATE__ + preload links + Aegis SDK
  K-->>U: 完整 HTML
  U->>U: 6. Hydration: pinia.state.value = window.__INITIAL_STATE__
\`\`\`

几个关键设计点：
1. **Pinia 状态注水**：服务端 \`JSON.stringify(pinia.state.value)\` 序列化后注入 \`window.__INITIAL_STATE__\`，客户端 \`createApp\` 后第一时间用它恢复 store，**客户端不发起任何二次请求即可渲染完整页面**
2. **数据预取并发化**：\`Promise.allSettled\` 替代串行 await，单接口失败不影响整页渲染，**TTFB 从 800ms 降到 300ms**
3. **页面配置缓存**：生产环境 \`PageCache[configPath]\` 缓存模板/render/syncFunc，从 150ms 降到 5ms（**97%↓**）
4. **Hydration 不匹配修复**：时间戳改用服务端传递、随机数改用固定 key、浏览器特有 API 一律放进 \`onMounted\`

**第四步：状态管理：Vuex 3 → Pinia 2（4 周）**

Pinia 的 setup store 写法天然适配 SSR 注水（每个请求 \`createPinia()\` 出一个新实例，杜绝跨请求状态污染），同时干掉了 Vuex 一堆 mutation 模板代码：

\`\`\`typescript
// store/main.ts —— Pinia setup store，TS 类型自动推导
export const useMainStore = defineStore('main', () => {
  const entryPageData = ref<IEntryPageData>({} as IEntryPageData)
  const isBlock = ref(false)
  // SSR 服务端：把 syncFunc 取到的 pageData 写进 store
  const remoteDataHandler = (pageData: IRenderRunPageData) => {
    entryPageData.value = pageData.entryPageData
    isBlock.value = pageData.isBlock
  }
  return { entryPageData, isBlock, remoteDataHandler }
})
\`\`\`

**第五步：直连 CGI → Koa BFF + TRPC（5 周，与 SSR 同步）**

这是被严重低估的"升级"——它把前端从"调 20 个零散 CGI"中解放出来：

\`\`\`typescript
// 统一的 TRPC 转发入口：所有前端请求都走 BFF
router.all('/(v2|v3)/trpc/:action/:cmd', cgiMetricReportMiddleware, async (ctx) => {
  const { action, cmd } = ctx.params
  const requestData = { ...ctx.query, ...ctx.request.body }
  const response = await publicTrpcRequest.request(action, cmd, requestData, { ctx })
  ctx.body = response
})

// 公共前置中间件：注入 uin/skey/pskey/qqversion/client_ip 等鉴权头
export const commonBeforeHandler = async (req, opts) => {
  const ctx = req.requestOptions?.ctx
  return {
    data: { ...req.requestData, uin: user.getUin(), skey: ctx.cookies.get('skey'), pskey: ctx.cookies.get('p_skey') },
    options: { ...opts, context: { uid: String(user.getUin()), sig: ctx.cookies.get('p_skey'), client_ip: transIPv6ToIPv4(ctx.ip) } }
  }
}
\`\`\`

收益是结构性的：**登录态校验集中、接口聚合、数据裁剪、TS 类型前后端共享**，前端开发再也不用在 Vue 组件里手写 GTK 计算和 PTLogin 鉴权。

**第六步：JS → TS 全栈 + 类型自动推导（贯穿全程）**

通过 TRPC 的 \`UserServerProxy.GetUserInfo\` 自动生成的类型文件，前端调用接口的入参/返回值由 IDE 直接推导，**老项目里的 \`any\` 从 60%+ 降到 0%**。

**第七步：多进程 + 全链路监控（最后 3 周）**

\`\`\`
PM2 Master
├── TSW Worker 1 → Koa Server 1
├── TSW Worker 2 → Koa Server 2
├── TSW Worker 3 → Koa Server 3
└── TSW Worker 4 → Koa Server 4
\`\`\`

- **多进程**：4 核 4 Worker，进程隔离 + 零停机 \`pm2 reload\`，可用性 99.99%
- **前端监控**：Aegis SDK 自动采集 FCP/LCP/CLS、JS 错误、接口测速、SPA 路由
- **后端监控**：OpenTelemetry 自动插桩 TRPC + HTTP，TraceID 透传到前端 Aegis，**前后端用同一个 TraceID 拼接调用链**
- **日志**：Winston 按日期轮转，错误日志单独保留 14 天，对接日志中心

**第八步：渐进式上线 & 灰度回滚（贯穿全程）**

按页面而非按代码模块切流量，14 个 SSR 页面分 5 批灰度：内网 → 5% → 10%（3 天观察）→ 50% → 100%。每批绑定 Aegis 错误率基线，**超过 0.01% 自动通过 GitLab CI 回滚到上一个 Tag 镜像**，回滚 1 分钟内完成。

#### R（结果-Result）

**性能指标（升级前 vs 升级后，全部为线上真实数据）：**

| 指标 | 升级前 | 升级后 | 改善 |
|---|---|---|---|
| **首屏时间** | 1200ms | **600ms** | **50%↓** |
| **FCP** | 800ms | **300ms** | **62%↓** |
| **LCP** | 1500ms | **600ms** | **60%↓** |
| **TTI** | 2000ms | **800ms** | **60%↓** |
| **CLS** | 0.18 | **0.05** | **72%↓** |
| **包体积** | 500KB | **200KB** | **60%↓** |
| **本地冷启动** | 3 分钟 | **<5 秒** | **97%↓** |
| **HMR** | 2-3 秒 | **<200ms** | **93%↓** |
| **生产构建** | 12 分钟 | **3 分钟** | **75%↓** |

**稳定性 & 工程效率：**

| 指标 | 数值 |
|---|---|
| 服务可用性 | **99.99%**（升级前 99.5%） |
| 平均响应时间 | **50ms**（升级前 200ms+） |
| P99 响应时间 | **200ms** |
| 错误率 | **0.01%**（升级前 0.3%） |
| 部署时间 | 30 分钟 → **5 分钟**（83%↓） |
| 部署成功率 | 90% → **99%** |
| 回滚时间 | 10 分钟 → **1 分钟** |
| 问题定位时间 | 1 天 → **小时级**（TraceID 全链路） |
| TS 类型覆盖率 | 35% → **92%** |
| Vuex/Options API 大组件（>500 行） | 数量减少 **60%** |

**业务结果：**
- 历时 4 个月平稳完成，**零 P0/P1 事故**
- 分享到 QQ/微信首次有了完整 OG 预览，运营页转化率提升约 18%
- 该套 "Vite + Vue3 SSR + Koa BFF + TRPC + 全链路 TraceID" 方案沉淀为团队最佳实践，**被复制到另外 3 个同级业务**

**面试官追问：** 为什么不一次性全量升级，而是渐进式？

**答案：** 渐进式升级的核心是**风险控制 + 业务连续性**：
1. **代码量约束**：4.5 万行前端 + 14 个 SSR 页面 + 20+ CGI，一次性改造至少要冻结需求 4 个月，业务方不可能接受
2. **测试覆盖盲区**：大型项目必然有测试覆盖不到的边缘场景（实测到第 2 批就发现了 Android 8 以下 Proxy 兼容问题），渐进式让我们只在 5% 流量内 hotfix，而不是 P0 回滚
3. **团队学习曲线**：Composition API、Pinia、SSR Hydration、BFF/TRPC 对团队是全新心智模型，分批让大家有时间消化
4. **技术验证**：每批灰度都能拿到真实的 FCP/LCP/错误率数据，反过来指导后续批次，比如第一批观察到 SSR Hydration 不匹配后，我们在第二批前就补齐了"时间戳/随机数/浏览器 API"三条规则

---

### 📌 挑战二：AIGC素材库项目海量数据性能优化

#### S（情境-Situation）

**项目背景：**
AIGC（AI Generated Content）项目是团队为QQ个性化装扮业务打造的智能化素材生产平台。系统每周通过AI算法和自动化流水线批量生成主题皮肤、头像挂件、聊天气泡、动态背景等个性化素材，运营同学可以在后台审核后上架到C端供用户购买和使用。

**问题爆发：**
经过半年多的运行，素材库中的有效素材数量从初期的几百个增长到**超过12000个**，且每周仍以200-300个的速度递增。C端素材选择页面（用户挑选头像挂件的场景）开始出现严重的性能问题：

1. **首屏加载极慢**：页面加载时需要一次性请求全部素材的元数据（JSON约3.5MB），DomContentLoaded时间达到8-12秒
2. **滚动严重卡顿**：下拉滚动时frame丢帧严重，帧率从稳定的60fps暴跌到15-20fps，手指滑动时画面"一卡一卡"
3. **内存持续膨胀**：Chrome任务管理器显示该页面内存占用高达800MB+，在部分低配置安卓机上直接触发浏览器闪退
4. **交互无响应**：点击素材预览、筛选分类等操作，UI响应延迟超过1秒

**技术背景：**
页面原始实现使用传统的\`v-for\` 列表渲染，一次性将所有素材卡片插入DOM。每个卡片包含：高清预览图（200x200）、素材名称、价格标签、热度标识、分类徽章、使用按钮等丰富元素。12000个卡片意味着DOM节点数超过**50000个**（每个卡片约4-5个div嵌套 + 图片 + 文本节点）。

#### T（任务-Task）

作为该项目的性能优化负责人，我需要：
1. **将首屏加载时间从10秒级压缩到1秒以内**，提升用户留存率
2. **解决滚动卡顿问题**，确保60fps流畅体验
3. **将内存占用控制在200MB以内**，适配中低端机型
4. **保持现有交互功能完整**（拖拽排序、分类筛选、搜索、实时预览）
5. **建立可复用的性能优化方案**，供团队其他大数据量页面参考

#### A（行动-Action）

**第一步：性能瓶颈定位与分析（1周）**

使用Chrome DevTools进行系统性能剖析：

1. **Performance面板分析**：
   - 发现\`Recalculate Style\` 和\`Layout\` 阶段占据了主线程70%的时间
   - 大量DOM节点导致Style Calculation复杂度呈指数级增长
   - 滚动时触发频繁的重排（Reflow），因为卡片高度不固定（图片异步加载导致高度变化）

2. **Memory面板分析**：
   - 堆内存中 detached DOM tree 数量异常，组件销毁后DOM引用未释放
   - 图片解码后的Bitmap数据常驻内存，大量不可见的图片也占据了GPU显存

3. **Network面板分析**：
   - 首屏发起12000个微小图片请求（即使图片懒加载库已接入，但实现有缺陷）
   - 3.5MB的JSON元数据未做压缩和分页

4. **自定义性能埋点**：
   在关键路径插入Performance.mark/markMeasure：
   \`\`\`javascript
   performance.mark('list-render-start')
   // ... 渲染逻辑
   performance.mark('list-render-end')
   performance.measure('list-render', 'list-render-start', 'list-render-end')
   \`\`\`
   数据表明：纯DOM渲染耗时占总耗时的68%，是最大瓶颈。

**第二步：虚拟列表核心实现（2周）**

决定自研虚拟列表方案而非使用现成库（如vue-virtual-scroller），原因是：
1. 素材卡片高度不固定（受图片比例、文字长度影响），需要动态高度计算
2. 需要支持多列网格布局（grid布局），而非简单的单列列表
3. 需要集成拖拽排序功能，与虚拟化逻辑深度耦合

核心实现设计：

\`\`\`typescript
// composables/useVirtualGrid.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface VirtualGridOptions {
  itemCount: number
  itemHeight: number        // 估算高度
  overscan: number          // 视口外预渲染数量
  containerHeight: number
  columns: number           // 网格列数
}

export function useVirtualGrid(options: VirtualGridOptions) {
  const scrollTop = ref(0)
  const measuredHeights = new Map<number, number>() // 缓存实际测量高度

  // 计算可见范围
  const visibleRange = computed(() => {
    const { overscan, containerHeight, itemHeight, columns } = options
    const totalRows = Math.ceil(options.itemCount / columns)

    // 起始行索引
    const startRow = Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
    // 结束行索引
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop.value + containerHeight) / itemHeight) + overscan
    )

    return {
      startIndex: startRow * columns,
      endIndex: Math.min((endRow + 1) * columns - 1, options.itemCount - 1),
      startRow,
      endRow
    }
  })

  // 总高度（用于滚动条）
  const totalHeight = computed(() => {
    // 动态高度累加
    let height = 0
    const totalRows = Math.ceil(options.itemCount / options.columns)
    for (let i = 0; i < totalRows; i++) {
      height += measuredHeights.get(i) || options.itemHeight
    }
    return height
  })

  // 测量并缓存实际高度
  const measureItem = (rowIndex: number, el: HTMLElement) => {
    const height = el.getBoundingClientRect().height
    if (measuredHeights.get(rowIndex) !== height) {
      measuredHeights.set(rowIndex, height)
    }
  }

  // 滚动位置缓存（支持返回定位）
  const saveScrollPosition = () => {
    sessionStorage.setItem('aigc-scroll', String(scrollTop.value))
  }

  const restoreScrollPosition = () => {
    const saved = sessionStorage.getItem('aigc-scroll')
    if (saved) scrollTop.value = Number(saved)
  }

  return {
    scrollTop,
    visibleRange,
    totalHeight,
    measureItem,
    saveScrollPosition,
    restoreScrollPosition
  }
}
\`\`\`

关键技术点：
1. **动态高度测量**：首次渲染时使用估算高度，真实DOM渲染后通过\`ResizeObserver\` 回调更新缓存，解决图片异步加载导致的高度跳变
2. **双缓冲预渲染**：视口上下各预留2行（overscan=2）不可见内容，避免快速滚动时出现白屏
3. **滚动位置恢复**：利用sessionStorage保存用户滚动位置，返回页面时精准定位

**第三步：图片懒加载与资源管理（1周）**

\`\`\`typescript
// composables/useLazyImage.ts
import { ref, onUnmounted } from 'vue'

export function useLazyImage() {
  const imageCache = new Map<string, HTMLImageElement>()
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        if (src && !img.src) {
          img.src = src
          img.removeAttribute('data-src')
        }
      }
    })
  }, { rootMargin: '100px' }) // 提前100px触发加载

  const register = (el: HTMLImageElement) => {
    if (el.dataset.src) {
      observer.observe(el)
    }
  }

  const unregister = (el: HTMLImageElement) => {
    observer.unobserve(el)
  }

  onUnmounted(() => observer.disconnect())

  return { register, unregister }
}
\`\`\`

同时引入\`requestIdleCallback\` 进行图片资源回收：
\`\`\`javascript
// 在空闲时清理远离视口的图片资源
const gcScheduler = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback((deadline) => {
      while (deadline.timeRemaining() > 0 && gcQueue.length > 0) {
        const img = gcQueue.shift()
        if (img && !img.isInViewport) {
          img.src = placeholderBase64 // 替换为占位图
        }
      }
      gcScheduler()
    }, { timeout: 2000 })
  }
}
\`\`\`

**第四步：智能排序与前端筛选优化（3天）**

原始排序逻辑是后端返回全量数据后前端用Array.sort处理，12000条数据的排序在主线程执行耗时超过200ms，阻塞UI。

优化方案：
1. **Web Worker异步排序**：将排序算法移至Worker线程，利用多核CPU并行处理
2. **索引预计算**：对常用筛选条件（热度、价格、上架时间）建立排序索引，切换时直接使用预排序结果
3. **防抖+节流**：搜索框输入防抖300ms，滚动事件节流16ms（60fps对齐）

\`\`\`typescript
// workers/sort.worker.ts
self.onmessage = (e) => {
  const { data, sortBy, order } = e.data
  const sorted = quickSort(data, (a, b) => {
    if (sortBy === 'heat') return (b.heatScore - a.heatScore) * order
    if (sortBy === 'price') return (a.price - b.price) * order
    if (sortBy === 'time') return (new Date(b.createTime) - new Date(a.createTime)) * order
    return 0
  })
  self.postMessage({ sorted })
}
\`\`\`

**第五步：数据分页与元数据压缩（3天）**

1. **分页加载**：将12000条元数据分为20页（每页600条），首屏仅加载第一页
2. **JSON压缩**：使用MessagePack替代原生JSON，数据体积从3.5MB压缩到1.2MB
3. **增量同步**：后续页面滚动到接近底部时预加载下一页，体验上实现"无限滚动"
4. **IndexedDB本地缓存**：将素材元数据缓存到IndexedDB，二次访问时直接读取本地，减少网络请求

\`\`\`typescript
// utils/db.ts
import { openDB } from 'idb'

const dbPromise = openDB('aigc-store', 1, {
  upgrade(db) {
    db.createObjectStore('materials', { keyPath: 'id' })
    db.createObjectStore('metadata', { keyPath: 'key' })
  }
})

export async function getCachedMaterials() {
  const db = await dbPromise
  return db.getAll('materials')
}

export async function saveMaterials(materials: any[]) {
  const db = await dbPromise
  const tx = db.transaction('materials', 'readwrite')
  const store = tx.objectStore('materials')
  materials.forEach(m => store.put(m))
  await tx.done
}
\`\`\`

**第六步：内存泄漏排查与优化（2天）**

通过Chrome Memory工具的Heap Snapshot对比分析，发现并修复了以下内存泄漏点：

1. **事件监听器未释放**：Vue组件卸载时，Window的scroll事件监听器没有正确移除
   - 修复：改用\`useEventListener\` 组合式函数，自动处理onUnmounted时的清理
2. **图片Blob URL未释放**：动态生成的Blob URL在组件销毁后仍持有引用
   - 修复：在onUnmounted中统一\`URL.revokeObjectURL\`
3. **第三方库实例未销毁**：Lightbox预览组件的全局单例在关闭后未调用destroy
   - 修复：封装为Vue组件生命周期管理的模式
4. **深响应式数据**：素材元数据被包成深响应式对象，Vue3的Proxy递归监听导致大量性能开销
   - 修复：使用\`shallowRef\` / \`shallowReactive\` 替代\`ref\` / \`reactive\`，仅对需要UI响应的字段做精细化响应式

#### R（结果-Result）

**量化成果：**
1. **首屏加载时间**：从平均10.2s降低至**680ms**，提升**15倍**
2. **滚动帧率**：从15-20fps稳定到**60fps**，交互卡顿彻底消除
3. **内存占用**：从800MB+降低到**140MB**，减少**82.5%**，低配置设备不再闪退
4. **DOM节点数**：从50000+个控制在**120个以内**（视口内可见的卡片数量）
5. **交互响应**：素材点击预览响应时间从1200ms降至**80ms**

**业务价值：**
1. 用户页面停留时长提升45%（卡顿感降低后用户更愿意浏览更多素材）
2. 素材购买转化率提升12%（流畅的预览体验促进了购买决策）
3. 客服反馈的"页面卡住"类投诉归零

**团队推广：**
该优化方案沉淀为《前端大数据量渲染优化实践》内部技术文档，并在部门技术分享会上做了专题宣讲。后续被复用到：
- QQ表情商店（8000+表情）
- 主题装扮市场（30000+主题）
- 动态壁纸库（5000+视频壁纸）
三个项目中，均取得显著的优化效果。

**面试官追问：** 虚拟列表和分页懒加载有什么区别？为什么选择虚拟列表？

**答案：** 两者可以结合使用，解决的问题维度不同。
1. **分页懒加载**：解决的是**数据量**问题，减少一次性请求和存储的数据总量，适合无限滚动的信息流场景。但它不能解决DOM节点过多的问题，如果用户不断加载，DOM节点会持续累积
2. **虚拟列表**：解决的是**DOM渲染**问题，无论总数据量多大，视口内只渲染固定数量的DOM节点，从根上解决渲染性能瓶颈

在我的场景中，两个技术都用到了：后端数据用分页懒加载（每页600条），前端渲染用虚拟列表（只渲染视口内的20-30个卡片）。虚拟列表是必须的，因为即使只做分页，用户每页加载后如果回滚到第一页，所有DOM节点依然存在于内存中。虚拟列表+分页的组合才是完整的性能解决方案。

---

### 📈 能力提升与方法论沉淀

#### 一、架构设计能力
1. **风险可控的大型重构方法论**：通过QQ运动Vue升级，我建立了一套\`评估→试点→推广→沉淀\`的渐进式重构四步法，适用于任何大型系统的平滑演进
2. **兼容层/适配器模式实践**：深刻理解了在工程实践中，\`适配器模式\`不是教科书上的设计模式，而是保障系统平滑演进的救命稻草。兼容层的存在让团队有机会逐步替换旧逻辑，而非冒险全量梭哈
3. **技术债务管理意识**：学会了用\`技术雷达\`工具（ThoughtWorks开源）定期评估团队技术栈的\`采用/试验/评估/淘汰\`状态，避免技术债务积累到无法收拾

#### 二、性能优化体系化思维
1. **完整的性能调优方法论**：从AIGC项目提炼出\`监控定位→瓶颈分析→方案设计→AB验证→效果量化\`五步优化法
2. **浏览器渲染原理深度理解**：通过实践真正理解了主线程阻塞、重排重绘、合成层、 painter 等概念不是面试八股，而是直接影响用户体验的工程问题
3. **性能指标量化意识**：所有优化必须配合Performance API和线上监控埋点，用数据说话。首屏时间、INP（Interaction to Next Paint）、CLS（Cumulative Layout Shift）等Core Web Vitals指标成为我评判页面质量的核心标准

#### 三、技术决策与权衡能力
1. **方案选型框架**：在两个项目中都面临\`自研 vs 开源\`、\`渐进式 vs 全量式\`的选择。我形成了\`评估矩阵\`决策法，从\`开发成本\`、\`维护成本\`、\`性能上限\`、\`团队熟悉度\`、\`生态支持\`五个维度打分，帮助团队做出更理性的技术决策
2. **短期收益与长期收益的平衡**：脚手架init方法投入1周开发时间，但后续每个新项目节省2天搭建时间，ROI在3个月内回正。这种\`投资回报率\`意识帮助我更好地争取到技术重构的资源支持

#### 四、工程化与团队协作视野
1. **自动化测试是重构的底气**：没有自动化测试覆盖的重构就是裸奔。Vue升级项目中，单元测试+视觉回归测试+灰度监控的三层保护网，是敢做大型重构的根基
2. **技术方案的可复用性**：两个项目的核心产出（Router Adapter、虚拟列表hook）都封装成了独立的npm包供团队复用，真正做到了\`解决一次，收益长期\`
3. **技术影响力建设**：通过技术文档、内部分享、最佳实践沉淀，将个人经验转化为团队知识，建立了在前端团队中的技术权威，后续在推动技术决策时更容易获得信任和支持`,
    tags: ['STAR法则', '项目经验', 'Vue2升级Vue3', '性能优化', '虚拟列表', '渐进式升级', '技术挑战', '面试项目']
  },
]