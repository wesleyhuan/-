import { NextRequest } from 'next/server'
import { getProvider } from '@/lib/ai/interviewer'
import type { AIProviderName, AnswerForSummary } from '@/lib/ai/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      provider,
      answers,
    }: {
      provider: AIProviderName
      answers: AnswerForSummary[]
    } = body

    if (!provider || !answers || answers.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const aiProvider = getProvider(provider)
    const summary = await aiProvider.generateSummary(answers)

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error in /api/session/summary:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
