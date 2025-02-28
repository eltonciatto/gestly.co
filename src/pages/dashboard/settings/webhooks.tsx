import { WebhookList } from '@/components/webhooks/WebhookList';
import { MessageSquareShare, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function WebhookSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.webhooks.list();
      return data;
    },
    enabled: !!business?.id
  });

  const addWebhook = useMutation({
    mutationFn: async (values: any) => {
      await apiClient.webhooks.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.webhooks.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Webhooks</h2>
        <p className="text-muted-foreground">
          Configure webhooks para receber notificações em tempo real
        </p>
      </div>

      <WebhookList />
    </div>
  );
}