export type { Question } from './types'
export { htmlCssQuestions } from './htmlcss-questions'
export { javascriptQuestions } from './javascript-questions'
export { typescriptQuestions } from './typescript-questions'
export { vueQuestions } from './vue-questions'
export { browserNetworkQuestions } from './browser-network-questions'
export { engineeringQuestions } from './engineering-questions'
export { performanceQuestions } from './performance-questions'
export { algorithmQuestions } from './algorithm-questions'
export { designPatternQuestions } from './design-pattern-questions'
export { experienceQuestions } from './experience-questions'
export { scenarioQuestions } from './scenario-questions'
export { resumeDeepQuestions } from './resume-deep-questions'
export { resumeDeepQuestions2 } from './resume-deep-questions-2'
export { resumeDeepQuestions3 } from './resume-deep-questions-3'
export { aiQuestions } from './ai-questions'

import type { Question } from './types'
import { htmlCssQuestions } from './htmlcss-questions'
import { javascriptQuestions } from './javascript-questions'
import { typescriptQuestions } from './typescript-questions'
import { vueQuestions } from './vue-questions'
import { browserNetworkQuestions } from './browser-network-questions'
import { engineeringQuestions } from './engineering-questions'
import { performanceQuestions } from './performance-questions'
import { algorithmQuestions } from './algorithm-questions'
import { designPatternQuestions } from './design-pattern-questions'
import { experienceQuestions } from './experience-questions'
import { scenarioQuestions } from './scenario-questions'
import { resumeDeepQuestions } from './resume-deep-questions'
import { resumeDeepQuestions2 } from './resume-deep-questions-2'
import { resumeDeepQuestions3 } from './resume-deep-questions-3'
import { aiQuestions } from './ai-questions'

/** 所有题目合并（本地兜底数据） */
export const allQuestions: Question[] = [
  ...htmlCssQuestions,
  ...javascriptQuestions,
  ...typescriptQuestions,
  ...vueQuestions,
  ...browserNetworkQuestions,
  ...engineeringQuestions,
  ...performanceQuestions,
  ...algorithmQuestions,
  ...designPatternQuestions,
  ...experienceQuestions,
  ...scenarioQuestions,
  ...resumeDeepQuestions,
  ...resumeDeepQuestions2,
  ...resumeDeepQuestions3,
  ...aiQuestions,
]

/** OSS 存储桶基础 URL：开发环境走 Vite 代理绕过 CORS，生产环境直接访问 OSS */
const OSS_BASE_URL = import.meta.env.DEV
  ? '/oss-data'
  : 'https://interview-alic.oss-cn-guangzhou.aliyuncs.com/data'

/** 数据源配置：每个分类对应的 OSS 文件名和本地兜底数据 */
const dataSourceMap: { fileName: string; localData: Question[] }[] = [
  { fileName: 'htmlcss-questions.ts', localData: htmlCssQuestions },
  { fileName: 'javascript-questions.ts', localData: javascriptQuestions },
  { fileName: 'typescript-questions.ts', localData: typescriptQuestions },
  { fileName: 'vue-questions.ts', localData: vueQuestions },
  { fileName: 'browser-network-questions.ts', localData: browserNetworkQuestions },
  { fileName: 'engineering-questions.ts', localData: engineeringQuestions },
  { fileName: 'performance-questions.ts', localData: performanceQuestions },
  { fileName: 'algorithm-questions.ts', localData: algorithmQuestions },
  { fileName: 'design-pattern-questions.ts', localData: designPatternQuestions },
  { fileName: 'experience-questions.ts', localData: experienceQuestions },
  { fileName: 'scenario-questions.ts', localData: scenarioQuestions },
  { fileName: 'resume-deep-questions.ts', localData: resumeDeepQuestions },
  { fileName: 'resume-deep-questions-2.ts', localData: resumeDeepQuestions2 },
  { fileName: 'resume-deep-questions-3.ts', localData: resumeDeepQuestions3 },
  { fileName: 'ai-questions.ts', localData: aiQuestions },
]

/**
 * 从 TypeScript 源文件文本中提取 Question 数组数据
 * TS 文件格式为: export const xxxQuestions: Question[] = [ ... ]
 */
