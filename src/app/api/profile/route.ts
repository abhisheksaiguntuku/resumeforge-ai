import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.careerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      education: { orderBy: { startDate: 'desc' } },
      experience: { orderBy: { startDate: 'desc' } },
      internships: { orderBy: { startDate: 'desc' } },
      projects: true,
      skills: { orderBy: { category: 'asc' } },
      certifications: true,
      achievements: true,
      publications: true,
      awards: true,
      languages: true,
      volunteering: true,
      conflictItems: { where: { isResolved: false } },
    },
  })

  if (!profile) {
    // Create it if somehow missing
    const newProfile = await prisma.careerProfile.create({
      data: { userId: session.user.id },
      include: {
        education: true, experience: true, internships: true, projects: true,
        skills: true, certifications: true, achievements: true, publications: true,
        awards: true, languages: true, volunteering: true,
        conflictItems: { where: { isResolved: false } },
      },
    })
    return NextResponse.json(newProfile)
  }

  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { fullName, email, phone, location, linkedin, github, portfolio, website, summary } = body

  const profile = await prisma.careerProfile.update({
    where: { userId: session.user.id },
    data: { fullName, email, phone, location, linkedin, github, portfolio, website, summary },
  })

  return NextResponse.json(profile)
}
