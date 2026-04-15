import type { AIProvider, AIProviderName } from './types'
import { claudeProvider } from './claude'
import { openaiProvider } from './openai'

export function getProvider(name: AIProviderName): AIProvider {
  return name === 'claude' ? claudeProvider : openaiProvider
}
