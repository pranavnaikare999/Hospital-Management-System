import { AppointmentScheduler } from "@/components/appointment-scheduler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AppointmentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Scheduler</CardTitle>
        <CardDescription>
          View and manage appointments for all doctors and patients.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AppointmentScheduler />
      </CardContent>
    </Card>
  );
}
