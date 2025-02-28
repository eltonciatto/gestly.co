import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { useLoading } from './use-loading';

interface UseFormDialogOptions<T> {
  onSubmit?: (data: T) => Promise<void>;
  onClose?: () => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useFormDialog<T>({
  onSubmit,
  onClose,
  successMessage = 'Dados salvos com sucesso.',
  errorMessage = 'Erro ao salvar dados.'
}: UseFormDialogOptions<T> = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = useCallback(async (data: T) => {
    if (!onSubmit) return;

    try {
      await withLoading(async () => {
        await onSubmit(data);
        toast({
          title: 'Sucesso',
          description: successMessage,
          variant: 'success'
        });
        setIsOpen(false);
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [onSubmit, successMessage, errorMessage, withLoading, toast]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setIsOpen(false);
      onClose?.();
    }
  }, [isLoading, onClose]);

  return {
    isOpen,
    setIsOpen,
    isLoading,
    handleSubmit,
    handleClose
  };
}