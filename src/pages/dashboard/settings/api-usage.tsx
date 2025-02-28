import { getApiUsage } from '@/lib/api-limits';
import { apiClient } from '@/lib/api/client';

export default function APIUsage() {
  
  const { data: usage, isLoading } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const { data } = await apiClient.settings.getApiUsage();
      return data;
    },
  });
}