import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bot, Plus, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IntegrationPlatform } from '@/lib/integrations';

const PLATFORMS: { id: IntegrationPlatform; name: string }[] = [
  { id: 'typebot', name: 'Typebot' },
  { id: 'manychat', name: 'ManyChat' },
  { id: 'sendbot', name: 'SendBot' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'telegram', name: 'Telegram' },
];

export default function IntegrationsSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data } = await apiClient.integrations.list();
      return data;
    },
  });

  const createIntegration = useMutation({
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
        title: 'Integração removida!',
        description: 'A integração foi removida com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover integração',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  if (isLoading) {
    return <div>Carregando integrações...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Integrações</h2>
          <p className="text-muted-foreground">
            Conecte o Gestly com outras plataformas
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Integração
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Integração</DialogTitle>
            </DialogHeader>
            <NewIntegrationForm onSubmit={createIntegration.mutate} />
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
            <Button
              onClick={() => setIsDialogOpen(true)}
            >
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
                    {PLATFORMS.find(p => p.id === integration.platform)?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja remover esta integração?')) {
                      deleteIntegration.mutate(integration.id);
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
    </div>
  );
}

function NewIntegrationForm({
  onSubmit,
}: {
  onSubmit: (values: any) => void;
}) {
  const [platform, setPlatform] = useState<IntegrationPlatform>();
  const [name, setName] = useState('');
  const [config, setConfig] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !name) return;
    onSubmit({ platform, name, config });
  };

  const renderConfigFields = () => {
    if (!platform) return null;

    switch (platform) {
      case 'typebot':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhook_url">Webhook URL</Label>
              <Input
                id="webhook_url"
                value={config.webhook_url || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    webhook_url: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                value={config.api_key || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    api_key: e.target.value,
                  }))
                }
              />
            </div>
          </>
        );
      case 'manychat':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="page_id">Page ID</Label>
              <Input
                id="page_id"
                value={config.page_id || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    page_id: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_token">Access Token</Label>
              <Input
                id="access_token"
                type="password"
                value={config.access_token || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    access_token: e.target.value,
                  }))
                }
              />
            </div>
          </>
        );
      // Add other platforms...
      default:
        return (
          <p className="text-muted-foreground">
            Selecione uma plataforma para continuar
          </p>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="platform">Plataforma</Label>
        <Select
          value={platform}
          onValueChange={(value) => setPlatform(value as IntegrationPlatform)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma plataforma" />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome da Integração</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Typebot - Agendamentos"
        />
      </div>

      {renderConfigFields()}

      <Button type="submit" className="w-full">
        Adicionar Integração
      </Button>
    </form>
  );
}