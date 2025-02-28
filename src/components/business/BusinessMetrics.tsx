import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Users2, Calendar, Star, DollarSign } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function BusinessMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['business-metrics'],
    queryFn: async () => {
      const { data } = await apiClient.reports.metrics();
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-x-3">
          <Users2 className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </p>
            <p className="text-2xl font-bold">
              {metrics?.total_customers || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-x-3">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Agendamentos
            </p>
            <p className="text-2xl font-bold">
              {metrics?.total_appointments || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-x-3">
          <DollarSign className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Faturamento Total
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(metrics?.total_revenue || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-x-3">
          <Star className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Avaliação Média
            </p>
            <p className="text-2xl font-bold">
              {metrics?.average_rating?.toFixed(1) || '0.0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}