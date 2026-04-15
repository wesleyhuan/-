import type { InterviewType, Difficulty } from '../ai/types'
import { behavioralQuestions, type Question } from './behavioral'
import { technicalQuestions } from './technical'
import { systemDesignQuestions } from './system-design'

export type { Question }

export const ALL_QUESTIONS: Question[] = [
  ...behavioralQuestions,
  ...technicalQuestions,
  ...systemDesignQuestions,
]

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function selectQuestions(
  type: InterviewType,
  difficulty: Difficulty,
  count: number
): Question[] {
  const pool = ALL_QUESTIONS.filter((q) => q.type === type)

  // Weight by requested difficulty + one level easier
  const weighted = pool.filter((q) => {
    if (q.difficulty === difficulty) return true
    if (difficulty === 'HARD' && q.difficulty === 'MEDIUM') return true
    if (difficulty === 'MEDIUM' && q.difficulty === 'EASY') return true
    return false
  })

  const available = weighted.length >= count ? weighted : pool
  return shuffle(available).slice(0, count)
}
