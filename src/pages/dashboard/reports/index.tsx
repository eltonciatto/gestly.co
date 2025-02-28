import { useBusinessQuery } from '@/lib/queries';
import { MetricsGrid } from '@/components/metrics/MetricsGrid';
import { AppointmentsChart } from '@/components/metrics/AppointmentsChart';
import { ServicesChart } from '@/components/metrics/ServicesChart';
import { CustomerMetrics } from '@/components/metrics/CustomerMetrics';
import { LoyaltyMetrics } from '@/components/metrics/LoyaltyMetrics';

export default function Reports() {
  const { data: business, isLoading } = useBusinessQuery();

  if (isLoading) {
    return <div className="flex items-center justify-center">Carregando métricas...</div>;
  }
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatórios</h2>
        <p className="text-muted-foreground">
          Acompanhe o desempenho do seu negócio nos últimos 30 dias
        </p>
      </div>

      <MetricsGrid />

      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentsChart />
        <ServicesChart />
        <CustomerMetrics />
        <LoyaltyMetrics />
      </div>
    </div>
  );
}