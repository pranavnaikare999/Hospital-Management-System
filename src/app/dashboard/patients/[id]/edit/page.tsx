import { PatientForm } from '@/components/patient-form';
import { updatePatient } from '@/lib/actions';
import { patients } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    notFound();
  }

  const updatePatientWithId = updatePatient.bind(null, id);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button asChild variant="outline" size="icon" className="h-7 w-7">
            <Link href={`/dashboard/patients/${id}`}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Edit Patient
          </h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <PatientForm patient={patient} action={updatePatientWithId} />
        </main>
      </div>
    </div>
  );
}
