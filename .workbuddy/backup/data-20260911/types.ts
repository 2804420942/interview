export interface Question {
  id: number
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  tags: string[]
}
