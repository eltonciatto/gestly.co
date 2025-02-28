import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Bell, Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function NotificationSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notification-settings', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.notifications.getConfig();
      return data;
    },
    enabled: !!business?.id
  });

  const updateSettings = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.notifications.updateConfig(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Configurações Gerais</h3>
            <p className="text-sm text-muted-foreground">
              Configure as notificações do sistema
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Lembretes de Agendamento</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      id="reminder_email"
                      checked={settings?.reminder_email}
                      onChange={(e) => updateSettings.mutate({
                        ...settings,
                        reminder_email: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="reminder_email" className="text-sm">
                      Email
                    </label>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    value={settings?.reminder_email_hours || 24}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      reminder_email_hours: parseInt(e.target.value)
                    })}
                    placeholder="Horas antes"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      id="reminder_whatsapp"
                      checked={settings?.reminder_whatsapp}
                      onChange={(e) => updateSettings.mutate({
                        ...settings,
                        reminder_whatsapp: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="reminder_whatsapp" className="text-sm">
                      WhatsApp
                    </label>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    value={settings?.reminder_whatsapp_hours || 2}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      reminder_whatsapp_hours: parseInt(e.target.value)
                    })}
                    placeholder="Horas antes"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirmações</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="confirmation_required"
                    checked={settings?.confirmation_required}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      confirmation_required: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="confirmation_required" className="text-sm">
                    Exigir confirmação do cliente
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="auto_confirm"
                    checked={settings?.auto_confirm}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      auto_confirm: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="auto_confirm" className="text-sm">
                    Confirmar automaticamente após resposta
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notificações Adicionais</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="notify_cancellation"
                    checked={settings?.notify_cancellation}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      notify_cancellation: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="notify_cancellation" className="text-sm">
                    Notificar cancelamentos
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="notify_rescheduling"
                    checked={settings?.notify_rescheduling}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      notify_rescheduling: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="notify_rescheduling" className="text-sm">
                    Notificar reagendamentos
                  </label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    id="notify_birthday"
                    checked={settings?.notify_birthday}
                    onChange={(e) => updateSettings.mutate({
                      ...settings,
                      notify_birthday: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="notify_birthday" className="text-sm">
                    Enviar mensagem de aniversário
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