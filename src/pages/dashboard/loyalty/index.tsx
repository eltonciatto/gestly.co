@@ .. @@
 import { format } from 'date-fns';
 import { ptBR } from 'date-fns/locale';
 import { Gift, Star, Clock } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { useToast } from '@/components/ui/use-toast';
 import { apiClient } from '@/lib/api/client';
 
 export default function LoyaltyPage() {
   const [isLoading, setIsLoading] = useState(false);
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const { data: business } = useBusinessQuery();
 
   const { data: program } = useQuery({
     queryKey: ['loyalty-program', business?.id],
     queryFn: async () => {
-      const { data, error } = await supabase
-        .from('loyalty_programs')
-        .select('*')
-        .eq('business_id', business.id)
-        .single();
-      if (error) throw error;
-      return data;
+      const { data } = await apiClient.loyalty.getProgram();
+      return data;
     },
     enabled: !!business?.id
   });
@@ .. @@
   const { data: rewards = [] } = useQuery({
     queryKey: ['loyalty-rewards', business?.id],
     queryFn: async () => {
-      const { data, error } = await supabase
-        .from('loyalty_rewards')
-        .select('*')
-        .eq('business_id', business.id)
-        .eq('is_active', true)
-        .order('points_required');
-      if (error) throw error;
-      return data;
+      const { data } = await apiClient.loyalty.getRewards();
+      return data;
     },
     enabled: !!business?.id
   });
@@ .. @@