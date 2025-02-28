import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  type: z.enum(['email', 'sms', 'whatsapp']),
  trigger: z.enum([
    'appointment_confirmation',
    'appointment_reminder',
    'appointment_cancelled',
    'birthday',
    'custom'
  ]),
  subject: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  variables: z.array(z.string()).optional()
});

type FormData = z.infer<typeof schema>;

interface NotificationFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export function NotificationForm({ onSubmit, initialData }: NotificationFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  const type = watch('type');
  const trigger = watch('trigger');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de Notificação</Label>
        <Select
          value={type}
          onValueChange={(value) => register('type').onChange({ target: { value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Gatilho</Label>
        <Select
          value={trigger}
          onValueChange={(value) => register('trigger').onChange({ target: { value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o gatilho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="appointment_confirmation">Confirmação de Agendamento</SelectItem>
            <SelectItem value="appointment_reminder">Lembrete de Agendamento</SelectItem>
            <SelectItem value="appointment_cancelled">Agendamento Cancelado</SelectItem>
            <SelectItem value="birthday">Aniversário</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === 'email' && (
        <div className="space-y-2">
          <Label>Assunto</Label>
          <Input {...register('subject')} placeholder="Assunto do email" />
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Conteúdo</Label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...register('content')}
          placeholder="Digite o conteúdo da mensagem..."
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Variáveis disponíveis: {'{nome}'}, {'{data}'}, {'{horario}'}, {'{servico}'}
        </p>
      </div>

      <Button type="submit" className="w-full">
        Salvar Template
      </Button>
    </form>
  );
}