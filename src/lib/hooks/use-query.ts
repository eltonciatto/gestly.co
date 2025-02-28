import { useQuery as useReactQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { AppError } from '@/lib/error';

interface UseQueryOptions<TData> {
  queryKey: string[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
}

/**
 * Hook personalizado para queries com tratamento de erro integrado
 */
export function useQuery<TData>({
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
}: UseQueryOptions<TData>) {
  const { toast } = useToast();

  return useReactQuery({
    queryKey,
    queryFn: async () => {
      try {
        const data = await queryFn();
        onSuccess?.(data);
        return data;
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
          description: errorMessage || err.message || 'Ocorreu um erro ao carregar os dados.',
          variant: 'destructive'
        });
        
        throw err;
      }
    },
    enabled,
    staleTime,
    cacheTime,
    retry,
    retryDelay: typeof retry === 'number' ? retryDelay : undefined
  });
}