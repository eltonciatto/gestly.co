import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, QrCode } from 'lucide-react';

const schema = z.object({
  cardNumber: z.string().min(16, 'Número do cartão inválido'),
  cardName: z.string().min(3, 'Nome inválido'),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Data inválida'),
  cardCvc: z.string().min(3, 'CVC inválido'),
  installments: z.number().min(1).max(12)
});

interface PaymentFormProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
}

export function PaymentForm({ amount, onSuccess }: PaymentFormProps) {
  const [method, setMethod] = useState<'credit' | 'pix'>('credit');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const handlePayment = async (data: any) => {
    try {
      setIsLoading(true);

      const { data: transaction, error } = await supabase.rpc(
        'process_payment',
        {
          amount,
          payment_method: method,
          payment_details: method === 'credit' ? {
            card_number: data.cardNumber,
            card_name: data.cardName,
            card_expiry: data.cardExpiry,
            installments: data.installments
          } : {}
        }
      );

      if (error) throw error;

      toast({
        title: 'Pagamento processado!',
        description: 'O pagamento foi processado com sucesso.'
      });

      onSuccess(transaction.id);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no pagamento',
        description: 'Não foi possível processar o pagamento. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          type="button"
          variant={method === 'credit' ? 'default' : 'outline'}
          onClick={() => setMethod('credit')}
          className="flex-1"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Cartão de Crédito
        </Button>
        <Button
          type="button"
          variant={method === 'pix' ? 'default' : 'outline'}
          onClick={() => setMethod('pix')}
          className="flex-1"
        >
          <QrCode className="h-4 w-4 mr-2" />
          PIX
        </Button>
      </div>

      {method === 'credit' ? (
        <form onSubmit={handleSubmit(handlePayment)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              {...register('cardNumber')}
            />
            {errors.cardNumber && (
              <p className="text-sm text-destructive">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Nome no Cartão</Label>
            <Input
              id="cardName"
              placeholder="Nome como está no cartão"
              {...register('cardName')}
            />
            {errors.cardName && (
              <p className="text-sm text-destructive">{errors.cardName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Validade</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/AA"
                {...register('cardExpiry')}
              />
              {errors.cardExpiry && (
                <p className="text-sm text-destructive">{errors.cardExpiry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardCvc">CVC</Label>
              <Input
                id="cardCvc"
                placeholder="123"
                {...register('cardCvc')}
              />
              {errors.cardCvc && (
                <p className="text-sm text-destructive">{errors.cardCvc.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installments">Parcelas</Label>
            <select
              id="installments"
              className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('installments')}
            >
              {[...Array(12)].map((_, i) => {
                const value = i + 1;
                const installmentAmount = amount / value;
                return (
                  <option key={value} value={value}>
                    {value}x de {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(installmentAmount)}
                    {value === 1 ? ' à vista' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Pagar com Cartão'}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Escaneie o QR Code abaixo ou copie o código PIX para pagar:
            </p>
            <div className="flex justify-center mb-4">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000"
                alt="QR Code PIX"
                className="w-48 h-48"
              />
            </div>
            <div className="flex gap-2">
              <Input
                value="00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000"
                readOnly
              />
              <Button variant="outline" onClick={() => {
                navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000");
                toast({
                  title: "Código copiado!",
                  description: "O código PIX foi copiado para sua área de transferência."
                });
              }}>
                Copiar
              </Button>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={() => {
              // Simular pagamento PIX
              handlePayment({});
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Já fiz o pagamento'}
          </Button>
        </div>
      )}
    </div>
  );
}