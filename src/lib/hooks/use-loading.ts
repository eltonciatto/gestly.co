import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface UseLoadingOptions {
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

/**
 * Hook para gerenciar estado de loading
 * @param initialState Estado inicial do loading
 * @param options Opções de configuração
 * @returns Estado de loading e funções auxiliares
 */
export function useLoading(initialState = false, options: UseLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(initialState);
  const { toast } = useToast();

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await fn();
      if (options.showToast && options.successMessage) {
        toast({
          title: 'Sucesso',
          description: options.successMessage,
          variant: 'success'
        });
      }
      return result;
    } catch (error) {
      if (options.showToast) {
        toast({
          title: 'Erro',
          description: options.errorMessage || 'Ocorreu um erro. Tente novamente.',
          variant: 'destructive'
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options.successMessage, options.errorMessage, options.showToast, toast]);

  return { 
    isLoading, 
    setIsLoading, 
    withLoading 
  };
}