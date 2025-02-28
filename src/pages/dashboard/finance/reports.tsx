import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function FinancialReports() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  
  const { data: business } = useBusinessQuery();

  const { data: report } = useQuery({
    queryKey: ['financial-report', business?.id, startDate, endDate],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const { data } = await apiClient.reports.financial(startDate, endDate);
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Relatórios Financeiros</h2>
        <p className="text-muted-foreground">
          Análise detalhada das suas finanças
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
        <Button variant="outline" className="mt-8">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Demonstrativo de Resultados</h3>
                <p className="text-sm text-muted-foreground">
                  Período: {format(new Date(startDate), "d 'de' MMMM", { locale: ptBR })} a{' '}
                  {format(new Date(endDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Receitas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Serviços</span>
                    <span>{formatCurrency(report?.revenue?.services || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Produtos</span>
                    <span>{formatCurrency(report?.revenue?.products || 0)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Receitas</span>
                    <span>{formatCurrency(report?.revenue?.total || 0)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Despesas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Comissões</span>
                    <span>{formatCurrency(report?.expenses?.commissions || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Produtos</span>
                    <span>{formatCurrency(report?.expenses?.products || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Operacionais</span>
                    <span>{formatCurrency(report?.expenses?.operational || 0)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Despesas</span>
                    <span>{formatCurrency(report?.expenses?.total || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Resultado Líquido</span>
                  <span className={
                    (report?.net_result || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }>
                    {formatCurrency(report?.net_result || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-x-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Indicadores Financeiros</h3>
                <p className="text-sm text-muted-foreground">
                  Principais métricas do período
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ticket Médio</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(report?.metrics?.average_ticket || 0)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Margem de Lucro</p>
                <p className="text-2xl font-semibold">
                  {((report?.metrics?.profit_margin || 0) * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Taxa de Conversão</p>
                <p className="text-2xl font-semibold">
                  {((report?.metrics?.conversion_rate || 0) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}