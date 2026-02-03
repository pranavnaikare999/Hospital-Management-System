'use client';

import * as React from 'react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { appointments, doctors, patients } from '@/lib/mock-data';

export function AppointmentScheduler() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const weekStartsOn = 1; // Monday
  const week = Array.from({ length: 7 }).map((_, i) =>
    addDays(startOfWeek(currentDate, { weekStartsOn }), i)
  );
  
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`); // 8am to 5pm

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(week[0], 'MMMM d')} - {format(week[6], 'MMMM d, yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
         <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Appointment
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                        Select a patient, doctor, and time for the appointment.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="patient">Patient</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a patient" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="doctor">Doctor</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-2">Schedule Appointment</Button>
                </div>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-7 border-t border-l">
        {week.map(day => (
          <div key={day.toString()} className="border-r text-center py-2">
            <p className={cn("text-sm", isSameDay(day, new Date()) && "text-primary font-bold")}>
              {format(day, 'EEE')}
            </p>
            <p className={cn("font-semibold", isSameDay(day, new Date()) && "text-primary")}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l relative">
         <div className="absolute top-0 -left-16 w-14 text-right">
          {timeSlots.map(time => (
            <div key={time} className="h-20 flex items-start justify-end pr-2">
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
          ))}
        </div>
        {week.map(day => (
          <div key={day.toString()} className="border-r h-full relative">
            {timeSlots.map(time => (
                 <div key={time} className="h-20 border-t" />
            ))}
             {appointments
              .filter(app => isSameDay(new Date(app.date), day))
              .map(app => {
                const patient = patients.find(p => p.id === app.patientId);
                const doctor = doctors.find(d => d.id === app.doctorId);
                const top = timeSlots.indexOf(app.time) * 5; // 5rem per hour (h-20)
                if (top < 0) return null;

                return (
                  <div
                    key={app.id}
                    className="absolute w-full p-1"
                    style={{ top: `${top}rem`}}
                  >
                    <div className="bg-secondary p-2 rounded-lg shadow-sm cursor-pointer hover:bg-primary/20">
                      <p className="font-semibold text-xs text-secondary-foreground">{patient?.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor?.name}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
