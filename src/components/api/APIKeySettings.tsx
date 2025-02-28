import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Key, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function APIKeySettings() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: apiKey, isLoading } = useQuery({
    queryKey: ['api-key', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.settings.getApiKey();
      return data;
    },
    enabled: !!business?.id
  });

  const generateKey = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.settings.generateApiKey();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-key'] });
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
    await generateKey.mutateAsync();
    setIsGenerating(false);
  };

  const handleCopyKey = async () => {
    if (!apiKey?.key) return;
    await navigator.clipboard.writeText(apiKey.key);
    toast({
      title: 'Chave copiada!',
      description: 'A chave API foi copiada para sua área de transferência.',
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
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
              {apiKey?.key || 'Nenhuma chave gerada'}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyKey}
              disabled={!apiKey?.key}
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
  );
}