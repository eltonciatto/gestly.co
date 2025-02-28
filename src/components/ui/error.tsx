import { AlertTriangle, RefreshCcw, ArrowLeft, type LucideIcon } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  code?: string;
  icon?: LucideIcon;
  onRetry?: () => void;
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
}

/**
 * Componente para exibição de erros
 */
export function ErrorScreen({ 
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado',
  code,
  icon: Icon = AlertTriangle,
  onRetry,
  showBackButton = true,
  backTo = '/',
  className
}: ErrorScreenProps) {
  return (
    <div className={`min-h-[400px] flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="text-center space-y-4 max-w-md">
        <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
          <Icon className="h-8 w-8 text-destructive" />
        </div>
        
        <h2 className="text-xl font-semibold">{title}</h2>
        
        <p className="text-muted-foreground text-sm">
          {message}
          {code && (
            <span className="block mt-1 text-xs font-mono">
              Código: {code}
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
          {onRetry && (
            <Button 
              onClick={onRetry}
              variant="outline"
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Tentar Novamente
            </Button>
          )}

          {showBackButton && (
            <Button 
              variant="outline"
              asChild
              className="gap-2"
            >
              <Link to={backTo}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}