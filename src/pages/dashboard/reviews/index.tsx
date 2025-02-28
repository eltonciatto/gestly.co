import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

export default function Reviews() {
   const [filter, setFilter] = useState('all');
   const [selectedAttendant, setSelectedAttendant] = useState('all');
   const { toast } = useToast();
   const queryClient = useQueryClient();
   const { data: business } = useBusinessQuery();

   const { data: reviews = [], isLoading } = useQuery({
     queryKey: ['reviews', filter, selectedAttendant],
     queryFn: async () => {
      const { data } = await apiClient.reviews.list({
        filter,
        attendantId: selectedAttendant !== 'all' ? selectedAttendant : undefined,
        orderBy: '-created_at'
      });
      return data;
     },
     enabled: !!business?.id
   });

   const handleResponder = async (id: string, resposta: string) => {
     try {
      await apiClient.reviews.update(id, {
        resposta,
        respondido_em: new Date().toISOString()
      });

       queryClient.invalidateQueries({ queryKey: ['reviews'] });
       toast({
         title: 'Resposta enviada!',
         description: 'Sua resposta foi publicada com sucesso.',
       });
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Erro ao responder',
         description: 'Tente novamente mais tarde.',
       });
     }
   };
}