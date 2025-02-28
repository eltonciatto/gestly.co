import { useState, useCallback } from 'react';
import { useFilterSort } from './use-filter-sort';
import { usePagination } from './use-pagination';
import { useSelection } from './use-selection';
import { useExport } from './use-export';
import { useImport } from './use-import';

interface UseDataGridOptions<T> {
  data: T[];
  pageSize?: number;
  defaultSort?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  };
  defaultFilters?: Partial<Record<keyof T, any>>;
  persistInUrl?: boolean;
  onExport?: (data: T[]) => void;
  onImport?: (data: T[]) => Promise<void>;
}

export function useDataGrid<T extends { id: string }>({
  data,
  pageSize = 10,
  defaultSort,
  defaultFilters,
  persistInUrl = false,
  onExport,
  onImport
}: UseDataGridOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort
  const {
    filters,
    sortField,
    sortDirection,
    handleSort,
    handleFilter,
    clearFilters
  } = useFilterSort<T>({
    defaultSort,
    defaultFilters,
    persistInUrl
  });

  // Apply filters and sorting
  const filteredData = useCallback(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        result = result.filter(item => {
          const itemValue = item[key as keyof T];
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue === bValue) return 0;
        const comparison = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sortField, sortDirection]);

  // Pagination
  const {
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    pageItems
  } = usePagination({
    total: filteredData().length,
    pageSize
  });

  // Selection
  const {
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
    isAllSelected,
    isSomeSelected
  } = useSelection({
    items: filteredData()
  });

  // Export
  const { exportToCsv, isExporting } = useExport<T>({
    data: selectedIds.length > 0 
      ? filteredData().filter(item => selectedIds.includes(item.id))
      : filteredData(),
    onError: (error) => {
      console.error('Export error:', error);
    }
  });

  // Import
  const { importFromCsv, isImporting } = useImport<T>({
    onImport: async (data) => {
      if (onImport) {
        setIsLoading(true);
        try {
          await onImport(data);
        } finally {
          setIsLoading(false);
        }
      }
    }
  });

  return {
    // Data
    data: filteredData().slice(pageItems.start, pageItems.end),
    totalItems: filteredData().length,

    // Loading
    isLoading: isLoading || isExporting || isImporting,

    // Filtering & Sorting
    filters,
    sortField,
    sortDirection,
    handleSort,
    handleFilter,
    clearFilters,

    // Pagination
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    goToPage,

    // Selection
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
    isAllSelected,
    isSomeSelected,

    // Export & Import
    exportData: exportToCsv,
    importData: importFromCsv
  };
}