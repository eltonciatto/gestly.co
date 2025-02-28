import { AppError, ERROR_CODES } from '../error';

/**
 * Trata erros da API e converte para AppError
 */
export function handleApiError(error: unknown): never {
  console.error('API Error:', error);

  // Erros de rede
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      throw new AppError(
        'Erro de conexão. Verifique sua internet.',
        ERROR_CODES.NETWORK,
        503
      );
    }
  }

  // Erros da API
  if (error instanceof Response) {
    switch (error.status) {
      case 401:
        throw new AppError(
          'Sessão expirada. Faça login novamente.',
          ERROR_CODES.UNAUTHORIZED,
          401
        );
      case 403:
        throw new AppError(
          'Sem permissão para acessar este recurso.',
          ERROR_CODES.UNAUTHORIZED,
          403
        );
      case 404:
        throw new AppError(
          'Recurso não encontrado.',
          ERROR_CODES.NOT_FOUND,
          404
        );
      case 422:
        throw new AppError(
          'Dados inválidos.',
          ERROR_CODES.VALIDATION,
          422
        );
      case 429:
        throw new AppError(
          'Muitas requisições. Tente novamente em alguns minutos.',
          ERROR_CODES.RATE_LIMIT,
          429
        );
      default:
        throw new AppError(
          'Erro interno do servidor.',
          ERROR_CODES.UNKNOWN,
          500
        );
    }
  }

  // Erro genérico
  throw new AppError(
    'Ocorreu um erro inesperado.',
    ERROR_CODES.UNKNOWN,
    500
  );
}