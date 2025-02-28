import { render, screen } from '../utils';
import { Loading, LoadingScreen, LoadingSpinner } from '@/components/ui/loading';
import { Mail } from 'lucide-react';

describe('Loading components', () => {
  describe('Loading', () => {
    test('renders with default props', () => {
      render(<Loading />);
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    test('renders with custom text', () => {
      render(<Loading text="Custom loading..." />);
      expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    });

    test('renders with custom icon', () => {
      render(<Loading icon={Mail} />);
      expect(document.querySelector('svg')).toBeInTheDocument();
    });

    test('renders full screen when specified', () => {
      render(<Loading fullScreen />);
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(document.querySelector('.min-h-screen')).toBeInTheDocument();
    });
  });

  describe('LoadingScreen', () => {
    test('renders full screen loading', () => {
      render(<LoadingScreen />);
      expect(document.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    test('renders with custom text', () => {
      render(<LoadingScreen text="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('LoadingSpinner', () => {
    test('renders with different sizes', () => {
      const { rerender } = render(<LoadingSpinner size="sm" />);
      expect(document.querySelector('.h-4')).toBeInTheDocument();

      rerender(<LoadingSpinner size="default" />);
      expect(document.querySelector('.h-6')).toBeInTheDocument();

      rerender(<LoadingSpinner size="lg" />);
      expect(document.querySelector('.h-8')).toBeInTheDocument();
    });

    test('renders with custom icon', () => {
      render(<LoadingSpinner icon={Mail} />);
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });
});