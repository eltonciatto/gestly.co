import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

const DIAS_SEMANA = [
  { id: 0, nome: 'Domingo' },
  { id: 1, nome: 'Segunda-feira' },
  { id: 2, nome: 'Terça-feira' },
  { id: 3, nome: 'Quarta-feira' },
  { id: 4, nome: 'Quinta-feira' },
  { id: 5, nome: 'Sexta-feira' },
  { id: 6, nome: 'Sábado' },
];

interface HorarioFuncionamento {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
}

export default function BusinessHours() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: horarios = [], isLoading: isLoadingHorarios } = useQuery({
    queryKey: ['horarios-funcionamento', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.settings.getBusinessHours();
      return data;
    },
    enabled: !!business?.id
  });

  const updateHorario = useMutation({
    mutationFn: async (horario: HorarioFuncionamento) => {
      await apiClient.businessHours.update(horario.id, horario);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios-funcionamento'] });
      toast({
        title: 'Horário atualizado!',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar horário',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteHorario = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.businessHours.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horarios-funcionamento'] });
      toast({
        title: 'Horário removido!',
        description: 'O horário foi removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover horário',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const handleAddHorario = async (diaSemana: number) => {
    try {
      setIsLoading(true);
      await updateHorario.mutateAsync({
        id: crypto.randomUUID(),
        dia_semana: diaSemana,
        hora_inicio: '09:00',
        hora_fim: '18:00',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHorarios || !business) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Horários de Funcionamento</h2>
        <p className="text-muted-foreground">
          Configure os horários de atendimento do seu negócio
        </p>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Horários por Dia</h3>
            <p className="text-sm text-muted-foreground">
              Defina os horários de funcionamento para cada dia da semana
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {DIAS_SEMANA.map((dia) => {
              const horariosdia = horarios.filter(h => h.dia_semana === dia.id);

              return (
                <div key={dia.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{dia.nome}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddHorario(dia.id)}
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Horário
                    </Button>
                  </div>

                  {horariosdia.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Fechado
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {horariosdia.map((horario) => (
                        <div
                          key={horario.id}
                          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end"
                        >
                          <div className="space-y-2">
                            <Label>Abertura</Label>
                            <Input
                              type="time"
                              value={horario.hora_inicio}
                              onChange={(e) =>
                                updateHorario.mutate({
                                  ...horario,
                                  hora_inicio: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Fechamento</Label>
                            <Input
                              type="time"
                              value={horario.hora_fim}
                              onChange={(e) =>
                                updateHorario.mutate({
                                  ...horario,
                                  hora_fim: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Intervalo (opcional)</Label>
                            <div className="flex items-center gap-x-2">
                              <Input
                                type="time"
                                value={horario.intervalo_inicio || ''}
                                onChange={(e) =>
                                  updateHorario.mutate({
                                    ...horario,
                                    intervalo_inicio: e.target.value || null,
                                  })
                                }
                                placeholder="Início"
                              />
                              <span>até</span>
                              <Input
                                type="time"
                                value={horario.intervalo_fim || ''}
                                onChange={(e) =>
                                  updateHorario.mutate({
                                    ...horario,
                                    intervalo_fim: e.target.value || null,
                                  })
                                }
                                placeholder="Fim"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteHorario.mutate(horario.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}