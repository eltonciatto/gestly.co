import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  minStock: z.number().min(0, 'Estoque mínimo deve ser maior ou igual a 0'),
  currentStock: z.number().min(0, 'Estoque atual deve ser maior ou igual a 0'),
  costPrice: z.number().min(0, 'Preço de custo deve ser maior ou igual a 0'),
  salePrice: z.number().min(0, 'Preço de venda deve ser maior ou igual a 0'),
  supplierId: z.string().uuid().optional()
});

type FormData = z.infer<typeof schema>;

interface ProductFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            placeholder="Ex: Shampoo"
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
            placeholder="Descrição do produto"
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            placeholder="Código do produto"
            {...register('sku')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="barcode">Código de Barras</Label>
          <Input
            id="barcode"
            placeholder="Código de barras"
            {...register('barcode')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unidade</Label>
          <Input
            id="unit"
            placeholder="Ex: UN, ML, KG"
            {...register('unit')}
          />
          {errors.unit && (
            <p className="text-sm text-destructive">{errors.unit.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minStock">Estoque Mínimo</Label>
          <Input
            id="minStock"
            type="number"
            min={0}
            {...register('minStock', { valueAsNumber: true })}
          />
          {errors.minStock && (
            <p className="text-sm text-destructive">{errors.minStock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentStock">Estoque Atual</Label>
          <Input
            id="currentStock"
            type="number"
            min={0}
            {...register('currentStock', { valueAsNumber: true })}
          />
          {errors.currentStock && (
            <p className="text-sm text-destructive">{errors.currentStock.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Preço de Custo</Label>
          <Input
            id="costPrice"
            type="number"
            step="0.01"
            min={0}
            {...register('costPrice', { valueAsNumber: true })}
          />
          {errors.costPrice && (
            <p className="text-sm text-destructive">{errors.costPrice.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="salePrice">Preço de Venda</Label>
          <Input
            id="salePrice"
            type="number"
            step="0.01"
            min={0}
            {...register('salePrice', { valueAsNumber: true })}
          />
          {errors.salePrice && (
            <p className="text-sm text-destructive">{errors.salePrice.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Produto'}
      </Button>
    </form>
  );
}