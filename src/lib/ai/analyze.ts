import { callAIJSON } from './provider'
import { ATS_ANALYSIS_SYSTEM_PROMPT } from './prompts'

export interface AnalysisResult {
  scores: {
    parsingSafety: number
    jdCoverage: number
    skillsAlignment: number
    sectionCompleteness: number
    bulletQuality: number
    readability: number
    formattingSafety: number
    contactInfo: number
    educationComplete: number
    experienceRelevance: number
  }
  overallScore: number
  issues: Array<{
    category: string
    severity: 'critical' | 'warning' | 'suggestion'
    message: string
    suggestion: string
  }>
  matchedKeywords: string[]
  partialKeywords: string[]
  missingKeywords: string[]
}

export async function analyzeResume(
  resumeData: Record<string, unknown>,
  jdData: Record<string, unknown> | null
): Promise<AnalysisResult> {
  const result = await callAIJSON<Omit<AnalysisResult, 'overallScore'>>(
    [
      { role: 'system', content: ATS_ANALYSIS_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze this resume for ATS readiness.\n\nRESUME:\n${JSON.stringify(resumeData, null, 2)}\n\nTARGET JOB DESCRIPTION:\n${JSON.stringify(jdData ?? {}, null, 2)}`,
      },
    ],
    { temperature: 0.1 }
  )

  const scores = result.scores
  const overallScore = Math.round(
    (scores.parsingSafety * 0.15 +
      scores.jdCoverage * 0.2 +
      scores.skillsAlignment * 0.15 +
      scores.sectionCompleteness * 0.1 +
      scores.bulletQuality * 0.1 +
      scores.readability * 0.1 +
      scores.formattingSafety * 0.1 +
      scores.contactInfo * 0.05 +
      scores.educationComplete * 0.025 +
      scores.experienceRelevance * 0.025)
  )

  return { ...result, overallScore }
}
