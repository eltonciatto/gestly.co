import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from './use-toast';

interface UseInfiniteScrollOptions<T> {
  fetchMore: () => Promise<T[]>;
  hasMore: boolean;
  threshold?: number;
}

export function useInfiniteScroll<T>({
  fetchMore,
  hasMore,
  threshold = 100
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      rootMargin: `${threshold}px`
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore, threshold]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);
      const newItems = await fetchMore();
      setItems(prev => [...prev, ...newItems]);
    } catch (error) {
      setError(error as Error);
      toast({
        title: 'Erro ao carregar mais itens',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, fetchMore, toast]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return {
    items,
    isLoading,
    error,
    lastElementRef,
    loadMore
  };
}