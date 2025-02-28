import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { getSpecialDays, createSpecialDay } from '@/lib/db/business-hours';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function SpecialDays() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: specialDays = [], isLoading: isLoadingDays } = useQuery({
    queryKey: ['special-days', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      return getSpecialDays(business.id);
    },
    enabled: !!business?.id
  });

  const addSpecialDay = useMutation({
    mutationFn: async () => {
      if (!business?.id) return;
      return createSpecialDay({
        business_id: business.id,
        date: new Date().toISOString().split('T')[0],
        name: 'Novo Feriado',
        is_closed: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-days'] });
      toast({
        title: 'Dia especial adicionado!',
        description: 'O dia especial foi criado com sucesso.',
      });
    }
  });

  if (isLoadingDays) {
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
          <h2 className="text-2xl font-bold tracking-tight">Dias Especiais</h2>
          <p className="text-muted-foreground">
            Configure feriados e dias com horários diferentes
          </p>
        </div>
        <Button onClick={() => addSpecialDay.mutate()}>
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
          {specialDays.length === 0 ? (
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
              {specialDays.map((day) => (
                <div
                  key={day.id}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end border-b pb-6"
                >
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={day.name}
                      onChange={(e) => {
                        // Update name
                      }}
                      placeholder="Ex: Natal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={day.date}
                      onChange={(e) => {
                        // Update date
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Configuração</Label>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={day.is_closed}
                          onChange={(e) => {
                            // Update is_closed
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>Fechado</span>
                      </label>
                    </div>
                  </div>

                  {!day.is_closed && (
                    <div className="space-y-2">
                      <Label>Horário Especial</Label>
                      <div className="flex items-center gap-x-2">
                        <Input
                          type="time"
                          value={day.start_time || ''}
                          onChange={(e) => {
                            // Update start_time
                          }}
                        />
                        <span>até</span>
                        <Input
                          type="time"
                          value={day.end_time || ''}
                          onChange={(e) => {
                            // Update end_time
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Delete special day
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
      </div>
    </div>
  );
}