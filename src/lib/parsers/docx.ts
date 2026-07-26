import mammoth from 'mammoth'

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('EMPTY_DOCUMENT: The uploaded DOCX file appears to be empty.')
    }
    return result.value
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    if (msg.startsWith('EMPTY_DOCUMENT')) throw error
    throw new Error(`DOCX_PARSE_ERROR: ${msg}`)
  }
}

export async function extractHTMLFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.convertToHtml({ buffer })
  return result.value
}
