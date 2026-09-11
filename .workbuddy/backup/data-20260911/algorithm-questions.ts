import type { Question } from './types'

export const algorithmQuestions: Question[] = [
  {
    id: 701,
    title: '时间复杂度和空间复杂度是什么？',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 时间复杂度和空间复杂度是什么？

**答案：**
- **时间复杂度**：算法执行时间随输入规模增长的变化趋势，用大 O 表示法
- **空间复杂度**：算法执行所需额外内存随输入规模的变化趋势

**常见复杂度（从低到高）：**
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)

**追问：** 什么是均摊时间复杂度？

**答案：**
均摊时间复杂度是对一系列操作的平均时间复杂度。如动态数组的 \`push\` 操作，大多数时候是 O(1)，偶尔需要扩容（O(n)），但均摊下来每次操作是 O(1)。`,
    tags: ['时间复杂度', '空间复杂度', '大O表示法']
  },
  {
    id: 702,
    title: '数组和链表的区别？',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 数组和链表的区别？

**答案：**
| | 数组 | 链表 |
|--|------|------|
| 内存 | 连续 | 不连续 |
| 随机访问 | O(1) | O(n) |
| 插入/删除（头部） | O(n) | O(1) |
| 插入/删除（尾部） | O(1) | O(n)（单链表）/O(1)（双链表） |
| 空间 | 固定或动态扩容 | 按需分配，有指针开销 |

**追问：** JavaScript 的数组是真正的数组吗？

**答案：**
JS 的数组是特殊的对象，键是数字字符串。V8 引擎对密集数组（连续整数索引）会优化为真正的连续内存（类似 C 数组），对稀疏数组则退化为哈希表。所以 JS 数组的性能取决于使用方式。`,
    tags: ['数组', '链表', 'V8引擎', '数据结构']
  },
  {
    id: 703,
    title: '实现二分查找',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现二分查找

**答案：**
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] === target) return mid
    else if (arr[mid] < target) left = mid + 1
    else right = mid - 1
  }
  return -1
}
// 时间复杂度：O(log n)，空间复杂度：O(1)
\`\`\`

**追问：** 二分查找的变体：找第一个大于等于 target 的位置？

**答案：**
\`\`\`javascript
function lowerBound(arr, target) {
  let left = 0, right = arr.length
  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] < target) left = mid + 1
    else right = mid
  }
  return left // 第一个 >= target 的位置
}
\`\`\``,
    tags: ['二分查找', '搜索算法', 'O(log n)']
  },
  {
    id: 704,
    title: '实现快速排序',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现快速排序

**答案：**
\`\`\`javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr
  const pivot = partition(arr, left, right)
  quickSort(arr, left, pivot - 1)
  quickSort(arr, pivot + 1, right)
  return arr
}

function partition(arr, left, right) {
  const pivot = arr[right]
  let i = left - 1
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]
  return i + 1
}
// 平均时间复杂度：O(n log n)，最坏：O(n²)，空间：O(log n)
\`\`\`

**追问：** 快速排序和归并排序的区别？

**答案：**
- **快速排序**：原地排序，空间 O(log n)，不稳定，平均 O(n log n)，最坏 O(n²)
- **归并排序**：需要额外空间 O(n)，稳定，始终 O(n log n)
- 实际中快速排序更常用（缓存友好），对稳定性有要求时用归并排序`,
    tags: ['快速排序', '排序算法', '分治', '递归']
  },
  {
    id: 705,
    title: '实现 DFS 和 BFS',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现深度优先搜索（DFS）和广度优先搜索（BFS）

**答案：**
\`\`\`javascript
// 树的 DFS（递归）
function dfs(node) {
  if (!node) return
  console.log(node.val)
  dfs(node.left)
  dfs(node.right)
}

// 树的 BFS（队列）
function bfs(root) {
  if (!root) return
  const queue = [root]
  while (queue.length) {
    const node = queue.shift()
    console.log(node.val)
    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }
}
\`\`\`

**追问：** DFS 和 BFS 各适合什么场景？

**答案：**
- **DFS**：找路径、拓扑排序、连通分量、回溯问题（全排列、组合）
- **BFS**：最短路径（无权图）、层序遍历、最少步数问题`,
    tags: ['DFS', 'BFS', '树遍历', '图搜索']
  },
  {
    id: 706,
    title: '实现斐波那契数列（动态规划）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现斐波那契数列（动态规划）

**答案：**
\`\`\`javascript
// 递归（指数级复杂度，不推荐）
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

// 动态规划（O(n) 时间，O(n) 空间）
function fib(n) {
  const dp = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}

// 空间优化（O(1) 空间）
function fib(n) {
  if (n <= 1) return n
  let [a, b] = [0, 1]
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}
\`\`\`

**追问：** 什么是记忆化（Memoization）？

**答案：**
记忆化是将函数的计算结果缓存起来，避免重复计算：
\`\`\`javascript
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}
\`\`\``,
    tags: ['斐波那契', '动态规划', '记忆化', '空间优化']
  },
  {
    id: 707,
    title: '实现链表反转',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现链表反转

**答案：**
\`\`\`javascript
// 迭代
function reverseList(head) {
  let prev = null, curr = head
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  return prev
}

// 递归
function reverseList(head) {
  if (!head || !head.next) return head
  const newHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return newHead
}
\`\`\`

**追问：** 如何判断链表是否有环？

**答案：**
**Floyd 判圈算法（快慢指针）：**
\`\`\`javascript
function hasCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) return true
  }
  return false
}
\`\`\``,
    tags: ['链表反转', '快慢指针', 'Floyd判圈', '递归']
  },
  {
    id: 708,
    title: '实现有效括号匹配',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现有效括号匹配

**答案：**
\`\`\`javascript
function isValid(s) {
  const stack = []
  const map = { ')': '(', ']': '[', '}': '{' }
  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char)
    } else {
      if (stack.pop() !== map[char]) return false
    }
  }
  return stack.length === 0
}
// 时间复杂度：O(n)，空间复杂度：O(n)
\`\`\`

**追问：** 栈的应用场景有哪些？

**答案：**
1. 括号匹配
2. 函数调用栈（递归）
3. 浏览器历史记录（前进/后退）
4. 表达式求值（中缀转后缀）
5. 单调栈（下一个更大元素）
6. DFS 的迭代实现`,
    tags: ['栈', '括号匹配', '数据结构']
  },
  {
    id: 709,
    title: '实现两数之和（哈希表）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现两数之和（哈希表）

**答案：**
\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map() // 值 → 索引
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      return [map.get(complement), i]
    }
    map.set(nums[i], i)
  }
  return []
}
// 时间复杂度：O(n)，空间复杂度：O(n)
\`\`\`

**追问：** 哈希表的时间复杂度为什么是 O(1)？

**答案：**
哈希表通过哈希函数将键映射到数组索引，理想情况下查找、插入、删除都是 O(1)。但存在哈希冲突时，最坏情况退化为 O(n)。现代哈希表通过链地址法或开放寻址法处理冲突，平均情况保持 O(1)。`,
    tags: ['两数之和', '哈希表', 'Map', 'O(1)查找']
  },
  {
    id: 710,
    title: '实现最长公共子序列（LCS）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现最长公共子序列（LCS）

**答案：**
\`\`\`javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp[m][n]
}
// 时间复杂度：O(mn)，空间复杂度：O(mn)
\`\`\`

**追问：** 动态规划的核心思想是什么？

**答案：**
动态规划将问题分解为重叠子问题，通过存储子问题的解避免重复计算。核心要素：
1. **最优子结构**：问题的最优解包含子问题的最优解
2. **重叠子问题**：子问题会被重复计算
3. **状态转移方程**：如何从子问题推导出当前问题的解`,
    tags: ['LCS', '动态规划', '状态转移方程', '二维DP']
  },
  {
    id: 711,
    title: '实现二叉树的层序遍历',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现二叉树的层序遍历

**答案：**
\`\`\`javascript
function levelOrder(root) {
  if (!root) return []
  const result = [], queue = [root]
  while (queue.length) {
    const levelSize = queue.length
    const level = []
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      level.push(node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    result.push(level)
  }
  return result
}
\`\`\`

**追问：** 如何判断二叉树是否是平衡二叉树？

**答案：**
\`\`\`javascript
function isBalanced(root) {
  function height(node) {
    if (!node) return 0
    const left = height(node.left)
    if (left === -1) return -1
    const right = height(node.right)
    if (right === -1) return -1
    if (Math.abs(left - right) > 1) return -1
    return Math.max(left, right) + 1
  }
  return height(root) !== -1
}
\`\`\``,
    tags: ['层序遍历', 'BFS', '二叉树', '平衡二叉树']
  },
  {
    id: 712,
    title: '实现数组扁平化',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现数组扁平化

**答案：**
\`\`\`javascript
// 方法1：原生 flat
arr.flat(Infinity)

// 方法2：递归
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

// 方法3：迭代（栈）
function flatten(arr) {
  const stack = [...arr], result = []
  while (stack.length) {
    const item = stack.pop()
    if (Array.isArray(item)) stack.push(...item)
    else result.unshift(item)
  }
  return result
}
\`\`\`

**追问：** 如何实现指定深度的扁平化？

**答案：**
\`\`\`javascript
function flatten(arr, depth = 1) {
  if (depth === 0) return arr.slice()
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item, depth - 1) : item)
  }, [])
}
\`\`\``,
    tags: ['数组扁平化', 'flat', '递归', '栈']
  },
  {
    id: 713,
    title: '实现数组去重',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现数组去重

**答案：**
\`\`\`javascript
// 方法1：Set（最简洁）
const unique = arr => [...new Set(arr)]

// 方法2：filter + indexOf
const unique = arr => arr.filter((item, index) => arr.indexOf(item) === index)

// 方法3：reduce + includes
const unique = arr => arr.reduce((acc, item) => {
  if (!acc.includes(item)) acc.push(item)
  return acc
}, [])

// 方法4：Map（可以处理对象去重）
const unique = arr => {
  const map = new Map()
  return arr.filter(item => !map.has(item) && map.set(item, true))
}
\`\`\`

**追问：** 如何对对象数组按某个属性去重？

**答案：**
\`\`\`javascript
function uniqueBy(arr, key) {
  const map = new Map()
  return arr.filter(item => {
    const k = item[key]
    if (map.has(k)) return false
    map.set(k, true)
    return true
  })
}
\`\`\``,
    tags: ['数组去重', 'Set', 'Map', 'filter']
  },
  {
    id: 714,
    title: '实现 LRU 缓存',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现 LRU 缓存

**答案：**
\`\`\`javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.cache = new Map() // Map 保持插入顺序
  }

  get(key) {
    if (!this.cache.has(key)) return -1
    const value = this.cache.get(key)
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }
}
// get/put 时间复杂度：O(1)
\`\`\`

**追问：** LRU 缓存在前端的应用场景？

**答案：**
1. \`KeepAlive\` 的 \`max\` 属性：超过最大缓存数时，淘汰最久未访问的组件
2. 图片缓存：限制内存中缓存的图片数量
3. API 响应缓存：缓存最近的请求结果`,
    tags: ['LRU', '缓存淘汰', 'Map', '数据结构设计']
  },
  {
    id: 715,
    title: '实现全排列（回溯算法）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现全排列（回溯算法）

**答案：**
\`\`\`javascript
function permute(nums) {
  const result = [], path = []
  const used = new Array(nums.length).fill(false)

  function backtrack() {
    if (path.length === nums.length) {
      result.push([...path])
      return
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue
      used[i] = true
      path.push(nums[i])
      backtrack()
      path.pop()
      used[i] = false
    }
  }

  backtrack()
  return result
}
// 时间复杂度：O(n × n!)
\`\`\`

**追问：** 回溯算法的核心思想是什么？

**答案：**
回溯算法是一种通过探索所有可能的候选解来找出所有解的算法。当发现当前候选解不是有效解时，回退（撤销选择）并尝试其他候选解。核心：**选择 → 递归 → 撤销选择**。`,
    tags: ['全排列', '回溯', '递归', '组合问题']
  },
  {
    id: 716,
    title: '实现最大子数组和（Kadane 算法）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现最大子数组和（Kadane 算法）

**答案：**
\`\`\`javascript
function maxSubArray(nums) {
  let maxSum = nums[0], currentSum = nums[0]
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i])
    maxSum = Math.max(maxSum, currentSum)
  }
  return maxSum
}
// 时间复杂度：O(n)，空间复杂度：O(1)
\`\`\`

**追问：** 这道题用动态规划如何理解？

**答案：**
\`dp[i]\` 表示以 \`nums[i]\` 结尾的最大子数组和：
- 如果 \`dp[i-1] > 0\`，则 \`dp[i] = dp[i-1] + nums[i]\`（加上前面的正收益）
- 如果 \`dp[i-1] <= 0\`，则 \`dp[i] = nums[i]\`（重新开始）
- 即 \`dp[i] = Math.max(nums[i], dp[i-1] + nums[i])\``,
    tags: ['Kadane算法', '最大子数组', '动态规划', '贪心']
  },
  {
    id: 717,
    title: '实现字符串的 KMP 匹配算法',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现字符串的 KMP 匹配算法

**答案：**
\`\`\`javascript
function kmpSearch(text, pattern) {
  const n = text.length, m = pattern.length
  if (m === 0) return 0

  // 构建 next 数组（部分匹配表）
  const next = new Array(m).fill(0)
  let k = 0
  for (let i = 1; i < m; i++) {
    while (k > 0 && pattern[k] !== pattern[i]) k = next[k - 1]
    if (pattern[k] === pattern[i]) k++
    next[i] = k
  }

  // 匹配
  k = 0
  for (let i = 0; i < n; i++) {
    while (k > 0 && pattern[k] !== text[i]) k = next[k - 1]
    if (pattern[k] === text[i]) k++
    if (k === m) return i - m + 1
  }
  return -1
}
// 时间复杂度：O(n + m)
\`\`\`

**追问：** KMP 相比暴力匹配的优势是什么？

**答案：**
暴力匹配：O(nm)，每次失配都从头开始。KMP：O(n+m)，利用已匹配的信息（next 数组），失配时不回退文本指针，只移动模式指针，避免重复比较。`,
    tags: ['KMP', '字符串匹配', 'next数组', '模式匹配']
  },
  {
    id: 718,
    title: '实现堆（优先队列）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现堆（优先队列）

**答案：**
\`\`\`javascript
class MinHeap {
  constructor() { this.heap = [] }

  push(val) {
    this.heap.push(val)
    this._bubbleUp(this.heap.length - 1)
  }

  pop() {
    const min = this.heap[0]
    const last = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = last
      this._sinkDown(0)
    }
    return min
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      if (this.heap[parent] <= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]]
      i = parent
    }
  }

  _sinkDown(i) {
    const n = this.heap.length
    while (true) {
      let min = i
      const left = 2 * i + 1, right = 2 * i + 2
      if (left < n && this.heap[left] < this.heap[min]) min = left
      if (right < n && this.heap[right] < this.heap[min]) min = right
      if (min === i) break;
      [this.heap[min], this.heap[i]] = [this.heap[i], this.heap[min]]
      i = min
    }
  }
}
\`\`\`

**追问：** 堆的应用场景？

**答案：**
1. 优先队列（任务调度）
2. 堆排序（O(n log n)）
3. Top K 问题（找最大/最小的 K 个元素）
4. 合并 K 个有序链表
5. 中位数维护（两个堆）`,
    tags: ['堆', '优先队列', 'Top K', '堆排序']
  },
  {
    id: 719,
    title: '实现图的拓扑排序',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现图的拓扑排序

**答案：**
\`\`\`javascript
// Kahn 算法（BFS）
function topologicalSort(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0)
  const graph = Array.from({ length: numCourses }, () => [])

  for (const [a, b] of prerequisites) {
    graph[b].push(a)
    inDegree[a]++
  }

  const queue = []
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i)
  }

  const result = []
  while (queue.length) {
    const node = queue.shift()
    result.push(node)
    for (const next of graph[node]) {
      if (--inDegree[next] === 0) queue.push(next)
    }
  }

  return result.length === numCourses ? result : []
}
\`\`\`

**追问：** 拓扑排序的应用场景？

**答案：**
1. 课程依赖（先修课程）
2. 任务调度（有依赖关系的任务）
3. 模块依赖分析（Webpack 构建顺序）
4. 编译顺序（有依赖的文件）`,
    tags: ['拓扑排序', 'Kahn算法', 'BFS', '有向无环图']
  },
  {
    id: 720,
    title: '实现 Promise.all',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现 Promise.all

**答案：**
\`\`\`javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([])
    const results = new Array(promises.length)
    let count = 0
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        results[index] = value
        if (++count === promises.length) resolve(results)
      }).catch(reject)
    })
  })
}
\`\`\`

**追问：** 实现 Promise.allSettled？

**答案：**
\`\`\`javascript
function promiseAllSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p)
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
    )
  )
}
\`\`\``,
    tags: ['Promise.all', 'Promise.allSettled', '手写实现', '并发控制']
  },
  {
    id: 721,
    title: '实现合并两个有序数组',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现合并两个有序数组

**答案：**
给定两个有序数组 nums1 和 nums2，将 nums2 合并到 nums1 中（nums1 有足够空间）。

\`\`\`javascript
function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--]
    } else {
      nums1[k--] = nums2[j--]
    }
  }
  while (j >= 0) {
    nums1[k--] = nums2[j--]
  }
}
// 时间复杂度：O(m + n)，空间复杂度：O(1)
\`\`\`

**追问：** 为什么从后往前合并？

**答案：**
从后往前可以原地操作，不会覆盖 nums1 中还未处理的元素。如果从前往后，需要额外空间暂存被覆盖的元素。这是面试中"双指针从尾部开始"的经典技巧。`,
    tags: ['合并有序数组', '双指针', '原地操作']
  },
  {
    id: 722,
    title: '实现爬楼梯问题',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现爬楼梯问题

**答案：**
每次可以爬 1 或 2 个台阶，求爬到第 n 阶有多少种方法。

\`\`\`javascript
function climbStairs(n) {
  if (n <= 2) return n
  let a = 1, b = 2
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}
// 时间复杂度：O(n)，空间复杂度：O(1)
\`\`\`

**追问：** 如果每次可以爬 1~k 步呢？

**答案：**
\`\`\`javascript
function climbStairs(n, k) {
  const dp = new Array(n + 1).fill(0)
  dp[0] = 1
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= k && j <= i; j++) {
      dp[i] += dp[i - j]
    }
  }
  return dp[n]
}
\`\`\`
本质是完全背包问题的变形，也是斐波那契数列的推广。`,
    tags: ['爬楼梯', '动态规划', '斐波那契', '完全背包']
  },
  {
    id: 723,
    title: '实现岛屿数量（DFS/BFS 矩阵搜索）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现岛屿数量

**答案：**
给定一个二维网格，'1' 代表陆地，'0' 代表水，计算岛屿数量。

\`\`\`javascript
function numIslands(grid) {
  if (!grid.length) return 0
  const rows = grid.length, cols = grid[0].length
  let count = 0

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return
    grid[r][c] = '0' // 标记已访问
    dfs(r + 1, c)
    dfs(r - 1, c)
    dfs(r, c + 1)
    dfs(r, c - 1)
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++
        dfs(r, c)
      }
    }
  }
  return count
}
// 时间复杂度：O(m × n)，空间复杂度：O(m × n)（递归栈）
\`\`\`

**追问：** 如何求最大岛屿面积？

**答案：**
\`\`\`javascript
function maxAreaOfIsland(grid) {
  let maxArea = 0
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === 0) return 0
    grid[r][c] = 0
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)
  }
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === 1) maxArea = Math.max(maxArea, dfs(r, c))
  return maxArea
}
\`\`\``,
    tags: ['岛屿数量', 'DFS', '矩阵搜索', '连通分量']
  },
  {
    id: 724,
    title: '实现字符串转数字（atoi）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现字符串转数字（atoi）

**答案：**
这是大厂高频面试题，考察边界处理能力。

\`\`\`javascript
function myAtoi(s) {
  const INT_MAX = 2 ** 31 - 1, INT_MIN = -(2 ** 31)
  let i = 0, sign = 1, result = 0

  // 1. 跳过前导空格
  while (i < s.length && s[i] === ' ') i++

  // 2. 处理符号
  if (i < s.length && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1
    i++
  }

  // 3. 转换数字
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    const digit = s[i].charCodeAt(0) - '0'.charCodeAt(0)
    // 溢出检查
    if (result > Math.floor((INT_MAX - digit) / 10)) {
      return sign === 1 ? INT_MAX : INT_MIN
    }
    result = result * 10 + digit
    i++
  }

  return sign * result
}
\`\`\`

**追问：** 面试中这道题主要考察什么？

**答案：**
主要考察**边界处理和思维严谨性**：
1. 前导空格跳过
2. 正负号处理
3. 非数字字符终止
4. 整数溢出处理（32位范围 [-2³¹, 2³¹-1]）
5. 空字符串、纯空格等特殊输入`,
    tags: ['字符串转数字', 'atoi', '边界处理', '溢出检查']
  },
  {
    id: 725,
    title: '实现最小栈（O(1) 获取最小值）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现最小栈

**答案：**
设计一个支持 push、pop、top 和 getMin 操作的栈，所有操作时间复杂度为 O(1)。

\`\`\`javascript
class MinStack {
  constructor() {
    this.stack = []
    this.minStack = [] // 辅助栈，记录每个状态的最小值
  }

  push(val) {
    this.stack.push(val)
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1])
    this.minStack.push(min)
  }

  pop() {
    this.stack.pop()
    this.minStack.pop()
  }

  top() {
    return this.stack[this.stack.length - 1]
  }

  getMin() {
    return this.minStack[this.minStack.length - 1]
  }
}
\`\`\`

**追问：** 如何只用一个栈实现？

**答案：**
\`\`\`javascript
class MinStack {
  constructor() {
    this.stack = []
    this.min = Infinity
  }
  push(val) {
    if (val <= this.min) {
      this.stack.push(this.min) // 保存旧的最小值
      this.min = val
    }
    this.stack.push(val)
  }
  pop() {
    if (this.stack.pop() === this.min) {
      this.min = this.stack.pop() // 恢复旧的最小值
    }
  }
  getMin() { return this.min }
}
\`\`\``,
    tags: ['最小栈', '栈', '辅助栈', 'O(1)']
  },
  {
    id: 726,
    title: '实现三数之和',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现三数之和

**答案：**
给定数组 nums，找出所有和为 0 的三元组，不能重复。

\`\`\`javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break // 最小值大于0，不可能三数之和为0
    if (i > 0 && nums[i] === nums[i - 1]) continue // 跳过重复

    let left = i + 1, right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]])
        while (left < right && nums[left] === nums[left + 1]) left++
        while (left < right && nums[right] === nums[right - 1]) right--
        left++
        right--
      } else if (sum < 0) {
        left++
      } else {
        right--
      }
    }
  }
  return result
}
// 时间复杂度：O(n²)，空间复杂度：O(1)（不算结果数组）
\`\`\`

**追问：** 为什么要先排序？

**答案：**
排序后可以利用双指针，将内层循环从 O(n²) 降为 O(n)，总复杂度从暴力的 O(n³) 降为 O(n²)。排序还方便跳过重复元素，避免结果重复。这是"排序 + 双指针"的经典模式。`,
    tags: ['三数之和', '双指针', '排序', '去重']
  },
  {
    id: 727,
    title: '实现二叉搜索树的验证',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现二叉搜索树的验证

**答案：**
判断一棵二叉树是否是有效的二叉搜索树（BST）。

\`\`\`javascript
function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true
    if (node.val <= min || node.val >= max) return false
    return validate(node.left, min, node.val) &&
           validate(node.right, node.val, max)
  }
  return validate(root, -Infinity, Infinity)
}
\`\`\`

**方法二：中序遍历（BST中序遍历是递增的）**
\`\`\`javascript
function isValidBST(root) {
  let prev = -Infinity
  function inorder(node) {
    if (!node) return true
    if (!inorder(node.left)) return false
    if (node.val <= prev) return false
    prev = node.val
    return inorder(node.right)
  }
  return inorder(root)
}
\`\`\`

**追问：** BST 中如何找第 K 小的元素？

**答案：**
中序遍历到第 K 个节点即可，时间复杂度 O(H + K)，H 为树高。也可以用增强 BST（每个节点记录左子树大小）实现 O(H) 查找。`,
    tags: ['BST验证', '二叉搜索树', '中序遍历', '递归']
  },
  {
    id: 728,
    title: '实现买卖股票的最佳时机',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 实现买卖股票的最佳时机

**答案：**
给定股票价格数组，只能买卖一次，求最大利润。

\`\`\`javascript
function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0
  for (const price of prices) {
    minPrice = Math.min(minPrice, price)
    maxProfit = Math.max(maxProfit, price - minPrice)
  }
  return maxProfit
}
// 时间复杂度：O(n)，空间复杂度：O(1)
\`\`\`

**追问：** 如果可以买卖多次呢？

**答案：**
\`\`\`javascript
// 贪心：只要今天比昨天贵就卖
function maxProfit(prices) {
  let profit = 0
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1]
    }
  }
  return profit
}
\`\`\`

**追问：** 如果最多买卖 K 次呢？

**答案：**
使用动态规划，状态定义 \`dp[i][j][0/1]\` 表示第 i 天、已交易 j 次、持有/不持有股票的最大利润。这是经典的"状态机 DP"问题。`,
    tags: ['买卖股票', '贪心', '动态规划', '状态机DP']
  },
  {
    id: 729,
    title: '实现无重复字符的最长子串',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现无重复字符的最长子串

**答案：**
给定字符串，找出不含重复字符的最长子串长度。

\`\`\`javascript
function lengthOfLongestSubstring(s) {
  const map = new Map() // 字符 → 最新索引
  let maxLen = 0, left = 0

  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right]) && map.get(s[right]) >= left) {
      left = map.get(s[right]) + 1
    }
    map.set(s[right], right)
    maxLen = Math.max(maxLen, right - left + 1)
  }
  return maxLen
}
// 时间复杂度：O(n)，空间复杂度：O(min(m, n))，m 是字符集大小
\`\`\`

**追问：** 这属于什么算法模式？

**答案：**
这是经典的**滑动窗口**模式。滑动窗口适用于：
1. 最长/最短子串/子数组问题
2. 窗口内满足某个条件
3. 通常用双指针（left, right）维护窗口

常见滑动窗口题型：
- 最小覆盖子串
- 字符串的排列
- 找到字符串中所有字母异位词
- 长度最小的子数组`,
    tags: ['最长子串', '滑动窗口', '双指针', 'Map']
  },
  {
    id: 730,
    title: '实现接雨水问题',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现接雨水问题

**答案：**
给定 n 个非负整数表示柱子高度，计算能接多少雨水。

\`\`\`javascript
// 方法一：双指针（最优解）
function trap(height) {
  let left = 0, right = height.length - 1
  let leftMax = 0, rightMax = 0, water = 0

  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left])
      water += leftMax - height[left]
      left++
    } else {
      rightMax = Math.max(rightMax, height[right])
      water += rightMax - height[right]
      right--
    }
  }
  return water
}
// 时间复杂度：O(n)，空间复杂度：O(1)
\`\`\`

**方法二：单调栈**
\`\`\`javascript
function trap(height) {
  const stack = []
  let water = 0
  for (let i = 0; i < height.length; i++) {
    while (stack.length && height[i] > height[stack[stack.length - 1]]) {
      const top = stack.pop()
      if (!stack.length) break
      const distance = i - stack[stack.length - 1] - 1
      const bounded = Math.min(height[i], height[stack[stack.length - 1]]) - height[top]
      water += distance * bounded
    }
    stack.push(i)
  }
  return water
}
\`\`\`

**追问：** 面试中遇到这类题的思路？

**答案：**
1. 先想暴力解：每个位置的水量 = min(左边最高, 右边最高) - 当前高度
2. 优化：预处理左右最大值数组 → O(n) 时间 O(n) 空间
3. 再优化：双指针消除额外空间 → O(n) 时间 O(1) 空间
面试中展示这种**逐步优化的思路**比直接给最优解更加分。`,
    tags: ['接雨水', '双指针', '单调栈', '面试高频']
  },
  {
    id: 731,
    title: '实现二叉树的最近公共祖先',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现二叉树的最近公共祖先（LCA）

**答案：**
给定二叉树的两个节点 p 和 q，找到它们的最近公共祖先。

\`\`\`javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root
  const left = lowestCommonAncestor(root.left, p, q)
  const right = lowestCommonAncestor(root.right, p, q)
  if (left && right) return root // p 和 q 分别在左右子树
  return left || right // 都在同一侧
}
// 时间复杂度：O(n)，空间复杂度：O(n)
\`\`\`

**追问：** 如果是二叉搜索树呢？

**答案：**
\`\`\`javascript
function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left
    else if (p.val > root.val && q.val > root.val) root = root.right
    else return root
  }
}
\`\`\`
BST 的性质让我们可以根据值的大小直接判断方向，时间复杂度 O(H)。`,
    tags: ['最近公共祖先', 'LCA', '二叉树', '递归']
  },
  {
    id: 732,
    title: '实现并发请求控制器',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现并发请求控制器

**答案：**
限制同时进行的异步请求数量，这是前端面试超高频题。

\`\`\`javascript
class RequestScheduler {
  constructor(maxConcurrent) {
    this.max = maxConcurrent
    this.running = 0
    this.queue = []
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this._run()
    })
  }

  _run() {
    while (this.running < this.max && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift()
      this.running++
      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--
          this._run()
        })
    }
  }
}

// 使用示例
const scheduler = new RequestScheduler(3)
const urls = Array.from({ length: 10 }, (_, i) => '/api/data/' + i)
urls.forEach(url => {
  scheduler.add(() => fetch(url)).then(res => console.log(res))
})
\`\`\`

**追问：** 这道题的实际应用场景？

**答案：**
1. 图片批量上传（限制同时上传数量，避免浏览器连接数耗尽）
2. 爬虫请求控制（避免被目标服务器限流）
3. 资源预加载（控制并行下载数量）
4. API 批量调用（后端有限流策略时）`,
    tags: ['并发控制', '异步调度', 'Promise', '面试高频']
  },
  {
    id: 733,
    title: '实现大数相加',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现大数相加

**答案：**
两个超大数字（超过 Number.MAX_SAFE_INTEGER）以字符串形式相加。

\`\`\`javascript
function addStrings(num1, num2) {
  let i = num1.length - 1
  let j = num2.length - 1
  let carry = 0
  const result = []

  while (i >= 0 || j >= 0 || carry) {
    const n1 = i >= 0 ? parseInt(num1[i--]) : 0
    const n2 = j >= 0 ? parseInt(num2[j--]) : 0
    const sum = n1 + n2 + carry
    carry = Math.floor(sum / 10)
    result.push(sum % 10)
  }

  return result.reverse().join('')
}
// 时间复杂度：O(max(m, n))，空间复杂度：O(max(m, n))
\`\`\`

**追问：** 如何实现大数相乘？

**答案：**
\`\`\`javascript
function multiply(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0'
  const m = num1.length, n = num2.length
  const pos = new Array(m + n).fill(0)

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = parseInt(num1[i]) * parseInt(num2[j])
      const p1 = i + j, p2 = i + j + 1
      const sum = mul + pos[p2]
      pos[p2] = sum % 10
      pos[p1] += Math.floor(sum / 10)
    }
  }
  return pos.join('').replace(/^0+/, '') || '0'
}
\`\`\``,
    tags: ['大数相加', '大数相乘', '字符串', '进位处理']
  },
  {
    id: 734,
    title: '实现最长递增子序列（LIS）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现最长递增子序列

**答案：**
给定未排序数组，找到最长递增子序列的长度。

\`\`\`javascript
// 方法一：动态规划 O(n²)
function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1)
  let maxLen = 1
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    maxLen = Math.max(maxLen, dp[i])
  }
  return maxLen
}

// 方法二：贪心 + 二分查找 O(n log n)
function lengthOfLIS(nums) {
  const tails = [] // tails[i] 表示长度为 i+1 的递增子序列的最小末尾

  for (const num of nums) {
    let left = 0, right = tails.length
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (tails[mid] < num) left = mid + 1
      else right = mid
    }
    tails[left] = num
    // 如果 left === tails.length，说明 num 比所有末尾都大
  }
  return tails.length
}
\`\`\`

**追问：** 这道题的思路如何从 O(n²) 优化到 O(n log n)？

**答案：**
关键洞察：维护一个 tails 数组，贪心地让每个长度的递增子序列的末尾尽可能小。遇到新元素时，用二分查找找到它应该替换的位置。这个技巧在 Vue 3 的 diff 算法中也有使用（最长递增子序列优化移动操作）。`,
    tags: ['最长递增子序列', 'LIS', '二分查找', '贪心', 'Vue3 diff']
  },
  {
    id: 735,
    title: '实现深拷贝（处理循环引用）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现深拷贝（处理循环引用）

**答案：**
这是前端面试必考题，需要处理各种边界情况。

\`\`\`javascript
function deepClone(obj, map = new WeakMap()) {
  // 基本类型直接返回
  if (obj === null || typeof obj !== 'object') return obj

  // 处理循环引用
  if (map.has(obj)) return map.get(obj)

  // 处理特殊对象
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Map) {
    const clone = new Map()
    map.set(obj, clone)
    obj.forEach((val, key) => clone.set(deepClone(key, map), deepClone(val, map)))
    return clone
  }
  if (obj instanceof Set) {
    const clone = new Set()
    map.set(obj, clone)
    obj.forEach(val => clone.add(deepClone(val, map)))
    return clone
  }

  // 处理数组和普通对象
  const clone = Array.isArray(obj) ? [] : Object.create(Object.getPrototypeOf(obj))
  map.set(obj, clone)

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], map)
  }
  return clone
}
\`\`\`

**追问：** structuredClone 和手写深拷贝的区别？

**答案：**
\`structuredClone\` 是浏览器原生 API，支持循环引用、大部分内置类型，但不支持函数、DOM 节点、Symbol 属性。手写深拷贝更灵活，可以自定义处理逻辑。面试中两者都要了解。`,
    tags: ['深拷贝', '循环引用', 'WeakMap', 'structuredClone']
  },
  {
    id: 736,
    title: '实现 0-1 背包问题',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现 0-1 背包问题

**答案：**
给定 n 个物品（重量 w、价值 v）和容量 W 的背包，求能装的最大价值。

\`\`\`javascript
// 二维 DP
function knapsack(weights, values, capacity) {
  const n = weights.length
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w] // 不选第 i 个物品
      if (w >= weights[i - 1]) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
      }
    }
  }
  return dp[n][capacity]
}

// 空间优化（一维 DP，逆序遍历）
function knapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0)
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i])
    }
  }
  return dp[capacity]
}
\`\`\`

**追问：** 为什么一维 DP 要逆序遍历？

**答案：**
逆序遍历保证每个物品只被使用一次。如果正序遍历，\`dp[w - weights[i]]\` 可能已经包含了当前物品的价值（相当于物品被重复使用），那就变成了完全背包问题。这是 0-1 背包和完全背包的关键区别。`,
    tags: ['0-1背包', '动态规划', '空间优化', '完全背包']
  },
  {
    id: 737,
    title: '实现前缀树（Trie）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现前缀树（Trie）

**答案：**
前缀树是高效的字符串检索数据结构，常用于自动补全、拼写检查。

\`\`\`javascript
class TrieNode {
  constructor() {
    this.children = {}
    this.isEnd = false
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(word) {
    let node = this.root
    for (const ch of word) {
      if (!node.children[ch]) {
        node.children[ch] = new TrieNode()
      }
      node = node.children[ch]
    }
    node.isEnd = true
  }

  search(word) {
    const node = this._findNode(word)
    return node !== null && node.isEnd
  }

  startsWith(prefix) {
    return this._findNode(prefix) !== null
  }

  _findNode(str) {
    let node = this.root
    for (const ch of str) {
      if (!node.children[ch]) return null
      node = node.children[ch]
    }
    return node
  }
}
\`\`\`

**追问：** Trie 在前端的应用场景？

**答案：**
1. **搜索框自动补全**：输入前缀快速匹配候选词
2. **路由匹配**：Vue Router / Express 内部用类似 Trie 的结构匹配路由
3. **敏感词过滤**：构建敏感词 Trie 树进行快速检测
4. **IP 路由表查找**：网络中的最长前缀匹配`,
    tags: ['前缀树', 'Trie', '自动补全', '字符串检索']
  },
  {
    id: 738,
    title: '实现环形链表入口检测',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现环形链表入口检测

**答案：**
给定链表，如果有环，返回环的入口节点。

\`\`\`javascript
function detectCycle(head) {
  let slow = head, fast = head

  // 第一步：快慢指针相遇
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      // 第二步：一个从头开始，一个从相遇点开始，同速前进
      let p1 = head, p2 = slow
      while (p1 !== p2) {
        p1 = p1.next
        p2 = p2.next
      }
      return p1 // 环的入口
    }
  }
  return null // 无环
}
// 时间复杂度：O(n)，空间复杂度：O(1)
\`\`\`

**追问：** 为什么第二步两个指针会在环入口相遇？

**答案：**
设链表头到环入口距离为 a，环入口到相遇点距离为 b，环长为 c。
- 快指针走了 a + b + nc（n 为圈数）
- 慢指针走了 a + b
- 快指针速度是慢指针两倍：2(a + b) = a + b + nc
- 得到 a = nc - b = (n-1)c + (c - b)
- 即从头走 a 步 = 从相遇点走 (c - b) + (n-1) 圈，恰好在入口相遇。`,
    tags: ['环形链表', '快慢指针', 'Floyd算法', '数学证明']
  },
  {
    id: 739,
    title: '实现下一个排列',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现下一个排列

**答案：**
找到给定数组在字典序中的下一个更大排列（原地修改）。

\`\`\`javascript
function nextPermutation(nums) {
  const n = nums.length
  let i = n - 2

  // 1. 从右往左找第一个递减的位置
  while (i >= 0 && nums[i] >= nums[i + 1]) i--

  if (i >= 0) {
    // 2. 从右往左找第一个大于 nums[i] 的数
    let j = n - 1
    while (j > i && nums[j] <= nums[i]) j--
    // 3. 交换
    ;[nums[i], nums[j]] = [nums[j], nums[i]]
  }

  // 4. 将 i 后面的部分反转（从递减变递增）
  let left = i + 1, right = n - 1
  while (left < right) {
    ;[nums[left], nums[right]] = [nums[right], nums[left]]
    left++
    right--
  }
}
\`\`\`

**追问：** 这道题的思路是什么？

**答案：**
核心思路：要找恰好比当前大的排列。
1. 从后往前找到第一个"下降点" i（nums[i] < nums[i+1]）
2. 在 i 右边找到最小的比 nums[i] 大的数交换
3. 将 i 右边反转（使其变成最小排列）

举例：[1,3,5,4,2] → 找到 i=1(3) → 找到 j=3(4) → 交换 [1,4,5,3,2] → 反转 i+1 后 [1,4,2,3,5]`,
    tags: ['下一个排列', '字典序', '原地修改', '面试高频']
  },
  {
    id: 740,
    title: '实现事件委托与 DOM 树查找',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现事件委托与 DOM 树查找

**答案：**
这是前端面试中"算法 + DOM"结合的经典场景题。

**场景一：实现 Event Delegate**
\`\`\`javascript
function delegate(parent, selector, eventType, handler) {
  parent.addEventListener(eventType, (e) => {
    let target = e.target
    while (target !== parent) {
      if (target.matches(selector)) {
        handler.call(target, e)
        return
      }
      target = target.parentNode
    }
  })
}

// 使用：为动态列表项绑定点击事件
delegate(document.getElementById('list'), 'li', 'click', function(e) {
  console.log('点击了：', this.textContent)
})
\`\`\`

**场景二：查找两个 DOM 节点的最近公共父节点**
\`\`\`javascript
function getCommonParent(nodeA, nodeB) {
  const path = new Set()
  // 收集 nodeA 的所有祖先
  let current = nodeA
  while (current) {
    path.add(current)
    current = current.parentNode
  }
  // 从 nodeB 往上找，第一个在 path 中的就是 LCA
  current = nodeB
  while (current) {
    if (path.has(current)) return current
    current = current.parentNode
  }
  return null
}
\`\`\`

**场景三：序列化/反序列化 DOM 树**
\`\`\`javascript
function serializeDOM(node) {
  if (node.nodeType === 3) return node.textContent
  const obj = {
    tag: node.tagName.toLowerCase(),
    attrs: {},
    children: []
  }
  for (const attr of node.attributes) {
    obj.attrs[attr.name] = attr.value
  }
  for (const child of node.childNodes) {
    obj.children.push(serializeDOM(child))
  }
  return obj
}
\`\`\`

**追问：** 事件委托的优势？

**答案：**
1. **减少内存占用**：不需要为每个子元素绑定事件
2. **动态元素支持**：新增的子元素自动具有事件处理能力
3. **性能优化**：适用于列表（如虚拟滚动中的点击处理）`,
    tags: ['事件委托', 'DOM查找', '最近公共父节点', '前端场景']
  },
  {
    id: 741,
    title: '实现二叉树的序列化与反序列化',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现二叉树的序列化与反序列化

**答案：**
将二叉树转换为字符串（序列化），再从字符串恢复为二叉树（反序列化）。

\`\`\`javascript
// 前序遍历序列化
function serialize(root) {
  if (!root) return 'null'
  return root.val + ',' + serialize(root.left) + ',' + serialize(root.right)
}

// 反序列化
function deserialize(data) {
  const nodes = data.split(',')
  let index = 0

  function build() {
    if (index >= nodes.length || nodes[index] === 'null') {
      index++
      return null
    }
    const node = { val: parseInt(nodes[index++]), left: null, right: null }
    node.left = build()
    node.right = build()
    return node
  }

  return build()
}
// 时间复杂度：O(n)，空间复杂度：O(n)
\`\`\`

**追问：** 还有哪些序列化方式？

**答案：**
1. **层序遍历（BFS）**：按层输出，null 用特殊标记，LeetCode 常用此格式
2. **括号表示法**：\`1(2(4)(5))(3)\`，类似文件系统路径
3. **JSON 格式**：直接 \`JSON.stringify\`，但需要处理循环引用

层序遍历序列化更直观，但前序遍历实现更简洁。面试中两种都要会。`,
    tags: ['二叉树序列化', '前序遍历', '递归', '字符串处理']
  },
  {
    id: 742,
    title: '实现最小路径和（二维DP）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现最小路径和

**答案：**
给定 m×n 的网格，每个格子有非负整数，从左上角到右下角（只能向右或向下），求路径上数字总和最小值。

\`\`\`javascript
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length
  const dp = Array.from({ length: m }, () => new Array(n).fill(0))

  dp[0][0] = grid[0][0]
  // 初始化第一行
  for (let j = 1; j < n; j++) dp[0][j] = dp[0][j - 1] + grid[0][j]
  // 初始化第一列
  for (let i = 1; i < m; i++) dp[i][0] = dp[i - 1][0] + grid[i][0]
  // 填充 DP 表
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j]
    }
  }
  return dp[m - 1][n - 1]
}
// 时间复杂度：O(mn)，空间复杂度：O(mn)
\`\`\`

**空间优化（滚动数组）：**
\`\`\`javascript
function minPathSum(grid) {
  const m = grid.length, n = grid[0].length
  const dp = new Array(n).fill(0)
  dp[0] = grid[0][0]
  for (let j = 1; j < n; j++) dp[j] = dp[j - 1] + grid[0][j]

  for (let i = 1; i < m; i++) {
    dp[0] += grid[i][0]
    for (let j = 1; j < n; j++) {
      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j]
    }
  }
  return dp[n - 1]
}
// 空间优化到 O(n)
\`\`\`

**追问：** 如果可以向四个方向移动呢？

**答案：**
不能用简单 DP（因为有环），需要用 **Dijkstra 算法**（带权最短路径）或 BFS（如果权重相同）。这是 DP 和图算法的重要区别：DP 要求无后效性（状态转移方向确定）。`,
    tags: ['最小路径和', '二维DP', '滚动数组', '空间优化']
  },
  {
    id: 743,
    title: '实现合并K个有序链表',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现合并K个有序链表

**答案：**
将 K 个有序链表合并为一个有序链表。

\`\`\`javascript
// 方法一：分治合并（最优解）
function mergeKLists(lists) {
  if (!lists.length) return null
  return mergeDivide(lists, 0, lists.length - 1)
}

function mergeDivide(lists, left, right) {
  if (left === right) return lists[left]
  const mid = Math.floor((left + right) / 2)
  const l1 = mergeDivide(lists, left, mid)
  const l2 = mergeDivide(lists, mid + 1, right)
  return mergeTwoLists(l1, l2)
}

function mergeTwoLists(l1, l2) {
  const dummy = { next: null }
  let curr = dummy
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      curr.next = l1
      l1 = l1.next
    } else {
      curr.next = l2
      l2 = l2.next
    }
    curr = curr.next
  }
  curr.next = l1 || l2
  return dummy.next
}
// 时间复杂度：O(N log K)，N 为所有节点总数，K 为链表数
// 空间复杂度：O(log K)（递归栈）
\`\`\`

**方法二：逐一合并**
\`\`\`javascript
function mergeKLists(lists) {
  let result = null
  for (const list of lists) {
    result = mergeTwoLists(result, list)
  }
  return result
}
// 时间复杂度：O(NK)，较慢
\`\`\`

**追问：** 为什么分治比逐一合并快？

**答案：**
逐一合并：第 i 次合并处理的节点数递增，总共 O(NK)。分治合并：每层合并的总节点数为 N，共 log K 层，总共 O(N log K)。类似归并排序的思想，通过减少重复比较来优化。`,
    tags: ['合并K个链表', '分治', '链表', '归并思想']
  },
  {
    id: 744,
    title: '实现螺旋矩阵遍历',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现螺旋矩阵遍历

**答案：**
给定 m×n 矩阵，按螺旋顺序（顺时针从外到内）返回所有元素。

\`\`\`javascript
function spiralOrder(matrix) {
  if (!matrix.length) return []
  const result = []
  let top = 0, bottom = matrix.length - 1
  let left = 0, right = matrix[0].length - 1

  while (top <= bottom && left <= right) {
    // 向右
    for (let j = left; j <= right; j++) result.push(matrix[top][j])
    top++
    // 向下
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right])
    right--
    // 向左
    if (top <= bottom) {
      for (let j = right; j >= left; j--) result.push(matrix[bottom][j])
      bottom--
    }
    // 向上
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left])
      left++
    }
  }
  return result
}
// 时间复杂度：O(mn)，空间复杂度：O(1)（不算结果数组）
\`\`\`

**追问：** 如何生成 n×n 的螺旋矩阵？

**答案：**
\`\`\`javascript
function generateMatrix(n) {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0))
  let num = 1, top = 0, bottom = n - 1, left = 0, right = n - 1
  while (num <= n * n) {
    for (let j = left; j <= right; j++) matrix[top][j] = num++
    top++
    for (let i = top; i <= bottom; i++) matrix[i][right] = num++
    right--
    for (let j = right; j >= left; j--) matrix[bottom][j] = num++
    bottom--
    for (let i = bottom; i >= top; i--) matrix[i][left] = num++
    left++
  }
  return matrix
}
\`\`\`
思路完全一致，只是从"读"变成了"写"。`,
    tags: ['螺旋矩阵', '模拟', '边界控制', '矩阵遍历']
  },
  {
    id: 745,
    title: '实现单词搜索（回溯 + 矩阵）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现单词搜索

**答案：**
给定二维字符网格和一个单词，判断单词是否存在于网格中（相邻格子可上下左右连接，每个格子只能用一次）。

\`\`\`javascript
function exist(board, word) {
  const rows = board.length, cols = board[0].length
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]

  function backtrack(r, c, index) {
    if (index === word.length) return true
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false
    if (board[r][c] !== word[index]) return false

    const temp = board[r][c]
    board[r][c] = '#' // 标记已访问

    for (const [dr, dc] of dirs) {
      if (backtrack(r + dr, c + dc, index + 1)) return true
    }

    board[r][c] = temp // 回溯恢复
    return false
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (backtrack(r, c, 0)) return true
    }
  }
  return false
}
// 时间复杂度：O(m × n × 3^L)，L 为单词长度
// 空间复杂度：O(L)（递归栈深度）
\`\`\`

**追问：** 为什么是 3^L 而不是 4^L？

**答案：**
虽然每个格子有4个方向，但不能回到上一步来的方向（已标记为 '#'），所以每步最多3个选择。实际上由于边界和已访问限制，分支因子通常更小。

**追问：** 如何优化？

**答案：**
1. **剪枝**：先统计网格中各字符频次，如果某字符不够则直接返回 false
2. **反向搜索**：如果单词末尾字符在网格中更少，可以反向搜索
3. **位运算标记**：用位掩码代替修改原数组来标记已访问`,
    tags: ['单词搜索', '回溯', '矩阵DFS', '剪枝优化']
  },
  {
    id: 746,
    title: '实现最长回文子串',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现最长回文子串

**答案：**
给定字符串 s，找到 s 中最长的回文子串。

\`\`\`javascript
// 方法一：中心扩展法（推荐）
function longestPalindrome(s) {
  let start = 0, maxLen = 1

  function expandFromCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLen) {
        start = left
        maxLen = right - left + 1
      }
      left--
      right++
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandFromCenter(i, i)     // 奇数长度回文
    expandFromCenter(i, i + 1) // 偶数长度回文
  }

  return s.substring(start, start + maxLen)
}
// 时间复杂度：O(n²)，空间复杂度：O(1)
\`\`\`

**方法二：动态规划**
\`\`\`javascript
function longestPalindrome(s) {
  const n = s.length
  const dp = Array.from({ length: n }, () => new Array(n).fill(false))
  let start = 0, maxLen = 1

  // 所有单字符都是回文
  for (let i = 0; i < n; i++) dp[i][i] = true

  // 从短到长检查
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      if (s[i] === s[j] && (len <= 3 || dp[i + 1][j - 1])) {
        dp[i][j] = true
        if (len > maxLen) { start = i; maxLen = len }
      }
    }
  }
  return s.substring(start, start + maxLen)
}
// 时间复杂度：O(n²)，空间复杂度：O(n²)
\`\`\`

**追问：** 有 O(n) 的算法吗？

**答案：**
**Manacher 算法**可以在 O(n) 时间内找到最长回文子串，但实现复杂，面试中一般不要求。了解中心扩展法和 DP 解法即可。`,
    tags: ['最长回文子串', '中心扩展', '动态规划', 'Manacher']
  },
  {
    id: 747,
    title: '实现柯里化函数',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现柯里化函数

**答案：**
柯里化是将多参数函数转换为一系列单参数函数的技术，是前端面试高频手写题。

\`\`\`javascript
// 通用柯里化
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function(...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs])
    }
  }
}

// 使用示例
function add(a, b, c) { return a + b + c }
const curriedAdd = curry(add)
curriedAdd(1)(2)(3)    // 6
curriedAdd(1, 2)(3)    // 6
curriedAdd(1)(2, 3)    // 6
\`\`\`

**进阶：实现无限参数柯里化**
\`\`\`javascript
function add(...args) {
  const sum = args.reduce((a, b) => a + b, 0)
  function inner(...moreArgs) {
    return add(sum + moreArgs.reduce((a, b) => a + b, 0))
  }
  inner.valueOf = () => sum
  inner.toString = () => String(sum)
  return inner
}

// 使用
add(1)(2)(3).valueOf()       // 6
add(1, 2)(3, 4)(5).valueOf() // 15
\`\`\`

**追问：** 柯里化的实际应用场景？

**答案：**
1. **参数复用**：\`const log = curry(console.log)('DEBUG:')\`，创建带前缀的日志函数
2. **延迟执行**：收集参数，满足条件后执行
3. **函数组合**：\`compose(f, g, h)\` 中的函数通常是单参数的
4. **React 高阶组件**：\`connect(mapState)(Component)\` 就是柯里化模式`,
    tags: ['柯里化', '函数式编程', '手写实现', '闭包']
  },
  {
    id: 748,
    title: '实现最短路径算法（Dijkstra）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现最短路径算法（Dijkstra）

**答案：**
Dijkstra 算法用于求带权有向图中单源最短路径（权重非负）。

\`\`\`javascript
function dijkstra(graph, start) {
  const n = graph.length
  const dist = new Array(n).fill(Infinity)
  const visited = new Array(n).fill(false)
  dist[start] = 0

  // 简易优先队列（面试中可用数组模拟）
  const pq = [[0, start]] // [距离, 节点]

  while (pq.length) {
    // 取出距离最小的节点
    pq.sort((a, b) => a[0] - b[0])
    const [d, u] = pq.shift()

    if (visited[u]) continue
    visited[u] = true

    // 松弛相邻边
    for (const [v, weight] of graph[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight
        pq.push([dist[v], v])
      }
    }
  }
  return dist
}

// 使用示例
// graph[u] = [[v1, w1], [v2, w2], ...] 表示 u 到 v 的边权为 w
const graph = [
  [[1, 4], [2, 1]],  // 节点0 → 节点1(权4), 节点2(权1)
  [[3, 1]],           // 节点1 → 节点3(权1)
  [[1, 2], [3, 5]],   // 节点2 → 节点1(权2), 节点3(权5)
  []                   // 节点3 无出边
]
dijkstra(graph, 0) // [0, 3, 1, 4]
\`\`\`

**追问：** Dijkstra 和 BFS 的区别？

**答案：**
| | BFS | Dijkstra |
|--|-----|----------|
| 适用场景 | 无权图/等权图 | 带权图（非负权） |
| 数据结构 | 队列 | 优先队列（最小堆） |
| 时间复杂度 | O(V + E) | O((V + E) log V) |
| 负权边 | 不适用 | 不适用（需用 Bellman-Ford） |

前端应用：路由跳转最短路径、地图导航、网络延迟计算等。`,
    tags: ['Dijkstra', '最短路径', '优先队列', '图算法']
  },
  {
    id: 749,
    title: '实现数组中第K大的元素',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现数组中第K大的元素

**答案：**
在未排序数组中找到第 K 大的元素，要求平均时间复杂度 O(n)。

\`\`\`javascript
// 方法一：快速选择算法（QuickSelect）
function findKthLargest(nums, k) {
  const target = nums.length - k // 转换为第 target 小

  function quickSelect(left, right) {
    const pivotIndex = partition(left, right)
    if (pivotIndex === target) return nums[pivotIndex]
    if (pivotIndex < target) return quickSelect(pivotIndex + 1, right)
    return quickSelect(left, pivotIndex - 1)
  }

  function partition(left, right) {
    // 随机选择 pivot 避免最坏情况
    const randomIdx = left + Math.floor(Math.random() * (right - left + 1))
    ;[nums[randomIdx], nums[right]] = [nums[right], nums[randomIdx]]

    const pivot = nums[right]
    let i = left - 1
    for (let j = left; j < right; j++) {
      if (nums[j] <= pivot) {
        i++
        ;[nums[i], nums[j]] = [nums[j], nums[i]]
      }
    }
    ;[nums[i + 1], nums[right]] = [nums[right], nums[i + 1]]
    return i + 1
  }

  return quickSelect(0, nums.length - 1)
}
// 平均时间复杂度：O(n)，最坏：O(n²)
// 空间复杂度：O(log n)（递归栈）
\`\`\`

**方法二：小顶堆（适合数据流场景）**
\`\`\`javascript
// 维护大小为 K 的小顶堆
function findKthLargest(nums, k) {
  const heap = nums.slice(0, k)
  buildMinHeap(heap)
  for (let i = k; i < nums.length; i++) {
    if (nums[i] > heap[0]) {
      heap[0] = nums[i]
      sinkDown(heap, 0)
    }
  }
  return heap[0]
}
// 时间复杂度：O(n log K)
\`\`\`

**追问：** 两种方法如何选择？

**答案：**
- **快速选择**：一次性数据，平均 O(n)，但会修改原数组
- **小顶堆**：数据流场景（数据不断到来），O(n log K)，不修改原数据
- 面试中优先写快速选择，展示对分治思想的理解`,
    tags: ['第K大元素', '快速选择', '堆', '分治']
  },
  {
    id: 750,
    title: '实现括号生成（回溯经典）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 实现括号生成

**答案：**
给定 n 对括号，生成所有合法的括号组合。

\`\`\`javascript
function generateParenthesis(n) {
  const result = []

  function backtrack(current, open, close) {
    if (current.length === 2 * n) {
      result.push(current)
      return
    }
    // 可以放左括号的条件：左括号数量 < n
    if (open < n) {
      backtrack(current + '(', open + 1, close)
    }
    // 可以放右括号的条件：右括号数量 < 左括号数量
    if (close < open) {
      backtrack(current + ')', open, close + 1)
    }
  }

  backtrack('', 0, 0)
  return result
}

// n = 3 时输出：
// ["((()))","(()())","(())()","()(())","()()()"]
\`\`\`

**追问：** 这道题的时间复杂度是多少？

**答案：**
结果数量是第 n 个卡特兰数 C(n) = C(2n, n) / (n+1)，约为 4^n / (n√n)。每个结果长度为 2n，所以总时间复杂度为 O(4^n / √n)。

**追问：** 卡特兰数还有哪些应用？

**答案：**
1. **合法括号组合数**：n 对括号的合法组合
2. **二叉搜索树数量**：n 个节点能构成的不同 BST 数量
3. **出栈序列数**：n 个元素的合法出栈序列数
4. **三角剖分数**：凸多边形的三角剖分方案数
5. **路径计数**：从 (0,0) 到 (n,n) 不越过对角线的路径数

\`\`\`javascript
// 计算第 n 个卡特兰数
function catalan(n) {
  const dp = new Array(n + 1).fill(0)
  dp[0] = dp[1] = 1
  for (let i = 2; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      dp[i] += dp[j] * dp[i - 1 - j]
    }
  }
  return dp[n]
}
\`\`\``,
    tags: ['括号生成', '回溯', '卡特兰数', '递归']
  },
  {
    id: 751,
    title: '合并区间（排序 + 贪心）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 合并区间（排序 + 贪心）

**题目描述：**
给定一个区间集合 \`intervals\`，其中 \`intervals[i] = [start_i, end_i]\`，合并所有重叠的区间，返回一个不重叠的区间数组。

**示例：**
- 输入：\`[[1,3],[2,6],[8,10],[15,18]]\`
- 输出：\`[[1,6],[8,10],[15,18]]\`

### 解题思路

1. **排序**：按区间起点升序排列
2. **遍历合并**：如果当前区间的起点 ≤ 上一个合并区间的终点，则合并（取终点最大值）；否则新增一个区间

### 代码实现

\`\`\`javascript
function merge(intervals) {
  if (intervals.length <= 1) return intervals
  // 按起点排序
  intervals.sort((a, b) => a[0] - b[0])
  const result = [intervals[0]]
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1]
    if (intervals[i][0] <= last[1]) {
      // 有重叠，合并
      last[1] = Math.max(last[1], intervals[i][1])
    } else {
      result.push(intervals[i])
    }
  }
  return result
}
\`\`\`

**时间复杂度：** O(n log n)，排序主导
**空间复杂度：** O(n)，存储结果

**追问：** 如果要求插入一个新区间到已排序的无重叠区间列表中并合并，怎么做？

**答案：**
遍历原区间列表，分三段处理：在新区间左侧的直接加入结果、与新区间重叠的合并、在新区间右侧的直接加入结果。时间复杂度 O(n)。`,
    tags: ['合并区间', '排序', '贪心', 'LeetCode 56']
  },
  {
    id: 752,
    title: '在排序数组中查找元素的第一个和最后一个位置（二分搜索）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 在排序数组中查找元素的第一个和最后一个位置

**题目描述：**
给定一个升序排列的整数数组 \`nums\` 和一个目标值 \`target\`，找出目标值在数组中的开始位置和结束位置。如果不存在返回 \`[-1, -1]\`。要求时间复杂度 O(log n)。

**示例：**
- 输入：\`nums = [5,7,7,8,8,10]\`, \`target = 8\`
- 输出：\`[3, 4]\`

### 解题思路

使用两次二分搜索，分别找到目标值的**左边界**和**右边界**。

### 代码实现

\`\`\`javascript
function searchRange(nums, target) {
  return [findFirst(nums, target), findLast(nums, target)]
}

function findFirst(nums, target) {
  let left = 0, right = nums.length - 1, result = -1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) {
      result = mid
      right = mid - 1 // 继续向左搜索
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return result
}

function findLast(nums, target) {
  let left = 0, right = nums.length - 1, result = -1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) {
      result = mid
      left = mid + 1 // 继续向右搜索
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return result
}
\`\`\`

**时间复杂度：** O(log n)
**空间复杂度：** O(1)

**追问：** 如何用一次二分搜索找到插入位置（搜索插入位置）？

**答案：**
当 \`left > right\` 时，\`left\` 就是插入位置。这就是 \`Array.prototype.findIndex\` 的二分版本，也是 LeetCode 35 题。`,
    tags: ['二分搜索', '左右边界', 'LeetCode 34']
  },
  {
    id: 753,
    title: '最长递增子序列（动态规划 + 二分优化）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 最长递增子序列（LIS）

**题目描述：**
给定一个整数数组 \`nums\`，找到其中最长严格递增子序列的长度。

**示例：**
- 输入：\`[10,9,2,5,3,7,101,18]\`
- 输出：\`4\`（子序列为 \`[2,3,7,101]\`）

### 方法一：动态规划 O(n²)

\`\`\`javascript
function lengthOfLIS_dp(nums) {
  const n = nums.length
  const dp = new Array(n).fill(1)
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
  }
  return Math.max(...dp)
}
\`\`\`

### 方法二：贪心 + 二分 O(n log n)

维护一个 \`tails\` 数组，\`tails[i]\` 表示长度为 \`i+1\` 的递增子序列的最小末尾元素。

\`\`\`javascript
function lengthOfLIS(nums) {
  const tails = []
  for (const num of nums) {
    let left = 0, right = tails.length
    while (left < right) {
      const mid = Math.floor((left + right) / 2)
      if (tails[mid] < num) left = mid + 1
      else right = mid
    }
    tails[left] = num
    // 如果 left === tails.length，说明 num 比所有元素都大，扩展长度
  }
  return tails.length
}
\`\`\`

**时间复杂度：** O(n log n)
**空间复杂度：** O(n)

**追问：** Vue 3 的 Diff 算法中用到了 LIS，为什么？

**答案：**
Vue 3 在处理带 key 的子节点更新时，通过 LIS 找到最长递增子序列，这些节点不需要移动，只需要移动不在 LIS 中的节点，从而最小化 DOM 操作次数。`,
    tags: ['最长递增子序列', '动态规划', '二分搜索', 'LeetCode 300', 'Vue Diff']
  },
  {
    id: 754,
    title: '搜索旋转排序数组（二分搜索变体）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 搜索旋转排序数组

**题目描述：**
整数数组 \`nums\` 按升序排列后在某个下标处旋转（如 \`[0,1,2,4,5,6,7]\` 变为 \`[4,5,6,7,0,1,2]\`）。给定旋转后的数组和目标值 \`target\`，如果存在返回下标，否则返回 \`-1\`。要求 O(log n)。

**示例：**
- 输入：\`nums = [4,5,6,7,0,1,2]\`, \`target = 0\`
- 输出：\`4\`

### 解题思路

二分搜索时，至少有一半是有序的。判断 target 是否在有序的那一半中，据此缩小搜索范围。

### 代码实现

\`\`\`javascript
function search(nums, target) {
  let left = 0, right = nums.length - 1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid

    // 左半部分有序
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    }
    // 右半部分有序
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
  }
  return -1
}
\`\`\`

**时间复杂度：** O(log n)
**空间复杂度：** O(1)

**追问：** 如果数组中有重复元素怎么办？

**答案：**
当 \`nums[left] === nums[mid]\` 时，无法判断哪边有序，此时 \`left++\` 跳过重复元素。最坏时间复杂度退化为 O(n)，但平均仍为 O(log n)。`,
    tags: ['二分搜索', '旋转数组', 'LeetCode 33']
  },
  {
    id: 755,
    title: '零钱兑换（动态规划 - 完全背包）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 零钱兑换

**题目描述：**
给定不同面额的硬币 \`coins\` 和一个总金额 \`amount\`，计算凑成总金额所需的最少硬币个数。如果无法凑成返回 \`-1\`。每种硬币可以无限使用。

**示例：**
- 输入：\`coins = [1,2,5]\`, \`amount = 11\`
- 输出：\`3\`（5 + 5 + 1）

### 解题思路

经典的**完全背包**问题。定义 \`dp[i]\` 为凑成金额 \`i\` 所需的最少硬币数。

### 代码实现

\`\`\`javascript
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount]
}
\`\`\`

**时间复杂度：** O(amount × n)，n 为硬币种类数
**空间复杂度：** O(amount)

**追问：** 如果要求返回硬币组合方案数（而非最少个数），怎么做？

**答案：**
这就是 LeetCode 518「零钱兑换 II」。将 \`dp[i]\` 定义为凑成金额 \`i\` 的组合数，初始 \`dp[0] = 1\`，外层遍历硬币、内层遍历金额（避免重复计算排列）：
\`\`\`javascript
for (const coin of coins) {
  for (let i = coin; i <= amount; i++) {
    dp[i] += dp[i - coin]
  }
}
\`\`\``,
    tags: ['零钱兑换', '动态规划', '完全背包', 'LeetCode 322']
  },
  {
    id: 756,
    title: '颜色分类（荷兰国旗问题 - 三路快排）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 颜色分类（荷兰国旗问题）

**题目描述：**
给定一个包含红色（0）、白色（1）和蓝色（2）的数组 \`nums\`，原地排序使得相同颜色相邻，顺序为红、白、蓝。要求一趟扫描完成，且只使用常数空间。

**示例：**
- 输入：\`[2,0,2,1,1,0]\`
- 输出：\`[0,0,1,1,2,2]\`

### 解题思路

使用三指针（荷兰国旗算法）：
- \`low\`：指向下一个 0 应该放的位置
- \`high\`：指向下一个 2 应该放的位置
- \`mid\`：当前遍历指针

### 代码实现

\`\`\`javascript
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1

  while (mid <= high) {
    if (nums[mid] === 0) {
      // 交换到前面
      [nums[low], nums[mid]] = [nums[mid], nums[low]]
      low++
      mid++
    } else if (nums[mid] === 2) {
      // 交换到后面
      [nums[mid], nums[high]] = [nums[high], nums[mid]]
      high--
      // 注意：mid 不动，因为交换过来的元素还没检查
    } else {
      mid++
    }
  }
}
\`\`\`

**时间复杂度：** O(n)，一趟扫描
**空间复杂度：** O(1)

**追问：** 这个思想在快速排序中如何应用？

**答案：**
三路快排（3-way QuickSort）将数组分为三部分：小于 pivot、等于 pivot、大于 pivot。对于有大量重复元素的数组，三路快排比标准快排效率更高，避免了对等于 pivot 的元素的重复处理。`,
    tags: ['荷兰国旗', '三路快排', '双指针', 'LeetCode 75']
  },
  {
    id: 757,
    title: '不同路径（动态规划 - 网格路径）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 不同路径

**题目描述：**
一个机器人位于 m × n 网格的左上角，每次只能向下或向右移动一步。问到达右下角共有多少条不同路径？

**示例：**
- 输入：\`m = 3, n = 7\`
- 输出：\`28\`

### 解题思路

\`dp[i][j]\` 表示到达位置 \`(i, j)\` 的路径数。转移方程：\`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`。

### 代码实现

\`\`\`javascript
// 方法一：二维 DP
function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(1))
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1]
    }
  }
  return dp[m - 1][n - 1]
}

// 方法二：空间优化为一维
function uniquePathsOptimized(m, n) {
  const dp = new Array(n).fill(1)
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[j] += dp[j - 1]
    }
  }
  return dp[n - 1]
}

// 方法三：数学组合公式 C(m+n-2, m-1)
function uniquePathsMath(m, n) {
  let result = 1
  for (let i = 1; i < m; i++) {
    result = result * (n - 1 + i) / i
  }
  return Math.round(result)
}
\`\`\`

**时间复杂度：** DP 方法 O(m×n)，数学方法 O(min(m,n))
**空间复杂度：** 优化后 O(n)

**追问：** 如果网格中有障碍物怎么办？

**答案：**
LeetCode 63「不同路径 II」。障碍物位置 \`dp[i][j] = 0\`，其余位置正常转移。注意第一行和第一列如果遇到障碍物，后面的格子都不可达。`,
    tags: ['不同路径', '动态规划', '网格', 'LeetCode 62']
  },
  {
    id: 758,
    title: '前 K 个高频元素（排序 / 堆 / 桶排序）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 前 K 个高频元素

**题目描述：**
给定一个整数数组 \`nums\` 和一个整数 \`k\`，返回出现频率前 \`k\` 高的元素。答案可以按任意顺序返回。

**示例：**
- 输入：\`nums = [1,1,1,2,2,3]\`, \`k = 2\`
- 输出：\`[1, 2]\`

### 方法一：哈希表 + 排序

\`\`\`javascript
function topKFrequent_sort(nums, k) {
  const map = new Map()
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1)
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(e => e[0])
}
\`\`\`

### 方法二：桶排序 O(n)

\`\`\`javascript
function topKFrequent(nums, k) {
  const map = new Map()
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1)
  }

  // 桶排序：下标为频率，值为对应元素列表
  const buckets = new Array(nums.length + 1).fill(null).map(() => [])
  for (const [num, freq] of map) {
    buckets[freq].push(num)
  }

  const result = []
  // 从高频到低频遍历
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i])
  }
  return result.slice(0, k)
}
\`\`\`

**时间复杂度：** 桶排序 O(n)，排序方法 O(n log n)
**空间复杂度：** O(n)

**追问：** 如果数据是流式的（不断有新元素加入），如何维护 Top K？

**答案：**
使用**最小堆**（大小为 K）。每来一个元素更新频率，如果频率大于堆顶则替换。这样堆中始终维护频率最高的 K 个元素，每次操作 O(log K)。`,
    tags: ['Top K', '桶排序', '哈希表', '堆', 'LeetCode 347']
  },
  {
    id: 759,
    title: '岛屿数量（BFS / DFS 搜索）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 岛屿数量

**题目描述：**
给定一个由 \`'1'\`（陆地）和 \`'0'\`（水）组成的二维网格，计算岛屿的数量。岛屿被水包围，通过水平或垂直方向相邻的陆地连接形成。

**示例：**
\`\`\`
输入：
[["1","1","0","0","0"],
 ["1","1","0","0","0"],
 ["0","0","1","0","0"],
 ["0","0","0","1","1"]]
输出：3
\`\`\`

### 方法一：DFS

\`\`\`javascript
function numIslands(grid) {
  if (!grid.length) return 0
  const m = grid.length, n = grid[0].length
  let count = 0

  function dfs(i, j) {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === '0') return
    grid[i][j] = '0' // 标记已访问
    dfs(i + 1, j)
    dfs(i - 1, j)
    dfs(i, j + 1)
    dfs(i, j - 1)
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++
        dfs(i, j)
      }
    }
  }
  return count
}
\`\`\`

### 方法二：BFS

\`\`\`javascript
function numIslands_bfs(grid) {
  const m = grid.length, n = grid[0].length
  let count = 0
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++
        const queue = [[i, j]]
        grid[i][j] = '0'
        while (queue.length) {
          const [x, y] = queue.shift()
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy
            if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === '1') {
              grid[nx][ny] = '0'
              queue.push([nx, ny])
            }
          }
        }
      }
    }
  }
  return count
}
\`\`\`

**时间复杂度：** O(m × n)
**空间复杂度：** DFS 最坏 O(m × n)（递归栈），BFS O(min(m, n))

**追问：** 如何计算最大岛屿面积？

**答案：**
LeetCode 695。在 DFS/BFS 过程中累计每个岛屿的格子数，取最大值即可。`,
    tags: ['岛屿数量', 'DFS', 'BFS', '网格搜索', 'LeetCode 200']
  },
  {
    id: 760,
    title: '最长回文子串（动态规划 / 中心扩展）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 最长回文子串

**题目描述：**
给定一个字符串 \`s\`，找到 \`s\` 中最长的回文子串。

**示例：**
- 输入：\`"babad"\`
- 输出：\`"bab"\` 或 \`"aba"\`

### 方法一：中心扩展法 O(n²)

从每个字符（和每两个相邻字符之间）向两边扩展，找到最长回文。

\`\`\`javascript
function longestPalindrome(s) {
  let start = 0, maxLen = 1

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLen) {
        start = left
        maxLen = right - left + 1
      }
      left--
      right++
    }
  }

  for (let i = 0; i < s.length; i++) {
    expand(i, i)     // 奇数长度回文
    expand(i, i + 1) // 偶数长度回文
  }

  return s.substring(start, start + maxLen)
}
\`\`\`

### 方法二：动态规划 O(n²)

\`dp[i][j]\` 表示 \`s[i..j]\` 是否为回文。

\`\`\`javascript
function longestPalindrome_dp(s) {
  const n = s.length
  const dp = Array.from({ length: n }, () => new Array(n).fill(false))
  let start = 0, maxLen = 1

  // 单个字符都是回文
  for (let i = 0; i < n; i++) dp[i][i] = true

  // 从短到长枚举子串
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1
      if (s[i] === s[j]) {
        if (len === 2 || dp[i + 1][j - 1]) {
          dp[i][j] = true
          if (len > maxLen) {
            start = i
            maxLen = len
          }
        }
      }
    }
  }

  return s.substring(start, start + maxLen)
}
\`\`\`

**时间复杂度：** O(n²)
**空间复杂度：** 中心扩展 O(1)，DP O(n²)

**追问：** 有没有 O(n) 的算法？

**答案：**
**Manacher 算法**可以在 O(n) 时间内找到最长回文子串。核心思想是利用已知回文的对称性，避免重复比较。它维护一个"最右回文边界"和对应的中心，利用对称性快速确定新位置的回文半径。`,
    tags: ['最长回文子串', '中心扩展', '动态规划', 'Manacher', 'LeetCode 5']
  },
]