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
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

interface HorarioFuncionamento {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  fechado: boolean;
}

export default function BusinessHours() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: horarios = [], isLoading: isLoadingHorarios } = useQuery({
    queryKey: ['horarios-funcionamento', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.businessHours.list();
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
        title: 'Erro ao atualizar',
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

  const handleAddHorario = async () => {
    try {
      setIsLoading(true);
      await apiClient.businessHours.create({
        dia_semana: 0,
        hora_inicio: '09:00',
        hora_fim: '18:00',
        fechado: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHorarios || !business) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando horários de funcionamento...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Horários de Funcionamento</h2>
          <p className="text-muted-foreground">
            Configure os horários de atendimento da sua empresa
          </p>
        </div>
        <Button onClick={handleAddHorario} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Horário
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Horários de Atendimento</h3>
            <p className="text-sm text-muted-foreground">
              Defina os horários de funcionamento para cada dia da semana
            </p>
          </div>
        </div>

        <div className="p-6">
          {horarios.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhum horário configurado
              </h3>
              <p className="text-muted-foreground">
                Adicione os horários de funcionamento da sua empresa
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {horarios.map((horario) => (
                <div
                  key={horario.id}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end border-b pb-6"
                >
                  <div className="space-y-2">
                    <Label>Dia da Semana</Label>
                    <select
                      value={horario.dia_semana}
                      onChange={(e) =>
                        updateHorario.mutate({
                          ...horario,
                          dia_semana: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {DIAS_SEMANA.map((dia, index) => (
                        <option key={index} value={index}>
                          {dia}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Configuração</Label>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={horario.fechado}
                          onChange={(e) =>
                            updateHorario.mutate({
                              ...horario,
                              fechado: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300"
                        />
                        <span>Fechado</span>
                      </label>
                    </div>
                  </div>

                  {!horario.fechado && (
                    <div className="space-y-2">
                      <Label>Horário de Funcionamento</Label>
                      <div className="flex items-center gap-x-2">
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
                        <span>até</span>
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
                    </div>
                  )}

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
      </div>
    </div>
  );
}