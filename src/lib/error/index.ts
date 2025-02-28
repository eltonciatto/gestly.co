/**
 * Códigos de erro da aplicação
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 'unauthorized',
  NOT_FOUND: 'not_found',
  VALIDATION: 'validation',
  NETWORK: 'network',
  RATE_LIMIT: 'rate_limit',
  SUBSCRIPTION_REQUIRED: 'subscription_required',
  DATABASE: 'database_error',
  EMAIL: 'email_error',
  INTEGRATION: 'integration_error',
  UNKNOWN: 'unknown'
} as const;

/**
 * Classe base para erros da aplicação
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = ERROR_CODES.UNKNOWN,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }

  static unauthorized(message = 'Acesso não autorizado') {
    return new AppError(message, ERROR_CODES.UNAUTHORIZED, 401);
  }

  static notFound(message = 'Recurso não encontrado') {
    return new AppError(message, ERROR_CODES.NOT_FOUND, 404);
  }

  static validation(message = 'Dados inválidos', details?: any) {
    return new AppError(message, ERROR_CODES.VALIDATION, 400, details);
  }

  static network(message = 'Erro de conexão') {
    return new AppError(message, ERROR_CODES.NETWORK, 503);
  }

  static rateLimit(message = 'Muitas tentativas. Aguarde um momento.') {
    return new AppError(message, ERROR_CODES.RATE_LIMIT, 429);
  }

  static database(message = 'Erro no banco de dados') {
    return new AppError(message, ERROR_CODES.DATABASE, 500);
  }

  static email(message = 'Erro ao enviar email') {
    return new AppError(message, ERROR_CODES.EMAIL, 500);
  }

  static integration(message = 'Erro na integração') {
    return new AppError(message, ERROR_CODES.INTEGRATION, 500);
  }
}

/**
 * Verifica se um erro é do tipo AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Obtém a mensagem de erro formatada
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado';
}

/**
 * Trata erros da API
 */
export function handleApiError(error: unknown): never {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Handle network errors
    if (error.message.includes('Failed to fetch')) {
      throw new AppError('Erro de conexão. Verifique sua internet.', ERROR_CODES.NETWORK);
    }

    // Handle auth errors
    if (error.message.includes('Unauthorized')) {
      throw new AppError('Sessão expirada. Faça login novamente.', ERROR_CODES.UNAUTHORIZED);
    }

    // Handle validation errors
    if (error.message.includes('validation failed')) {
      throw new AppError('Dados inválidos', ERROR_CODES.VALIDATION);
    }

    // Handle not found errors
    if (error.message.includes('not found')) {
      throw new AppError('Recurso não encontrado', ERROR_CODES.NOT_FOUND);
    }

    // Handle permission errors
    if (error.message.includes('permission denied')) {
      throw new AppError('Sem permissão para acessar este recurso', ERROR_CODES.UNAUTHORIZED);
    }

    // Handle rate limit errors
    if (error.message.includes('rate limit exceeded')) {
      throw new AppError('Muitas requisições. Tente novamente em alguns minutos.', ERROR_CODES.RATE_LIMIT);
    }

    throw new AppError(error.message);
  }

  throw new AppError('Ocorreu um erro inesperado');
}