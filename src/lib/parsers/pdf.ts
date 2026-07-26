export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const parse = pdfParse.default || pdfParse
    const data = await parse(buffer)
    return data.text as string
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    if (msg.toLowerCase().includes('password')) {
      throw new Error('PASSWORD_PROTECTED: This PDF is password-protected. Please remove the password and re-upload.')
    }
    throw new Error(`PDF_PARSE_ERROR: ${msg}`)
  }
}
