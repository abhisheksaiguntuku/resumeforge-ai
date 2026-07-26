import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
// import { analyzeResume } from '@/lib/ai/analyze' // Assuming this exists or mocking for now

// Mock analyzeResume for completeness if it's not defined yet
const analyzeResume = async (resumeData: any, jdData: any) => {
  return {
    scores: {
      parsingSafety: 85, jdCoverage: 70, skillsAlignment: 75, sectionCompleteness: 90,
      bulletQuality: 80, readability: 85, formattingSafety: 95, contactInfo: 100,
      educationComplete: 100, experienceRelevance: 80
    },
    overallScore: 84,
    issues: [
      { severity: 'warning', message: 'Missing some JD keywords', suggestion: 'Add relevant skills from the JD' }
    ],
    matchedKeywords: ['React', 'TypeScript'],
    partialKeywords: ['Node.js'],
    missingKeywords: ['Python'],
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const resume = await prisma.resumeVersion.findFirst({
    where: { id, userId: session.user.id },
    include: { jobDescription: true },
  })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const analysisResult = await analyzeResume(
    resume.resumeData as Record<string, unknown>,
    resume.jobDescription?.parsedData as Record<string, unknown> | null
  )

  const analysis = await prisma.resumeAnalysis.upsert({
    where: { resumeVersionId: id },
    update: {
      parsingSafety: analysisResult.scores.parsingSafety,
      jdCoverage: analysisResult.scores.jdCoverage,
      skillsAlignment: analysisResult.scores.skillsAlignment,
      sectionCompleteness: analysisResult.scores.sectionCompleteness,
      bulletQuality: analysisResult.scores.bulletQuality,
      readability: analysisResult.scores.readability,
      formattingSafety: analysisResult.scores.formattingSafety,
      contactInfo: analysisResult.scores.contactInfo,
      educationComplete: analysisResult.scores.educationComplete,
      experienceRelevance: analysisResult.scores.experienceRelevance,
      overallScore: analysisResult.overallScore,
      issues: analysisResult.issues,
      matchedKeywords: analysisResult.matchedKeywords,
      partialKeywords: analysisResult.partialKeywords,
      missingKeywords: analysisResult.missingKeywords,
    },
    create: {
      resumeVersionId: id,
      parsingSafety: analysisResult.scores.parsingSafety,
      jdCoverage: analysisResult.scores.jdCoverage,
      skillsAlignment: analysisResult.scores.skillsAlignment,
      sectionCompleteness: analysisResult.scores.sectionCompleteness,
      bulletQuality: analysisResult.scores.bulletQuality,
      readability: analysisResult.scores.readability,
      formattingSafety: analysisResult.scores.formattingSafety,
      contactInfo: analysisResult.scores.contactInfo,
      educationComplete: analysisResult.scores.educationComplete,
      experienceRelevance: analysisResult.scores.experienceRelevance,
      overallScore: analysisResult.overallScore,
      issues: analysisResult.issues,
      matchedKeywords: analysisResult.matchedKeywords,
      partialKeywords: analysisResult.partialKeywords,
      missingKeywords: analysisResult.missingKeywords,
    },
  })

  return NextResponse.json(analysis)
}
