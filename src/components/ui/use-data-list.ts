import { useState, useCallback } from 'react';
import { useQuery } from './use-query';
import { useMutation } from './use-mutation';
import { useList } from './use-list';
import { useConfirm } from './use-confirm';
import { useFormDialog } from './use-form-dialog';

interface UseDataListOptions<T> {
  resource: string;
  queryFn: {
    list: () => Promise<T[]>;
    create: (data: Partial<T>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
    move?: (id: string, direction: 'up' | 'down') => Promise<void>;
  };
}

export function useDataList<T extends { id: string }>({
  resource,
  queryFn
}: UseDataListOptions<T>) {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  // Query data
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: [resource],
    queryFn: queryFn.list
  });

  // List operations
  const {
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,
    handleDelete: handleListDelete,
    handleUpdate: handleListUpdate,
    handleMove
  } = useList<T>({
    onDelete: queryFn.delete,
    onUpdate: (item) => queryFn.update(item.id, item),
    onMove: queryFn.move
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: queryFn.create,
    invalidateQueries: [resource],
    successMessage: 'Item criado com sucesso',
    errorMessage: 'Erro ao criar item'
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => 
      queryFn.update(id, data),
    invalidateQueries: [resource],
    successMessage: 'Item atualizado com sucesso',
    errorMessage: 'Erro ao atualizar item'
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: queryFn.delete,
    invalidateQueries: [resource],
    successMessage: 'Item removido com sucesso',
    errorMessage: 'Erro ao remover item'
  });

  // Confirm dialog
  const confirmDelete = useConfirm({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir este item?',
    variant: 'destructive',
    onConfirm: async () => {
      if (selectedItem) {
        await handleListDelete(selectedItem);
        setSelectedItem(null);
      }
    }
  });

  // Form dialog
  const formDialog = useFormDialog<Partial<T>>({
    onSubmit: async (data) => {
      if (selectedItem) {
        await handleListUpdate({ ...selectedItem, ...data });
      } else {
        await createMutation.mutate(data);
      }
      setSelectedItem(null);
    }
  });

  // Handle actions
  const handleCreate = useCallback(() => {
    setSelectedItem(null);
    formDialog.setIsOpen(true);
  }, [formDialog]);

  const handleEdit = useCallback((item: T) => {
    setSelectedItem(item);
    formDialog.setIsOpen(true);
  }, [formDialog]);

  const handleDelete = useCallback((item: T) => {
    setSelectedItem(item);
    confirmDelete.confirm();
  }, [confirmDelete]);

  return {
    // Data
    data,
    isLoading,
    refetch,
    selectedItem,

    // Selection
    selectedItems,
    toggleSelection,
    selectAll,
    clearSelection,

    // Mutations
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,

    // Actions
    handleCreate,
    handleEdit,
    handleDelete,
    handleMove,

    // Dialogs
    formDialog,
    confirmDelete
  };
}