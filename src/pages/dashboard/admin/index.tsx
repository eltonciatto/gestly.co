import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, Users, Building2, Activity, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createBackup, restoreBackup } from '@/lib/backup';
import { getAuditLogs, AuditAction } from '@/lib/audit';
import { apiClient } from '@/lib/api/client';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businesses = [] } = useQuery({
    queryKey: ['admin-businesses'],
    queryFn: async () => {
      const { data } = await apiClient.admin.getBusinesses();
      return data;
    },
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data } = await apiClient.admin.getAuditLogs({
        limit: 50
      });
      return data;
    },
  });

  const handleCreateBackup = async (businessId: string) => {
    try {
      setIsLoading(true);
      const metadata = await createBackup(businessId);
      
      toast({
        title: 'Backup criado com sucesso!',
        description: `Backup de ${format(new Date(metadata.timestamp), 'dd/MM/yyyy HH:mm')} (${(metadata.size / 1024 / 1024).toFixed(2)} MB)`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar backup',
        description: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async (businessId: string, timestamp: string) => {
    if (!confirm('Tem certeza? Esta ação irá substituir todos os dados atuais.')) {
      return;
    }

    try {
      setIsLoading(true);
      await restoreBackup(businessId, timestamp);
      
      toast({
        title: 'Backup restaurado com sucesso!',
        description: 'Os dados foram restaurados para o estado do backup selecionado.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao restaurar backup',
        description: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Painel Administrativo</h2>
        <p className="text-muted-foreground">
          Gerencie todos os negócios e configurações do sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total de Negócios
              </p>
              <p className="text-2xl font-bold">
                {businesses.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Usuários Ativos
              </p>
              <p className="text-2xl font-bold">
                {businesses.filter(b => 
                  b.subscription?.[0]?.status === 'active'
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Logs de Auditoria
              </p>
              <p className="text-2xl font-bold">
                {auditLogs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-x-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Backups Realizados
              </p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h3 className="font-semibold mb-4">Negócios Cadastrados</h3>
            <div className="space-y-4">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{business.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {business.owner.full_name} • {business.owner.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Plano: {business.subscription?.[0]?.plan?.name || 'Grátis'}
                    </p>
                  </div>

                  <div className="flex items-center gap-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateBackup(business.id)}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Backup
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreBackup(business.id, '')}
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h3 className="font-semibold mb-4">Logs de Auditoria</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="text-sm p-2 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      log.action === AuditAction.CREATE ? 'bg-green-100 text-green-700' :
                      log.action === AuditAction.UPDATE ? 'bg-blue-100 text-blue-700' :
                      log.action === AuditAction.DELETE ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {log.resource} {log.resource_id ? `(${log.resource_id})` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}