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

  const experience = await prisma.experience.create({
    data: {
      careerProfileId: profile.id,
      company: body.company,
      jobTitle: body.title,
      location: body.location,
      startDate: body.startDate,
      endDate: body.endDate,
      isCurrent: body.isCurrent ?? false,
      bullets: body.bulletPoints ?? [],
      verificationStatus: 'USER_ADDED',
      sourceResumeIds: [],
    },
  })
  return NextResponse.json(experience)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body

  const experience = await prisma.experience.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.experience.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const experience = await prisma.experience.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!experience) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.experience.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
