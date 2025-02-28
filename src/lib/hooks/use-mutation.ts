import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void | Promise<void>;
  invalidateQueries?: string[];
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Hook personalizado para mutations com tratamento de erro integrado
 */
export function useMutation<TData = unknown, TVariables = unknown>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries,
  successMessage,
  errorMessage
}: UseMutationOptions<TData, TVariables>) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setIsLoading(true);
      const data = await mutationFn(variables);

      // Invalidate queries if needed
      if (invalidateQueries) {
        await Promise.all(
          invalidateQueries.map(query => 
            queryClient.invalidateQueries({ queryKey: [query] })
          )
        );
      }

      // Call onSuccess callback
      await onSuccess?.(data, variables);

      // Show success toast
      if (successMessage) {
        toast({
          title: 'Sucesso',
          description: successMessage,
          variant: 'success'
        });
      }

      return data;
    } catch (error) {
      // Call onError callback
      await onError?.(error as Error, variables);

      // Show error toast
      toast({
        title: 'Erro',
        description: errorMessage || (error as Error).message || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive'
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [
    mutationFn,
    onSuccess,
    onError,
    invalidateQueries,
    successMessage,
    errorMessage,
    queryClient,
    toast
  ]);

  return {
    mutate,
    isLoading
  };
}