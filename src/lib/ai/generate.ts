import { callAIJSON } from './provider'
import { RESUME_GENERATION_SYSTEM_PROMPT } from './prompts'
import type { JDData } from './match'

export interface ResumeSection {
  type: string
  visible: boolean
  order: number
  content: Record<string, unknown>
}

export interface GeneratedResume {
  sections: ResumeSection[]
  groundingLog: Array<{
    claim: string
    sourceField: string
    status: 'SUPPORTED' | 'PARTIALLY_SUPPORTED'
    confidence: number
  }>
}

export async function generateResume(
  careerProfile: Record<string, unknown>,
  jd: JDData,
  options: {
    pageLength?: 'auto' | 'one' | 'two'
    focusAreas?: string[]
  } = {}
): Promise<GeneratedResume> {
  const prompt = `Generate a tailored ATS-friendly resume for this job using ONLY the information in the career profile.

CARRER PROFILE (VERIFIED SOURCE OF TRUTH):
${JSON.stringify(careerProfile, null, 2)}

TARGET JOB:
${JSON.stringify(jd, null, 2)}

OPTIONS:
- Page length: ${options.pageLength ?? 'auto'}
- Focus areas: ${options.focusAreas?.join(', ') ?? 'all relevant'}

Select the most relevant experience, projects, and skills. Deprioritize irrelevant content.
IMPORTANT: Do NOT add any skills, companies, dates, or metrics not in CAREER PROFILE.`

  const result = await callAIJSON<GeneratedResume>(
    [
      { role: 'system', content: RESUME_GENERATION_SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    { temperature: 0.2, maxTokens: 8000 }
  )

  return result
}

export async function improveBullet(
  bullet: string,
  mode: 'improve' | 'concise' | 'technical' | 'impactful' | 'grammar',
  context?: string
): Promise<{ improved: string; changesExplained: string }> {
  const modeInstructions = {
    improve: 'Improve the writing quality. Use stronger action verbs. Do not add fake metrics.',
    concise: 'Make it more concise. Keep the core meaning. Remove filler words.',
    technical: 'Make it sound more technical. Use precise technical terminology.',
    impactful: 'Make it more impactful. Focus on outcomes (only if they exist in the original).',
    grammar: 'Fix grammar and spelling only. Minimal other changes.',
  }

  const result = await callAIJSON<{ improved: string; changesExplained: string }>(
    [
      {
        role: 'system',
        content: `You are a resume bullet point editor. ${modeInstructions[mode]}
NEVER add metrics, numbers, or facts not present in the original. Return JSON: {"improved": string, "changesExplained": string}`,
      },
      {
        role: 'user',
        content: `Original bullet: "${bullet}"${context ? `\nContext: ${context}` : ''}`,
      },
    ],
    { temperature: 0.3, model: 'llama-3.1-8b-instant' }
  )

  return result
}
