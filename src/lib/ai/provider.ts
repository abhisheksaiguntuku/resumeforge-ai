import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Primary model for complex tasks (resume extraction, generation)
export const PRIMARY_MODEL = 'llama-3.3-70b-versatile'
// Fast model for simpler tasks
export const FAST_MODEL = 'llama-3.1-8b-instant'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callAI(
  messages: AIMessage[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    responseFormat?: 'json' | 'text'
  } = {}
): Promise<string> {
  const model = options.model ?? PRIMARY_MODEL
  const temperature = options.temperature ?? 0.1
  const maxTokens = options.maxTokens ?? 8192

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    ...(options.responseFormat === 'json'
      ? { response_format: { type: 'json_object' } }
      : {}),
  })

  return completion.choices[0]?.message?.content ?? ''
}

export async function callAIJSON<T>(
  messages: AIMessage[],
  options?: Parameters<typeof callAI>[1]
): Promise<T> {
  const raw = await callAI(messages, { ...options, responseFormat: 'json' })
  try {
    return JSON.parse(raw) as T
  } catch {
    // Try to extract JSON from the response
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0]) as T
    throw new Error(`AI returned invalid JSON: ${raw.slice(0, 200)}`)
  }
}
