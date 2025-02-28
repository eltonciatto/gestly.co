import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Star, Gift, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

interface CustomerPortalProps {
  customerId: string;
}

export function CustomerPortal({ customerId }: CustomerPortalProps) {
   const [activeTab, setActiveTab] = useState<'appointments' | 'loyalty' | 'profile'>('appointments');

   const { data: customer } = useQuery({
     queryKey: ['customer-portal', customerId],
     queryFn: async () => {
      const { data } = await apiClient.customers.get(customerId);
      return data;
     }
   });

   const { data: appointments } = useQuery({
     queryKey: ['customer-appointments', customerId],
     queryFn: async () => {
      const { data } = await apiClient.appointments.list({
        customerId,
        orderBy: '-start_time'
      });
      return data;
     }
   });

   const { data: loyalty } = useQuery({
     queryKey: ['customer-loyalty', customerId],
     queryFn: async () => {
      const { data } = await apiClient.loyalty.getPoints(customerId);
      return data;
     }
   });