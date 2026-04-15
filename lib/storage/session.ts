import type { InterviewType, Difficulty, AIProviderName, Feedback, SessionSummary } from '../ai/types'
import type { Question } from '../questions/index'

export type SessionPhase =
  | 'SETUP'
  | 'INTRO'
  | 'QUESTION_ASKED'
  | 'USER_ANSWERING'
  | 'FETCHING_FEEDBACK'
  | 'FOLLOW_UP'
  | 'NEXT_QUESTION'
  | 'GENERATING_REPORT'
  | 'SESSION_COMPLETE'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  isFollowUp?: boolean
  isStreaming?: boolean
}

export interface AnswerRecord {
  questionId: string
  questionText: string
  userAnswer: string
  codeAnswer?: string
  feedback?: Feedback
}

export interface SessionConfig {
  sessionId: string
  interviewType: InterviewType
  difficulty: Difficulty
  provider: AIProviderName
  questionCount: number
}

export interface SessionData {
  config: SessionConfig
  phase: SessionPhase
  messages: ChatMessage[]
  questions: Question[]
  currentQuestionIndex: number
  answers: AnswerRecord[]
  summary?: SessionSummary
}

const ACTIVE_SESSION_KEY = 'interview_active_session'
const HISTORY_KEY = 'interview_history'
const MAX_HISTORY = 10

export function saveActiveSession(data: SessionData): void {
  try {
    sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(data))
  } catch {
    // sessionStorage not available (SSR)
  }
}

export function loadActiveSession(): SessionData | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionData) : null
  } catch {
    return null
  }
}

export function clearActiveSession(): void {
  try {
    sessionStorage.removeItem(ACTIVE_SESSION_KEY)
  } catch {
    // noop
  }
}

export interface CompletedSession {
  sessionId: string
  date: string
  interviewType: InterviewType
  difficulty: Difficulty
  provider: AIProviderName
  questionCount: number
  overallScore: number
  summary: SessionSummary
  answers: AnswerRecord[]
}

export function saveCompletedSession(session: CompletedSession): void {
  try {
    const existing = getCompletedSessions()
    const updated = [session, ...existing].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  } catch {
    // noop
  }
}

export function getCompletedSessions(): CompletedSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as CompletedSession[]) : []
  } catch {
    return []
  }
}

export function getCompletedSession(sessionId: string): CompletedSession | null {
  return getCompletedSessions().find((s) => s.sessionId === sessionId) ?? null
}
