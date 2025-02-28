import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook, Instagram, Check } from 'lucide-react';

export function SocialMediaIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleConnect = async (platform: 'facebook' | 'instagram') => {
    try {
      setIsLoading(true);
      await apiClient.integrations.connectSocial(platform);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao conectar',
        description: `Não foi possível conectar com ${platform === 'facebook' ? 'Facebook' : 'Instagram'}.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-x-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Facebook className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Redes Sociais</h3>
          <p className="text-sm text-muted-foreground">
            Conecte suas páginas do Facebook e Instagram
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </div>
            <Button
              variant={isConnected ? 'outline' : 'default'}
              onClick={() => handleConnect('facebook')}
              disabled={isLoading}
            >
              {isConnected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Conectado
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          </div>

          {isConnected && (
            <div className="space-y-2">
              <Label>Página do Facebook</Label>
              <select className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option>Minha Página</option>
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Instagram className="h-5 w-5" />
              <span>Instagram</span>
            </div>
            <Button
              variant={isConnected ? 'outline' : 'default'}
              onClick={() => handleConnect('instagram')}
              disabled={isLoading}
            >
              {isConnected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Conectado
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          </div>

          {isConnected && (
            <div className="space-y-2">
              <Label>Conta do Instagram</Label>
              <select className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option>@minha.conta</option>
              </select>
            </div>
          )}
        </div>

        {isConnected && (
          <div className="space-y-2">
            <Label>Configurações de Postagem</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-x-2">
                <input type="checkbox" id="autoPost" className="rounded border-gray-300" />
                <label htmlFor="autoPost" className="text-sm">
                  Postar automaticamente promoções
                </label>
              </div>
              <div className="flex items-center gap-x-2">
                <input type="checkbox" id="autoStory" className="rounded border-gray-300" />
                <label htmlFor="autoStory" className="text-sm">
                  Criar stories automáticos
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}