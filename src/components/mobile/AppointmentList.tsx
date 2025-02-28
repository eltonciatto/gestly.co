import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, User } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export function AppointmentList() {
   const [selectedDate, setSelectedDate] = useState(new Date());

   const { data: appointments = [], isLoading } = useQuery({
     queryKey: ['mobile-appointments', selectedDate],
     queryFn: async () => {
      const { data } = await apiClient.appointments.list({
        date: selectedDate.toISOString().split('T')[0],
        status: 'scheduled',
        orderBy: 'start_time'
      });
      return data;
     }
   });