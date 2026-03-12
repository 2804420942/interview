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
]
