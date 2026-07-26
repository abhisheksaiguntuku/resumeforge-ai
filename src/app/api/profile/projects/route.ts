import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const profile = await prisma.careerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const project = await prisma.project.create({
    data: {
      careerProfileId: profile.id,
      name: body.name,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
      technologies: body.technologies ?? [],
      projectUrl: body.link,
      githubUrl: body.githubUrl,
      bullets: body.bulletPoints ?? [],
      verificationStatus: 'USER_ADDED',
      sourceResumeIds: [],
    },
  })
  return NextResponse.json(project)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...data } = body

  const project = await prisma.project.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.project.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const project = await prisma.project.findFirst({
    where: { id, careerProfile: { userId: session.user.id } },
  })
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
