import { useInfiniteQuery as useReactInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { AppError } from '@/lib/error';

interface UseInfiniteQueryOptions<TData> {
  queryKey: string[];
  queryFn: (pageParam: number) => Promise<{
    data: TData[];
    nextPage: number | null;
  }>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
  onSuccess?: (data: TData[]) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
}

/**
 * Hook personalizado para queries infinitas com tratamento de erro integrado
 */
export function useInfiniteQuery<TData>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 0,
  cacheTime = 5 * 60 * 1000, // 5 minutes
  retry = 3,
  retryDelay = 1000,
  onSuccess,
  onError,
  errorMessage
}: UseInfiniteQueryOptions<TData>) {
  const { toast } = useToast();

  return useReactInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await queryFn(pageParam);
        onSuccess?.(result.data);
        return result;
      } catch (error) {
        // Handle AppError
        if (error instanceof AppError) {
          toast({
            title: 'Erro',
            description: error.message,
            variant: 'destructive'
          });
          throw error;
        }

        // Handle other errors
        const err = error as Error;
        onError?.(err);
        
        toast({
          title: 'Erro',
          description: errorMessage || err.message || 'Ocorreu um erro ao carregar mais dados.',
          variant: 'destructive'
        });
        
        throw err;
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
    staleTime,
    cacheTime,
    retry,
    retryDelay: typeof retry === 'number' ? retryDelay : undefined
  });
}