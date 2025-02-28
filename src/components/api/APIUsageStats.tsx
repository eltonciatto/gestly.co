import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function APIUsageStats() {
  const { data: usage, isLoading } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const { data } = await apiClient.settings.getApiUsage();
      return data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const chartData = usage?.hourly.map((value: number, index: number) => ({
    hour: format(new Date().setHours(index), 'HH:mm', { locale: ptBR }),
    requests: value
  }));

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center gap-x-3 p-6 border-b">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="font-semibold">Uso da API</h3>
          <p className="text-sm text-muted-foreground">
            Últimas 24 horas
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{usage?.total || 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Sucesso</p>
            <p className="text-2xl font-bold text-green-600">{usage?.success || 0}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Erro</p>
            <p className="text-2xl font-bold text-red-600">{usage?.error || 0}</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}