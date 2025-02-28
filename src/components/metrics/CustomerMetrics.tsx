import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export function CustomerMetrics() {
  const { data: business } = useBusinessQuery();

  const { data: metrics } = useQuery({
    queryKey: ['customer-metrics', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.reports.customerMetrics();
      return data;
    },
    enabled: !!business?.id
  });

  return (
    <div className="space-y-8">
      {/* Existing component content */}
    </div>
  );
}

export function SpecialDays() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: diasEspeciais = [], isLoading: isLoadingDias } = useQuery({
    queryKey: ['dias-especiais', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.settings.getSpecialDays();
      return data;
    },
    enabled: !!business?.id
  });

  // Rest of the SpecialDays component implementation
  return (
    <div className="space-y-8">
      {/* SpecialDays component content */}
    </div>
  );
}