import { NextRequest } from 'next/server'
import { getProvider } from '@/lib/ai/interviewer'
import { buildInterviewerSystemPrompt } from '@/lib/prompts/interviewer'
import type { AIProviderName, InterviewType, Difficulty, AIMessage } from '@/lib/ai/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      provider,
      messages,
      interviewType,
      difficulty,
      totalQuestions,
    }: {
      provider: AIProviderName
      messages: AIMessage[]
      interviewType: InterviewType
      difficulty: Difficulty
      totalQuestions: number
    } = body

    if (!provider || !messages || !interviewType || !difficulty) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const aiProvider = getProvider(provider)
    const system = buildInterviewerSystemPrompt(interviewType, difficulty, totalQuestions)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiProvider.streamMessage(messages, system)) {
            controller.enqueue(encoder.encode(chunk))
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    console.error('Error in /api/interview/message:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
