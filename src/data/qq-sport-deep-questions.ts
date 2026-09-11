import type { Question } from './types'
import { qqSportNodeContent } from './qq-sport-node-content'
import { qqSportKuiklyContent } from './qq-sport-kuikly-content'

/** QQ运动深度剖析题目（独立文件存储，避免单文件过大） */
export const qqSportDeepQuestions: Question[] = [
  {
    id: 1352,
    title: 'QQ运动Node项目解析',
    category: 'QQ运动',
    difficulty: 'hard',
    content: qqSportNodeContent,
    tags: ['Node.js', 'BFF', 'SSR', 'TRPC', 'GPS轨迹', '全链路监控', '性能优化', 'CI/CD', '工程化', 'PM2', 'Koa', 'Vue3', 'Vite'],
  },
  {
    id: 1353,
    title: 'QQ运动 Kuikly项目解析',
    category: 'QQ运动',
    difficulty: 'hard',
    content: qqSportKuiklyContent,
    tags: ['Kuikly', 'Kotlin Multiplatform', 'NTCompose', '跨端开发', '响应式编程'],
  },
]
