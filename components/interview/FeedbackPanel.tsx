'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Star, CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'
import type { Feedback } from '@/lib/ai/types'

interface Props {
  feedback: Feedback
  questionText: string
  onClose: () => void
}

function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={clsx(
            'w-3.5 h-3.5',
            i < score ? 'fill-current' : 'fill-none opacity-30',
            score >= 4 ? 'text-green-500' : score === 3 ? 'text-yellow-500' : 'text-red-400'
          )}
        />
      ))}
    </div>
  )
}

const RUBRIC_LABELS: Record<string, string> = {
  clarity: 'Clarity',
  depth: 'Depth',
  relevance: 'Relevance',
  structure: 'Structure',
  technicalAccuracy: 'Technical Accuracy',
}

export function FeedbackPanel({ feedback, questionText, onClose }: Props) {
  const [showIdeal, setShowIdeal] = useState(false)

  const scoreColor =
    feedback.overallScore >= 4
      ? 'text-green-600 dark:text-green-400'
      : feedback.overallScore === 3
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-500 dark:text-red-400'

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Answer Feedback</h3>
        <div className="flex items-center gap-2">
          <span className={clsx('text-2xl font-bold', scoreColor)}>{feedback.overallScore}</span>
          <span className="text-gray-400 text-sm">/5</span>
          <button
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Rubric */}
        <div className="space-y-2">
          {Object.entries(feedback.rubric).map(([key, item]) => (
            <div key={key} className="flex items-start gap-3">
              <div className="w-32 shrink-0">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {RUBRIC_LABELS[key] ?? key}
                </span>
                <ScoreStars score={item.score} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.comment}</p>
            </div>
          ))}
        </div>

        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1.5">
              Strengths
            </h4>
            <ul className="space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {feedback.improvements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wide mb-1.5">
              Areas to Improve
            </h4>
            <ul className="space-y-1">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ideal answer (collapsible) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowIdeal((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>Model Answer</span>
            {showIdeal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showIdeal && (
            <div className="p-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900">
              {feedback.idealAnswer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
