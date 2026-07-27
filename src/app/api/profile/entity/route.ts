export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type') // education, experience, project, skill

  if (!id || !type) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })

  const profile = await prisma.careerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  try {
    if (type === 'education') {
      await prisma.education.delete({ where: { id, careerProfileId: profile.id } })
    } else if (type === 'experience') {
      await prisma.experience.delete({ where: { id, careerProfileId: profile.id } })
    } else if (type === 'project') {
      await prisma.project.delete({ where: { id, careerProfileId: profile.id } })
    } else if (type === 'skill') {
      await prisma.skill.delete({ where: { id, careerProfileId: profile.id } })
    } else {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
