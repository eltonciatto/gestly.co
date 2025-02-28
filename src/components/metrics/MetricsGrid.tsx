import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { getDailyMetrics } from '@/lib/db/goals';
import { Calendar, DollarSign, Users, Star } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function MetricsGrid() {
  const { data: business } = useBusinessQuery();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['daily-metrics', business?.id],
    queryFn: async () => {
      if (!business?.id) return null;

      const today = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      return getDailyMetrics(
        business.id,
        startDate.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );
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

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return undefined;
    return Math.round(((current - previous) / previous) * 100);
  };

  const currentMetrics = metrics?.[metrics.length - 1]?.metrics;
  const previousMetrics = metrics?.[metrics.length - 2]?.metrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Faturamento"
        value={formatCurrency(currentMetrics?.revenue || 0)}
        change={calculateChange(
          currentMetrics?.revenue || 0,
          previousMetrics?.revenue || 0
        )}
        icon={DollarSign}
      />
      <MetricCard
        title="Agendamentos"
        value={currentMetrics?.appointments || 0}
        change={calculateChange(
          currentMetrics?.appointments || 0,
          previousMetrics?.appointments || 0
        )}
        icon={Calendar}
        description={`${currentMetrics?.completed_appointments || 0} realizados`}
      />
      <MetricCard
        title="Novos Clientes"
        value={currentMetrics?.new_customers || 0}
        change={calculateChange(
          currentMetrics?.new_customers || 0,
          previousMetrics?.new_customers || 0
        )}
        icon={Users}
      />
      <MetricCard
        title="Taxa de Ocupação"
        value={`${Math.round(currentMetrics?.occupancy_rate || 0)}%`}
        change={calculateChange(
          currentMetrics?.occupancy_rate || 0,
          previousMetrics?.occupancy_rate || 0
        )}
        icon={Star}
      />
    </div>
  );
}