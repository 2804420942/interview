export type { Question } from './types'
export { htmlCssQuestions } from './htmlcss-questions'
export { javascriptQuestions } from './javascript-questions'
export { typescriptQuestions } from './typescript-questions'
export { vueQuestions } from './vue-questions'
export { browserNetworkQuestions } from './browser-network-questions'
export { engineeringQuestions } from './engineering-questions'
export { performanceQuestions } from './performance-questions'
export { algorithmQuestions } from './algorithm-questions'
export { algorithmQuestions2 } from './algorithm-questions-2'
export { designPatternQuestions } from './design-pattern-questions'
export { experienceQuestions } from './experience-questions'
export { scenarioQuestions } from './scenario-questions'
export { resumeDeepQuestions } from './resume-deep-questions'
export { resumeDeepQuestions2 } from './resume-deep-questions-2'
export { resumeDeepQuestions3 } from './resume-deep-questions-3'
export { aiQuestions } from './ai-questions'
export { agentQuestions } from './agent-questions'
export { agentQuestions2 } from './agent-questions-2'
export { nowcoderQuestions } from './nowcoder-questions'
export { scaffoldProjectQuestions } from './scaffold-project-questions'
export { scaffoldStarQuestions } from './scaffold-star-questions'
export { qqSportQuestions } from './qq-sport-questions'
export { qqSportDeepQuestions } from './qq-sport-deep-questions'
export { techBlogQuestions } from './tech-blog-questions'

import type { Question } from './types'
import { htmlCssQuestions } from './htmlcss-questions'
import { javascriptQuestions } from './javascript-questions'
import { typescriptQuestions } from './typescript-questions'
import { vueQuestions } from './vue-questions'
import { browserNetworkQuestions } from './browser-network-questions'
import { engineeringQuestions } from './engineering-questions'
import { performanceQuestions } from './performance-questions'
import { algorithmQuestions } from './algorithm-questions'
import { algorithmQuestions2 } from './algorithm-questions-2'
import { designPatternQuestions } from './design-pattern-questions'
import { experienceQuestions } from './experience-questions'
import { scenarioQuestions } from './scenario-questions'
import { resumeDeepQuestions } from './resume-deep-questions'
import { resumeDeepQuestions2 } from './resume-deep-questions-2'
import { resumeDeepQuestions3 } from './resume-deep-questions-3'
import { aiQuestions } from './ai-questions'
import { agentQuestions } from './agent-questions'
import { agentQuestions2 } from './agent-questions-2'
import { nowcoderQuestions } from './nowcoder-questions'
import { scaffoldProjectQuestions } from './scaffold-project-questions'
import { scaffoldStarQuestions } from './scaffold-star-questions'
import { qqSportQuestions } from './qq-sport-questions'
import { qqSportDeepQuestions } from './qq-sport-deep-questions'
import { techBlogQuestions } from './tech-blog-questions'

/** 深度剖析题目的 id 集合（用于去重） */
const deepQuestionIds = new Set(qqSportDeepQuestions.map(q => q.id))

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
  ...algorithmQuestions2,
  ...designPatternQuestions,
  ...experienceQuestions,
  ...scenarioQuestions,
  ...resumeDeepQuestions,
  ...resumeDeepQuestions2,
  ...resumeDeepQuestions3,
  ...aiQuestions,
  ...agentQuestions,
  ...agentQuestions2,
  ...nowcoderQuestions,
  ...scaffoldProjectQuestions,
  ...qqSportQuestions.filter(q => !deepQuestionIds.has(q.id)),
  ...qqSportDeepQuestions,
  ...techBlogQuestions,
  ...scaffoldStarQuestions,
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
const QUESTIONS_CACHE_VERSION_KEY = 'interview_questions_cache_version'

/**
 * 数据版本号 - 当数据结构有重要变更（如题目分类调整）时升级此版本号
 * 升级后会自动让用户的旧缓存失效，强制读取最新的本地数据
 *
 * v1.0.1 (2026-05-27): 调整STAR法则面试题(id=916)分类为"面试项目"
 * v1.0.2 (2026-06-12): 新增前端脚手架项目STAR法则讲述(id=1410)，归入"面试项目"分类
 * v1.0.3 (2026-09-11): 修复题目内容里过度转义的反引号（\`\`\` -> ```），代码块此前无法正常渲染
 * v1.0.4 (2026-09-14): 新增"Agent应用"分类题目（id 1500-1517），涵盖 LangChain / LangGraph / RAG / MCP / AI 场景题，面向前端转 Agent 开发方向
 * v1.0.5 (2026-09-14): 新增 Agent 应用题目第二集（id 1600+）及牛客网面经分类，基于字节/阿里/腾讯/拼多多等大厂真实面经整理
 * v1.0.6 (2026-09-14): 新增"牛客面经"分类（id 2000+），大厂真实面经题目，含前端基础、高阶、AI/Agent 系列
 */
const DATA_VERSION = 'v1.0.6'

/**
 * 从 localStorage 读取缓存的题目数据
 * @returns 缓存的题目数组，如果没有缓存或版本不匹配则返回 null
 */
export function getCachedQuestions(): Question[] | null {
  try {
    // 校验版本号，版本不匹配则丢弃缓存
    const cachedVersion = localStorage.getItem(QUESTIONS_CACHE_VERSION_KEY)
    if (cachedVersion !== DATA_VERSION) {
      console.log(`🔄 [缓存版本不匹配] 旧版本: ${cachedVersion || '无'}, 新版本: ${DATA_VERSION}，将丢弃旧缓存`)
      localStorage.removeItem(QUESTIONS_CACHE_KEY)
      localStorage.removeItem(QUESTIONS_CACHE_TIME_KEY)
      return null
    }

    const cached = localStorage.getItem(QUESTIONS_CACHE_KEY)
    if (!cached) return null
    const parsed = JSON.parse(cached)
    if (Array.isArray(parsed) && parsed.length > 0) {
      const cacheTime = localStorage.getItem(QUESTIONS_CACHE_TIME_KEY)
      console.log(`📦 [缓存命中] 从 localStorage 读取 ${parsed.length} 道题目（缓存时间: ${cacheTime || '未知'}, 版本: ${DATA_VERSION}）`)
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
    localStorage.setItem(QUESTIONS_CACHE_VERSION_KEY, DATA_VERSION)
    console.log(`💾 [缓存更新] 已将 ${questions.length} 道题目写入 localStorage（版本: ${DATA_VERSION}）`)
  } catch (e) {
    console.warn('⚠️ 写入题目缓存失败:', (e as Error).message)
  }
}