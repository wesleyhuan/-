import OpenAI from 'openai'
import type { AIProvider, AIMessage, InterviewType, Feedback, SessionSummary, AnswerForSummary } from './types'
import { buildFeedbackPrompt, parseFeedbackResponse, buildSummaryPrompt, parseSummaryResponse } from '../prompts/feedback'

const MODEL = 'gpt-4o'

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export const openaiProvider: AIProvider = {
  async *streamMessage(messages: AIMessage[], system: string): AsyncIterable<string> {
    const client = getClient()
    const stream = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) yield delta
    }
  },

  async generateFeedback(question: string, answer: string, type: InterviewType): Promise<Feedback> {
    const client = getClient()
    const prompt = buildFeedbackPrompt(question, answer, type)
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.choices[0]?.message?.content ?? ''
    return parseFeedbackResponse(text)
  },

  async generateSummary(answers: AnswerForSummary[]): Promise<SessionSummary> {
    const client = getClient()
    const prompt = buildSummaryPrompt(answers)
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.choices[0]?.message?.content ?? ''
    return parseSummaryResponse(text)
  },
}
