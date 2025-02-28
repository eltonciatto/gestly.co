import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, Users, Star } from 'lucide-react';

interface DiaEspecial {
  id: string;
  nome: string;
  data: string;
  recorrente: boolean;
  fechado: boolean;
  hora_inicio?: string;
  hora_fim?: string;
  descricao?: string;
}

export function RealtimeMetrics() {
  const { data: business } = useBusinessQuery();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['realtime-metrics', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.reports.realtime();
      return data;
    },
    enabled: !!business?.id,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  export default function SpecialDays() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: business } = useBusinessQuery();

    const { data: diasEspeciais = [], isLoading: isLoadingDias } = useQuery({
      queryKey: ['dias-especiais', business?.id],
      queryFn: async () => {
        const { data } = await apiClient.settings.getSpecialDays();
        return data;
      },
      enabled: !!business?.id
    });

    const updateDiaEspecial = useMutation({
      mutationFn: async (dia: DiaEspecial) => {
        await apiClient.settings.updateSpecialDay(dia.id, dia);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dias-especiais'] });
        toast({
          title: 'Dia especial atualizado!',
          description: 'As alterações foram salvas com sucesso.',
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

    const deleteDiaEspecial = useMutation({
      mutationFn: async (id: string) => {
        await apiClient.settings.deleteSpecialDay(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['dias-especiais'] });
        toast({
          title: 'Dia especial removido!',
          description: 'O registro foi removido com sucesso.',
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

    const handleAddDiaEspecial = async () => {
      try {
        setIsLoading(true);
        await apiClient.settings.createSpecialDay({
          nome: 'Novo Feriado',
          data: new Date().toISOString().split('T')[0],
          recorrente: false,
          fechado: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoadingDias || !business) {
      return (
        <div className="flex items-center justify-center h-full">
          <p>Carregando dias especiais...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dias Especiais</h2>
            <p className="text-muted-foreground">
              Configure feriados e dias com horários diferentes
            </p>
          </div>
          <Button onClick={handleAddDiaEspecial} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dia Especial
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-x-3 p-6 border-b">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Feriados e Exceções</h3>
              <p className="text-sm text-muted-foreground">
                Defina datas com horários especiais ou fechamento
              </p>
            </div>
          </div>

          <div className="p-6">
            {diasEspeciais.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum dia especial configurado
                </h3>
                <p className="text-muted-foreground">
                  Adicione feriados e dias com horários diferentes
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {diasEspeciais.map((dia) => (
                  <div
                    key={dia.id}
                    className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end border-b pb-6"
                  >
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        value={dia.nome}
                        onChange={(e) =>
                          updateDiaEspecial.mutate({
                            ...dia,
                            nome: e.target.value,
                          })
                        }
                        placeholder="Ex: Natal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={dia.data}
                        onChange={(e) =>
                          updateDiaEspecial.mutate({
                            ...dia,
                            data: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Configuração</Label>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={dia.recorrente}
                            onChange={(e) =>
                              updateDiaEspecial.mutate({
                                ...dia,
                                recorrente: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300"
                          />
                          <span>Recorrente</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={dia.fechado}
                            onChange={(e) =>
                              updateDiaEspecial.mutate({
                                ...dia,
                                fechado: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300"
                          />
                          <span>Fechado</span>
                        </label>
                      </div>
                    </div>

                    {!dia.fechado && (
                      <div className="space-y-2">
                        <Label>Horário Especial</Label>
                        <div className="flex items-center gap-x-2">
                          <Input
                            type="time"
                            value={dia.hora_inicio || ''}
                            onChange={(e) =>
                              updateDiaEspecial.mutate({
                                ...dia,
                                hora_inicio: e.target.value || null,
                              })
                            }
                          />
                          <span>até</span>
                          <Input
                            type="time"
                            value={dia.hora_fim || ''}
                            onChange={(e) =>
                              updateDiaEspecial.mutate({
                                ...dia,
                                hora_fim: e.target.value || null,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteDiaEspecial.mutate(dia.id)}
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
}