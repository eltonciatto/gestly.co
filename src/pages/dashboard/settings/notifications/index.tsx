import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

export default function NotificationsSettings() {
   const location = useLocation();
   const isEmail = location.pathname.endsWith('/email');
   const isWhatsApp = location.pathname.endsWith('/whatsapp');
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const { data: business } = useBusinessQuery();

   const { data: templates = [] } = useQuery({
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
     },
     onError: () => {
       toast({
         variant: 'destructive',
         title: 'Erro ao adicionar template',
         description: 'Tente novamente mais tarde.',
       });
     }
   });

   const updateTemplate = useMutation({
     mutationFn: async (values: any) => {
      const { id, ...data } = values; 
      await apiClient.notifications.updateTemplate(id, data);
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
     },
     onError: () => {
       toast({
         variant: 'destructive',
         title: 'Erro ao atualizar template',
         description: 'Tente novamente mais tarde.',
       });
     }
   });

   // Rest of the component remains the same
}