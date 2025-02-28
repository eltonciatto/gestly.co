import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/lib/api/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBusinessQuery } from '@/lib/queries';
import { getAppointmentsByBusiness } from '@/lib/db/appointments';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AppointmentList() {
  const [search, setSearch] = useState('');
  const { data: business } = useBusinessQuery();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', business?.id, search],
      const { data } = await apiClient.appointments.list({
        search,
        orderBy: 'start_time'
      });
      return data;
    },
    enabled: !!business?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agendamentos</h2>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos e horários
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/appointments/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-x-2">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Buscar agendamentos..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum agendamento encontrado.
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col gap-4 p-4 rounded-lg border bg-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-x-2">
                  <span className="font-medium">
                    {appointment.customer.name}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status === 'scheduled' ? 'Agendado' :
                     appointment.status === 'confirmed' ? 'Confirmado' :
                     appointment.status === 'completed' ? 'Concluído' :
                     'Cancelado'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(parseISO(appointment.start_time), 'EEEE, dd/MM/yyyy HH:mm', { locale: ptBR })}
                </div>
              </div>
              <div className="space-y-1 sm:text-right">
                <div className="font-medium">{appointment.service.name}</div>
                <div className="text-sm text-muted-foreground">
                  {appointment.service.duration} min | R$ {appointment.service.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}