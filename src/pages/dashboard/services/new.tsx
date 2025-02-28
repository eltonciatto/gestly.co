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

export default function NewService() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: business } = useBusinessQuery();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await apiClient.services.create(data);

      toast({
        title: 'Serviço cadastrado com sucesso!',
        description: 'O serviço foi adicionado à sua lista.',
      });

      navigate('/dashboard/services');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar serviço',
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
          onClick={() => navigate('/dashboard/services')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Novo Serviço</h2>
        <p className="text-muted-foreground">
          Adicione um novo serviço ao seu catálogo
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar Serviço'}
        </Button>
      </form>
    </div>
  );
}