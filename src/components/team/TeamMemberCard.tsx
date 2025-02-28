import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Trash2, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMemberCardProps {
  member: {
    id: string;
    full_name: string;
    email?: string;
    commission_percentage?: number;
    created_at: string;
  };
  onResendInvite: () => void;
  onRemove: () => void;
}

export function TeamMemberCard({ member, onResendInvite, onRemove }: TeamMemberCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center gap-x-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{member.full_name}</p>
          {member.email && (
            <p className="text-sm text-muted-foreground">{member.email}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Desde {format(parseISO(member.created_at), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onResendInvite}
          title="Reenviar convite"
        >
          <Mail className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          title="Remover profissional"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}