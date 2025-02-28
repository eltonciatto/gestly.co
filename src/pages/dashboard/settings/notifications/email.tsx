import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function EmailSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: config } = useQuery({
    queryKey: ['email-config', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.notifications.getEmailConfig();
      return data;
    },
    enabled: !!business?.id
  });

  const updateConfig = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.notifications.updateEmailConfig(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-config'] });
      toast({
        title: 'Configurações atualizadas',
        description: 'As configurações de e-mail foram salvas com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const testEmail = useMutation({
    mutationFn: async () => {
      await apiClient.notifications.sendTestEmail();
    },
    onSuccess: () => {
      toast({
        title: 'E-mail de teste enviado',
        description: 'O e-mail de teste foi enviado com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar e-mail',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  if (!business) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configurações de E-mail</h2>
          <p className="text-muted-foreground">
            Configure as configurações de envio de e-mail
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Configurações de E-mail</h3>
            <p className="text-sm text-muted-foreground">
              Defina as configurações para envio de e-mails
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Host SMTP</Label>
              <Input
                value={config?.smtp_host || ''}
                onChange={(e) =>
                  updateConfig.mutate({ smtp_host: e.target.value })
                }
                placeholder="smtp.exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Porta SMTP</Label>
              <Input
                type="number"
                value={config?.smtp_port || ''}
                onChange={(e) =>
                  updateConfig.mutate({ smtp_port: e.target.value })
                }
                placeholder="587"
              />
            </div>

            <div className="space-y-2">
              <Label>Usuário SMTP</Label>
              <Input
                value={config?.smtp_user || ''}
                onChange={(e) =>
                  updateConfig.mutate({ smtp_user: e.target.value })
                }
                placeholder="seu-email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Senha SMTP</Label>
              <Input
                type="password"
                value={config?.smtp_pass || ''}
                onChange={(e) =>
                  updateConfig.mutate({ smtp_pass: e.target.value })
                }
                placeholder="********"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => testEmail.mutate()}
              disabled={testEmail.isLoading}
            >
              Enviar E-mail de Teste
            </Button>
            <Button
              onClick={() => updateConfig.mutate(config)}
              disabled={updateConfig.isLoading}
            >
              Salvar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}