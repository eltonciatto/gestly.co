import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api/client';

export default function RegisterConfirm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const createAccount = async () => {
      const email = searchParams.get('email');

      if (!email) {
        setError('Email inválido ou não fornecido.');
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.auth.register({
          email,
          name: email.split('@')[0]
        });

        if (data) {
          setIsAccountCreated(true);
          toast({
            title: 'Conta criada com sucesso!',
            description: 'Agora você pode acessar sua conta.',
          });

          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Erro ao criar conta:', err);
        setError('Não foi possível criar sua conta. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    createAccount();
  }, [searchParams, navigate, toast]);

  if (isLoading) {
    return <p>Processando...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (isAccountCreated) {
    return <p className="text-sm text-muted-foreground">Conta criada com sucesso! Redirecionando...</p>;
  }

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold">Confirmação de Cadastro</h2>
      <p className="text-muted-foreground">
        Aguarde enquanto redirecionamos você...
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/login">Ir para Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/about">Saiba Mais</Link>
        </Button>
      </div>
    </div>
  );
}