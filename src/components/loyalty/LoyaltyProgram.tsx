import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { query } from '@/lib/db';
import { Gift, Plus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { 
  getLoyaltyProgram,
  createLoyaltyProgram,
  getLoyaltyRewards,
  createLoyaltyReward 
} from '@/lib/db/loyalty';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function LoyaltyProgram() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: program, isLoading: isLoadingProgram } = useQuery({
    queryKey: ['loyalty-program', business?.id],
    queryFn: async () => {
      if (!business?.id) return null;
      const sql = `
        SELECT * FROM programas_fidelidade
        WHERE business_id = $1 AND is_active = true
        LIMIT 1
      `;
      return queryOne(sql, [business.id]);
    },
    enabled: !!business?.id
  });

  const { data: rewards = [], isLoading: isLoadingRewards } = useQuery({
    queryKey: ['loyalty-rewards', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const sql = `
        SELECT * FROM recompensas
        WHERE business_id = $1 AND is_active = true
        ORDER BY pontos_necessarios
      `;
      return query(sql, [business.id]);
    },
    enabled: !!business?.id
  });

  const createProgram = useMutation({
    mutationFn: async (values: any) => {
      if (!business?.id) return;
      return createLoyaltyProgram({
        business_id: business.id,
        ...values,
        is_active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-program'] });
      toast({
        title: 'Programa criado!',
        description: 'O programa de fidelidade foi criado com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar programa',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const updateProgram = useMutation({
    mutationFn: async (values: any) => {
      if (!business?.id) return;
      const sql = `
        UPDATE programas_fidelidade
        SET nome = $2, pontos_por_real = $3, validade_pontos = $4, regras = $5
        WHERE id = $1
      `;
      await query(sql, [
        program?.id,
        values.nome,
        values.pontos_por_real,
        values.validade_pontos,
        values.regras
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-program'] });
      toast({
        title: 'Programa atualizado!',
        description: 'As configurações do programa foram atualizadas.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar programa',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const createReward = useMutation({
    mutationFn: async (values: any) => {
      if (!business?.id) return;
      return createLoyaltyReward({
        business_id: business.id,
        ...values,
        is_active: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-rewards'] });
      toast({
        title: 'Recompensa adicionada!',
        description: 'A nova recompensa foi salva com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar recompensa',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  if (isLoadingProgram || isLoadingRewards) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Programa de Fidelidade</h2>
        <p className="text-muted-foreground">
          Configure seu programa de pontos e recompensas
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Configurações do Programa</h3>
            <p className="text-sm text-muted-foreground">
              Defina as regras de pontuação
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome do Programa</Label>
                <Input
                  value={program?.name || 'Programa de Fidelidade'}
                  onChange={(e) => createProgram.mutate({ name: e.target.value })}
                  placeholder="Ex: Clube de Vantagens"
                />
              </div>

              <div className="space-y-2">
                <Label>Pontos por Real Gasto</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={program?.points_per_currency || 1}
                  onChange={(e) => createProgram.mutate({ 
                    points_per_currency: parseFloat(e.target.value) 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Validade dos Pontos (dias)</Label>
                <Input
                  type="number"
                  min={0}
                  value={program?.points_expiration_days || 365}
                  onChange={(e) => createProgram.mutate({ 
                    points_expiration_days: parseInt(e.target.value) 
                  })}
                />
                <p className="text-sm text-muted-foreground">
                  0 = pontos não expiram
                </p>
              </div>

              <div className="space-y-2">
                <Label>Regras do Programa</Label>
                <Input
                  value={program?.rules || ''}
                  onChange={(e) => createProgram.mutate({ rules: e.target.value })}
                  placeholder="Regras e condições do programa"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-x-3">
            <Gift className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Recompensas</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie as recompensas disponíveis
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              createReward.mutate({
                name: 'Nova Recompensa',
                points_required: 100
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Recompensa
          </Button>
        </div>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="p-4 rounded-lg border"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{reward.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {reward.points_required} pontos
                  </span>
                </div>
                {reward.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {reward.description}
                  </p>
                )}
                {reward.quantity_available !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Disponível: {reward.quantity_available}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}