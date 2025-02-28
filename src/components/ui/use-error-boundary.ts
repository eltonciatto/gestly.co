import { useCallback, useState } from 'react';
import { AppError } from '@/lib/error';

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export function useErrorBoundary() {
  const [state, setState] = useState<ErrorBoundaryState>({
    error: null,
    errorInfo: null
  });

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setState({ error, errorInfo });

    // Log error if in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', {
        error,
        errorInfo
      });
    }

    // Report error in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      reportError(error, errorInfo);
    }
  }, []);

  const resetError = useCallback(() => {
    setState({ error: null, errorInfo: null });
  }, []);

  const getErrorMessage = useCallback((error: Error | null) => {
    if (!error) return '';

    if (error instanceof AppError) {
      return error.message;
    }

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
      return 'Erro de autenticação. Por favor, tente novamente.';
    }

    return error.message || 'Ocorreu um erro inesperado';
  }, []);

  return {
    error: state.error,
    errorInfo: state.errorInfo,
    handleError,
    resetError,
    getErrorMessage
  };
}

async function reportError(error: Error, errorInfo: React.ErrorInfo) {
  try {
    await fetch('/api/error-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    });
  } catch (e) {
    // Fail silently in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to report error:', e);
    }
  }
}