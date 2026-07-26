export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resumes = await prisma.resumeVersion.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      jobDescription: { select: { title: true, company: true } },
      // analysis is not required or it might not exist yet based on schema changes, avoiding missing relation error
      // analysis: { select: { overallScore: true } },
    },
  })

  return NextResponse.json({ resumes })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const resume = await prisma.resumeVersion.findFirst({ where: { id, userId: session.user.id } })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.resumeVersion.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
