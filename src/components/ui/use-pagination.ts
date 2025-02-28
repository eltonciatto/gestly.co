import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  total: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({
  total,
  pageSize = 10,
  initialPage = 1
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    return { start, end };
  }, [currentPage, pageSize, total]);

  return {
    currentPage,
    totalPages,
    pageSize,
    nextPage,
    previousPage,
    goToPage,
    pageItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}