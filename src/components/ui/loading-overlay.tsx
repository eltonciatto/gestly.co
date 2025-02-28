import { LoadingSpinner } from './loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  message?: string;
  transparent?: boolean;
  className?: string;
}

export function LoadingOverlay({ 
  message = 'Carregando...', 
  transparent = false,
  className 
}: LoadingOverlayProps) {
  return (
    <div className={`fixed inset-0 ${
      transparent ? 'bg-transparent' : 'bg-background/80'
    } backdrop-blur-sm z-50 flex items-center justify-center ${cn(className)}`}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}