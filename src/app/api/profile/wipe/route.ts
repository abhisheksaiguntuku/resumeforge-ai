export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.careerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  try {
    // Delete all nested entities
    await prisma.education.deleteMany({ where: { careerProfileId: profile.id } })
    await prisma.experience.deleteMany({ where: { careerProfileId: profile.id } })
    await prisma.project.deleteMany({ where: { careerProfileId: profile.id } })
    await prisma.skill.deleteMany({ where: { careerProfileId: profile.id } })
    
    // Clear the main profile fields
    await prisma.careerProfile.update({
      where: { id: profile.id },
      data: {
        fullName: null,
        email: null,
        phone: null,
        summary: null,
        location: null
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to wipe profile:', err)
    return NextResponse.json({ error: 'Failed to wipe profile' }, { status: 500 })
  }
}
