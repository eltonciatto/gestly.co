import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Book, Copy, Key, RefreshCw, MessageSquareShare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function APISettings() {
  const [isGenerating, setIsGenerating] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: business, isLoading } = useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const { data } = await apiClient.business.get();
      return data;
    },
  });

  const generateApiKey = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.settings.generateApiKey();
      return data.key;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast({
        title: 'Chave API gerada!',
        description: 'Sua nova chave API está pronta para uso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar chave',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const handleGenerateKey = async () => {
    if (!confirm('Tem certeza? A chave atual deixará de funcionar.')) return;
    setIsGenerating(true);
    await generateApiKey.mutateAsync();
    setIsGenerating(false);
  };

  const handleCopyKey = async () => {
    if (!business?.api_key) return;
    await navigator.clipboard.writeText(business.api_key);
    toast({
      title: 'Chave copiada!',
      description: 'A chave API foi copiada para sua área de transferência.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando configurações da API...</p>
      </div>
    );
  }

  const isDocsPage = location.pathname.endsWith('/docs');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações da API</h2>
        <p className="text-muted-foreground">
          Gerencie suas integrações e webhooks
        </p>
      </div>

      <div className="flex items-center gap-x-2 border-b pb-4">
        <Button
          variant={isDocsPage ? 'ghost' : 'secondary'}
          asChild
        >
          <Link to="/dashboard/settings/api">
            <Key className="h-4 w-4 mr-2" />
            Chaves
          </Link>
        </Button>
        <Button
          variant={isDocsPage ? 'secondary' : 'ghost'}
          asChild
        >
          <Link to="/dashboard/settings/api/docs">
            <Book className="h-4 w-4 mr-2" />
            Documentação
          </Link>
        </Button>
      </div>

      {isDocsPage ? (
        <Outlet />
      ) : (
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-x-3 p-6 border-b">
            <Key className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Chave API</h3>
              <p className="text-sm text-muted-foreground">
                Use esta chave para autenticar suas requisições
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-x-2">
                <code className="flex-1 p-2 bg-muted rounded-md font-mono text-sm">
                  {business?.api_key || 'Nenhuma chave gerada'}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyKey}
                  disabled={!business?.api_key}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Inclua esta chave no header <code>x-api-key</code> das suas requisições.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center gap-x-3 p-6 border-b">
            <MessageSquareShare className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                URLs para receber notificações
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">URL Base</h4>
                <code className="text-sm">
                  {window.location.origin}/api/webhooks
                </code>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Eventos Disponíveis</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <code>appointment.create</code> - Novo agendamento
                  </li>
                  <li>
                    <code>appointment.update</code> - Atualização de agendamento
                  </li>
                  <li>
                    <code>customer.create</code> - Novo cliente
                  </li>
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Exemplo de payload para criar agendamento:
                </p>
                <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
{`{
  "type": "appointment.create",
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "service": {
    "id": "service_id",
  },
  "startTime": "2024-01-01T10:00:00Z",
  "notes": "Observações do agendamento"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>)}
    </div>
  );
}