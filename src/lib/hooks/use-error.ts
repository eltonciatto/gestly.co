import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AppError } from '@/lib/error';

interface UseErrorOptions {
  onError?: (error: Error) => void;
  showToast?: boolean;
}

/**
 * Hook para gerenciar erros na aplicação
 * @param options Opções de configuração
 * @returns Funções e estado para gerenciamento de erros
 */
export function useError(options: UseErrorOptions = {}) {
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const handleError = useCallback((error: unknown) => {
    const normalizedError = error instanceof Error ? error : new Error('Unknown error');
    setError(normalizedError);

    if (options.showToast) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: normalizedError instanceof AppError 
          ? normalizedError.message 
          : 'Ocorreu um erro inesperado'
      });
    }

    options.onError?.(normalizedError);
  }, [options, toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    isError: !!error
  };
}