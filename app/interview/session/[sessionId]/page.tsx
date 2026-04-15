'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Square } from 'lucide-react'
import clsx from 'clsx'
import { useInterview } from '@/hooks/useInterview'
import { useVoice } from '@/hooks/useVoice'
import { ChatInterface } from '@/components/interview/ChatInterface'
import { VoiceControl } from '@/components/interview/VoiceControl'
import { CodeEditor } from '@/components/interview/CodeEditor'
import { FeedbackPanel } from '@/components/interview/FeedbackPanel'

interface Props {
  params: Promise<{ sessionId: string }>
}

export default function SessionPage({ params }: Props) {
  const { sessionId } = use(params)
  const router = useRouter()
  const interview = useInterview()
  const voice = useVoice()

  const [inputText, setInputText] = useState('')
  const [codeValue, setCodeValue] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [mobileTab, setMobileTab] = useState<'chat' | 'code'>('chat')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sessionStartedRef = useRef(false)

  const isCodeQuestion =
    interview.config?.interviewType === 'TECHNICAL' &&
    interview.questions[interview.currentQuestionIndex]?.requiresCode

  const currentQuestion = interview.questions[interview.currentQuestionIndex]
  const lastAnswer = interview.answers[interview.answers.length - 1]
  const hasFeedback = lastAnswer?.feedback != null

  // Start the session on mount
  useEffect(() => {
    if (sessionStartedRef.current) return
    if (!interview.config) {
      router.replace('/interview/setup')
      return
    }
    if (interview.config.sessionId !== sessionId) {
      router.replace('/interview/setup')
      return
    }
    sessionStartedRef.current = true
    interview.startSession(interview.config)
  }, [])

  // Speak AI messages via TTS
  useEffect(() => {
    const lastMsg = interview.messages[interview.messages.length - 1]
    if (lastMsg?.role === 'assistant' && !lastMsg.isStreaming && lastMsg.content) {
      voice.speak(lastMsg.content)
    }
  }, [interview.messages])

  // Commit voice transcript to input field
  const handleTranscriptCommit = useCallback(
    (text: string) => {
      setInputText((prev) => (prev ? prev + ' ' + text : text))
    },
    []
  )

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }, [inputText])

  const canSubmit =
    inputText.trim().length > 0 &&
    !interview.isAIThinking &&
    (interview.phase === 'QUESTION_ASKED' ||
      interview.phase === 'USER_ANSWERING' ||
      interview.phase === 'FOLLOW_UP')

  const handleSubmit = () => {
    if (!canSubmit) return
    const text = inputText.trim()
    setInputText('')
    setShowFeedback(false)

    if (interview.phase === 'FOLLOW_UP' && interview.answers.length > 0) {
      interview.submitFollowUp(text)
    } else {
      const code = isCodeQuestion ? codeValue : undefined
      interview.submitAnswer(text, code).then(() => {
        if (hasFeedback) setShowFeedback(true)
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const phaseLabel: Record<string, string> = {
    INTRO: 'Starting…',
    QUESTION_ASKED: `Q${interview.currentQuestionIndex + 1} of ${interview.config?.questionCount ?? '?'}`,
    USER_ANSWERING: `Q${interview.currentQuestionIndex + 1} of ${interview.config?.questionCount ?? '?'}`,
    FETCHING_FEEDBACK: 'Evaluating…',
    FOLLOW_UP: 'Follow-up',
    NEXT_QUESTION: 'Next question…',
    GENERATING_REPORT: 'Generating report…',
    SESSION_COMPLETE: 'Complete',
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {interview.config?.interviewType?.replace('_', ' ') ?? 'Interview'}
          </span>
          <span className="text-xs text-gray-400">
            {interview.config?.difficulty} · {interview.config?.provider === 'claude' ? 'Claude' : 'GPT-4o'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-full">
            {phaseLabel[interview.phase] ?? interview.phase}
          </span>
          <button
            onClick={() => interview.endSession()}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Square className="w-3 h-3" />
            End
          </button>
        </div>
      </header>

      {/* Mobile tab bar (only for technical) */}
      {isCodeQuestion && (
        <div className="flex md:hidden border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
          {(['chat', 'code'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={clsx(
                'flex-1 py-2 text-xs font-semibold capitalize transition-colors',
                mobileTab === tab
                  ? 'text-brand-600 border-b-2 border-brand-500'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {tab === 'code' ? 'Code Editor' : 'Chat'}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat column */}
        <div
          className={clsx(
            'flex flex-col flex-1 overflow-hidden',
            isCodeQuestion && mobileTab === 'code' ? 'hidden md:flex' : 'flex',
            isCodeQuestion && 'md:w-1/2 md:border-r md:border-gray-200 md:dark:border-gray-700'
          )}
        >
          <ChatInterface messages={interview.messages} isThinking={interview.isAIThinking} />

          {/* Feedback panel */}
          {showFeedback && hasFeedback && lastAnswer.feedback && (
            <div className="px-4 pb-2">
              <FeedbackPanel
                feedback={lastAnswer.feedback}
                questionText={lastAnswer.questionText}
                onClose={() => setShowFeedback(false)}
              />
            </div>
          )}

          {/* Input bar */}
          <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
            {/* Live transcript preview */}
            {voice.isListening && voice.interimTranscript && (
              <div className="mb-2 text-xs text-gray-400 italic px-1">
                🎤 {voice.interimTranscript}
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  interview.isAIThinking
                    ? 'AI is thinking…'
                    : interview.phase === 'FOLLOW_UP'
                    ? 'Answer the follow-up question…'
                    : 'Type your answer… (Enter to send, Shift+Enter for newline)'
                }
                disabled={interview.isAIThinking}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 placeholder:text-gray-400"
              />
              <VoiceControl
                voice={voice}
                onTranscriptCommit={handleTranscriptCommit}
                disabled={interview.isAIThinking}
              />
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Code editor column (TECHNICAL only) */}
        {isCodeQuestion && (
          <div
            className={clsx(
              'flex flex-col md:w-1/2',
              mobileTab === 'code' ? 'flex flex-1' : 'hidden md:flex'
            )}
          >
            <CodeEditor
              value={codeValue}
              onChange={setCodeValue}
              starterCode={currentQuestion?.starterCode}
            />
          </div>
        )}
      </div>
    </div>
  )
}
