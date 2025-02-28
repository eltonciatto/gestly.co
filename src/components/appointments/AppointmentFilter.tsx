import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AppointmentFilterProps {
  onFilterChange: (filter: string) => void;
  onStatusChange: (status: string) => void;
  currentFilter: string;
  currentStatus: string;
}

export function AppointmentFilter({
  onFilterChange,
  onStatusChange,
  currentFilter,
  currentStatus,
}: AppointmentFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          variant={currentStatus === 'all' ? 'secondary' : 'ghost'}
          onClick={() => onStatusChange('all')}
        >
          Todos
        </Button>
        <Button
          variant={currentStatus === 'scheduled' ? 'secondary' : 'ghost'}
          onClick={() => onStatusChange('scheduled')}
        >
          Agendados
        </Button>
        <Button
          variant={currentStatus === 'confirmed' ? 'secondary' : 'ghost'}
          onClick={() => onStatusChange('confirmed')}
        >
          Confirmados
        </Button>
        <Button
          variant={currentStatus === 'completed' ? 'secondary' : 'ghost'}
          onClick={() => onStatusChange('completed')}
        >
          Concluídos
        </Button>
      </div>
    </div>
  );
}