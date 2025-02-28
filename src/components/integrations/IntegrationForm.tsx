import React from 'react';
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
import { IntegrationPlatform } from '@/lib/integrations';

const PLATFORMS = [
  { id: 'typebot', name: 'Typebot' },
  { id: 'manychat', name: 'ManyChat' },
  { id: 'sendbot', name: 'SendBot' },
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'telegram', name: 'Telegram' },
];

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  platform: z.enum(['typebot', 'manychat', 'sendbot', 'whatsapp', 'telegram']),
  config: z.record(z.string()),
});

type FormData = z.infer<typeof schema>;

interface IntegrationFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function IntegrationForm({ onSubmit, isLoading }: IntegrationFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const platform = watch('platform') as IntegrationPlatform;

  const renderConfigFields = () => {
    if (!platform) return null;

    switch (platform) {
      case 'typebot':
      case 'sendbot':
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="webhook_url">Webhook URL</Label>
            <Input
              id="webhook_url"
              {...register('config.webhook_url')}
              placeholder="https://seu-typebot.com/webhook"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api_key">API Key</Label>
            <Input
              id="api_key"
              type="password"
              {...register('config.api_key')}
              placeholder="Sua chave API do Typebot"
            />
          </div>
          {platform === 'sendbot' && (
            <p className="text-sm text-muted-foreground mt-2">
              O SendBot é integrado através da plataforma Typebot. Use suas credenciais do Typebot para configurar.
            </p>
          )}
        </>
      );
      case 'manychat':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="page_id">Page ID</Label>
              <Input
                id="page_id"
                required
                {...register('config.page_id')}
                placeholder="ID da sua página"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access_token">Access Token</Label>
              <Input
                id="access_token"
                required
                type="password"
                {...register('config.access_token')}
                placeholder="Token de acesso do ManyChat"
              />
            </div>
          </>
        );
      case 'whatsapp':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Número do WhatsApp</Label>
              <Input
                id="phone_number"
                required
                {...register('config.phone_number')}
                placeholder="5511999999999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_token">Token de Acesso</Label>
              <Input
                id="api_token"
                required
                type="password"
                {...register('config.api_token')}
                placeholder="Token de acesso do WhatsApp Business API"
              />
            </div>
          </>
        );
      case 'telegram':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="bot_token">Token do Bot</Label>
              <Input
                id="bot_token"
                required
                type="password"
                {...register('config.bot_token')}
                placeholder="Token do seu bot do Telegram"
              />
            </div>
          </>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Selecione uma plataforma para continuar
          </p>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Integração</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Ex: Typebot - Agendamentos"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Plataforma</Label>
          <Select
            value={platform}
            onValueChange={(value) => register('platform').onChange({ target: { value } })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma plataforma" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.platform && (
            <p className="text-sm text-destructive">{errors.platform.message}</p>
          )}
        </div>

        {renderConfigFields()}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar Integração'}
      </Button>
    </form>
  );
}