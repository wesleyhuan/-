'use client'

import clsx from 'clsx'
import type { ChatMessage } from '@/lib/storage/session'

interface Props {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  const { role, content, isStreaming } = message

  if (role === 'system') {
    return (
      <div className="flex justify-center my-3">
        <span className="text-xs text-gray-400 dark:text-gray-500 italic px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          {content}
        </span>
      </div>
    )
  }

  const isUser = role === 'user'

  return (
    <div className={clsx('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 shrink-0">
          AI
        </div>
      )}
      <div
        className={clsx(
          'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-brand-600 text-white rounded-tr-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
        )}
      >
        {content || (isStreaming ? null : '...')}
        {isStreaming && (
          <span className="inline-flex gap-0.5 ml-1 align-middle">
            <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
          </span>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold ml-2 mt-1 shrink-0">
          You
        </div>
      )}
    </div>
  )
}
