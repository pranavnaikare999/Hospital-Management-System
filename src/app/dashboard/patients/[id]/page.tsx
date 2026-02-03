'use client';

import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, FileText, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { patients, prescriptions, doctors } from '@/lib/mock-data';
import { PrescriptionForm } from '@/components/prescription-form';

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const id = params.id;
  const patient = patients.find((p) => p.id === id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === id);

  if (!patient) {
    notFound();
  }

  const handlePrescriptionCreated = () => {
    setDialogOpen(false);
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-7 w-7">
          <Link href="/dashboard/patients">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {patient.name}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm">
            <Link href={`/dashboard/patients/${id}/edit`}>Edit Patient</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback>{patient.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription>{patient.contact}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold text-muted-foreground">Gender:</span>
              <span>{patient.gender}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold text-muted-foreground">DoB:</span>
              <span>{patient.dateOfBirth}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold text-muted-foreground">Address:</span>
              <span>{patient.address}</span>
            </div>
          </CardContent>
        </Card>
        <div className="grid auto-rows-max gap-4 lg:col-span-2">
           <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{patient.medicalHistory || 'No significant medical history provided.'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Prescriptions</CardTitle>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <PlusCircle className="h-4 w-4" />
                      Add Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Add New Prescription</DialogTitle>
                      <DialogDescription>
                        Fill in the medication details and get AI-powered warnings.
                      </DialogDescription>
                    </DialogHeader>
                    <PrescriptionForm patient={patient} onFinished={handlePrescriptionCreated} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Prescribed by</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientPrescriptions.length > 0 ? (
                    patientPrescriptions.map((p) => {
                      const doctor = doctors.find(d => d.id === p.doctorId);
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.medication}</TableCell>
                          <TableCell>{p.dosage}</TableCell>
                          <TableCell>{doctor?.name || 'Unknown'}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground my-2" />
                        No prescriptions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
