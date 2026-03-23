import { z } from 'zod';

/**
 * Output schema for the AI analysis response.
 * Strictly enforced to ensure medical data safety and UI consistency.
 */
export const AnalysisSchema = z.object({
  diagnosis: z.string().describe("Simplified common-language diagnosis"),
  
  medications: z.array(z.object({
    name: z.string().describe("Name of the medicine"),
    dosage: z.string().describe("Specific dosage instructions (e.g. 500mg)"),
    timing: z.string().describe("When to take (e.g. After breakfast)"),
    duration: z.string().describe("How long to take (e.g. 5 days)")
  })).describe("List of prescribed medications extracted verbatim"),

  sideEffects: z.array(z.object({
    effect: z.string().describe("Possible side effect"),
    action: z.string().describe("What to do if it occurs (strictly extraction)")
  })).describe("Documented side effects and prescribed actions"),

  followUp: z.array(z.string()).describe("List of follow-up steps or tests"),

  familySummary: z.string().describe("Single-sentence high-level summary for caregivers"),

  originalText: z.string().optional().describe("References the source text for comparison view")
});

export type Analysis = z.infer<typeof AnalysisSchema>;
