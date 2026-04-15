import type { InterviewType, Feedback, SessionSummary, AnswerForSummary } from '../ai/types'

export function buildFeedbackPrompt(
  question: string,
  answer: string,
  type: InterviewType
): string {
  const typeGuidance: Record<InterviewType, string> = {
    BEHAVIORAL:
      'Focus on: STAR structure completeness, specificity of the situation, quality of actions taken, measurable results/impact, and self-awareness.',
    TECHNICAL:
      'Focus on: correctness of the approach, time and space complexity analysis, handling of edge cases, code clarity and style, and communication of thought process.',
    SYSTEM_DESIGN:
      'Focus on: clarity of architecture, scalability considerations, appropriate component choices (databases, caches, queues), failure handling, and trade-off awareness.',
  }

  return `You are evaluating a candidate's answer in a Google ${type.replace('_', ' ')} interview.

Question asked: "${question}"

Candidate's answer: "${answer}"

Evaluation guidance: ${typeGuidance[type]}

Return ONLY a valid JSON object (no other text, no markdown code blocks) with EXACTLY this structure:
{
  "rubric": {
    "clarity": { "score": <1-5>, "comment": "<brief comment>" },
    "depth": { "score": <1-5>, "comment": "<brief comment>" },
    "relevance": { "score": <1-5>, "comment": "<brief comment>" },
    "structure": { "score": <1-5>, "comment": "<brief comment>" },
    "technicalAccuracy": { "score": <1-5>, "comment": "<brief comment>" }
  },
  "overallScore": <1-5>,
  "idealAnswer": "<A concise 3-5 sentence model answer>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "followUpQuestions": ["<follow-up question 1>", "<follow-up question 2>"],
  "verbatimFeedback": "<Natural conversational 2-3 sentence feedback to say aloud to the candidate. Do NOT mention scores or use bullet points.>"
}

Score definitions: 1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent.
IMPORTANT: Return ONLY the JSON. No preamble, no explanation, no markdown.`
}

export function parseFeedbackResponse(raw: string): Feedback {
  try {
    // Try direct parse first
    return JSON.parse(raw) as Feedback
  } catch {
    // Extract JSON object from response if it contains extra text
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0]) as Feedback
      } catch {
        // fall through to default
      }
    }
  }

  // Return a safe default if parsing fails
  return {
    rubric: {
      clarity: { score: 3, comment: 'Unable to evaluate' },
      depth: { score: 3, comment: 'Unable to evaluate' },
      relevance: { score: 3, comment: 'Unable to evaluate' },
      structure: { score: 3, comment: 'Unable to evaluate' },
      technicalAccuracy: { score: 3, comment: 'Unable to evaluate' },
    },
    overallScore: 3,
    idealAnswer: 'Feedback generation encountered an error.',
    strengths: [],
    improvements: [],
    followUpQuestions: [],
    verbatimFeedback: 'Thank you for your answer. Let\'s move on.',
  }
}

export function buildSummaryPrompt(answers: AnswerForSummary[]): string {
  const answersText = answers
    .map(
      (a, i) =>
        `Question ${i + 1}: ${a.questionText}\nAnswer: ${a.userAnswer}\nScore: ${a.overallScore}/5\nKey improvements: ${a.improvements.join(', ')}`
    )
    .join('\n\n')

  return `You have just completed a Google mock interview session. Here is the full question and answer log:

${answersText}

Based on this session, return ONLY a valid JSON object (no markdown, no extra text) with EXACTLY this structure:
{
  "overallScore": <1-5 average of all scores>,
  "summary": "<3-5 sentence overall assessment of the candidate's performance>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "recommendedResources": [
    { "title": "<resource title>", "type": "<article|book|leetcode|video>" },
    { "title": "<resource title>", "type": "<article|book|leetcode|video>" },
    { "title": "<resource title>", "type": "<article|book|leetcode|video>" }
  ],
  "readinessLevel": "<Not Ready|Developing|Interview Ready|Strong Candidate>",
  "nextSteps": "<Specific 2-3 sentence actionable advice for what to study or practice next>"
}

IMPORTANT: Return ONLY the JSON. No preamble, no explanation, no markdown.`
}

export function parseSummaryResponse(raw: string): SessionSummary {
  try {
    return JSON.parse(raw) as SessionSummary
  } catch {
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0]) as SessionSummary
      } catch {
        // fall through
      }
    }
  }

  return {
    overallScore: 3,
    summary: 'Session complete. Feedback generation encountered an error.',
    topStrengths: [],
    topImprovements: [],
    recommendedResources: [],
    readinessLevel: 'Developing',
    nextSteps: 'Review your answers and practice more.',
  }
}
