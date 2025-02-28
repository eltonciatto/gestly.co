import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Gift, Plus, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function LoyaltySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: program } = useQuery({
    queryKey: ['loyalty-program', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.loyalty.getProgram();
      return data;
    },
    enabled: !!business?.id
  });

  const { data: rewards = [], isLoading: isLoadingRewards } = useQuery({
    queryKey: ['loyalty-rewards', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.loyalty.getRewards();
      return data;
    },
    enabled: !!business?.id
  });

  const updateProgram = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.loyalty.updateProgram(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-program'] });
      toast({
        title: 'Programa atualizado',
        description: 'As configurações do programa foram salvas.',
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

  const addReward = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.loyalty.createReward({
        nome: 'Nova Recompensa',
        pontos_necessarios: 100,
        is_active: true,
        ...values
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      toast({
        title: 'Recompensa adicionada',
        description: 'Uma nova recompensa foi criada.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteReward = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.loyalty.updateReward(id, { is_active: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      toast({
        title: 'Recompensa removida',
        description: 'A recompensa foi desativada.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  if (isLoadingRewards || !business) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando programa de fidelidade...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Programa de Fidelidade</h2>
          <p className="text-muted-foreground">
            Configure recompensas e regras do programa
          </p>
        </div>
        <Button onClick={() => addReward.mutate({})} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Recompensa
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Gift className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Configurações do Programa</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie as regras e recompensas do seu programa de fidelidade
            </p>
          </div>
        </div>

        <div className="p-6">
          {rewards.length === 0 ? (
            <div className="text-center py-6">
              <Gift className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhuma recompensa configurada
              </h3>
              <p className="text-muted-foreground">
                Adicione recompensas para incentivar a fidelização
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end border-b pb-6"
                >
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={reward.nome}
                      onChange={(e) =>
                        addReward.mutate({
                          ...reward,
                          nome: e.target.value,
                        })
                      }
                      placeholder="Ex: Desconto de 10%"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pontos Necessários</Label>
                    <Input
                      type="number"
                      value={reward.pontos_necessarios}
                      onChange={(e) =>
                        addReward.mutate({
                          ...reward,
                          pontos_necessarios: Number(e.target.value),
                        })
                      }
                      placeholder="Pontos para resgate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={reward.descricao || ''}
                      onChange={(e) =>
                        addReward.mutate({
                          ...reward,
                          descricao: e.target.value,
                        })
                      }
                      placeholder="Detalhes da recompensa"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteReward.mutate(reward.id)}
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