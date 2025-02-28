import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { AppError } from '@/lib/error';

interface UseCrudOptions<T> {
  resource: string;
  queryFn: {
    list: () => Promise<T[]>;
    get: (id: string) => Promise<T>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
  };
  messages?: {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    createError?: string;
    updateError?: string;
    deleteError?: string;
  };
}

export function useCrud<T extends { id: string }>({
  resource,
  queryFn,
  messages = {}
}: UseCrudOptions<T>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // List query
  const list = useQuery({
    queryKey: [resource],
    queryFn: async () => {
      try {
        return await queryFn.list();
      } catch (error) {
        if (error instanceof AppError) {
          toast({
            title: 'Erro',
            description: error.message,
            variant: 'destructive'
          });
        }
        throw error;
      }
    }
  });

  // Get single item query
  const get = useCallback((id: string) => {
    return useQuery({
      queryKey: [resource, id],
      queryFn: () => queryFn.get(id)
    });
  }, [resource, queryFn]);

  // Create mutation
  const create = useMutation({
    mutationFn: (data: Partial<T>) => queryFn.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      toast({
        title: 'Sucesso',
        description: messages.createSuccess || 'Item criado com sucesso',
        variant: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: messages.createError || 'Erro ao criar item',
        variant: 'destructive'
      });
    }
  });

  // Update mutation
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => 
      queryFn.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      toast({
        title: 'Sucesso',
        description: messages.updateSuccess || 'Item atualizado com sucesso',
        variant: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: messages.updateError || 'Erro ao atualizar item',
        variant: 'destructive'
      });
    }
  });

  // Delete mutation
  const remove = useMutation({
    mutationFn: (id: string) => queryFn.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      toast({
        title: 'Sucesso',
        description: messages.deleteSuccess || 'Item removido com sucesso',
        variant: 'success'
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: messages.deleteError || 'Erro ao remover item',
        variant: 'destructive'
      });
    }
  });

  return {
    list,
    get,
    create,
    update,
    remove
  };
}