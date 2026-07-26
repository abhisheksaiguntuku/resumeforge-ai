export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Resume ID required' }, { status: 400 })

  const resume = await prisma.resumeVersion.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Dynamic import to avoid SSR issues with @react-pdf/renderer
  try {
    const { renderToBuffer } = await import('@react-pdf/renderer')
    const { createElement } = await import('react')
    const { ResumePDF } = await import('@/lib/export/pdf-template')

    const element = createElement(ResumePDF, {
      data: resume.resumeData as Record<string, unknown>,
      templateId: resume.templateId,
      fontFamily: resume.fontFamily,
      fontSize: resume.fontSize,
    })

    // @ts-expect-error renderToBuffer accepts ReactElement
    const pdfBuffer = await renderToBuffer(element)
    const filename = `${resume.name.replace(/[^a-zA-Z0-9-_ ]/g, '_')}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('[pdf export]', error)
    return NextResponse.json({ error: 'PDF generation failed. Please try again.' }, { status: 500 })
  }
}
