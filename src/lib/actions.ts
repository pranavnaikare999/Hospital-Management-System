'use server';

import { getPrescriptionWarnings } from '@/ai/flows/prescription-warnings';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const PatientFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  dateOfBirth: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date must be in DD-MM-YYYY format.' }),
  gender: z.enum(['Male', 'Female', 'Other']),
  contact: z.string().email({ message: 'Invalid email address.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  medicalHistory: z.string(),
});

const CreatePatient = PatientFormSchema.omit({ id: true });

export type PatientState = {
  errors?: {
    name?: string[];
    dateOfBirth?: string[];
    gender?: string[];
    contact?: string[];
    address?: string[];
    medicalHistory?: string[];
  };
  message?: string | null;
};

export async function createPatient(prevState: PatientState, formData: FormData) {
  const validatedFields = CreatePatient.safeParse({
    name: formData.get('name'),
    dateOfBirth: formData.get('dateOfBirth'),
    gender: formData.get('gender'),
    contact: formData.get('contact'),
    address: formData.get('address'),
    medicalHistory: formData.get('medicalHistory'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Patient.',
    };
  }

  // Here you would typically insert the data into your database
  console.log('Creating new patient:', validatedFields.data);
  // Simulate database operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  revalidatePath('/dashboard/patients');
  redirect('/dashboard/patients');
}

export async function updatePatient(id: string, prevState: PatientState, formData: FormData) {
   const validatedFields = CreatePatient.safeParse({
    name: formData.get('name'),
    dateOfBirth: formData.get('dateOfBirth'),
    gender: formData.get('gender'),
    contact: formData.get('contact'),
    address: formData.get('address'),
    medicalHistory: formData.get('medicalHistory'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Patient.',
    };
  }
  
  // Here you would typically update the data in your database
  console.log('Updating patient:', id, validatedFields.data);
  await new Promise(resolve => setTimeout(resolve, 1000));

  revalidatePath(`/dashboard/patients`);
  revalidatePath(`/dashboard/patients/${id}`);
  redirect(`/dashboard/patients/${id}`);
}


const PrescriptionFormSchema = z.object({
  medication: z.string().min(2, { message: 'Medication name is required.' }),
  dosage: z.string().min(1, { message: 'Dosage is required.' }),
  frequency: z.string().min(1, { message: 'Frequency is required.' }),
  patientMedicalHistory: z.string(),
});

export type PrescriptionState = {
  warnings?: string[];
  errors?: {
    medication?: string[];
    dosage?: string[];
    frequency?: string[];
  },
  message?: string | null;
};


export async function suggestWarnings(prevState: PrescriptionState, formData: FormData) {
  const validatedFields = PrescriptionFormSchema.safeParse({
    medication: formData.get('medication'),
    dosage: formData.get('dosage'),
    frequency: formData.get('frequency'),
    patientMedicalHistory: formData.get('patientMedicalHistory'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to get suggestions.',
    };
  }
  
  const { medication, patientMedicalHistory } = validatedFields.data;

  try {
    const result = await getPrescriptionWarnings({ medication, patientMedicalHistory });
    return {
      ...prevState,
      warnings: result.warnings,
      errors: {},
      message: 'Suggestions loaded.',
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      warnings: [],
      message: 'Failed to get suggestions from AI.',
    };
  }
}

export async function createPrescription(prevState: PrescriptionState, formData: FormData) {
  // Logic to save the prescription to the database
  console.log('Creating prescription:', {
    medication: formData.get('medication'),
    dosage: formData.get('dosage'),
    frequency: formData.get('frequency'),
    patientId: formData.get('patientId'),
  });

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const patientId = formData.get('patientId');
  revalidatePath(`/dashboard/patients/${patientId}`);
  
  return {
    warnings: [],
    errors: {},
    message: 'Prescription created successfully.'
  }
}
