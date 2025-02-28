import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Check } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export default function BankIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await apiClient.settings.connectBank({
        bank: 'itau',
        apiKey: 'test-key'
      });
      setIsConnected(true);
      toast({
        title: 'Integração configurada!',
        description: 'A integração bancária foi configurada com sucesso.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na integração',
        description: 'Não foi possível configurar a integração bancária.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integração Bancária</h2>
        <p className="text-muted-foreground">
          Configure a integração com sua conta bancária
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-x-3 mb-6">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Conta Bancária</h3>
            <p className="text-sm text-muted-foreground">
              Conecte sua conta para recebimentos e transferências
            </p>
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Conectado com sucesso</span>
            </div>

            <div className="space-y-2">
              <Label>Configurações</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <input type="checkbox" id="autoTransfer" className="rounded border-gray-300" />
                  <label htmlFor="autoTransfer" className="text-sm">
                    Transferência automática de comissões
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input type="checkbox" id="autoReconcile" className="rounded border-gray-300" />
                  <label htmlFor="autoReconcile" className="text-sm">
                    Reconciliação automática
                  </label>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setIsConnected(false)}>
              Desconectar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Banco</Label>
              <select className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option value="">Selecione um banco</option>
                <option value="itau">Itaú</option>
                <option value="bradesco">Bradesco</option>
                <option value="santander">Santander</option>
                <option value="bb">Banco do Brasil</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Chave de API</Label>
              <Input type="password" placeholder="Sua chave de API" />
            </div>

            <Button 
              className="w-full"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? 'Conectando...' : 'Conectar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}