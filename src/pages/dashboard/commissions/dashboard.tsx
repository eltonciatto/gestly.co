import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function CommissionDashboard() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  
  const { data: business } = useBusinessQuery();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['commission-metrics', business?.id, startDate, endDate],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const { data } = await apiClient.reports.commissionMetrics({
        startDate,
        endDate
      });
      return data;
    },
    enabled: !!business?.id
  });

  if (isLoading || !business) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard de Comissões</h2>
        <p className="text-muted-foreground">
          Análise de desempenho e projeções
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label>Data Inicial</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Data Final</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3 mb-6">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Ranking de Profissionais</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.by_attendant || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="attendant_name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Bar 
                  dataKey="total_commission" 
                  name="Comissão"
                  fill="#2563eb" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3 mb-6">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Evolução das Comissões</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics?.by_day || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Line 
                  type="monotone"
                  dataKey="total_commission" 
                  name="Comissão"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3 mb-6">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Metas e Projeções</h3>
          </div>
          <div className="space-y-4">
            {metrics?.goals?.map((goal: any) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{goal.name}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}