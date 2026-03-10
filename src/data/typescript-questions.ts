import type { Question } from './types'

export const typescriptQuestions: Question[] = [
  {
    id: 201,
    title: 'TypeScript 相比 JavaScript 有哪些优势？',
    category: 'TypeScript',
    difficulty: 'easy',
    content: `## TypeScript 相比 JavaScript 有哪些优势？

**答案：**

1. **静态类型检查**：编译时发现类型错误，减少运行时 bug
2. **更好的 IDE 支持**：自动补全、重构、跳转定义
3. **代码可读性**：类型即文档，降低理解成本
4. **面向对象特性**：接口、泛型、装饰器、访问修饰符
5. **ES 新特性支持**：可以使用最新语法，编译为兼容版本

### 追问：TypeScript 的缺点是什么？

**答案：**

1. 学习成本，需要掌握类型系统
2. 增加代码量（类型声明）
3. 编译步骤，增加构建时间
4. 第三方库可能缺少类型定义（需要 \`@types/xxx\`）
5. 过度使用 \`any\` 会失去类型检查的意义`,
    tags: ['TypeScript', '基础', '优势']
  },
  {
    id: 202,
    title: 'interface 和 type 的区别？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## TypeScript 中 \`interface\` 和 \`type\` 的区别？

**答案：**

**相同点：** 都可以描述对象形状，都可以被继承/扩展

**不同点：**

| | interface | type |
|--|-----------|------|
| 声明合并 | ✅ 同名自动合并 | ❌ 不能重复声明 |
| 扩展语法 | \`extends\` | \`&\`（交叉类型） |
| 描述联合类型 | ❌ | ✅ \`type A = B | C\` |
| 描述元组 | ❌ | ✅ \`type T = [string, number]\` |
| 映射类型 | ❌ | ✅ |
| 计算属性 | ❌ | ✅ |

**推荐：** 定义对象形状用 \`interface\`（支持声明合并，对库开发友好），其他情况用 \`type\`

### 追问：什么是声明合并？

**答案：**
同名 \`interface\` 会自动合并属性：

\`\`\`typescript
interface User {
  name: string;
}
interface User {
  age: number;
}
// 等价于
interface User {
  name: string;
  age: number;
}
\`\`\`

常用于扩展第三方库的类型定义（如扩展 \`Window\` 对象）。`,
    tags: ['TypeScript', 'interface', 'type']
  },
  {
    id: 203,
    title: '什么是泛型（Generics）？如何使用？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## 什么是泛型（Generics）？如何使用？

**答案：**
泛型是类型参数化，让函数/类/接口可以处理多种类型，同时保持类型安全。

\`\`\`typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}
identity<string>('hello'); // 显式指定
identity(42); // 类型推断

// 泛型接口
interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}

// 泛型约束
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
\`\`\`

### 追问：泛型约束 \`extends\` 和类继承 \`extends\` 的区别？

**答案：**

- 类继承 \`extends\`：子类继承父类的属性和方法
- 泛型约束 \`extends\`：限制泛型参数必须满足某种结构（有某些属性），不是继承关系`,
    tags: ['TypeScript', '泛型', 'Generics']
  },
  {
    id: 204,
    title: 'TypeScript 内置工具类型有哪些？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## TypeScript 内置工具类型有哪些？

**答案：**

\`\`\`typescript
// Partial<T>：所有属性变为可选
type PartialUser = Partial<User>;

// Required<T>：所有属性变为必选
type RequiredUser = Required<User>;

// Readonly<T>：所有属性变为只读
type ReadonlyUser = Readonly<User>;

// Pick<T, K>：选取部分属性
type UserName = Pick<User, 'name' | 'age'>;

// Omit<T, K>：排除部分属性
type UserWithoutId = Omit<User, 'id'>;

// Record<K, V>：构造键值对类型
type UserMap = Record<string, User>;

// Exclude<T, U>：从联合类型中排除
type T1 = Exclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'

// Extract<T, U>：提取联合类型中的子集
type T2 = Extract<'a' | 'b' | 'c', 'a' | 'b'>; // 'a' | 'b'

// NonNullable<T>：排除 null 和 undefined
type T3 = NonNullable<string | null | undefined>; // string

// ReturnType<T>：获取函数返回类型
type R = ReturnType<() => string>; // string

// Parameters<T>：获取函数参数类型元组
type P = Parameters<(a: string, b: number) => void>; // [string, number]
\`\`\`

### 追问：手写 \`Partial<T>\` 的实现？

**答案：**

\`\`\`typescript
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
\`\`\``,
    tags: ['TypeScript', '工具类型', 'Utility Types']
  },
  {
    id: 205,
    title: '什么是联合类型和交叉类型？',
    category: 'TypeScript',
    difficulty: 'easy',
    content: `## 什么是联合类型和交叉类型？

**答案：**

- **联合类型（Union）\`|\`**：值可以是多种类型之一

\`\`\`typescript
type StringOrNumber = string | number;
function format(val: string | number) { /* ... */ }
\`\`\`

- **交叉类型（Intersection）\`&\`**：合并多个类型的所有属性

\`\`\`typescript
type Admin = User & { permissions: string[] };
\`\`\`

### 追问：如何对联合类型进行类型收窄（Type Narrowing）？

**答案：**

\`\`\`typescript
// typeof 收窄
function fn(val: string | number) {
  if (typeof val === 'string') { /* val 是 string */ }
}
// instanceof 收窄
// if (error instanceof TypeError) { ... }
// in 操作符
// if ('name' in obj) { ... }
// 字面量类型收窄
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number };
function area(s: Shape) {
  if (s.kind === 'circle') return Math.PI * s.radius ** 2;
}
// 自定义类型守卫
function isString(val: unknown): val is string {
  return typeof val === 'string';
}
\`\`\``,
    tags: ['TypeScript', '联合类型', '交叉类型']
  },
  {
    id: 206,
    title: 'unknown 和 any 的区别？',
    category: 'TypeScript',
    difficulty: 'easy',
    content: `## 什么是 \`unknown\` 和 \`any\` 的区别？

**答案：**

- \`any\`：关闭类型检查，可以赋值给任何类型，也可以接受任何类型，完全不安全
- \`unknown\`：类型安全的 \`any\`，可以接受任何类型，但在使用前必须进行类型检查/断言

\`\`\`typescript
let a: any = 'hello';
a.toFixed(); // 不报错（运行时可能出错）

let b: unknown = 'hello';
// b.toFixed(); // 编译错误！
if (typeof b === 'string') b.toUpperCase(); // OK，类型收窄后可以使用
\`\`\`

### 追问：什么时候用 \`unknown\` 代替 \`any\`？

**答案：**
当你不确定类型但又不想完全放弃类型检查时用 \`unknown\`。如：

- 函数接受任意类型参数但需要在内部安全处理
- API 响应数据（先 \`unknown\`，再断言或验证）
- \`try/catch\` 中的 \`error\`（TS 4.0+ 默认是 \`unknown\`）`,
    tags: ['TypeScript', 'unknown', 'any']
  },
  {
    id: 207,
    title: '什么是类型断言？as 和 ! 的区别？',
    category: 'TypeScript',
    difficulty: 'easy',
    content: `## 什么是类型断言？\`as\` 和 \`!\` 的区别？

**答案：**

- **类型断言 \`as\`**：告诉编译器"我知道这个值的类型"，绕过类型检查

\`\`\`typescript
const input = document.getElementById('input') as HTMLInputElement;
input.value; // OK
\`\`\`

- **非空断言 \`!\`**：告诉编译器"这个值不是 null/undefined"

\`\`\`typescript
const el = document.getElementById('app')!; // 断言不为 null
\`\`\`

**注意：** 断言不做运行时检查，如果断言错误会导致运行时错误。

### 追问：什么是双重断言？什么时候需要？

**答案：**
当两个类型没有重叠时，直接断言会报错，需要先断言为 \`unknown\` 或 \`any\`：

\`\`\`typescript
const a = 'hello' as unknown as number; // 双重断言，强制转换
\`\`\`

这是危险操作，应尽量避免，通常意味着类型设计有问题。`,
    tags: ['TypeScript', '类型断言', 'as']
  },
  {
    id: 208,
    title: '什么是装饰器（Decorator）？',
    category: 'TypeScript',
    difficulty: 'hard',
    content: `## 什么是装饰器（Decorator）？

**答案：**
装饰器是一种特殊的声明，可以附加到类、方法、属性、参数上，用于修改或扩展其行为（元编程）。

\`\`\`typescript
// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport { /* ... */ }

// 方法装饰器
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(\`调用 \${key}，参数：\`, args);
    return original.apply(this, args);
  };
  return descriptor;
}
\`\`\`

### 追问：装饰器的执行顺序是什么？

**答案：**

1. 参数装饰器 → 方法装饰器 → 访问器装饰器 → 属性装饰器（从下到上，从右到左）
2. 类装饰器最后执行
3. 多个装饰器时，从下到上执行（洋葱模型）`,
    tags: ['TypeScript', '装饰器', 'Decorator']
  },
  {
    id: 209,
    title: '什么是条件类型（Conditional Types）？',
    category: 'TypeScript',
    difficulty: 'hard',
    content: `## 什么是条件类型（Conditional Types）？

**答案：**

\`\`\`typescript
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'

// 内置工具类型的实现
type MyNonNullable<T> = T extends null | undefined ? never : T;
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
\`\`\`

**\`infer\` 关键字：** 在条件类型中推断类型变量

\`\`\`typescript
// 获取 Promise 的解析类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type R = UnwrapPromise<Promise<string>>; // string
\`\`\`

### 追问：条件类型在联合类型上的分发行为？

**答案：**
当条件类型的检查类型是裸类型参数时，会对联合类型的每个成员分别应用：

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;
type R1 = ToArray<string | number>; // string[] | number[]（分发）
// 如果不想分发，用元组包裹：
type ToArrayNoDistribute<T> = [T] extends [any] ? T[] : never;
type R2 = ToArrayNoDistribute<string | number>; // (string | number)[]
\`\`\``,
    tags: ['TypeScript', '条件类型', 'infer']
  },
  {
    id: 210,
    title: '什么是映射类型（Mapped Types）？',
    category: 'TypeScript',
    difficulty: 'hard',
    content: `## 什么是映射类型（Mapped Types）？

**答案：**
映射类型通过遍历已有类型的键来创建新类型：

\`\`\`typescript
// 基本映射
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPartial<T> = { [K in keyof T]?: T[K] };

// 修改符
type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // 移除 readonly
type MyRequired<T> = { [K in keyof T]-?: T[K] }; // 移除 ?

// 键重映射（as）
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
\`\`\`

### 追问：如何实现 \`DeepPartial<T>\`（深度可选）？

**答案：**

\`\`\`typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
\`\`\``,
    tags: ['TypeScript', '映射类型', 'Mapped Types']
  },
  {
    id: 211,
    title: '什么是模板字面量类型？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## 什么是模板字面量类型？

**答案：**
TypeScript 4.1 引入，可以在类型层面操作字符串：

\`\`\`typescript
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize<EventName>}\`; // 'onClick' | 'onFocus' | 'onBlur'

// 实际应用：CSS 属性
type CSSValue = \`\${number}px\` | \`\${number}%\` | \`\${number}rem\`;

// 内置字符串操作类型
type U = Uppercase<'hello'>; // 'HELLO'
type L = Lowercase<'HELLO'>; // 'hello'
type C = Capitalize<'hello'>; // 'Hello'
type UC = Uncapitalize<'Hello'>; // 'hello'
\`\`\`

### 追问：如何用模板字面量类型实现事件监听器类型？

**答案：**

\`\`\`typescript
type EventMap = { click: MouseEvent; keydown: KeyboardEvent };
type OnEvents = {
  [K in keyof EventMap as \`on\${Capitalize<K>}\`]: (e: EventMap[K]) => void;
};
// { onClick: (e: MouseEvent) => void; onKeydown: (e: KeyboardEvent) => void; }
\`\`\``,
    tags: ['TypeScript', '模板字面量', 'Template Literal']
  },
  {
    id: 212,
    title: '如何处理第三方库没有类型定义的情况？',
    category: 'TypeScript',
    difficulty: 'easy',
    content: `## TypeScript 中如何处理第三方库没有类型定义的情况？

**答案：**

1. **安装 @types 包**：\`npm install @types/lodash -D\`
2. **声明文件（.d.ts）**：手写类型声明

\`\`\`typescript
// global.d.ts
declare module 'some-lib' {
  export function doSomething(val: string): void;
}
\`\`\`

3. **快速声明**：\`declare module 'some-lib';\`（类型为 any，不安全但能用）
4. **贡献类型**：向 DefinitelyTyped 提交 PR

### 追问：\`.d.ts\` 文件的作用是什么？

**答案：**
\`.d.ts\` 是类型声明文件，只包含类型信息，不包含实现代码。用于：

1. 为 JS 库提供类型信息
2. 声明全局变量/模块
3. 描述 npm 包的公共 API`,
    tags: ['TypeScript', '声明文件', '.d.ts']
  },
  {
    id: 213,
    title: '什么是 namespace 和 module？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## 什么是 \`namespace\` 和 \`module\`？

**答案：**

- **namespace（命名空间）**：TypeScript 特有，用于组织代码，避免全局命名冲突，编译为 IIFE

\`\`\`typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
\`\`\`

- **module（模块）**：ES Module 标准，推荐使用，每个文件是一个模块

**现代开发推荐：** 使用 ES Module，不推荐 namespace（除了在 \`.d.ts\` 中组织类型）

### 追问：\`/// <reference types="..." />\` 是什么？

**答案：**
三斜线指令，用于声明文件间的依赖关系：

- \`/// <reference types="node" />\`：引入 @types/node 的类型
- \`/// <reference path="./types.d.ts" />\`：引入指定路径的类型文件

现代项目通常通过 \`tsconfig.json\` 的 \`types\` 字段管理，不需要手动写三斜线指令。`,
    tags: ['TypeScript', 'namespace', 'module']
  },
  {
    id: 214,
    title: 'tsconfig.json 中重要的配置项有哪些？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## \`tsconfig.json\` 中重要的配置项有哪些？

**答案：**

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "outDir": "./dist",
    "declaration": true,
    "sourceMap": true
  }
}
\`\`\`

- \`target\`：编译目标版本
- \`module\`：模块系统
- \`lib\`：内置类型库
- \`strict\`：开启所有严格检查
- \`paths\`：路径别名

### 追问：\`strict: true\` 开启了哪些检查？

**答案：**
\`strict: true\` 是以下选项的集合：\`noImplicitAny\`、\`strictNullChecks\`、\`strictFunctionTypes\`、\`strictBindCallApply\`、\`strictPropertyInitialization\`、\`noImplicitThis\`、\`alwaysStrict\`（开启 ES5 严格模式）。`,
    tags: ['TypeScript', 'tsconfig', '配置']
  },
  {
    id: 215,
    title: '什么是 satisfies 操作符？（TS 4.9）',
    category: 'TypeScript',
    difficulty: 'hard',
    content: `## 什么是 \`satisfies\` 操作符？（TS 4.9）

**答案：**
\`satisfies\` 验证表达式满足某个类型，但不改变表达式的推断类型：

\`\`\`typescript
type Colors = 'red' | 'green' | 'blue';
type ColorMap = Record<Colors, string | [number, number, number]>;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies ColorMap;

// 使用 satisfies：palette.red 的类型是 [number, number, number]（精确类型）
// 使用 as ColorMap：palette.red 的类型是 string | [number, number, number]（宽泛类型）
palette.red.map((x) => x * 2); // OK，因为类型是 number[]
\`\`\`

### 追问：\`satisfies\` 和类型断言 \`as\` 的区别？

**答案：**

- \`as\`：强制断言，不做类型检查，可能不安全
- \`satisfies\`：验证类型兼容性（会报错），同时保留更精确的推断类型，更安全`,
    tags: ['TypeScript', 'satisfies', 'TS 4.9']
  },
  {
    id: 216,
    title: '什么是 const 断言？',
    category: 'TypeScript',
    difficulty: 'easy',
    content: `## 什么是 \`const\` 断言？

**答案：**
\`as const\` 将值断言为最窄的字面量类型，且所有属性变为 \`readonly\`：

\`\`\`typescript
const config = {
  host: 'localhost',
  port: 3000,
} as const;
// config.host 类型是 'localhost'（字面量），而非 string
// config.port 类型是 3000，而非 number
// 所有属性是 readonly

const arr = [1, 2, 3] as const; // readonly [1, 2, 3]
\`\`\`

**应用：** 定义枚举值、路由配置、常量对象

### 追问：\`as const\` 和 \`enum\` 的区别？

**答案：**

- \`enum\`：编译为 JS 对象，有运行时开销，支持反向映射
- \`as const\` 对象：编译后就是普通对象，无额外开销，类型更精确，推荐使用 \`as const\` 替代 \`enum\``,
    tags: ['TypeScript', 'as const', '字面量类型']
  },
  {
    id: 217,
    title: '什么是函数重载（Function Overloads）？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## 什么是函数重载（Function Overloads）？

**答案：**
TypeScript 允许为同一函数定义多个类型签名：

\`\`\`typescript
function format(val: string): string;
function format(val: number, decimals: number): string;
function format(val: string | number, decimals?: number): string {
  if (typeof val === 'string') return val.trim();
  return val.toFixed(decimals ?? 2);
}
\`\`\`

**注意：** 重载签名不包含实现，实现签名必须兼容所有重载签名，且实现签名对外不可见。

### 追问：什么时候用函数重载，什么时候用联合类型？

**答案：**

- 当不同参数类型对应不同返回类型时，用重载（类型更精确）
- 当参数类型不同但返回类型相同时，用联合类型（更简洁）`,
    tags: ['TypeScript', '函数重载', 'Overloads']
  },
  {
    id: 218,
    title: '什么是 infer 关键字？',
    category: 'TypeScript',
    difficulty: 'hard',
    content: `## 什么是 \`infer\` 关键字？

**答案：**
\`infer\` 在条件类型中声明一个待推断的类型变量：

\`\`\`typescript
// 获取函数返回类型
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 获取 Promise 解析类型
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;

// 获取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

// 获取构造函数实例类型
type MyInstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;
\`\`\`

### 追问：如何用 \`infer\` 获取函数第一个参数的类型？

**答案：**

\`\`\`typescript
type FirstParam<T> = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;
type R = FirstParam<(a: string, b: number) => void>; // string
\`\`\``,
    tags: ['TypeScript', 'infer', '类型推断']
  },
  {
    id: 219,
    title: '如何用 TypeScript 实现单例模式？',
    category: 'TypeScript',
    difficulty: 'medium',
    content: `## TypeScript 中如何实现单例模式？

**答案：**

\`\`\`typescript
class Singleton {
  private static instance: Singleton;
  private constructor() {} // 私有构造函数，防止外部 new

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  doSomething() {
    console.log('doing something');
  }
}

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2); // true
\`\`\`

### 追问：TypeScript 中 \`private\` 和 \`#\` 私有字段的区别？

**答案：**

- \`private\`：TypeScript 编译时检查，编译为 JS 后没有任何保护（可以通过 \`as any\` 绕过）
- \`#\`（ES 私有字段）：运行时真正私有，JS 层面无法访问，更安全`,
    tags: ['TypeScript', '单例模式', '设计模式']
  },
  {
    id: 220,
    title: '什么是 TypeScript 的协变和逆变？',
    category: 'TypeScript',
    difficulty: 'hard',
    content: `## 什么是 TypeScript 的协变和逆变？

**答案：**

- **协变（Covariant）**：子类型可以赋值给父类型，方向相同。函数返回值类型是协变的

\`\`\`typescript
type Animal = { name: string };
type Dog = { name: string; breed: string };
// Dog 是 Animal 的子类型
let getAnimal: () => Animal = () => ({ name: 'dog', breed: 'lab' }); // OK
\`\`\`

- **逆变（Contravariant）**：父类型可以赋值给子类型，方向相反。函数参数类型是逆变的

\`\`\`typescript
// let handleAnimal: (a: Animal) => void = (d: Dog) => {}; // 错误！
let handleDog: (d: Dog) => void = (a: Animal) => { console.log(a.name); }; // OK
\`\`\`

### 追问：为什么函数参数是逆变的？

**答案：**
如果函数参数是协变的，会导致类型不安全：假设 \`handleDog\` 接受 \`Dog\`，如果允许赋值一个只处理 \`Animal\` 的函数，调用时传入 \`Dog\` 是安全的（Dog 有 Animal 的所有属性）。反过来不安全（Animal 可能没有 Dog 特有的属性）。`,
    tags: ['TypeScript', '协变', '逆变']
  },
]