import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function CustomerList() {
  const [search, setSearch] = useState('');
  const { data: business } = useBusinessQuery();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', business?.id, search],
    queryFn: async () => {
      let sql = `
        SELECT * FROM customers 
        WHERE business_id = $1
      `;
      const params = [business.id];
      const { data } = await apiClient.customers.list({
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
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e visualize seus históricos
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/customers/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
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
              placeholder="Buscar clientes..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {customers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cliente encontrado.
          </div>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              className="flex flex-col gap-4 p-4 rounded-lg border bg-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-x-2">
                  <span className="font-medium">{customer.name}</span>
                  {customer.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {customer.email || 'Email não informado'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {customer.phone}
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/dashboard/appointments/new?customer=${customer.id}`}>
                    Agendar
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/dashboard/customers/${customer.id}`}>
                    Detalhes
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}