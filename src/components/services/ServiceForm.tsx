import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

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
  commission_percentage: z.coerce
    .number()
    .min(0, 'Comissão deve ser maior ou igual a 0')
    .max(100, 'Comissão máxima é 100%')
    .default(40),
});

type FormData = z.infer<typeof schema>;

interface ServiceFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function ServiceForm({ initialData, onSubmit, isLoading }: ServiceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <p className="text-sm text-destructive">{errors.duration.message}</p>
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

        <div className="space-y-2">
          <Label htmlFor="commission_percentage">Comissão (%)</Label>
          <Input
            id="commission_percentage"
            type="number"
            step="0.1"
            min={0}
            max={100}
            placeholder="Ex: 40"
            {...register('commission_percentage')}
          />
          {errors.commission_percentage && (
            <p className="text-sm text-destructive">
              {errors.commission_percentage.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Serviço'}
      </Button>
    </form>
  );
}