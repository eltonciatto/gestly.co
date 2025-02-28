import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppointmentStatus } from './AppointmentStatus';

interface AppointmentCardProps {
  appointment: {
    id: string;
    customer: {
      name: string;
    };
    service: {
      name: string;
      price: number;
    };
    start_time: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  };
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-x-2">
          <span className="font-medium">
            {appointment.customer.name}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {appointment.service.name} - R$ {appointment.service.price.toFixed(2)}
        </div>
        <div className="text-sm font-medium">
          {format(parseISO(appointment.start_time), "d 'de' MMMM 'às' HH:mm", {
            locale: ptBR,
          })}
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <AppointmentStatus
          appointmentId={appointment.id}
          currentStatus={appointment.status}
          size="sm"
        />
        <Button asChild variant="outline" size="sm">
          <Link to={`/dashboard/appointments/${appointment.id}`}>
            Detalhes
          </Link>
        </Button>
      </div>
    </div>
  );
}