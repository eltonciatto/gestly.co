import { render, screen } from '../utils';
import { ErrorBoundary } from '@/components/error-boundary';
import { AppError } from '@/lib/error';

const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe('ErrorBoundary', () => {
  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders error screen when error occurs', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new AppError('Test error', 'test_error');

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    consoleError.mockRestore();
  });

  test('renders fallback when provided', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    const fallback = <div>Fallback Content</div>;

    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError error={error} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Fallback Content')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});