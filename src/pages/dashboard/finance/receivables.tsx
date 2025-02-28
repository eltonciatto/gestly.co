import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function Receivables() {
  const [filter, setFilter] = useState&lt;'all' | 'pending' | 'paid'&gt;('all');
  const { data: business } = useBusinessQuery();

  const { data: receivables = [] } = useQuery({
    queryKey: ['receivables', business?.id, filter],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data } = await apiClient.finance.getReceivables({
        status: filter === 'all' ? undefined : filter
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
        <h2 className="text-2xl font-bold tracking-tight">Contas a Receber</h2>
        <p className="text-muted-foreground">
          Gerencie seus recebimentos
        </p>
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          variant={filter === 'all' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'pending' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('pending')}
        >
          Pendentes
        </Button>
        <Button
          variant={filter === 'paid' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('paid')}
        >
          Recebidas
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="space-y-4">
            {receivables.map((receivable: any) => (
              <div
                key={receivable.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{receivable.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {receivable.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {format(new Date(receivable.due_date), "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(receivable.amount)}
                  </p>
                  <div className="flex items-center gap-x-1 mt-1">
                    {receivable.status === 'paid' ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Recebido</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-yellow-500">Pendente</span>
                      </>
                    )}
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