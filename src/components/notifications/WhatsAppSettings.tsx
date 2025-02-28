import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { MessageSquare, QrCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function WhatsAppSettings() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: config, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['whatsapp-config', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.notifications.getConfig();
      return data;
    },
    enabled: !!business?.id
  });

  const updateConfig = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.notifications.updateConfig(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-config'] });
      toast({
        title: 'Configurações salvas!',
        description: 'As configurações foram atualizadas com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  if (isLoadingConfig) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">WhatsApp Business</h3>
            <p className="text-sm text-muted-foreground">
              Configure a integração com WhatsApp
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Método de Conexão</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant={config?.whatsapp_method === 'api' ? 'default' : 'outline'}
                  onClick={() => updateConfig.mutate({
                    ...config,
                    whatsapp_method: 'api'
                  })}
                >
                  API Oficial
                </Button>
                <Button
                  variant={config?.whatsapp_method === 'qrcode' ? 'default' : 'outline'}
                  onClick={() => updateConfig.mutate({
                    ...config,
                    whatsapp_method: 'qrcode'
                  })}
                >
                  QR Code
                </Button>
              </div>
            </div>

            {config?.whatsapp_method === 'api' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={config?.whatsapp_api_key || ''}
                    onChange={(e) => updateConfig.mutate({
                      ...config,
                      whatsapp_api_key: e.target.value
                    })}
                    placeholder="Sua chave API do WhatsApp Business"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Número de Telefone</Label>
                  <Input
                    value={config?.whatsapp_phone || ''}
                    onChange={(e) => updateConfig.mutate({
                      ...config,
                      whatsapp_phone: e.target.value
                    })}
                    placeholder="5511999999999"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <QrCode className="h-48 w-48 text-muted-foreground" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Escaneie o QR Code com o WhatsApp do seu celular
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Configurações de Mensagem</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="whatsapp_auto_reply"
                    checked={config?.whatsapp_auto_reply}
                    onChange={(e) => updateConfig.mutate({
                      ...config,
                      whatsapp_auto_reply: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="whatsapp_auto_reply" className="text-sm">
                    Resposta automática
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="whatsapp_group_messages"
                    checked={config?.whatsapp_group_messages}
                    onChange={(e) => updateConfig.mutate({
                      ...config,
                      whatsapp_group_messages: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="whatsapp_group_messages" className="text-sm">
                    Agrupar mensagens similares
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}