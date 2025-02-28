import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { useLoading } from './use-loading';
import { AppError } from '@/lib/error';

interface UseFormOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
}

export function useForm<T>(options: UseFormOptions<T> = {}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isLoading, withLoading } = useLoading();
  const { toast } = useToast();

  const handleSubmit = useCallback(async (values: T) => {
    try {
      await withLoading(async () => {
        // Clear previous errors
        setErrors({});

        // Validate form data
        const validationErrors = await validateForm(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        // Submit form
        await options.onSuccess?.(values);

        // Show success message
        if (options.successMessage) {
          toast({
            title: 'Sucesso',
            description: options.successMessage,
            variant: 'success'
          });
        }

        // Reset form if needed
        if (options.resetOnSuccess) {
          // Reset form values
        }
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof AppError && error.code === 'validation') {
        setErrors(error.details || {});
        return;
      }

      // Show error message
      toast({
        title: 'Erro',
        description: options.errorMessage || 'Ocorreu um erro. Tente novamente.',
        variant: 'destructive'
      });

      // Call error callback
      options.onError?.(error as Error);
    }
  }, [options, toast, withLoading]);

  return {
    isLoading,
    errors,
    handleSubmit
  };
}

async function validateForm<T>(values: T): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};

  // Add validation logic here
  // Example:
  // if (!values.email) {
  //   errors.email = 'Email é obrigatório';
  // }

  return errors;
}