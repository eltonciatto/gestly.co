import { Loader2, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  icon?: LucideIcon;
}

export function LoadingSpinner({ 
  size = 'default', 
  className,
  icon: Icon = Loader2,
  ...props 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        className
      )}
      {...props}
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