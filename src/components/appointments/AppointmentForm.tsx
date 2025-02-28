import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { format, addMinutes } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';

const schema = z.object({
  customer_id: z.string().uuid('Cliente inválido'),
  service_id: z.string().uuid('Serviço inválido'),
  attendant_id: z.string().uuid('Profissional inválido').optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AppointmentFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function AppointmentForm({ initialData, onSubmit, isLoading }: AppointmentFormProps) {
  const supabase = useSupabaseClient();
  const { data: business } = useBusinessQuery();
  const { toast } = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');
  const selectedService = watch('service_id');

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .eq('business_id', business.id)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!business?.id
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from('services')
        .select('id, name, duration, price')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!business?.id
  });

  const { data: attendants = [] } = useQuery({
    queryKey: ['attendants', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'attendant')
        .order('full_name');
      if (error) throw error;
      return data;
    },
    enabled: !!business?.id
  });

  const { data: availableSlots = [] } = useQuery({
    queryKey: ['availability', selectedDate, selectedService],
    queryFn: async () => {
      if (!business?.id || !selectedDate || !selectedService) return [];
      
      const { data, error } = await supabase.rpc(
        'get_horarios_disponiveis',
        {
          business_id: business.id,
          service_id: selectedService,
          data_consulta: selectedDate
        }
      );

      if (error) throw error;
      return data.filter(slot => slot.disponivel).map(slot => ({
        time: format(new Date(slot.horario), 'HH:mm'),
        available: slot.disponivel
      }));
    },
    enabled: !!business?.id && !!selectedDate && !!selectedService
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer_id">Cliente</Label>
          <select
            id="customer_id"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('customer_id')}
          >
            <option value="">Selecione um cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="text-sm text-destructive">
              {errors.customer_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="service_id">Serviço</Label>
          <select
            id="service_id"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('service_id')}
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.duration}min - R$ {service.price.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.service_id && (
            <p className="text-sm text-destructive">
              {errors.service_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            min={format(new Date(), 'yyyy-MM-dd')}
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
              <option key={slot.time} value={slot.time}>
                {slot.time}
              </option>
            ))}
          </select>
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="attendant_id">Profissional</Label>
          <select
            id="attendant_id"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('attendant_id')}
          >
            <option value="">Selecione um profissional</option>
            {attendants.map((attendant) => (
              <option key={attendant.id} value={attendant.id}>
                {attendant.full_name}
              </option>
            ))}
          </select>
          {errors.attendant_id && (
            <p className="text-sm text-destructive">
              {errors.attendant_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Observações</Label>
          <Input
            id="notes"
            placeholder="Observações sobre o agendamento"
            {...register('notes')}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Agendamento'}
      </Button>
    </form>
  );
}