'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { useInterviewContext } from '@/context/InterviewContext'
import { SessionSummary } from '@/components/interview/SessionSummary'
import { getCompletedSession } from '@/lib/storage/session'
import { RotateCcw, Home } from 'lucide-react'

interface Props {
  params: Promise<{ sessionId: string }>
}

export default function ResultsPage({ params }: Props) {
  const { sessionId } = use(params)
  const ctx = useInterviewContext()
  const [loaded, setLoaded] = useState(false)

  // Try context first (fresh session), fall back to localStorage (returning)
  const summary = ctx.summary ?? getCompletedSession(sessionId)?.summary ?? null
  const answers = ctx.answers.length > 0 ? ctx.answers : getCompletedSession(sessionId)?.answers ?? []
  const config =
    ctx.config ??
    (() => {
      const stored = getCompletedSession(sessionId)
      return stored
        ? {
            sessionId: stored.sessionId,
            interviewType: stored.interviewType,
            difficulty: stored.difficulty,
            provider: stored.provider,
            questionCount: stored.questionCount,
          }
        : null
    })()

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-400 text-sm">Loading results…</div>
      </div>
    )
  }

  if (!summary || !config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Session results not found.</p>
        <Link
          href="/"
          className="text-brand-600 dark:text-brand-400 text-sm hover:underline flex items-center gap-1"
        >
          <Home className="w-4 h-4" /> Go home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      {/* Actions bar */}
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          href="/interview/setup"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> New Interview
        </Link>
      </div>

      <SessionSummary summary={summary} answers={answers} config={config} />

      <div className="max-w-3xl mx-auto mt-8 text-center">
        <Link
          href="/interview/setup"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          Practice Again
        </Link>
      </div>
    </div>
  )
}
