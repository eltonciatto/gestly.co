import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Check } from 'lucide-react';

export function GoogleCalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      await apiClient.integrations.connectGoogle();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao conectar',
        description: 'Não foi possível conectar com o Google Calendar.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-x-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Google Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Sincronize seus agendamentos
          </p>
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-x-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            <span>Conectado com Google Calendar</span>
          </div>

          <div className="space-y-2">
            <Label>Calendário Principal</Label>
            <select className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
              <option>Agenda Principal</option>
              <option>Agenda de Trabalho</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Sincronização</Label>
            <div className="flex items-center gap-x-2">
              <input type="checkbox" id="twoWay" className="rounded border-gray-300" />
              <label htmlFor="twoWay" className="text-sm">
                Sincronização bidirecional
              </label>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => setIsConnected(false)}>
            Desconectar
          </Button>
        </div>
      ) : (
        <Button className="w-full" onClick={handleConnect} disabled={isLoading}>
          <Calendar className="h-4 w-4 mr-2" />
          {isLoading ? 'Conectando...' : 'Conectar com Google Calendar'}
        </Button>
      )}
    </div>
  );
}