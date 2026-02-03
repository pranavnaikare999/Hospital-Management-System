// prescription-warnings.ts
'use server';

/**
 * @fileOverview Suggests relevant warnings or side effects for a prescription based on the medication and patient history.
 *
 * - getPrescriptionWarnings - A function that suggests warnings for a given prescription.
 * - PrescriptionWarningsInput - The input type for the getPrescriptionWarnings function.
 * - PrescriptionWarningsOutput - The return type for the getPrescriptionWarnings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionWarningsInputSchema = z.object({
  medication: z.string().describe('The name of the prescribed medication.'),
  patientMedicalHistory: z.string().describe('The patient medical history.'),
});
export type PrescriptionWarningsInput = z.infer<typeof PrescriptionWarningsInputSchema>;

const PrescriptionWarningsOutputSchema = z.object({
  warnings: z.array(
    z.string().describe('A potential warning or side effect associated with the medication and patient history.')
  ).describe('A list of potential warnings and side effects.'),
});
export type PrescriptionWarningsOutput = z.infer<typeof PrescriptionWarningsOutputSchema>;

export async function getPrescriptionWarnings(input: PrescriptionWarningsInput): Promise<PrescriptionWarningsOutput> {
  return prescriptionWarningsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prescriptionWarningsPrompt',
  input: {schema: PrescriptionWarningsInputSchema},
  output: {schema: PrescriptionWarningsOutputSchema},
  prompt: `You are an expert pharmacist providing safety suggestions to doctors.

  Based on the prescribed medication and the patient's medical history, suggest any relevant warnings or side effects that the doctor should consider.
  These are merely suggestions, and the doctor's professional judgment should always take precedence.

  Medication: {{{medication}}}
  Patient Medical History: {{{patientMedicalHistory}}}

  Warnings:
  `,
});

const prescriptionWarningsFlow = ai.defineFlow(
  {
    name: 'prescriptionWarningsFlow',
    inputSchema: PrescriptionWarningsInputSchema,
    outputSchema: PrescriptionWarningsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
