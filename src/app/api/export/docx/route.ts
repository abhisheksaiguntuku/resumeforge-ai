export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle
} from 'docx'

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

  const data = resume.resumeData as Record<string, unknown>
  const sections = (data.sections as Array<{
    type: string; visible: boolean; order: number; content: Record<string, unknown>
  }> | undefined) ?? []

  const sorted = [...sections].sort((a, b) => a.order - b.order).filter(s => s.visible)

  const paragraphs: Paragraph[] = []

  for (const section of sorted) {
    const content = section.content as Record<string, unknown>

    if (section.type === 'personal') {
      const p = content as Record<string, string>
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: p.fullName ?? '', bold: true, size: 40 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: [p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | '),
            size: 18, color: '555555'
          })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })
      )
      continue
    }

    // Section heading
    const headingText = {
      summary: 'SUMMARY', education: 'EDUCATION', experience: 'EXPERIENCE',
      internships: 'INTERNSHIPS', projects: 'PROJECTS', skills: 'SKILLS',
      certifications: 'CERTIFICATIONS', achievements: 'ACHIEVEMENTS',
    }[section.type] ?? section.type.toUpperCase()

    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: headingText, bold: true, size: 22, allCaps: true })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1a1a1a' } },
        spacing: { before: 240, after: 80 },
      })
    )

    if (section.type === 'summary') {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: content.text as string ?? '', size: 20 })],
        spacing: { after: 120 },
      }))
    }

    if (['education', 'experience', 'internships', 'projects'].includes(section.type)) {
      const items = (content.items as Array<Record<string, unknown>>) ?? []
      for (const item of items) {
        const title = (item.jobTitle ?? item.degree ?? item.name ?? '') as string
        const subtitle = (item.company ?? item.institution ?? '') as string
        const dates = `${item.startDate ?? ''} – ${item.endDate ?? 'Present'}`

        paragraphs.push(new Paragraph({
          children: [
            new TextRun({ text: `${title}${subtitle ? ` — ${subtitle}` : ''}`, bold: true, size: 22 }),
          ],
          spacing: { before: 120, after: 40 },
        }))

        if (dates.trim() !== '–') {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: dates, size: 20, color: '555555' })],
            spacing: { after: 60 },
          }))
        }

        const bullets = (item.bullets as string[]) ?? []
        for (const bullet of bullets) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: bullet, size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 40 },
          }))
        }
      }
    }

    if (section.type === 'skills') {
      const cats = content as Record<string, string[]>
      for (const [cat, skills] of Object.entries(cats)) {
        if (!skills?.length) continue
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({ text: `${cat}: `, bold: true, size: 20 }),
            new TextRun({ text: skills.join(', '), size: 20 }),
          ],
          spacing: { after: 60 },
        }))
      }
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  })

  const buffer = await Packer.toBuffer(doc)
  const uint8Buffer = new Uint8Array(buffer)
  const filename = `${resume.name.replace(/[^a-zA-Z0-9-_ ]/g, '')}.docx`

  return new NextResponse(uint8Buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
