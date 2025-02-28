import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  duration: z.coerce
    .number()
    .min(1, 'Duração deve ser maior que 0')
    .max(480, 'Duração máxima é de 8 horas'),
  price: z.coerce
    .number()
    .min(0, 'Preço deve ser maior ou igual a 0')
    .max(99999.99, 'Preço máximo é R$ 99.999,99'),
});

type FormData = z.infer<typeof schema>;

export default function EditService() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: service, isLoading: isLoadingService } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data } = await apiClient.services.get(id!);
      return data;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: service ? {
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price,
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiClient.services.update(id!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Serviço atualizado com sucesso!',
        description: 'As alterações foram salvas.',
      });
      navigate('/dashboard/services');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar serviço',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.services.delete(id!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Serviço excluído com sucesso!',
        description: 'O serviço foi removido da sua lista.',
      });
      navigate('/dashboard/services');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir serviço',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await updateMutation.mutateAsync(data);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;
    setIsDeleting(true);
    await deleteMutation.mutateAsync();
    setIsDeleting(false);
  };

  if (isLoadingService) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando serviço...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Serviço não encontrado.</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate('/dashboard/services')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/services')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Editar Serviço</h2>
        <p className="text-muted-foreground">
          Atualize as informações do serviço
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do serviço</Label>
            <Input
              id="name"
              placeholder="Ex: Corte de cabelo"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Descrição do serviço"
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              max={480}
              placeholder="Ex: 60"
              {...register('duration')}
            />
            {errors.duration && (
              <p className="text-sm text-destructive">
                {errors.duration.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min={0}
              max={99999.99}
              placeholder="Ex: 50.00"
              {...register('price')}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Excluindo...' : 'Excluir Serviço'}
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}