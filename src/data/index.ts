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

/** 所有题目合并 */
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
]