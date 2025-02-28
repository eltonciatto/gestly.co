import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Appointment = {
  id: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
};

function getStatusColor(status: Appointment['status']) {
  switch (status) {
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status: Appointment['status']) {
  switch (status) {
    case 'scheduled':
      return 'Agendado';
    case 'confirmed':
      return 'Confirmado';
    case 'completed':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

function formatDate(date: string) {
  const parsedDate = parseISO(date);
  if (isToday(parsedDate)) {
    return `Hoje às ${format(parsedDate, 'HH:mm')}`;
  }
  if (isTomorrow(parsedDate)) {
    return `Amanhã às ${format(parsedDate, 'HH:mm')}`;
  }
  return format(parsedDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
}

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const supabase = useSupabaseClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: async () => {
      const sql = `
        SELECT 
          a.*,
          c.id as customer_id,
          c.name as customer_name,
          c.phone as customer_phone,
          s.id as service_id,
          s.name as service_name,
          s.duration,
          s.price
        FROM appointments a
        LEFT JOIN customers c ON a.customer_id = c.id
        LEFT JOIN services s ON a.service_id = s.id
        WHERE a.business_id = $1
        ORDER BY a.start_time ASC
      `;
      
      return query(sql, [business.id]);
    },
  });

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

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Carregando agendamentos...</div>
        ) : appointments.length > 0 ? (
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
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {appointment.service.name} - R${' '}
                  {appointment.service.price.toFixed(2)}
                </div>
                <div className="text-sm font-medium">
                  {formatDate(appointment.start_time)}
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/dashboard/appointments/${appointment.id}`}>
                    Detalhes
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum agendamento encontrado.
          </div>
        )}
      </div>
    </div>
  );
}