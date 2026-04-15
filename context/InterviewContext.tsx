'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import type { AIProviderName, Feedback, SessionSummary } from '@/lib/ai/types'
import type { Question } from '@/lib/questions/index'
import type {
  SessionPhase,
  ChatMessage,
  AnswerRecord,
  SessionConfig,
} from '@/lib/storage/session'

interface InterviewState {
  config: SessionConfig | null
  phase: SessionPhase
  messages: ChatMessage[]
  questions: Question[]
  currentQuestionIndex: number
  answers: AnswerRecord[]
  summary: SessionSummary | null
  isAIThinking: boolean
  isSpeaking: boolean
  error: string | null
}

interface InterviewContextValue extends InterviewState {
  setConfig: (config: SessionConfig) => void
  setPhase: (phase: SessionPhase) => void
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage
  updateLastMessage: (content: string, done?: boolean) => void
  setQuestions: (questions: Question[]) => void
  advanceQuestion: () => void
  addAnswer: (answer: AnswerRecord) => void
  updateLastAnswerFeedback: (feedback: Feedback) => void
  setSummary: (summary: SessionSummary) => void
  setIsAIThinking: (v: boolean) => void
  setIsSpeaking: (v: boolean) => void
  setError: (msg: string | null) => void
  reset: () => void
  provider: AIProviderName
  setProvider: (p: AIProviderName) => void
}

const defaultState: InterviewState = {
  config: null,
  phase: 'SETUP',
  messages: [],
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  summary: null,
  isAIThinking: false,
  isSpeaking: false,
  error: null,
}

const InterviewContext = createContext<InterviewContextValue | null>(null)

export function InterviewProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InterviewState>(defaultState)
  const [provider, setProvider] = useState<AIProviderName>('claude')
  const idCounter = useRef(0)

  const nextId = () => `msg-${++idCounter.current}-${Date.now()}`

  const setConfig = useCallback((config: SessionConfig) => {
    setState((s) => ({ ...s, config }))
  }, [])

  const setPhase = useCallback((phase: SessionPhase) => {
    setState((s) => ({ ...s, phase }))
  }, [])

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const full: ChatMessage = { ...msg, id: nextId(), timestamp: Date.now() }
    setState((s) => ({ ...s, messages: [...s.messages, full] }))
    return full
  }, [])

  const updateLastMessage = useCallback((content: string, done = false) => {
    setState((s) => {
      const msgs = [...s.messages]
      if (msgs.length === 0) return s
      const last = { ...msgs[msgs.length - 1], content, isStreaming: !done }
      msgs[msgs.length - 1] = last
      return { ...s, messages: msgs }
    })
  }, [])

  const setQuestions = useCallback((questions: Question[]) => {
    setState((s) => ({ ...s, questions }))
  }, [])

  const advanceQuestion = useCallback(() => {
    setState((s) => ({
      ...s,
      currentQuestionIndex: s.currentQuestionIndex + 1,
    }))
  }, [])

  const addAnswer = useCallback((answer: AnswerRecord) => {
    setState((s) => ({ ...s, answers: [...s.answers, answer] }))
  }, [])

  const updateLastAnswerFeedback = useCallback((feedback: Feedback) => {
    setState((s) => {
      const answers = [...s.answers]
      if (answers.length === 0) return s
      answers[answers.length - 1] = { ...answers[answers.length - 1], feedback }
      return { ...s, answers }
    })
  }, [])

  const setSummary = useCallback((summary: SessionSummary) => {
    setState((s) => ({ ...s, summary }))
  }, [])

  const setIsAIThinking = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isAIThinking: v }))
  }, [])

  const setIsSpeaking = useCallback((v: boolean) => {
    setState((s) => ({ ...s, isSpeaking: v }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((s) => ({ ...s, error }))
  }, [])

  const reset = useCallback(() => {
    setState(defaultState)
  }, [])

  return (
    <InterviewContext.Provider
      value={{
        ...state,
        setConfig,
        setPhase,
        addMessage,
        updateLastMessage,
        setQuestions,
        advanceQuestion,
        addAnswer,
        updateLastAnswerFeedback,
        setSummary,
        setIsAIThinking,
        setIsSpeaking,
        setError,
        reset,
        provider,
        setProvider,
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterviewContext() {
  const ctx = useContext(InterviewContext)
  if (!ctx) throw new Error('useInterviewContext must be used inside InterviewProvider')
  return ctx
}
