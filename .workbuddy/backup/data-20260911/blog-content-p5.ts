// 技术博客 - 内容第5部分（脚手架扩展create命令+skill系统+三大项目总结+面试话术）
export default `
---

## 第四章：脚手架扩展功能 —— create 命令与 skill 系统

---

### 面试官：你提到了脚手架的扩展功能，create 命令是什么？和 init 有什么区别？

create 命令是我在原有脚手架基础上扩展的一个新功能，专门用于在已有项目中快速创建新页面。

**init vs create 的区别：**

| 维度 | init 命令 | create 命令 |
|---|---|---|
| 使用场景 | 从零创建新项目 | 在已有项目中创建新页面/组件 |
| 执行位置 | 空目录 | 已有项目的根目录 |
| 模板来源 | 完整的项目模板 | 页面级别的代码片段模板 |
| 输出内容 | 完整项目结构 | 单个页面的文件集合 |

**设计思路：**

在 QQ 运动项目中，每次新建一个 SSR 页面需要创建 5-6 个文件（路由配置、页面组件、数据获取逻辑、样式文件、类型定义等），而且这些文件有固定的模式。create 命令就是把这个过程自动化。

\`\`\`bash
# 使用示例
imooc-cli create page running-detail
# 自动生成：
# src/pages/running-detail/
#   ├── index.vue          # 页面组件
#   ├── server.ts          # 服务端数据获取
#   ├── types.ts           # 类型定义
#   ├── style.less         # 样式文件
#   └── config.ts          # 页面配置
# 自动更新：
#   src/router/index.ts    # 添加路由配置
#   src/server/pages.ts    # 注册 SSR 页面
\`\`\`

**核心实现：**

\`\`\`javascript
class CreateCommand extends Command {
  async exec() {
    // 1. 检查当前目录是否为有效项目
    this.checkProjectStructure();
    
    // 2. 交互式获取页面信息
    const pageInfo = await this.getPageInfo();
    
    // 3. 根据项目类型选择模板
    const template = this.getPageTemplate(pageInfo);
    
    // 4. 生成页面文件
    await this.generatePageFiles(template, pageInfo);
    
    // 5. 自动更新路由和配置
    await this.updateRouterConfig(pageInfo);
    await this.updateServerConfig(pageInfo);
    
    console.log('页面创建成功！');
  }
  
  async getPageInfo() {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'pageType',
        message: '请选择页面类型',
        choices: [
          { name: 'SSR 页面', value: 'ssr' },
          { name: 'CSR 页面', value: 'csr' },
          { name: '静态页面', value: 'static' },
        ],
      },
      {
        type: 'input',
        name: 'pageName',
        message: '请输入页面名称（kebab-case）',
        validate: (v) => /^[a-z][a-z0-9-]*$/.test(v),
      },
      {
        type: 'input',
        name: 'pageTitle',
        message: '请输入页面标题（中文）',
      },
      {
        type: 'confirm',
        name: 'needAuth',
        message: '是否需要登录态校验？',
        default: true,
      },
    ]);
  }
  
  async generatePageFiles(template, pageInfo) {
    const targetDir = path.resolve(
      process.cwd(), 'src/pages', pageInfo.pageName
    );
    
    // 创建目录
    fse.ensureDirSync(targetDir);
    
    // 生成各个文件
    for (const file of template.files) {
      const content = ejs.render(file.template, {
        ...pageInfo,
        className: kebabCase(pageInfo.pageName),
        componentName: pascalCase(pageInfo.pageName),
      });
      
      fs.writeFileSync(
        path.join(targetDir, file.name), 
        content
      );
    }
  }
  
  async updateRouterConfig(pageInfo) {
    const routerPath = path.resolve(process.cwd(), 'src/router/index.ts');
    let routerContent = fs.readFileSync(routerPath, 'utf-8');
    
    // 在路由配置中添加新页面
    const newRoute = \`
  {
    path: '/\${pageInfo.pageName}',
    name: '\${pageInfo.componentName}',
    component: () => import('../pages/\${pageInfo.pageName}/index.vue'),
    meta: { title: '\${pageInfo.pageTitle}', auth: \${pageInfo.needAuth} }
  },\`;
    
    routerContent = routerContent.replace(
      '// AUTO_GENERATED_ROUTES',
      newRoute + '\\n  // AUTO_GENERATED_ROUTES'
    );
    
    fs.writeFileSync(routerPath, routerContent);
  }
}
\`\`\`

**create 命令的设计亮点：**

1. **智能检测项目类型**：自动识别是 Vue 项目还是 React 项目，选择对应的模板
2. **自动更新配置**：不仅生成页面文件，还自动更新路由配置和服务端注册
3. **模板可扩展**：页面模板也是 npm 包，可以独立维护和更新
4. **防重复**：如果页面已存在，会提示用户确认是否覆盖

---

### 面试官：skill 系统是什么？能详细说说设计思路吗？

skill 系统是我设计的一个更高级的页面创建机制。如果说 create 命令是"创建单个页面"，那 skill 系统就是"创建一组相关的页面和功能"。

**设计背景：**

在 QQ 运动项目中，经常需要创建一组相关的页面。比如"跑步功能"包含：跑步准备页、跑步中页、跑步结束页、跑步历史页、跑步详情页。这 5 个页面有共同的数据模型、共享的组件、统一的状态管理。用 create 命令一个一个创建太慢了，而且容易遗漏关联配置。

**skill 的概念：**

一个 skill 就是一个"功能技能包"，包含：
- 多个页面模板
- 共享的组件模板
- 数据模型定义
- 状态管理模板
- 路由配置
- 接口定义

\`\`\`bash
# 使用示例
imooc-cli skill install running
# 自动生成跑步功能的完整代码结构：
# src/pages/running-prepare/    # 跑步准备页
# src/pages/running-active/     # 跑步中页
# src/pages/running-finish/     # 跑步结束页
# src/pages/running-history/    # 跑步历史页
# src/pages/running-detail/     # 跑步详情页
# src/components/running/       # 跑步相关组件
# src/store/running.ts          # 跑步状态管理
# src/api/running.ts            # 跑步接口定义
# src/types/running.ts          # 跑步类型定义
\`\`\`

**技术架构：**

\`\`\`
skill 系统架构
├── Skill Registry（技能注册中心）
│   ├── running-skill      # 跑步功能技能包
│   ├── ranking-skill      # 排行榜功能技能包
│   ├── checkin-skill      # 打卡功能技能包
│   └── calendar-skill     # 日历功能技能包
│
├── Skill Installer（技能安装器）
│   ├── 下载 skill 包（npm 包）
│   ├── 解析 skill 配置（skill.config.json）
│   ├── 生成文件（EJS 模板渲染）
│   ├── 安装依赖（如果 skill 需要额外的 npm 包）
│   └── 更新项目配置（路由、状态管理、接口注册）
│
└── Skill Config（技能配置）
    ├── pages: []          # 包含的页面列表
    ├── components: []     # 包含的组件列表
    ├── store: {}          # 状态管理配置
    ├── api: {}            # 接口配置
    ├── dependencies: {}   # 额外依赖
    └── hooks: {}          # 生命周期钩子（安装前/后执行的脚本）
\`\`\`

**skill.config.json 示例：**

\`\`\`json
{
  "name": "running-skill",
  "version": "1.0.0",
  "description": "跑步功能技能包",
  "pages": [
    {
      "name": "running-prepare",
      "title": "跑步准备",
      "template": "templates/prepare.vue.ejs",
      "type": "ssr",
      "auth": true
    },
    {
      "name": "running-active",
      "title": "跑步中",
      "template": "templates/active.vue.ejs",
      "type": "csr",
      "auth": true
    },
    {
      "name": "running-finish",
      "title": "跑步结束",
      "template": "templates/finish.vue.ejs",
      "type": "ssr",
      "auth": true
    }
  ],
  "components": [
    {
      "name": "RunningMap",
      "template": "templates/components/map.vue.ejs"
    },
    {
      "name": "RunningTimer",
      "template": "templates/components/timer.vue.ejs"
    }
  ],
  "store": {
    "name": "running",
    "template": "templates/store.ts.ejs"
  },
  "api": {
    "template": "templates/api.ts.ejs"
  },
  "dependencies": {
    "@amap/amap-jsapi-loader": "^1.0.1"
  },
  "hooks": {
    "postInstall": "echo '跑步功能安装完成！请配置地图 API Key'"
  }
}
\`\`\`

**Skill Installer 核心实现：**

\`\`\`javascript
class SkillInstaller {
  async install(skillName) {
    // 1. 从 npm 下载 skill 包
    const skillPkg = new Package({
      targetPath: path.resolve(homePath, '.imooc-cli', 'skills'),
      packageName: \`@imooc-cli/skill-\${skillName}\`,
      packageVersion: 'latest',
    });
    await skillPkg.install();
    
    // 2. 读取 skill 配置
    const config = require(
      path.resolve(skillPkg.getRootFilePath(), '../skill.config.json')
    );
    
    // 3. 检查冲突（是否有同名页面/组件）
    await this.checkConflicts(config);
    
    // 4. 生成所有页面
    for (const page of config.pages) {
      await this.generatePage(page, skillPkg);
    }
    
    // 5. 生成所有组件
    for (const component of config.components) {
      await this.generateComponent(component, skillPkg);
    }
    
    // 6. 生成状态管理
    if (config.store) {
      await this.generateStore(config.store, skillPkg);
    }
    
    // 7. 生成接口定义
    if (config.api) {
      await this.generateApi(config.api, skillPkg);
    }
    
    // 8. 安装额外依赖
    if (config.dependencies) {
      await this.installDependencies(config.dependencies);
    }
    
    // 9. 更新项目配置
    await this.updateProjectConfig(config);
    
    // 10. 执行 postInstall 钩子
    if (config.hooks?.postInstall) {
      await execAsync('sh', ['-c', config.hooks.postInstall]);
    }
  }
}
\`\`\`

**skill 系统的设计亮点：**

1. **功能级别的复用**：不是单个文件的复用，而是整个功能模块的复用
2. **配置驱动**：通过 JSON 配置描述功能结构，安装器自动生成代码
3. **依赖管理**：skill 可以声明额外的 npm 依赖，安装时自动处理
4. **生命周期钩子**：支持安装前后执行自定义脚本
5. **冲突检测**：安装前检查是否有同名文件，避免覆盖已有代码
6. **版本管理**：skill 本身也是 npm 包，支持版本更新

---

## 第五章：三大项目综合总结与面试话术

---

### 面试官：最后总结一下，这三个项目中你觉得最有价值的技术实践是什么？

我从三个维度来总结：

**架构设计维度：**

1. **BFF 层设计**（Node 项目）—— 解决了前后端协作的核心痛点，前端请求数减少 80%，开发效率提升 50%
2. **双引擎并存**（Kuikly 项目）—— 在技术演进过程中保持业务稳定，新旧引擎平滑过渡
3. **插件化架构**（脚手架项目）—— 动态加载 npm 包实现命令热更新，用户无感知升级

**性能优化维度：**

| 项目 | 优化措施 | 收益 |
|---|---|---|
| Node 项目 | 并发数据预取 | 首屏时间 50%↓ |
| Node 项目 | 页面配置缓存 | 配置加载 97%↓ |
| Node 项目 | 资源预加载 | FCP 30%↓ |
| Node 项目 | 虚拟滚动 | 万级列表流畅渲染 |
| Node 项目 | 轨迹点抽稀 | 地图渲染 50%↑ |
| Kuikly 项目 | keepAlive 机制 | Tab 切换 < 100ms |
| Kuikly 项目 | 多级缓存 | 首页加载 350ms |
| 脚手架项目 | 本地缓存 + 版本对比 | 非首次执行毫秒级 |

**工程化维度：**

1. **全链路监控**（Node 项目）—— 前端 Aegis + 后端 OpenTelemetry + 日志中心，TraceID 贯穿全链路
2. **自动化部署**（Node 项目）—— CI/CD 部署时间从 30 分钟降到 5 分钟
3. **Monorepo 管理**（脚手架项目）—— Lerna 统一版本发布，拓扑排序构建
4. **Git Flow 自动化**（脚手架项目）—— 一键完成从代码提交到线上部署

---

### 面试官：如果让你重新做这些项目，你会做哪些不同的选择？

这个问题我认真思考过：

**Node 项目：**
1. **SSR 框架选型**：可能会考虑 Nuxt 3 而非自建 SSR 框架，Nuxt 3 的 DX（开发体验）更好，社区生态更丰富
2. **缓存策略**：引入 Redis 做分布式缓存，而非只用内存缓存。内存缓存在多 Pod 场景下无法共享
3. **API 网关**：在 BFF 前面加一层 API 网关（如 Kong），统一处理限流、熔断、灰度等

**Kuikly 项目：**
1. **统一引擎**：尽早统一到 NTCompose 引擎，减少维护两套代码的成本
2. **状态管理**：引入更规范的状态管理方案（类似 Redux/MobX），而非散落在各个 Store 中
3. **自动化测试**：增加更多的 UI 自动化测试，目前测试覆盖率不够

**脚手架项目：**
1. **包管理工具**：用 pnpm workspace + changesets + turborepo 替代 Lerna
2. **插件系统**：设计更完善的插件系统（类似 Vite 插件），让第三方也能扩展脚手架功能
3. **TypeScript 重写**：整个项目用 TypeScript 重写，提升代码质量和可维护性

---

### 面试官：未来的技术演进方向是什么？

**Node 项目：**
- 🚀 **微前端架构**：页面独立部署，团队独立开发
- 🚀 **Serverless**：按需计费，自动扩缩容
- 🚀 **边缘计算**：CDN 边缘节点 SSR，延迟降低 80%
- 🚀 **AI 运动教练**：智能配速建议，运动姿态分析

**Kuikly 项目：**
- 🚀 **统一到 NTCompose**：逐步迁移旧页面
- 🚀 **性能监控升级**：更细粒度的性能指标采集
- 🚀 **动态化能力**：支持不发版更新 UI 和业务逻辑

**脚手架项目：**
- 🚀 **AI 辅助生成**：结合 LLM 自动生成页面代码
- 🚀 **可视化配置**：提供 Web UI 配置项目参数
- 🚀 **多团队协作**：支持多团队共享模板和 skill

---

### 面试话术速查

**被问"项目最大的亮点"时：**

> "我觉得最大的亮点是三个项目形成了一套完整的技术体系。Node 项目解决了服务端渲染和接口聚合的问题，Kuikly 项目解决了跨端一致性的问题，脚手架项目解决了研发效率的问题。三者结合，覆盖了从开发到部署的完整链路。如果要说单个技术亮点，Node 项目的 SSR 性能优化（首屏 600ms）和脚手架的动态加载 npm 包架构是最值得深入聊的。"

**被问"项目最难的地方"时：**

> "最难的有三块：一是 GPS 轨迹处理，iOS 和 Android 的接口差异巨大，加上信号不稳定导致的轨迹漂移，需要多层过滤和卡尔曼滤波来平滑。二是 Kuikly 的双引擎并存，两套渲染引擎的状态同步和生命周期管理非常复杂。三是脚手架的 Git 自动化异常处理，涉及本地操作、API 调用、远程交互三方，任何一步失败都需要正确回滚。"

**被问"你在项目中的角色"时：**

> "在 Node 项目中，我是技术负责人，负责整体架构设计、核心功能开发（SSR、GPS 轨迹、监控体系）和性能优化。在 Kuikly 项目中，我负责首页和排行榜模块的开发，以及健康数据授权体系的设计。在脚手架项目中，我是主要开发者，从架构设计到核心功能实现都是我完成的。"

**被问"学到了什么"时：**

> "最大的收获是理解了'工程化思维'。技术选型不是追新，而是根据业务场景选择最合适的方案。性能优化不是一次性的，而是持续的过程。架构设计要考虑可扩展性和可维护性，而不是只满足当前需求。另外，全链路监控的重要性怎么强调都不为过，没有监控的系统就是在裸奔。"

---

## 附录：技术栈清单

### Node 项目技术栈
- **后端**：Node.js v18.19.0 / Koa ^2.15.3 / TypeScript ^5.4.5 / PM2 / TRPC ^0.6.9
- **前端**：Vue 3 ^3.4.27 / Vite ^6.2.3 / Pinia ^2.1.7 / 腾讯地图 SDK
- **监控**：OpenTelemetry ^1.24.1 / Aegis / Winston
- **运维**：Docker / K8s / GitLab CI

### Kuikly 项目技术栈
- **语言**：Kotlin Multiplatform
- **框架**：Kuikly / NTCompose
- **状态管理**：observable / mutableStateOf
- **网络**：TRPC / QQRequest
- **监控**：Atta Reporter

### 脚手架项目技术栈
- **运行时**：Node.js
- **包管理**：Lerna Monorepo
- **命令行**：Commander.js / Inquirer.js
- **模板**：EJS
- **Git**：simple-git / GitHub API / Gitee API
- **构建**：WebSocket / Socket.io
- **存储**：阿里云 OSS

---

**全文完。** 感谢阅读！🎉

> 本文总计约 35,000 字，涵盖 QQ 运动 Node 服务端项目、QQ 运动 Kuikly 跨端项目、imooc-cli 脚手架工具三大核心项目的完整技术剖析。采用面试问答形式，力求让读者既能理解技术细节，又能感受到真实的工程决策过程。
`
