'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInterviewContext } from '@/context/InterviewContext'
import type { SessionConfig } from '@/lib/storage/session'
import { selectQuestions } from '@/lib/questions/index'
import { saveCompletedSession } from '@/lib/storage/session'
import type { AnswerForSummary } from '@/lib/ai/types'

export function useInterview() {
  const ctx = useInterviewContext()
  const router = useRouter()
  const followUpIndexRef = useRef(0)
  const pendingFollowUpsRef = useRef<string[]>([])

  /**
   * Start a new interview session: select questions, send intro message.
   */
  const startSession = useCallback(
    async (config: SessionConfig) => {
      ctx.setConfig(config)
      const questions = selectQuestions(config.interviewType, config.difficulty, config.questionCount)
      ctx.setQuestions(questions)
      ctx.setPhase('INTRO')

      // Initial greeting — AI introduces itself and asks the first question
      await streamAIMessage(
        [],
        config,
        'Start the interview now. Introduce yourself briefly (1-2 sentences), then ask the first interview question. Do NOT wait for a response.'
      )
      ctx.setPhase('QUESTION_ASKED')
    },
    [ctx]
  )

  /**
   * User submits an answer (text + optional code).
   */
  const submitAnswer = useCallback(
    async (userText: string, codeAnswer?: string) => {
      if (!ctx.config || ctx.questions.length === 0) return

      const currentQuestion = ctx.questions[ctx.currentQuestionIndex]
      const fullAnswer = codeAnswer
        ? `${userText}\n\n\`\`\`\n${codeAnswer}\n\`\`\``
        : userText

      // Add user message to chat
      ctx.addMessage({ role: 'user', content: userText })

      // Record the answer
      ctx.addAnswer({
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        userAnswer: fullAnswer,
        codeAnswer,
      })

      ctx.setPhase('FETCHING_FEEDBACK')
      ctx.setIsAIThinking(true)

      try {
        // Fetch AI feedback (non-streaming)
        const feedbackRes = await fetch('/api/interview/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: ctx.provider,
            question: currentQuestion.question,
            answer: fullAnswer,
            interviewType: ctx.config.interviewType,
          }),
        })

        if (!feedbackRes.ok) throw new Error('Feedback API failed')

        const feedback = await feedbackRes.json()
        ctx.updateLastAnswerFeedback(feedback)

        // Store follow-up questions for the FOLLOW_UP phase
        pendingFollowUpsRef.current = feedback.followUpQuestions ?? []
        followUpIndexRef.current = 0

        ctx.setIsAIThinking(false)

        // AI speaks the verbatim feedback + first follow-up (if any)
        const aiReply = feedback.verbatimFeedback || "Thank you for your answer."
        const hasFollowUp = pendingFollowUpsRef.current.length > 0

        ctx.setPhase('FOLLOW_UP')

        const msgWithFollowUp = hasFollowUp
          ? `${aiReply}\n\n${pendingFollowUpsRef.current[0]}`
          : aiReply

        ctx.addMessage({ role: 'assistant', content: msgWithFollowUp })

        if (hasFollowUp) {
          followUpIndexRef.current = 1
        } else {
          // No follow-ups — move to next question
          await moveToNextQuestion()
        }
      } catch (err) {
        ctx.setIsAIThinking(false)
        ctx.setError('Failed to get feedback. Please continue.')
        ctx.setPhase('QUESTION_ASKED')
      }
    },
    [ctx]
  )

  /**
   * User answers a follow-up question.
   */
  const submitFollowUp = useCallback(
    async (userText: string) => {
      if (!ctx.config) return

      ctx.addMessage({ role: 'user', content: userText })

      // Check if there are more follow-ups
      if (followUpIndexRef.current < pendingFollowUpsRef.current.length) {
        const nextFollowUp = pendingFollowUpsRef.current[followUpIndexRef.current]
        followUpIndexRef.current++
        ctx.addMessage({ role: 'assistant', content: nextFollowUp })
      } else {
        // Done with follow-ups — move to next question
        await moveToNextQuestion()
      }
    },
    [ctx]
  )

  /**
   * Advance to next question or end the session.
   */
  const moveToNextQuestion = useCallback(async () => {
    if (!ctx.config) return

    const isLast = ctx.currentQuestionIndex >= ctx.questions.length - 1

    if (isLast) {
      await endSession()
    } else {
      ctx.advanceQuestion()
      ctx.setPhase('NEXT_QUESTION')

      const nextQuestion = ctx.questions[ctx.currentQuestionIndex + 1]
      await streamAIMessage(
        buildMessageHistory(),
        ctx.config,
        `Now ask question ${ctx.currentQuestionIndex + 2} of ${ctx.config.questionCount}: "${nextQuestion.question}". State it clearly.`
      )
      ctx.setPhase('QUESTION_ASKED')
    }
  }, [ctx])

  /**
   * End the session and generate the summary.
   */
  const endSession = useCallback(async () => {
    if (!ctx.config) return

    ctx.setPhase('GENERATING_REPORT')
    ctx.addMessage({
      role: 'assistant',
      content: "That concludes our interview. Thank you for your time! I'm generating your feedback report now...",
    })

    ctx.setIsAIThinking(true)

    try {
      const answersForSummary: AnswerForSummary[] = ctx.answers.map((a) => ({
        questionText: a.questionText,
        userAnswer: a.userAnswer,
        overallScore: a.feedback?.overallScore ?? 3,
        improvements: a.feedback?.improvements ?? [],
      }))

      const summaryRes = await fetch('/api/session/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: ctx.provider,
          answers: answersForSummary,
        }),
      })

      if (!summaryRes.ok) throw new Error('Summary API failed')

      const summary = await summaryRes.json()
      ctx.setSummary(summary)

      // Persist to history
      if (ctx.config) {
        saveCompletedSession({
          sessionId: ctx.config.sessionId,
          date: new Date().toISOString(),
          interviewType: ctx.config.interviewType,
          difficulty: ctx.config.difficulty,
          provider: ctx.config.provider,
          questionCount: ctx.config.questionCount,
          overallScore: summary.overallScore,
          summary,
          answers: ctx.answers,
        })
      }
    } catch {
      ctx.setError('Failed to generate summary.')
    } finally {
      ctx.setIsAIThinking(false)
      ctx.setPhase('SESSION_COMPLETE')
      router.push(`/interview/results/${ctx.config?.sessionId}`)
    }
  }, [ctx, router])

  /**
   * Build the conversation history for the AI.
   */
  const buildMessageHistory = useCallback(() => {
    return ctx.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  }, [ctx.messages])

  /**
   * Stream an AI message and append it to the chat.
   */
  const streamAIMessage = useCallback(
    async (
      history: { role: 'user' | 'assistant'; content: string }[],
      config: SessionConfig,
      userInstruction?: string
    ) => {
      if (!config) return

      const messages = userInstruction
        ? [...history, { role: 'user' as const, content: userInstruction }]
        : history

      ctx.setIsAIThinking(true)

      // Add placeholder message
      ctx.addMessage({ role: 'assistant', content: '', isStreaming: true })

      try {
        const res = await fetch('/api/interview/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: ctx.provider,
            messages,
            interviewType: config.interviewType,
            difficulty: config.difficulty,
            totalQuestions: config.questionCount,
          }),
        })

        if (!res.ok || !res.body) throw new Error('Stream failed')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          ctx.updateLastMessage(accumulated)
        }

        ctx.updateLastMessage(accumulated, true)
      } catch (err) {
        ctx.updateLastMessage('I apologize, there was a connection issue. Please try again.', true)
        ctx.setError('AI connection failed. Check your API keys.')
      } finally {
        ctx.setIsAIThinking(false)
      }
    },
    [ctx]
  )

  return {
    ...ctx,
    startSession,
    submitAnswer,
    submitFollowUp,
    endSession,
  }
}
