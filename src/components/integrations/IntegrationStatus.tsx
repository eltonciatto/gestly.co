import { useQuery } from '@tanstack/react-query';
import { query } from '@/lib/db';
import { Check, X, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface IntegrationStatusProps {
  integrationId: string;
}

export function IntegrationStatus({ integrationId }: IntegrationStatusProps) {
  const { data: logs } = useQuery({
    queryKey: ['integration-logs', integrationId],
    queryFn: async () => {
      const { data } = await apiClient.integrations.getLogs(integrationId);
      return data;
    },
  });

  if (!logs?.length) {
    return (
      <div className="flex items-center text-muted-foreground">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span className="text-xs">Sem atividade</span>
      </div>
    );
  }

  const successCount = logs.filter(log => log.success).length;
  const successRate = (successCount / logs.length) * 100;

  return (
    <div className="flex items-center gap-x-2">
      {successRate >= 90 ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : successRate >= 70 ? (
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className="text-xs">
        {successRate.toFixed(0)}% sucesso
      </span>
    </div>
  );
}