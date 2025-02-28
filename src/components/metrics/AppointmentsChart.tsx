import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiClient } from '@/lib/api/client';

export function AppointmentsChart() {
  const { data: business } = useBusinessQuery();
  const [startDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  const { data: appointments } = useQuery({
    queryKey: ['appointments-metrics', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.reports.appointmentsMetrics({
        startDate,
        endDate
      });
      return data;
    },
    enabled: !!business?.id
  });

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-6">Agendamentos por Dia</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={appointments?.by_day || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
              tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: ptBR })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => format(new Date(value), "d 'de' MMMM", { locale: ptBR })}
            />
            <Bar 
              dataKey="total" 
              name="Agendamentos"
              fill="#2563eb" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}