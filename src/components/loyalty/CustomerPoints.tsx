import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Gift, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface CustomerPointsProps {
  customerId: string;
}

export function CustomerPoints({ customerId }: CustomerPointsProps) {
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const { data: pointsInfo } = useQuery({
    queryKey: ['customer-points', customerId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        'calcular_pontos_cliente',
        { customer_id: customerId }
      );

      if (error) throw error;
      return data;
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ['points-history', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pontos_fidelidade')
        .select(`
          *,
          appointment:appointments(
            service:services(name)
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: availableRewards = [] } = useQuery({
    queryKey: ['available-rewards', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recompensas')
        .select('*')
        .eq('is_active', true)
        .lte('pontos_necessarios', pointsInfo?.pontos_disponiveis || 0)
        .order('pontos_necessarios');

      if (error) throw error;
      return data;
    },
    enabled: !!pointsInfo?.pontos_disponiveis,
  });

  const handleRedeem = async (rewardId: string) => {
    try {
      const { error } = await supabase.rpc(
        'resgatar_recompensa',
        {
          recompensa_id: rewardId,
          customer_id: customerId
        }
      );

      if (error) throw error;

      toast({
        title: 'Resgate solicitado!',
        description: 'A recompensa foi resgatada com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao resgatar recompensa',
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-x-2">
            <Star className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Pontos Disponíveis</p>
              <p className="text-2xl font-bold">{pointsInfo?.pontos_disponiveis || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-x-2">
            <Gift className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Pontos Utilizados</p>
              <p className="text-2xl font-bold">{pointsInfo?.pontos_usados || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Próxima Recompensa</p>
              {pointsInfo?.proxima_recompensa ? (
                <div className="text-sm">
                  <p className="font-medium">{pointsInfo.proxima_recompensa.nome}</p>
                  <p className="text-muted-foreground">
                    Faltam {pointsInfo.proxima_recompensa.pontos_faltantes} pontos
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma recompensa disponível
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {availableRewards.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="p-4 border-b">
            <h3 className="font-medium">Recompensas Disponíveis</h3>
          </div>
          <div className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {availableRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-4 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{reward.nome}</h4>
                    <span className="text-sm text-muted-foreground">
                      {reward.pontos_necessarios} pontos
                    </span>
                  </div>
                  {reward.descricao && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {reward.descricao}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRedeem(reward.id)}
                  >
                    Resgatar Recompensa
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-medium">Histórico de Pontos</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">
                    {record.appointment?.service?.name || 'Pontos bônus'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(record.created_at), "d 'de' MMMM 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {record.usado ? (
                      <span className="text-red-500">-{record.pontos}</span>
                    ) : (
                      <span className="text-green-500">+{record.pontos}</span>
                    )}
                  </p>
                  {record.valido_ate && (
                    <p className="text-xs text-muted-foreground">
                      Válido até {format(parseISO(record.valido_ate), 'dd/MM/yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}