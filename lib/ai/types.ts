export type InterviewType = 'BEHAVIORAL' | 'TECHNICAL' | 'SYSTEM_DESIGN'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type AIProviderName = 'claude' | 'openai'

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface RubricItem {
  score: number
  comment: string
}

export interface Feedback {
  rubric: {
    clarity: RubricItem
    depth: RubricItem
    relevance: RubricItem
    structure: RubricItem
    technicalAccuracy: RubricItem
  }
  overallScore: number
  idealAnswer: string
  strengths: string[]
  improvements: string[]
  followUpQuestions: string[]
  verbatimFeedback: string
}

export interface SessionSummary {
  overallScore: number
  summary: string
  topStrengths: string[]
  topImprovements: string[]
  recommendedResources: {
    title: string
    type: 'article' | 'book' | 'leetcode' | 'video'
    url?: string
  }[]
  readinessLevel: 'Not Ready' | 'Developing' | 'Interview Ready' | 'Strong Candidate'
  nextSteps: string
}

export interface AIProvider {
  streamMessage(messages: AIMessage[], system: string): AsyncIterable<string>
  generateFeedback(question: string, answer: string, type: InterviewType): Promise<Feedback>
  generateSummary(answers: AnswerForSummary[]): Promise<SessionSummary>
}

export interface AnswerForSummary {
  questionText: string
  userAnswer: string
  overallScore: number
  improvements: string[]
}
