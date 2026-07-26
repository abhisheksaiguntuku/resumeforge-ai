export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const profile = await prisma.careerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const edu = await prisma.education.create({
    data: {
      careerProfileId: profile.id,
      institution: body.institution,
      degree: body.degree,
      fieldOfStudy: body.fieldOfStudy,
      startDate: body.startDate,
      endDate: body.endDate,
      isCurrent: body.isCurrent ?? false,
      cgpa: body.cgpa,
      location: body.location,
      verificationStatus: 'USER_ADDED',
      sourceResumeIds: [],
    },
  })
  return NextResponse.json(edu)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body

  // Verify ownership
  const edu = await prisma.education.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!edu) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.education.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const edu = await prisma.education.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!edu) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.education.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
