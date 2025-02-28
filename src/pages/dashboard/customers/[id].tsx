import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Calendar, Star, Tag, Gift, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data } = await apiClient.customers.get(id!);
      return data;
    },
    enabled: !!business?.id
  });

  const { data: loyalty } = useQuery({
    queryKey: ['loyalty-points', id],
    queryFn: async () => {
      const { data } = await apiClient.loyalty.getPoints(id!);
      return data;
    },
    enabled: !!business?.id && !!id
  });

  const updateCustomer = useMutation({
    mutationFn: async (data: any) => {
      await apiClient.customers.update(id!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      setIsEditing(false);
      toast({
        title: 'Cliente atualizado!',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar cliente',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const addTag = useMutation({
    mutationFn: async (tag: string) => {
      const currentTags = customer?.tags || [];
      await apiClient.customers.update(id!, {
        tags: [...currentTags, tag]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      setNewTag('');
      toast({
        title: 'Tag adicionada!',
        description: 'A tag foi adicionada com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar tag',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const removeTag = useMutation({
    mutationFn: async (tagToRemove: string) => {
      const currentTags = customer?.tags || [];
      await apiClient.customers.update(id!, {
        tags: currentTags.filter(tag => tag !== tagToRemove)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      toast({
        title: 'Tag removida!',
        description: 'A tag foi removida com sucesso.',
      });
    },
  });

  if (isLoading || !customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Carregando dados do cliente...</p>
      </div>
    );
  }

  const appointments = customer.appointments || [];
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const averageRating = completedAppointments.reduce((acc, curr) => {
    return curr.avaliacoes?.[0]?.nota ? acc + curr.avaliacoes[0].nota : acc;
  }, 0) / completedAppointments.length || 0;

  const totalSpent = completedAppointments.reduce((acc, curr) => {
    return acc + (curr.services?.price || 0);
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/customers')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{customer.name}</h2>
            <p className="text-muted-foreground">
              Cliente desde {format(parseISO(customer.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            <Pencil className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Informações de Contato</h3>
            {isEditing ? (
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    defaultValue={customer.name}
                    onChange={(e) => updateCustomer.mutate({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    defaultValue={customer.email || ''}
                    onChange={(e) => updateCustomer.mutate({ email: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    defaultValue={customer.phone}
                    onChange={(e) => updateCustomer.mutate({ phone: e.target.value })}
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Email:</span>{' '}
                  {customer.email || 'Não informado'}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Telefone:</span>{' '}
                  {customer.phone}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Tags</h3>
              <div className="flex items-center gap-x-2">
                <Input
                  placeholder="Nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-32"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTag) {
                      e.preventDefault();
                      addTag.mutate(newTag);
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => newTag && addTag.mutate(newTag)}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {customer.tags?.map((tag: string) => (
                <div
                  key={tag}
                  className="flex items-center gap-x-1 bg-primary/10 text-primary rounded-full px-2 py-1 text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag.mutate(tag)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-x-3 mb-4">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Programa de Fidelidade</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Pontos Disponíveis</p>
                  <p className="text-2xl font-bold">{loyalty?.pontos_disponiveis || 0}</p>
                </div>
                <Button variant="outline">Ver Recompensas</Button>
              </div>
              {loyalty?.proxima_recompensa && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Próxima Recompensa</p>
                  <p className="text-sm text-muted-foreground">
                    {loyalty.proxima_recompensa.nome} - Faltam {loyalty.proxima_recompensa.pontos_faltantes} pontos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Gasto</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalSpent)}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Agendamentos</p>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
              <div className="flex items-center gap-x-1">
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card">
            <div className="flex items-center gap-x-3 p-6 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Histórico de Agendamentos</h3>
                <p className="text-sm text-muted-foreground">
                  Últimos agendamentos do cliente
                </p>
              </div>
            </div>
            <div className="p-6">
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Nenhum agendamento encontrado
                </p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{appointment.services?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(appointment.start_time), "d 'de' MMMM 'às' HH:mm", {
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(appointment.services?.price || 0)}
                        </p>
                        {appointment.avaliacoes?.[0] && (
                          <div className="flex items-center gap-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>{appointment.avaliacoes[0].nota}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}