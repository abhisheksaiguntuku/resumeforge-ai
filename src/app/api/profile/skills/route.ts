import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const profile = await prisma.careerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const skill = await prisma.skill.upsert({
    where: { careerProfileId_name: { careerProfileId: profile.id, name: body.name } },
    update: {},
    create: {
      careerProfileId: profile.id,
      name: body.name,
      category: body.category ?? 'OTHER',
      verificationStatus: 'USER_ADDED',
      sourceResumeIds: [],
    },
  })
  return NextResponse.json(skill)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const skill = await prisma.skill.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!skill) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.skill.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
