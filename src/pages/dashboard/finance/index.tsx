import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, ArrowUpRight, ArrowDownLeft, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';

export default function CashFlow() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  
  const { data: business } = useBusinessQuery();

  const { data: cashflow } = useQuery({
    queryKey: ['cashflow', business?.id, startDate, endDate],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const { data } = await apiClient.finance.getCashflow({
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Fluxo de Caixa</h2>
        <p className="text-muted-foreground">
          Acompanhe suas receitas e despesas
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
                Saldo Atual
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(cashflow?.summary?.balance || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Receitas
              </p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(cashflow?.summary?.income || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <ArrowDownLeft className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Despesas
              </p>
              <p className="text-2xl font-bold text-red-500">
                {formatCurrency(cashflow?.summary?.expenses || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <LineChart className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Resultado
              </p>
              <p className={`text-2xl font-bold ${
                (cashflow?.summary?.income || 0) - (cashflow?.summary?.expenses || 0) >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}>
                {formatCurrency(
                  (cashflow?.summary?.income || 0) - (cashflow?.summary?.expenses || 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h3 className="font-semibold mb-4">Movimentações</h3>
          <div className="space-y-4">
            {cashflow?.transactions?.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.date), "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}