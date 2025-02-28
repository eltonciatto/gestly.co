import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { query } from '@/lib/db';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ReviewList() {
  const [filter, setFilter] = useState('all');
  const { data: business } = useBusinessQuery();
  const { toast } = useToast();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', business?.id, filter],
    queryFn: async () => {
      if (!business?.id) return [];
      let sql = `
        SELECT 
          a.*,
          c.name as customer_name,
          s.name as service_name
        FROM avaliacoes a
        LEFT JOIN customers c ON a.customer_id = c.id
        LEFT JOIN appointments apt ON a.appointment_id = apt.id
        LEFT JOIN services s ON apt.service_id = s.id
        WHERE a.business_id = $1
      `;
      const params = [business.id];
      let paramCount = 1;

      if (filter === 'pending') {
        sql += ` AND a.resposta IS NULL`;
      }

      sql += ` ORDER BY a.created_at DESC`;
      return query(sql, params);
    },
    enabled: !!business?.id
  });

  const handleResponder = async (id: string, response: string) => {
    try {
      const sql = `
        UPDATE avaliacoes 
        SET resposta = $2, respondido_em = NOW()
        WHERE id = $1
      `;
      await query(sql, [id, response]);

      toast({
        title: 'Resposta enviada!',
        description: 'Sua resposta foi publicada com sucesso.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao responder',
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Avaliações</h2>
        <p className="text-muted-foreground">
          Gerencie o feedback dos seus clientes
        </p>
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          variant={filter === 'all' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'pending' ? 'secondary' : 'ghost'}
          onClick={() => setFilter('pending')}
        >
          Pendentes
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Nenhuma avaliação encontrada
          </h3>
          <p className="text-muted-foreground">
            Quando seus clientes avaliarem o serviço, as avaliações aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-x-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(review.created_at), "d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <p className="font-medium mt-1">
                    {review.is_anonymous ? 'Cliente anônimo' : review.customer_name}
                  </p>
                  {review.service_name && (
                    <p className="text-sm text-muted-foreground">
                      {review.service_name} •{' '}
                      {review.attendant_name || 'Profissional não atribuído'}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm">{review.comment}</p>
              </div>

              {review.resposta ? (
                <div className="mt-4 pl-4 border-l-2">
                  <p className="text-sm font-medium">Sua resposta</p>
                  <p className="text-sm mt-1">{review.resposta}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(
                      parseISO(review.respondido_em),
                      "d 'de' MMMM 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <Input
                    placeholder="Escreva uma resposta..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleResponder(review.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}