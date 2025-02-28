import { Bot, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IntegrationStatus } from './IntegrationStatus';

const PLATFORMS = {
  typebot: 'Typebot',
  manychat: 'ManyChat',
  sendbot: 'SendBot',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
};

interface IntegrationCardProps {
  id: string;
  name: string;
  platform: keyof typeof PLATFORMS;
  is_active: boolean;
  onDelete: () => void;
  onConfigure: () => void;
}

export function IntegrationCard({
  name,
  platform,
  is_active,
  onDelete,
  onConfigure,
}: IntegrationCardProps) {
  return (
    <div className="flex items-center justify-between p-6 rounded-lg border bg-card">
      <div className="flex items-center gap-x-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{PLATFORMS[platform]}</p>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <div
          className={cn(
            'px-2 py-1 text-xs rounded-full',
            is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          )}
        >
          {is_active ? 'Ativo' : 'Inativo'}
        </div>
        <IntegrationStatus integrationId={id} />
        <Button variant="ghost" size="icon" onClick={onConfigure}>
          <span className="sr-only">Configurar</span>
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <span className="sr-only">Excluir</span>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}