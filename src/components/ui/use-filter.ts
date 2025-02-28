import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseFilterOptions<T> {
  initialFilters?: Partial<T>;
  onFilter?: (filters: Partial<T>) => void | Promise<void>;
}

export function useFilter<T extends object>({
  initialFilters = {},
  onFilter
}: UseFilterOptions<T> = {}) {
  const [filters, setFilters] = useState<Partial<T>>(initialFilters);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const applyFilter = useCallback(async (field: keyof T, value: any) => {
    try {
      setIsApplying(true);
      const newFilters = { ...filters, [field]: value };
      setFilters(newFilters);
      await onFilter?.(newFilters);
    } catch (error) {
      toast({
        title: 'Erro ao aplicar filtro',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  }, [filters, onFilter, toast]);

  const clearFilters = useCallback(async () => {
    try {
      setIsApplying(true);
      setFilters({});
      await onFilter?.({});
    } catch (error) {
      toast({
        title: 'Erro ao limpar filtros',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  }, [onFilter, toast]);

  return {
    filters,
    setFilters,
    applyFilter,
    clearFilters,
    isApplying
  };
}