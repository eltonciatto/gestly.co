import { useQuery } from '@tanstack/react-query';
import { query } from '@/lib/db';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Calendar, Star, Users2 } from 'lucide-react';
import { useBusinessQuery } from '@/lib/queries';
import { getAuditLogs } from '@/lib/db/audit';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Activity {
  id: string;
  type: 'appointment' | 'review' | 'customer';
  title: string;
  description: string;
  created_at: string;
}

export function ActivityFeed() {
  const { data: business } = useBusinessQuery();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['recent-activities', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      // Get recent audit logs
      const logs = await getAuditLogs(business.id, {
        limit: 10
      });
      const sql = `
        SELECT * FROM audit_logs
        WHERE business_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `;
      return query(sql, [business.id]);
    },
    enabled: !!business?.id,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'customer':
        return <Users2 className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'appointment':
        return 'text-blue-500 bg-blue-100';
      case 'review':
        return 'text-yellow-500 bg-yellow-100';
      case 'customer':
        return 'text-green-500 bg-green-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-x-3 p-6 border-b">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div>
          <h3 className="font-semibold">Atividades Recentes</h3>
          <p className="text-sm text-muted-foreground">
            Últimas atualizações do seu negócio
          </p>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma atividade recente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-x-3 text-sm"
              >
                <div className={`p-2 rounded-full ${getIconColor(activity.type)}`}>
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(activity.created_at), "d 'de' MMMM 'às' HH:mm", {
                      locale: ptBR
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}