import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseDialogOptions {
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>;
  confirmMessage?: string;
  errorMessage?: string;
}

export function useDialog(options: UseDialogOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setIsOpen(false);
      options.onClose?.();
    }
  }, [isLoading, options.onClose]);

  const handleConfirm = useCallback(async () => {
    if (options.onConfirm) {
      try {
        setIsLoading(true);
        await options.onConfirm();
        
        if (options.confirmMessage) {
          toast({
            title: 'Sucesso',
            description: options.confirmMessage,
            variant: 'success'
          });
        }
        
        handleClose();
      } catch (error) {
        toast({
          title: 'Erro',
          description: options.errorMessage || 'Ocorreu um erro. Tente novamente.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      handleClose();
    }
  }, [options.onConfirm, options.confirmMessage, options.errorMessage, handleClose, toast]);

  return {
    isOpen,
    setIsOpen,
    isLoading,
    handleClose,
    handleConfirm
  };
}