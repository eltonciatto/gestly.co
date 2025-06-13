import { render, screen, fireEvent, waitFor } from '../utils';
import { AppointmentList } from '@/components/appointments/AppointmentList';

describe.skip('AppointmentList', () => {
  test('renders loading state', () => {
    render(<AppointmentList />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test('renders empty state', async () => {
    render(<AppointmentList />);
    expect(await screen.findByText(/nenhum agendamento/i)).toBeInTheDocument();
  });

  test('filters appointments', async () => {
    render(<AppointmentList />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText(/nenhum agendamento/i)).toBeInTheDocument();
    });
  });

  test('handles status filter', async () => {
    render(<AppointmentList />);

    const statusButton = screen.getByText(/agendados/i);
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(statusButton).toHaveClass('bg-secondary');
    });
  });
});