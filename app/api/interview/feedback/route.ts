import { NextRequest } from 'next/server'
import { getProvider } from '@/lib/ai/interviewer'
import type { AIProviderName, InterviewType } from '@/lib/ai/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      provider,
      question,
      answer,
      interviewType,
    }: {
      provider: AIProviderName
      question: string
      answer: string
      interviewType: InterviewType
    } = body

    if (!provider || !question || !answer || !interviewType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const aiProvider = getProvider(provider)
    const feedback = await aiProvider.generateFeedback(question, answer, interviewType)

    return new Response(JSON.stringify(feedback), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error in /api/interview/feedback:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
