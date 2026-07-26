export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const [profile, uploadedResumes, resumeVersions, jobDescriptions] = await Promise.all([
    prisma.careerProfile.findUnique({
      where: { userId },
      include: {
        education: true,
        experience: true,
        skills: true,
        projects: true,
        conflictItems: { where: { isResolved: false } },
      },
    }),
    prisma.uploadedResume.count({ where: { userId } }),
    prisma.resumeVersion.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: { jobDescription: true },
    }),
    prisma.jobDescription.count({ where: { userId } }),
  ])

  const completionScore = profile ? calculateCompletion(profile) : 0

  return NextResponse.json({
    completionScore,
    uploadedResumesCount: uploadedResumes,
    resumeVersionsCount: resumeVersions.length,
    jobDescriptionsCount: jobDescriptions,
    recentResumes: resumeVersions,
    unresolvedConflicts: profile?.conflictItems.length ?? 0,
  })
}

function calculateCompletion(profile: {
  fullName?: string | null
  email?: string | null
  phone?: string | null
  summary?: string | null
  education: { length: number }
  experience: { length: number }
  skills: { length: number }
  projects: { length: number }
}) {
  let score = 0
  if (profile.fullName) score += 10
  if (profile.email) score += 10
  if (profile.phone) score += 5
  if (profile.summary) score += 10
  if (profile.education.length > 0) score += 15
  if (profile.experience.length > 0) score += 20
  if (profile.skills.length >= 5) score += 15
  if (profile.projects.length > 0) score += 15
  return Math.min(score, 100)
}
