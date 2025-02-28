import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseLoadingSpinnerOptions {
  message?: string;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

export function useLoadingSpinner(options: UseLoadingSpinnerOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const withSpinner = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsVisible(true);
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
      setIsVisible(false);
    }
  }, [options.successMessage, options.errorMessage, options.showToast, toast]);

  return {
    isVisible,
    setIsVisible,
    withSpinner,
    message: options.message || 'Carregando...'
  };
}