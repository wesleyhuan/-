'use client'

import { useAIProvider } from '@/hooks/useAIProvider'
import type { AIProviderName } from '@/lib/ai/types'
import clsx from 'clsx'

const providers: { name: AIProviderName; label: string }[] = [
  { name: 'claude', label: 'Claude' },
  { name: 'openai', label: 'GPT-4o' },
]

export function ProviderToggle() {
  const { provider, switchTo } = useAIProvider()

  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 p-1">
      {providers.map((p) => (
        <button
          key={p.name}
          onClick={() => switchTo(p.name)}
          className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium transition-all duration-200',
            provider === p.name
              ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
