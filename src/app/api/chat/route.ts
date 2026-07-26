import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Groq from 'groq-sdk'

// We will use the same Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 })
    }

    // Fetch user profile to inject context
    const profile = await prisma.careerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        skills: true,
        experience: {
          orderBy: { startDate: 'desc' },
          take: 3, // Just recent ones for context limit
        },
        education: {
          orderBy: { startDate: 'desc' },
          take: 1,
        }
      }
    })

    const systemPrompt = `You are a friendly, highly expert Career Coach AI. Your goal is to help the user improve their resume, find industry trends, suggest missing skills, and give actionable career advice. 

    The user's current Career Profile (which you must use to give tailored advice):
    ${JSON.stringify(profile)}

    Rules:
    1. Be concise, friendly, and professional (like an expert friend).
    2. Don't invent skills for the user. Base your advice on their actual profile.
    3. If they ask about jobs, recommend roles that fit their skills.
    4. Format your response in clean markdown (bullet points, bold text).
    5. Always refer to their actual experience from the context provided above.`

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ]

    // Create streaming completion
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: formattedMessages as any,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Create a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(new TextEncoder().encode(content))
            }
          }
        } catch (err) {
          console.error('Stream error:', err)
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('[chat error]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
