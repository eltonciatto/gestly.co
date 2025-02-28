import { PostgrestError } from '@supabase/supabase-js';
import { AppError } from './error';

export function handleApiError(error: unknown): never {
  console.error('API Error:', error);

  if (error instanceof PostgrestError) {
    switch (error.code) {
      case '42P01':
        throw new AppError('Tabela não encontrada', 'table_not_found');
      case '42P17':
        throw new AppError('Erro de configuração do banco de dados', 'invalid_policy');
      case '23514':
        throw new AppError('Valor inválido para o campo', 'check_violation');
      case '40001':
        throw new AppError('Conflito de serialização. Tente novamente.', 'serialization_failure');
      case '40P01':
        throw new AppError('Deadlock detectado. Tente novamente.', 'deadlock_detected');
      case '57014':
        throw new AppError('Operação cancelada. Tente novamente.', 'query_canceled');
      case '42501':
        throw new AppError('Sem permissão para acessar este recurso', 'permission_denied');
      case '23505':
        throw new AppError('Registro duplicado', 'duplicate_record');
      case '23503':
        throw new AppError('Registro relacionado não encontrado', 'foreign_key_violation');
      default:
        throw new AppError('Erro ao acessar o banco de dados', 'database_error');
    }
  }

  if (error instanceof Error) {
    // Handle Supabase specific errors
    if (error.message.includes('infinite recursion')) {
      throw new AppError('Erro de configuração do banco de dados', 'recursion_error');
    }
    
    if (error.name === 'AbortError') {
      throw new AppError('Operação cancelada pelo usuário', 'user_abort');
    }
    
    if (error.name === 'TimeoutError') {
      throw new AppError('Tempo limite excedido. Tente novamente.', 'timeout');
    }

    if (error.message.includes('Failed to fetch')) {
      throw new AppError('Erro de conexão. Verifique sua internet.', 'network_error');
    } else if (error.message.includes('JWT')) {
      throw new AppError('Sessão expirada. Faça login novamente.', 'session_expired');
    }
  }

  throw new AppError('Erro inesperado ao processar requisição', 'unknown_error');
}