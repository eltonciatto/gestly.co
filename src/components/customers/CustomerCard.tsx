import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { query } from '@/lib/db';

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email?: string;
    phone: string;
    tags?: string[];
    created_at: string;
  };
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const sql = `
        SELECT 
          c.*,
          json_agg(
            json_build_object(
              'id', a.id,
              'start_time', a.start_time,
              'status', a.status,
              'service', json_build_object(
                'name', s.name,
                'price', s.price
              )
            )
          ) as appointments
        FROM customers c
        LEFT JOIN appointments a ON c.id = a.customer_id
        LEFT JOIN services s ON a.service_id = s.id
        WHERE c.id = $1
        GROUP BY c.id
      `;
      const result = await query(sql, [id]);
      return result[0];
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border bg-card sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-x-2">
          <span className="font-medium">{customer.name}</span>
          {customer.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {customer.email || 'Email não informado'}
        </div>
        <div className="text-sm text-muted-foreground">
          {customer.phone}
        </div>
        <div className="text-xs text-muted-foreground">
          Cliente desde {format(parseISO(customer.created_at), "d 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <Button asChild variant="outline" size="sm">
          <Link to={`/dashboard/appointments/new?customer=${customer.id}`}>
            <CalendarDays className="h-4 w-4 mr-2" />
            Agendar
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to={`/dashboard/customers/${customer.id}`}>
            Detalhes
          </Link>
        </Button>
      </div>
    </div>
  );
}