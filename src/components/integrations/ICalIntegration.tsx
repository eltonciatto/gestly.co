import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Copy } from 'lucide-react';

export function ICalIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleCopyUrl = async () => {
    try {
      const { data } = await apiClient.integrations.getICalUrl();
      const url = data.url;
      await navigator.clipboard.writeText(url);

      toast({
        title: 'URL copiada!',
        description: 'A URL do calendário foi copiada para sua área de transferência.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao copiar URL',
        description: 'Não foi possível copiar a URL do calendário.'
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-x-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Calendário iCal</h3>
          <p className="text-sm text-muted-foreground">
            Sincronize com outros aplicativos
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use a URL abaixo para sincronizar seus agendamentos com qualquer aplicativo que suporte iCal:
        </p>

        <div className="flex gap-2">
          <Input
            value="https://app.gestly.com.br/api/calendar/ical/[sua-chave]"
            readOnly
          />
          <Button variant="outline" onClick={handleCopyUrl}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Aplicativos Compatíveis</Label>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Apple Calendar</li>
            <li>• Microsoft Outlook</li>
            <li>• Mozilla Thunderbird</li>
            <li>• E outros que suportem iCal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}