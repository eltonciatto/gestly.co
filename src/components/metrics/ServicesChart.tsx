import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '@/lib/api/client';

export function ServicesChart() {
  const { data: business } = useBusinessQuery();
  const [startDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  const { data: services } = useQuery({
    queryKey: ['services-metrics', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.reports.servicesMetrics({
        startDate,
        endDate
      });
      return data;
    },
    enabled: !!business?.id
  });

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-6">Serviços Mais Vendidos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={services?.by_service || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
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
              dataKey="revenue" 
              name="Faturamento"
              fill="#2563eb" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}