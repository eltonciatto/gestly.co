import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PerformanceReport() {
   const { data: business } = useBusinessQuery();

   const { data: report } = useQuery({
     queryKey: ['performance-report', business?.id],
     queryFn: async () => {
       const { data } = await apiClient.reports.performance();
       return data;
     },
     enabled: !!business?.id
   });

   // Rest of the component would follow, but was not included in the original content
}