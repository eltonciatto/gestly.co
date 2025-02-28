import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { query, queryOne } from '@/lib/db';
import { Users2, Plus, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessQuery } from '@/lib/queries';
import { getTeamMembers, removeTeamMember, resendInvite } from '@/lib/db/team';
import { AddMemberDialog } from './AddMemberDialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function TeamList() {
  const [showAddMember, setShowAddMember] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: business } = useBusinessQuery();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team-members', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const sql = `
        SELECT id, full_name, email, role, created_at
        FROM profiles
        WHERE role = 'attendant'
        ORDER BY full_name
      `;
      
      return query(sql);
    },
    enabled: !!business?.id
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      await query(
        'UPDATE profiles SET role = $1 WHERE id = $2',
        ['inactive', id]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: 'Profissional removido!',
        description: 'O profissional foi removido da sua equipe.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover profissional',
        description: 'Tente novamente mais tarde.',
      });
    },
  });

  const resendInvitation = useMutation({
    mutationFn: async (email: string) => {
      // Implement email resend logic using your email service
      await sendEmail({
        to: email,
        subject: 'Convite Gestly',
        html: 'Seu convite foi reenviado...'
      });
    },
    onSuccess: () => {
      toast({
        title: 'Convite reenviado!',
        description: 'Um novo email foi enviado para o profissional.',
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
      <div className="flex items-center justify-center h-[200px]">
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
            Gerencie os profissionais da sua equipe
          </p>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Profissional
        </Button>
      </div>

      <div className="grid gap-6">
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum profissional cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Adicione profissionais à sua equipe para começar
            </p>
            <Button onClick={() => setShowAddMember(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Profissional
            </Button>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center gap-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{member.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => resendInvitation.mutate(member.email)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja remover este profissional?')) {
                      removeMember.mutate(member.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddMemberDialog
        open={showAddMember}
        onOpenChange={setShowAddMember}
      />
    </div>
  );
}