import type { Question } from './types'

export const htmlCssQuestions: Question[] = [
  {
    id: 101,
    title: 'HTML 语义化标签有哪些？为什么要使用语义化标签？',
    category: 'HTML',
    difficulty: 'easy',
    content: '## HTML 语义化标签有哪些？为什么要使用语义化标签？\n\n**答案：**\n常见语义化标签：`<header>`、`<footer>`、`<nav>`、`<main>`、`<section>`、`<article>`、`<aside>`、`<figure>`、`<figcaption>`、`<time>`、`<mark>`、`<summary>`、`<details>` 等。\n\n使用语义化标签的原因：\n\n- **SEO 友好**：搜索引擎爬虫能更好地理解页面结构和内容权重\n- **可访问性**：屏幕阅读器等辅助工具能正确解读页面结构\n- **可维护性**：代码结构清晰，团队协作更高效\n- **浏览器默认样式**：部分语义标签有合理的默认样式\n\n### 追问：`<div>` 和 `<section>` 有什么区别？\n\n`<div>` 是无语义的通用容器，仅用于布局分组；`<section>` 表示文档中一个独立的内容区块，通常包含标题，有明确的语义含义。如果内容是独立的文章用 `<article>`，如果只是样式分组用 `<div>`，如果是有主题的内容区块用 `<section>`。',
    tags: ['HTML', '语义化', 'SEO']
  },
  {
    id: 102,
    title: 'src 和 href 的区别是什么？',
    category: 'HTML',
    difficulty: 'easy',
    content: '## src 和 href 的区别是什么？\n\n**答案：**\n\n- `src`（source）：用于替换当前元素，浏览器解析到 `src` 时会**暂停**其他资源下载和处理，直到该资源加载完毕。常用于 `<script>`、`<img>`、`<iframe>`\n- `href`（hypertext reference）：用于建立当前文档与引用资源之间的**链接关系**，不会暂停页面解析。常用于 `<link>`、`<a>`\n\n### 追问：为什么 `<script>` 标签建议放在 `</body>` 前？\n\n因为 `<script>` 使用 `src` 加载时会阻塞 HTML 解析，放在 `</body>` 前可以确保 DOM 已经构建完成，避免脚本操作不存在的 DOM 元素，同时不阻塞页面首屏渲染。现代方案也可以使用 `defer` 或 `async` 属性。',
    tags: ['HTML', 'src/href', '资源加载']
  },
  {
    id: 103,
    title: 'defer 和 async 的区别？',
    category: 'HTML',
    difficulty: 'easy',
    content: '## defer 和 async 的区别？\n\n**答案：**\n\n- **普通 script**：立即下载并执行，阻塞 HTML 解析\n- **async**：异步下载，下载完成后**立即执行**（可能在 HTML 解析完成前），多个 async 脚本执行顺序不确定\n- **defer**：异步下载，等 HTML 解析完成后、`DOMContentLoaded` 事件前按顺序执行，多个 defer 脚本保证顺序\n\n### 追问：什么场景用 async，什么场景用 defer？\n\n- `async`：适合独立的第三方脚本，如统计分析、广告脚本，不依赖 DOM 也不被其他脚本依赖\n- `defer`：适合需要操作 DOM 或有依赖关系的脚本，保证执行顺序',
    tags: ['HTML', 'defer/async', '脚本加载']
  },
  {
    id: 104,
    title: 'CSS 盒模型是什么？box-sizing 有什么作用？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 盒模型是什么？box-sizing 有什么作用？\n\n**答案：**\nCSS 盒模型由 content、padding、border、margin 四部分组成。\n\n- **标准盒模型**（`box-sizing: content-box`）：`width/height` 只包含 content，实际占用宽度 = width + padding + border\n- **IE 盒模型**（`box-sizing: border-box`）：`width/height` 包含 content + padding + border，实际占用宽度就是设置的 width\n\n### 追问：实际开发中为什么推荐全局设置 `box-sizing: border-box`？\n\n使用 `border-box` 时，设置宽度就是元素实际占用的宽度，加 padding 和 border 不会撑大元素，布局计算更直观，不容易出现意外的溢出问题。通常在全局 CSS 中设置 `*, *::before, *::after { box-sizing: border-box; }`。',
    tags: ['CSS', '盒模型', 'box-sizing']
  },
  {
    id: 105,
    title: 'BFC 是什么？如何触发 BFC？有什么应用场景？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## BFC 是什么？如何触发 BFC？有什么应用场景？\n\n**答案：**\nBFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素的布局不影响外部，外部也不影响内部。\n\n**触发 BFC 的方式：**\n\n- `overflow` 不为 `visible`（如 `hidden`、`auto`、`scroll`）\n- `display: flex`、`display: grid`、`display: inline-block`\n- `position: absolute`、`position: fixed`\n- `float` 不为 `none`\n\n**应用场景：**\n\n- **清除浮动**：父元素触发 BFC 后可以包含浮动子元素，解决高度塌陷\n- **防止 margin 重叠**：两个相邻 BFC 的 margin 不会合并\n- **防止文字环绕**：BFC 区域不会与浮动元素重叠\n\n### 追问：margin 重叠（塌陷）在什么情况下会发生？\n\n- **相邻兄弟元素**：上下 margin 取较大值合并\n- **父子元素**：父元素没有 border/padding/BFC 时，子元素的 margin-top 会与父元素合并\n- **空块级元素**：自身 margin-top 和 margin-bottom 会合并',
    tags: ['CSS', 'BFC', '布局']
  },
  {
    id: 106,
    title: 'Flex 布局常用属性有哪些？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## Flex 布局常用属性有哪些？\n\n**答案：**\n**容器属性：**\n\n- `flex-direction`：主轴方向（row/column/row-reverse/column-reverse）\n- `flex-wrap`：是否换行（nowrap/wrap/wrap-reverse）\n- `justify-content`：主轴对齐（flex-start/flex-end/center/space-between/space-around/space-evenly）\n- `align-items`：交叉轴对齐（stretch/flex-start/flex-end/center/baseline）\n- `align-content`：多行交叉轴对齐\n- `gap`：子元素间距\n\n**子元素属性：**\n\n- `flex`：flex-grow + flex-shrink + flex-basis 简写\n- `align-self`：单个子元素交叉轴对齐\n- `order`：排列顺序\n- `flex-shrink: 0`：禁止收缩\n\n### 追问：如何用 Flex 实现一个元素水平垂直居中？\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```',
    tags: ['CSS', 'Flex', '布局']
  },
  {
    id: 107,
    title: 'Grid 布局和 Flex 布局的区别？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## Grid 布局和 Flex 布局的区别？\n\n**答案：**\n\n- **Flex**：一维布局，只能控制一个方向（行或列），适合组件内部的线性排列\n- **Grid**：二维布局，同时控制行和列，适合整体页面布局\n\n**Grid 核心属性：**\n\n- `grid-template-columns`：定义列\n- `grid-template-rows`：定义行\n- `grid-gap`：间距\n- `grid-column`/`grid-row`：子元素跨列/跨行\n\n### 追问：`fr` 单位是什么？\n\n`fr`（fraction）是 Grid 布局中的弹性单位，表示剩余空间的比例。`grid-template-columns: 1fr 2fr 1fr` 表示三列按 1:2:1 比例分配剩余空间，类似 Flex 中的 `flex-grow`。',
    tags: ['CSS', 'Grid', 'Flex']
  },
  {
    id: 108,
    title: 'CSS 定位有哪几种？absolute 相对于谁定位？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 定位有哪几种？absolute 相对于谁定位？\n\n**答案：**\n\n- `static`：默认，正常文档流\n- `relative`：相对自身原始位置偏移，**仍占据原来的空间**\n- `absolute`：脱离文档流，相对于**最近的非 static 定位祖先元素**定位\n- `fixed`：脱离文档流，相对于**视口**定位，滚动不移动\n- `sticky`：粘性定位，在滚动到阈值前是 relative，超过后变为 fixed\n\n### 追问：sticky 定位不生效的常见原因？\n\n- 父元素设置了 `overflow: hidden/auto/scroll`，导致 sticky 失效\n- 没有设置 `top/bottom/left/right` 阈值\n- 父元素高度不够，没有滚动空间',
    tags: ['CSS', '定位', 'position']
  },
  {
    id: 109,
    title: 'CSS 选择器优先级是怎么计算的？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## CSS 选择器优先级是怎么计算的？\n\n**答案：**\n优先级从高到低：\n\n- `!important`（最高，慎用）\n- 内联样式（style 属性）：1000\n- ID 选择器（`#id`）：100\n- 类选择器（`.class`）、属性选择器（`[attr]`）、伪类（`:hover`）：10\n- 元素选择器（`div`）、伪元素（`::before`）：1\n- 通配符（`*`）、关系选择器（`>`、`+`、`~`）：0\n\n计算方式：将各类选择器数量组合成 (a, b, c) 比较，a > b > c，不进位。\n\n### 追问：`:is()` 和 `:where()` 有什么区别？\n\n`:is()` 的优先级取决于参数中优先级最高的选择器；`:where()` 的优先级始终为 0，不影响整体优先级计算，适合写基础样式时不想影响优先级的场景。',
    tags: ['CSS', '选择器', '优先级']
  },
  {
    id: 110,
    title: '伪类和伪元素的区别？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## 伪类和伪元素的区别？\n\n**答案：**\n\n- **伪类**（单冒号 `:`）：表示元素的某种**状态**，如 `:hover`、`:focus`、`:nth-child()`、`:first-child`、`:not()`\n- **伪元素**（双冒号 `::`）：创建不在 DOM 中的**虚拟元素**，如 `::before`、`::after`、`::placeholder`、`::selection`\n\nCSS3 规范用双冒号区分伪元素，但单冒号的伪元素写法浏览器仍然兼容。\n\n### 追问：`::before` 和 `::after` 的 `content` 属性有什么用？\n\n`content` 是伪元素必须设置的属性（即使是空字符串 `""`），用于插入内容。常见用途：清除浮动（`.clearfix::after { content: ""; display: block; clear: both; }`）、添加装饰性图标、计数器等。',
    tags: ['CSS', '伪类', '伪元素']
  },
  {
    id: 111,
    title: '如何实现元素水平垂直居中？列举多种方法',
    category: 'CSS',
    difficulty: 'easy',
    content: '## 如何实现元素水平垂直居中？列举多种方法\n\n**方法一：Flex**\n\n```css\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```\n\n**方法二：Grid**\n\n```css\n.parent {\n  display: grid;\n  place-items: center;\n}\n```\n\n**方法三：absolute + transform**\n\n```css\n.child {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n```\n\n**方法四：absolute + margin auto（需知道宽高）**\n\n```css\n.child {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: auto;\n}\n```\n\n### 追问：这几种方法各有什么适用场景？\n\n- Flex/Grid：现代布局首选，简洁，适合大多数场景\n- absolute + transform：不需要知道子元素尺寸，适合弹窗、遮罩层\n- absolute + margin auto：需要知道子元素尺寸，兼容性好',
    tags: ['CSS', '居中', '布局']
  },
  {
    id: 112,
    title: 'CSS 中 display: none、visibility: hidden、opacity: 0 的区别？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 中 display: none、visibility: hidden、opacity: 0 的区别？\n\n**答案：**\n\n| 属性 | 占据空间 | 触发事件 | 子元素 | 重排重绘 |\n|------|---------|---------|--------|----------|\n| `display: none` | 不占 | 不触发 | 一起隐藏 | 触发重排 |\n| `visibility: hidden` | 占据 | 不触发 | 可单独设 visible | 触发重绘 |\n| `opacity: 0` | 占据 | 可触发 | 一起透明 | 合成层变化 |\n\n### 追问：哪种方式性能最好？\n\n`opacity: 0` 配合 `will-change: opacity` 或 `transform` 时，变化只在合成层处理，不触发重排重绘，性能最好，常用于动画过渡效果。',
    tags: ['CSS', '隐藏元素', '性能']
  },
  {
    id: 113,
    title: '什么是重排（Reflow）和重绘（Repaint）？如何减少？',
    category: 'CSS',
    difficulty: 'hard',
    content: '## 什么是重排（Reflow）和重绘（Repaint）？如何减少？\n\n**答案：**\n\n- **重排（Reflow）**：元素的几何属性（位置、尺寸）发生变化，浏览器需要重新计算布局，代价最高\n- **重绘（Repaint）**：元素外观变化（颜色、背景）但不影响布局，只需重新绘制，代价较低\n- **合成（Composite）**：只有 transform、opacity 变化，直接在 GPU 合成层处理，代价最低\n\n**减少重排重绘的方法：**\n\n- 使用 `transform` 代替 `top/left` 做位移动画\n- 批量修改 DOM（使用 DocumentFragment 或 `display: none` 后修改再显示）\n- 避免频繁读取会触发重排的属性（`offsetWidth`、`scrollTop` 等），可缓存到变量\n- 使用 `will-change` 提升到合成层\n- 使用 `requestAnimationFrame` 批量处理动画\n\n### 追问：为什么读取 `offsetWidth` 会触发重排？\n\n浏览器为了优化性能会将多次 DOM 修改批量处理（异步队列），但当你读取 `offsetWidth`、`clientHeight`、`scrollTop` 等布局相关属性时，浏览器必须立即刷新队列、重新计算布局，才能返回准确值，这就强制触发了重排。',
    tags: ['CSS', '重排重绘', '性能']
  },
  {
    id: 114,
    title: 'CSS 动画 transition 和 animation 的区别？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 动画 transition 和 animation 的区别？\n\n**答案：**\n\n- `transition`：过渡动画，需要触发条件（hover、class 变化），只有起始和结束两个状态，不能自动播放\n- `animation` + `@keyframes`：可定义多个关键帧，支持自动播放、循环、暂停、延迟、反向等\n\n### 追问：如何用 CSS 实现一个无限旋转的 loading 动画？\n\n```css\n@keyframes spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n.loading {\n  animation: spin 1s linear infinite;\n}\n```',
    tags: ['CSS', '动画', 'transition']
  },
  {
    id: 115,
    title: 'position: sticky 的原理和使用注意事项？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## position: sticky 的原理和使用注意事项？\n\n**答案：**\n`sticky` 是 `relative` 和 `fixed` 的混合体。元素在滚动容器中，当距离视口的距离大于设定阈值时表现为 `relative`，小于阈值时表现为 `fixed`（相对于滚动容器）。\n\n**注意事项：**\n\n- 必须设置 `top/bottom/left/right` 之一\n- 父元素不能有 `overflow: hidden/auto/scroll`\n- 父元素必须有足够高度（sticky 元素只在父元素范围内生效）\n- 兼容性：现代浏览器支持良好，IE 不支持\n\n### 追问：如何实现表格头部固定，内容区域滚动？\n\n给 `<thead>` 的 `<th>` 设置 `position: sticky; top: 0; z-index: 1;`，同时确保表格的父容器有固定高度和 `overflow-y: auto`。',
    tags: ['CSS', 'sticky', '定位']
  },
  {
    id: 116,
    title: 'CSS 变量（自定义属性）如何使用？有什么优势？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 变量（自定义属性）如何使用？有什么优势？\n\n```css\n/* 定义 */\n:root {\n  --primary-color: #1890ff;\n  --font-size-base: 14px;\n}\n/* 使用 */\n.button {\n  color: var(--primary-color);\n  font-size: var(--font-size-base);\n}\n/* 带默认值 */\ncolor: var(--color, #333);\n```\n\n**优势：**\n\n- 运行时可动态修改（JS 可以修改），实现主题切换\n- 可以继承，局部变量覆盖全局变量\n- 比 Sass/Less 变量更灵活（编译时 vs 运行时）\n\n### 追问：如何用 CSS 变量实现暗黑模式切换？\n\n```css\n:root {\n  --bg: #fff;\n  --text: #333;\n}\n[data-theme=\'dark\'] {\n  --bg: #1a1a1a;\n  --text: #eee;\n}\nbody {\n  background: var(--bg);\n  color: var(--text);\n}\n```\n\nJS 中通过 `document.documentElement.setAttribute(\'data-theme\', \'dark\')` 切换。',
    tags: ['CSS', '变量', '主题']
  },
  {
    id: 117,
    title: 'em、rem、vw、vh 的区别？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## em、rem、vw、vh 的区别？\n\n**答案：**\n\n- `em`：相对于**当前元素**的 font-size，嵌套时会累乘，容易出问题\n- `rem`：相对于**根元素（html）**的 font-size，全局统一，常用于移动端适配\n- `vw`：视口宽度的 1%，`100vw` = 视口宽度\n- `vh`：视口高度的 1%，`100vh` = 视口高度\n- `vmin/vmax`：取 vw/vh 中较小/较大的值\n\n### 追问：移动端适配方案有哪些？\n\n- **rem + flexible.js**：根据设备宽度动态设置 html 的 font-size，配合 postcss-pxtorem 自动转换\n- **vw/vh**：直接用视口单位，配合 postcss-px-to-viewport 自动转换，现代方案\n- **媒体查询**：针对不同断点写不同样式\n- **Flex/Grid 弹性布局**：自适应不同屏幕',
    tags: ['CSS', '单位', '适配']
  },
  {
    id: 118,
    title: '如何实现一个三角形？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## 如何实现一个三角形？\n\n利用 border 的特性，将元素宽高设为 0，通过 border 实现三角形：\n\n```css\n/* 向上的三角形 */\n.triangle {\n  width: 0;\n  height: 0;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  border-bottom: 20px solid red;\n}\n```\n\n### 追问：如何用 CSS 实现一个带边框的三角形？\n\n用两个三角形叠加，外层三角形用边框色，内层三角形用背景色，通过 `::before` 和 `::after` 或绝对定位实现，内层比外层小 1px 并偏移 1px。',
    tags: ['CSS', '三角形', 'border']
  },
  {
    id: 119,
    title: 'z-index 的层叠上下文是什么？',
    category: 'CSS',
    difficulty: 'hard',
    content: '## z-index 的层叠上下文是什么？\n\n层叠上下文（Stacking Context）是一个三维概念，决定元素在 Z 轴上的渲染顺序。\n\n**触发层叠上下文的条件：**\n\n- `position` 不为 static 且 `z-index` 不为 auto\n- `opacity` 小于 1\n- `transform` 不为 none\n- `filter` 不为 none\n- `will-change` 指定了上述属性\n\n**层叠顺序（从低到高）：**\n背景/边框 → 负 z-index → 块级元素 → 浮动元素 → 行内元素 → z-index: 0 → 正 z-index\n\n### 追问：为什么有时候设置了很大的 z-index 但元素还是被遮挡？\n\n因为 `z-index` 只在同一个层叠上下文中比较。如果父元素创建了层叠上下文，子元素的 z-index 再大也只在父元素的层叠上下文内有效，无法超越父元素所在的层级。',
    tags: ['CSS', 'z-index', '层叠上下文']
  },
  {
    id: 120,
    title: 'CSS 清除浮动的方法有哪些？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 清除浮动的方法有哪些？\n\n**方法一：clearfix 伪元素（推荐）**\n\n```css\n.clearfix::after {\n  content: \'\';\n  display: block;\n  clear: both;\n}\n```\n\n**方法二：父元素触发 BFC**\n\n```css\n.parent {\n  overflow: hidden;\n}\n```\n\n**方法三：** 父元素也设置浮动（不推荐，会影响父元素布局）\n\n**方法四：** 在浮动元素后添加清除浮动的元素（不推荐，污染 HTML）\n\n### 追问：现代开发中还需要用浮动布局吗？\n\n基本不需要了。Flex 和 Grid 已经完全替代了浮动布局的功能，且更强大、更直观。浮动现在主要用于文字环绕图片的场景（这是浮动的本意）。',
    tags: ['CSS', '清除浮动', 'BFC']
  },
  {
    id: 121,
    title: 'link 和 @import 引入 CSS 的区别？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## link 和 @import 引入 CSS 的区别？\n\n**答案：**\n\n- `<link>`：HTML 标签，页面加载时**并行**加载 CSS，不阻塞 DOM 解析（但会阻塞渲染）\n- `@import`：CSS 语法，必须等页面加载完后才加载，**串行**加载，性能差\n- `<link>` 可以通过 JS 动态操作，`@import` 不行\n- `<link>` 支持 `rel="preload"` 预加载\n\n### 追问：CSS 会阻塞页面渲染吗？\n\nCSS 不阻塞 DOM 解析，但会阻塞**渲染**（浏览器需要等 CSSOM 构建完成才能合并 DOM+CSSOM 生成渲染树）。CSS 还会阻塞其后的 JS 执行（因为 JS 可能操作样式）。所以 CSS 应该尽早加载，放在 `<head>` 中。',
    tags: ['CSS', 'link', '@import']
  },
  {
    id: 122,
    title: '什么是 CSS Sprites（雪碧图）？现在还用吗？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## 什么是 CSS Sprites（雪碧图）？现在还用吗？\n\nCSS Sprites 是将多个小图标合并成一张大图，通过 `background-position` 定位显示不同图标，减少 HTTP 请求数量。\n\n**现在的替代方案：**\n\n- **SVG Sprite**：将多个 SVG 合并，通过 `<use>` 引用，支持样式控制\n- **Icon Font**（如 iconfont）：字体图标，可以用 CSS 控制颜色大小\n- **HTTP/2**：多路复用，多个小请求不再是性能瓶颈，Sprites 的意义减弱\n- **Base64**：小图标直接内嵌到 CSS 中\n\n### 追问：Icon Font 和 SVG 图标哪个更好？\n\nSVG 图标更好：支持多色、支持动画、渲染更清晰（矢量）、语义更好、可访问性更强。Icon Font 是单色的，渲染有时会模糊，且字体加载失败会显示乱码。',
    tags: ['CSS', '雪碧图', '图标']
  },
  {
    id: 123,
    title: '响应式设计的实现方式有哪些？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## 响应式设计的实现方式有哪些？\n\n**答案：**\n\n- **媒体查询**：`@media (max-width: 768px) { ... }` 针对不同断点写样式\n- **弹性布局**：Flex/Grid 自适应\n- **相对单位**：`%`、`vw`、`rem` 代替固定像素\n- **响应式图片**：`<img srcset="...">` 或 `<picture>` 标签\n- **CSS 容器查询**（新特性）：`@container` 根据父容器尺寸响应\n\n### 追问：移动优先（Mobile First）和桌面优先（Desktop First）有什么区别？\n\n- **移动优先**：默认样式针对移动端，用 `min-width` 媒体查询扩展到大屏。性能更好（移动端不加载多余样式），推荐做法\n- **桌面优先**：默认样式针对桌面，用 `max-width` 媒体查询适配小屏',
    tags: ['CSS', '响应式', '媒体查询']
  },
  {
    id: 124,
    title: 'overflow 属性有哪些值？各有什么作用？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## overflow 属性有哪些值？各有什么作用？\n\n**答案：**\n\n- `visible`（默认）：内容溢出时可见，不裁剪\n- `hidden`：裁剪溢出内容，不显示滚动条，同时触发 BFC\n- `scroll`：始终显示滚动条（即使内容不溢出）\n- `auto`：内容溢出时才显示滚动条\n- `clip`（新）：类似 hidden 但不触发 BFC\n\n### 追问：如何实现文本超出显示省略号？\n\n```css\n/* 单行 */\n.ellipsis {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n/* 多行（WebKit） */\n.ellipsis-multi {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n```',
    tags: ['CSS', 'overflow', '省略号']
  },
  {
    id: 125,
    title: 'CSS 中 transform 有哪些常用函数？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 中 transform 有哪些常用函数？\n\n**答案：**\n\n- `translate(x, y)`：位移，不影响文档流\n- `scale(x, y)`：缩放\n- `rotate(deg)`：旋转\n- `skew(x, y)`：倾斜\n- `matrix()`：矩阵变换（包含以上所有变换）\n- `translateZ()`/`translate3d()`：3D 位移，触发 GPU 加速\n\n### 追问：transform 的变换原点如何修改？\n\n通过 `transform-origin` 属性修改，默认值是 `50% 50%`（元素中心）。可以设置为 `top left`、`0 0`、`100% 100%` 等，影响旋转、缩放的基准点。',
    tags: ['CSS', 'transform', '变换']
  },
  {
    id: 126,
    title: '什么是 CSS 预处理器？Sass 和 Less 的区别？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## 什么是 CSS 预处理器？Sass 和 Less 的区别？\n\nCSS 预处理器是在 CSS 基础上增加编程特性的工具，编译后生成标准 CSS。\n\n**共同特性：** 变量、嵌套、混入（Mixin）、函数、继承、模块化\n\n**区别：**\n\n- **Sass**：功能更强大，有 `@each`、`@for` 等循环，支持条件判断，有 `@extend` 继承，语法有 SCSS（类 CSS）和缩进语法两种\n- **Less**：语法更接近 CSS，学习成本低，功能相对简单，基于 JS 运行\n\n### 追问：现在还需要用 CSS 预处理器吗？\n\n随着 CSS 原生变量、`calc()`、嵌套（CSS Nesting）等特性的普及，预处理器的必要性在降低。但 Sass 的 Mixin、循环等高级功能在大型项目中仍有价值。Vue 项目中 `<style lang="scss">` 仍然很常用。',
    tags: ['CSS', '预处理器', 'Sass']
  },
  {
    id: 127,
    title: '如何实现一个 0.5px 的细线？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## 如何实现一个 0.5px 的细线？\n\n**方法一：transform scale**\n\n```css\n.line {\n  height: 1px;\n  transform: scaleY(0.5);\n  transform-origin: 0 0;\n}\n```\n\n**方法二：伪元素 + scale**\n\n```css\n.border::after {\n  content: \'\';\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 1px;\n  background: #ccc;\n  transform: scaleY(0.5);\n}\n```\n\n### 追问：为什么移动端 1px 问题会出现？\n\n移动设备有设备像素比（DPR），如 iPhone 的 DPR=2，CSS 的 1px 实际渲染为 2 个物理像素，看起来比设计稿的 1px 粗。设计稿通常是 2x 图，设计师的 1px 对应 CSS 的 0.5px。',
    tags: ['CSS', '0.5px', '移动端']
  },
  {
    id: 128,
    title: 'will-change 属性的作用和注意事项？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## will-change 属性的作用和注意事项？\n\n`will-change` 告知浏览器某个元素即将发生变化，让浏览器提前做优化准备（通常是提升到独立的合成层，启用 GPU 加速）。\n\n```css\n.animated {\n  will-change: transform, opacity;\n}\n```\n\n**注意事项：**\n\n- 不要滥用，每个合成层都消耗 GPU 内存\n- 不要在静态元素上使用\n- 动画结束后最好移除（JS 动态添加/移除）\n- 不要用 `will-change: all`\n\n### 追问：除了 will-change，还有什么方式可以触发 GPU 加速？\n\n`transform: translateZ(0)` 或 `transform: translate3d(0,0,0)` 是常见的 hack 方式，强制触发 GPU 加速。但现代浏览器对 `will-change` 的支持已经很好，推荐使用 `will-change`。',
    tags: ['CSS', 'will-change', 'GPU']
  },
  {
    id: 129,
    title: 'CSS 中如何实现暗黑模式？',
    category: 'CSS',
    difficulty: 'easy',
    content: '## CSS 中如何实现暗黑模式？\n\n**方法一：媒体查询（系统级）**\n\n```css\n@media (prefers-color-scheme: dark) {\n  body {\n    background: #1a1a1a;\n    color: #eee;\n  }\n}\n```\n\n**方法二：CSS 变量 + data 属性（手动切换）**\n\n```css\n:root {\n  --bg: #fff;\n  --text: #333;\n}\n[data-theme=\'dark\'] {\n  --bg: #1a1a1a;\n  --text: #eee;\n}\n```\n\n**方法三：** CSS 变量 + 媒体查询结合（同时支持系统和手动切换）\n\n### 追问：如何让用户手动切换暗黑模式并记住偏好？\n\n用 JS 切换 `document.documentElement.setAttribute(\'data-theme\', \'dark\')`，同时将用户偏好存入 `localStorage`，页面加载时读取 `localStorage` 恢复设置，优先级高于系统设置。',
    tags: ['CSS', '暗黑模式', '主题']
  },
  {
    id: 130,
    title: '什么是 CSS 模块化？有哪些方案？',
    category: 'CSS',
    difficulty: 'medium',
    content: '## 什么是 CSS 模块化？有哪些方案？\n\nCSS 模块化解决全局样式污染、命名冲突的问题。\n\n**方案：**\n\n- **BEM 命名规范**：`block__element--modifier`，通过命名约定避免冲突\n- **CSS Modules**：构建工具将类名转为唯一哈希，如 `.title` → `.title_abc123`，Vue 的 `<style scoped>` 原理类似\n- **CSS-in-JS**：如 styled-components，将样式写在 JS 中，自动生成唯一类名\n- **Tailwind CSS**：原子化 CSS，通过组合工具类实现样式，无命名冲突\n\n### 追问：Vue 的 scoped 样式是如何实现隔离的？\n\nVue 编译时给组件的每个元素添加唯一的 `data-v-xxxxxx` 属性，同时将 CSS 选择器转为 `.class[data-v-xxxxxx]` 的属性选择器，从而实现样式隔离。使用 `::v-deep` 或 `:deep()` 可以穿透 scoped 影响子组件样式。',
    tags: ['CSS', '模块化', 'scoped']
  },
]
