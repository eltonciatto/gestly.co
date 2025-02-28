import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { MessageSquare, Plus, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { 
  getNotificationTemplates,
  createNotificationTemplate,
  updateNotificationTemplate,
  type NotificationTemplate 
} from '@/lib/db/notifications';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { NotificationForm } from './NotificationForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function NotificationList() {
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['notification-templates', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.notifications.getTemplates();
      return data;
    },
    enabled: !!business?.id
  });

  const addTemplate = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.notifications.createTemplate(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      setShowNewTemplate(false);
      toast({
        title: 'Template adicionado!',
        description: 'O template foi criado com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar template',
        description: 'Verifique os dados e tente novamente.',
      });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async (values: Partial<NotificationTemplate> & { id: string }) => {
      const { id, ...data } = values;
      await apiClient.notifications.updateTemplate(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
      toast({
        title: 'Template atualizado!',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar template',
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
          <h2 className="text-2xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">
            Configure templates de notificações automáticas
          </p>
        </div>
        <Button onClick={() => setShowNewTemplate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <div className="grid gap-6">
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum template configurado
            </h3>
            <p className="text-muted-foreground mb-4">
              Configure templates para enviar notificações automáticas
            </p>
            <Button onClick={() => setShowNewTemplate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-6 rounded-lg border"
            >
              <div>
                <div className="flex items-center gap-x-2">
                  <h3 className="font-medium">{template.trigger}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    template.type === 'email' ? 'bg-blue-100 text-blue-700' :
                    template.type === 'sms' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {template.type.toUpperCase()}
                  </span>
                </div>
                {template.subject && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.subject}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Open edit dialog
                  }}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este template?')) {
                      updateTemplate.mutate({
                        id: template.id,
                        is_active: false
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

      <Dialog open={showNewTemplate} onOpenChange={setShowNewTemplate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Template</DialogTitle>
          </DialogHeader>
          <NotificationForm onSubmit={addTemplate.mutate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}