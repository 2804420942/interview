import type { Question } from './types'

export const javascriptQuestions: Question[] = [
  {
    id: 1,
    title: 'JavaScript 的数据类型有哪些？如何判断类型？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## JavaScript 的数据类型有哪些？如何判断类型？\n\n**答案：**\n\n**基本类型（7 种）：** `string`、`number`、`boolean`、`null`、`undefined`、`symbol`、`bigint`\n\n**引用类型：** `Object`（包含 Array、Function、Date、RegExp、Map、Set 等）\n\n**判断方式：**\n\n- `typeof`：适合基本类型，但 `typeof null === \'object\'`（历史 bug），`typeof function === \'function\'`\n- `instanceof`：判断引用类型，检查原型链，`[] instanceof Array === true`\n- `Object.prototype.toString.call()`：最准确，返回 `[object Array]`、`[object Null]` 等\n- `Array.isArray()`：专门判断数组\n\n### 追问：typeof null === \'object\' 为什么？\n\n这是 JavaScript 的历史遗留 bug。在 JS 最初实现中，值的类型标签存储在低位，对象的类型标签是 000，而 null 的二进制表示全是 0，被误判为对象类型。',
    tags: ['JS基础', '数据类型', 'typeof']
  },
  {
    id: 2,
    title: '== 和 === 的区别？隐式类型转换规则？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## == 和 === 的区别？隐式类型转换规则？\n\n**答案：**\n\n- `===`（严格相等）：不进行类型转换，类型不同直接返回 false\n- `==`（宽松相等）：会进行隐式类型转换\n\n### == 转换规则：\n\n- `null == undefined` → true（特殊规定）\n- 有 `NaN` → false（NaN 不等于任何值包括自身）\n- 数字 vs 字符串 → 字符串转数字\n- 布尔值 → 转数字（true→1，false→0）\n- 对象 vs 基本类型 → 对象调用 `valueOf()` 或 `toString()`\n\n### 追问：[] == false 的结果是什么？为什么？\n\n结果是 `true`。过程：`false` 转数字 → `0`；`[]` 调用 `valueOf()` 返回 `[]`，再调用 `toString()` 返回 `""`；`""` 转数字 → `0`；`0 == 0` → `true`。',
    tags: ['JS基础', '类型转换', '相等']
  },
  {
    id: 3,
    title: '什么是闭包？闭包的应用场景和注意事项？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 什么是闭包？闭包的应用场景和注意事项？\n\n**答案：**\n闭包是指**函数能够访问其词法作用域中的变量**，即使函数在其词法作用域之外执行。本质是函数 + 其引用的外部变量的组合。\n\n### 应用场景：\n\n- **数据私有化/封装**：模块模式，通过闭包隐藏内部状态\n- **函数工厂**：根据参数生成不同的函数\n- **防抖/节流**：利用闭包保存定时器 ID\n- **记忆化（Memoize）**：缓存函数计算结果\n- **偏函数/柯里化**\n\n### 注意事项：\n\n- 闭包会持有外部变量的引用，导致变量无法被垃圾回收，可能造成**内存泄漏**\n- 循环中使用闭包要注意变量共享问题（用 `let` 或 IIFE 解决）\n\n### 追问：经典的循环闭包问题如何解决？\n\n```javascript\n// 问题：输出5个5\nfor (var i = 0; i < 5; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// 解决1：用let（块级作用域，每次循环创建新的i）\nfor (let i = 0; i < 5; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// 解决2：IIFE\nfor (var i = 0; i < 5; i++) {\n  ((j) => setTimeout(() => console.log(j), 0))(i);\n}\n```',
    tags: ['JS核心', '闭包', '作用域']
  },
  {
    id: 4,
    title: '原型和原型链是什么？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 原型和原型链是什么？\n\n**答案：**\n每个函数都有 `prototype` 属性，指向原型对象；每个对象都有 `__proto__` 属性（内部 `[[Prototype]]`），指向其构造函数的 `prototype`。\n\n**原型链：** 访问对象属性时，先在对象自身查找，找不到则沿 `__proto__` 向上查找，直到 `Object.prototype`（其 `__proto__` 为 null），这条链就是原型链。\n\n```\n实例对象 → 构造函数.prototype → Object.prototype → null\n```\n\n### 追问：Object.create(null) 创建的对象有什么特点？\n\n`Object.create(null)` 创建的对象没有原型（`__proto__` 为 null），不继承任何属性和方法（包括 `toString`、`hasOwnProperty` 等）。常用于创建纯粹的字典对象，避免原型链上的属性干扰，如 Vue 的响应式系统内部使用。',
    tags: ['JS核心', '原型链', '继承']
  },
  {
    id: 5,
    title: 'this 的指向规则有哪些？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## this 的指向规则有哪些？\n\n**答案：**\n`this` 的值在**运行时**确定，取决于调用方式：\n\n- **默认绑定**：普通函数调用，非严格模式指向 `window`，严格模式为 `undefined`\n- **隐式绑定**：方法调用 `obj.fn()`，`this` 指向 `obj`\n- **显式绑定**：`call/apply/bind`，`this` 指向第一个参数\n- **new 绑定**：构造函数调用，`this` 指向新创建的对象\n- **箭头函数**：没有自己的 `this`，继承外层词法作用域的 `this`，不能被 call/apply/bind 改变\n\n优先级：new > 显式 > 隐式 > 默认\n\n### 追问：箭头函数和普通函数的区别？\n\n- 没有自己的 `this`，继承外层 `this`\n- 没有 `arguments` 对象（可用 rest 参数代替）\n- 不能作为构造函数（不能 new）\n- 没有 `prototype` 属性\n- 不能用 `yield`，不能作为 Generator 函数',
    tags: ['JS核心', 'this', '函数']
  },
  {
    id: 6,
    title: 'call、apply、bind 的区别？如何手写 bind？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## call、apply、bind 的区别？如何手写 bind？\n\n**答案：**\n\n- `call(thisArg, arg1, arg2, ...)`：立即执行，参数逐个传入\n- `apply(thisArg, [args])`：立即执行，参数以数组传入\n- `bind(thisArg, arg1, ...)`：返回新函数，不立即执行，支持柯里化\n\n### 手写 bind：\n\n```javascript\nFunction.prototype.myBind = function(context, ...args) {\n  const fn = this;\n  return function(...innerArgs) {\n    if (this instanceof fn) {\n      return new fn(...args, ...innerArgs);\n    }\n    return fn.apply(context, [...args, ...innerArgs]);\n  };\n};\n```\n\n### 追问：手写 call？\n\n```javascript\nFunction.prototype.myCall = function(context = window, ...args) {\n  const key = Symbol();\n  context[key] = this;\n  const result = context[key](...args);\n  delete context[key];\n  return result;\n};\n```',
    tags: ['JS核心', 'call/apply/bind', '手写']
  },
  {
    id: 7,
    title: '什么是事件循环（Event Loop）？宏任务和微任务的区别？',
    category: '异步编程',
    difficulty: 'hard',
    content: '## 什么是事件循环（Event Loop）？宏任务和微任务的区别？\n\n**答案：**\nJavaScript 是单线程的，通过事件循环处理异步任务。\n\n### 执行顺序：\n\n- 执行同步代码（调用栈）\n- 调用栈清空后，先执行所有**微任务**队列\n- 微任务队列清空后，执行一个**宏任务**\n- 再次执行所有微任务，如此循环\n\n**微任务（Microtask）：** `Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`、`async/await`\n\n**宏任务（Macrotask）：** `setTimeout`、`setInterval`、`setImmediate`、I/O、UI 渲染\n\n### 追问：以下代码的输出顺序？\n\n```javascript\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);\n```\n\n输出：1 → 4 → 3 → 2\n同步代码先执行（1、4），然后微任务（Promise.then → 3），最后宏任务（setTimeout → 2）。',
    tags: ['异步编程', 'Event Loop', '微任务']
  },
  {
    id: 8,
    title: 'Promise 的原理和常用方法？',
    category: '异步编程',
    difficulty: 'medium',
    content: '## Promise 的原理和常用方法？\n\n**答案：**\nPromise 是异步编程的解决方案，有三种状态：`pending`（等待）、`fulfilled`（成功）、`rejected`（失败），状态一旦改变不可逆。\n\n### 常用方法：\n\n- `Promise.resolve(value)`：返回成功的 Promise\n- `Promise.reject(reason)`：返回失败的 Promise\n- `Promise.all([p1, p2])`：全部成功才成功，有一个失败就失败\n- `Promise.allSettled([p1, p2])`：等所有 Promise 完成，返回每个结果（不管成功失败）\n- `Promise.race([p1, p2])`：第一个完成的结果（成功或失败）\n- `Promise.any([p1, p2])`：第一个成功的结果，全失败才失败\n\n### 追问：Promise.all 和 Promise.allSettled 的使用场景？\n\n- `Promise.all`：需要所有请求都成功才能继续，如同时请求多个接口，任一失败则整体失败\n- `Promise.allSettled`：需要知道所有请求的结果，不管成功失败，如批量操作后统计成功/失败数量',
    tags: ['异步编程', 'Promise', 'API']
  },
  {
    id: 9,
    title: 'async/await 的原理是什么？',
    category: '异步编程',
    difficulty: 'medium',
    content: '## async/await 的原理是什么？\n\n**答案：**\n`async/await` 是 Generator + Promise 的语法糖，让异步代码看起来像同步代码。\n\n- `async` 函数返回一个 Promise\n- `await` 暂停 async 函数的执行，等待 Promise resolve，然后恢复执行并返回结果\n- `await` 后面不是 Promise 时，会被包装成 `Promise.resolve(value)`\n\n### 错误处理：\n\n```javascript\n// 方式1：try/catch\nasync function fn() {\n  try {\n    const result = await fetchData();\n  } catch (err) {\n    console.error(err);\n  }\n}\n// 方式2：.catch()\nasync function fn() {\n  const result = await fetchData().catch(err => null);\n}\n```\n\n### 追问：async/await 和 Promise 链式调用有什么区别？\n\n功能等价，但 `async/await` 代码更易读，错误堆栈更清晰（Promise 链的错误堆栈有时不完整）。`async/await` 在循环中使用更方便（`for...of` + `await`），而 Promise 链在循环中需要用 `reduce` 或 `Promise.all`。',
    tags: ['异步编程', 'async/await', 'Generator']
  },
  {
    id: 10,
    title: '深拷贝和浅拷贝的区别？如何实现深拷贝？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 深拷贝和浅拷贝的区别？如何实现深拷贝？\n\n**答案：**\n\n- **浅拷贝**：只复制对象的第一层，嵌套对象仍然共享引用\n- **深拷贝**：递归复制所有层级，完全独立\n\n**浅拷贝方法：** `Object.assign()`、展开运算符 `{...obj}`、`Array.slice()`、`Array.concat()`\n\n**深拷贝方法：**\n\n- `JSON.parse(JSON.stringify(obj))`：简单快速，但不支持函数、undefined、Symbol、循环引用、Date 对象\n- `structuredClone(obj)`：原生 API，支持更多类型，不支持函数\n- 递归手写：\n\n```javascript\nfunction deepClone(obj, map = new WeakMap()) {\n  if (obj === null || typeof obj !== \'object\') return obj;\n  if (map.has(obj)) return map.get(obj); // 处理循环引用\n  const clone = Array.isArray(obj) ? [] : {};\n  map.set(obj, clone);\n  for (const key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      clone[key] = deepClone(obj[key], map);\n    }\n  }\n  return clone;\n}\n```\n\n### 追问：为什么用 WeakMap 而不是 Map 处理循环引用？\n\n`WeakMap` 的键是弱引用，不阻止垃圾回收。深拷贝完成后，`map` 变量离开作用域，`WeakMap` 中的键（原始对象）可以被 GC 回收，避免内存泄漏。',
    tags: ['JS核心', '深拷贝', 'WeakMap']
  },
  {
    id: 11,
    title: '防抖（debounce）和节流（throttle）的区别？如何实现？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 防抖（debounce）和节流（throttle）的区别？如何实现？\n\n**答案：**\n\n- **防抖**：事件触发后等待 n 毫秒再执行，期间再次触发则重新计时。适合搜索框输入、窗口 resize 结束后处理\n- **节流**：事件触发后 n 毫秒内只执行一次。适合滚动事件、鼠标移动、按钮防重复点击\n\n### 防抖实现：\n\n```javascript\nfunction debounce(fn, delay) {\n  let timer = null;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n```\n\n### 节流实现（时间戳版）：\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastTime = 0;\n  return function(...args) {\n    const now = Date.now();\n    if (now - lastTime >= interval) {\n      lastTime = now;\n      fn.apply(this, args);\n    }\n  };\n}\n```\n\n### 追问：防抖的立即执行版本如何实现？\n\n```javascript\nfunction debounce(fn, delay, immediate = false) {\n  let timer = null;\n  return function(...args) {\n    const callNow = immediate && !timer;\n    clearTimeout(timer);\n    timer = setTimeout(() => { timer = null; }, delay);\n    if (callNow) fn.apply(this, args);\n    else if (!immediate) {\n      clearTimeout(timer);\n      timer = setTimeout(() => fn.apply(this, args), delay);\n    }\n  };\n}\n```',
    tags: ['JS核心', '防抖', '节流']
  },
  {
    id: 12,
    title: 'ES6 有哪些重要新特性？',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## ES6 有哪些重要新特性？\n\n**答案：**\n\n- **let/const**：块级作用域，const 声明常量\n- **箭头函数**：简洁语法，继承外层 this\n- **模板字符串**：反引号，支持插值和多行\n- **解构赋值**：数组和对象解构\n- **展开运算符/rest 参数**：`...`\n- **默认参数**：函数参数默认值\n- **Promise**：异步编程\n- **class**：类语法糖\n- **模块化**：`import/export`\n- **Symbol**：唯一值类型\n- **Map/Set/WeakMap/WeakSet**：新数据结构\n- **Proxy/Reflect**：元编程\n- **Generator/Iterator**：迭代器协议\n- **for...of**：可迭代对象遍历\n\n### 追问：let、const、var 的区别？\n\n| | var | let | const |\n|--|-----|-----|-------|\n| 作用域 | 函数/全局 | 块级 | 块级 |\n| 变量提升 | 提升并初始化为 undefined | 提升但不初始化（TDZ） | 提升但不初始化（TDZ） |\n| 重复声明 | 可以 | 不可以 | 不可以 |\n| 重新赋值 | 可以 | 可以 | 不可以（引用不可变，值可变） |\n| 全局属性 | 挂到 window | 不挂 | 不挂 |',
    tags: ['ES6+', 'let/const', '新特性']
  },
  {
    id: 13,
    title: '什么是暂时性死区（TDZ）？',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## 什么是暂时性死区（TDZ）？\n\n**答案：**\n`let` 和 `const` 声明的变量存在暂时性死区（Temporal Dead Zone）。从代码块开始到变量声明语句之间，变量虽然已经存在于作用域中（提升了），但不能被访问，访问会抛出 `ReferenceError`。\n\n```javascript\nconsole.log(a); // ReferenceError: Cannot access \'a\' before initialization\nlet a = 1;\n```\n\n### 追问：var 的变量提升和 let 的提升有什么区别？\n\n`var` 提升时会初始化为 `undefined`，所以访问不会报错只会得到 `undefined`。`let/const` 提升时不初始化，处于 TDZ 状态，访问会报 `ReferenceError`。两者都会提升，区别在于初始化时机。',
    tags: ['ES6+', 'TDZ', '变量提升']
  },
  {
    id: 14,
    title: 'Map 和 Object 的区别？Set 和 Array 的区别？',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## Map 和 Object 的区别？Set 和 Array 的区别？\n\n### Map vs Object：\n\n- Map 的键可以是任意类型，Object 的键只能是字符串或 Symbol\n- Map 保持插入顺序，Object 不完全保证（数字键会排序）\n- Map 有 `size` 属性，Object 需要 `Object.keys().length`\n- Map 的迭代更方便（`for...of`），Object 需要 `Object.entries()`\n- Map 在频繁增删键值对时性能更好\n\n### Set vs Array：\n\n- Set 中的值唯一，Array 可以重复\n- Set 没有索引，不能通过下标访问\n- Set 的 `has()` 查找是 O(1)，Array 的 `includes()` 是 O(n)\n- 数组去重：`[...new Set(arr)]`\n\n### 追问：WeakMap 和 Map 的区别？\n\n`WeakMap` 的键必须是对象，且是弱引用（不阻止 GC），没有 `size` 属性，不可迭代。适合存储与对象关联的私有数据，对象被回收后，WeakMap 中对应的条目自动清除，避免内存泄漏。',
    tags: ['ES6+', 'Map/Set', '数据结构']
  },
  {
    id: 15,
    title: 'Proxy 和 Reflect 是什么？有什么应用？',
    category: 'ES6+',
    difficulty: 'hard',
    content: '## Proxy 和 Reflect 是什么？有什么应用？\n\n**Proxy：** 创建对象的代理，拦截对象的基本操作（读取、赋值、删除、函数调用等）。\n\n```javascript\nconst proxy = new Proxy(target, {\n  get(target, key) { return Reflect.get(target, key); },\n  set(target, key, value) { return Reflect.set(target, key, value); }\n});\n```\n\n**Reflect：** 提供操作对象的方法，与 Proxy 的 handler 方法一一对应，是操作对象的规范化 API。\n\n### 应用：\n\n- **Vue 3 响应式**：用 Proxy 替代 Vue 2 的 `Object.defineProperty`，可以拦截数组变化和新增属性\n- **数据验证**：在 set 中校验数据\n- **日志记录**：拦截所有操作记录日志\n- **只读对象**：在 set 中抛出错误\n\n### 追问：Vue 3 为什么用 Proxy 替代 Object.defineProperty？\n\n`Object.defineProperty` 的局限：只能监听已有属性，无法检测新增/删除属性；无法监听数组下标变化和 length 变化；需要递归遍历所有属性，初始化性能差。Proxy 的优势：可以拦截整个对象包括新增属性；可以拦截数组操作；懒代理，初始化性能更好。',
    tags: ['ES6+', 'Proxy', 'Vue3']
  },
  {
    id: 16,
    title: '什么是 Generator 函数？有什么应用？',
    category: 'ES6+',
    difficulty: 'medium',
    content: '## 什么是 Generator 函数？有什么应用？\n\n**答案：**\nGenerator 是可以暂停和恢复执行的函数，用 `function*` 声明，通过 `yield` 暂停，返回迭代器对象，调用 `.next()` 恢复执行。\n\n```javascript\nfunction* gen() {\n  yield 1;\n  yield 2;\n  return 3;\n}\nconst g = gen();\ng.next(); // { value: 1, done: false }\ng.next(); // { value: 2, done: false }\ng.next(); // { value: 3, done: true }\n```\n\n### 应用：\n\n- 实现迭代器协议\n- 异步流程控制（`async/await` 的底层原理）\n- 无限序列生成\n- Redux-Saga 中的副作用管理\n\n### 追问：async/await 和 Generator 的关系？\n\n`async/await` 是 Generator + Promise + 自动执行器的语法糖。`async` 函数相当于自带执行器的 Generator，`await` 相当于 `yield`，执行器自动处理 Promise 的 resolve/reject 并调用 `next()`。',
    tags: ['ES6+', 'Generator', '迭代器']
  },
  {
    id: 17,
    title: '什么是模块化？CommonJS 和 ES Module 的区别？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 什么是模块化？CommonJS 和 ES Module 的区别？\n\n### CommonJS（Node.js）：\n\n- `require()` 同步加载，运行时加载\n- `module.exports` 导出，导出的是值的**拷贝**\n- 可以动态 require（在条件语句中）\n\n### ES Module：\n\n- `import/export` 静态分析，编译时确定依赖\n- 导出的是值的**引用**（live binding），导出值变化，导入方也会变化\n- 支持 Tree Shaking（静态分析可以删除未使用的代码）\n- 顶层 `await` 支持\n\n### 追问：为什么 ES Module 支持 Tree Shaking 而 CommonJS 不支持？\n\nES Module 的 `import/export` 是静态的，编译时就能确定哪些模块被使用，打包工具可以静态分析依赖图，删除未引用的代码。CommonJS 的 `require` 是动态的（可以在运行时根据条件加载），无法在编译时确定哪些代码会被用到。',
    tags: ['JS核心', '模块化', 'ESM']
  },
  {
    id: 18,
    title: '什么是垃圾回收机制？V8 的垃圾回收策略？',
    category: 'JS核心',
    difficulty: 'hard',
    content: '## 什么是垃圾回收机制？V8 的垃圾回收策略？\n\n**答案：**\n垃圾回收（GC）自动管理内存，回收不再使用的对象。\n\n**标记清除（Mark-Sweep）：** 从根对象出发，标记所有可达对象，清除未标记的对象。现代 JS 引擎的主要算法。\n\n### V8 的分代回收：\n\n- **新生代（Young Generation）**：存放短期存活的对象，使用 Scavenge 算法（复制算法），将存活对象复制到另一半空间，速度快\n- **老生代（Old Generation）**：存放长期存活的对象，使用标记清除 + 标记整理算法\n\n### 追问：什么情况会导致内存泄漏？\n\n- **意外的全局变量**：未声明的变量赋值（非严格模式）\n- **闭包**：闭包持有大对象的引用\n- **未清除的定时器**：`setInterval` 未 `clearInterval`\n- **DOM 引用**：JS 中保存了已删除 DOM 节点的引用\n- **事件监听器**：未移除的事件监听器\n- **WeakMap/WeakSet 以外的缓存**：缓存无限增长',
    tags: ['JS核心', '垃圾回收', 'V8']
  },
  {
    id: 19,
    title: '什么是执行上下文和作用域链？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 什么是执行上下文和作用域链？\n\n### 执行上下文（Execution Context）：\nJS 代码执行时创建的环境，包含：\n\n- 变量对象（Variable Object）：存储变量、函数声明\n- 作用域链（Scope Chain）：当前上下文 + 所有父级上下文的变量对象\n- `this` 值\n\n### 执行上下文栈（调用栈）：\n管理执行上下文的栈结构，全局上下文在底部，函数调用时压栈，返回时出栈。\n\n### 作用域链：\n查找变量时，从当前作用域开始，沿作用域链向上查找，直到全局作用域。作用域链在函数**定义时**确定（词法作用域），而非调用时。\n\n### 追问：词法作用域和动态作用域的区别？\n\n- **词法作用域（静态作用域）**：作用域在代码书写时确定，JS 使用词法作用域\n- **动态作用域**：作用域在函数调用时确定，Bash 等语言使用动态作用域\n\nJS 中 `this` 的行为类似动态作用域（运行时确定），但变量查找是词法作用域。',
    tags: ['JS核心', '执行上下文', '作用域']
  },
  {
    id: 20,
    title: '什么是柯里化（Currying）？如何实现？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 什么是柯里化（Currying）？如何实现？\n\n**答案：**\n柯里化是将接受多个参数的函数转换为一系列接受单个参数的函数的技术。\n\n```javascript\n// 普通函数\nconst add = (a, b, c) => a + b + c;\n// 柯里化后\nconst curriedAdd = curry(add);\ncurriedAdd(1)(2)(3); // 6\ncurriedAdd(1, 2)(3); // 6\n```\n\n### 实现：\n\n```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return function(...args2) {\n      return curried.apply(this, args.concat(args2));\n    };\n  };\n}\n```\n\n**应用：** 参数复用、延迟执行、函数组合\n\n### 追问：柯里化和偏函数（Partial Application）的区别？\n\n- **柯里化**：每次只接受一个参数，返回新函数，直到参数满足\n- **偏函数**：固定部分参数，返回接受剩余参数的新函数，一次可以固定多个参数\n\n`fn.bind(null, arg1)` 就是偏函数应用。',
    tags: ['JS核心', '柯里化', '函数式']
  },
  {
    id: 21,
    title: '什么是 Symbol？有哪些应用场景？',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## 什么是 Symbol？有哪些应用场景？\n\n**答案：**\nSymbol 是 ES6 新增的基本类型，每个 Symbol 值都是唯一的，不可变。\n\n```javascript\nconst s1 = Symbol(\'desc\');\nconst s2 = Symbol(\'desc\');\ns1 === s2; // false\n```\n\n### 应用场景：\n\n- **对象唯一属性键**：避免属性名冲突（如 Mixin 模式）\n- **私有属性模拟**：Symbol 属性不会出现在 `for...in`、`Object.keys()` 中\n- **内置 Symbol**：`Symbol.iterator`（迭代器）、`Symbol.toPrimitive`（类型转换）、`Symbol.hasInstance` 等\n- **常量枚举**：保证常量值唯一\n\n### 追问：Symbol.iterator 有什么用？\n\n`Symbol.iterator` 是定义对象迭代行为的方法，实现了该方法的对象是可迭代的，可以用 `for...of` 遍历。数组、字符串、Map、Set 都内置了 `Symbol.iterator`。',
    tags: ['ES6+', 'Symbol', '唯一值']
  },
  {
    id: 22,
    title: 'for...in 和 for...of 的区别？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## for...in 和 for...of 的区别？\n\n**答案：**\n\n- `for...in`：遍历对象的**可枚举属性键**（包括原型链上的），主要用于对象，不推荐用于数组\n- `for...of`：遍历**可迭代对象的值**（实现了 `Symbol.iterator`），适用于数组、字符串、Map、Set、Generator\n\n```javascript\nconst arr = [1, 2, 3];\nfor (const key in arr) console.log(key); // \'0\', \'1\', \'2\'（字符串键）\nfor (const val of arr) console.log(val); // 1, 2, 3（值）\n```\n\n### 追问：如何让普通对象支持 for...of？\n\n```javascript\nconst obj = { a: 1, b: 2 };\nobj[Symbol.iterator] = function() {\n  const entries = Object.entries(this);\n  let index = 0;\n  return {\n    next() {\n      return index < entries.length\n        ? { value: entries[index++], done: false }\n        : { done: true };\n    }\n  };\n};\nfor (const [k, v] of obj) console.log(k, v);\n```',
    tags: ['JS基础', 'for...in', 'for...of']
  },
  {
    id: 23,
    title: '什么是 Object.defineProperty？有哪些应用？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 什么是 Object.defineProperty？有哪些应用？\n\n**答案：**\n`Object.defineProperty(obj, prop, descriptor)` 精确定义或修改对象属性，可以控制属性的特性：\n\n- `value`：属性值\n- `writable`：是否可写\n- `enumerable`：是否可枚举（`for...in`、`Object.keys`）\n- `configurable`：是否可删除/重新定义\n- `get`：getter 函数\n- `set`：setter 函数\n\n### 应用：\n\n- **Vue 2 响应式**：通过 getter/setter 拦截属性访问和修改\n- **只读属性**：`writable: false`\n- **隐藏属性**：`enumerable: false`\n\n### 追问：Object.freeze() 和 Object.seal() 的区别？\n\n- `Object.freeze()`：冻结对象，不能添加/删除/修改属性（深层对象不受影响，浅冻结）\n- `Object.seal()`：密封对象，不能添加/删除属性，但可以修改已有属性的值',
    tags: ['JS核心', 'defineProperty', 'Vue2']
  },
  {
    id: 24,
    title: '什么是事件委托？有什么优势？',
    category: 'DOM/BOM',
    difficulty: 'easy',
    content: '## 什么是事件委托？有什么优势？\n\n**答案：**\n事件委托是利用事件冒泡，将子元素的事件监听器绑定到父元素上，通过 `event.target` 判断实际触发元素。\n\n```javascript\ndocument.getElementById(\'list\').addEventListener(\'click\', (e) => {\n  if (e.target.tagName === \'LI\') {\n    console.log(e.target.textContent);\n  }\n});\n```\n\n### 优势：\n\n- 减少事件监听器数量，节省内存\n- 动态添加的子元素自动具有事件处理能力，无需重新绑定\n- 代码更简洁\n\n### 追问：事件冒泡和事件捕获的区别？如何阻止？\n\n- **捕获阶段**：事件从 window → document → ... → 目标元素\n- **目标阶段**：事件到达目标元素\n- **冒泡阶段**：事件从目标元素 → ... → window\n\n`addEventListener` 第三个参数为 `true` 时在捕获阶段触发，默认 `false` 在冒泡阶段触发。\n\n- `e.stopPropagation()`：阻止事件继续传播\n- `e.preventDefault()`：阻止默认行为\n- `e.stopImmediatePropagation()`：阻止传播且阻止同元素上其他同类型监听器执行',
    tags: ['DOM/BOM', '事件委托', '事件冒泡']
  },
  {
    id: 25,
    title: '什么是 requestAnimationFrame？和 setTimeout 的区别？',
    category: 'DOM/BOM',
    difficulty: 'medium',
    content: '## 什么是 requestAnimationFrame？和 setTimeout 的区别？\n\n**答案：**\n`requestAnimationFrame(callback)` 在浏览器下次重绘前执行回调，通常是每秒 60 次（与屏幕刷新率同步）。\n\n### 与 setTimeout 的区别：\n\n- **精确性**：rAF 与屏幕刷新同步，不会丢帧；setTimeout 受事件循环影响，可能不准时\n- **性能**：rAF 在页面不可见时（切换标签页）自动暂停，节省资源；setTimeout 继续执行\n- **批处理**：浏览器可以将多个 rAF 回调合并优化\n\n### 追问：如何用 rAF 实现一个平滑动画？\n\n```javascript\nfunction animate(element, target, duration) {\n  const start = performance.now();\n  const startPos = parseInt(element.style.left) || 0;\n  function step(timestamp) {\n    const progress = Math.min((timestamp - start) / duration, 1);\n    element.style.left = startPos + (target - startPos) * progress + \'px\';\n    if (progress < 1) requestAnimationFrame(step);\n  }\n  requestAnimationFrame(step);\n}\n```',
    tags: ['DOM/BOM', 'rAF', '动画']
  },
  {
    id: 26,
    title: '什么是 MutationObserver？有什么应用？',
    category: 'DOM/BOM',
    difficulty: 'medium',
    content: '## 什么是 MutationObserver？有什么应用？\n\n**答案：**\n`MutationObserver` 异步监听 DOM 变化（子节点增删、属性变化、文本内容变化），回调在微任务队列中执行。\n\n```javascript\nconst observer = new MutationObserver((mutations) => {\n  mutations.forEach(mutation => console.log(mutation));\n});\nobserver.observe(element, {\n  childList: true,   // 监听子节点变化\n  attributes: true,  // 监听属性变化\n  subtree: true      // 监听所有后代\n});\nobserver.disconnect(); // 停止监听\n```\n\n### 应用：\n\n- Vue 2 的 nextTick 降级方案\n- 富文本编辑器监听内容变化\n- 无限滚动、懒加载\n- 第三方内容注入检测\n\n### 追问：MutationObserver 和 IntersectionObserver 的区别？\n\n- `MutationObserver`：监听 DOM 结构变化\n- `IntersectionObserver`：监听元素与视口的交叉状态，常用于懒加载、无限滚动、曝光统计',
    tags: ['DOM/BOM', 'Observer', 'DOM监听']
  },
  {
    id: 27,
    title: '正则表达式常用语法和应用？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## 正则表达式常用语法和应用？\n\n### 常用元字符：\n\n- `.`：任意字符（除换行）\n- `\\d`：数字，`\\w`：字母数字下划线，`\\s`：空白字符\n- `^`：开头，`$`：结尾\n- `*`：0 次或多次，`+`：1 次或多次，`?`：0 次或 1 次\n- `{n,m}`：n 到 m 次\n- `()`：分组，`|`：或，`[]`：字符集\n\n### 常用方法：\n\n- `test(str)`：测试是否匹配\n- `match(reg)`：返回匹配结果\n- `replace(reg, str)`：替换\n- `split(reg)`：分割\n\n### 追问：贪婪匹配和非贪婪匹配的区别？\n\n- **贪婪**（默认）：尽可能多地匹配，如 `.*` 匹配尽可能长的字符串\n- **非贪婪**：在量词后加 `?`，尽可能少地匹配，如 `.*?`\n\n例：`"<a><b>"` 用 `<.*>` 匹配整个字符串，用 `<.*?>` 只匹配 `<a>`。',
    tags: ['JS基础', '正则表达式', 'RegExp']
  },
  {
    id: 28,
    title: 'Object.keys()、Object.values()、Object.entries() 的区别？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## Object.keys()、Object.values()、Object.entries() 的区别？\n\n**答案：**\n\n- `Object.keys(obj)`：返回自身可枚举属性的**键**数组\n- `Object.values(obj)`：返回自身可枚举属性的**值**数组\n- `Object.entries(obj)`：返回自身可枚举属性的 **[键, 值]** 数组\n\n都不包含原型链上的属性，都不包含 Symbol 键。\n\n### 追问：如何遍历包含 Symbol 键的对象？\n\n- `Object.getOwnPropertySymbols(obj)`：返回所有 Symbol 键\n- `Reflect.ownKeys(obj)`：返回所有自身属性键（包括字符串键和 Symbol 键）',
    tags: ['JS基础', 'Object', '遍历']
  },
  {
    id: 29,
    title: '什么是 Proxy 的 handler.get 陷阱？如何实现链式调用？',
    category: 'ES6+',
    difficulty: 'hard',
    content: '## 什么是 Proxy 的 handler.get 陷阱？如何实现链式调用？\n\n```javascript\n// 实现任意深度的链式属性访问，最后调用时执行\nfunction createChain(fn) {\n  const path = [];\n  return new Proxy({}, {\n    get(target, key) {\n      if (key === \'execute\') return () => fn(path);\n      path.push(key);\n      return createChain(fn); // 返回新代理继续链式\n    }\n  });\n}\n```\n\n### 追问：如何用 Proxy 实现数据验证？\n\n```javascript\nconst validator = new Proxy({}, {\n  set(target, key, value) {\n    if (key === \'age\') {\n      if (typeof value !== \'number\' || value < 0 || value > 150) {\n        throw new TypeError(\'年龄必须是0-150的数字\');\n      }\n    }\n    target[key] = value;\n    return true;\n  }\n});\n```',
    tags: ['ES6+', 'Proxy', '链式调用']
  },
  {
    id: 30,
    title: '什么是 Reflect？为什么要配合 Proxy 使用？',
    category: 'ES6+',
    difficulty: 'medium',
    content: '## 什么是 Reflect？为什么要配合 Proxy 使用？\n\n**答案：**\n`Reflect` 提供了操作对象的静态方法，与 `Proxy` 的 handler 方法一一对应。\n\n### 为什么配合 Proxy 使用：\n\n- `Reflect` 方法的返回值更规范（如 `Reflect.set` 返回 boolean，而直接赋值失败会抛错）\n- 确保正确的 `this` 绑定（`Reflect.get(target, key, receiver)` 中 receiver 保证 getter 中 this 正确）\n- 代码语义更清晰，表明这是对对象的元操作\n\n```javascript\nconst proxy = new Proxy(target, {\n  get(target, key, receiver) {\n    return Reflect.get(target, key, receiver);\n  }\n});\n```\n\n### 追问：receiver 参数有什么作用？\n\n`receiver` 是 Proxy 实例本身（或继承的对象），在 getter/setter 中作为 `this` 使用。如果目标对象的属性是 getter，不传 receiver 时 getter 中的 `this` 指向原始对象而非代理，可能导致响应式系统失效。Vue 3 的响应式系统中正确使用了 receiver 来确保嵌套对象的响应式追踪。',
    tags: ['ES6+', 'Reflect', '元编程']
  },
  {
    id: 31,
    title: '什么是尾调用优化（TCO）？',
    category: 'JS核心',
    difficulty: 'hard',
    content: '## 什么是尾调用优化（TCO）？\n\n**答案：**\n尾调用是指函数的最后一步是调用另一个函数。尾调用优化（TCO）是指引擎在尾调用时不创建新的调用栈帧，而是复用当前栈帧，避免栈溢出。\n\n```javascript\n// 普通递归（可能栈溢出）\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1); // 不是尾调用\n}\n// 尾递归优化\nfunction factorial(n, acc = 1) {\n  if (n <= 1) return acc;\n  return factorial(n - 1, n * acc); // 尾调用\n}\n```\n\n### 追问：现代 JS 引擎都支持 TCO 吗？\n\nES6 规范要求支持严格模式下的尾调用优化，但实际上只有 Safari/JavaScriptCore 完整实现了。V8（Chrome/Node.js）曾实现后又移除，原因是 TCO 会影响调试（调用栈信息丢失）。实际开发中不能依赖 TCO，大递归应改用迭代或蹦床函数（trampoline）。',
    tags: ['JS核心', '尾调用', '递归']
  },
  {
    id: 32,
    title: '什么是 WeakRef 和 FinalizationRegistry？',
    category: 'ES6+',
    difficulty: 'hard',
    content: '## 什么是 WeakRef 和 FinalizationRegistry？\n\n**答案：**\n\n- **WeakRef**：创建对象的弱引用，不阻止 GC 回收。通过 `.deref()` 获取对象，如果已被回收则返回 `undefined`\n- **FinalizationRegistry**：注册回调，在对象被 GC 回收后执行清理操作\n\n```javascript\nlet obj = { name: \'test\' };\nconst ref = new WeakRef(obj);\nobj = null; // 允许 GC 回收\n// 稍后\nconst val = ref.deref(); // 可能是对象或 undefined\n```\n\n### 追问：什么场景会用到 WeakRef？\n\n缓存场景：缓存大对象，但不想阻止 GC 回收。当内存紧张时，GC 可以回收缓存的对象，通过 `deref()` 检查是否还存在，不存在则重新计算/请求。',
    tags: ['ES6+', 'WeakRef', '内存管理']
  },
  {
    id: 33,
    title: 'Array 的常用方法有哪些？map、filter、reduce 的区别？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## Array 的常用方法有哪些？map、filter、reduce 的区别？\n\n### 遍历类：\n`forEach`、`map`、`filter`、`reduce`、`find`、`findIndex`、`some`、`every`、`flat`、`flatMap`\n\n### 修改类：\n`push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`、`fill`\n\n### 不修改类：\n`slice`、`concat`、`join`、`indexOf`、`includes`、`flat`\n\n### 区别：\n\n- `map`：返回新数组，每个元素是回调的返回值，长度不变\n- `filter`：返回新数组，只包含回调返回 true 的元素，长度可能变短\n- `reduce`：将数组归并为单个值，可以实现 map、filter 等所有操作\n\n### 追问：用 reduce 实现 map 和 filter？\n\n```javascript\n// 实现 map\nArray.prototype.myMap = function(fn) {\n  return this.reduce((acc, cur, i) => {\n    acc.push(fn(cur, i, this));\n    return acc;\n  }, []);\n};\n// 实现 filter\nArray.prototype.myFilter = function(fn) {\n  return this.reduce((acc, cur, i) => {\n    if (fn(cur, i, this)) acc.push(cur);\n    return acc;\n  }, []);\n};\n```',
    tags: ['JS基础', 'Array', '数组方法']
  },
  {
    id: 34,
    title: '什么是可选链（?.）和空值合并（??）？',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## 什么是可选链（?.）和空值合并（??）？\n\n### 可选链 `?.`：\n安全访问深层属性，如果中间某个值为 `null` 或 `undefined`，返回 `undefined` 而不是抛错。\n\n```javascript\nconst city = user?.address?.city; // 不会报错\nconst fn = obj?.method?.(); // 安全调用方法\nconst val = arr?.[0]; // 安全访问数组\n```\n\n### 空值合并 `??`：\n只有左侧为 `null` 或 `undefined` 时才返回右侧值（区别于 `||` 会对所有假值生效）。\n\n```javascript\nconst val = data ?? \'default\'; // data 为 0 或 \'\' 时不触发\nconst val2 = data || \'default\'; // data 为 0 或 \'\' 时也会返回 \'default\'\n```\n\n### 追问：??=、||=、&&= 是什么？\n\n逻辑赋值运算符（ES2021）：\n\n- `a ??= b`：a 为 null/undefined 时才赋值 b\n- `a ||= b`：a 为假值时才赋值 b\n- `a &&= b`：a 为真值时才赋值 b',
    tags: ['ES6+', '可选链', '空值合并']
  },
  {
    id: 35,
    title: '什么是 structuredClone？',
    category: 'JS核心',
    difficulty: 'easy',
    content: '## 什么是 structuredClone？\n\n**答案：**\n`structuredClone()` 是浏览器和 Node.js 18+ 内置的深拷贝 API，使用结构化克隆算法。\n\n**支持：** 对象、数组、Date、RegExp、Map、Set、ArrayBuffer、Blob、File、ImageData、循环引用\n\n**不支持：** 函数、DOM 节点、Symbol 键、原型链（只复制自身属性）\n\n```javascript\nconst clone = structuredClone(original);\n```\n\n### 追问：相比 JSON.parse(JSON.stringify()) 有什么优势？\n\n- 支持循环引用（JSON 方法会报错）\n- 支持 Date（JSON 方法会转为字符串）\n- 支持 Map、Set、ArrayBuffer 等（JSON 方法不支持）\n- 不支持函数（两者都不支持）\n- 性能通常更好（原生实现）',
    tags: ['JS核心', 'structuredClone', '深拷贝']
  },
  {
    id: 36,
    title: '什么是 Promise.race 的应用场景？',
    category: '异步编程',
    difficulty: 'easy',
    content: '## 什么是 Promise.race 的应用场景？\n\n**答案：**\n`Promise.race` 返回第一个完成（resolve 或 reject）的 Promise 结果。\n\n### 应用场景：\n\n**请求超时控制：**\n\n```javascript\nfunction fetchWithTimeout(url, timeout = 5000) {\n  const fetchPromise = fetch(url);\n  const timeoutPromise = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error(\'请求超时\')), timeout)\n  );\n  return Promise.race([fetchPromise, timeoutPromise]);\n}\n```\n\n**多个数据源竞速**：同时请求多个镜像，取最快响应的\n\n### 追问：Promise.any 和 Promise.race 的区别？\n\n- `Promise.race`：第一个完成（无论成功失败）就返回\n- `Promise.any`：第一个**成功**的才返回，全部失败才 reject（AggregateError）',
    tags: ['异步编程', 'Promise.race', '超时控制']
  },
  {
    id: 37,
    title: '什么是 Object.assign 的注意事项？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## 什么是 Object.assign 的注意事项？\n\n**答案：**\n`Object.assign(target, ...sources)` 将源对象的**自身可枚举属性**浅拷贝到目标对象。\n\n### 注意事项：\n\n- 浅拷贝，嵌套对象共享引用\n- 同名属性后面的覆盖前面的\n- 不复制原型链上的属性\n- 不复制不可枚举属性\n- 会复制 Symbol 键的属性\n\n### 追问：如何合并两个对象的深层属性？\n\n`Object.assign` 只能浅合并。深层合并需要递归处理，或使用 lodash 的 `_.merge()`，或手写递归合并函数。',
    tags: ['JS基础', 'Object.assign', '对象合并']
  },
  {
    id: 38,
    title: '什么是 Array.from 和 Array.of？',
    category: 'JS基础',
    difficulty: 'easy',
    content: '## 什么是 Array.from 和 Array.of？\n\n**答案：**\n\n- `Array.from(arrayLike, mapFn)`：将类数组或可迭代对象转为数组，可选映射函数\n\n```javascript\nArray.from(\'hello\'); // [\'h\',\'e\',\'l\',\'l\',\'o\']\nArray.from({ length: 3 }, (_, i) => i); // [0, 1, 2]\nArray.from(new Set([1, 2, 3])); // [1, 2, 3]\n```\n\n- `Array.of(...args)`：将参数列表转为数组（解决 `new Array(3)` 创建空槽的问题）\n\n```javascript\nArray.of(3); // [3]（而非 new Array(3) 的 [,,]）\n```\n\n### 追问：类数组对象和可迭代对象的区别？\n\n- **类数组**：有 `length` 属性和数字索引，如 `arguments`、DOM NodeList，但没有数组方法\n- **可迭代对象**：实现了 `Symbol.iterator`，如 Array、String、Map、Set、Generator\n\n两者都可以用 `Array.from` 转换，但 `...` 展开运算符只能用于可迭代对象。',
    tags: ['JS基础', 'Array.from', '类数组']
  },
  {
    id: 39,
    title: '什么是 Intl 国际化 API？',
    category: 'Web API',
    difficulty: 'easy',
    content: '## 什么是 Intl 国际化 API？\n\n**答案：**\n`Intl` 是 ECMAScript 国际化 API，提供语言敏感的字符串比较、数字格式化、日期时间格式化等。\n\n```javascript\n// 数字格式化\nnew Intl.NumberFormat(\'zh-CN\', { style: \'currency\', currency: \'CNY\' })\n  .format(1234.5); // ¥1,234.50\n\n// 日期格式化\nnew Intl.DateTimeFormat(\'zh-CN\', { dateStyle: \'full\' })\n  .format(new Date()); // 2024年1月1日星期一\n\n// 相对时间\nnew Intl.RelativeTimeFormat(\'zh-CN\').format(-1, \'day\'); // 1天前\n```\n\n### 追问：项目中如何实现多语言切换？\n\n结合 `vue-i18n`：定义语言包（JSON 文件），通过 `$t(\'key\')` 调用翻译，切换语言时更新 `i18n.locale`。接口请求的国际化通过在请求头中传递 `Accept-Language` 或自定义语言参数实现。',
    tags: ['Web API', 'Intl', '国际化']
  },
  {
    id: 40,
    title: '什么是 AbortController？如何取消请求？',
    category: 'Web API',
    difficulty: 'medium',
    content: '## 什么是 AbortController？如何取消请求？\n\n**答案：**\n`AbortController` 用于取消 fetch 请求或其他异步操作。\n\n```javascript\nconst controller = new AbortController();\nconst { signal } = controller;\n\nfetch(\'/api/data\', { signal })\n  .then(res => res.json())\n  .catch(err => {\n    if (err.name === \'AbortError\') console.log(\'请求已取消\');\n  });\n\n// 取消请求\ncontroller.abort();\n```\n\n### 应用场景：\n\n- 组件卸载时取消未完成的请求（React useEffect cleanup、Vue onUnmounted）\n- 搜索框输入时取消上一次请求\n- 超时取消\n\n### 追问：Vue 中如何在组件卸载时自动取消请求？\n\n```javascript\n// Vue 3 Composition API\nconst controller = new AbortController();\nonUnmounted(() => controller.abort());\nconst data = await fetch(\'/api\', { signal: controller.signal });\n```',
    tags: ['Web API', 'AbortController', 'fetch']
  },
  {
    id: 41,
    title: '什么是 structuredClone 不能克隆的内容？',
    category: 'JS核心',
    difficulty: 'easy',
    content: '## 什么是 structuredClone 不能克隆的内容？\n\n**答案：**\n不能克隆：\n\n- **函数**：会抛出 `DataCloneError`\n- **DOM 节点**：会抛出错误\n- **原型链**：只复制自身属性，原型信息丢失\n- **Symbol 键**：不会复制\n- **Error 对象的某些属性**：stack 等可能丢失\n- **WeakMap/WeakSet**：不支持\n\n### 追问：如何克隆一个包含函数的对象？\n\n没有完美方案。可以：\n\n- 手写递归深拷贝，对函数直接引用（不克隆）\n- 使用 lodash `_.cloneDeepWith` 自定义克隆逻辑\n- 序列化时跳过函数属性，反序列化后手动补充',
    tags: ['JS核心', '克隆', '序列化']
  },
  {
    id: 42,
    title: '什么是 Object.freeze 的深冻结？',
    category: 'JS核心',
    difficulty: 'easy',
    content: '## 什么是 Object.freeze 的深冻结？\n\n**答案：**\n`Object.freeze` 只冻结对象的第一层（浅冻结），嵌套对象仍然可以修改。\n\n### 深冻结实现：\n\n```javascript\nfunction deepFreeze(obj) {\n  Object.getOwnPropertyNames(obj).forEach(name => {\n    const value = obj[name];\n    if (typeof value === \'object\' && value !== null) {\n      deepFreeze(value);\n    }\n  });\n  return Object.freeze(obj);\n}\n```\n\n### 追问：冻结对象和 const 声明有什么区别？\n\n- `const`：变量绑定不可变（不能重新赋值），但对象内容可以修改\n- `Object.freeze()`：对象内容不可变（属性不能增删改），但变量绑定可以重新赋值',
    tags: ['JS核心', 'Object.freeze', '不可变']
  },
  {
    id: 43,
    title: '什么是 Promise 的链式调用原理？',
    category: '异步编程',
    difficulty: 'hard',
    content: '## 什么是 Promise 的链式调用原理？\n\n**答案：**\n`then()` 方法返回一个新的 Promise，这个新 Promise 的状态由回调函数的返回值决定：\n\n- 回调返回普通值 → 新 Promise resolve 该值\n- 回调返回 Promise → 新 Promise 跟随该 Promise 的状态\n- 回调抛出错误 → 新 Promise reject 该错误\n\n### 追问：手写一个简单的 Promise？\n\n```javascript\nclass MyPromise {\n  constructor(executor) {\n    this.state = \'pending\';\n    this.value = undefined;\n    this.callbacks = [];\n    const resolve = (value) => {\n      if (this.state !== \'pending\') return;\n      this.state = \'fulfilled\';\n      this.value = value;\n      this.callbacks.forEach(cb => cb.onFulfilled(value));\n    };\n    const reject = (reason) => {\n      if (this.state !== \'pending\') return;\n      this.state = \'rejected\';\n      this.value = reason;\n      this.callbacks.forEach(cb => cb.onRejected(reason));\n    };\n    try { executor(resolve, reject); }\n    catch (e) { reject(e); }\n  }\n  then(onFulfilled, onRejected) {\n    return new MyPromise((resolve, reject) => {\n      const handle = (fn, val) => {\n        try {\n          const result = fn ? fn(val) : val;\n          result instanceof MyPromise\n            ? result.then(resolve, reject)\n            : resolve(result);\n        } catch (e) { reject(e); }\n      };\n      if (this.state === \'fulfilled\') handle(onFulfilled, this.value);\n      else if (this.state === \'rejected\') handle(onRejected, this.value);\n      else this.callbacks.push({\n        onFulfilled: val => handle(onFulfilled, val),\n        onRejected: val => handle(onRejected, val)\n      });\n    });\n  }\n}\n```',
    tags: ['异步编程', 'Promise', '手写']
  },
  {
    id: 44,
    title: '什么是 Iterator 迭代器协议？',
    category: 'ES6+',
    difficulty: 'medium',
    content: '## 什么是 Iterator 迭代器协议？\n\n**答案：**\n迭代器协议要求对象实现 `next()` 方法，每次调用返回 `{ value, done }` 对象：\n\n- `done: false`：还有值，`value` 是当前值\n- `done: true`：迭代完成，`value` 通常是 `undefined`\n\n可迭代协议要求对象实现 `[Symbol.iterator]()` 方法，返回迭代器。\n\n```javascript\nfunction range(start, end) {\n  return {\n    [Symbol.iterator]() {\n      let current = start;\n      return {\n        next() {\n          return current <= end\n            ? { value: current++, done: false }\n            : { done: true };\n        }\n      };\n    }\n  };\n}\nfor (const n of range(1, 5)) console.log(n); // 1 2 3 4 5\n```\n\n### 追问：for...of 的底层原理？\n\n`for...of` 调用对象的 `[Symbol.iterator]()` 获取迭代器，然后循环调用 `next()`，直到 `done: true`。',
    tags: ['ES6+', 'Iterator', '可迭代']
  },
  {
    id: 45,
    title: '什么是 Object.create 和原型继承？',
    category: 'JS核心',
    difficulty: 'medium',
    content: '## 什么是 Object.create 和原型继承？\n\n**答案：**\n`Object.create(proto, propertiesObject)` 创建一个新对象，以 `proto` 为原型。\n\n```javascript\nconst animal = {\n  speak() { console.log(`${this.name} makes a sound`); }\n};\nconst dog = Object.create(animal);\ndog.name = \'Rex\';\ndog.speak(); // Rex makes a sound\n```\n\n### ES6 class 继承的底层：\n\n```javascript\nclass Animal { speak() {} }\nclass Dog extends Animal { bark() {} }\n// 等价于\nDog.prototype = Object.create(Animal.prototype);\nDog.prototype.constructor = Dog;\n```\n\n### 追问：new 操作符做了什么？\n\n- 创建一个空对象\n- 将空对象的 `__proto__` 指向构造函数的 `prototype`\n- 以新对象为 `this` 执行构造函数\n- 如果构造函数返回对象则返回该对象，否则返回新创建的对象',
    tags: ['JS核心', 'Object.create', '继承']
  },
  {
    id: 46,
    title: '什么是 class 的私有字段？',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## 什么是 class 的私有字段？\n\n**答案：**\nES2022 引入私有字段，用 `#` 前缀声明，只能在类内部访问：\n\n```javascript\nclass Counter {\n  #count = 0; // 私有字段\n  increment() { this.#count++; }\n  get value() { return this.#count; }\n}\nconst c = new Counter();\nc.increment();\nconsole.log(c.value); // 1\nconsole.log(c.#count); // SyntaxError\n```\n\n### 追问：私有字段和 Symbol 模拟私有属性的区别？\n\n- 私有字段（`#`）：真正的私有，外部完全无法访问\n- Symbol 模拟：可以通过 `Object.getOwnPropertySymbols` 获取，不是真正私有\n- 闭包模拟：真正私有，但每个实例都有独立的函数副本，内存消耗大',
    tags: ['ES6+', 'class', '私有字段']
  },
  {
    id: 47,
    title: '什么是 Atomics 和 SharedArrayBuffer？',
    category: 'Web API',
    difficulty: 'hard',
    content: '## 什么是 Atomics 和 SharedArrayBuffer？\n\n**答案：**\n`SharedArrayBuffer` 允许在主线程和 Web Worker 之间共享内存（零拷贝）。`Atomics` 提供原子操作，确保多线程环境下的数据安全（防止竞态条件）。\n\n```javascript\nconst sab = new SharedArrayBuffer(4);\nconst arr = new Int32Array(sab);\n// 在 Worker 中\nAtomics.add(arr, 0, 1);    // 原子加法\nAtomics.wait(arr, 0, 0);   // 等待值变化\nAtomics.notify(arr, 0, 1); // 通知等待的线程\n```\n\n### 追问：Web Worker 和主线程如何通信？\n\n- **postMessage/onmessage**：消息传递，数据会被结构化克隆（拷贝），适合小数据\n- **Transferable Objects**：转移所有权（如 ArrayBuffer），零拷贝，原始对象不可用\n- **SharedArrayBuffer**：共享内存，配合 Atomics 同步，适合大数据高频通信',
    tags: ['Web API', 'SharedArrayBuffer', '多线程']
  },
  {
    id: 48,
    title: '什么是 Blob 和 File 对象？',
    category: 'Web API',
    difficulty: 'easy',
    content: '## 什么是 Blob 和 File 对象？\n\n**答案：**\n\n- `Blob`（Binary Large Object）：不可变的原始数据对象，可以是文本或二进制数据\n- `File`：继承自 `Blob`，额外包含文件名、修改时间等元数据，来自 `<input type="file">` 或拖拽\n\n```javascript\n// 创建 Blob\nconst blob = new Blob([\'Hello, World!\'], { type: \'text/plain\' });\n// 创建下载链接\nconst url = URL.createObjectURL(blob);\nconst a = document.createElement(\'a\');\na.href = url;\na.download = \'file.txt\';\na.click();\nURL.revokeObjectURL(url); // 释放内存\n```\n\n### 追问：如何实现前端文件下载？\n\n- 直接链接：`<a href="url" download="filename">`\n- Blob + createObjectURL：适合动态生成的内容\n- `data:` URL：适合小文件（base64 编码）\n- `fetch` + `Blob`：下载后处理再保存',
    tags: ['Web API', 'Blob', '文件操作']
  },
  {
    id: 49,
    title: '什么是 IntersectionObserver？如何实现图片懒加载？',
    category: 'DOM/BOM',
    difficulty: 'medium',
    content: '## 什么是 IntersectionObserver？如何实现图片懒加载？\n\n**答案：**\n`IntersectionObserver` 异步观察目标元素与视口（或祖先元素）的交叉状态变化。\n\n### 图片懒加载实现：\n\n```javascript\nconst observer = new IntersectionObserver((entries) => {\n  entries.forEach(entry => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src; // 真实地址存在 data-src\n      observer.unobserve(img);   // 加载后停止观察\n    }\n  });\n}, { rootMargin: \'100px\' }); // 提前100px开始加载\n\ndocument.querySelectorAll(\'img[data-src]\')\n  .forEach(img => observer.observe(img));\n```\n\n### 追问：相比监听 scroll 事件，IntersectionObserver 有什么优势？\n\n- 不在主线程执行，不阻塞渲染\n- 不需要手动计算元素位置（`getBoundingClientRect` 触发重排）\n- 浏览器原生优化，性能更好\n- 支持 `rootMargin` 提前触发',
    tags: ['DOM/BOM', 'IntersectionObserver', '懒加载']
  },
  {
    id: 50,
    title: '什么是 ResizeObserver？',
    category: 'DOM/BOM',
    difficulty: 'easy',
    content: '## 什么是 ResizeObserver？\n\n**答案：**\n`ResizeObserver` 监听元素尺寸变化，比 `window.resize` 更精确（可以监听任意元素，不只是窗口）。\n\n```javascript\nconst observer = new ResizeObserver(entries => {\n  entries.forEach(entry => {\n    const { width, height } = entry.contentRect;\n    console.log(`元素尺寸变化: ${width} x ${height}`);\n  });\n});\nobserver.observe(element);\n```\n\n**应用：** 响应式图表（ECharts resize）、虚拟滚动列表高度计算、自适应布局\n\n### 追问：为什么不用 window.resize 监听元素尺寸变化？\n\n`window.resize` 只在窗口大小变化时触发，无法监听元素自身的尺寸变化（如父容器变化、内容变化导致的尺寸变化）。`ResizeObserver` 可以精确监听任意元素的尺寸变化，且不在主线程执行，性能更好。',
    tags: ['DOM/BOM', 'ResizeObserver', '响应式']
  },
  {
    id: 51,
    title: 'localStorage、sessionStorage、Cookie 的区别？',
    category: 'Web API',
    difficulty: 'easy',
    content: '## localStorage、sessionStorage、Cookie 的区别？\n\n| | localStorage | sessionStorage | Cookie |\n|--|-------------|----------------|--------|\n| 大小 | ~5MB | ~5MB | ~4KB |\n| 生命周期 | 永久（手动清除） | 标签页关闭清除 | 可设置过期时间 |\n| 作用域 | 同源共享 | 同标签页 | 同源（可设置域） |\n| 随请求发送 | 不发送 | 不发送 | 自动携带 |\n| JS 访问 | 可以 | 可以 | 可以（非 HttpOnly） |\n\n### 追问：Cookie 的 HttpOnly、Secure、SameSite 属性有什么作用？\n\n- `HttpOnly`：JS 无法通过 `document.cookie` 访问，防止 XSS 攻击窃取 Cookie\n- `Secure`：只在 HTTPS 连接中发送，防止中间人攻击\n- `SameSite`：控制跨站请求是否携带 Cookie，防止 CSRF 攻击\n  - `Strict`：完全禁止跨站携带\n  - `Lax`：允许导航跳转携带，禁止 AJAX 跨站携带（默认值）\n  - `None`：允许跨站携带（需配合 Secure）',
    tags: ['Web API', 'Storage', 'Cookie']
  },
  {
    id: 52,
    title: '什么是 XSS 攻击？如何防御？',
    category: '安全',
    difficulty: 'medium',
    content: '## 什么是 XSS 攻击？如何防御？\n\n**答案：**\nXSS（Cross-Site Scripting）跨站脚本攻击，攻击者将恶意脚本注入到网页中，在用户浏览器中执行。\n\n### 类型：\n\n- **存储型**：恶意脚本存入数据库，所有访问该页面的用户都受影响\n- **反射型**：恶意脚本在 URL 参数中，服务器反射到响应中\n- **DOM 型**：前端 JS 直接将不可信数据插入 DOM\n\n### 防御：\n\n- **输入过滤/转义**：对用户输入的 HTML 特殊字符转义\n- **CSP（内容安全策略）**：通过 HTTP 头限制可执行脚本来源\n- **HttpOnly Cookie**：防止脚本窃取 Cookie\n- **避免 innerHTML**：使用 `textContent` 或框架的安全渲染\n\n### 追问：Vue 中如何防止 XSS？\n\nVue 默认对插值进行 HTML 转义，是安全的。`v-html` 指令会直接插入 HTML，存在 XSS 风险，应避免对用户输入使用 `v-html`，必须使用时要先对内容进行 sanitize（如使用 DOMPurify 库）。',
    tags: ['安全', 'XSS', '防御']
  },
  {
    id: 53,
    title: '什么是 CSRF 攻击？如何防御？',
    category: '安全',
    difficulty: 'medium',
    content: '## 什么是 CSRF 攻击？如何防御？\n\n**答案：**\nCSRF（Cross-Site Request Forgery）跨站请求伪造，攻击者诱导用户访问恶意网站，利用用户已登录的 Cookie 发起伪造请求。\n\n### 防御：\n\n- **CSRF Token**：服务器生成随机 Token，请求时验证\n- **SameSite Cookie**：设置 `SameSite=Strict/Lax`，跨站请求不携带 Cookie\n- **验证 Referer/Origin**：检查请求来源\n- **双重 Cookie 验证**：将 Token 同时放在 Cookie 和请求参数中\n\n### 追问：CSRF 和 XSS 的区别？\n\n- XSS：攻击者在目标网站注入脚本，**冒充用户**在目标网站执行操作，需要在目标网站执行代码\n- CSRF：攻击者诱导用户访问恶意网站，**借用用户身份**（Cookie）向目标网站发请求，不需要在目标网站执行代码',
    tags: ['安全', 'CSRF', '防御']
  },
  {
    id: 54,
    title: '什么是 requestIdleCallback？',
    category: 'DOM/BOM',
    difficulty: 'medium',
    content: '## 什么是 requestIdleCallback？\n\n**答案：**\n`requestIdleCallback(callback, { timeout })` 在浏览器空闲时执行回调，不影响关键任务（动画、用户输入）。\n\n```javascript\nrequestIdleCallback((deadline) => {\n  while (deadline.timeRemaining() > 0 && tasks.length > 0) {\n    doTask(tasks.shift());\n  }\n  if (tasks.length > 0) requestIdleCallback(processWork);\n});\n```\n\n**应用：** React Fiber 的时间切片思想（类似实现）、非关键数据上报、预加载\n\n### 追问：requestIdleCallback 和 requestAnimationFrame 的区别？\n\n- `rAF`：在每帧渲染前执行，用于动画，每帧必须执行\n- `rIC`：在帧与帧之间的空闲时间执行，用于低优先级任务，可能被延迟',
    tags: ['DOM/BOM', 'rIC', '性能']
  },
  {
    id: 55,
    title: '什么是 Web Worker？有什么限制？',
    category: 'Web API',
    difficulty: 'medium',
    content: '## 什么是 Web Worker？有什么限制？\n\n**答案：**\nWeb Worker 在独立线程中运行 JS，不阻塞主线程，适合 CPU 密集型任务（大数据计算、图像处理）。\n\n### 限制：\n\n- 不能访问 DOM\n- 不能访问 `window`、`document`、`parent`\n- 可以访问 `navigator`、`location`（只读）、`XMLHttpRequest`、`fetch`\n- 通过 `postMessage` 与主线程通信\n\n### 类型：\n\n- `Worker`：专用 Worker，只能被创建它的脚本使用\n- `SharedWorker`：共享 Worker，多个页面可以共享\n- `ServiceWorker`：代理网络请求，实现离线缓存（PWA）\n\n### 追问：如何在 Vite 项目中使用 Web Worker？\n\n```javascript\n// Vite 支持 ?worker 后缀\nimport MyWorker from \'./worker.js?worker\';\nconst worker = new MyWorker();\nworker.postMessage({ data: largeArray });\nworker.onmessage = (e) => console.log(e.data);\n```',
    tags: ['Web API', 'Web Worker', '多线程']
  },
  {
    id: 56,
    title: '什么是 IndexedDB？和 localStorage 的区别？',
    category: 'Web API',
    difficulty: 'medium',
    content: '## 什么是 IndexedDB？和 localStorage 的区别？\n\n**答案：**\nIndexedDB 是浏览器内置的 NoSQL 数据库，支持存储大量结构化数据（包括文件/Blob），支持索引和事务，异步 API。\n\n### 与 localStorage 的区别：\n\n| | localStorage | IndexedDB |\n|--|-------------|----------|\n| 大小 | ~5MB | 通常 >50MB |\n| 数据类型 | 字符串 | 任意类型 |\n| 查询 | 只能按 key | 支持索引查询 |\n| 事务 | 不支持 | 支持 |\n| 异步 | 同步 | 异步 |\n\n### 追问：实际项目中什么场景会用 IndexedDB？\n\n- 离线应用（PWA）：缓存大量数据供离线使用\n- 大文件缓存：如视频片段、地图瓦片\n- 复杂查询需求：需要按多个字段查询的本地数据\n- 草稿自动保存：富文本编辑器内容',
    tags: ['Web API', 'IndexedDB', '存储']
  },
  {
    id: 57,
    title: '什么是 Service Worker？',
    category: 'Web API',
    difficulty: 'hard',
    content: '## 什么是 Service Worker？\n\n**答案：**\nService Worker 是运行在浏览器后台的独立线程，可以拦截网络请求、缓存资源、实现离线访问（PWA 核心）。\n\n### 生命周期：\ninstall → activate → fetch（拦截请求）\n\n```javascript\n// 注册\nnavigator.serviceWorker.register(\'/sw.js\');\n// sw.js 中\nself.addEventListener(\'install\', (e) => {\n  e.waitUntil(\n    caches.open(\'v1\').then(cache =>\n      cache.addAll([\'/index.html\', \'/app.js\'])\n    )\n  );\n});\nself.addEventListener(\'fetch\', (e) => {\n  e.respondWith(\n    caches.match(e.request).then(res => res || fetch(e.request))\n  );\n});\n```\n\n### 追问：Service Worker 和 Web Worker 的区别？\n\n- Web Worker：计算密集型任务，与页面生命周期绑定，页面关闭则销毁\n- Service Worker：网络代理，独立于页面生命周期，页面关闭后仍可运行，可以处理推送通知',
    tags: ['Web API', 'ServiceWorker', 'PWA']
  },
  {
    id: 58,
    title: '什么是 CustomEvent？如何实现自定义事件？',
    category: 'DOM/BOM',
    difficulty: 'easy',
    content: '## 什么是 CustomEvent？如何实现自定义事件？\n\n```javascript\n// 创建自定义事件\nconst event = new CustomEvent(\'myEvent\', {\n  detail: { message: \'Hello\' }, // 自定义数据\n  bubbles: true,     // 是否冒泡\n  cancelable: true   // 是否可取消\n});\n// 触发事件\nelement.dispatchEvent(event);\n// 监听事件\nelement.addEventListener(\'myEvent\', (e) => {\n  console.log(e.detail.message);\n});\n```\n\n**应用：** 组件间通信（非父子关系）、插件系统、事件总线\n\n### 追问：Vue 3 中如何实现事件总线？\n\nVue 3 移除了 `$on/$off/$emit` 全局事件总线。替代方案：\n\n- 使用 `mitt` 或 `tiny-emitter` 第三方库\n- 使用 Pinia 状态管理\n- 使用 `provide/inject` + `ref`',
    tags: ['DOM/BOM', 'CustomEvent', '事件']
  },
  {
    id: 59,
    title: '什么是 Object.getPrototypeOf 和 Object.setPrototypeOf？',
    category: 'JS核心',
    difficulty: 'easy',
    content: '## 什么是 Object.getPrototypeOf 和 Object.setPrototypeOf？\n\n**答案：**\n\n- `Object.getPrototypeOf(obj)`：获取对象的原型（等同于 `obj.__proto__`，但这是标准 API）\n- `Object.setPrototypeOf(obj, proto)`：设置对象的原型（性能差，不推荐在运行时使用）\n\n```javascript\nclass Animal {}\nclass Dog extends Animal {}\nconst dog = new Dog();\nObject.getPrototypeOf(dog) === Dog.prototype; // true\nObject.getPrototypeOf(Dog.prototype) === Animal.prototype; // true\n```\n\n### 追问：instanceof 的原理？\n\n`a instanceof B` 检查 `B.prototype` 是否在 `a` 的原型链上：\n\n```javascript\nfunction myInstanceof(obj, Constructor) {\n  let proto = Object.getPrototypeOf(obj);\n  while (proto !== null) {\n    if (proto === Constructor.prototype) return true;\n    proto = Object.getPrototypeOf(proto);\n  }\n  return false;\n}\n```',
    tags: ['JS核心', '原型', 'instanceof']
  },
  {
    id: 60,
    title: '什么是 Temporal API？（ES2024 提案）',
    category: 'ES6+',
    difficulty: 'easy',
    content: '## 什么是 Temporal API？（ES2024 提案）\n\n**答案：**\n`Temporal` 是用于替代 `Date` 对象的新 API，解决 `Date` 的诸多问题：\n\n### Date 的问题：\n\n- 月份从 0 开始（0=1月）\n- 时区处理混乱\n- 可变对象（mutable）\n- 解析行为不一致\n\n### Temporal 的改进：\n\n- 不可变对象\n- 明确的时区支持\n- 月份从 1 开始\n- 支持日历系统（农历等）\n\n```javascript\n// 提案语法（需 polyfill）\nconst now = Temporal.Now.plainDateTimeISO();\nconst date = Temporal.PlainDate.from(\'2024-01-15\');\n```\n\n### 追问：目前处理日期时间推荐用什么库？\n\n- **Day.js**：轻量（2KB），API 类似 Moment.js，不可变，推荐\n- **date-fns**：函数式，Tree Shaking 友好，TypeScript 支持好\n- **Luxon**：Moment.js 作者新作，时区支持好\n- **Moment.js**：老牌但已停止维护，包体积大，不推荐新项目使用',
    tags: ['ES6+', 'Temporal', '日期时间']
  },
]
