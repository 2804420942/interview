import type { Question } from './types'

export const engineeringQuestions: Question[] = [
  {
    id: 501,
    title: 'Webpack 的构建流程是什么？',
    category: 'Webpack',
    difficulty: 'hard',
    content: `## Webpack 的构建流程是什么？

**答案：**

1. **初始化**：读取 \`webpack.config.js\`，合并参数，创建 \`Compiler\` 对象
2. **加载插件**：调用所有 Plugin 的 \`apply\` 方法，注册生命周期钩子
3. **确定入口**：从 \`entry\` 开始
4. **编译模块**：递归解析依赖，对每个模块用对应 Loader 转换
5. **完成编译**：得到每个模块的转换后内容和依赖关系
6. **输出资源**：将模块组合成 Chunk，生成 bundle 文件
7. **写入文件**：将 bundle 写入 \`output\` 目录

**追问：** Webpack 的 \`Compiler\` 和 \`Compilation\` 的区别？

**答案：**
- \`Compiler\`：代表整个 Webpack 构建过程，全局唯一，包含配置信息和生命周期钩子
- \`Compilation\`：代表一次具体的编译，每次文件变化（watch 模式）都会创建新的 Compilation，包含当前的模块、chunk、资源等`,
    tags: ['Webpack', '构建流程', 'Compiler', 'Compilation'],
  },
  {
    id: 502,
    title: 'Loader 和 Plugin 的区别？如何手写一个 Loader？',
    category: 'Webpack',
    difficulty: 'hard',
    content: `## Loader 和 Plugin 的区别？如何手写一个 Loader？

**答案：**

- **Loader**：文件转换器，将非 JS 文件转换为 JS 模块，链式调用（从右到左），同步或异步
- **Plugin**：扩展器，监听 Webpack 生命周期钩子，执行更复杂的任务（打包优化、资源管理）

**手写 Loader：**

\`\`\`javascript
// my-loader.js
module.exports = function(source) {
  // source 是文件内容字符串
  const result = source.replace(/console\\.log\\(.*?\\);?/g, '');
  return result;
};
// 异步 Loader
module.exports = function(source) {
  const callback = this.async();
  someAsyncOperation(source, (err, result) => {
    callback(err, result);
  });
};
\`\`\`

**追问：** Loader 的执行顺序是什么？

Loader 从右到左（从下到上）执行：
\`\`\`javascript
use: ['style-loader', 'css-loader', 'sass-loader']
// 执行顺序：sass-loader → css-loader → style-loader
\`\`\``,
    tags: ['Webpack', 'Loader', 'Plugin'],
  },
  {
    id: 503,
    title: '如何手写一个 Webpack Plugin？',
    category: 'Webpack',
    difficulty: 'hard',
    content: `## 如何手写一个 Webpack Plugin？

**答案：**

Plugin 是一个有 \`apply(compiler)\` 方法的类：

\`\`\`javascript
class MyPlugin {
  constructor(options) { this.options = options; }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
      compilation.assets['version.json'] = {
        source: () => JSON.stringify({ version: '1.0.0', buildTime: Date.now() }),
        size: () => 50
      };
      callback();
    });
  }
}
\`\`\`

**追问：** Webpack 有哪些常用的生命周期钩子？

- \`compiler.hooks.beforeRun\`：运行前
- \`compiler.hooks.compile\`：开始编译
- \`compiler.hooks.emit\`：输出文件前（可以修改输出内容）
- \`compiler.hooks.afterEmit\`：输出文件后
- \`compiler.hooks.done\`：编译完成
- \`compilation.hooks.optimizeChunks\`：优化 chunk`,
    tags: ['Webpack', 'Plugin', '生命周期'],
  },
  {
    id: 504,
    title: 'Webpack 的代码分割（Code Splitting）有哪些方式？',
    category: 'Webpack',
    difficulty: 'medium',
    content: `## Webpack 的代码分割有哪些方式？

**答案：**

1. **入口点分割**：配置多个 \`entry\`，手动分割
2. **动态导入**：\`import()\` 语法，Webpack 自动分割
3. **SplitChunksPlugin**：自动提取公共模块

\`\`\`javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}
\`\`\`

**追问：** \`splitChunks\` 的 \`chunks: 'all'\` 和 \`'async'\` 的区别？

- \`'async'\`（默认）：只对异步 chunk（动态 import）进行分割
- \`'all'\`：对同步和异步 chunk 都进行分割，可以提取更多公共代码
- \`'initial'\`：只对同步 chunk 进行分割`,
    tags: ['Webpack', 'Code Splitting', 'SplitChunks'],
  },
  {
    id: 505,
    title: 'Vite 的工作原理是什么？为什么比 Webpack 快？',
    category: '构建工具',
    difficulty: 'hard',
    content: `## Vite 的工作原理是什么？为什么比 Webpack 快？

**开发环境：**
- 不打包，利用浏览器原生 ESM 支持
- 启动时只预构建第三方依赖（esbuild，极快）
- 浏览器请求哪个模块，Vite 才按需编译（懒编译）
- HMR 只更新变化的模块，不重新打包

**生产环境：**
- 使用 Rollup 打包（更好的 Tree Shaking 和代码分割）

**为什么快：**
1. esbuild 用 Go 编写，比 JS 工具快 10-100 倍
2. 按需编译，不需要提前打包所有模块
3. HMR 与项目大小无关

**追问：** Vite 的预构建（Pre-bundling）是什么？

Vite 启动时用 esbuild 预构建 \`node_modules\` 中的依赖：
1. **CommonJS 转 ESM**：浏览器不支持 CommonJS，需要转换
2. **合并模块**：将有大量内部模块的包合并为单个文件，减少请求数
3. **缓存**：预构建结果缓存在 \`node_modules/.vite\``,
    tags: ['Vite', 'ESM', 'esbuild', '预构建'],
  },
  {
    id: 506,
    title: '什么是 Tree Shaking？如何确保它生效？',
    category: '构建工具',
    difficulty: 'medium',
    content: `## 什么是 Tree Shaking？如何确保它生效？

**答案：**

Tree Shaking 是打包时删除未使用代码（dead code）的优化技术，基于 ES Module 的静态分析。

**确保生效的条件：**
1. 使用 ES Module（\`import/export\`），不用 CommonJS
2. 在 \`package.json\` 中设置 \`"sideEffects": false\`
3. 使用支持 Tree Shaking 的打包工具（Webpack 4+、Rollup、Vite）
4. 生产模式（\`mode: 'production'\`）

**追问：** 什么是 \`sideEffects\`？

有副作用的模块是指导入时会执行一些影响全局状态的代码（如 polyfill、CSS 导入）。如果 \`sideEffects: false\`，打包工具认为所有模块都没有副作用，可以安全地删除未使用的导入。如果有副作用的文件被错误标记，可能导致功能丢失。`,
    tags: ['Tree Shaking', 'sideEffects', 'ESM'],
  },
  {
    id: 507,
    title: '什么是 Monorepo？Lerna 和 pnpm workspace 的区别？',
    category: '包管理',
    difficulty: 'medium',
    content: `## 什么是 Monorepo？

Monorepo 是将多个相关项目放在同一个代码仓库中管理的策略。

**优势：**
1. 代码共享方便，无需发布 npm 包
2. 统一的工具链和配置
3. 原子提交（跨包的修改在一个 commit 中）
4. 依赖统一管理，避免版本冲突

**Lerna vs pnpm workspace：**
- **Lerna**：专注于版本管理和发布，功能丰富，但较重
- **pnpm workspace**：原生支持，性能好（硬链接节省磁盘），依赖管理更严格，现代项目推荐

**追问：** pnpm 相比 npm/yarn 有什么优势？

1. **节省磁盘空间**：使用硬链接，相同版本的包只存储一份
2. **安装速度快**：并行安装，利用缓存
3. **严格的依赖隔离**：不允许访问未声明的依赖（幽灵依赖问题）
4. **原生 workspace 支持**：Monorepo 支持更好`,
    tags: ['Monorepo', 'Lerna', 'pnpm', 'workspace'],
  },
  {
    id: 508,
    title: '什么是 ESLint？如何配置？',
    category: '代码质量',
    difficulty: 'easy',
    content: `## 什么是 ESLint？如何配置？

ESLint 是 JavaScript 代码检查工具，通过规则检测代码质量和风格问题。

\`\`\`javascript
// .eslintrc.js
module.exports = {
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase']
  }
}
\`\`\`

**追问：** ESLint 和 Prettier 如何配合使用？

ESLint 负责代码质量（逻辑错误、最佳实践），Prettier 负责代码格式（缩进、引号、分号）。

配合方案：
1. \`eslint-config-prettier\`：关闭 ESLint 中与 Prettier 冲突的格式规则
2. \`eslint-plugin-prettier\`：将 Prettier 作为 ESLint 规则运行
3. 或者分开运行：ESLint 检查质量，Prettier 格式化，互不干扰`,
    tags: ['ESLint', 'Prettier', '代码规范'],
  },
  {
    id: 509,
    title: '什么是 Git Commit 规范？',
    category: '代码质量',
    difficulty: 'easy',
    content: `## 什么是 Git Commit 规范？

常用 Conventional Commits：
\`\`\`
<type>(<scope>): <subject>
\`\`\`

**type 类型：**
- \`feat\`：新功能
- \`fix\`：修复 bug
- \`docs\`：文档更新
- \`style\`：代码格式（不影响功能）
- \`refactor\`：重构
- \`perf\`：性能优化
- \`test\`：测试
- \`chore\`：构建/工具变更
- \`revert\`：回滚

**工具：** \`commitizen\`（交互式提交）、\`commitlint\`（提交信息校验）、\`husky\`（Git hooks）

**追问：** 如何用 husky 强制执行 commit 规范？

\`\`\`bash
npm install husky commitlint @commitlint/config-conventional -D
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
\`\`\``,
    tags: ['Git', 'Commit', 'commitlint', 'husky'],
  },
  {
    id: 510,
    title: '什么是 CI/CD？前端 CI/CD 流程是什么？',
    category: 'CI/CD与部署',
    difficulty: 'medium',
    content: `## 什么是 CI/CD？前端 CI/CD 流程是什么？

- **CI（持续集成）**：代码提交后自动运行测试、代码检查，确保代码质量
- **CD（持续部署/交付）**：CI 通过后自动部署到目标环境

**前端 CI/CD 流程：**
1. 开发者推送代码到远程仓库
2. 触发 CI（Jenkins/GitLab CI）：ESLint 检查 → 单元测试
3. 通过后执行构建（npm run build）
4. 将构建产物部署到目标服务器/CDN

**追问：** 如何实现多环境部署？

1. 不同分支对应不同环境（\`develop\` → 测试，\`main\` → 生产）
2. 使用环境变量文件（\`.env.development\`、\`.env.production\`）
3. CI 平台注入敏感配置（密钥、数据库连接）
4. 打包时通过 \`--mode\` 参数指定环境`,
    tags: ['CI/CD', 'Jenkins', '自动化部署'],
  },
  {
    id: 511,
    title: '什么是 Rollup？和 Webpack 的区别？',
    category: '构建工具',
    difficulty: 'medium',
    content: `## 什么是 Rollup？和 Webpack 的区别？

Rollup 是专注于 ES Module 的打包工具，主要用于库的打包。

| | Webpack | Rollup |
|--|---------|--------|
| 定位 | 应用打包 | 库打包 |
| Tree Shaking | 支持 | 更好（原生 ESM） |
| 代码分割 | 强大 | 基本支持 |
| HMR | ✅ | ❌（需插件） |
| 输出格式 | 主要 CommonJS | ESM/CJS/UMD/IIFE |

Vite 生产环境使用 Rollup，因为 Rollup 的 Tree Shaking 更彻底，输出更干净。

**追问：** 什么时候选择 Rollup，什么时候选择 Webpack？

- **Rollup**：开发 npm 库、组件库，需要输出多种格式
- **Webpack**：开发 Web 应用，需要 HMR、复杂的代码分割`,
    tags: ['Rollup', 'Webpack', '对比'],
  },
  {
    id: 512,
    title: '什么是 source map？有哪些类型？',
    category: '构建工具',
    difficulty: 'medium',
    content: `## 什么是 source map？有哪些类型？

Source Map 是打包后代码到源代码的映射文件，用于调试时定位到原始代码位置。

**Webpack 中的类型（常用）：**
- \`eval\`：最快，不生成 .map 文件，行号不准确
- \`eval-source-map\`：开发环境推荐，行列准确，重建速度快
- \`source-map\`：生产环境，生成独立 .map 文件，最完整
- \`hidden-source-map\`：生成 .map 但不在 bundle 中引用
- \`nosources-source-map\`：有映射但不包含源代码

**追问：** 生产环境是否应该部署 source map？

不应该公开部署（会暴露源代码）。推荐方案：
1. 生成 source map 但不上传到 CDN
2. 上传到错误监控平台（Sentry），用于线上错误定位
3. 或使用 \`hidden-source-map\``,
    tags: ['Source Map', 'Webpack', '调试'],
  },
  {
    id: 513,
    title: '什么是 babel？如何配置？',
    category: '构建工具',
    difficulty: 'medium',
    content: `## 什么是 babel？如何配置？

Babel 是 JavaScript 编译器，将新版 JS 语法转换为兼容旧浏览器的代码。

**工作流程：** 解析（Parse）→ 转换（Transform）→ 生成（Generate）

\`\`\`javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: '> 0.25%, not dead',
      useBuiltIns: 'usage',
      corejs: 3
    }],
    '@babel/preset-typescript'
  ],
  plugins: ['@babel/plugin-transform-runtime']
}
\`\`\`

**追问：** \`@babel/preset-env\` 和 \`@babel/plugin-transform-runtime\` 的区别？

- \`@babel/preset-env\`：根据目标浏览器转换语法，通过 \`useBuiltIns\` 注入 polyfill（会污染全局）
- \`@babel/plugin-transform-runtime\`：将 helper 函数和 polyfill 替换为从 \`@babel/runtime\` 引用，不污染全局，适合库开发`,
    tags: ['Babel', 'preset-env', 'polyfill'],
  },
  {
    id: 514,
    title: '什么是 postcss？有哪些常用插件？',
    category: '构建工具',
    difficulty: 'easy',
    content: `## 什么是 postcss？有哪些常用插件？

PostCSS 是 CSS 转换工具，通过插件处理 CSS：

**常用插件：**
- \`autoprefixer\`：自动添加浏览器前缀（-webkit-、-moz-）
- \`postcss-preset-env\`：使用未来 CSS 特性，自动转换
- \`postcss-px-to-viewport\`：px 转 vw，移动端适配
- \`postcss-pxtorem\`：px 转 rem，移动端适配
- \`cssnano\`：CSS 压缩

\`\`\`javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-px-to-viewport')({ viewportWidth: 375 })
  ]
}
\`\`\`

**追问：** \`autoprefixer\` 如何知道需要添加哪些前缀？

使用 \`browserslist\` 配置确定目标浏览器，结合 Can I Use 数据库，只为需要前缀的浏览器添加对应前缀。`,
    tags: ['PostCSS', 'autoprefixer', 'CSS'],
  },
  {
    id: 515,
    title: '什么是 husky 和 lint-staged？',
    category: '代码质量',
    difficulty: 'easy',
    content: `## 什么是 husky 和 lint-staged？

- **husky**：Git hooks 工具，在 Git 操作（commit、push）时执行脚本
- **lint-staged**：只对 Git 暂存区（staged）的文件运行 lint

\`\`\`json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
}
\`\`\`

\`\`\`bash
# .husky/pre-commit
npx lint-staged
\`\`\`

**追问：** 为什么用 \`lint-staged\` 而不是直接 lint 整个项目？

整个项目 lint 速度慢，在 commit 时会严重影响开发体验。\`lint-staged\` 只检查本次修改的文件，速度快，且只修复自己改动的代码，不影响其他人的代码。`,
    tags: ['husky', 'lint-staged', 'Git hooks'],
  },
  {
    id: 516,
    title: 'npm、yarn、pnpm 的区别？',
    category: '包管理',
    difficulty: 'medium',
    content: `## npm、yarn、pnpm 的区别？

| | npm | yarn | pnpm |
|--|-----|------|------|
| 安装速度 | 慢 | 快（并行） | 最快 |
| 磁盘占用 | 大 | 大 | 小（硬链接） |
| lock 文件 | package-lock.json | yarn.lock | pnpm-lock.yaml |
| workspace | ✅ | ✅ | ✅（最好） |
| 幽灵依赖 | ✅ 有 | ✅ 有 | ❌ 无 |

**追问：** 什么是幽灵依赖（Phantom Dependencies）？

幽灵依赖是指在 \`package.json\` 中没有声明，但可以在代码中 import 的包（因为它们是其他依赖的依赖，被提升到 \`node_modules\` 根目录）。pnpm 通过符号链接严格隔离，只有声明的依赖才能访问。`,
    tags: ['npm', 'yarn', 'pnpm', '幽灵依赖'],
  },
  {
    id: 517,
    title: 'dependencies 和 devDependencies 的区别？',
    category: '包管理',
    difficulty: 'easy',
    content: `## dependencies 和 devDependencies 的区别？

- \`dependencies\`：生产依赖，运行时需要（如 Vue、axios）
- \`devDependencies\`：开发依赖，只在开发/构建时需要（如 Webpack、ESLint）
- \`peerDependencies\`：对等依赖，声明宿主环境需要安装的依赖
- \`optionalDependencies\`：可选依赖，安装失败不影响整体

**追问：** 版本号 \`^1.2.3\` 和 \`~1.2.3\` 的区别？

- \`^1.2.3\`：兼容版本，允许更新 minor 和 patch（>=1.2.3 <2.0.0）
- \`~1.2.3\`：近似版本，只允许更新 patch（>=1.2.3 <1.3.0）
- \`1.2.3\`：精确版本，不允许更新`,
    tags: ['dependencies', '版本号', 'package.json'],
  },
  {
    id: 518,
    title: '什么是 npx？和 npm 的区别？',
    category: '包管理',
    difficulty: 'easy',
    content: `## 什么是 npx？和 npm 的区别？

\`npx\` 是 npm 5.2+ 内置的工具，用于执行 npm 包中的命令：

1. **临时执行**：\`npx create-react-app my-app\`，不需要全局安装
2. **执行本地包**：\`npx eslint .\`，优先使用 \`node_modules/.bin\` 中的命令
3. **指定版本**：\`npx node@14 -e "console.log(process.version)"\`

**追问：** 为什么推荐用 \`npx\` 而不是全局安装工具？

1. 避免全局污染，不同项目可以使用不同版本
2. 不需要手动更新全局工具
3. 团队成员使用相同版本，避免"在我机器上能跑"的问题`,
    tags: ['npx', 'npm', '包管理'],
  },
  {
    id: 519,
    title: 'Webpack HMR（热模块替换）原理？',
    category: 'Webpack',
    difficulty: 'hard',
    content: `## Webpack HMR（热模块替换）原理？

1. Webpack 监听文件变化，重新编译变化的模块
2. 通过 WebSocket 通知浏览器有更新（发送 hash）
3. 浏览器通过 JSONP 请求获取更新的模块
4. HMR Runtime 用新模块替换旧模块，执行模块的 \`accept\` 回调
5. 如果模块没有 \`accept\` 处理，则向上冒泡，直到找到处理者或刷新页面

**追问：** Vue 的 HMR 是如何实现的？

\`vue-loader\` 为每个 Vue 组件注入 HMR 代码，当组件更新时：
1. 模板变化：重新渲染，保留组件状态
2. \`<script>\` 变化：重新创建组件实例（状态丢失）
3. \`<style>\` 变化：只更新样式，不重新渲染`,
    tags: ['HMR', 'Webpack', '热更新'],
  },
  {
    id: 520,
    title: 'Webpack 的 externals 配置是什么？',
    category: 'Webpack',
    difficulty: 'medium',
    content: `## Webpack 的 externals 配置是什么？

\`externals\` 配置告诉 Webpack 某些模块不打包进 bundle，而是从外部获取：

\`\`\`javascript
externals: {
  vue: 'Vue',
  axios: 'axios'
}
\`\`\`

**优势：** 减少 bundle 体积，利用 CDN 缓存，加快加载速度

**追问：** Vite 中如何实现类似 externals 的功能？

使用 \`vite-plugin-externals\` 或在 \`vite.config.js\` 中配置 \`build.rollupOptions.external\`。`,
    tags: ['Webpack', 'externals', 'CDN'],
  },
  {
    id: 521,
    title: 'Webpack 的 resolve 配置有什么作用？',
    category: 'Webpack',
    difficulty: 'easy',
    content: `## Webpack 的 resolve 配置有什么作用？

\`resolve\` 配置模块解析规则：

\`\`\`javascript
resolve: {
  alias: { '@': path.resolve(__dirname, 'src') },
  extensions: ['.ts', '.tsx', '.js', '.vue', '.json'],
  modules: ['node_modules', 'src'],
  mainFields: ['module', 'main']
}
\`\`\`

**追问：** 为什么 \`extensions\` 不建议包含太多扩展名？

每个扩展名都需要尝试文件是否存在，扩展名越多，文件查找越慢。建议只包含项目中实际使用的扩展名，且将最常用的放在前面。`,
    tags: ['Webpack', 'resolve', 'alias'],
  },
  {
    id: 522,
    title: 'Webpack 的 optimization 配置有哪些？',
    category: 'Webpack',
    difficulty: 'medium',
    content: `## Webpack 的 optimization 配置有哪些？

\`\`\`javascript
optimization: {
  minimize: true,
  minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  splitChunks: { chunks: 'all' },
  runtimeChunk: 'single',
  moduleIds: 'deterministic'
}
\`\`\`

**追问：** 为什么要提取 \`runtimeChunk\`？

Webpack 的 runtime 代码包含模块 ID 映射等信息，每次构建都可能变化。如果 runtime 内嵌在 vendor chunk 中，vendor 的 hash 会频繁变化。单独提取 runtime 后，vendor 的 hash 只在依赖真正变化时才改变。`,
    tags: ['Webpack', 'optimization', 'runtimeChunk'],
  },
  {
    id: 523,
    title: 'Vite 的插件系统是怎样的？',
    category: '构建工具',
    difficulty: 'medium',
    content: `## Vite 的插件系统是怎样的？

Vite 插件基于 Rollup 插件接口扩展，兼容大部分 Rollup 插件：

\`\`\`javascript
export default defineConfig({
  plugins: [{
    name: 'my-plugin',
    configureServer(server) { /* 配置开发服务器 */ },
    transformIndexHtml(html) { return html.replace('...', '...') },
    transform(code, id) {
      if (id.endsWith('.vue')) { /* 处理 Vue 文件 */ }
      return code
    }
  }]
})
\`\`\`

**追问：** Vite 插件的 \`enforce\` 属性有什么作用？

- \`enforce: 'pre'\`：在 Vite 核心插件之前执行
- \`enforce: 'post'\`：在 Vite 核心插件之后执行
- 默认：在 Vite 核心插件之间执行`,
    tags: ['Vite', '插件', 'Rollup'],
  },
  {
    id: 524,
    title: 'Docker 在前端中有哪些应用？',
    category: 'CI/CD与部署',
    difficulty: 'medium',
    content: `## Docker 在前端中有哪些应用？

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
\`\`\`

**优势：** 环境一致、快速部署和回滚、资源隔离、配合 K8s 自动扩缩容

**追问：** 多阶段构建有什么好处？

将构建环境和运行环境分离，最终镜像只包含运行所需的文件，不包含 node_modules 和源代码，大幅减小镜像体积。`,
    tags: ['Docker', '多阶段构建', '容器化'],
  },
  {
    id: 525,
    title: 'Nginx 在前端中如何配置？',
    category: 'CI/CD与部署',
    difficulty: 'medium',
    content: `## Nginx 在前端中如何配置？

\`\`\`nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  # SPA 路由支持
  location / {
    try_files $uri $uri/ /index.html;
  }
  # 静态资源长期缓存
  location ~* \\.(js|css|png|jpg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  # API 反向代理
  location /api/ {
    proxy_pass http://backend:3000/;
  }
  gzip on;
  gzip_types text/javascript application/json text/css;
}
\`\`\`

**追问：** 如何用 Nginx 实现负载均衡？

\`\`\`nginx
upstream backend {
  server backend1:3000 weight=3;
  server backend2:3000 weight=1;
}
\`\`\``,
    tags: ['Nginx', 'SPA路由', '反向代理'],
  },
  {
    id: 526,
    title: 'Webpack 的持久化缓存是什么？',
    category: 'Webpack',
    difficulty: 'medium',
    content: `## Webpack 的持久化缓存是什么？

Webpack 5 内置持久化缓存：

\`\`\`javascript
cache: {
  type: 'filesystem',
  buildDependencies: { config: [__filename] }
}
\`\`\`

**效果：** 二次构建速度提升 90%+

**追问：** Webpack 5 相比 Webpack 4 有哪些重要改进？

1. **持久化缓存**：大幅提升二次构建速度
2. **模块联邦**：微前端解决方案
3. **更好的 Tree Shaking**：支持嵌套 tree shaking
4. **资源模块**：内置处理图片/字体
5. **确定性的模块 ID**：有利于长期缓存`,
    tags: ['Webpack 5', '持久化缓存', '构建优化'],
  },
  {
    id: 527,
    title: '什么是微前端？有哪些实现方案？',
    category: '架构',
    difficulty: 'hard',
    content: `## 什么是微前端？有哪些实现方案？

微前端将大型前端应用拆分为多个独立的小应用。

**实现方案：**
1. **iframe**：最简单，隔离性好，但通信困难
2. **qiankun**：国内主流，JS 沙箱隔离，样式隔离
3. **Module Federation（Webpack 5）**：模块级别的共享
4. **Web Components**：原生标准，隔离性好
5. **无界（wujie）**：基于 iframe + Web Components

**追问：** qiankun 如何实现 JS 沙箱隔离？

1. **SnapshotSandbox**：激活时记录 window 快照，卸载时恢复
2. **ProxySandbox**：用 Proxy 代理 window，子应用操作都在代理对象上`,
    tags: ['微前端', 'qiankun', '沙箱'],
  },
  {
    id: 528,
    title: '什么是 Module Federation？',
    category: '架构',
    difficulty: 'hard',
    content: `## 什么是 Module Federation？

Webpack 5 的模块联邦允许多个独立构建的应用在运行时共享模块：

\`\`\`javascript
// 提供方
new ModuleFederationPlugin({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: { './Button': './src/Button.vue' },
  shared: ['vue']
});
// 消费方
new ModuleFederationPlugin({
  remotes: { app1: 'app1@http://localhost:3001/remoteEntry.js' },
  shared: ['vue']
});
\`\`\`

**追问：** Module Federation 和 npm 包共享的区别？

- **npm 包**：构建时打包，更新需重新发布和部署
- **Module Federation**：运行时动态加载，提供方更新后消费方立即获得最新版本`,
    tags: ['Module Federation', 'Webpack 5', '微前端'],
  },
  {
    id: 529,
    title: '什么是 Turbopack？',
    category: '构建工具',
    difficulty: 'easy',
    content: `## 什么是 Turbopack？

Turbopack 是 Vercel 开发的基于 Rust 的打包工具（由 Webpack 作者开发）。

**特点：**
1. 用 Rust 编写，比 Webpack 快 700 倍
2. 增量计算，只重新计算变化的部分
3. 原生支持 TypeScript、JSX、CSS Modules
4. 目前主要用于 Next.js 13+

**追问：** Turbopack 和 Vite 的区别？

- **Vite**：开发环境不打包（原生 ESM），生产用 Rollup
- **Turbopack**：开发和生产都打包，但用 Rust 实现极快的增量构建
- 两者原理不同：Vite 靠"不打包"，Turbopack 靠"极快的打包"`,
    tags: ['Turbopack', 'Rust', 'Next.js'],
  },
  {
    id: 530,
    title: '什么是 Changesets？如何管理 Monorepo 版本发布？',
    category: '包管理',
    difficulty: 'medium',
    content: `## 什么是 Changesets？

Changesets 是 Monorepo 的版本管理和发布工具：

**工作流程：**
1. 开发者提交代码时运行 \`changeset add\`，描述变更
2. 生成 \`.changeset/*.md\` 文件提交到仓库
3. CI 检测到 changeset，自动创建版本 PR
4. 合并后自动更新版本号、生成 CHANGELOG
5. 发布到 npm

**追问：** Lerna 和 Changesets 的区别？

- **Lerna**：功能全面但较重，配置复杂
- **Changesets**：专注版本管理和发布，更轻量，与 pnpm workspace 配合更好`,
    tags: ['Changesets', 'Monorepo', '版本管理'],
  },
]