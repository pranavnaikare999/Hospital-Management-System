'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Patient } from '@/lib/definitions';
import type { PatientState } from '@/lib/actions';

type PatientFormProps = {
  patient?: Patient;
  action: (prevState: PatientState, formData: FormData) => Promise<PatientState>;
};

function SubmitButton({ isUpdate }: { isUpdate: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isUpdate ? 'Updating...' : 'Creating...') : (isUpdate ? 'Update Patient' : 'Create Patient')}
    </Button>
  );
}

export function PatientForm({ patient, action }: PatientFormProps) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(action, initialState);

  return (
    <form action={dispatch}>
      <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
            <CardDescription>
              Fill in the details for the patient record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full"
                  defaultValue={patient?.name}
                  aria-describedby="name-error"
                />
                <div id="name-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.name &&
                    state.errors.name.map((error: string) => (
                      <p className="mt-2 text-sm text-destructive" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="grid gap-3">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="text"
                      placeholder="DD-MM-YYYY"
                      defaultValue={patient?.dateOfBirth}
                      aria-describedby="dob-error"
                    />
                     <div id="dob-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.dateOfBirth &&
                        state.errors.dateOfBirth.map((error: string) => (
                          <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                  </div>
                 <div className="grid gap-3">
                  <Label htmlFor="gender">Gender</Label>
                   <Select name="gender" defaultValue={patient?.gender}>
                    <SelectTrigger aria-describedby="gender-error">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                   <div id="gender-error" aria-live="polite" aria-atomic="true">
                      {state.errors?.gender &&
                        state.errors.gender.map((error: string) => (
                          <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="contact">Contact Email</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="email"
                  defaultValue={patient?.contact}
                  aria-describedby="contact-error"
                />
                 <div id="contact-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.contact &&
                    state.errors.contact.map((error: string) => (
                      <p className="mt-2 text-sm text-destructive" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  defaultValue={patient?.address}
                  aria-describedby="address-error"
                />
                 <div id="address-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.address &&
                    state.errors.address.map((error: string) => (
                      <p className="mt-2 text-sm text-destructive" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  defaultValue={patient?.medicalHistory}
                  className="min-h-32"
                />
              </div>
               <div id="form-error" aria-live="polite" aria-atomic="true">
                {state.message && (
                  <p className="mt-2 text-sm text-destructive">{state.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2 md:ml-auto">
                 <Button variant="outline" asChild>
                    <Link href={patient ? `/dashboard/patients/${patient.id}` : "/dashboard/patients"}>Cancel</Link>
                </Button>
                <SubmitButton isUpdate={!!patient} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
