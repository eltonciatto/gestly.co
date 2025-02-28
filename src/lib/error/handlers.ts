import { AppError } from './index';
import { useToast } from '@/components/ui/use-toast';

export function useErrorHandler() {
  const { toast } = useToast();

  return {
    handleError: (error: unknown) => {
      console.error('Error:', error);

      if (error instanceof AppError) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message
        });
        return;
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred'
      });
    }
  };
}