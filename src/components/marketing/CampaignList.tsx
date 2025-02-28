import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { getCampaigns, updateCampaignStatus } from '@/lib/db/marketing';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CampaignForm } from './CampaignForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function CampaignList() {
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      return getCampaigns(business.id);
    },
    enabled: !!business?.id
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateCampaignStatus(id, status as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: 'Status atualizado!',
        description: 'O status da campanha foi atualizado com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar status',
        description: 'Tente novamente mais tarde.',
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campanhas</h2>
          <p className="text-muted-foreground">
            Gerencie suas campanhas de marketing
          </p>
        </div>
        <Button onClick={() => setShowNewCampaign(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhuma campanha criada
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie campanhas para se comunicar com seus clientes
            </p>
            <Button onClick={() => setShowNewCampaign(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Campanha
            </Button>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-6 rounded-lg border"
            >
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <div className="flex items-center gap-x-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    campaign.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                    campaign.status === 'running' ? 'bg-green-100 text-green-700' :
                    campaign.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {campaign.type === 'email' ? 'Email' :
                     campaign.type === 'sms' ? 'SMS' : 'WhatsApp'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                {campaign.status === 'running' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus.mutate({
                      id: campaign.id,
                      status: 'paused'
                    })}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pausar
                  </Button>
                ) : campaign.status === 'draft' || campaign.status === 'paused' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus.mutate({
                      id: campaign.id,
                      status: 'running'
                    })}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Iniciar
                  </Button>
                ) : null}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta campanha?')) {
                      updateStatus.mutate({
                        id: campaign.id,
                        status: 'cancelled'
                      });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={showNewCampaign} onOpenChange={setShowNewCampaign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Campanha</DialogTitle>
          </DialogHeader>
          <CampaignForm onSuccess={() => setShowNewCampaign(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}