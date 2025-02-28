import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Bot, Plus, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { 
  getIntegrations,
  createIntegration,
  logIntegrationEvent,
  type Integration 
} from '@/lib/db/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { IntegrationForm } from './IntegrationForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function IntegrationList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.integrations.list();
      return data;
    },
    enabled: !!business?.id
  });

  const addIntegration = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.integrations.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsDialogOpen(false);
      toast({
        title: 'Integração adicionada!',
        description: 'A integração foi configurada com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar integração',
        description: 'Verifique os dados e tente novamente.',
      });
    },
  });

  const deleteIntegration = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.integrations.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: 'Integração removida',
        description: 'A integração foi excluída com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover integração',
        description: 'Verifique os dados e tente novamente.',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integrações</h2>
          <p className="text-muted-foreground">
            Conecte o Gestly com suas ferramentas favoritas
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Integração
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Integração</DialogTitle>
            </DialogHeader>
            <IntegrationForm onSubmit={addIntegration.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {integrations.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma integração configurada
            </h3>
            <p className="text-muted-foreground mb-4">
              Conecte o Gestly com suas ferramentas favoritas
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Integração
            </Button>
          </div>
        ) : (
          integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-6 rounded-lg border"
            >
              <div className="flex items-center gap-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {integration.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    deleteIntegration.mutate(integration.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}