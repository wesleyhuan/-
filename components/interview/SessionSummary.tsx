'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Star, TrendingUp, BookOpen, CheckCircle } from 'lucide-react'
import clsx from 'clsx'
import type { SessionSummary as SummaryType } from '@/lib/ai/types'
import type { AnswerRecord, SessionConfig } from '@/lib/storage/session'
import { FeedbackPanel } from './FeedbackPanel'

interface Props {
  summary: SummaryType
  answers: AnswerRecord[]
  config: SessionConfig
}

const READINESS_COLORS: Record<string, string> = {
  'Not Ready': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'Developing': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  'Interview Ready': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Strong Candidate': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
}

const RESOURCE_ICONS: Record<string, string> = {
  article: '📄',
  book: '📚',
  leetcode: '💻',
  video: '🎥',
}

export function SessionSummary({ summary, answers, config }: Props) {
  const [expandedAnswer, setExpandedAnswer] = useState<number | null>(null)
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null)

  const scoreColor =
    summary.overallScore >= 4
      ? 'text-green-600 dark:text-green-400'
      : summary.overallScore === 3
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-500 dark:text-red-400'

  const typeLabel: Record<string, string> = {
    BEHAVIORAL: 'Behavioral',
    TECHNICAL: 'Technical',
    SYSTEM_DESIGN: 'System Design',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Overall score card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interview Complete</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {typeLabel[config.interviewType]} · {config.difficulty} · {config.questionCount} questions ·{' '}
              {config.provider === 'claude' ? 'Claude' : 'GPT-4o'}
            </p>
          </div>
          <div className="text-center">
            <div className={clsx('text-5xl font-bold', scoreColor)}>{summary.overallScore}</div>
            <div className="text-gray-400 text-sm">/ 5</div>
          </div>
        </div>

        <div className="mt-4">
          <span
            className={clsx(
              'inline-block px-3 py-1 rounded-full text-sm font-medium',
              READINESS_COLORS[summary.readinessLevel] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-600'
            )}
          >
            {summary.readinessLevel}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary.summary}</p>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Top Strengths
          </h3>
          <ul className="space-y-2">
            {summary.topStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-orange-500 dark:text-orange-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" /> Areas to Improve
          </h3>
          <ul className="space-y-2">
            {summary.topImprovements.map((s, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300 pl-1">
                {i + 1}. {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-200 dark:border-brand-800 p-5">
        <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-2">Next Steps</h3>
        <p className="text-sm text-brand-800 dark:text-brand-200 leading-relaxed">{summary.nextSteps}</p>
      </div>

      {/* Resources */}
      {summary.recommendedResources.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4" /> Recommended Resources
          </h3>
          <ul className="space-y-2">
            {summary.recommendedResources.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span>{RESOURCE_ICONS[r.type] ?? '🔗'}</span>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
                    {r.title}
                  </a>
                ) : (
                  <span>{r.title}</span>
                )}
                <span className="text-xs text-gray-400 capitalize">({r.type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Per-question breakdown */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Question Breakdown</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {answers.map((answer, i) => (
            <div key={i} className="p-4">
              <button
                onClick={() => setExpandedAnswer(expandedAnswer === i ? null : i)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">Q{i + 1}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                    {answer.questionText}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {answer.feedback && (
                    <span
                      className={clsx(
                        'text-sm font-bold',
                        answer.feedback.overallScore >= 4
                          ? 'text-green-500'
                          : answer.feedback.overallScore === 3
                          ? 'text-yellow-500'
                          : 'text-red-400'
                      )}
                    >
                      {answer.feedback.overallScore}/5
                    </span>
                  )}
                  {expandedAnswer === i ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>

              {expandedAnswer === i && (
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your Answer</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      {answer.userAnswer}
                    </p>
                  </div>
                  {answer.feedback && (
                    selectedFeedback === i ? (
                      <FeedbackPanel
                        feedback={answer.feedback}
                        questionText={answer.questionText}
                        onClose={() => setSelectedFeedback(null)}
                      />
                    ) : (
                      <button
                        onClick={() => setSelectedFeedback(i)}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        View detailed feedback →
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
