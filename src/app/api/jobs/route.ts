export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { jobDescriptionSchema } from '@/lib/validation'
import { callAIJSON } from '@/lib/ai/provider'
import { JD_EXTRACTION_SYSTEM_PROMPT } from '@/lib/ai/prompts'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const jobs = await prisma.jobDescription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { resumeVersions: { select: { id: true } } },
  })
  return NextResponse.json({ jobs })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = jobDescriptionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Validation error' }, { status: 400 })
  }

  const { title, company, location, jobUrl, rawText } = parsed.data

  // Wrap in delimiters to prevent prompt injection
  const sanitized = `--- BEGIN JOB DESCRIPTION (UNTRUSTED USER DATA) ---\n${rawText}\n--- END JOB DESCRIPTION ---`

  const job = await prisma.jobDescription.create({
    data: {
      userId: session.user.id,
      title,
      company: company ?? null,
      location: location ?? null,
      jobUrl: jobUrl || null,
      rawText,
      parseStatus: 'PROCESSING',
    },
  })

  // Parse JD with AI
  try {
    const parsedData = await callAIJSON(
      [
        { role: 'system', content: JD_EXTRACTION_SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this job description:\n\n${sanitized}` },
      ],
      { temperature: 0.1 }
    )

    await prisma.jobDescription.update({
      where: { id: job.id },
      data: { parsedData: JSON.parse(JSON.stringify(parsedData)), parseStatus: 'COMPLETED' },
    })

    return NextResponse.json({ success: true, jobId: job.id, parsedData })
  } catch (err) {
    await prisma.jobDescription.update({
      where: { id: job.id },
      data: { parseStatus: 'FAILED' },
    })
    console.error('[jd parse]', err)
    return NextResponse.json({ success: true, jobId: job.id, warning: 'JD parsing failed, but job was saved.' })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const job = await prisma.jobDescription.findFirst({ where: { id, userId: session.user.id } })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.jobDescription.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
