import { callAIJSON } from './provider'
import { RESUME_EXTRACTION_SYSTEM_PROMPT } from './prompts'

export interface ExtractedResumeData {
  personal: {
    fullName: string | null
    email: string | null
    phone: string | null
    location: string | null
    linkedin: string | null
    github: string | null
    portfolio: string | null
    website: string | null
  }
  summary: string | null
  education: Array<{
    institution: string
    degree: string | null
    fieldOfStudy: string | null
    startDate: string | null
    endDate: string | null
    isCurrent: boolean
    cgpa: string | null
    percentage: string | null
    location: string | null
  }>
  experience: Array<{
    company: string
    jobTitle: string
    employmentType: string | null
    startDate: string | null
    endDate: string | null
    isCurrent: boolean
    location: string | null
    bullets: string[]
    technologies: string[]
  }>
  internships: Array<{
    company: string
    role: string
    startDate: string | null
    endDate: string | null
    location: string | null
    bullets: string[]
    technologies: string[]
  }>
  projects: Array<{
    name: string
    description: string | null
    technologies: string[]
    bullets: string[]
    projectUrl: string | null
    githubUrl: string | null
  }>
  skills: {
    programmingLanguages: string[]
    frameworks: string[]
    libraries: string[]
    databases: string[]
    cloud: string[]
    aiMl: string[]
    devTools: string[]
    platforms: string[]
    softSkills: string[]
    other: string[]
  }
  certifications: Array<{
    name: string
    issuer: string | null
    issueDate: string | null
    credentialId: string | null
    credentialUrl: string | null
  }>
  achievements: Array<{ title: string; description: string | null; date: string | null }>
  publications: Array<{ title: string; journal: string | null; date: string | null; url: string | null }>
  awards: Array<{ title: string; issuer: string | null; date: string | null }>
  languages: Array<{ name: string; proficiency: string | null }>
  volunteering: Array<{
    organization: string
    role: string | null
    startDate: string | null
    endDate: string | null
    description: string | null
  }>
}

export async function extractResumeData(resumeText: string): Promise<ExtractedResumeData> {
  // Sanitize: wrap in delimiters so the AI cannot be injected
  const sanitizedText = `--- BEGIN RESUME CONTENT (UNTRUSTED USER DATA) ---\n${resumeText}\n--- END RESUME CONTENT ---`

  const data = await callAIJSON<ExtractedResumeData>([
    { role: 'system', content: RESUME_EXTRACTION_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Extract structured information from this resume:\n\n${sanitizedText}`,
    },
  ])

  return data
}
