import type { Question } from './types'

export const designPatternQuestions: Question[] = [
  {
    id: 801,
    title: '什么是设计模式？前端常用的设计模式有哪些？',
    category: '设计模式',
    difficulty: 'easy',
    content: `## 什么是设计模式？前端常用的设计模式有哪些？

**答案：**
设计模式是解决软件设计中常见问题的可复用解决方案，分为三类：

- **创建型**：单例、工厂、抽象工厂、建造者、原型
- **结构型**：适配器、装饰器、代理、外观、桥接、组合、享元
- **行为型**：观察者、策略、命令、迭代器、模板方法、状态、职责链

**前端常用：** 观察者/发布订阅、单例、工厂、代理、装饰器、策略、适配器、命令

**追问：** 设计模式的六大原则是什么？

**答案：**
1. **单一职责**：一个类只负责一件事
2. **开闭原则**：对扩展开放，对修改关闭
3. **里氏替换**：子类可以替换父类
4. **接口隔离**：接口尽量细化，不强迫实现不需要的方法
5. **依赖倒置**：依赖抽象而非具体实现
6. **迪米特法则**：最少知识原则，减少耦合`,
    tags: ['设计模式', '六大原则', 'SOLID']
  },
  {
    id: 802,
    title: '什么是观察者模式和发布订阅模式？有什么区别？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是观察者模式和发布订阅模式？有什么区别？

**答案：**
**观察者模式：** 主题（Subject）直接通知观察者（Observer），两者有直接依赖关系。

\`\`\`javascript
class EventEmitter {
  constructor() { this.events = {} }
  on(event, listener) {
    (this.events[event] = this.events[event] || []).push(listener)
    return this
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(fn => fn(...args))
    return this
  }
  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(fn => fn !== listener)
    return this
  }
  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper) }
    return this.on(event, wrapper)
  }
}
\`\`\`

**发布订阅模式：** 发布者和订阅者通过**事件中心**（消息代理）解耦，互不知道对方存在。

**区别：**
- 观察者：Subject 和 Observer 直接关联，同步通知
- 发布订阅：通过中间层（Event Bus）解耦，可以异步

**追问：** Vue 3 的响应式系统用的是哪种模式？

**答案：**
Vue 3 的响应式系统是观察者模式：\`reactive\` 对象是 Subject，\`effect\`（computed/watch）是 Observer。当数据变化时，Subject 直接通知相关的 Observer 重新执行。`,
    tags: ['观察者模式', '发布订阅', 'EventEmitter', 'Vue响应式']
  },
  {
    id: 803,
    title: '什么是单例模式？在前端中的应用？',
    category: '设计模式',
    difficulty: 'easy',
    content: `## 什么是单例模式？在前端中的应用？

**答案：**
单例模式确保一个类只有一个实例，并提供全局访问点。

\`\`\`javascript
class Store {
  static instance = null
  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store()
    }
    return Store.instance
  }
  constructor() { this.state = {} }
}
\`\`\`

**前端应用：**
1. **Vuex/Pinia store**：全局唯一的状态管理实例
2. **axios 实例**：全局唯一的 HTTP 客户端配置
3. **WebSocket 连接**：全局唯一的 WS 连接
4. **全局弹窗/Toast**：避免重复创建

**追问：** 模块化（ES Module）和单例模式的关系？

**答案：**
ES Module 天然是单例的：模块只会被执行一次，之后的 \`import\` 都返回同一个模块实例（缓存）。所以在 ES Module 中，直接导出一个对象就是单例：

\`\`\`javascript
// store.js
export const store = reactive({ count: 0 }) // 天然单例
\`\`\``,
    tags: ['单例模式', 'ESModule', 'Vuex', 'Pinia']
  },
  {
    id: 804,
    title: '什么是工厂模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是工厂模式？

**答案：**
工厂模式将对象的创建逻辑封装起来，调用者不需要知道具体的创建细节。

\`\`\`javascript
// 简单工厂
class ButtonFactory {
  static create(type) {
    switch(type) {
      case 'primary': return new PrimaryButton()
      case 'danger': return new DangerButton()
      default: return new DefaultButton()
    }
  }
}

// 工厂方法（每个子类实现自己的工厂方法）
class Dialog {
  createButton() { throw new Error('子类实现') }
  render() {
    const button = this.createButton()
    button.render()
  }
}
class WindowsDialog extends Dialog {
  createButton() { return new WindowsButton() }
}
\`\`\`

**追问：** Vue 3 的 \`h()\` 函数是工厂模式吗？

**答案：**
是的，\`h(type, props, children)\` 是虚拟节点的工厂函数，根据传入的类型（字符串标签名、组件对象）创建不同的 VNode，调用者不需要关心 VNode 的具体创建细节。`,
    tags: ['工厂模式', '简单工厂', '工厂方法', 'Vue h函数']
  },
  {
    id: 805,
    title: '什么是代理模式？在前端中的应用？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是代理模式？在前端中的应用？

**答案：**
代理模式为对象提供一个代理，控制对原对象的访问。

\`\`\`javascript
// 虚拟代理（延迟加载）
function createImageProxy(src) {
  const placeholder = new Image()
  placeholder.src = 'loading.gif'
  const realImage = new Image()
  realImage.onload = () => placeholder.src = src
  realImage.src = src
  return placeholder
}

// 缓存代理
function createCacheProxy(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}
\`\`\`

**前端应用：**
1. **Vue 3 响应式**：Proxy 拦截对象操作
2. **axios 拦截器**：代理 HTTP 请求
3. **图片懒加载**：虚拟代理
4. **缓存代理**：memoize 函数

**追问：** ES6 的 \`Proxy\` 和代理模式的关系？

**答案：**
ES6 的 \`Proxy\` 是代理模式的语言级实现，可以拦截对象的几乎所有操作（get/set/delete/apply 等），是实现代理模式最直接的工具。Vue 3 的响应式系统就是代理模式的典型应用。`,
    tags: ['代理模式', 'Proxy', 'Vue3响应式', '缓存代理']
  },
  {
    id: 806,
    title: '什么是装饰器模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是装饰器模式？

**答案：**
装饰器模式在不修改原对象的情况下，动态地给对象添加新功能。

\`\`\`javascript
// 函数装饰器
function log(fn) {
  return function(...args) {
    console.log(\\\`调用 \\\${fn.name}，参数：\\\`, args)
    const result = fn.apply(this, args)
    console.log(\\\`返回值：\\\`, result)
    return result
  }
}

// 使用
const add = log((a, b) => a + b)
add(1, 2) // 打印日志并返回 3
\`\`\`

**前端应用：**
1. **TypeScript 装饰器**：\`@Component\`、\`@Injectable\`
2. **HOC（高阶组件）**：React 中的装饰器模式
3. **Vue 的 mixins**：（已不推荐，用 Composable 替代）
4. **函数增强**：日志、缓存、权限检查

**追问：** 装饰器模式和继承的区别？

**答案：**
- **继承**：静态，编译时确定，会增加类的层次
- **装饰器**：动态，运行时添加，可以组合多个装饰器，更灵活`,
    tags: ['装饰器模式', 'HOC', 'TypeScript装饰器', '函数增强']
  },
  {
    id: 807,
    title: '什么是策略模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是策略模式？

**答案：**
策略模式定义一系列算法，将每个算法封装起来，使它们可以互换。

\`\`\`javascript
// 表单验证策略
const validators = {
  required: (value) => value !== '' || '必填项',
  minLength: (min) => (value) =>
    value.length >= min || \\\`最少 \\\${min} 个字符\\\`,
  email: (value) =>
    /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || '邮箱格式不正确',
}

function validate(value, rules) {
  for (const rule of rules) {
    const result = rule(value)
    if (result !== true) return result
  }
  return true
}

// 使用
validate(email, [validators.required, validators.email])
\`\`\`

**追问：** 策略模式和 \`if/else\` 的区别？

**答案：**
\`if/else\` 将所有逻辑耦合在一起，新增策略需要修改原代码（违反开闭原则）。策略模式将每个策略封装为独立对象，新增策略只需添加新的策略类，不修改现有代码，更易扩展和测试。`,
    tags: ['策略模式', '表单验证', '开闭原则']
  },
  {
    id: 808,
    title: '什么是命令模式？',
    category: '设计模式',
    difficulty: 'hard',
    content: `## 什么是命令模式？

**答案：**
命令模式将请求封装为对象，支持撤销/重做、队列、日志等功能。

\`\`\`javascript
class CommandManager {
  constructor() {
    this.history = []
    this.redoStack = []
  }
  execute(command) {
    command.execute()
    this.history.push(command)
    this.redoStack = [] // 执行新命令后清空重做栈
  }
  undo() {
    const command = this.history.pop()
    if (command) {
      command.undo()
      this.redoStack.push(command)
    }
  }
  redo() {
    const command = this.redoStack.pop()
    if (command) {
      command.execute()
      this.history.push(command)
    }
  }
}
\`\`\`

**应用：** 富文本编辑器的撤销/重做、可视化编辑器

**追问：** 命令模式在前端编辑器中如何应用？

**答案：**
每个用户操作（拖拽、修改样式、添加组件）封装为 Command 对象，包含 \`execute()\` 和 \`undo()\` 方法。CommandManager 维护操作历史，支持 Ctrl+Z 撤销和 Ctrl+Y 重做。`,
    tags: ['命令模式', '撤销重做', '编辑器', 'CommandManager']
  },
  {
    id: 809,
    title: '什么是适配器模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是适配器模式？

**答案：**
适配器模式将一个接口转换为另一个接口，使不兼容的接口可以协同工作。

\`\`\`javascript
// 旧接口
class OldLogger {
  log(message) { console.log('[OLD]', message) }
}

// 适配器
class LoggerAdapter {
  constructor(oldLogger) { this.oldLogger = oldLogger }
  info(message) { this.oldLogger.log(\\\`[INFO] \\\${message}\\\`) }
  error(message) { this.oldLogger.log(\\\`[ERROR] \\\${message}\\\`) }
}
\`\`\`

**前端应用：**
1. **axios 适配器**：统一 XMLHttpRequest 和 fetch 的接口
2. **第三方库封装**：将不同地图 SDK（高德/百度）适配为统一接口
3. **数据格式转换**：将后端数据格式适配为前端组件需要的格式

**追问：** 适配器模式和代理模式的区别？

**答案：**
- **适配器**：改变接口，使不兼容的接口可以协作，通常用于整合遗留代码
- **代理**：不改变接口，控制对原对象的访问（权限、缓存、延迟加载）`,
    tags: ['适配器模式', 'axios适配器', '接口转换']
  },
  {
    id: 810,
    title: '什么是模板方法模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是模板方法模式？

**答案：**
模板方法模式在父类中定义算法骨架，将某些步骤延迟到子类实现。

\`\`\`javascript
class DataProcessor {
  // 模板方法
  process() {
    const data = this.fetchData()
    const processed = this.processData(data)
    this.saveData(processed)
  }
  fetchData() { throw new Error('子类实现') }
  processData(data) { return data } // 默认实现
  saveData(data) { console.log('保存：', data) }
}

class CSVProcessor extends DataProcessor {
  fetchData() { return readCSV() }
  processData(data) { return parseCSV(data) }
}
\`\`\`

**追问：** 模板方法模式和策略模式的区别？

**答案：**
- **模板方法**：通过继承，父类定义骨架，子类覆盖部分步骤，算法结构固定
- **策略**：通过组合，将算法封装为独立对象，运行时可以切换，更灵活`,
    tags: ['模板方法模式', '继承', '算法骨架']
  },
  {
    id: 811,
    title: '什么是职责链模式？',
    category: '设计模式',
    difficulty: 'hard',
    content: `## 什么是职责链模式？

**答案：**
职责链模式将请求沿着处理者链传递，每个处理者决定是否处理或传递给下一个。

\`\`\`javascript
class Handler {
  setNext(handler) {
    this.next = handler
    return handler // 支持链式调用
  }
  handle(request) {
    if (this.next) return this.next.handle(request)
    return null
  }
}

class AuthHandler extends Handler {
  handle(request) {
    if (!request.token) return '未授权'
    return super.handle(request)
  }
}

class RateLimitHandler extends Handler {
  handle(request) {
    if (isRateLimited(request)) return '请求过于频繁'
    return super.handle(request)
  }
}

// 使用
const auth = new AuthHandler()
const rateLimit = new RateLimitHandler()
auth.setNext(rateLimit)
auth.handle(request)
\`\`\`

**前端应用：** Express/Koa 中间件、axios 拦截器、事件冒泡

**追问：** Koa 的洋葱模型和职责链模式的关系？

**答案：**
Koa 的中间件是职责链模式的变体（洋葱模型）：每个中间件可以在 \`await next()\` 前后执行代码，形成"进入-处理-退出"的双向流程，比单向职责链更强大。`,
    tags: ['职责链模式', 'Koa中间件', '洋葱模型', '拦截器']
  },
  {
    id: 812,
    title: '什么是状态模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是状态模式？

**答案：**
状态模式允许对象在内部状态改变时改变其行为，看起来像改变了类。

\`\`\`javascript
// 交通灯状态机
class TrafficLight {
  constructor() {
    this.states = {
      red: { duration: 3000, next: 'green', action: () => console.log('停止') },
      green: { duration: 2000, next: 'yellow', action: () => console.log('通行') },
      yellow: { duration: 1000, next: 'red', action: () => console.log('准备停止') },
    }
    this.current = 'red'
  }
  transition() {
    const state = this.states[this.current]
    state.action()
    setTimeout(() => {
      this.current = state.next
      this.transition()
    }, state.duration)
  }
}
\`\`\`

**前端应用：** 表单状态（空/填写中/提交中/成功/失败）、播放器状态、上传状态

**追问：** 状态模式和策略模式的区别？

**答案：**
- **状态模式**：状态之间有转换关系，状态自己知道下一个状态，行为随状态自动改变
- **策略模式**：策略之间相互独立，由客户端选择策略，策略不知道其他策略`,
    tags: ['状态模式', '状态机', '有限状态机']
  },
  {
    id: 813,
    title: '什么是享元模式？',
    category: '设计模式',
    difficulty: 'hard',
    content: `## 什么是享元模式？

**答案：**
享元模式通过共享相同的对象来减少内存使用，将对象的状态分为内部状态（共享）和外部状态（不共享）。

\`\`\`javascript
class CharacterFactory {
  static pool = new Map()
  static getCharacter(char, font, size) {
    const key = \\\`\\\${char}-\\\${font}-\\\${size}\\\`
    if (!CharacterFactory.pool.has(key)) {
      CharacterFactory.pool.set(key, { char, font, size }) // 内部状态（共享）
    }
    return CharacterFactory.pool.get(key)
  }
}

// 使用时传入外部状态（位置）
function renderText(text) {
  return text.split('').map((char, index) => ({
    ...CharacterFactory.getCharacter(char, 'Arial', 14),
    x: index * 10, // 外部状态（不共享）
    y: 0,
  }))
}
\`\`\`

**前端应用：** 虚拟列表（复用 DOM 节点）、Canvas 粒子系统、图标字体

**追问：** 虚拟列表和享元模式的关系？

**答案：**
虚拟列表复用 DOM 节点是享元模式的应用：DOM 节点是"享元"（内部状态：结构和样式），列表项的数据是外部状态（随滚动位置变化）。通过复用有限的 DOM 节点渲染大量数据，大幅减少内存占用。`,
    tags: ['享元模式', '虚拟列表', '内存优化', '对象池']
  },
  {
    id: 814,
    title: '什么是组合模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是组合模式？

**答案：**
组合模式将对象组合成树形结构，使单个对象和组合对象具有一致的接口。

\`\`\`javascript
class File {
  constructor(name) { this.name = name }
  getSize() { return 100 }
  print(indent = '') { console.log(\\\`\\\${indent}📄 \\\${this.name}\\\`) }
}

class Folder {
  constructor(name) { this.name = name; this.children = [] }
  add(child) { this.children.push(child); return this }
  getSize() {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0)
  }
  print(indent = '') {
    console.log(\\\`\\\${indent}📁 \\\${this.name}\\\`)
    this.children.forEach(child => child.print(indent + '  '))
  }
}
\`\`\`

**前端应用：** DOM 树、Vue 组件树、菜单/树形组件、文件管理器

**追问：** Vue 的组件树是组合模式吗？

**答案：**
是的。Vue 的组件树是组合模式的典型应用：叶子节点（原生 HTML 元素）和容器节点（Vue 组件）都实现了相同的接口（渲染、更新、卸载），可以统一处理。Vue 的 diff 算法递归处理组件树，不需要区分叶子和容器。`,
    tags: ['组合模式', '树形结构', 'Vue组件树', 'DOM树']
  },
  {
    id: 815,
    title: '什么是 MVC、MVP、MVVM 模式？',
    category: '设计模式',
    difficulty: 'medium',
    content: `## 什么是 MVC、MVP、MVVM 模式？

**答案：**
**MVC（Model-View-Controller）：**
- Model：数据和业务逻辑
- View：UI 展示
- Controller：处理用户输入，协调 Model 和 View
- 问题：Controller 可能变得臃肿，View 和 Model 可能直接通信

**MVP（Model-View-Presenter）：**
- Presenter 替代 Controller，View 和 Model 完全解耦
- View 只负责展示，所有逻辑在 Presenter 中
- 适合 Android 开发

**MVVM（Model-View-ViewModel）：**
- ViewModel 替代 Presenter，通过数据绑定自动同步 View 和 Model
- View 和 ViewModel 通过双向绑定连接
- Vue、Angular 的核心模式

**追问：** Vue 是严格的 MVVM 吗？

**答案：**
Vue 受 MVVM 启发但不是严格的 MVVM。严格的 MVVM 中 ViewModel 不能直接操作 View，但 Vue 允许通过 \`ref\` 直接访问 DOM（\`$el\`、\`$refs\`）。Vue 官方文档也说明 Vue 不完全遵循 MVVM，但借鉴了其思想。`,
    tags: ['MVC', 'MVP', 'MVVM', 'Vue', '架构模式']
  },
]