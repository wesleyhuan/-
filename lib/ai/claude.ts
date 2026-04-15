import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, AIMessage, InterviewType, Feedback, SessionSummary, AnswerForSummary } from './types'
import { buildFeedbackPrompt, parseFeedbackResponse, buildSummaryPrompt, parseSummaryResponse } from '../prompts/feedback'

const MODEL = 'claude-sonnet-4-6'

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

export const claudeProvider: AIProvider = {
  async *streamMessage(messages: AIMessage[], system: string): AsyncIterable<string> {
    const client = getClient()
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: system,
          // Enable prompt caching on the system prompt to reduce cost across turns
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text
      }
    }
  },

  async generateFeedback(question: string, answer: string, type: InterviewType): Promise<Feedback> {
    const client = getClient()
    const prompt = buildFeedbackPrompt(question, answer, type)
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return parseFeedbackResponse(text)
  },

  async generateSummary(answers: AnswerForSummary[]): Promise<SessionSummary> {
    const client = getClient()
    const prompt = buildSummaryPrompt(answers)
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    return parseSummaryResponse(text)
  },
}
