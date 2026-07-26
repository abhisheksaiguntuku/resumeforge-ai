import { put, del } from '@vercel/blob'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as crypto from 'crypto'

const IS_VERCEL = !!process.env.VERCEL
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export async function uploadFile(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ url: string; size: number }> {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const uniqueName = `${crypto.randomUUID()}-${sanitized}`

  if (IS_VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`resumes/${uniqueName}`, buffer, {
      access: 'public',
      contentType,
    })
    return { url: blob.url, size: buffer.length }
  }

  // Local filesystem fallback
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true })
  const filePath = path.join(LOCAL_UPLOAD_DIR, uniqueName)
  await fs.writeFile(filePath, buffer)
  return { url: `/api/files/${uniqueName}`, size: buffer.length }
}

export async function deleteFile(url: string): Promise<void> {
  if (url.startsWith('http') && IS_VERCEL) {
    await del(url)
  } else {
    const filename = url.split('/').pop()
    if (filename) {
      const filePath = path.join(LOCAL_UPLOAD_DIR, filename)
      await fs.unlink(filePath).catch(() => {})
    }
  }
}
