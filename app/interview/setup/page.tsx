'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useInterviewContext } from '@/context/InterviewContext'
import { ProviderToggle } from '@/components/ui/ProviderToggle'
import { BrainCircuit, MessageSquare, Layout, ChevronRight } from 'lucide-react'
import type { InterviewType, Difficulty } from '@/lib/ai/types'
import clsx from 'clsx'

const TYPES: { value: InterviewType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: 'BEHAVIORAL',
    label: 'Behavioral',
    desc: 'STAR-method questions about your past experiences — leadership, conflict, ownership.',
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    value: 'TECHNICAL',
    label: 'Technical / Coding',
    desc: 'LeetCode-style algorithm & data structure problems with an in-browser code editor.',
    icon: <BrainCircuit className="w-6 h-6" />,
  },
  {
    value: 'SYSTEM_DESIGN',
    label: 'System Design',
    desc: 'Design large-scale distributed systems — YouTube, URL shortener, WhatsApp, and more.',
    icon: <Layout className="w-6 h-6" />,
  },
]

const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'EASY', label: 'Easy', desc: 'Entry-level / new grad' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Mid-level engineer' },
  { value: 'HARD', label: 'Hard', desc: 'Senior / staff engineer' },
]

const QUESTION_COUNTS = [3, 5, 10]

export default function SetupPage() {
  const router = useRouter()
  const ctx = useInterviewContext()

  const [type, setType] = useState<InterviewType>('BEHAVIORAL')
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM')
  const [questionCount, setQuestionCount] = useState(5)

  const handleStart = () => {
    const sessionId = crypto.randomUUID()
    ctx.reset()
    ctx.setConfig({
      sessionId,
      interviewType: type,
      difficulty,
      provider: ctx.provider,
      questionCount,
    })
    router.push(`/interview/session/${sessionId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configure Your Interview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Set your preferences and start practicing</p>
        </div>

        {/* Interview type */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            1. Interview Type
          </h2>
          <div className="grid gap-3">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={clsx(
                  'flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150',
                  type === t.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                <div
                  className={clsx(
                    'p-2 rounded-lg shrink-0',
                    type === t.value
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  )}
                >
                  {t.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Difficulty */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            2. Difficulty
          </h2>
          <div className="flex gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={clsx(
                  'flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all duration-150',
                  difficulty === d.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                <p className="font-semibold text-sm">{d.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{d.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Question count */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            3. Number of Questions
          </h2>
          <div className="flex gap-3">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={clsx(
                  'flex-1 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-150',
                  questionCount === n
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-brand-300'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </section>

        {/* AI provider */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            4. AI Provider
          </h2>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <ProviderToggle />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {ctx.provider === 'claude' ? 'Claude Sonnet 4.6 by Anthropic' : 'GPT-4o by OpenAI'}
            </p>
          </div>
        </section>

        {/* CTA */}
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl text-sm transition-colors shadow-md"
        >
          Begin Interview
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
