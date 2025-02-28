import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export function RevenueProjection() {
   const { data: business } = useBusinessQuery();

   const { data: projection } = useQuery({
     queryKey: ['revenue-projection', business?.id],
     queryFn: async () => {
      const { data } = await apiClient.reports.projection({
        months: 6
      });
      return data;
     },
     enabled: !!business?.id
   });
}