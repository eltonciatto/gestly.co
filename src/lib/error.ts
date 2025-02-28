export const ERROR_CODES = {
  UNAUTHORIZED: 'unauthorized',
  NOT_FOUND: 'not_found',
  VALIDATION: 'validation',
  NETWORK: 'network',
  RATE_LIMIT: 'rate_limit',
  SUBSCRIPTION_REQUIRED: 'subscription_required',
  UNKNOWN: 'unknown'
} as const;

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }

  static unauthorized(message = 'Acesso não autorizado') {
    return new AppError(message, ERROR_CODES.UNAUTHORIZED);
  }

  static notFound(message = 'Recurso não encontrado') {
    return new AppError(message, ERROR_CODES.NOT_FOUND);
  }

  static validation(message = 'Dados inválidos', details?: any) {
    return new AppError(message, ERROR_CODES.VALIDATION, details);
  }

  static network(message = 'Erro de conexão') {
    return new AppError(message, ERROR_CODES.NETWORK);
  }

  static rateLimit(message = 'Muitas tentativas. Aguarde um momento.') {
    return new AppError(message, ERROR_CODES.RATE_LIMIT);
  }

  static subscriptionRequired(message = 'Assinatura necessária') {
    return new AppError(message, ERROR_CODES.SUBSCRIPTION_REQUIRED);
  }

  static formatErrorMessage(error: unknown): string {
    if (error instanceof AppError) {
      return error.message;
    }

    if (error instanceof Error) {
      // Handle specific error types
      if (error.name === 'AuthError') {
        if (error.message.includes('Email not confirmed')) {
          return 'Por favor, confirme seu email antes de fazer login.';
        }
        if (error.message.includes('Invalid login credentials')) {
          return 'Email ou senha inválidos.';
        }
        if (error.message.includes('Email rate limit exceeded')) {
          return 'Muitas tentativas. Tente novamente em alguns minutos.';
        }
        if (error.message.includes('User already registered')) {
          return 'Este email já está cadastrado.';
        }
        return 'Erro de autenticação. Por favor, tente novamente.';
      }
      if (error.name === 'NetworkError') {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      if (error.name === 'PostgrestError') {
        return 'Erro ao acessar o banco de dados. Tente novamente.';
      }
      return error.message;
    }

    return 'Ocorreu um erro inesperado';
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof Error && 
           (error.message.includes('network') || 
            error.message.includes('connection') ||
            error.message.includes('offline'));
  }
}

export function handleApiError(error: unknown): never {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Handle network errors
    if (error.message.includes('Failed to fetch')) {
      throw new AppError('Erro de conexão. Verifique sua internet.', 'network_error');
    }

    // Handle auth errors
    if (error.message.includes('Unauthorized')) {
      throw new AppError('Sessão expirada. Faça login novamente.', 'auth_error');
    }

    // Handle validation errors
    if (error.message.includes('validation failed')) {
      throw new AppError('Dados inválidos', 'validation_error');
    }

    // Handle not found errors
    if (error.message.includes('not found')) {
      throw new AppError('Recurso não encontrado', 'not_found');
    }

    // Handle permission errors
    if (error.message.includes('permission denied')) {
      throw new AppError('Sem permissão para acessar este recurso', 'unauthorized');
    }

    // Handle rate limit errors
    if (error.message.includes('rate limit exceeded')) {
      throw new AppError('Muitas requisições. Tente novamente em alguns minutos.', 'rate_limit');
    }

    throw new AppError(error.message, 'unknown_error');
  }

  throw new AppError('Ocorreu um erro inesperado', 'unknown_error');
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  return AppError.formatErrorMessage(error);
}