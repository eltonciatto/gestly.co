import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { getBusinessHours, updateBusinessHours } from '@/lib/db/business-hours';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const DIAS_SEMANA = [
  { id: 0, nome: 'Domingo' },
  { id: 1, nome: 'Segunda-feira' },
  { id: 2, nome: 'Terça-feira' },
  { id: 3, nome: 'Quarta-feira' },
  { id: 4, nome: 'Quinta-feira' },
  { id: 5, nome: 'Sexta-feira' },
  { id: 6, nome: 'Sábado' },
];

export function BusinessHours() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: horarios = [], isLoading: isLoadingHorarios } = useQuery({
    queryKey: ['business-hours', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      return getBusinessHours(business.id);
    },
    enabled: !!business?.id
  });

  const updateHorario = useMutation({
    mutationFn: async (values: any) => {
      await updateBusinessHours(values.id, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-hours'] });
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

  if (isLoadingHorarios) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
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
              const horariosdia = horarios.filter(h => h.day_of_week === dia.id);

              return (
                <div key={dia.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{dia.nome}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Add new time slot
                      }}
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
                              value={horario.start_time}
                              onChange={(e) =>
                                updateHorario.mutate({
                                  ...horario,
                                  start_time: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Fechamento</Label>
                            <Input
                              type="time"
                              value={horario.end_time}
                              onChange={(e) =>
                                updateHorario.mutate({
                                  ...horario,
                                  end_time: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Intervalo (opcional)</Label>
                            <div className="flex items-center gap-x-2">
                              <Input
                                type="time"
                                value={horario.break_start || ''}
                                onChange={(e) =>
                                  updateHorario.mutate({
                                    ...horario,
                                    break_start: e.target.value || null,
                                  })
                                }
                                placeholder="Início"
                              />
                              <span>até</span>
                              <Input
                                type="time"
                                value={horario.break_end || ''}
                                onChange={(e) =>
                                  updateHorario.mutate({
                                    ...horario,
                                    break_end: e.target.value || null,
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
                              onClick={() => {
                                // Delete time slot
                              }}
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