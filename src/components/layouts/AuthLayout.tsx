import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth/context';
import { CalendarDays } from 'lucide-react';
import { LoadingScreen } from '@/components/ui/loading';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Se o usuário estiver autenticado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não estiver autenticado e tentar acessar uma rota diferente de login,
  // redireciona para login
  if (location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/register/confirm') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-slate-50">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md">
            <div className="flex items-center space-x-2 mb-8">
              <CalendarDays className="h-12 w-12 text-primary" />
              <span className="text-3xl font-bold">Gestly</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {location.pathname === '/login' 
                ? 'Bem-vindo de volta!'
                : 'Comece a crescer seu negócio'}
            </h1>
            <p className="text-muted-foreground">
              {location.pathname === '/login'
                ? 'Entre na sua conta para continuar gerenciando seus agendamentos.'
                : 'Crie sua conta gratuita e comece a usar o Gestly em minutos.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <CalendarDays className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Gestly</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}