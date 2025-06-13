import { renderHook, waitFor } from '../utils';
import { useQuery } from '@/lib/hooks/use-query';
import { AppError } from '@/lib/error';

describe('useQuery', () => {
  test('handles successful query', async () => {
    const { result } = renderHook(() => useQuery({
      queryKey: ['test'],
      queryFn: async () => ({ data: 'test' })
    }));

    await waitFor(() => {
      expect(result.current.data).toEqual({ data: 'test' });
    });
  });

  test.skip('handles query error', async () => {
    const { result } = renderHook(() => useQuery({
      queryKey: ['test'],
      queryFn: async () => {
        throw new AppError('Test error');
      }
    }));

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(AppError);
    });
  });
});