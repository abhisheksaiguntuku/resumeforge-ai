import { callAIJSON } from './provider'
import type { ExtractedResumeData } from './extract'

export interface JDData {
  title: string
  company: string | null
  location: string | null
  seniority: string | null
  requiredSkills: Array<{ name: string; importance: 'high' | 'medium' | 'low'; category: string }>
  preferredSkills: Array<{ name: string; importance: 'medium' | 'low'; category: string }>
  responsibilities: string[]
  qualifications: string[]
  educationRequirements: string[]
  experienceRequirements: string[]
  keywords: Array<{ term: string; weight: number; category: string }>
  softSkills: string[]
  certifications: string[]
  domain: string | null
}

export interface MatchResult {
  overallMatch: 'strong' | 'moderate' | 'weak'
  matchScore: number
  strongMatches: string[]
  partialMatches: string[]
  missingSkills: string[]
  transferableSkills: string[]
  highPriorityKeywords: string[]
  relevantProjects: string[]
  relevantExperience: string[]
  suggestedAdditions: string[]
}

export async function matchCandidateToJD(
  profile: Record<string, unknown>,
  jd: JDData
): Promise<MatchResult> {
  const result = await callAIJSON<MatchResult>(
    [
      {
        role: 'system',
        content: `You are a resume-JD matching expert. Compare the candidate profile to the job description.
NEVER suggest adding skills the candidate does not have.
Return JSON matching the MatchResult schema:
{
  "overallMatch": "strong" | "moderate" | "weak",
  "matchScore": number (0-100),
  "strongMatches": string[],
  "partialMatches": string[],
  "missingSkills": string[],
  "transferableSkills": string[],
  "highPriorityKeywords": string[],
  "relevantProjects": string[],
  "relevantExperience": string[],
  "suggestedAdditions": string[] (things user GENUINELY has but didn't mention clearly)
}`,
      },
      {
        role: 'user',
        content: `CANDIDATE PROFILE:\n${JSON.stringify(profile, null, 2)}\n\nJOB DESCRIPTION ANALYSIS:\n${JSON.stringify(jd, null, 2)}`,
      },
    ],
    { temperature: 0.1 }
  )

  return result
}