function parseTsFileContent(text: string): Question[] {
  // 找到赋值数组的起始位置：匹配 `= [` 模式，跳过类型注解中的 `[]`（如 `Question[]`）
  const assignMatch = text.match(/=\s*\[/)
  if (!assignMatch || assignMatch.index === undefined) throw new Error('No array assignment found')
  const startIdx = text.indexOf('[', assignMatch.index)
  if (startIdx === -1) throw new Error('No array found')

  // 从后往前找到数组的结束位置：最后一个 ']'
  const endIdx = text.lastIndexOf(']')
  if (endIdx === -1 || endIdx <= startIdx) throw new Error('No array end found')

  let arrStr = text.substring(startIdx, endIdx + 1)

  // 处理 TS 文件中的模板字符串（反引号 `` ）：转为普通 JSON 字符串
  // 先处理反引号字符串：将 `...` 替换为 "..."，同时转义内部的双引号和换行
  let i = 0
  let inSingleQuote = false
  let inDoubleQuote = false
  let inBacktick = false
  let current = ''

  while (i < arrStr.length) {
    const ch = arrStr[i]

    if (!inSingleQuote && !inDoubleQuote && !inBacktick) {
      if (ch === '`') {
        inBacktick = true
        current += '"'
        i++
        continue
      } else if (ch === "'") {
        inSingleQuote = true
        current += '"'
        i++
        continue
      } else if (ch === '"') {
        inDoubleQuote = true
        current += '"'
        i++
        continue
      }
    } else if (inBacktick) {
      if (ch === '`') {
        inBacktick = false
        current += '"'
        i++
        continue
      } else if (ch === '"') {
        current += '\\"'
        i++
        continue
      } else if (ch === '\n') {
        current += '\\n'
        i++
        continue
      } else if (ch === '\r') {
        i++
        continue
      } else if (ch === '\\') {
        // Handle escape sequences inside backtick strings
        if (i + 1 < arrStr.length) {
          const next = arrStr[i + 1]
          if (next === '`') {
            // \` -> literal backtick
            current += '`'
            i += 2
            continue
          } else if (next === '\\') {
            // \\ -> literal backslash (escaped for JSON)
            current += '\\\\'
            i += 2
            continue
          } else if (next === 'n') {
            // \n -> newline (already in JSON escape form)
            current += '\\n'
            i += 2
            continue
          } else if (next === 't') {
            // \t -> tab
            current += '\\t'
            i += 2
            continue
          } else if (next === 'r') {
            // \r -> carriage return
            current += '\\r'
            i += 2
            continue
          } else if (next === '$') {
            // \$ -> literal $ (template literal escape)
            current += '$'
            i += 2
            continue
          } else if (next === '"') {
            // \" -> escaped double quote for JSON
            current += '\\"'
            i += 2
            continue
          } else {
            // Other escape sequences: output the escaped char as-is
            current += next
            i += 2
            continue
          }
        }
        // Lone backslash at end of string
        current += '\\\\'
        i++
        continue
      }
    } else if (inSingleQuote) {
      if (ch === '\\' && i + 1 < arrStr.length) {
        const next = arrStr[i + 1]
        if (next === "'") {
          // \' in single quote -> just output '
          current += "'"
          i += 2
          continue
        } else if (next === '\\') {
          current += '\\\\'
          i += 2
          continue
        } else if (next === 'n') {
          current += '\\n'
          i += 2
          continue
        } else if (next === 't') {
          current += '\\t'
          i += 2
          continue
        } else if (next === '"') {
          current += '\\"'
          i += 2
          continue
        } else {
          // Other escapes: keep as-is for JSON
          current += next
          i += 2
          continue
        }
      } else if (ch === "'") {
        inSingleQuote = false
        current += '"'
        i++
        continue
      } else if (ch === '"') {
        current += '\\"'
        i++
        continue
      }
    } else if (inDoubleQuote) {
      if (ch === '\\' && i + 1 < arrStr.length) {
        const next = arrStr[i + 1]
        // Pass through escape sequences as-is (they are already valid JSON escapes)
        current += ch + next
        i += 2
        continue
      } else if (ch === '"') {
        inDoubleQuote = false
        current += '"'
        i++
        continue
      }
    }

    current += ch
    i++
  }

  arrStr = current

  // 移除 TS 行注释 (// ...)
  // 需要小心不要误删字符串内容中的 //
  // 只删除不在引号内的行注释
  {
    let cleaned = ''
    let inStr = false
    let strChar = ''
    for (let j = 0; j < arrStr.length; j++) {
      const c = arrStr[j]
      if (inStr) {
        cleaned += c
        if (c === '\\' && j + 1 < arrStr.length) {
          cleaned += arrStr[j + 1]
          j++
        } else if (c === strChar) {
          inStr = false
        }
      } else {
        if (c === '"') {
          inStr = true
          strChar = '"'
          cleaned += c
        } else if (c === '/' && j + 1 < arrStr.length && arrStr[j + 1] === '/') {
          // Skip until end of line
          while (j < arrStr.length && arrStr[j] !== '\n') j++
          if (j < arrStr.length) cleaned += '\n'
        } else {
          cleaned += c
        }
      }
    }
    arrStr = cleaned
  }

  // 移除尾随逗号 (JSON 不允许)
  arrStr = arrStr.replace(/,(\s*[\]}])/g, '$1')

  // 将裸属性名加上双引号（TS/JS 对象属性名不需要引号，但 JSON 需要）
  // 使用状态机方式，确保不会修改字符串内部的内容
  {
    let result = ''
    let inString = false
    let j = 0
    while (j < arrStr.length) {
      const c = arrStr[j]
      if (inString) {
        result += c
        if (c === '\\' && j + 1 < arrStr.length) {
          result += arrStr[j + 1]
          j += 2
        } else if (c === '"') {
          inString = false
          j++
        } else {
          j++
        }
      } else if (c === '"') {
        inString = true
        result += c
        j++
      } else if (/[a-zA-Z_$]/.test(c)) {
        // 可能是一个裸属性名，收集整个标识符
        let ident = c
        let k = j + 1
        while (k < arrStr.length && /[\w$]/.test(arrStr[k])) {
          ident += arrStr[k]
          k++
        }
        // 检查标识符后面是否跟着冒号（跳过空白）
        let m = k
        while (m < arrStr.length && (arrStr[m] === ' ' || arrStr[m] === '\t')) m++
        if (m < arrStr.length && arrStr[m] === ':') {
          // 这是一个属性名，加上双引号
          result += '"' + ident + '"'
          j = k
        } else {
          // 不是属性名（可能是 true/false/null），直接输出
          result += ident
          j = k
        }
      } else {
        result += c
        j++
      }
    }
    arrStr = result
  }

  try {
    const data = JSON.parse(arrStr)
    if (Array.isArray(data)) return data as Question[]
    throw new Error('Parsed data is not an array')
  } catch (e) {
    // 调试：输出解析失败时的部分内容
    console.error('JSON parse failed. First 500 chars:', arrStr.substring(0, 500))
    throw new Error(`Failed to parse TS content: ${(e as Error).message}`)
  }
}

