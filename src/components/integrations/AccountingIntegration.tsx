import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Check } from 'lucide-react';

const ACCOUNTING_SYSTEMS = [
  { id: 'conta-azul', name: 'Conta Azul' },
  { id: 'nfe-io', name: 'NFe.io' },
  { id: 'omie', name: 'Omie' }
];

export function AccountingIntegration() {
  const [selectedSystem, setSelectedSystem] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await apiClient.integrations.connectAccounting({
        system: selectedSystem,
        apiKey: config.apiKey
      });
      setIsConnected(true); 
      toast({
        title: 'Integração configurada!',
        description: 'A integração foi configurada com sucesso.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na integração',
        description: 'Não foi possível configurar a integração.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-x-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Sistema Contábil</h3>
          <p className="text-sm text-muted-foreground">
            Integre com seu sistema de contabilidade
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Sistema</Label>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
          >
            <option value="">Selecione um sistema</option>
            {ACCOUNTING_SYSTEMS.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSystem && !isConnected && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input type="password" placeholder="Sua chave API" />
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

        {isConnected && (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>Conectado com sucesso</span>
            </div>

            <div className="space-y-2">
              <Label>Configurações</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <input type="checkbox" id="autoSync" className="rounded border-gray-300" />
                  <label htmlFor="autoSync" className="text-sm">
                    Sincronização automática
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input type="checkbox" id="autoNF" className="rounded border-gray-300" />
                  <label htmlFor="autoNF" className="text-sm">
                    Emitir NF-e automaticamente
                  </label>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setIsConnected(false)}>
              Desconectar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}