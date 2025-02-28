import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  icon?: LucideIcon;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Componente de loading reutilizável
 */
export function Loading({ 
  size = 'default', 
  className,
  icon: Icon = Loader2,
  text = 'Carregando...',
  fullScreen = false
}: LoadingProps) {
  const Wrapper = fullScreen ? LoadingScreen : LoadingSpinner;
  return <Wrapper size={size} className={className} icon={Icon} text={text} />;
}

/**
 * Componente de loading em tela cheia
 */
export function LoadingScreen(props: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner {...props} />
        {props.text && (
          <p className="mt-4 text-sm text-muted-foreground">{props.text}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Componente de spinner de loading
 */
export function LoadingSpinner({ 
  size = 'default', 
  className,
  icon: Icon = Loader2
}: LoadingProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        className
      )}
    >
      <Icon
        className={cn(
          'animate-spin text-primary',
          size === 'sm' && 'h-4 w-4',
          size === 'default' && 'h-6 w-6',
          size === 'lg' && 'h-8 w-8'
        )}
      />
    </div>
  );
}