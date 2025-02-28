import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommissionReceiptProps {
  businessId: string;
  attendantId: string;
  startDate: string;
  endDate: string;
}

export function CommissionReceipt({ 
  businessId, 
  attendantId, 
  startDate, 
  endDate 
}: CommissionReceiptProps) {
  const supabase = useSupabaseClient();

  const { data: receipt } = useQuery({
    queryKey: ['commission-receipt', businessId, attendantId, startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        'generate_commission_receipt',
        {
          p_business_id: businessId,
          p_attendant_id: attendantId,
          p_start_date: startDate,
          p_end_date: endDate
        }
      );

      if (error) throw error;
      return data;
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // TODO: Implementar download do PDF
  };

  if (!receipt) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold">Recibo de Comissões</h2>
          <p className="text-sm text-muted-foreground">
            Nº {receipt.receipt_number}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Empresa</h3>
            <p>{receipt.business_name}</p>
            <p className="text-sm text-muted-foreground">{receipt.business_document}</p>
            <p className="text-sm text-muted-foreground">{receipt.business_address}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Profissional</h3>
            <p>{receipt.attendant_name}</p>
            <p className="text-sm text-muted-foreground">{receipt.attendant_document}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Período</h3>
          <p>
            {format(new Date(startDate), "d 'de' MMMM", { locale: ptBR })} a{' '}
            {format(new Date(endDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-4">Detalhamento</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm">
                <th className="text-left py-2">Serviço</th>
                <th className="text-right py-2">Valor</th>
                <th className="text-right py-2">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {receipt.details.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.service_name}</td>
                  <td className="text-right py-2">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.service_value)}
                  </td>
                  <td className="text-right py-2">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.commission_value)}
                  </td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="py-4">Total</td>
                <td className="text-right py-4">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(receipt.total_services)}
                </td>
                <td className="text-right py-4">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(receipt.total_commission)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Dados Bancários</p>
              <p>{receipt.bank_info.bank_name}</p>
              <p>Agência: {receipt.bank_info.branch_number}</p>
              <p>Conta: {receipt.bank_info.account_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(receipt.total_commission)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>Este recibo é um documento fiscal válido.</p>
          <p>Emitido em {format(new Date(), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</p>
        </div>
      </div>
    </div>
  );
}