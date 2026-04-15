'use client'

import { useInterviewContext } from '@/context/InterviewContext'
import type { AIProviderName } from '@/lib/ai/types'

export function useAIProvider() {
  const { provider, setProvider } = useInterviewContext()

  const toggle = () => {
    setProvider(provider === 'claude' ? 'openai' : 'claude')
  }

  const switchTo = (p: AIProviderName) => setProvider(p)

  return { provider, toggle, switchTo }
}
