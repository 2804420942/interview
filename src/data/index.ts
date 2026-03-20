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
export { scaffoldProjectQuestions } from './scaffold-project-questions'
export { qqSportQuestions } from './qq-sport-questions'

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
import { scaffoldProjectQuestions } from './scaffold-project-questions'
import { qqSportQuestions } from './qq-sport-questions'

/** 所有题目合并（本地数据源） */
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
  ...scaffoldProjectQuestions,
  ...qqSportQuestions,
]

/**
 * 加载本地 JS 题目数据（同步，从打包的模块中获取）
 * 不再从远程 OSS 加载，所有数据来源于本地 JS 文件
 * @returns 加载结果：题目数组
 */
export function loadLocalQuestions(): Question[] {
  console.log(`📦 [本地加载] 从本地 JS 文件加载 ${allQuestions.length} 道题目`)
  return allQuestions
}

/** localStorage 缓存 key */
const QUESTIONS_CACHE_KEY = 'interview_questions_cache'
const QUESTIONS_CACHE_TIME_KEY = 'interview_questions_cache_time'

/**
 * 从 localStorage 读取缓存的题目数据
 * @returns 缓存的题目数组，如果没有缓存则返回 null
 */
export function getCachedQuestions(): Question[] | null {
  try {
    const cached = localStorage.getItem(QUESTIONS_CACHE_KEY)
    if (!cached) return null
    const parsed = JSON.parse(cached)
    if (Array.isArray(parsed) && parsed.length > 0) {
      const cacheTime = localStorage.getItem(QUESTIONS_CACHE_TIME_KEY)
      console.log(`📦 [缓存命中] 从 localStorage 读取 ${parsed.length} 道题目（缓存时间: ${cacheTime || '未知'}）`)
      return parsed as Question[]
    }
    return null
  } catch (e) {
    console.warn('⚠️ 读取题目缓存失败:', (e as Error).message)
    return null
  }
}

/**
 * 将题目数据写入 localStorage 缓存
 * @param questions 要缓存的题目数组
 */
export function saveCachedQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(questions))
    localStorage.setItem(QUESTIONS_CACHE_TIME_KEY, new Date().toLocaleString('zh-CN'))
    console.log(`💾 [缓存更新] 已将 ${questions.length} 道题目写入 localStorage`)
  } catch (e) {
    console.warn('⚠️ 写入题目缓存失败:', (e as Error).message)
  }
}