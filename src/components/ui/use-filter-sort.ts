import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './use-debounce';

interface UseFilterSortOptions<T> {
  defaultSort?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  };
  defaultFilters?: Partial<Record<keyof T, any>>;
  persistInUrl?: boolean;
}

export function useFilterSort<T extends object>({
  defaultSort,
  defaultFilters = {},
  persistInUrl = false
}: UseFilterSortOptions<T> = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>(
    persistInUrl ? getFiltersFromUrl() : defaultFilters
  );
  const [sortField, setSortField] = useState<keyof T | undefined>(
    persistInUrl ? (searchParams.get('sort') as keyof T) : defaultSort?.field
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    persistInUrl ? (searchParams.get('direction') as 'asc' | 'desc') || 'asc' : defaultSort?.direction || 'asc'
  );

  // Debounce filters to avoid too many URL updates
  const debouncedFilters = useDebounce(filters, 300);

  // Update URL when filters/sort change
  const updateUrl = useCallback(() => {
    if (!persistInUrl) return;

    const params = new URLSearchParams(searchParams);

    // Update sort params
    if (sortField) {
      params.set('sort', String(sortField));
      params.set('direction', sortDirection);
    } else {
      params.delete('sort');
      params.delete('direction');
    }

    // Update filter params
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(`filter_${key}`, String(value));
      } else {
        params.delete(`filter_${key}`);
      }
    });

    setSearchParams(params);
  }, [persistInUrl, searchParams, setSearchParams, sortField, sortDirection, debouncedFilters]);

  // Get filters from URL
  function getFiltersFromUrl(): Partial<Record<keyof T, any>> {
    const filters: Partial<Record<keyof T, any>> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '') as keyof T;
        filters[filterKey] = value;
      }
    });
    return filters;
  }

  const handleSort = useCallback((field: keyof T) => {
    setSortField(field);
    setSortDirection(prev => 
      field === sortField && prev === 'asc' ? 'desc' : 'asc'
    );
  }, [sortField]);

  const handleFilter = useCallback((field: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    if (persistInUrl) {
      const params = new URLSearchParams(searchParams);
      [...params.keys()].forEach(key => {
        if (key.startsWith('filter_')) {
          params.delete(key);
        }
      });
      setSearchParams(params);
    }
  }, [persistInUrl, searchParams, setSearchParams]);

  // Update URL when filters/sort change
  React.useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  return {
    filters,
    sortField,
    sortDirection,
    handleSort,
    handleFilter,
    clearFilters
  };
}