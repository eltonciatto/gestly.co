import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description?: string;
    duration: number;
    price: number;
    commission_percentage: number;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
    }
    return `${minutes}min`;
  }

  return (
    <div className="flex flex-col p-4 rounded-lg border bg-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">{service.name}</h3>
          {service.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {service.description}
            </p>
          )}
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to={`/dashboard/services/${service.id}`}>
            Editar
          </Link>
        </Button>
      </div>
      
      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duração:</span>
          <span className="font-medium">{formatDuration(service.duration)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Preço:</span>
          <span className="font-medium">
            R$ {service.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Comissão:</span>
          <span className="font-medium">
            {service.commission_percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}