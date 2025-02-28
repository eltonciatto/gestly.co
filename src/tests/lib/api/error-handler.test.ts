import { handleApiError } from '@/lib/api/error-handler';
import { AppError, ERROR_CODES } from '@/lib/error';

describe('handleApiError', () => {
  test('handles network errors', () => {
    const error = new Error('Failed to fetch');
    
    expect(() => handleApiError(error)).toThrow(AppError);
    expect(() => handleApiError(error)).toThrow(/conexão/i);
  });

  test('handles API errors', () => {
    const response = new Response(null, { status: 401 });
    
    expect(() => handleApiError(response)).toThrow(AppError);
    expect(() => handleApiError(response)).toThrow(/sessão expirada/i);
  });

  test('handles validation errors', () => {
    const response = new Response(null, { status: 422 });
    
    expect(() => handleApiError(response)).toThrow(AppError);
    expect(() => handleApiError(response)).toThrow(/dados inválidos/i);
  });

  test('handles rate limit errors', () => {
    const response = new Response(null, { status: 429 });
    
    expect(() => handleApiError(response)).toThrow(AppError);
    expect(() => handleApiError(response)).toThrow(/muitas requisições/i);
  });

  test('handles unknown errors', () => {
    const error = new Error('Unknown error');
    
    expect(() => handleApiError(error)).toThrow(AppError);
    expect(() => handleApiError(error)).toThrow(/erro inesperado/i);
  });
});