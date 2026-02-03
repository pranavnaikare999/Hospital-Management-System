'use client';

import * as React from 'react';
import { Users, Calendar, FileText, Activity } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { appointments, patients, prescriptions } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  appointments: {
    label: 'Appointments',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [today, setToday] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Generate chart data and get today's date on the client to avoid hydration mismatch
    const generateChartData = () => [
      { day: 'Mon', appointments: Math.floor(Math.random() * 10) + 1 },
      { day: 'Tue', appointments: Math.floor(Math.random() * 10) + 1 },
      { day: 'Wed', appointments: Math.floor(Math.random() * 10) + 1 },
      { day: 'Thu', appointments: Math.floor(Math.random() * 10) + 1 },
      { day: 'Fri', appointments: Math.floor(Math.random() * 10) + 1 },
      { day: 'Sat', appointments: Math.floor(Math.random() * 5) },
      { day: 'Sun', appointments: Math.floor(Math.random() * 5) },
    ];
    setChartData(generateChartData());
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const totalPrescriptions = prescriptions.length;

  const appointmentsToday = today ? appointments.filter((a) => a.date === today) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={totalPatients.toString()}
          description="All registered patients"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Appointments Today"
          value={appointmentsToday.length.toString()}
          description={`${totalAppointments} total scheduled`}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Prescriptions Issued"
          value={totalPrescriptions.toString()}
          description="Total prescriptions created"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Clinic Activity"
          value="High"
          description="Based on recent activity"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Appointments This Week</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="appointments"
                    fill="var(--color-appointments)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] w-full items-center justify-center">
                <p className="text-muted-foreground">Loading chart...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              {today
                ? `You have ${appointmentsToday.length} appointments today.`
                : 'Loading appointments...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {today ? (
                  appointmentsToday.length > 0 ? (
                    appointmentsToday.map((appointment) => {
                      const patient = patients.find(
                        (p) => p.id === appointment.patientId
                      );
                      return (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage
                                  src={patient?.avatarUrl}
                                  alt={patient?.name || 'Patient avatar'}
                                />
                                <AvatarFallback>
                                  {patient?.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{patient?.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {appointment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No appointments today.
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
