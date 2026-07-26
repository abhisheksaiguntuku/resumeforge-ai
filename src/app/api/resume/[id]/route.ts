import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const resume = await prisma.resumeVersion.findFirst({
    where: { id, userId: session.user.id },
    include: {
      jobDescription: true,
      analysis: true,
    },
  })

  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(resume)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const resume = await prisma.resumeVersion.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.resumeVersion.update({
    where: { id },
    data: {
      resumeData: body.resumeData ?? resume.resumeData,
      templateId: body.templateId ?? resume.templateId,
      pageLength: body.pageLength ?? resume.pageLength,
      fontFamily: body.fontFamily ?? resume.fontFamily,
      fontSize: body.fontSize ?? resume.fontSize,
      name: body.name ?? resume.name,
    },
  })
  return NextResponse.json(updated)
}
