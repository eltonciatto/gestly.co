import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, Users, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBusinessQuery } from '@/lib/queries';
import { LoadingScreen } from '@/components/ui/loading';
import { apiClient } from '@/lib/api/client';

export default function CommissionReport() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  
  
  const { data: business } = useBusinessQuery();
  const { data: report, isLoading } = useQuery({
    queryKey: ['commission-report', business?.id, startDate, endDate],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const { data } = await apiClient.reports.financial(startDate, endDate);
      return data;
    },
    enabled: !!business?.id
  });

  if (isLoading || !business) {
    return <LoadingScreen />;
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatório de Comissões</h2>
        <p className="text-muted-foreground">
          Análise detalhada de comissões e pagamentos
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

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total em Comissões
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report?.summary?.total_paid || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Profissionais Ativos
              </p>
              <p className="text-2xl font-bold">
                {report?.by_attendant?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Comissões Pagas
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report?.summary?.total_paid || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <Clock className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Comissões Pendentes
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report?.summary?.total_pending || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h3 className="font-semibold mb-4">Comissões por Profissional</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report?.by_attendant || []}>
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
                  dataKey="total_amount" 
                  name="Total"
                  fill="#2563eb" 
                />
                <Bar 
                  dataKey="pending_amount" 
                  name="Pendente"
                  fill="#eab308" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h3 className="font-semibold mb-4">Detalhamento por Profissional</h3>
          <div className="space-y-6">
            {report?.by_attendant?.map((attendant: any) => (
              <div key={attendant.attendant_id} className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{attendant.attendant_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {attendant.total_records} registros
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(attendant.total_amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total em comissões
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Comissões Pagas</p>
                        <p className="text-lg font-bold text-green-500">
                          {formatCurrency(attendant.total_amount - attendant.pending_amount)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {attendant.total_records - attendant.pending_count} pagamentos
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Comissões Pendentes</p>
                        <p className="text-lg font-bold text-yellow-500">
                          {formatCurrency(attendant.pending_amount)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {attendant.pending_count} pendentes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}