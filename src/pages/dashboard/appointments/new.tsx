import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  customerId: z.string().uuid('Cliente inválido'),
  serviceId: z.string().uuid('Serviço inválido'),
  attendantId: z.string().uuid('Profissional inválido'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewAppointment() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const customerId = searchParams.get('customer');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: customerId || '',
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await apiClient.customers.list({
        orderBy: 'name'
      });
      return data;
    }
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await apiClient.services.list({
        orderBy: 'name'
      });
      return data;
    }
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ['attendants'],
    queryFn: async () => {
      const { data } = await apiClient.team.list({
        role: 'attendant'
      });
      return data;
    }
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedService = watch('serviceId');

  const { data: availableSlots = [] } = useQuery({
    queryKey: ['availability', selectedDate, selectedService],
    queryFn: async () => {
      if (!selectedDate || !selectedService) return [];
      
      const { data } = await apiClient.appointments.getAvailability({
        date: selectedDate,
        serviceId: selectedService
      });

      return data.slots;
    },
    enabled: !!selectedDate && !!selectedService
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const startTime = new Date(`${data.date}T${data.time}`);
      const selectedService = services.find(s => s.id === data.serviceId);
      if (!selectedService) throw new Error('Serviço não encontrado');

      const endTime = new Date(startTime.getTime() + selectedService.duration * 60000);

      await apiClient.appointments.create({
        customer_id: data.customerId,
        service_id: data.serviceId,
        attendant_id: data.attendantId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        notes: data.notes
      });

      toast({
        title: 'Agendamento criado!',
        description: 'O horário foi reservado com sucesso.',
      });

      navigate('/dashboard/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar agendamento',
        description: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/appointments')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Novo Agendamento</h2>
        <p className="text-muted-foreground">
          Agende um horário para seu cliente
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerId">Cliente</Label>
            <select
              id="customerId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('customerId')}
            >
              <option value="">Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="text-sm text-destructive">
                {errors.customerId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceId">Serviço</Label>
            <select
              id="serviceId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('serviceId')}
            >
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - {service.duration}min - R$ {service.price.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.serviceId && (
              <p className="text-sm text-destructive">
                {errors.serviceId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <select
              id="time"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('time')}
            >
              <option value="">Selecione um horário</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot.split('T')[1].slice(0, 5)}>
                  {slot.split('T')[1].slice(0, 5)}
                </option>
              ))}
            </select>
            {errors.time && (
              <p className="text-sm text-destructive">{errors.time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendantId">Profissional</Label>
            <select
              id="attendantId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('attendantId')}
            >
              <option value="">Selecione um profissional</option>
              {attendants.map((attendant) => (
                <option key={attendant.id} value={attendant.id}>
                  {attendant.full_name}
                </option>
              ))}
            </select>
            {errors.attendantId && (
              <p className="text-sm text-destructive">
                {errors.attendantId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input
              id="notes"
              placeholder="Observações sobre o agendamento"
              {...register('notes')}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Agendando...' : 'Criar Agendamento'}
        </Button>
      </form>
    </div>
  );
}