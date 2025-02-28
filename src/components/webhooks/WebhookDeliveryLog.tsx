import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface WebhookDeliveryLogProps {
  webhookId: string;
}

export function WebhookDeliveryLog({ webhookId }: WebhookDeliveryLogProps) {
  const { data: deliveries = [] } = useQuery({
    queryKey: ['webhook-deliveries', webhookId],
    queryFn: async () => {
      const { data } = await apiClient.webhooks.getDeliveries(webhookId);
      return data;
    },
  });