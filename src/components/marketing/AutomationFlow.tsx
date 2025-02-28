import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Plus, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { 
  getCampaigns,
  createCampaign,
  updateCampaignStatus,
  type Campaign 
} from '@/lib/db/marketing';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AutomationFlow() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: automations = [], isLoading } = useQuery({
    queryKey: ['automations', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      return getCampaigns(business.id, {
        type: 'automation'
      });
    },
    enabled: !!business?.id
  });

  const updateAutomation = useMutation({
    mutationFn: async (automation: Campaign) => {
      await updateCampaignStatus(automation.id, automation.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: 'Automação atualizada!',
        description: 'As alterações foram salvas com sucesso.'
      });
    }
  });

  const addAutomation = useMutation({
    mutationFn: async () => {
      if (!business?.id) return;
      return createCampaign({
        business_id: business.id,
        name: 'Nova Automação',
        type: 'automation',
        trigger: 'appointment_completed',
        status: 'draft',
        content: 'Olá {nome}, obrigado por sua visita!'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast({
        title: 'Automação adicionada!',
        description: 'A nova automação foi criada com sucesso.'
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automações</h2>
          <p className="text-muted-foreground">
            Configure mensagens automáticas para seus clientes
          </p>
        </div>
        <Button onClick={() => addAutomation.mutate()}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      <div className="grid gap-6">
        {automations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma automação configurada
            </h3>
            <p className="text-muted-foreground mb-4">
              Configure mensagens automáticas para melhorar o relacionamento com seus clientes
            </p>
            <Button onClick={() => addAutomation.mutate()}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Automação
            </Button>
          </div>
        ) : (
          automations.map((automation) => (
            <div
              key={automation.id}
              className="rounded-lg border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {automation.trigger === 'appointment_completed' 
                        ? 'Após Atendimento'
                        : automation.trigger === 'customer_birthday'
                        ? 'Aniversário'
                        : 'Automação'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {automation.schedule_date ? `Agendado para ${automation.schedule_date}` : 'Sem agendamento'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(automation.id)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja remover esta automação?')) {
                        updateAutomation.mutate({
                          ...automation,
                          status: 'cancelled'
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isEditing === automation.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Gatilho</Label>
                    <select
                      className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={automation.trigger}
                      onChange={(e) => {
                        updateAutomation.mutate({
                          ...automation,
                          trigger: e.target.value as any
                        });
                      }}
                    >
                      <option value="appointment_completed">Após Atendimento</option>
                      <option value="customer_birthday">Aniversário</option>
                      <option value="customer_inactive">Cliente Inativo</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Mensagem</Label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                      value={automation.content}
                      onChange={(e) => {
                        updateAutomation.mutate({
                          ...automation,
                          content: e.target.value
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Variáveis: {'{nome}'}, {'{servico}'}, {'{data}'}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Concluir Edição
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm">{automation.content}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}