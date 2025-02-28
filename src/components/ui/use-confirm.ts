import { useCallback } from 'react';
import { useDialog } from './use-dialog';
import { useToast } from './use-toast';

interface UseConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export function useConfirm({
  title = 'Confirmação',
  message = 'Tem certeza que deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel
}: UseConfirmOptions = {}) {
  const { toast } = useToast();
  const dialog = useDialog({
    onConfirm: async () => {
      try {
        await onConfirm?.();
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Ocorreu um erro ao executar a ação.',
          variant: 'destructive'
        });
        throw error;
      }
    },
    onClose: onCancel
  });

  const confirm = useCallback(() => {
    dialog.setIsOpen(true);
  }, [dialog]);

  return {
    confirm,
    isOpen: dialog.isOpen,
    isLoading: dialog.isLoading,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    onClose: dialog.handleClose
  };
}