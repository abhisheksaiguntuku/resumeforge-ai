export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const PDFParser = require("pdf2json")
      const pdfParser = new PDFParser(null, 1)

      pdfParser.on("pdfParser_dataError", (errData: any) => {
        const msg = errData?.parserError?.message || 'Unknown error'
        reject(new Error(`PDF_PARSE_ERROR: ${msg}`))
      })

      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent())
      })

      pdfParser.parseBuffer(buffer)
    } catch (err) {
      reject(err)
    }
  })
}
