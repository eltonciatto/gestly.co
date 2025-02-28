import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { useLoading } from './use-loading';

interface UseListOptions<T> {
  onDelete?: (item: T) => Promise<void>;
  onUpdate?: (item: T) => Promise<void>;
  onMove?: (item: T, direction: 'up' | 'down') => Promise<void>;
}

export function useList<T extends { id: string }>({
  onDelete,
  onUpdate,
  onMove
}: UseListOptions<T> = {}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();
  const { withLoading } = useLoading();

  const handleDelete = useCallback(async (item: T) => {
    if (!onDelete) return;

    try {
      await withLoading(async () => {
        await onDelete(item);
        setSelectedItems(prev => prev.filter(id => id !== item.id));
        toast({
          title: 'Item removido',
          description: 'O item foi removido com sucesso.',
          variant: 'success'
        });
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover',
        description: 'Não foi possível remover o item.',
        variant: 'destructive'
      });
    }
  }, [onDelete, withLoading, toast]);

  const handleUpdate = useCallback(async (item: T) => {
    if (!onUpdate) return;

    try {
      await withLoading(async () => {
        await onUpdate(item);
        toast({
          title: 'Item atualizado',
          description: 'O item foi atualizado com sucesso.',
          variant: 'success'
        });
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível atualizar o item.',
        variant: 'destructive'
      });
    }
  }, [onUpdate, withLoading, toast]);

  const handleMove = useCallback(async (item: T, direction: 'up' | 'down') => {
    if (!onMove) return;

    try {
      await withLoading(async () => {
        await onMove(item, direction);
        toast({
          title: 'Item movido',
          description: 'O item foi movido com sucesso.',
          variant: 'success'
        });
      });
    } catch (error) {
      toast({
        title: 'Erro ao mover',
        description: 'Não foi possível mover o item.',
        variant: 'destructive'
      });
    }
  }, [onMove, withLoading, toast]);

  const toggleSelection = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items.map(item => item.id));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  return {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    handleDelete,
    handleUpdate,
    handleMove
  };
}