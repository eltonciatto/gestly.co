import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BusinessSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: business } = useBusinessQuery();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: business ? {
      name: business.name,
      email: business.email || '',
      phone: business.phone || '',
      address: business.address || '',
    } : undefined,
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await apiClient.business.update(data);

      toast({
        title: 'Configurações salvas!',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/settings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Dados do Negócio</h2>
        <p className="text-muted-foreground">
          Configure as informações básicas do seu negócio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Negócio</Label>
            <Input
              id="name"
              placeholder="Nome da sua empresa"
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
              placeholder="contato@empresa.com.br"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Endereço completo"
              {...register('address')}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </div>
  );
}