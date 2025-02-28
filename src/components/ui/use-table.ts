import { useState, useCallback, useMemo } from 'react';
import { useToast } from './use-toast';
import { useLoading } from './use-loading';

interface UseTableOptions<T> {
  data: T[];
  pageSize?: number;
  sortable?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  onDelete?: (row: T) => Promise<void>;
}

export function useTable<T extends { id: string }>({
  data,
  pageSize = 10,
  sortable = false,
  onRowClick,
  onSort,
  onDelete
}: UseTableOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  const { toast } = useToast();
  const { withLoading } = useLoading();

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const handleSort = useCallback((field: keyof T) => {
    if (!sortable) return;

    const newDirection = 
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  }, [sortable, sortField, sortDirection, onSort]);

  const handleRowClick = useCallback((row: T) => {
    onRowClick?.(row);
  }, [onRowClick]);

  const handleDelete = useCallback(async (row: T) => {
    if (!onDelete) return;

    try {
      await withLoading(async () => {
        await onDelete(row);
        toast({
          title: 'Item excluído',
          description: 'O item foi removido com sucesso.',
          variant: 'success'
        });
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o item.',
        variant: 'destructive'
      });
    }
  }, [onDelete, withLoading, toast]);

  const handleSelectRow = useCallback((rowId: string) => {
    setSelectedRows(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId);
      }
      return [...prev, rowId];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(row => row.id));
    }
  }, [data, selectedRows]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    sortField,
    sortDirection,
    handleSort,
    handleRowClick,
    handleDelete,
    selectedRows,
    handleSelectRow,
    handleSelectAll
  };
}