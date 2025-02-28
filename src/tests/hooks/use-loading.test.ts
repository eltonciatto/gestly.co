import { renderHook, act } from '@testing-library/react';
import { useLoading } from '@/lib/hooks/use-loading';

describe('useLoading', () => {
  test('handles loading state', async () => {
    const { result } = renderHook(() => useLoading());

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.withLoading(async () => {
        expect(result.current.isLoading).toBe(true);
        return 'test';
      });
    });

    expect(result.current.isLoading).toBe(false);
  });

  test('handles success message', async () => {
    const { result } = renderHook(() => useLoading(false, {
      showToast: true,
      successMessage: 'Success!'
    }));

    await act(async () => {
      await result.current.withLoading(async () => 'test');
    });

    // Toast should be shown (would need to mock toast)
  });

  test('handles error message', async () => {
    const { result } = renderHook(() => useLoading(false, {
      showToast: true,
      errorMessage: 'Error!'
    }));

    await act(async () => {
      try {
        await result.current.withLoading(async () => {
          throw new Error('Test error');
        });
      } catch (error) {
        // Expected error
      }
    });

    // Toast should be shown (would need to mock toast)
  });
});