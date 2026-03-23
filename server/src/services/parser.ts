import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

import Tesseract from 'tesseract.js';

/**
 * Main entry point for text extraction from multimodal inputs.
 * @param {Express.Multer.File} file - The file object from Multer (memoryStorage)
 * @returns {Promise<string>} - Extracted text contents
 */
export async function extractText(file: Express.Multer.File): Promise<string> {
  const mimetype = file.mimetype;
  const buffer = file.buffer;

  if (mimetype === 'application/pdf') {
    return parsePDF(buffer);
  }

  if (mimetype.startsWith('image/')) {
    return parseImage(buffer);
  }

  if (mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported MIME type: ${mimetype}`);
}

/**
 * Extracts text from a PDF buffer.
 */
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const data = await (pdf as any)(buffer);
    return data.text;
  } catch (error) {
    console.error('[Parser:PDF] Error:', error);
    throw new Error('Failed to parse PDF document.');
  }
}

/**
 * Extracts text from an image buffer using OCR.
 */
async function parseImage(buffer: Buffer): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng+hin', {
      logger: m => console.log(`[Parser:OCR] ${m.status}: ${Math.round(m.progress * 100)}%`)
    });
    return text;
  } catch (error) {
    console.error('[Parser:OCR] Error:', error);
    throw new Error('Failed to perform OCR on image.');
  }
}
