import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users2, Plus, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { AddMemberDialog } from '@/components/team/AddMemberDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api/client';

export default function TeamSettings() {
  const [showAddMember, setShowAddMember] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team-members', business?.id],
    queryFn: async () => {
      const { data } = await apiClient.team.list();
      return data;
    },
    enabled: !!business?.id
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.team.update(id, { role: 'inactive' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover membro',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const resendInvite = useMutation({
    mutationFn: async (email: string) => {
      await apiClient.team.resendInvite(email);
    },
    onSuccess: () => {
      toast({
        title: 'Convite reenviado',
        description: 'O convite foi reenviado com sucesso.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao reenviar convite',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe
          </p>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-x-3 p-6 border-b">
          <Users2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">Membros da Equipe</h3>
            <p className="text-sm text-muted-foreground">
              Visualize e gerencie os membros da sua equipe
            </p>
          </div>
        </div>

        <div className="p-6">
          {members.length === 0 ? (
            <div className="text-center py-6">
              <Users2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Nenhum membro encontrado
              </h3>
              <p className="text-muted-foreground">
                Adicione membros à sua equipe
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{member.full_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                    {member.role === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resendInvite.mutate(member.email)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Reenviar Convite
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember.mutate(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddMemberDialog
        open={showAddMember}
        onOpenChange={setShowAddMember}
      />
    </div>
  );
}