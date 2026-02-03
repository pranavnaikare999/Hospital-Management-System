'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createPrescription, suggestWarnings, type PrescriptionState } from '@/lib/actions';
import type { Patient } from '@/lib/definitions';
import { useEffect, useState } from 'react';

type PrescriptionFormProps = {
  patient: Patient;
  onFinished: () => void;
};

function SuggestButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" form="suggest-form" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Suggest Warnings
    </Button>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" form="create-form" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Create Prescription
    </Button>
  );
}

export function PrescriptionForm({ patient, onFinished }: PrescriptionFormProps) {
  const initialState: PrescriptionState = { message: null, errors: {}, warnings: [] };
  const [suggestState, suggestDispatch] = useFormState(suggestWarnings, initialState);
  const [createState, createDispatch] = useFormState(createPrescription, initialState);

  const [medication, setMedication] = useState('');
  
  useEffect(() => {
    if (createState.message === 'Prescription created successfully.') {
      onFinished();
    }
  }, [createState, onFinished]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="medication">Medication</Label>
        <Input
          id="medication"
          name="medication"
          type="text"
          className="w-full"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          form="suggest-form"
        />
        <div aria-live="polite" aria-atomic="true">
          {suggestState.errors?.medication &&
            suggestState.errors.medication.map((error: string) => (
              <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
            ))}
        </div>
      </div>
      
      {/* Hidden form for suggestion action */}
      <form id="suggest-form" action={suggestDispatch} className="hidden">
        <input type="hidden" name="medication" value={medication} />
        <input type="hidden" name="patientMedicalHistory" value={patient.medicalHistory} />
        <input type="hidden" name="dosage" value="dummy" />
        <input type="hidden" name="frequency" value="dummy" />
      </form>
      
      {/* Form for creation action */}
      <form id="create-form" action={createDispatch} className="space-y-4">
        <input type="hidden" name="patientId" value={patient.id} />
        <input type="hidden" name="medication" value={medication} />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" name="dosage" type="text" />
             <div aria-live="polite" aria-atomic="true">
                {createState.errors?.dosage &&
                    createState.errors.dosage.map((error: string) => (
                    <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                    ))}
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="frequency">Frequency</Label>
            <Input id="frequency" name="frequency" type="text" />
             <div aria-live="polite" aria-atomic="true">
                {createState.errors?.frequency &&
                    createState.errors.frequency.map((error: string) => (
                    <p className="mt-2 text-sm text-destructive" key={error}>{error}</p>
                    ))}
            </div>
          </div>
        </div>
      </form>

      {suggestState.warnings && suggestState.warnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Suggested Warnings</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {suggestState.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
       <div aria-live="polite" aria-atomic="true">
          {suggestState.message && suggestState.message !== "Suggestions loaded." &&(
            <p className="mt-2 text-sm text-destructive">{suggestState.message}</p>
          )}
           {createState.message && createState.message !== "Prescription created successfully." && (
            <p className="mt-2 text-sm text-destructive">{createState.message}</p>
          )}
      </div>

      <div className="flex justify-end gap-2">
        <SuggestButton />
        <CreateButton />
      </div>
    </div>
  );
}
