import type { Question } from './types'

export const vueQuestions: Question[] = [
  {
    id: 301,
    title: 'Vue 2 和 Vue 3 的核心区别是什么？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 2 和 Vue 3 的核心区别是什么？

**答案：**

1. **响应式系统**：Vue 2 用 \`Object.defineProperty\`，Vue 3 用 \`Proxy\`，解决了新增属性、数组下标监听问题
2. **Composition API**：Vue 3 新增，解决 Options API 逻辑分散问题，更好的逻辑复用
3. **性能提升**：编译优化（静态提升、Patch Flag、Block Tree），虚拟 DOM diff 更快
4. **Tree Shaking**：Vue 3 按需引入，包体积更小
5. **TypeScript**：Vue 3 用 TS 重写，类型支持更好
6. **Fragment**：支持多根节点
7. **Teleport**：传送门组件
8. **Suspense**：异步组件加载状态

### 追问：Vue 3 的编译优化具体有哪些？

**答案：**

1. **静态提升（Static Hoisting）**：静态节点提升到渲染函数外，只创建一次
2. **Patch Flag**：编译时标记动态节点的类型（文本、class、props 等），diff 时只比较有标记的部分
3. **Block Tree**：将动态节点收集到 block 中，跳过静态子树的 diff
4. **事件缓存（cacheHandlers）**：内联事件处理器缓存，避免重复创建函数`,
    tags: ['Vue', '框架对比', 'Vue3']
  },
  {
    id: 302,
    title: 'Vue 3 响应式原理是什么？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 响应式原理是什么？

**答案：**

Vue 3 使用 \`Proxy\` 拦截对象的读取（\`get\`）和修改（\`set\`）操作：

1. **依赖收集（track）**：\`get\` 时，将当前正在执行的副作用函数（effect）与该属性关联
2. **触发更新（trigger）**：\`set\` 时，找到该属性关联的所有 effect，重新执行

核心 API：
- \`reactive()\`：深度响应式对象（Proxy）
- \`ref()\`：基本类型响应式（包装为 \`{ value }\` 对象）
- \`computed()\`：计算属性（懒执行的 effect）
- \`watch/watchEffect()\`：副作用（effect）

### 追问：ref 和 reactive 的区别？

**答案：**

- \`ref\`：适合基本类型，也可以包装对象，通过 \`.value\` 访问，在模板中自动解包
- \`reactive\`：适合对象/数组，直接访问属性，不需要 \`.value\`，但解构会失去响应性

解构 \`reactive\` 对象时用 \`toRefs()\` 保持响应性：
\`\`\`javascript
const state = reactive({ count: 0, name: 'Vue' });
const { count, name } = toRefs(state); // 保持响应性
\`\`\``,
    tags: ['Vue', '响应式', 'Proxy', 'ref', 'reactive']
  },
  {
    id: 303,
    title: 'Vue 3 的 computed 和 watch 的区别？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 computed 和 watch 的区别？

**答案：**

- **computed**：
  - 有缓存，依赖不变时不重新计算
  - 必须有返回值
  - 同步计算
  - 适合从现有数据派生新数据

- **watch**：
  - 无缓存，每次依赖变化都执行
  - 可以执行异步操作
  - 可以访问新旧值
  - 适合数据变化时执行副作用（请求、DOM 操作）

- **watchEffect**：
  - 立即执行，自动追踪依赖
  - 不能访问旧值
  - 适合需要立即执行且依赖自动追踪的场景

### 追问：watch 的 deep、immediate、flush 选项有什么作用？

**答案：**

- \`deep: true\`：深度监听对象内部变化
- \`immediate: true\`：立即执行一次回调
- \`flush: 'pre'\`（默认）：在组件更新前执行；\`'post'\`：在 DOM 更新后执行；\`'sync'\`：同步执行`,
    tags: ['Vue', 'computed', 'watch', '响应式']
  },
  {
    id: 304,
    title: 'Vue 组件的生命周期有哪些？父子组件的执行顺序？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 组件的生命周期有哪些？父子组件的执行顺序？

**答案：**

**Vue 3 生命周期钩子：**
- \`onBeforeMount\`：挂载前
- \`onMounted\`：挂载后（可以访问 DOM）
- \`onBeforeUpdate\`：更新前
- \`onUpdated\`：更新后
- \`onBeforeUnmount\`：卸载前
- \`onUnmounted\`：卸载后（清理副作用）
- \`onErrorCaptured\`：捕获子组件错误

**父子组件执行顺序：**
- **挂载**：父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted
- **更新**：父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
- **卸载**：父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted

### 追问：在哪个生命周期发起数据请求最合适？

**答案：**

\`onMounted\`（或 Vue 2 的 \`mounted\`）。虽然 \`created\`/\`setup\` 更早，但：
1. 服务端渲染（SSR）中 \`mounted\` 不执行，\`created\` 会执行两次（服务端+客户端）
2. 某些操作需要 DOM 存在（如初始化图表）
3. 统一在 \`mounted\` 发请求，代码更一致`,
    tags: ['Vue', '生命周期', '父子组件']
  },
  {
    id: 305,
    title: 'Vue 3 的 setup 函数是什么？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 setup 函数是什么？

**答案：**

\`setup\` 是 Composition API 的入口，在组件实例创建之前执行（比 \`beforeCreate\` 更早），没有 \`this\`。

\`\`\`javascript
// 选项式
export default {
  setup(props, { emit, slots, attrs, expose }) {
    const count = ref(0);
    return { count }; // 返回的内容在模板中可用
  }
}
\`\`\`

**\`<script setup>\` 的优势：**
1. 更简洁，无需 return
2. 顶层变量/函数直接在模板中使用
3. 更好的 TypeScript 支持
4. 更好的运行时性能（编译优化）

### 追问：\`<script setup>\` 中如何暴露属性给父组件？

**答案：**

\`<script setup>\` 默认是封闭的，父组件通过 \`ref\` 访问子组件时，只能访问 \`defineExpose\` 暴露的内容：
\`\`\`javascript
// 子组件
defineExpose({ count, reset });
// 父组件
const childRef = ref();
childRef.value.reset(); // 调用子组件方法
\`\`\``,
    tags: ['Vue', 'Composition API', 'setup']
  },
  {
    id: 306,
    title: 'Vue 3 的 provide/inject 如何使用？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 provide/inject 如何使用？

**答案：**

\`provide/inject\` 实现跨层级组件通信，避免 props 逐层传递（prop drilling）。

\`\`\`javascript
// 祖先组件
import { provide, ref } from 'vue';
const theme = ref('light');
provide('theme', theme); // 提供响应式数据

// 后代组件（任意层级）
import { inject } from 'vue';
const theme = inject('theme', 'light'); // 第二个参数是默认值
\`\`\`

### 追问：provide/inject 和 Pinia 的使用场景区别？

**答案：**

- \`provide/inject\`：适合组件树内的局部状态共享，如 UI 组件库的主题、表单验证上下文
- Pinia：适合全局状态管理，跨组件树共享，支持持久化、DevTools 调试`,
    tags: ['Vue', '组件通信', 'provide', 'inject']
  },
  {
    id: 307,
    title: 'Vue Router 的导航守卫有哪些？执行顺序？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue Router 的导航守卫有哪些？执行顺序？

**答案：**

**全局守卫：**
- \`router.beforeEach\`：全局前置守卫（最常用，权限控制）
- \`router.beforeResolve\`：全局解析守卫（所有组件内守卫和异步路由解析后）
- \`router.afterEach\`：全局后置钩子（不能阻止导航）

**路由独享守卫：**
- \`beforeEnter\`：路由配置中定义

**组件内守卫：**
- \`onBeforeRouteEnter\`（Vue 3）：进入前，不能访问 \`this\`
- \`onBeforeRouteUpdate\`：路由更新时（同一组件，参数变化）
- \`onBeforeRouteLeave\`：离开前（可以阻止离开，如未保存提示）

**完整执行顺序：**

全局 beforeEach → 路由 beforeEnter → 组件 beforeRouteEnter → 全局 beforeResolve → 全局 afterEach → 组件 mounted

### 追问：如何实现路由权限控制？

**答案：**
\`\`\`javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});
\`\`\``,
    tags: ['Vue', 'Vue Router', '导航守卫', '权限']
  },
  {
    id: 308,
    title: 'Vue Router 的 hash 模式和 history 模式的区别？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue Router 的 hash 模式和 history 模式的区别？

**答案：**

- **hash 模式**：URL 中有 \`#\`，如 \`http://example.com/#/home\`，\`#\` 后的内容不发送到服务器，兼容性好，无需服务器配置
- **history 模式**：URL 干净，如 \`http://example.com/home\`，使用 HTML5 History API，需要服务器配置（所有路径返回 index.html），否则刷新 404

### 追问：history 模式下服务器如何配置？

**答案：**

Nginx 配置：
\`\`\`nginx
location / {
  try_files $uri $uri/ /index.html;
}
\`\`\`

意思是：先尝试找对应文件，找不到则返回 index.html，由前端路由处理。`,
    tags: ['Vue', 'Vue Router', '路由模式']
  },
  {
    id: 309,
    title: 'Vuex 和 Pinia 的区别？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vuex 和 Pinia 的区别？

**答案：**

| 特性 | Vuex 4 | Pinia |
|------|--------|-------|
| 模块化 | 嵌套 modules | 多个独立 store |
| TypeScript | 支持但繁琐 | 原生 TS 支持 |
| 代码量 | 多（mutations/actions/getters） | 少（只有 state/getters/actions） |
| DevTools | ✅ | ✅ |
| SSR | ✅ | ✅ |
| 插件 | ✅ | ✅ |
| 体积 | 较大 | 极小（~1KB） |

Pinia 移除了 mutations，直接在 actions 中修改 state，更简洁。

### 追问：Pinia 如何实现状态持久化？

**答案：**

使用 \`pinia-plugin-persistedstate\` 插件：
\`\`\`javascript
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// store 中
export const useUserStore = defineStore('user', {
  state: () => ({ token: '' }),
  persist: true,
});
\`\`\``,
    tags: ['Vue', 'Vuex', 'Pinia', '状态管理']
  },
  {
    id: 310,
    title: 'Vue 3 的 defineProps 和 defineEmits 如何使用？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 defineProps 和 defineEmits 如何使用？

**答案：**

\`\`\`typescript
// defineProps
const props = defineProps<{
  title: string;
  count?: number;
  items: string[];
}>();
// 带默认值
const props = withDefaults(defineProps<{ count?: number }>(), { count: 0 });

// defineEmits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: number): void;
}>();
emit('change', 42);
\`\`\`

### 追问：如何实现 v-model 的自定义组件？

**答案：**

\`\`\`vue
<!-- 子组件 MyInput.vue -->
<template>
  <input :value="modelValue" @input="emit('update:modelValue', $event.target.value)" />
</template>
<script setup>
defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();
</script>

<!-- 父组件 -->
<MyInput v-model="text" />
\`\`\``,
    tags: ['Vue', 'defineProps', 'defineEmits', 'v-model']
  },
  {
    id: 311,
    title: 'Vue 3 的 Teleport 组件有什么用？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 Teleport 组件有什么用？

**答案：**

\`Teleport\` 将组件的 DOM 渲染到指定的 DOM 节点下，而不是组件的父节点。

\`\`\`vue
<Teleport to="body">
  <div class="modal">弹窗内容</div>
</Teleport>
\`\`\`

**应用场景：** 弹窗、Toast、Tooltip 等需要脱离当前 DOM 层级的组件（避免 \`z-index\` 和 \`overflow: hidden\` 问题）

### 追问：Teleport 中的组件还能访问父组件的数据吗？

**答案：**

可以。\`Teleport\` 只是改变了 DOM 位置，组件的逻辑上下文（provide/inject、props）仍然属于原来的组件树，可以正常访问父组件的数据。`,
    tags: ['Vue', 'Teleport', '内置组件']
  },
  {
    id: 312,
    title: 'Vue 3 的 Suspense 组件有什么用？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 Suspense 组件有什么用？

**答案：**

\`Suspense\` 处理异步组件的加载状态，提供 \`default\`（内容）和 \`fallback\`（加载中）两个插槽：

\`\`\`vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
\`\`\`

### 追问：Suspense 和 v-if 控制加载状态有什么区别？

**答案：**

\`Suspense\` 可以处理组件树中任意深度的异步操作，自动等待所有子组件的异步 setup 完成。\`v-if\` 需要手动管理每个组件的 loading 状态，代码更繁琐。`,
    tags: ['Vue', 'Suspense', '异步组件', '内置组件']
  },
  {
    id: 313,
    title: 'Vue 的虚拟 DOM 和 diff 算法原理？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 的虚拟 DOM 和 diff 算法原理？

**答案：**

**虚拟 DOM：** 用 JS 对象描述真实 DOM 结构，避免直接操作 DOM（性能差），通过比较新旧虚拟 DOM 的差异（diff），最小化 DOM 操作。

**Vue 3 diff 算法（快速 diff）：**

1. 头部相同节点处理（从头比较）
2. 尾部相同节点处理（从尾比较）
3. 新增节点处理
4. 删除节点处理
5. 乱序节点处理：
   - 建立新节点的 key → index 映射
   - 找出最长递增子序列（LIS），这些节点不需要移动
   - 其余节点进行移动/新增/删除

### 追问：为什么 v-for 需要 key？

**答案：**

\`key\` 帮助 diff 算法识别节点身份，实现节点复用而非重新创建。没有 \`key\` 时，diff 按位置比较，可能导致错误的节点复用（如输入框内容错位）。\`key\` 应该是稳定唯一的标识，不推荐用 index（删除/插入时 index 变化，导致不必要的更新）。`,
    tags: ['Vue', '虚拟DOM', 'diff算法', '性能']
  },
  {
    id: 314,
    title: 'Vue 3 的 KeepAlive 组件如何使用？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 KeepAlive 组件如何使用？

**答案：**

\`KeepAlive\` 缓存组件实例，避免重复创建销毁，提升性能。

\`\`\`vue
<KeepAlive :include="['ComponentA', 'ComponentB']" :max="10">
  <component :is="currentComponent" />
</KeepAlive>
\`\`\`

**生命周期：** 被缓存的组件不触发 \`mounted/unmounted\`，而是触发 \`onActivated\`（激活）和 \`onDeactivated\`（停用）。

### 追问：KeepAlive 的 max 属性有什么作用？

**答案：**

\`max\` 限制最大缓存实例数量。超过时，最久未使用的实例会被销毁（LRU 缓存策略）。`,
    tags: ['Vue', 'KeepAlive', '缓存', '性能优化']
  },
  {
    id: 315,
    title: 'Vue 3 中如何实现自定义指令？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现自定义指令？

**答案：**

\`\`\`javascript
// 全局注册
app.directive('focus', {
  mounted(el, binding) {
    el.focus();
  }
});

// 局部注册（<script setup> 中以 v 开头的变量自动识别为指令）
const vFocus = {
  mounted: (el) => el.focus()
};

// 使用
<input v-focus />
\`\`\`

**指令钩子：** \`created\`、\`beforeMount\`、\`mounted\`、\`beforeUpdate\`、\`updated\`、\`beforeUnmount\`、\`unmounted\`

### 追问：实现一个 v-permission 权限指令？

**答案：**

\`\`\`javascript
app.directive('permission', {
  mounted(el, binding) {
    const userPermissions = store.state.permissions;
    if (!userPermissions.includes(binding.value)) {
      el.parentNode?.removeChild(el);
    }
  }
});
// 使用
<button v-permission="'admin:delete'">删除</button>
\`\`\``,
    tags: ['Vue', '自定义指令', 'directive']
  },
  {
    id: 316,
    title: 'Vue 3 的 defineComponent 有什么作用？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 defineComponent 有什么作用？

**答案：**

\`defineComponent\` 主要用于 TypeScript 类型推断，让 Options API 组件获得更好的类型支持。在 \`<script setup>\` 中不需要使用。

\`\`\`typescript
export default defineComponent({
  props: { title: String },
  setup(props) {
    // props.title 有正确的类型推断
  }
});
\`\`\`

### 追问：defineComponent 和直接导出对象有什么区别？

**答案：**

功能上没有区别，\`defineComponent\` 只是一个类型辅助函数，在运行时直接返回传入的对象。主要作用是让 TypeScript 能正确推断 \`props\`、\`setup\` 等的类型。`,
    tags: ['Vue', 'defineComponent', 'TypeScript']
  },
  {
    id: 317,
    title: 'Vue 3 中如何实现组件懒加载？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现组件懒加载？

**答案：**

\`\`\`javascript
// 路由懒加载
const routes = [{
  path: '/about',
  component: () => import('./views/About.vue')
}];

// 组件懒加载
import { defineAsyncComponent } from 'vue';
const AsyncComp = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});
\`\`\`

### 追问：路由懒加载的原理是什么？

**答案：**

路由懒加载利用 Webpack/Vite 的代码分割（Code Splitting）功能。\`() => import('./About.vue')\` 是动态 import，打包时会将 About.vue 单独打包成一个 chunk，只有在路由匹配时才加载该 chunk，减少首屏资源体积。`,
    tags: ['Vue', '懒加载', '代码分割', '性能优化']
  },
  {
    id: 318,
    title: 'Vue 3 的 shallowRef 和 shallowReactive 有什么用？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 shallowRef 和 shallowReactive 有什么用？

**答案：**

- \`shallowRef\`：只对 \`.value\` 的赋值响应，不深度追踪对象内部变化
- \`shallowReactive\`：只对第一层属性响应，嵌套对象不是响应式的

**使用场景：** 大型对象（如 ECharts 实例、Three.js 对象）不需要深度响应式，用 \`shallowRef\` 避免性能开销。

\`\`\`javascript
const chartInstance = shallowRef(null); // ECharts 实例不需要深度响应
\`\`\`

### 追问：markRaw 有什么作用？

**答案：**

\`markRaw(obj)\` 标记对象永远不会被转为响应式，即使被放入 \`reactive\` 对象中也不会被代理。适合第三方库实例、大型不可变数据。`,
    tags: ['Vue', 'shallowRef', 'shallowReactive', '性能优化']
  },
  {
    id: 319,
    title: 'Vue 3 中如何实现全局状态管理（不用 Pinia）？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现全局状态管理（不用 Pinia）？

**答案：**

\`\`\`javascript
// store.js
import { reactive, readonly } from 'vue';

const state = reactive({ count: 0, user: null });

const actions = {
  increment() { state.count++ },
  setUser(user) { state.user = user }
};

export const useStore = () => ({
  state: readonly(state), // 只读，防止外部直接修改
  ...actions
});
\`\`\`

### 追问：这种方案和 Pinia 相比有什么缺点？

**答案：**

1. 没有 DevTools 支持，调试困难
2. 没有插件系统
3. 没有持久化支持
4. 没有 SSR 支持（服务端状态隔离）
5. 代码规范需要自己维护`,
    tags: ['Vue', '状态管理', 'reactive', 'readonly']
  },
  {
    id: 320,
    title: 'Vue 3 的 toRef 和 toRefs 的区别？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 toRef 和 toRefs 的区别？

**答案：**

- \`toRef(obj, key)\`：为 reactive 对象的某个属性创建 ref，保持响应性连接
- \`toRefs(obj)\`：将 reactive 对象的所有属性转为 ref，常用于解构

\`\`\`javascript
const state = reactive({ count: 0, name: 'Vue' });

// toRef：单个属性
const count = toRef(state, 'count');
count.value++; // state.count 也会变化

// toRefs：解构时保持响应性
const { count, name } = toRefs(state);
\`\`\`

### 追问：为什么直接解构 reactive 对象会失去响应性？

**答案：**

\`reactive\` 的响应性依赖 Proxy 拦截，解构后得到的是普通值（基本类型）或普通对象引用，不再经过 Proxy，所以失去响应性。\`toRefs\` 将每个属性包装为 ref，通过 \`.value\` 访问时仍然指向原始 reactive 对象的属性，保持响应性。`,
    tags: ['Vue', 'toRef', 'toRefs', '响应式']
  },
  {
    id: 321,
    title: 'Vue 3 的 effectScope 是什么？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 的 effectScope 是什么？

**答案：**

\`effectScope\` 创建一个副作用作用域，可以统一管理和停止其中的所有响应式副作用（computed、watch、watchEffect）。

\`\`\`javascript
const scope = effectScope();
scope.run(() => {
  const doubled = computed(() => count.value * 2);
  watch(count, () => console.log(count.value));
  watchEffect(() => console.log(doubled.value));
});
// 统一停止所有副作用
scope.stop();
\`\`\`

**应用：** 可复用的组合式函数中，统一管理副作用的生命周期。

### 追问：在组合式函数中为什么要注意副作用的清理？

**答案：**

组合式函数中的 \`watch\`、\`setInterval\` 等副作用，如果不在组件卸载时清理，会导致内存泄漏和意外行为。Vue 3 的 \`watch/watchEffect\` 在组件卸载时自动停止，但在 \`effectScope\` 外或异步创建的副作用需要手动清理。`,
    tags: ['Vue', 'effectScope', '副作用', 'Composition API']
  },
  {
    id: 322,
    title: 'Vue 3 中如何实现错误边界？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 中如何实现错误边界？

**答案：**

使用 \`onErrorCaptured\` 钩子捕获子组件的错误：

\`\`\`javascript
const ErrorBoundary = defineComponent({
  setup(props, { slots }) {
    const error = ref(null);
    onErrorCaptured((err, instance, info) => {
      error.value = err;
      return false; // 阻止错误继续向上传播
    });
    return () => error.value
      ? h('div', \`错误：\${error.value.message}\`)
      : slots.default?.();
  }
});
\`\`\`

### 追问：onErrorCaptured 返回 false 有什么作用？

**答案：**

返回 \`false\` 阻止错误继续向上传播（不会触发父组件的 \`onErrorCaptured\` 和全局 \`app.config.errorHandler\`）。不返回或返回其他值，错误会继续向上传播。`,
    tags: ['Vue', '错误处理', 'onErrorCaptured']
  },
  {
    id: 323,
    title: 'Vue 3 的 v-memo 指令有什么用？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 v-memo 指令有什么用？

**答案：**

\`v-memo\` 缓存模板的子树，只有当依赖数组中的值变化时才重新渲染，类似 React 的 \`useMemo\`。

\`\`\`vue
<div v-memo="[item.id, item.selected]">
  <p>{{ item.name }}</p>
  <p>{{ item.description }}</p>
</div>
\`\`\`

**应用：** 配合 \`v-for\` 优化大列表渲染，当列表项只有部分属性影响渲染时使用。

### 追问：v-memo="[]" 有什么效果？

**答案：**

\`v-memo="[]"\` 依赖数组为空，意味着永远不会重新渲染，等同于 \`v-once\`（只渲染一次）。`,
    tags: ['Vue', 'v-memo', '性能优化', '指令']
  },
  {
    id: 324,
    title: 'Vue 3 中如何实现动态组件？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 中如何实现动态组件？

**答案：**

\`\`\`vue
<component :is="currentComponent" v-bind="componentProps" />
\`\`\`

\`is\` 可以是：
1. 组件名字符串（需要全局注册）
2. 组件对象（直接引用）
3. HTML 标签名字符串

\`\`\`javascript
import CompA from './CompA.vue';
import CompB from './CompB.vue';
const components = { CompA, CompB };
const current = ref('CompA');
\`\`\`

### 追问：动态组件配合 KeepAlive 如何使用？

**答案：**

\`\`\`vue
<KeepAlive>
  <component :is="currentComponent" />
</KeepAlive>
\`\`\`

切换组件时，被缓存的组件不会销毁，再次切换回来时恢复之前的状态。`,
    tags: ['Vue', '动态组件', 'KeepAlive']
  },
  {
    id: 325,
    title: 'Vue 3 的插槽（Slot）有哪些类型？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的插槽（Slot）有哪些类型？

**答案：**

1. **默认插槽**：\`<slot />\`
2. **具名插槽**：\`<slot name="header" />\`，使用时 \`<template #header>\`
3. **作用域插槽**：插槽可以向父组件传递数据

\`\`\`vue
<!-- 子组件 -->
<slot :item="item" :index="index" />
<!-- 父组件 -->
<template #default="{ item, index }">
  {{ item.name }}
</template>
\`\`\`

### 追问：作用域插槽的应用场景？

**答案：**

当子组件有数据，但渲染逻辑由父组件决定时使用。如：
- 表格组件：数据由表格管理，但每列的渲染由使用者自定义
- 列表组件：列表数据和虚拟滚动由组件管理，列表项渲染由使用者自定义
- 这是"反转控制"的体现，提高组件灵活性`,
    tags: ['Vue', '插槽', 'Slot', '作用域插槽']
  },
  {
    id: 326,
    title: 'Vue 3 中 nextTick 的原理是什么？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 中 nextTick 的原理是什么？

**答案：**

Vue 的 DOM 更新是异步的，数据变化后不会立即更新 DOM，而是将更新任务放入微任务队列（Promise.then）批量处理。

\`nextTick\` 返回一个 Promise，在 DOM 更新完成后 resolve。

\`\`\`javascript
count.value++;
await nextTick();
console.log(el.value.textContent); // 获取更新后的 DOM
\`\`\`

**原理：** \`nextTick\` 将回调放入 Promise 微任务队列，Vue 的 DOM 更新也在微任务队列中，由于 Vue 的更新先于 \`nextTick\` 的回调（先入队），所以回调执行时 DOM 已经更新。

### 追问：Vue 2 的 nextTick 实现和 Vue 3 有什么区别？

**答案：**

Vue 2 的 \`nextTick\` 有降级策略：Promise → MutationObserver → setImmediate → setTimeout。Vue 3 直接使用 \`Promise.resolve().then()\`，因为不再支持 IE。`,
    tags: ['Vue', 'nextTick', '异步更新', '原理']
  },
  {
    id: 327,
    title: 'Vue 3 中如何实现 v-model 的修饰符？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现 v-model 的修饰符？

**答案：**

\`\`\`vue
<!-- 父组件 -->
<MyInput v-model.trim="text" v-model:title.capitalize="title" />

<!-- 子组件 -->
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) },
  title: String,
  titleModifiers: { default: () => ({}) }
});
const emit = defineEmits(['update:modelValue', 'update:title']);

function handleInput(e) {
  let value = e.target.value;
  if (props.modelModifiers.trim) value = value.trim();
  emit('update:modelValue', value);
}
</script>
\`\`\`

### 追问：Vue 3 支持多个 v-model 吗？

**答案：**

支持。Vue 3 可以在同一组件上使用多个 \`v-model\`：
\`\`\`vue
<UserForm v-model:name="name" v-model:email="email" />
\`\`\``,
    tags: ['Vue', 'v-model', '修饰符', '组件通信']
  },
  {
    id: 328,
    title: 'Vue 3 的 watchEffect 和 watch 如何选择？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 watchEffect 和 watch 如何选择？

**答案：**

\`\`\`javascript
// watchEffect：自动追踪依赖，立即执行
watchEffect(() => {
  console.log(count.value, name.value);
});

// watch：明确指定依赖，可以访问旧值
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('变化了', newCount, oldCount);
}, { immediate: true });
\`\`\`

**选择原则：**
- 需要访问旧值 → \`watch\`
- 需要明确控制依赖 → \`watch\`
- 需要立即执行且依赖自动追踪 → \`watchEffect\`
- 需要在 DOM 更新后执行 → \`watchPostEffect\`

### 追问：如何停止 watchEffect？

**答案：**

\`\`\`javascript
const stop = watchEffect(() => { /* ... */ });
stop(); // 手动停止
\`\`\``,
    tags: ['Vue', 'watchEffect', 'watch', '响应式']
  },
  {
    id: 329,
    title: 'Vue 3 中如何优化大列表渲染？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 中如何优化大列表渲染？

**答案：**

1. **虚拟滚动**：只渲染可视区域的列表项，如 \`vue-virtual-scroller\`
2. **v-memo**：缓存列表项，只有依赖变化时才重新渲染
3. **分页/无限滚动**：减少一次性渲染的数量
4. **KeepAlive**：缓存列表页，避免重复渲染
5. **shallowRef/shallowReactive**：大型列表数据不需要深度响应式

### 追问：虚拟滚动的原理是什么？

**答案：**

虚拟滚动只渲染可视区域内的列表项：
1. 容器固定高度，内部有一个撑开高度的占位元素
2. 根据 \`scrollTop\` 计算起始索引和结束索引
3. 只渲染这个范围内的列表项，通过 \`transform: translateY\` 定位`,
    tags: ['Vue', '性能优化', '虚拟滚动', '大列表']
  },
  {
    id: 330,
    title: 'Vue 3 的 defineModel（Vue 3.4+）是什么？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 defineModel（Vue 3.4+）是什么？

**答案：**

\`defineModel\` 是 Vue 3.4 新增的宏，简化 \`v-model\` 的实现：

\`\`\`vue
<!-- Vue 3.4+ -->
<script setup>
const model = defineModel(); // 自动处理 props 和 emit
</script>
<template>
  <input v-model="model" />
</template>
\`\`\`

### 追问：defineModel 支持多个 v-model 吗？

**答案：**

\`\`\`javascript
const name = defineModel('name');
const email = defineModel('email', { required: true });
// 父组件：<MyForm v-model:name="name" v-model:email="email" />
\`\`\``,
    tags: ['Vue', 'defineModel', 'v-model', 'Vue3.4']
  },
  {
    id: 331,
    title: 'Vue 3 中如何实现组件间通信？列举所有方式',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现组件间通信？列举所有方式

**答案：**

1. **Props/Emits**：父子通信
2. **v-model**：父子双向绑定
3. **ref/expose**：父访问子的方法/属性
4. **provide/inject**：跨层级通信
5. **Pinia/Vuex**：全局状态管理
6. **事件总线（mitt）**：任意组件通信
7. **$attrs**：透传属性
8. **插槽**：父向子传递模板内容

### 追问：$attrs 有什么用？

**答案：**

\`$attrs\` 包含父组件传递的、未被 \`props\` 和 \`emits\` 声明的属性。默认自动继承到根元素。可以用 \`inheritAttrs: false\` 关闭自动继承，手动用 \`v-bind="$attrs"\` 传递给特定元素。`,
    tags: ['Vue', '组件通信', 'props', 'emit', 'provide']
  },
  {
    id: 332,
    title: 'Vue 3 的 useTemplateRef（Vue 3.5+）是什么？',
    category: 'Vue',
    difficulty: 'easy',
    content: `## Vue 3 的 useTemplateRef（Vue 3.5+）是什么？

**答案：**

Vue 3.5 新增，用于获取模板中的 DOM 元素或组件实例引用：

\`\`\`vue
<script setup>
import { useTemplateRef } from 'vue';
const inputRef = useTemplateRef('myInput');
</script>
<template>
  <input ref="myInput" />
</template>
\`\`\`

### 追问：和之前的 ref 方式有什么区别？

**答案：**

\`useTemplateRef\` 通过字符串名称关联模板引用，类型推断更好，且与 \`ref\` 变量名解耦（模板中的 ref 名称和 JS 变量名可以不同）。`,
    tags: ['Vue', 'useTemplateRef', 'Vue3.5', 'ref']
  },
  {
    id: 333,
    title: 'Vue 3 中如何处理 SSR（服务端渲染）？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 中如何处理 SSR（服务端渲染）？

**答案：**

Vue 3 支持 SSR，通常使用 Nuxt 3 框架。

**核心 API：**
- \`renderToString(app)\`：将 Vue 应用渲染为 HTML 字符串
- \`createSSRApp()\`：创建 SSR 模式的应用

**注意事项：**
1. 避免在 \`setup\` 中直接访问浏览器 API（\`window\`、\`document\`）
2. 状态隔离：每个请求创建新的 store 实例
3. 数据预取：在服务端获取数据

### 追问：SSR 和 CSR 的区别？

**答案：**

- **CSR**：浏览器下载空壳 HTML → 下载执行 JS → 渲染，首屏慢，SEO 差
- **SSR**：服务器渲染完整 HTML → 浏览器直接显示，首屏快，SEO 好
- **SSG**：构建时生成 HTML，性能最好，适合静态内容`,
    tags: ['Vue', 'SSR', 'Nuxt', '服务端渲染']
  },
  {
    id: 334,
    title: 'Vue 3 的 app.use() 插件机制是什么？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 的 app.use() 插件机制是什么？

**答案：**

插件是一个有 \`install\` 方法的对象，通过 \`app.use(plugin, options)\` 安装：

\`\`\`javascript
const MyPlugin = {
  install(app, options) {
    app.component('MyButton', MyButton);
    app.directive('focus', focusDirective);
    app.config.globalProperties.$http = axios;
    app.provide('config', options);
  }
};
app.use(MyPlugin, { theme: 'dark' });
\`\`\`

### 追问：Vue 3 中如何替代 Vue 2 的 Vue.prototype？

**答案：**

使用 \`app.config.globalProperties\` 替代，但更推荐使用 \`provide/inject\` 或 Composable 函数，避免全局污染。`,
    tags: ['Vue', '插件', 'app.use', 'globalProperties']
  },
  {
    id: 335,
    title: 'Vue 3 中如何实现权限控制？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 中如何实现权限控制？

**答案：**

1. **路由权限**：\`router.beforeEach\` 中检查权限，无权限重定向
2. **菜单权限**：根据后端权限列表动态生成菜单
3. **按钮权限**：自定义 \`v-permission\` 指令
4. **动态路由**：\`router.addRoute()\` 动态添加有权限的路由

\`\`\`javascript
const userRoutes = allRoutes.filter(route =>
  userPermissions.includes(route.meta.permission)
);
userRoutes.forEach(route => router.addRoute(route));
\`\`\`

### 追问：前端权限控制的局限性是什么？

**答案：**

前端权限控制只是 UI 层面的保护，用户可以通过修改 JS 或直接调用 API 绕过。真正的权限控制必须在后端实现。`,
    tags: ['Vue', '权限控制', '路由守卫', '动态路由']
  },
  {
    id: 336,
    title: 'Vue 3 中如何实现主题切换？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现主题切换？

**答案：**

**方案一：CSS 变量**
\`\`\`javascript
document.documentElement.style.setProperty('--primary-color', '#ff0000');
\`\`\`

**方案二：动态替换 CSS（ElementPlus 方案）**
\`\`\`javascript
const cssText = await fetch('/element-plus.css').then(r => r.text());
const newCss = cssText.replace(/#409EFF/g, newColor);
const style = document.createElement('style');
style.textContent = newCss;
document.head.appendChild(style);
\`\`\`

**方案三：预设多套主题，切换 class**

### 追问：如何实现 ElementPlus 的主题色动态替换？

**答案：**

通过正则匹配 ElementPlus 默认主题色及其衍生色，替换为新颜色。可用 \`tinycolor2\` 等颜色库辅助计算深浅变体。`,
    tags: ['Vue', '主题切换', 'CSS变量', 'ElementPlus']
  },
  {
    id: 337,
    title: 'Vue 3 中 ref 的类型推断如何处理？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中 ref 的类型推断如何处理？

**答案：**

\`\`\`typescript
// 基本类型
const count = ref(0);         // Ref<number>
const name = ref('');          // Ref<string>

// 复杂类型
interface User { name: string; age: number }
const user = ref<User | null>(null);  // Ref<User | null>

// DOM 引用
const inputEl = ref<HTMLInputElement | null>(null);
inputEl.value?.focus();

// 组件引用
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null);
\`\`\`

### 追问：Ref<T> 和 ComputedRef<T> 的区别？

**答案：**

- \`Ref<T>\`：可读写的响应式引用
- \`ComputedRef<T>\`：只读的计算属性引用
- \`WritableComputedRef<T>\`：可读写的计算属性（带 getter 和 setter）`,
    tags: ['Vue', 'TypeScript', 'ref', '类型推断']
  },
  {
    id: 338,
    title: 'Vue 3 中如何实现表单验证？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现表单验证？

**答案：**

结合 ElementPlus 表单：

\`\`\`vue
<el-form :model="form" :rules="rules" ref="formRef">
  <el-form-item prop="name" label="姓名">
    <el-input v-model="form.name" />
  </el-form-item>
</el-form>

<script setup>
const formRef = ref();
const form = reactive({ name: '', email: '' });
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' }
  ]
};
async function submit() {
  await formRef.value.validate();
}
</script>
\`\`\`

### 追问：如何实现自定义验证规则？

**答案：**

\`\`\`javascript
const rules = {
  phone: [{
    validator: (rule, value, callback) => {
      if (!/^1[3-9]\\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确'));
      } else { callback(); }
    },
    trigger: 'blur'
  }]
};
\`\`\``,
    tags: ['Vue', '表单验证', 'ElementPlus', '自定义规则']
  },
  {
    id: 339,
    title: 'Vue 3 中如何实现无限滚动？',
    category: 'Vue',
    difficulty: 'hard',
    content: `## Vue 3 中如何实现无限滚动？

**答案：**

\`\`\`javascript
// 方案一：IntersectionObserver（推荐）
const sentinel = ref(null);
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting && !loading.value) {
    loadMore();
  }
});
onMounted(() => observer.observe(sentinel.value));
onUnmounted(() => observer.disconnect());

// 方案二：滚动事件
const handleScroll = throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}, 200);
\`\`\`

### 追问：无限滚动和分页各有什么适用场景？

**答案：**

- **无限滚动**：内容流（社交媒体、图片流），体验流畅
- **分页**：需要精确定位（搜索结果、数据表格），SEO 友好`,
    tags: ['Vue', '无限滚动', 'IntersectionObserver', '性能']
  },
  {
    id: 340,
    title: 'Vue 3 中如何实现国际化（i18n）？',
    category: 'Vue',
    difficulty: 'medium',
    content: `## Vue 3 中如何实现国际化（i18n）？

**答案：**

\`\`\`javascript
import { createI18n } from 'vue-i18n';
const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages: {
    'zh-CN': { hello: '你好', welcome: '欢迎 {name}' },
    'en': { hello: 'Hello', welcome: 'Welcome {name}' }
  }
});
app.use(i18n);

// 模板中：{{ $t('hello') }}
// JS 中：const { t } = useI18n(); t('hello')

// 切换语言
i18n.global.locale.value = 'en';
\`\`\`

### 追问：如何实现接口请求的国际化？

**答案：**

在 axios 请求拦截器中设置请求头：
\`\`\`javascript
axios.interceptors.request.use(config => {
  config.headers['Accept-Language'] = i18n.global.locale.value;
  return config;
});
\`\`\`
后端根据 \`Accept-Language\` 返回对应语言的数据。`,
    tags: ['Vue', 'i18n', '国际化', 'vue-i18n']
  },
]