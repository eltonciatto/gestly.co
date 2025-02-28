import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useBusinessQuery } from '@/lib/queries';
import { CalendarDays, Users, Briefcase, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentCustomer {
  id: string;
}

export default function Overview() {
  const supabase = useSupabaseClient();
  const { data: business } = useBusinessQuery();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['overview-stats', business?.id],
    queryFn: async () => {
      if (!business?.id) return null;

      const [appointments, customers, services] = await Promise.all([
        supabase
          .from('appointments')
          .select('id')
          .eq('business_id', business.id)
          .eq('status', 'scheduled')
          .gte('start_time', new Date().toISOString().split('T')[0])
          .lte('start_time', new Date().toISOString().split('T')[0] + ' 23:59:59'),

        supabase
          .from('customers')
          .select('id')
          .eq('business_id', business.id),

        supabase
          .from('services')
          .select('id')
          .eq('business_id', business.id)
      ]);

      return {
        appointments: appointments.data?.length || 0,
        customers: customers.data?.length || 0,
        services: services.data?.length || 0
      };
    },
    enabled: !!business?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Agendamentos"
          value={stats?.appointments.toString() || "0"}
          description="Hoje"
          icon={CalendarDays}
          href="/dashboard/appointments"
          color="blue"
        />
        <DashboardCard
          title="Clientes"
          value={stats?.customers.toString() || "0"}
          description="Total"
          icon={Users}
          href="/dashboard/customers"
          color="green"
        />
        <DashboardCard
          title="Serviços"
          value={stats?.services.toString() || "0"}
          description="Ativos"
          icon={Briefcase}
          href="/dashboard/services"
          color="purple"
        />
        <DashboardCard
          title="Ocupação"
          value={`${stats?.occupancy || 0}%`}
          description="Média do dia"
          icon={Clock}
          href="/dashboard/metrics"
          color="amber"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-6">Desempenho</h3>
            <div className="h-[300px]">
              <PerformanceReport />
            </div>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  href,
  color
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color?: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    amber: 'bg-amber-50 text-amber-700'
  };

  return (
    <Link
      to={href}
      className="rounded-xl border bg-card p-6 hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 ${colors[color || 'blue']}`} />
      <div className="flex items-center gap-x-4">
        <div className={`p-2 rounded-lg transition-colors ${colors[color || 'blue']}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-x-1">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}