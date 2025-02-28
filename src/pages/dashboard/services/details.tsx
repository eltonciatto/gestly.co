import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiClient } from '@/lib/api/client';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data } = await apiClient.services.get(id!);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center">
        <p>Serviço não encontrado</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => navigate('/dashboard/services')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/dashboard/services')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">{service.name}</h2>
        <p className="text-muted-foreground">
          Detalhes do serviço
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Informações Básicas</h3>
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">Nome:</span>{' '}
              {service.name}
            </p>
            <p>
              <span className="text-muted-foreground">Descrição:</span>{' '}
              {service.description || 'Não informada'}
            </p>
            <p>
              <span className="text-muted-foreground">Duração:</span>{' '}
              {service.duration} minutos
            </p>
            <p>
              <span className="text-muted-foreground">Preço:</span>{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(service.price)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Comissões</h3>
          <div className="space-y-2">
            <p>
              <span className="text-muted-foreground">Porcentagem:</span>{' '}
              {service.commission_percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}