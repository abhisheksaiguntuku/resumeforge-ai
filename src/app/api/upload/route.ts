export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/storage'
import { extractTextFromPDF } from '@/lib/parsers/pdf'
import { extractTextFromDOCX } from '@/lib/parsers/docx'
import { extractResumeData } from '@/lib/ai/extract'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_RESUMES = 10
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = session.user.id

  try {
    // Check upload limit
    const count = await prisma.uploadedResume.count({ where: { userId } })
    if (count >= MAX_RESUMES) {
      return NextResponse.json({ error: 'Maximum 10 resumes allowed. Please delete some before uploading more.' }, { status: 400 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size must be under 10MB.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF and DOCX files are supported.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { url, size } = await uploadFile(buffer, file.name, file.type)

    // Create DB record
    const resume = await prisma.uploadedResume.create({
      data: {
        userId,
        filename: url.split('/').pop() ?? file.name,
        originalName: file.name,
        fileUrl: url,
        fileSize: size,
        mimeType: file.type,
        extractionStatus: 'PROCESSING',
      },
    })

    // Extract text
    let extractedText = ''
    try {
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(buffer)
      } else {
        extractedText = await extractTextFromDOCX(buffer)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Extraction failed'
      await prisma.uploadedResume.update({
        where: { id: resume.id },
        data: { extractionStatus: 'FAILED', errorMessage: msg },
      })
      return NextResponse.json({ error: msg, resumeId: resume.id }, { status: 422 })
    }

    // AI extraction
    let extractedData = null
    try {
      extractedData = await extractResumeData(extractedText)
    } catch (err) {
      console.error('[AI extraction]', err)
    }

    await prisma.uploadedResume.update({
      where: { id: resume.id },
      data: {
        extractedText,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        extractedData: extractedData ? JSON.parse(JSON.stringify(extractedData)) : undefined,
        extractionStatus: extractedData ? 'COMPLETED' : 'FAILED',
      },
    })

    return NextResponse.json({
      success: true,
      resumeId: resume.id,
      status: extractedData ? 'COMPLETED' : 'FAILED',
      extractedData,
    })
  } catch (error) {
    console.error('[upload]', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resumes = await prisma.uploadedResume.findMany({
    where: { userId: session.user.id },
    orderBy: { uploadedAt: 'desc' },
    select: {
      id: true, originalName: true, fileSize: true, mimeType: true,
      extractionStatus: true, uploadedAt: true, errorMessage: true,
    },
  })

  return NextResponse.json({ resumes })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Resume ID required' }, { status: 400 })

  const resume = await prisma.uploadedResume.findFirst({
    where: { id, userId: session.user.id }, // user ownership check
  })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.uploadedResume.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
