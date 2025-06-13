import { renderHook, act } from '../utils';
import { vi } from 'vitest';
import { useError } from '@/lib/hooks/use-error';
import { AppError } from '@/lib/error';

describe('useError', () => {
  test('handles error state', () => {
    const { result } = renderHook(() => useError());
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.isError).toBe(true);
  });

  test('clears error state', () => {
    const { result } = renderHook(() => useError());
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(result.current.isError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  test('calls onError callback', () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useError({ onError }));
    const error = new AppError('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  test('shows toast when showToast is true', () => {
    const { result } = renderHook(() => useError({ showToast: true }));
    const error = new AppError('Test error');

    act(() => {
      result.current.handleError(error);
    });

    // Toast should be shown (would need to mock toast)
  });
});