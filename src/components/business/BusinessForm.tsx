import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  logo_url: z.string().url().optional().or(z.literal('')),
  settings: z.object({
    allow_customer_portal: z.boolean().default(true),
    allow_team_portal: z.boolean().default(true),
    allow_affiliate_program: z.boolean().default(false),
    default_commission_percentage: z.number().min(0).max(100).default(40),
    loyalty_points_per_currency: z.number().min(0).default(1),
    loyalty_points_expiration_days: z.number().min(0).default(365),
    auto_approve_appointments: z.boolean().default(false),
    require_deposit: z.boolean().default(false),
    deposit_percentage: z.number().min(0).max(100).default(0),
    cancellation_policy_hours: z.number().min(0).default(24),
    notification_preferences: z.object({
      email: z.boolean().default(true),
      whatsapp: z.boolean().default(true),
      sms: z.boolean().default(false)
    }).default({})
  }).default({})
});

type FormData = z.infer<typeof schema>;

interface BusinessFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function BusinessForm({ initialData, onSubmit, isLoading }: BusinessFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-medium">Informações Básicas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Negócio</Label>
              <Input
                id="name"
                placeholder="Nome da sua empresa"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com.br"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Endereço completo"
                {...register('address')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">URL do Logo</Label>
              <Input
                id="logo_url"
                type="url"
                placeholder="https://exemplo.com/logo.png"
                {...register('logo_url')}
              />
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="space-y-4">
          <h3 className="font-medium">Configurações do Negócio</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Comissão Padrão (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                {...register('settings.default_commission_percentage', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Pontos por Real</Label>
              <Input
                type="number"
                min={0}
                step={0.1}
                {...register('settings.loyalty_points_per_currency', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Validade dos Pontos (dias)</Label>
              <Input
                type="number"
                min={0}
                {...register('settings.loyalty_points_expiration_days', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label>Prazo de Cancelamento (horas)</Label>
              <Input
                type="number"
                min={0}
                {...register('settings.cancellation_policy_hours', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Portais</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    {...register('settings.allow_customer_portal')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Portal do Cliente</span>
                </label>
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    {...register('settings.allow_team_portal')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Portal da Equipe</span>
                </label>
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    {...register('settings.allow_affiliate_program')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Programa de Afiliados</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Agendamentos</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    {...register('settings.auto_approve_appointments')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Aprovar automaticamente</span>
                </label>
                <label className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    {...register('settings.require_deposit')}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Exigir depósito</span>
                </label>
                {/* Show deposit percentage if require_deposit is checked */}
                {register('settings.require_deposit').value && (
                  <div className="pl-6">
                    <Label>Porcentagem do Depósito</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...register('settings.deposit_percentage', { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notificações</Label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  {...register('settings.notification_preferences.email')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  {...register('settings.notification_preferences.whatsapp')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">WhatsApp</span>
              </label>
              <label className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  {...register('settings.notification_preferences.sms')}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">SMS</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
}