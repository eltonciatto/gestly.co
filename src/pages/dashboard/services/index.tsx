import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api/client';

export default function Services() {
  const [search, setSearch] = useState('');
  const { data: business } = useBusinessQuery();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', business?.id, search],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data } = await apiClient.services.list({
        search,
        orderBy: 'name'
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
          <h2 className="text-2xl font-bold tracking-tight">Serviços</h2>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
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
              placeholder="Buscar serviços..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum serviço encontrado.
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col p-4 rounded-lg border bg-card"
            >
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
                  <span className="font-medium">{service.duration} min</span>
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
          ))
        )}
      </div>
    </div>
  );
}