export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { improveBullet } from '@/lib/ai/generate'


export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bullet, mode, context } = await req.json()
  if (!bullet || !mode) return NextResponse.json({ error: 'bullet and mode are required' }, { status: 400 })

  const result = await improveBullet(bullet, mode, context)
  return NextResponse.json(result)
}
