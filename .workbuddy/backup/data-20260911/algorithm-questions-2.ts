import type { Question } from './types'

/** 算法实现补充题目（第2批，30道） */
export const algorithmQuestions2: Question[] = [
  {
    id: 761,
    title: '移动零（双指针原地操作）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 移动零

**题目描述：**
给定一个数组 \`nums\`，将所有 \`0\` 移动到数组末尾，同时保持非零元素的相对顺序。要求原地操作，不能拷贝额外数组。

**示例：**
- 输入：\`[0, 1, 0, 3, 12]\`
- 输出：\`[1, 3, 12, 0, 0]\`

**约束条件：**
- \`1 <= nums.length <= 10^4\`
- \`-2^31 <= nums[i] <= 2^31 - 1\`

### 解题思路

使用双指针：\`slow\` 指向下一个非零元素应该放的位置，\`fast\` 遍历数组。遇到非零元素就交换到 \`slow\` 位置。

### 代码实现

\`\`\`javascript
function moveZeroes(nums) {
  let slow = 0
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]]
      slow++
    }
  }
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(1)

**追问：** 如果要求最小化写操作次数怎么做？

**答案：**
先用一个指针把所有非零元素依次写到前面，然后把剩余位置全部填 0。这样写操作次数等于非零元素个数 + 零的个数，而交换法可能有多余的自身交换。
\`\`\`javascript
function moveZeroes(nums) {
  let pos = 0
  for (const num of nums) {
    if (num !== 0) nums[pos++] = num
  }
  while (pos < nums.length) nums[pos++] = 0
}
\`\`\``,
    tags: ['移动零', '双指针', '原地操作', 'LeetCode 283']
  },
  {
    id: 762,
    title: '反转字符串中的单词（字符串处理）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 反转字符串中的单词

**题目描述：**
给定一个字符串 \`s\`，反转字符串中每个单词的顺序。单词由空格分隔，输入字符串可能包含前导/尾随空格和多个连续空格，输出中单词之间只保留一个空格。

**示例：**
- 输入：\`"  hello world  "\`
- 输出：\`"world hello"\`
- 输入：\`"a good   example"\`
- 输出：\`"example good a"\`

**约束条件：**
- \`1 <= s.length <= 10^4\`
- \`s\` 包含英文字母、数字和空格

### 解题思路

利用字符串分割、过滤空串、反转、拼接。

### 代码实现

\`\`\`javascript
// 方法一：API 组合（简洁）
function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(' ')
}

// 方法二：手动实现（面试加分）
function reverseWords(s) {
  const words = []
  let i = 0
  while (i < s.length) {
    while (i < s.length && s[i] === ' ') i++
    if (i >= s.length) break
    let j = i
    while (j < s.length && s[j] !== ' ') j++
    words.push(s.substring(i, j))
    i = j
  }
  // 双指针反转数组
  let left = 0, right = words.length - 1
  while (left < right) {
    [words[left], words[right]] = [words[right], words[left]]
    left++
    right--
  }
  return words.join(' ')
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(n)

**追问：** 如果要求原地反转（C/C++ 场景），怎么做？

**答案：**
经典的"三步翻转法"：先整体反转字符串，再逐个反转每个单词，最后处理多余空格。这是字符串原地操作的经典技巧。`,
    tags: ['反转单词', '字符串', '正则表达式', 'LeetCode 151']
  },
  {
    id: 763,
    title: '只出现一次的数字（位运算）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 只出现一次的数字

**题目描述：**
给定一个非空整数数组 \`nums\`，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现一次的元素。要求线性时间复杂度且不使用额外空间。

**示例：**
- 输入：\`[4, 1, 2, 1, 2]\`
- 输出：\`4\`

**约束条件：**
- \`1 <= nums.length <= 3 * 10^4\`
- 每个元素出现一次或两次

### 解题思路

利用异或运算的性质：\`a ^ a = 0\`，\`a ^ 0 = a\`，异或满足交换律和结合律。所有数异或后，成对的数抵消为 0，剩下的就是只出现一次的数。

### 代码实现

\`\`\`javascript
function singleNumber(nums) {
  let result = 0
  for (const num of nums) {
    result ^= num
  }
  return result
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(1)

**追问：** 如果有两个数只出现一次，其余都出现两次，怎么找？

**答案：**
LeetCode 260。先全部异或得到 \`xor = a ^ b\`，取 \`xor\` 的任意一个为 1 的位（如最低位 \`xor & (-xor)\`），按该位是否为 1 将数组分成两组，每组各包含一个只出现一次的数，分别异或即可。

**追问：** 如果每个元素出现三次，只有一个出现一次呢？

**答案：**
LeetCode 137。用位运算模拟三进制计数器，或者统计每一位上 1 的个数对 3 取模。
\`\`\`javascript
function singleNumber(nums) {
  let ones = 0, twos = 0
  for (const num of nums) {
    ones = (ones ^ num) & ~twos
    twos = (twos ^ num) & ~ones
  }
  return ones
}
\`\`\``,
    tags: ['位运算', '异或', 'LeetCode 136', '空间O(1)']
  },
  {
    id: 764,
    title: '相交链表（双指针找交点）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 相交链表

**题目描述：**
给定两个单链表的头节点 \`headA\` 和 \`headB\`，找出并返回两个链表相交的起始节点。如果不相交返回 \`null\`。要求时间 O(m+n)，空间 O(1)。

**示例：**
\`\`\`
链表A: 4 → 1 → 8 → 4 → 5
链表B: 5 → 6 → 1 → 8 → 4 → 5
相交节点值为 8
\`\`\`

**约束条件：**
- 链表节点数范围 \`[1, 3 * 10^4]\`
- 不能修改链表结构

### 解题思路

双指针法：指针 A 遍历完链表 A 后转到链表 B 头部，指针 B 遍历完链表 B 后转到链表 A 头部。如果相交，两指针会在交点相遇（走过的总长度相同）。

### 代码实现

\`\`\`javascript
function getIntersectionNode(headA, headB) {
  let pA = headA, pB = headB
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next
    pB = pB === null ? headA : pB.next
  }
  return pA // 相交返回交点，不相交返回 null
}
\`\`\`

**时间复杂度：** O(m + n)
**空间复杂度：** O(1)

**追问：** 为什么这个方法能保证在交点相遇？

**答案：**
设链表 A 独有部分长度为 a，链表 B 独有部分长度为 b，公共部分长度为 c。
- 指针 A 走的路径：a + c + b
- 指针 B 走的路径：b + c + a
两者总长度相同（a + c + b = b + c + a），所以一定会同时到达交点（或同时到达 null）。这是一个非常优雅的数学证明。`,
    tags: ['相交链表', '双指针', '链表', 'LeetCode 160']
  },
  {
    id: 765,
    title: '对称二叉树（递归/迭代）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 对称二叉树

**题目描述：**
给定一个二叉树的根节点 \`root\`，检查它是否是轴对称的（即左右子树互为镜像）。

**示例：**
\`\`\`
    1
   / \\
  2   2
 / \\ / \\
3  4 4  3  → true

    1
   / \\
  2   2
   \\   \\
   3    3  → false
\`\`\`

**约束条件：**
- 树中节点数 \`[1, 1000]\`
- \`-100 <= Node.val <= 100\`

### 代码实现

\`\`\`javascript
// 方法一：递归
function isSymmetric(root) {
  if (!root) return true
  return isMirror(root.left, root.right)
}

function isMirror(left, right) {
  if (!left && !right) return true
  if (!left || !right) return false
  return left.val === right.val
    && isMirror(left.left, right.right)
    && isMirror(left.right, right.left)
}

// 方法二：迭代（BFS）
function isSymmetric(root) {
  if (!root) return true
  const queue = [root.left, root.right]
  while (queue.length) {
    const left = queue.shift()
    const right = queue.shift()
    if (!left && !right) continue
    if (!left || !right || left.val !== right.val) return false
    queue.push(left.left, right.right)
    queue.push(left.right, right.left)
  }
  return true
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(n)

**追问：** 如何判断两棵树是否相同？

**答案：**
\`\`\`javascript
function isSameTree(p, q) {
  if (!p && !q) return true
  if (!p || !q) return false
  return p.val === q.val
    && isSameTree(p.left, q.left)
    && isSameTree(p.right, q.right)
}
\`\`\`
对称树是"镜像比较"（左-右 vs 右-左），相同树是"同向比较"（左-左 vs 右-右）。`,
    tags: ['对称二叉树', '递归', 'BFS', 'LeetCode 101']
  },
  {
    id: 766,
    title: '多数元素（摩尔投票算法）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 多数元素

**题目描述：**
给定一个大小为 \`n\` 的数组 \`nums\`，返回其中的多数元素（出现次数大于 \`⌊n/2⌋\` 的元素）。假设数组非空且多数元素一定存在。

**示例：**
- 输入：\`[2, 2, 1, 1, 1, 2, 2]\`
- 输出：\`2\`

**约束条件：**
- \`n == nums.length\`
- \`1 <= n <= 5 * 10^4\`

### 解题思路

**摩尔投票算法（Boyer-Moore Voting）：** 维护一个候选人和计数器。遍历数组，如果计数为 0 则更换候选人；如果当前元素等于候选人则计数+1，否则计数-1。最终候选人就是多数元素。

### 代码实现

\`\`\`javascript
function majorityElement(nums) {
  let candidate = nums[0], count = 1
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i]
      count = 1
    } else if (nums[i] === candidate) {
      count++
    } else {
      count--
    }
  }
  return candidate
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(1)

**追问：** 为什么摩尔投票算法是正确的？

**答案：**
直觉理解：多数元素出现次数 > n/2，把多数元素看作"正方"，其他所有元素看作"反方"。每次"正反抵消"后，正方一定还有剩余。数学证明：多数元素的计数永远不会被完全抵消为 0。

**追问：** 如果要找出现次数超过 n/3 的所有元素呢？

**答案：**
LeetCode 229。最多有 2 个这样的元素。使用两个候选人和两个计数器，类似摩尔投票的扩展版本，最后再验证候选人是否真的超过 n/3。`,
    tags: ['多数元素', '摩尔投票', 'Boyer-Moore', 'LeetCode 169']
  },
  {
    id: 767,
    title: '回文链表（快慢指针 + 反转）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 回文链表

**题目描述：**
给定一个单链表的头节点 \`head\`，判断该链表是否为回文链表。要求 O(n) 时间和 O(1) 空间。

**示例：**
- 输入：\`1 → 2 → 2 → 1\`
- 输出：\`true\`
- 输入：\`1 → 2\`
- 输出：\`false\`

**约束条件：**
- 链表节点数 \`[1, 10^5]\`
- \`0 <= Node.val <= 9\`

### 解题思路

1. 用快慢指针找到链表中点
2. 反转后半部分链表
3. 逐一比较前半部分和反转后的后半部分

### 代码实现

\`\`\`javascript
function isPalindrome(head) {
  if (!head || !head.next) return true

  // 1. 快慢指针找中点
  let slow = head, fast = head
  while (fast.next && fast.next.next) {
    slow = slow.next
    fast = fast.next.next
  }

  // 2. 反转后半部分
  let prev = null, curr = slow.next
  while (curr) {
    const next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }

  // 3. 比较
  let p1 = head, p2 = prev
  while (p2) {
    if (p1.val !== p2.val) return false
    p1 = p1.next
    p2 = p2.next
  }
  return true
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(1)

**追问：** 这道题综合了哪些链表技巧？

**答案：**
这道题是链表题的"集大成者"，综合了三个核心技巧：
1. **快慢指针找中点** — 也用于判断链表是否有环
2. **链表反转** — 最基础的链表操作
3. **双指针比较** — 同时遍历两个链表

面试中能写出 O(1) 空间的解法会非常加分。`,
    tags: ['回文链表', '快慢指针', '链表反转', 'LeetCode 234']
  },
  {
    id: 768,
    title: '有效的字母异位词（哈希计数）',
    category: '算法实现',
    difficulty: 'easy',
    content: `## 有效的字母异位词

**题目描述：**
给定两个字符串 \`s\` 和 \`t\`，判断 \`t\` 是否是 \`s\` 的字母异位词（即两个字符串包含相同的字符且每个字符出现次数相同）。

**示例：**
- 输入：\`s = "anagram"\`, \`t = "nagaram"\`
- 输出：\`true\`
- 输入：\`s = "rat"\`, \`t = "car"\`
- 输出：\`false\`

**约束条件：**
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` 和 \`t\` 仅包含小写字母

### 代码实现

\`\`\`javascript
// 方法一：哈希计数（推荐）
function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const count = new Array(26).fill(0)
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++
    count[t.charCodeAt(i) - 97]--
  }
  return count.every(c => c === 0)
}

// 方法二：排序比较
function isAnagram(s, t) {
  return s.split('').sort().join('') === t.split('').sort().join('')
}
\`\`\`

**时间复杂度：** 哈希法 O(n)，排序法 O(n log n)
**空间复杂度：** 哈希法 O(1)（固定26个字母），排序法 O(n)

**追问：** 如何找到字符串中所有字母异位词的起始索引？

**答案：**
LeetCode 438「找到字符串中所有字母异位词」。使用**滑动窗口 + 哈希计数**：维护一个窗口大小等于目标字符串长度的窗口，滑动时更新字符计数，当计数匹配时记录起始索引。
\`\`\`javascript
function findAnagrams(s, p) {
  const result = [], count = new Array(26).fill(0)
  for (const ch of p) count[ch.charCodeAt(0) - 97]++
  let left = 0, matched = 0
  for (let right = 0; right < s.length; right++) {
    const idx = s.charCodeAt(right) - 97
    count[idx]--
    if (count[idx] >= 0) matched++
    if (right - left + 1 > p.length) {
      const lidx = s.charCodeAt(left) - 97
      count[lidx]++
      if (count[lidx] > 0) matched--
      left++
    }
    if (matched === p.length) result.push(left)
  }
  return result
}
\`\`\``,
    tags: ['字母异位词', '哈希计数', '滑动窗口', 'LeetCode 242']
  },
  {
    id: 769,
    title: '最小覆盖子串（滑动窗口进阶）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 最小覆盖子串

**题目描述：**
给定字符串 \`s\` 和 \`t\`，返回 \`s\` 中涵盖 \`t\` 所有字符的最小子串。如果不存在则返回空字符串。

**示例：**
- 输入：\`s = "ADOBECODEBANC"\`, \`t = "ABC"\`
- 输出：\`"BANC"\`

**约束条件：**
- \`1 <= s.length, t.length <= 10^5\`
- \`s\` 和 \`t\` 由英文字母组成

### 解题思路

经典的**滑动窗口**问题。维护一个窗口，先扩大右边界直到包含 t 的所有字符，再收缩左边界找最小窗口。

### 代码实现

\`\`\`javascript
function minWindow(s, t) {
  const need = new Map()
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1)

  let left = 0, matched = 0
  let minLen = Infinity, minStart = 0
  const window = new Map()

  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    window.set(ch, (window.get(ch) || 0) + 1)

    // 当前字符满足需求
    if (need.has(ch) && window.get(ch) === need.get(ch)) {
      matched++
    }

    // 所有字符都满足时，收缩左边界
    while (matched === need.size) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1
        minStart = left
      }
      const leftCh = s[left]
      window.set(leftCh, window.get(leftCh) - 1)
      if (need.has(leftCh) && window.get(leftCh) < need.get(leftCh)) {
        matched--
      }
      left++
    }
  }

  return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen)
}
\`\`\`

**时间复杂度：** O(|s| + |t|)
**空间复杂度：** O(|s| + |t|)

**追问：** 滑动窗口的通用模板是什么？

**答案：**
\`\`\`javascript
function slidingWindow(s) {
  const window = new Map()
  let left = 0
  for (let right = 0; right < s.length; right++) {
    // 1. 扩大窗口：将 s[right] 加入窗口
    // 2. 判断是否需要收缩
    while (/* 窗口需要收缩 */) {
      // 3. 收缩窗口：将 s[left] 移出窗口
      left++
    }
    // 4. 更新答案
  }
}
\`\`\`
这个模板可以解决：最小覆盖子串、无重复最长子串、字母异位词、最长满足条件子串等一系列问题。`,
    tags: ['最小覆盖子串', '滑动窗口', 'LeetCode 76', '面试高频']
  },
  {
    id: 770,
    title: '除自身以外数组的乘积（前缀积/后缀积）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 除自身以外数组的乘积

**题目描述：**
给定一个整数数组 \`nums\`，返回数组 \`answer\`，其中 \`answer[i]\` 等于 \`nums\` 中除 \`nums[i]\` 之外其余各元素的乘积。要求 O(n) 时间且**不能使用除法**。

**示例：**
- 输入：\`[1, 2, 3, 4]\`
- 输出：\`[24, 12, 8, 6]\`

**约束条件：**
- \`2 <= nums.length <= 10^5\`
- \`-30 <= nums[i] <= 30\`
- 保证结果在 32 位整数范围内

### 解题思路

对于每个位置 i，结果 = 左边所有元素的乘积 × 右边所有元素的乘积。先从左到右计算前缀积，再从右到左计算后缀积。

### 代码实现

\`\`\`javascript
// 方法一：两个数组
function productExceptSelf(nums) {
  const n = nums.length
  const left = new Array(n).fill(1)   // left[i] = nums[0] * ... * nums[i-1]
  const right = new Array(n).fill(1)  // right[i] = nums[i+1] * ... * nums[n-1]

  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1]
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1]

  return left.map((val, i) => val * right[i])
}

// 方法二：O(1) 额外空间（结果数组不算）
function productExceptSelf(nums) {
  const n = nums.length
  const answer = new Array(n).fill(1)

  // 先计算左侧乘积存入 answer
  let leftProduct = 1
  for (let i = 0; i < n; i++) {
    answer[i] = leftProduct
    leftProduct *= nums[i]
  }

  // 再从右侧乘上右侧乘积
  let rightProduct = 1
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= rightProduct
    rightProduct *= nums[i]
  }

  return answer
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(1)（不算输出数组）

**追问：** 为什么不能用除法？

**答案：**
1. 数组中可能包含 0，除以 0 会出错
2. 即使没有 0，整数除法可能有精度问题
3. 面试官考察的是前缀积/后缀积的思维，这个技巧在很多题目中都有应用（如"接雨水"的前缀最大值）`,
    tags: ['前缀积', '后缀积', '数组', 'LeetCode 238']
  },
  {
    id: 771,
    title: '子集（回溯 / 位运算枚举）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 子集

**题目描述：**
给定一个整数数组 \`nums\`（元素互不相同），返回该数组所有可能的子集（幂集）。解集不能包含重复的子集。

**示例：**
- 输入：\`[1, 2, 3]\`
- 输出：\`[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]\`

**约束条件：**
- \`1 <= nums.length <= 10\`
- \`-10 <= nums[i] <= 10\`
- 所有元素互不相同

### 代码实现

\`\`\`javascript
// 方法一：回溯
function subsets(nums) {
  const result = []
  function backtrack(start, path) {
    result.push([...path])
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i])
      backtrack(i + 1, path)
      path.pop()
    }
  }
  backtrack(0, [])
  return result
}

// 方法二：位运算枚举
function subsets(nums) {
  const n = nums.length
  const result = []
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = []
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(nums[i])
    }
    result.push(subset)
  }
  return result
}

// 方法三：迭代（逐步扩展）
function subsets(nums) {
  let result = [[]]
  for (const num of nums) {
    result = [...result, ...result.map(sub => [...sub, num])]
  }
  return result
}
\`\`\`

**时间复杂度：** O(n × 2^n)
**空间复杂度：** O(n × 2^n)

**追问：** 如果数组中有重复元素呢？

**答案：**
LeetCode 90「子集 II」。先排序，回溯时跳过同层重复元素：
\`\`\`javascript
if (i > start && nums[i] === nums[i - 1]) continue
\`\`\`
这是回溯去重的经典技巧，同样适用于组合总和 II、全排列 II 等问题。`,
    tags: ['子集', '回溯', '位运算', 'LeetCode 78']
  },
  {
    id: 772,
    title: '单词拆分（动态规划 + 字符串）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 单词拆分

**题目描述：**
给定一个字符串 \`s\` 和一个字符串列表 \`wordDict\` 作为字典。判断是否可以利用字典中出现的一个或多个单词拼接出 \`s\`。字典中的单词可以重复使用。

**示例：**
- 输入：\`s = "leetcode"\`, \`wordDict = ["leet", "code"]\`
- 输出：\`true\`
- 输入：\`s = "catsandog"\`, \`wordDict = ["cats", "dog", "sand", "and", "cat"]\`
- 输出：\`false\`

**约束条件：**
- \`1 <= s.length <= 300\`
- \`1 <= wordDict.length <= 1000\`
- \`1 <= wordDict[i].length <= 20\`

### 解题思路

\`dp[i]\` 表示 \`s[0..i-1]\` 是否可以被拆分。对于每个位置 i，检查是否存在 j 使得 \`dp[j] = true\` 且 \`s[j..i-1]\` 在字典中。

### 代码实现

\`\`\`javascript
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict)
  const n = s.length
  const dp = new Array(n + 1).fill(false)
  dp[0] = true // 空字符串可以被拆分

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true
        break
      }
    }
  }
  return dp[n]
}
\`\`\`

**时间复杂度：** O(n² × k)，k 为字符串比较时间
**空间复杂度：** O(n)

**追问：** 如何优化？

**答案：**
1. **限制内层循环范围**：只检查长度不超过字典中最长单词的子串
2. **使用 Trie 树**：将字典构建为 Trie，加速前缀匹配
\`\`\`javascript
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict)
  const maxLen = Math.max(...wordDict.map(w => w.length))
  const dp = new Array(s.length + 1).fill(false)
  dp[0] = true
  for (let i = 1; i <= s.length; i++) {
    for (let j = Math.max(0, i - maxLen); j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true
        break
      }
    }
  }
  return dp[s.length]
}
\`\`\``,
    tags: ['单词拆分', '动态规划', '字符串', 'LeetCode 139']
  },
  {
    id: 773,
    title: '每日温度（单调栈经典）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 每日温度

**题目描述：**
给定一个整数数组 \`temperatures\` 表示每天的温度，返回一个数组 \`answer\`，其中 \`answer[i]\` 是指对于第 \`i\` 天，下一个更高温度出现在几天后。如果之后没有更高温度，则 \`answer[i] = 0\`。

**示例：**
- 输入：\`[73, 74, 75, 71, 69, 72, 76, 73]\`
- 输出：\`[1, 1, 4, 2, 1, 1, 0, 0]\`

**约束条件：**
- \`1 <= temperatures.length <= 10^5\`
- \`30 <= temperatures[i] <= 100\`

### 解题思路

使用**单调递减栈**：栈中存储索引，从栈底到栈顶对应的温度递减。遇到更高温度时，弹出栈中所有比它低的元素，计算天数差。

### 代码实现

\`\`\`javascript
function dailyTemperatures(temperatures) {
  const n = temperatures.length
  const answer = new Array(n).fill(0)
  const stack = [] // 存储索引，对应温度单调递减

  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIndex = stack.pop()
      answer[prevIndex] = i - prevIndex
    }
    stack.push(i)
  }
  return answer
}
\`\`\`

**时间复杂度：** O(n)，每个元素最多入栈出栈各一次
**空间复杂度：** O(n)

**追问：** 单调栈能解决哪些问题？

**答案：**
单调栈是一类非常重要的算法模式：
1. **下一个更大/更小元素**（本题、LeetCode 496/503）
2. **接雨水**（LeetCode 42）
3. **柱状图中最大矩形**（LeetCode 84）
4. **最大矩形**（LeetCode 85）
5. **股票价格跨度**（LeetCode 901）

核心思想：维护一个单调的栈，当新元素破坏单调性时，弹出元素并处理。`,
    tags: ['每日温度', '单调栈', 'LeetCode 739', '面试高频']
  },
  {
    id: 774,
    title: '组合总和（回溯 + 剪枝）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 组合总和

**题目描述：**
给定一个无重复元素的正整数数组 \`candidates\` 和一个目标整数 \`target\`，找出所有可以使数字和为 \`target\` 的组合。\`candidates\` 中的数字可以无限制重复被选取。

**示例：**
- 输入：\`candidates = [2, 3, 6, 7]\`, \`target = 7\`
- 输出：\`[[2, 2, 3], [7]]\`

**约束条件：**
- \`1 <= candidates.length <= 30\`
- \`2 <= candidates[i] <= 40\`
- \`1 <= target <= 40\`

### 解题思路

回溯搜索，每个数字可以重复选取（从当前位置开始而非下一个位置）。排序后可以剪枝：当前数字已经超过剩余目标值时，后面更大的数字也不用尝试。

### 代码实现

\`\`\`javascript
function combinationSum(candidates, target) {
  const result = []
  candidates.sort((a, b) => a - b) // 排序便于剪枝

  function backtrack(start, path, remaining) {
    if (remaining === 0) {
      result.push([...path])
      return
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break // 剪枝
      path.push(candidates[i])
      backtrack(i, path, remaining - candidates[i]) // i 不是 i+1，允许重复
      path.pop()
    }
  }

  backtrack(0, [], target)
  return result
}
\`\`\`

**时间复杂度：** O(n^(target/min))，指数级
**空间复杂度：** O(target/min)（递归深度）

**追问：** 如果每个数字只能使用一次呢？

**答案：**
LeetCode 40「组合总和 II」。两个改动：
1. 递归时从 \`i + 1\` 开始（不允许重复使用）
2. 同层去重：\`if (i > start && candidates[i] === candidates[i-1]) continue\`
\`\`\`javascript
function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b)
  const result = []
  function backtrack(start, path, remaining) {
    if (remaining === 0) { result.push([...path]); return }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) break
      if (i > start && candidates[i] === candidates[i - 1]) continue // 去重
      path.push(candidates[i])
      backtrack(i + 1, path, remaining - candidates[i])
      path.pop()
    }
  }
  backtrack(0, [], target)
  return result
}
\`\`\``,
    tags: ['组合总和', '回溯', '剪枝', 'LeetCode 39']
  },
  {
    id: 775,
    title: '打家劫舍（一维动态规划经典）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 打家劫舍

**题目描述：**
你是一个专业的小偷，沿街有一排房屋，每间房内都有一定现金。相邻的房屋装有互联的防盗系统，如果两间相邻的房屋在同一晚上被闯入，系统会自动报警。给定一个代表每个房屋金额的数组 \`nums\`，计算在不触动警报的情况下能偷到的最高金额。

**示例：**
- 输入：\`[2, 7, 9, 3, 1]\`
- 输出：\`12\`（偷 2 + 9 + 1 = 12）

**约束条件：**
- \`1 <= nums.length <= 100\`
- \`0 <= nums[i] <= 400\`

### 代码实现

\`\`\`javascript
// 方法一：标准 DP
function rob(nums) {
  if (nums.length === 1) return nums[0]
  const dp = new Array(nums.length)
  dp[0] = nums[0]
  dp[1] = Math.max(nums[0], nums[1])
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])
  }
  return dp[nums.length - 1]
}

// 方法二：空间优化
function rob(nums) {
  let prev2 = 0, prev1 = 0
  for (const num of nums) {
    const curr = Math.max(prev1, prev2 + num)
    prev2 = prev1
    prev1 = curr
  }
  return prev1
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(1)

**追问：** 如果房屋排成环形呢？

**答案：**
LeetCode 213「打家劫舍 II」。环形意味着第一间和最后一间不能同时偷。分两种情况取最大值：
1. 偷第 1 间到第 n-1 间（不偷最后一间）
2. 偷第 2 间到第 n 间（不偷第一间）
\`\`\`javascript
function rob(nums) {
  if (nums.length === 1) return nums[0]
  return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1))
}
function robRange(nums, start, end) {
  let prev2 = 0, prev1 = 0
  for (let i = start; i <= end; i++) {
    const curr = Math.max(prev1, prev2 + nums[i])
    prev2 = prev1
    prev1 = curr
  }
  return prev1
}
\`\`\``,
    tags: ['打家劫舍', '动态规划', '空间优化', 'LeetCode 198']
  },
  {
    id: 776,
    title: '从前序与中序遍历序列构造二叉树',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 从前序与中序遍历序列构造二叉树

**题目描述：**
给定两个整数数组 \`preorder\` 和 \`inorder\`，其中 \`preorder\` 是二叉树的前序遍历，\`inorder\` 是同一棵树的中序遍历，请构造二叉树并返回其根节点。

**示例：**
- 输入：\`preorder = [3,9,20,15,7]\`, \`inorder = [9,3,15,20,7]\`
- 输出：\`[3,9,20,null,null,15,7]\`

**约束条件：**
- \`1 <= preorder.length <= 3000\`
- \`preorder.length == inorder.length\`
- 节点值互不相同

### 解题思路

前序遍历的第一个元素是根节点。在中序遍历中找到根节点位置，左边是左子树，右边是右子树。递归构建。

### 代码实现

\`\`\`javascript
function buildTree(preorder, inorder) {
  const inorderMap = new Map()
  inorder.forEach((val, idx) => inorderMap.set(val, idx))
  let preIdx = 0

  function build(inLeft, inRight) {
    if (inLeft > inRight) return null

    const rootVal = preorder[preIdx++]
    const root = { val: rootVal, left: null, right: null }
    const inIdx = inorderMap.get(rootVal)

    root.left = build(inLeft, inIdx - 1)
    root.right = build(inIdx + 1, inRight)
    return root
  }

  return build(0, inorder.length - 1)
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(n)（哈希表 + 递归栈）

**追问：** 为什么用哈希表存储中序遍历的索引？

**答案：**
如果每次在中序数组中线性查找根节点位置，时间复杂度为 O(n²)。用哈希表预处理后，查找变为 O(1)，总时间复杂度降为 O(n)。

**追问：** 从后序和中序遍历能构造吗？

**答案：**
可以。后序遍历的最后一个元素是根节点，且先构建右子树再构建左子树（后序遍历从后往前是"根-右-左"）。`,
    tags: ['构造二叉树', '前序遍历', '中序遍历', 'LeetCode 105']
  },
  {
    id: 777,
    title: '旋转图像（矩阵原地旋转）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 旋转图像

**题目描述：**
给定一个 n × n 的二维矩阵 \`matrix\` 表示一个图像，将图像顺时针旋转 90 度。要求原地旋转，不能使用额外矩阵。

**示例：**
\`\`\`
输入：[[1,2,3],[4,5,6],[7,8,9]]
输出：[[7,4,1],[8,5,2],[9,6,3]]
\`\`\`

**约束条件：**
- \`n == matrix.length == matrix[i].length\`
- \`1 <= n <= 20\`

### 解题思路

顺时针旋转 90° = 先沿主对角线转置 + 再左右翻转。

### 代码实现

\`\`\`javascript
// 方法一：转置 + 翻转（推荐，直观易记）
function rotate(matrix) {
  const n = matrix.length

  // 1. 沿主对角线转置
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
    }
  }

  // 2. 每行左右翻转
  for (let i = 0; i < n; i++) {
    matrix[i].reverse()
  }
}

// 方法二：四点旋转（一步到位）
function rotate(matrix) {
  const n = matrix.length
  for (let i = 0; i < Math.floor(n / 2); i++) {
    for (let j = i; j < n - 1 - i; j++) {
      const temp = matrix[i][j]
      matrix[i][j] = matrix[n - 1 - j][i]
      matrix[n - 1 - j][i] = matrix[n - 1 - i][n - 1 - j]
      matrix[n - 1 - i][n - 1 - j] = matrix[j][n - 1 - i]
      matrix[j][n - 1 - i] = temp
    }
  }
}
\`\`\`

**时间复杂度：** O(n²)
**空间复杂度：** O(1)

**追问：** 其他旋转方向怎么做？

**答案：**
| 旋转方向 | 操作 |
|---------|------|
| 顺时针 90° | 转置 + 左右翻转 |
| 逆时针 90° | 转置 + 上下翻转 |
| 180° | 上下翻转 + 左右翻转 |

记住"转置 + 翻转"的组合技巧，面试中可以快速推导。`,
    tags: ['旋转图像', '矩阵', '原地操作', 'LeetCode 48']
  },
  {
    id: 778,
    title: '编辑距离（二维DP经典）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 编辑距离

**题目描述：**
给定两个单词 \`word1\` 和 \`word2\`，返回将 \`word1\` 转换成 \`word2\` 所使用的最少操作数。允许的操作：插入一个字符、删除一个字符、替换一个字符。

**示例：**
- 输入：\`word1 = "horse"\`, \`word2 = "ros"\`
- 输出：\`3\`（horse → rorse → rose → ros）

**约束条件：**
- \`0 <= word1.length, word2.length <= 500\`
- 字符串仅包含小写英文字母

### 解题思路

经典二维 DP。\`dp[i][j]\` 表示 \`word1[0..i-1]\` 转换为 \`word2[0..j-1]\` 的最少操作数。

### 代码实现

\`\`\`javascript
function minDistance(word1, word2) {
  const m = word1.length, n = word2.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  // 初始化：空串到目标串需要的操作数
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] // 字符相同，无需操作
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // 删除 word1[i]
          dp[i][j - 1],     // 插入 word2[j]
          dp[i - 1][j - 1]  // 替换 word1[i] 为 word2[j]
        )
      }
    }
  }
  return dp[m][n]
}
\`\`\`

**时间复杂度：** O(m × n)
**空间复杂度：** O(m × n)，可优化为 O(min(m, n))

**追问：** 编辑距离有哪些实际应用？

**答案：**
1. **拼写检查**：找到与输入最接近的正确单词
2. **DNA 序列比对**：生物信息学中衡量基因序列相似度
3. **模糊搜索**：搜索引擎的"你是不是要找..."功能
4. **Git diff**：计算文件差异的最小编辑操作
5. **自然语言处理**：文本相似度计算

这是动态规划中最经典的二维 DP 问题之一，面试中出现频率极高。`,
    tags: ['编辑距离', '动态规划', '二维DP', 'LeetCode 72']
  },
  {
    id: 779,
    title: '课程表（拓扑排序判断有向图是否有环）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 课程表

**题目描述：**
你这个学期必须选修 \`numCourses\` 门课程（编号 0 到 numCourses-1）。选修某些课程之前需要先修另一些课程，用 \`prerequisites[i] = [a, b]\` 表示修课程 a 之前必须先修课程 b。判断是否可能完成所有课程的学习。

**示例：**
- 输入：\`numCourses = 2\`, \`prerequisites = [[1,0]]\`
- 输出：\`true\`
- 输入：\`numCourses = 2\`, \`prerequisites = [[1,0],[0,1]]\`
- 输出：\`false\`（存在环）

**约束条件：**
- \`1 <= numCourses <= 2000\`
- \`0 <= prerequisites.length <= 5000\`

### 解题思路

本质是判断有向图是否有环。使用 BFS 拓扑排序（Kahn 算法）：如果所有节点都能被处理，则无环。

### 代码实现

\`\`\`javascript
// 方法一：BFS 拓扑排序
function canFinish(numCourses, prerequisites) {
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

  let count = 0
  while (queue.length) {
    const course = queue.shift()
    count++
    for (const next of graph[course]) {
      if (--inDegree[next] === 0) queue.push(next)
    }
  }
  return count === numCourses
}

// 方法二：DFS 检测环
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => [])
  for (const [a, b] of prerequisites) graph[b].push(a)

  const visited = new Array(numCourses).fill(0) // 0:未访问 1:访问中 2:已完成

  function dfs(node) {
    if (visited[node] === 1) return false // 发现环
    if (visited[node] === 2) return true  // 已处理
    visited[node] = 1
    for (const next of graph[node]) {
      if (!dfs(next)) return false
    }
    visited[node] = 2
    return true
  }

  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false
  }
  return true
}
\`\`\`

**时间复杂度：** O(V + E)
**空间复杂度：** O(V + E)

**追问：** 这道题在前端工程中的应用？

**答案：**
1. **Webpack 模块依赖分析**：检测循环依赖
2. **npm 包依赖解析**：确定安装顺序
3. **任务调度系统**：CI/CD 流水线中的任务依赖
4. **Makefile 构建顺序**：确定编译顺序`,
    tags: ['课程表', '拓扑排序', '有向图', 'LeetCode 207']
  },
  {
    id: 780,
    title: '最长有效括号（栈 / DP）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 最长有效括号

**题目描述：**
给定一个只包含 \`(\` 和 \`)\` 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

**示例：**
- 输入：\`"(()"\`
- 输出：\`2\`
- 输入：\`")()())"\`
- 输出：\`4\`

**约束条件：**
- \`0 <= s.length <= 3 * 10^4\`

### 代码实现

\`\`\`javascript
// 方法一：栈（推荐）
function longestValidParentheses(s) {
  let maxLen = 0
  const stack = [-1] // 初始放入 -1 作为"上一个未匹配的右括号位置"

  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i)
    } else {
      stack.pop()
      if (stack.length === 0) {
        stack.push(i) // 当前右括号作为新的分隔点
      } else {
        maxLen = Math.max(maxLen, i - stack[stack.length - 1])
      }
    }
  }
  return maxLen
}

// 方法二：动态规划
function longestValidParentheses(s) {
  const n = s.length
  const dp = new Array(n).fill(0) // dp[i] 表示以 s[i] 结尾的最长有效括号长度
  let maxLen = 0

  for (let i = 1; i < n; i++) {
    if (s[i] === ')') {
      if (s[i - 1] === '(') {
        // ...()
        dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2
      } else if (dp[i - 1] > 0) {
        // ...))
        const j = i - dp[i - 1] - 1
        if (j >= 0 && s[j] === '(') {
          dp[i] = dp[i - 1] + 2 + (j >= 1 ? dp[j - 1] : 0)
        }
      }
      maxLen = Math.max(maxLen, dp[i])
    }
  }
  return maxLen
}

// 方法三：双向扫描（O(1) 空间）
function longestValidParentheses(s) {
  let left = 0, right = 0, maxLen = 0

  // 从左到右
  for (const ch of s) {
    ch === '(' ? left++ : right++
    if (left === right) maxLen = Math.max(maxLen, 2 * right)
    else if (right > left) left = right = 0
  }

  left = right = 0
  // 从右到左
  for (let i = s.length - 1; i >= 0; i--) {
    s[i] === ')' ? right++ : left++
    if (left === right) maxLen = Math.max(maxLen, 2 * left)
    else if (left > right) left = right = 0
  }

  return maxLen
}
\`\`\`

**时间复杂度：** 三种方法都是 O(n)
**空间复杂度：** 栈和 DP 为 O(n)，双向扫描为 O(1)

**追问：** 方法三为什么需要双向扫描？

**答案：**
从左到右扫描时，如果 \`left > right\` 可以重置（右括号多了一定无效），但 \`left > right\` 时无法判断（可能后面还有右括号来匹配）。所以需要从右到左再扫一次，处理左括号多余的情况。两次扫描互补，覆盖所有情况。`,
    tags: ['最长有效括号', '栈', '动态规划', 'LeetCode 32']
  },
  {
    id: 781,
    title: '柱状图中最大的矩形（单调栈进阶）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 柱状图中最大的矩形

**题目描述：**
给定 n 个非负整数，用来表示柱状图中各个柱子的高度，每个柱子宽度为 1。求在该柱状图中能够勾勒出的最大矩形面积。

**示例：**
- 输入：\`heights = [2, 1, 5, 6, 2, 3]\`
- 输出：\`10\`（高度 5，宽度 2 的矩形）

**约束条件：**
- \`1 <= heights.length <= 10^5\`
- \`0 <= heights[i] <= 10^4\`

### 解题思路

对于每个柱子，找到它左边和右边第一个比它矮的柱子，就能确定以该柱子高度为矩形高度时的最大宽度。使用**单调递增栈**高效求解。

### 代码实现

\`\`\`javascript
function largestRectangleArea(heights) {
  const n = heights.length
  const stack = [] // 单调递增栈，存索引
  let maxArea = 0

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i] // 末尾加一个高度为 0 的哨兵
    while (stack.length && h < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()]
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1
      maxArea = Math.max(maxArea, height * width)
    }
    stack.push(i)
  }
  return maxArea
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(n)

**追问：** 如何扩展到二维矩阵中的最大矩形？

**答案：**
LeetCode 85「最大矩形」。将二维矩阵的每一行看作柱状图的底部，逐行累加高度（遇到 0 则重置为 0），对每一行调用本题的算法。时间复杂度 O(m × n)。
\`\`\`javascript
function maximalRectangle(matrix) {
  if (!matrix.length) return 0
  const heights = new Array(matrix[0].length).fill(0)
  let maxArea = 0
  for (const row of matrix) {
    for (let j = 0; j < row.length; j++) {
      heights[j] = row[j] === '1' ? heights[j] + 1 : 0
    }
    maxArea = Math.max(maxArea, largestRectangleArea(heights))
  }
  return maxArea
}
\`\`\``,
    tags: ['最大矩形', '单调栈', 'LeetCode 84', '面试高频']
  },
  {
    id: 782,
    title: '二叉树的右视图（BFS层序遍历变体）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 二叉树的右视图

**题目描述：**
给定一个二叉树的根节点 \`root\`，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

**示例：**
\`\`\`
    1
   / \\
  2   3
   \\   \\
    5   4
输出：[1, 3, 4]
\`\`\`

**约束条件：**
- 节点数 \`[0, 100]\`
- \`-100 <= Node.val <= 100\`

### 代码实现

\`\`\`javascript
// 方法一：BFS（取每层最后一个）
function rightSideView(root) {
  if (!root) return []
  const result = [], queue = [root]
  while (queue.length) {
    const levelSize = queue.length
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      if (i === levelSize - 1) result.push(node.val) // 每层最后一个
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }
  return result
}

// 方法二：DFS（先右后左，记录每层第一个访问的节点）
function rightSideView(root) {
  const result = []
  function dfs(node, depth) {
    if (!node) return
    if (depth === result.length) result.push(node.val) // 该层第一次到达
    dfs(node.right, depth + 1) // 先访问右子树
    dfs(node.left, depth + 1)
  }
  dfs(root, 0)
  return result
}
\`\`\`

**时间复杂度：** O(n)
**空间复杂度：** O(n)

**追问：** 如何获取二叉树的左视图？

**答案：**
BFS 方法取每层第一个元素（\`i === 0\`）；DFS 方法先访问左子树再访问右子树。

**追问：** 如何获取二叉树每层的最大值？

**答案：**
LeetCode 515。BFS 遍历每层时维护最大值：
\`\`\`javascript
function largestValues(root) {
  if (!root) return []
  const result = [], queue = [root]
  while (queue.length) {
    let max = -Infinity
    const size = queue.length
    for (let i = 0; i < size; i++) {
      const node = queue.shift()
      max = Math.max(max, node.val)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    result.push(max)
  }
  return result
}
\`\`\``,
    tags: ['二叉树右视图', 'BFS', 'DFS', 'LeetCode 199']
  },
  {
    id: 783,
    title: '实现 LFU 缓存（最不经常使用）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 实现 LFU 缓存

**题目描述：**
设计并实现最不经常使用（LFU）缓存。实现 \`LFUCache\` 类：
- \`LFUCache(int capacity)\` 用容量初始化
- \`int get(int key)\` 获取键的值，不存在返回 -1
- \`void put(int key, int value)\` 插入或更新键值对

当缓存达到容量上限时，删除使用频次最低的键。如果频次相同，删除最久未使用的键。

**示例：**
\`\`\`
LFUCache cache = new LFUCache(2)
cache.put(1, 1)   // cache={1=1}, freq={1:1}
cache.put(2, 2)   // cache={1=1, 2=2}, freq={1:1, 2:1}
cache.get(1)       // 返回 1, freq={1:2, 2:1}
cache.put(3, 3)    // 淘汰 key=2, cache={1=1, 3=3}
cache.get(2)       // 返回 -1
\`\`\`

**约束条件：**
- \`1 <= capacity <= 10^4\`
- \`0 <= key <= 10^5\`
- get 和 put 操作均为 O(1)

### 代码实现

\`\`\`javascript
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.minFreq = 0
    this.keyToVal = new Map()    // key → value
    this.keyToFreq = new Map()   // key → frequency
    this.freqToKeys = new Map()  // frequency → Set of keys (按插入顺序)
  }

  get(key) {
    if (!this.keyToVal.has(key)) return -1
    this._increaseFreq(key)
    return this.keyToVal.get(key)
  }

  put(key, value) {
    if (this.capacity === 0) return

    if (this.keyToVal.has(key)) {
      this.keyToVal.set(key, value)
      this._increaseFreq(key)
      return
    }

    // 容量满了，淘汰最低频次中最久未使用的
    if (this.keyToVal.size >= this.capacity) {
      this._removeMinFreqKey()
    }

    this.keyToVal.set(key, value)
    this.keyToFreq.set(key, 1)
    if (!this.freqToKeys.has(1)) this.freqToKeys.set(1, new Set())
    this.freqToKeys.get(1).add(key)
    this.minFreq = 1
  }

  _increaseFreq(key) {
    const freq = this.keyToFreq.get(key)
    this.keyToFreq.set(key, freq + 1)
    this.freqToKeys.get(freq).delete(key)
    if (this.freqToKeys.get(freq).size === 0) {
      this.freqToKeys.delete(freq)
      if (this.minFreq === freq) this.minFreq++
    }
    if (!this.freqToKeys.has(freq + 1)) this.freqToKeys.set(freq + 1, new Set())
    this.freqToKeys.get(freq + 1).add(key)
  }

  _removeMinFreqKey() {
    const keys = this.freqToKeys.get(this.minFreq)
    const oldestKey = keys.values().next().value // Set 的第一个元素（最早插入）
    keys.delete(oldestKey)
    if (keys.size === 0) this.freqToKeys.delete(this.minFreq)
    this.keyToVal.delete(oldestKey)
    this.keyToFreq.delete(oldestKey)
  }
}
\`\`\`

**时间复杂度：** get/put 均为 O(1)
**空间复杂度：** O(capacity)

**追问：** LFU 和 LRU 的区别？

**答案：**
| | LRU | LFU |
|--|-----|-----|
| 淘汰策略 | 最久未使用 | 使用频次最低 |
| 数据结构 | 哈希表 + 双向链表 | 哈希表 + 频次桶 |
| 适用场景 | 时间局部性强 | 频率局部性强 |
| 缺点 | 偶尔访问的热点数据可能被淘汰 | 新数据频次低容易被淘汰 |`,
    tags: ['LFU缓存', '数据结构设计', 'LeetCode 460', '面试高频']
  },
  {
    id: 784,
    title: '正则表达式匹配（递归 / DP）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 正则表达式匹配

**题目描述：**
给定字符串 \`s\` 和模式 \`p\`，实现支持 \`.\` 和 \`*\` 的正则表达式匹配。
- \`.\` 匹配任意单个字符
- \`*\` 匹配零个或多个前面的那一个元素

**示例：**
- 输入：\`s = "aab"\`, \`p = "c*a*b"\`
- 输出：\`true\`（c* 匹配 0 个 c，a* 匹配 2 个 a）

**约束条件：**
- \`1 <= s.length <= 20\`
- \`1 <= p.length <= 20\`
- \`*\` 前面保证有有效字符

### 代码实现

\`\`\`javascript
// 动态规划
function isMatch(s, p) {
  const m = s.length, n = p.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false))
  dp[0][0] = true

  // 初始化：s 为空时，p 中 x* 可以匹配空串
  for (let j = 1; j <= n; j++) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2]
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        // * 匹配 0 次：dp[i][j-2]
        dp[i][j] = dp[i][j - 2]
        // * 匹配 1+ 次：前一个字符匹配当前 s 字符
        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
          dp[i][j] = dp[i][j] || dp[i - 1][j]
        }
      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      }
    }
  }
  return dp[m][n]
}
\`\`\`

**时间复杂度：** O(m × n)
**空间复杂度：** O(m × n)

**追问：** 这道题和通配符匹配（LeetCode 44）有什么区别？

**答案：**
| | 正则匹配 (LeetCode 10) | 通配符匹配 (LeetCode 44) |
|--|------------------------|------------------------|
| \`*\` 含义 | 匹配前一个字符 0 次或多次 | 匹配任意字符序列（包括空） |
| \`?\` / \`.\` | \`.\` 匹配任意单字符 | \`?\` 匹配任意单字符 |
| 难度 | 更难（* 依赖前一个字符） | 较简单（* 独立匹配） |

正则匹配的 \`*\` 必须和前一个字符配合使用，状态转移更复杂。`,
    tags: ['正则匹配', '动态规划', 'LeetCode 10', '字符串']
  },
  {
    id: 785,
    title: '数据流的中位数（双堆维护）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 数据流的中位数

**题目描述：**
设计一个支持以下两种操作的数据结构：
- \`addNum(int num)\` 从数据流中添加一个整数
- \`findMedian()\` 返回目前所有元素的中位数

**示例：**
\`\`\`
addNum(1)  → [1]
addNum(2)  → [1, 2]
findMedian() → 1.5
addNum(3)  → [1, 2, 3]
findMedian() → 2
\`\`\`

**约束条件：**
- \`-10^5 <= num <= 10^5\`
- 最多调用 5 * 10^4 次
- findMedian 时数据结构中至少有一个元素

### 解题思路

使用**大顶堆**存储较小的一半，**小顶堆**存储较大的一半。保持两个堆的大小差不超过 1。中位数就是堆顶元素。

### 代码实现

\`\`\`javascript
class MedianFinder {
  constructor() {
    this.maxHeap = [] // 存较小的一半（大顶堆）
    this.minHeap = [] // 存较大的一半（小顶堆）
  }

  addNum(num) {
    // 先加入大顶堆
    this._pushMax(num)
    // 大顶堆的最大值移到小顶堆（保证大顶堆所有元素 <= 小顶堆所有元素）
    this._pushMin(this._popMax())
    // 平衡大小：小顶堆多了就移一个回来
    if (this.minHeap.length > this.maxHeap.length) {
      this._pushMax(this._popMin())
    }
  }

  findMedian() {
    if (this.maxHeap.length > this.minHeap.length) {
      return this.maxHeap[0]
    }
    return (this.maxHeap[0] + this.minHeap[0]) / 2
  }

  // 大顶堆操作（用负数模拟）
  _pushMax(val) {
    this.maxHeap.push(-val)
    this._bubbleUp(this.maxHeap, this.maxHeap.length - 1)
  }
  _popMax() {
    const val = -this.maxHeap[0]
    const last = this.maxHeap.pop()
    if (this.maxHeap.length) {
      this.maxHeap[0] = last
      this._sinkDown(this.maxHeap, 0)
    }
    return val
  }

  // 小顶堆操作
  _pushMin(val) {
    this.minHeap.push(val)
    this._bubbleUp(this.minHeap, this.minHeap.length - 1)
  }
  _popMin() {
    const val = this.minHeap[0]
    const last = this.minHeap.pop()
    if (this.minHeap.length) {
      this.minHeap[0] = last
      this._sinkDown(this.minHeap, 0)
    }
    return val
  }

  _bubbleUp(heap, i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      if (heap[parent] <= heap[i]) break
      ;[heap[parent], heap[i]] = [heap[i], heap[parent]]
      i = parent
    }
  }
  _sinkDown(heap, i) {
    const n = heap.length
    while (true) {
      let min = i
      const l = 2 * i + 1, r = 2 * i + 2
      if (l < n && heap[l] < heap[min]) min = l
      if (r < n && heap[r] < heap[min]) min = r
      if (min === i) break
      ;[heap[min], heap[i]] = [heap[i], heap[min]]
      i = min
    }
  }
}
\`\`\`

**时间复杂度：** addNum O(log n)，findMedian O(1)
**空间复杂度：** O(n)

**追问：** 为什么用双堆而不是排序数组？

**答案：**
排序数组插入需要 O(n)（移动元素），而双堆插入只需 O(log n)。对于数据流场景（频繁插入），双堆效率远高于排序数组。这也是面试中"设计类"题目的经典考点。`,
    tags: ['数据流中位数', '双堆', '设计', 'LeetCode 295']
  },
  {
    id: 786,
    title: '滑动窗口最大值（单调队列）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 滑动窗口最大值

**题目描述：**
给定一个整数数组 \`nums\` 和一个滑动窗口大小 \`k\`，窗口从最左侧移动到最右侧，每次移动一位。返回每个窗口中的最大值。

**示例：**
- 输入：\`nums = [1,3,-1,-3,5,3,6,7]\`, \`k = 3\`
- 输出：\`[3,3,5,5,6,7]\`

**约束条件：**
- \`1 <= nums.length <= 10^5\`
- \`-10^4 <= nums[i] <= 10^4\`
- \`1 <= k <= nums.length\`

### 解题思路

使用**单调递减双端队列（Deque）**：队列中存储索引，对应的值从队头到队尾递减。队头始终是当前窗口的最大值。

### 代码实现

\`\`\`javascript
function maxSlidingWindow(nums, k) {
  const result = []
  const deque = [] // 存储索引，对应值单调递减

  for (let i = 0; i < nums.length; i++) {
    // 移除超出窗口范围的元素
    while (deque.length && deque[0] <= i - k) {
      deque.shift()
    }

    // 维护单调递减：移除所有比当前元素小的
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop()
    }

    deque.push(i)

    // 窗口形成后记录最大值
    if (i >= k - 1) {
      result.push(nums[deque[0]])
    }
  }
  return result
}
\`\`\`

**时间复杂度：** O(n)，每个元素最多入队出队各一次
**空间复杂度：** O(k)

**追问：** 单调队列和单调栈的区别？

**答案：**
| | 单调栈 | 单调队列 |
|--|--------|---------|
| 数据结构 | 栈（只操作一端） | 双端队列（两端都可操作） |
| 典型问题 | 下一个更大元素 | 滑动窗口最值 |
| 关键操作 | 入栈时弹出破坏单调性的元素 | 入队时弹出 + 过期元素从队头移除 |
| 窗口约束 | 无 | 有（需要移除过期元素） |`,
    tags: ['滑动窗口最大值', '单调队列', 'Deque', 'LeetCode 239']
  },
  {
    id: 787,
    title: '字典序最小的 K 个数（快速选择 / 堆）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 最小的 K 个数

**题目描述：**
输入整数数组 \`arr\` 和整数 \`k\`，找出其中最小的 \`k\` 个数。可以以任意顺序返回。

**示例：**
- 输入：\`arr = [3, 2, 1]\`, \`k = 2\`
- 输出：\`[1, 2]\` 或 \`[2, 1]\`

**约束条件：**
- \`0 <= k <= arr.length <= 10000\`
- \`0 <= arr[i] <= 10000\`

### 代码实现

\`\`\`javascript
// 方法一：快速选择 O(n)
function getLeastNumbers(arr, k) {
  if (k === 0 || arr.length === 0) return []
  if (k >= arr.length) return arr

  function quickSelect(left, right) {
    const pivotIdx = partition(left, right)
    if (pivotIdx === k) return
    if (pivotIdx < k) quickSelect(pivotIdx + 1, right)
    else quickSelect(left, pivotIdx - 1)
  }

  function partition(left, right) {
    const randomIdx = left + Math.floor(Math.random() * (right - left + 1))
    ;[arr[randomIdx], arr[right]] = [arr[right], arr[randomIdx]]
    const pivot = arr[right]
    let i = left - 1
    for (let j = left; j < right; j++) {
      if (arr[j] <= pivot) {
        i++
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
    ;[arr[i + 1], arr[right]] = [arr[right], arr[i + 1]]
    return i + 1
  }

  quickSelect(0, arr.length - 1)
  return arr.slice(0, k)
}

// 方法二：大顶堆 O(n log k)
function getLeastNumbers(arr, k) {
  if (k === 0) return []
  // 维护大小为 k 的大顶堆
  const heap = arr.slice(0, k)
  buildMaxHeap(heap)
  for (let i = k; i < arr.length; i++) {
    if (arr[i] < heap[0]) {
      heap[0] = arr[i]
      sinkDown(heap, 0, k)
    }
  }
  return heap
}
\`\`\`

**时间复杂度：** 快速选择平均 O(n)，堆 O(n log k)
**空间复杂度：** 快速选择 O(log n)，堆 O(k)

**追问：** 两种方法如何选择？

**答案：**
| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| 数据量小，一次性处理 | 快速选择 | 平均 O(n)，最快 |
| 数据流（不断有新数据） | 大顶堆 | 支持动态插入 |
| 需要有序结果 | 堆 | 堆排序后即有序 |
| 不能修改原数组 | 堆 | 快速选择会修改原数组 |`,
    tags: ['最小K个数', '快速选择', '堆', '剑指Offer']
  },
  {
    id: 788,
    title: '字符串解码（栈 + 递归）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## 字符串解码

**题目描述：**
给定一个编码字符串 \`s\`，规则为 \`k[encoded_string]\`，表示 \`encoded_string\` 重复 \`k\` 次。可以嵌套。

**示例：**
- 输入：\`"3[a]2[bc]"\`
- 输出：\`"aaabcbc"\`
- 输入：\`"3[a2[c]]"\`
- 输出：\`"accaccacc"\`
- 输入：\`"2[abc]3[cd]ef"\`
- 输出：\`"abcabccdcdcdef"\`

**约束条件：**
- \`1 <= s.length <= 30\`
- 数字范围 \`[1, 300]\`
- 输入保证合法

### 代码实现

\`\`\`javascript
// 方法一：栈
function decodeString(s) {
  const numStack = []
  const strStack = []
  let currentStr = ''
  let currentNum = 0

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      currentNum = currentNum * 10 + parseInt(ch)
    } else if (ch === '[') {
      numStack.push(currentNum)
      strStack.push(currentStr)
      currentNum = 0
      currentStr = ''
    } else if (ch === ']') {
      const num = numStack.pop()
      const prevStr = strStack.pop()
      currentStr = prevStr + currentStr.repeat(num)
    } else {
      currentStr += ch
    }
  }
  return currentStr
}

// 方法二：递归
function decodeString(s) {
  let i = 0
  function decode() {
    let result = ''
    while (i < s.length && s[i] !== ']') {
      if (s[i] >= '0' && s[i] <= '9') {
        let num = 0
        while (s[i] >= '0' && s[i] <= '9') {
          num = num * 10 + parseInt(s[i++])
        }
        i++ // 跳过 '['
        const inner = decode()
        i++ // 跳过 ']'
        result += inner.repeat(num)
      } else {
        result += s[i++]
      }
    }
    return result
  }
  return decode()
}
\`\`\`

**时间复杂度：** O(n × maxK)，n 为解码后字符串长度
**空间复杂度：** O(n)

**追问：** 这道题的栈解法思路是什么？

**答案：**
遇到 \`[\` 时，将当前的数字和字符串"压栈保存"，然后重新开始累积。遇到 \`]\` 时，从栈中弹出之前保存的数字和字符串，将当前字符串重复 k 次后拼接到之前的字符串后面。这是"栈保存上下文"的经典模式，类似于函数调用栈。`,
    tags: ['字符串解码', '栈', '递归', 'LeetCode 394']
  },
  {
    id: 789,
    title: '实现 Trie 树的模糊搜索（设计 + DFS）',
    category: '算法实现',
    difficulty: 'hard',
    content: `## 添加与搜索单词（支持通配符的 Trie）

**题目描述：**
设计一个数据结构，支持以下操作：
- \`addWord(word)\` 添加一个单词
- \`search(word)\` 搜索单词，\`.\` 可以匹配任意一个字母

**示例：**
\`\`\`
addWord("bad")
addWord("dad")
addWord("mad")
search("pad") → false
search("bad") → true
search(".ad") → true
search("b..") → true
\`\`\`

**约束条件：**
- \`1 <= word.length <= 25\`
- addWord 中 word 仅包含小写字母
- search 中 word 包含小写字母或 \`.\`

### 代码实现

\`\`\`javascript
class TrieNode {
  constructor() {
    this.children = {}
    this.isEnd = false
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode()
  }

  addWord(word) {
    let node = this.root
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode()
      node = node.children[ch]
    }
    node.isEnd = true
  }

  search(word) {
    return this._dfs(word, 0, this.root)
  }

  _dfs(word, index, node) {
    if (index === word.length) return node.isEnd

    const ch = word[index]
    if (ch === '.') {
      // 通配符：尝试所有子节点
      for (const child of Object.values(node.children)) {
        if (this._dfs(word, index + 1, child)) return true
      }
      return false
    } else {
      if (!node.children[ch]) return false
      return this._dfs(word, index + 1, node.children[ch])
    }
  }
}
\`\`\`

**时间复杂度：**
- addWord: O(n)
- search: 无通配符 O(n)，有通配符最坏 O(26^m × n)，m 为通配符数量

**空间复杂度：** O(总字符数)

**追问：** Trie 树在实际工程中的应用？

**答案：**
1. **搜索引擎自动补全**：输入前缀快速匹配候选词
2. **IDE 代码补全**：VSCode 等编辑器的智能提示
3. **敏感词过滤**：构建敏感词 Trie 进行快速检测
4. **IP 路由表**：网络中的最长前缀匹配（LPM）
5. **拼写检查**：结合编辑距离实现模糊匹配`,
    tags: ['Trie', '通配符搜索', 'DFS', 'LeetCode 211']
  },
  {
    id: 790,
    title: '实现随机化数据结构（O(1) 插入删除获取随机）',
    category: '算法实现',
    difficulty: 'medium',
    content: `## O(1) 时间插入、删除和获取随机元素

**题目描述：**
实现 \`RandomizedSet\` 类：
- \`insert(val)\` 当元素不存在时插入，返回 true
- \`remove(val)\` 当元素存在时移除，返回 true
- \`getRandom()\` 随机返回现有集合中的一项，每个元素被返回的概率相等

所有操作的平均时间复杂度为 O(1)。

**示例：**
\`\`\`
insert(1) → true
remove(2) → false
insert(2) → true
getRandom() → 1 或 2
remove(1) → true
getRandom() → 2
\`\`\`

**约束条件：**
- \`-2^31 <= val <= 2^31 - 1\`
- 最多调用 2 * 10^5 次
- 调用 getRandom 时至少有一个元素

### 解题思路

**数组 + 哈希表**：数组支持 O(1) 随机访问，哈希表支持 O(1) 查找。删除时将要删除的元素与数组末尾元素交换，然后 pop，保持 O(1)。

### 代码实现

\`\`\`javascript
class RandomizedSet {
  constructor() {
    this.list = []           // 存储元素
    this.map = new Map()     // 值 → 在 list 中的索引
  }

  insert(val) {
    if (this.map.has(val)) return false
    this.list.push(val)
    this.map.set(val, this.list.length - 1)
    return true
  }

  remove(val) {
    if (!this.map.has(val)) return false
    const idx = this.map.get(val)
    const lastVal = this.list[this.list.length - 1]

    // 将末尾元素移到被删除元素的位置
    this.list[idx] = lastVal
    this.map.set(lastVal, idx)

    // 删除末尾
    this.list.pop()
    this.map.delete(val)
    return true
  }

  getRandom() {
    const randomIdx = Math.floor(Math.random() * this.list.length)
    return this.list[randomIdx]
  }
}
\`\`\`

**时间复杂度：** 所有操作均为 O(1)
**空间复杂度：** O(n)

**追问：** 如果允许重复元素怎么办？

**答案：**
LeetCode 381。将 Map 的值改为 Set（存储该值的所有索引）。删除时从 Set 中取一个索引，与末尾交换。需要注意更新末尾元素在 Set 中的索引。

**追问：** "交换到末尾再删除"这个技巧还有哪些应用？

**答案：**
1. **Fisher-Yates 洗牌算法**：随机选一个元素与末尾交换
2. **快速选择算法**：partition 操作中的元素交换
3. **数组中删除元素**：避免移动大量元素的 O(n) 操作`,
    tags: ['随机化数据结构', '数组+哈希表', '设计', 'LeetCode 380']
  },
]
