import { useState } from 'react';
import { Gift, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RewardCardProps {
  reward: {
    id: string;
    nome: string;
    descricao?: string;
    pontos_necessarios: number;
    quantidade_disponivel?: number;
  };
  onUpdate: (values: Partial<RewardCardProps['reward']>) => void;
  onDelete: () => void;
}

export function RewardCard({ reward, onUpdate, onDelete }: RewardCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg border bg-card">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={reward.nome}
              onChange={(e) => onUpdate({ nome: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              value={reward.descricao || ''}
              onChange={(e) => onUpdate({ descricao: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Pontos Necessários</Label>
            <Input
              type="number"
              min={0}
              value={reward.pontos_necessarios}
              onChange={(e) => onUpdate({ 
                pontos_necessarios: parseInt(e.target.value) 
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>Quantidade Disponível</Label>
            <Input
              type="number"
              min={0}
              value={reward.quantidade_disponivel || ''}
              onChange={(e) => onUpdate({ 
                quantidade_disponivel: parseInt(e.target.value) 
              })}
            />
            <p className="text-xs text-muted-foreground">
              Deixe em branco para quantidade ilimitada
            </p>
          </div>

          <div className="flex justify-end gap-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Gift className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm('Tem certeza que deseja remover esta recompensa?')) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <h4 className="font-medium">{reward.nome}</h4>
      {reward.descricao && (
        <p className="text-sm text-muted-foreground mt-1">
          {reward.descricao}
        </p>
      )}

      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Pontos necessários</span>
          <span className="font-medium">{reward.pontos_necessarios}</span>
        </div>
        {reward.quantidade_disponivel !== undefined && (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Disponível</span>
            <span className="font-medium">
              {reward.quantidade_disponivel === 0 ? 'Esgotado' : reward.quantidade_disponivel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}