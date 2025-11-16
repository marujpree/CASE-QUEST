const pdfParse = require('pdf-parse');

/**
 * Extract text content from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF file');
  }
}

/**
 * Extract text and metadata from PDF
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<Object>} - Object containing text and metadata
 */
async function parsePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      version: data.version
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

module.exports = {
  extractTextFromPDF,
  parsePDF
};
