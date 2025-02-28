import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  commission_percentage: z.coerce
    .number()
    .min(0, 'Comissão deve ser maior ou igual a 0')
    .max(100, 'Comissão máxima é 100%')
    .default(40),
});

type FormData = z.infer<typeof schema>;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      await apiClient.team.create({
        name: data.name,
        email: data.email,
        commission_percentage: data.commission_percentage
      });

      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      
      toast({
        title: 'Profissional adicionado!',
        description: 'Um email foi enviado com as instruções de acesso.',
      });
      
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar profissional',
        description: 'Verifique os dados e tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Profissional</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              placeholder="Nome do profissional"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="commission_percentage">Comissão (%)</Label>
            <Input
              id="commission_percentage"
              type="number"
              step="0.1"
              min={0}
              max={100}
              placeholder="40"
              {...register('commission_percentage')}
            />
            {errors.commission_percentage && (
              <p className="text-sm text-destructive">
                {errors.commission_percentage.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adicionando...' : 'Adicionar Profissional'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}