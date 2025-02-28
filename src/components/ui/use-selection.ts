import { useState, useCallback } from 'react';

interface UseSelectionOptions<T> {
  items: T[];
  idField?: keyof T;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function useSelection<T>({
  items,
  idField = 'id' as keyof T,
  onSelectionChange
}: UseSelectionOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id];
      
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  }, [onSelectionChange]);

  const selectAll = useCallback(() => {
    const allIds = items.map(item => String(item[idField]));
    setSelectedIds(allIds);
    onSelectionChange?.(allIds);
  }, [items, idField, onSelectionChange]);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  const isAllSelected = useCallback(() => {
    return items.length > 0 && selectedIds.length === items.length;
  }, [items.length, selectedIds.length]);

  const isSomeSelected = useCallback(() => {
    return selectedIds.length > 0 && selectedIds.length < items.length;
  }, [items.length, selectedIds.length]);

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
    isAllSelected,
    isSomeSelected
  };
}