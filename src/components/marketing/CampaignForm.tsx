import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users2, Calendar, Tag } from 'lucide-react';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  subject: z.string().min(3, 'Assunto é obrigatório'),
  content: z.string().min(10, 'Conteúdo muito curto'),
  sendDate: z.string().optional(),
  filter: z.object({
    lastVisit: z.number().optional(),
    minSpent: z.number().optional(),
    tags: z.array(z.string()).optional()
  }).optional()
});

type FormData = z.infer<typeof schema>;

interface CampaignFormProps {
  onSuccess?: () => void;
}

export function CampaignForm({ onSuccess }: CampaignFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const { error } = await supabase.rpc('create_email_campaign', {
        p_name: data.name,
        p_subject: data.subject,
        p_content: data.content,
        p_send_date: data.sendDate || null,
        p_filter: {
          last_visit: data.filter?.lastVisit,
          min_spent: data.filter?.minSpent,
          tags: selectedTags
        }
      });

      if (error) throw error;

      toast({
        title: 'Campanha criada!',
        description: 'A campanha foi criada com sucesso.'
      });

      onSuccess?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar campanha',
        description: 'Não foi possível criar a campanha. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Campanha</Label>
          <Input
            id="name"
            placeholder="Ex: Promoção de Aniversário"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto do Email</Label>
          <Input
            id="subject"
            placeholder="Ex: Aproveite nosso desconto especial!"
            {...register('subject')}
          />
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <textarea
            id="content"
            className="w-full min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Conteúdo do email..."
            {...register('content')}
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Variáveis disponíveis: {'{nome}'}, {'{email}'}, {'{ultimo_servico}'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sendDate">Data de Envio (opcional)</Label>
          <Input
            id="sendDate"
            type="datetime-local"
            {...register('sendDate')}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Filtros</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-x-2">
                <Calendar className="h-4 w-4" />
                Última Visita
              </Label>
              <select
                className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                {...register('filter.lastVisit')}
              >
                <option value="">Qualquer data</option>
                <option value="30">Últimos 30 dias</option>
                <option value="60">Últimos 60 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="180">Últimos 180 dias</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-x-2">
                <Users2 className="h-4 w-4" />
                Valor Mínimo Gasto
              </Label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                {...register('filter.minSpent')}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-x-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {['VIP', 'Fidelidade', 'Aniversariante'].map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Criando...' : 'Criar Campanha'}
      </Button>
    </form>
  );
}