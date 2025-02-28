import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownLeft, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';

export default function Payables() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const { data: business } = useBusinessQuery();

  const { data: payables = [] } = useQuery({
    queryKey: ['payables', business?.id, filter],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data } = await apiClient.finance.getPayables({
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
        <h2 className="text-2xl font-bold tracking-tight">Contas a Pagar</h2>
        <p className="text-muted-foreground">
          Gerencie seus pagamentos
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
          Pagas
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <div className="space-y-4">
            {payables.map((payable: any) => (
              <div
                key={payable.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{payable.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {payable.supplier.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {format(new Date(payable.due_date), "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(payable.amount)}
                  </p>
                  <div className="flex items-center gap-x-1 mt-1">
                    {payable.status === 'paid' ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Pago</span>
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