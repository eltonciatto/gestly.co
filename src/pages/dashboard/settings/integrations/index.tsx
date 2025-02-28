import { IntegrationList } from '@/components/integrations/IntegrationList';
import { GoogleCalendarIntegration } from '@/components/integrations/GoogleCalendarIntegration';
import { ICalIntegration } from '@/components/integrations/ICalIntegration';
import { SocialMediaIntegration } from '@/components/integrations/SocialMediaIntegration';
import { AccountingIntegration } from '@/components/integrations/AccountingIntegration';
import { Bot, Plus, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';

export default function IntegrationsSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const { data } = await apiClient.integrations.list();
      return data;
    }
  });

  const createIntegration = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.integrations.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      setIsDialogOpen(false);
      toast({
        title: 'Integração criada',
        description: 'Sua nova integração foi adicionada com sucesso.',
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
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integrações</h2>
        <p className="text-muted-foreground">
          Conecte o Gestly com suas ferramentas favoritas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GoogleCalendarIntegration />
        <ICalIntegration />
        <SocialMediaIntegration />
        <AccountingIntegration />
      </div>

      <IntegrationList />
    </div>
  );
}