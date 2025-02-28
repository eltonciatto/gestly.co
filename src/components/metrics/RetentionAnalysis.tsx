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
import { Users2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function RetentionAnalysis() {
   const { data: business } = useBusinessQuery();

   const { data: metrics } = useQuery({
     queryKey: ['retention-metrics', business?.id],
     queryFn: async () => {
      const { data } = await apiClient.reports.retention({
        days: 30
      });
      return data;
     },
     enabled: !!business?.id
   });
}