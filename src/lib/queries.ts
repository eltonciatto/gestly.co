import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api/client';
import { AppError } from './error';

export function useBusinessQuery() {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.business.get();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('permission denied')) {
            throw AppError.unauthorized('Sem permissão para acessar este recurso');
          }
          if (error.message.includes('not found')) {
            throw AppError.notFound('Negócio não encontrado');
          }
        }
        throw error;
      }
    }
  });
}