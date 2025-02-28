import { Link, Outlet, useLocation } from 'react-router-dom';
import { Key, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APIKeySettings } from '@/components/api/APIKeySettings';
import { APIUsageStats } from '@/components/api/APIUsageStats';
import { apiClient } from '@/lib/api/client';

export default function APISettings() {
  const location = useLocation();
  const isDocsPage = location.pathname.endsWith('/docs');
  const { toast } = useToast();

  const { data: apiKey } = useQuery({
    queryKey: ['api-key'],
    queryFn: async () => {
      const { data } = await apiClient.settings.getApiKey();
      return data.key;
    }
  });

  const generateApiKey = useMutation({
    mutationFn: async () => {
      await apiClient.settings.generateApiKey();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-key'] });
      toast({
        title: 'Chave API gerada',
        description: 'Uma nova chave API foi gerada com sucesso.',
      });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API</h2>
        <p className="text-muted-foreground">
          Gerencie sua integração via API
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
        <div className="space-y-6">
          <APIKeySettings />
          <APIUsageStats />
        </div>
      )}
    </div>
  );
}