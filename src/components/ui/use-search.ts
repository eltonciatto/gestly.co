import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface UseSearchOptions {
  initialValue?: string;
  debounceMs?: number;
  minLength?: number;
  onSearch?: (value: string) => void | Promise<void>;
}

export function useSearch({
  initialValue = '',
  debounceMs = 300,
  minLength = 3,
  onSearch
}: UseSearchOptions = {}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  useEffect(() => {
    const search = async () => {
      if (debouncedSearchTerm.length >= minLength && onSearch) {
        try {
          setIsSearching(true);
          await onSearch(debouncedSearchTerm);
        } finally {
          setIsSearching(false);
        }
      }
    };

    search();
  }, [debouncedSearchTerm, minLength, onSearch]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    clearSearch,
    isSearching,
    debouncedSearchTerm
  };
}