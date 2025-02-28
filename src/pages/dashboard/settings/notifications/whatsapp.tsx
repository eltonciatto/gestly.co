import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

   const [isConnected, setIsConnected] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const { data } = await apiClient.notifications.getWhatsAppConfig();
   return data;
   await apiClient.notifications.updateWhatsAppConfig(values);
   },
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['whatsapp-config'] });
     toast({
       title: 'Configurações atualizadas',
       description: 'As configurações do WhatsApp foram salvas com sucesso.',
     });
   },
   onError: () => {
     toast({
       variant: 'destructive',
       title: 'Erro ao atualizar',
       description: 'Tente novamente mais tarde.',
     });
   },
 });

 // Rest of the component remains the same
}