/**
 * 从 OSS 加载单个分类的数据，失败则回退到本地
 */
async function fetchCategoryData(
  fileName: string,
  localData: Question[]
): Promise<{ data: Question[]; fromRemote: boolean }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)
  try {
    const url = `${OSS_BASE_URL}/${fileName}`
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const text = await response.text()

    // 检测 OSS 返回的是否是错误页面（XML 格式）而非真正的 TS 文件
    const trimmed = text.trimStart()
    if (trimmed.startsWith('<?xml') || trimmed.startsWith('<Error>') || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
      throw new Error('OSS returned an error page instead of TS file')
    }

    // 验证内容至少包含 export 或 Question 关键字，确保是真正的 TS 文件
    if (!text.includes('export') && !text.includes('[')) {
      throw new Error(`Unexpected content (first 100 chars): ${text.substring(0, 100)}`)
    }

    const data = parseTsFileContent(text)
    if (data.length > 0) {
      return { data, fromRemote: true }
    }
    throw new Error('Empty data')
  } catch (e) {
    clearTimeout(timeoutId)
    console.warn(`⚠️ 远程加载 ${fileName} 失败: ${(e as Error).message}`)
    // 请求失败，使用本地兜底数据
    return { data: localData, fromRemote: false }
  }
}

/**
 * 异步加载所有题目数据
 * 优先从 OSS 存储桶加载，请求失败则使用本地文件兜底
 * @returns 加载结果：题目数组 + 加载来源信息
 */
export async function loadQuestions(): Promise<{
  questions: Question[]
  remoteCount: number
  localCount: number
  totalCategories: number
}> {
  const results = await Promise.all(
    dataSourceMap.map(({ fileName, localData }) =>
      fetchCategoryData(fileName, localData)
    )
  )

  let remoteCount = 0
  let localCount = 0
  const allData: Question[] = []

  results.forEach((result, index) => {
    if (result.fromRemote) {
      remoteCount++
      console.log(`✅ [远程加载] ${dataSourceMap[index].fileName}：${result.data.length} 题`)
    } else {
      localCount++
      console.log(`📦 [本地兜底] ${dataSourceMap[index].fileName}：${result.data.length} 题`)
    }
    allData.push(...result.data)
  })

  console.log(
    `📊 数据加载完成：远程 ${remoteCount}/${dataSourceMap.length} 个分类，` +
    `本地兜底 ${localCount}/${dataSourceMap.length} 个分类，` +
    `共 ${allData.length} 题`
  )

  return {
    questions: allData,
    remoteCount,
    localCount,
    totalCategories: dataSourceMap.length,
  }
}