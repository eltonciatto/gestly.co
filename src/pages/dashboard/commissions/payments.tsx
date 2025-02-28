import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function CommissionPayments() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return format(date, 'yyyy-MM-dd');
  });
  const [endDate, setEndDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: report, isLoading } = useQuery({
    queryKey: ['financial-report', business?.id, startDate, endDate],
    queryFn: async () => {
      if (!business?.id) return null;
      
      const { data } = await apiClient.reports.financial(startDate, endDate);
      return data;
    },
    enabled: !!business?.id
  });

  const generateReceipt = useMutation({
    mutationFn: async ({ attendantId, paymentMethod }: { attendantId: string; paymentMethod: string }) => {
      const { data } = await apiClient.reports.generateReceipt({
        attendantId,
        paymentMethod,
        startDate,
        endDate
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-report'] });
      toast({
        title: 'Recibo gerado!',
        description: 'O recibo foi gerado e os pagamentos foram registrados.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar recibo',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pagamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os pagamentos de comissões
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
                Total Pago
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
                Pendente
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report?.summary?.total_pending || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Recibos Gerados
              </p>
              <p className="text-2xl font-bold">
                {report?.summary?.by_type?.receipt?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Adiantamentos
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(report?.summary?.by_type?.advance?.total || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h3 className="font-semibold mb-4">Pagamentos por Profissional</h3>
          <div className="space-y-6">
            {report?.by_attendant?.map((attendant: any) => (
              <div key={attendant.attendant_id} className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{attendant.attendant_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {attendant.records.length} registros
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(attendant.total_pending)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pendente
                    </p>
                  </div>
                </div>

                {attendant.total_pending > 0 && (
                  <div className="flex justify-end gap-2 mb-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        generateReceipt.mutate({
                          attendantId: attendant.attendant_id,
                          paymentMethod: 'pix'
                        });
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Recibo
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {attendant.records.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">
                          {formatCurrency(record.amount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          {format(new Date(record.created_at), 'dd/MM/yyyy')}
                        </p>
                        <p className={`text-sm ${
                          record.status === 'paid' 
                            ? 'text-green-500' 
                            : record.status === 'pending'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`}>
                          {record.status === 'paid' 
                            ? 'Pago' 
                            : record.status === 'pending'
                            ? 'Pendente'
                            : 'Cancelado'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}