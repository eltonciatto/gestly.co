import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api/client';

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const { data } = await apiClient.appointments.get(id!);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center">
        <p>Agendamento não encontrado</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate('/dashboard/appointments')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/appointments')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          Detalhes do Agendamento
        </h2>
        <p className="text-muted-foreground">
          {format(parseISO(appointment.start_time), "d 'de' MMMM 'às' HH:mm", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Cliente</h3>
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Nome:</span>{' '}
                {appointment.customer.name}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{' '}
                {appointment.customer.email || 'Não informado'}
              </p>
              <p>
                <span className="text-muted-foreground">Telefone:</span>{' '}
                {appointment.customer.phone}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Serviço</h3>
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Nome:</span>{' '}
                {appointment.service.name}
              </p>
              <p>
                <span className="text-muted-foreground">Duração:</span>{' '}
                {appointment.service.duration} minutos
              </p>
              <p>
                <span className="text-muted-foreground">Valor:</span>{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(appointment.service.price)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Profissional</h3>
            <div className="space-y-2">
              <p>
                <span className="text-muted-foreground">Nome:</span>{' '}
                {appointment.attendant?.full_name || 'Não atribuído'}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Status</h3>
            <div className="space-y-4">
              <div className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {appointment.status === 'scheduled' ? 'Agendado' :
                 appointment.status === 'confirmed' ? 'Confirmado' :
                 appointment.status === 'completed' ? 'Concluído' :
                 'Cancelado'}
              </div>

              {appointment.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações:</p>
                  <p className="text-sm mt-1">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}