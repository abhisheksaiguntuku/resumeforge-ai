import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { matchCandidateToJD } from '@/lib/ai/match'
import { generateResume } from '@/lib/ai/generate'
import { generateResumeName } from '@/lib/utils'
import type { JDData } from '@/lib/ai/match'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id

  const { jobDescriptionId, templateId, pageLength } = await req.json()

  // Get JD (ownership check)
  const jd = await prisma.jobDescription.findFirst({
    where: { id: jobDescriptionId, userId },
  })
  if (!jd) return NextResponse.json({ error: 'Job description not found.' }, { status: 404 })
  if (!jd.parsedData) return NextResponse.json({ error: 'Job description has not been analyzed yet.' }, { status: 400 })

  // Get Career Profile
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
    include: {
      education: true, experience: true, internships: true, projects: true,
      skills: true, certifications: true, achievements: true, publications: true,
      awards: true, languages: true, volunteering: true,
    },
  })
  if (!profile) return NextResponse.json({ error: 'Career profile not found.' }, { status: 404 })

  // Create a pending version record
  const existingVersions = await prisma.resumeVersion.count({
    where: { userId, jobDescriptionId },
  })

  const resumeVersion = await prisma.resumeVersion.create({
    data: {
      userId,
      jobDescriptionId,
      name: generateResumeName(jd.company ?? '', jd.title, existingVersions + 1),
      templateId: templateId ?? 'classic_ats',
      pageLength: pageLength ?? 'auto',
      version: existingVersions + 1,
      generationStatus: 'GENERATING',
      resumeData: {},
    },
  })

  try {
    // Run matching
    const matchResult = await matchCandidateToJD(
      profile as unknown as Record<string, unknown>,
      jd.parsedData as unknown as JDData
    )

    // Generate resume
    const generatedResume = await generateResume(
      profile as unknown as Record<string, unknown>,
      jd.parsedData as unknown as JDData,
      { pageLength: pageLength ?? 'auto' }
    )

    // Calculate grounding score
    const groundingLog = generatedResume.groundingLog ?? []
    const groundingScore = groundingLog.length > 0
      ? groundingLog.filter((g: any) => g.status === 'SUPPORTED').length / groundingLog.length
      : 1

    // Update version
    await prisma.resumeVersion.update({
      where: { id: resumeVersion.id },
      data: {
        resumeData: JSON.parse(JSON.stringify({ ...generatedResume, matchResult })),
        groundingScore,
        generationStatus: 'COMPLETED',
      },
    })

    return NextResponse.json({
      success: true,
      resumeVersionId: resumeVersion.id,
      matchResult,
      groundingScore,
    })
  } catch (err) {
    console.error('[generate]', err)
    await prisma.resumeVersion.update({
      where: { id: resumeVersion.id },
      data: { generationStatus: 'FAILED' },
    })
    return NextResponse.json({ error: 'Resume generation failed. Please try again.' }, { status: 500 })
  }
}
