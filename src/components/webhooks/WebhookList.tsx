import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquareShare, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export function WebhookList() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.webhooks.list();
      return data;
    },
    enabled: !!business?.id
  });

  const addWebhook = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.webhooks.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: 'Webhook adicionado',
        description: 'O webhook foi criado com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar webhook',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.webhooks.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: 'Webhook removido',
        description: 'O webhook foi removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover webhook',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const handleAddWebhook = async () => {
    try {
      setIsLoading(true);
      await addWebhook.mutateAsync({
        url: '',
        events: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingWebhooks || !business) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando webhooks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Webhooks</h2>
          <p className="text-muted-foreground">
            Gerencie integrações de webhooks
          </p>
        </div>
        <Button onClick={handleAddWebhook} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Webhook
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <MessageSquareShare className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Integrações de Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              Configure webhooks para receber notificações de eventos
            </p>
          </div>
        </div>

        <div className="p-6">
          {webhooks.length === 0 ? (
            <div className="text-center py-6">
              <MessageSquareShare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhum webhook configurado
              </h3>
              <p className="text-muted-foreground">
                Adicione webhooks para integrar com outros serviços
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end border-b pb-6"
                >
                  <div className="space-y-2 col-span-2">
                    <Label>URL do Webhook</Label>
                    <Input
                      value={webhook.url}
                      onChange={(e) =>
                        addWebhook.mutate({
                          ...webhook,
                          url: e.target.value,
                        })
                      }
                      placeholder="https://exemplo.com/webhook"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>Eventos</Label>
                    <div className="flex flex-wrap gap-2">
                      {['create', 'update', 'delete'].map((event) => (
                        <label key={event} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={webhook.events?.includes(event)}
                            onChange={(e) => {
                              const currentEvents = webhook.events || [];
                              const newEvents = e.target.checked
                                ? [...currentEvents, event]
                                : currentEvents.filter((ev) => ev !== event);
                              
                              addWebhook.mutate({
                                ...webhook,
                                events: newEvents,
                              });
                            }}
                            className="mr-2"
                          />
                          {event}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWebhook.mutate(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}