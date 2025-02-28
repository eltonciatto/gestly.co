import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

const GOAL_TYPES = [
  { id: 'revenue', name: 'Faturamento' },
  { id: 'services', name: 'Serviços' },
  { id: 'customers', name: 'Clientes' },
];

export default function CommissionGoals() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery({
    queryKey: ['commission-goals', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data } = await apiClient.commissions.getGoals();
      return data;
    },
    enabled: !!business?.id
  });

  const addGoal = useMutation({
    mutationFn: async (data: any) => {
      await apiClient.commissions.createGoal(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-goals'] });
      toast({
        title: 'Meta adicionada!',
        description: 'A nova meta foi salva com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar meta',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.commissions.deleteGoal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-goals'] });
      toast({
        title: 'Meta removida!',
        description: 'A meta foi removida com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover meta',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const handleAddGoal = async () => {
    try {
      setIsLoading(true);
      await addGoal.mutateAsync({
        goal_type: 'revenue',
        period: 'monthly',
        target_value: 1000,
        bonus_percentage: 5,
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Metas e Bonificações</h2>
        <p className="text-muted-foreground">
          Configure metas e bonificações para seus profissionais
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Target className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Metas Ativas</h3>
            <p className="text-sm text-muted-foreground">
              Metas e bonificações configuradas
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-center border-t pt-4">
                <div>
                  <p className="font-medium">{goal.attendant_name || 'Todos os profissionais'}</p>
                  <p className="text-sm text-muted-foreground">
                    {GOAL_TYPES.find(t => t.id === goal.goal_type)?.name}
                  </p>
                </div>

                <div>
                  <p className="font-medium">
                    {goal.goal_type === 'revenue' 
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.target_value)
                      : goal.target_value}
                  </p>
                  <p className="text-sm text-muted-foreground">Meta</p>
                </div>

                <div>
                  <p className="font-medium">{goal.bonus_percentage}%</p>
                  <p className="text-sm text-muted-foreground">Bônus</p>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteGoal.mutate(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button onClick={handleAddGoal} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Meta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}