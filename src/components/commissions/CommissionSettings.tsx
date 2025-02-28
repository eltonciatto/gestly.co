import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Settings2, Plus, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';

export function CommissionSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!business?.id
  });

  const { data: attendants } = useQuery({
    queryKey: ['attendants'],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'attendant')
        .order('full_name');
      if (error) throw error;
      return data;
    },
    enabled: !!business?.id
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['commission-settings', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from('commission_settings')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!business?.id
  });

  const updateSetting = useMutation({
    mutationFn: async (setting: any) => {
      const { error } = await supabase
        .from('commission_settings')
        .update(setting)
        .eq('id', setting.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
      toast({
        title: 'Configuração atualizada!',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar configuração',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteSetting = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('commission_settings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
      toast({
        title: 'Configuração removida!',
        description: 'A configuração foi removida com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover configuração',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const addSetting = useMutation({
    mutationFn: async () => {
      if (!services?.length) {
        throw new Error('Nenhum serviço cadastrado');
      }

      const { error } = await supabase
        .from('commission_settings')
        .insert({
          business_id: business?.id,
          service_id: services[0].id,
          commission_percentage: 40,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
      toast({
        title: 'Configuração adicionada!',
        description: 'A nova configuração foi salva com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar configuração',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações de Comissão</h2>
        <p className="text-muted-foreground">
          Configure as comissões por serviço e profissional
        </p>
      </div>

      <div className="rounded-lg border bg-card mb-6">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Comissão Padrão</h3>
            <p className="text-sm text-muted-foreground">
              Defina a porcentagem padrão de comissão para todos os serviços
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Porcentagem Padrão</Label>
              <div className="flex items-center gap-x-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  className="w-32"
                  value={business?.default_commission_percentage || 40}
                  onChange={async (e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) return;
                    
                    const { error } = await supabase
                      .from('businesses')
                      .update({ default_commission_percentage: value })
                      .eq('id', business?.id);
                      
                    if (error) {
                      toast({
                        variant: 'destructive',
                        title: 'Erro ao atualizar',
                        description: 'Tente novamente mais tarde.',
                      });
                    } else {
                      queryClient.invalidateQueries({ queryKey: ['business'] });
                    }
                  }}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Esta porcentagem será usada quando não houver uma configuração específica.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Settings2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Regras de Comissão</h3>
            <p className="text-sm text-muted-foreground">
              Defina as porcentagens de comissão para cada serviço
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.id} className="grid gap-4 md:grid-cols-4 items-end border-t pt-4">
                <div className="space-y-2">
                  <Label>Serviço</Label>
                  <select
                    className="w-full rounded-md border p-2"
                    value={setting.service_id}
                    onChange={(e) => 
                      updateSetting.mutate({
                        ...setting,
                        service_id: e.target.value
                      })
                    }
                  >
                    {services?.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Profissional (opcional)</Label>
                  <select
                    className="w-full rounded-md border p-2"
                    value={setting.attendant_id || ''}
                    onChange={(e) =>
                      updateSetting.mutate({
                        ...setting,
                        attendant_id: e.target.value || null
                      })
                    }
                  >
                    <option value="">Todos os profissionais</option>
                    {attendants?.map((attendant) => (
                      <option key={attendant.id} value={attendant.id}>
                        {attendant.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Comissão (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={setting.commission_percentage}
                    onChange={(e) =>
                      updateSetting.mutate({
                        ...setting,
                        commission_percentage: parseFloat(e.target.value)
                      })
                    }
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSetting.mutate(setting.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              onClick={() => {
                if (!services?.length) {
                  toast({
                    variant: 'destructive',
                    title: 'Nenhum serviço cadastrado',
                    description: 'Cadastre serviços antes de configurar comissões.',
                  });
                  return;
                }

                addSetting.mutate();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Regra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}