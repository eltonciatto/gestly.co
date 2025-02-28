import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { query } from '@/lib/db';
import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface AppointmentStatusProps {
  appointmentId: string;
  currentStatus: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  size?: 'sm' | 'default';
}

export function AppointmentStatus({ appointmentId, currentStatus, size = 'default' }: AppointmentStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getStatusColor = (status: typeof currentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusText = (status: typeof currentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
    }
  };

  const updateStatus = useMutation({
    mutationFn: async (newStatus: typeof currentStatus) => {
      const sql = `
        UPDATE appointments 
        SET status = $2, updated_at = NOW()
        WHERE id = $1
      `;
      await query(sql, [appointmentId, newStatus]);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (_, newStatus) => {
      queryClient.invalidateQueries(['appointments']);
      toast({
        title: 'Status atualizado',
        description: `Agendamento ${getStatusText(newStatus).toLowerCase()}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleStatusChange = (newStatus: typeof currentStatus) => {
    updateStatus.mutate(newStatus);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className={cn(
        'px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1',
        getStatusColor(currentStatus)
      )}>
        {currentStatus === 'scheduled' && <Clock className="h-3 w-3" />}
        {currentStatus === 'confirmed' && <AlertCircle className="h-3 w-3" />}
        {currentStatus === 'completed' && <Check className="h-3 w-3" />}
        {currentStatus === 'cancelled' && <X className="h-3 w-3" />}
        {getStatusText(currentStatus)}
      </div>

      {currentStatus !== 'confirmed' && currentStatus !== 'cancelled' && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleStatusChange('confirmed')}
          disabled={isLoading}
        >
          Confirmar
        </Button>
      )}

      {currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleStatusChange('completed')}
          disabled={isLoading}
        >
          Concluir
        </Button>
      )}

      {currentStatus !== 'cancelled' && (
        <Button
          variant="outline"
          size={size}
          onClick={() => handleStatusChange('cancelled')}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      )}
    </div>
  );
}