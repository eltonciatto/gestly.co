import { useState, useCallback } from 'react';

interface UseSortOptions<T> {
  initialField?: keyof T;
  initialDirection?: 'asc' | 'desc';
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
}

export function useSort<T>({
  initialField,
  initialDirection = 'asc',
  onSort
}: UseSortOptions<T> = {}) {
  const [sortField, setSortField] = useState<keyof T | undefined>(initialField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection);

  const handleSort = useCallback((field: keyof T) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  }, [sortField, sortDirection, onSort]);

  const getSortedData = useCallback((data: T[]) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    getSortedData
  };
}