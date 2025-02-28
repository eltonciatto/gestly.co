import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseSelectOptions<T> {
  onSelect?: (value: T) => void | Promise<void>;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useSelect<T>(options: UseSelectOptions<T> = {}) {
  const [selectedValue, setSelectedValue] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelect = useCallback(async (value: T) => {
    if (options.onSelect) {
      try {
        setIsLoading(true);
        await options.onSelect(value);
        setSelectedValue(value);

        if (options.successMessage) {
          toast({
            title: 'Sucesso',
            description: options.successMessage,
            variant: 'success'
          });
        }
      } catch (error) {
        const err = error as Error;
        toast({
          title: 'Erro',
          description: options.errorMessage || err.message || 'Ocorreu um erro. Tente novamente.',
          variant: 'destructive'
        });
        options.onError?.(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSelectedValue(value);
    }
  }, [options.onSelect, options.successMessage, options.errorMessage, options.onError, toast]);

  return {
    selectedValue,
    setSelectedValue,
    isLoading,
    handleSelect
  };
}