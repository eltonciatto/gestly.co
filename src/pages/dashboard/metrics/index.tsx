
 import { useBusinessQuery } from '@/lib/queries';
 import { format } from 'date-fns';
 import { ptBR } from 'date-fns/locale';
 import { DollarSign, Users, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { apiClient } from '@/lib/api/client';
 
 export default function MetricsPage() {
   const [startDate, setStartDate] = useState(() => {
   const { data: business } = useBusinessQuery();
 
   const { data: metrics } = useQuery({
     queryKey: ['metrics', business?.id, startDate, endDate],
-      const { data, error } = await supabase.rpc(
-        'get_metrics',
-        {
-          p_business_id: business.id,
-          p_start_date: startDate,
-          p_end_date: endDate
-        }
-      );
-
-      if (error) throw error;
-      return data;
+      const { data } = await apiClient.reports.metrics({
+        startDate,
+        endDate
+      });
+      return data;
      const { data } = await apiClient.reports.metrics({
        startDate,
        endDate
      });
      const { data } = await apiClient.reports.metrics({
        startDate,
        endDate
      });
      return data;
     },
     enabled: !!business?.id
   });
