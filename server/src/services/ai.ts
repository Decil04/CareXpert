import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisSchema } from '../utils/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const SYSTEM_PROMPT = `
You are a Medical Extraction Specialist. Your task is to extract information from medical documents and simplify them for patients.
STRICT RULES:
1. Extract ONLY information present in the document.
2. DO NOT add medical advice, alternative dosages, or external knowledge.
3. If a field is missing, set it to null.
4. Medications must be extracted VERBATIM (Exact name, dosage, timing).
5. Diagnosis and Family Summary should be simplified to a 6th-grade reading level.
6. Return a valid JSON object matching the requested schema.
`;

interface AnalysisMetadata {
  age?: string | number | null | undefined;
  language?: string | undefined;
}

/**
 * Sends extracted text to Claude for structured analysis.
 */
export async function analyseText(text: string, metadata: AnalysisMetadata = {}): Promise<any> {
  const { age, language = 'en' } = metadata;

  const isMockMode = 
    !process.env.GOOGLE_API_KEY || 
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test';

  // Use mock if API key is missing / placeholder or explicitly in dev/test mode
  if (isMockMode) {
    return mockAnalyseText(text, metadata);
  }

  const userPrompt = `
    ${SYSTEM_PROMPT}

    Document Text:
    ---
    ${text}
    ---
    Metadata: 
    - Patient Age: ${age || 'Unknown'}
    - Preferred Language: ${language}
    
    Extract the diagnosis, medications, side effects, follow-up, and family summary.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    // Sometimes Gemini wraps JSON in markdown blocks like ```json ... ```
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Validate with Zod
    const validated = AnalysisSchema.parse({
      ...parsed,
      originalText: text
    });

    return validated;
  } catch (error) {
    console.error('[AI Service] Error:', error);
    throw new Error('AI analysis failed. Please try again or check the console.');
  }
}

/**
 * Deterministic mock response for development without API credits.
 */
async function mockAnalyseText(text: string, metadata: AnalysisMetadata): Promise<any> {
  console.log('[AI Service:Mock] Returning mock analysis for dev/testing');
  
  return {
    diagnosis: "General Respiratory Infection (Simplified)",
    medications: [
      { name: "Amoxicillin", dosage: "500mg", timing: "Three times a day after meals", duration: "7 days" },
      { name: "Paracetamol", dosage: "650mg", timing: "Every 6 hours if fever occurs", duration: "3 days" }
    ],
    sideEffects: [
      { effect: "Dizziness", action: "Stop medication and contact doctor immediately" },
      { effect: "Stomach Upset", action: "Take medicine after a full meal" }
    ],
    followUp: [
      "Return in 7 days for chest measurement",
      "Blood test if fever persists beyond 3 days"
    ],
    familySummary: "The patient has a minor lung infection and needs to finish a week-long course of antibiotics.",
    originalText: text
  };
}
