import type { Question } from './types'
import { techBlogContent } from './tech-blog-content'

/** 技术博客题目（独立分类，放在最后） */
export const techBlogQuestions: Question[] = [
  {
    id: 1400,
    title: '三大核心项目技术深度剖析：面试实战问答录（QQ运动Node + Kuikly + 脚手架）',
    category: '面试项目',
    difficulty: 'hard',
    content: techBlogContent,
    tags: [
      'Node.js', 'BFF', 'SSR', 'TRPC', 'GPS轨迹', '全链路监控', '性能优化',
      'Kuikly', 'Kotlin Multiplatform', 'NTCompose', '跨端开发', '响应式编程',
      '脚手架', 'Lerna', 'Monorepo', 'CLI', 'commander', 'npm',
      'init', 'publish', '云构建', 'WebSocket', 'create命令', 'skill系统',
      '面试博客', '项目总结'
    ],
  },
]
