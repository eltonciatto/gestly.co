import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';

const navigation = [
  {
    name: 'Principal',
    items: [
      { name: 'Visão Geral', href: '/dashboard', icon: 'LayoutDashboard' },
      { name: 'Agendamentos', href: '/dashboard/appointments', icon: 'CalendarDays' },
      { name: 'Clientes', href: '/dashboard/customers', icon: 'Users2' },
      { name: 'Avaliações', href: '/dashboard/reviews', icon: 'Star' },
      { name: 'Serviços', href: '/dashboard/services', icon: 'Briefcase' }
    ]
  },
  {
    name: 'Gestão',
    items: [
      { name: 'Financeiro', href: '/dashboard/finance', icon: 'DollarSign' },
      { name: 'Contas a Receber', href: '/dashboard/finance/receivables', icon: 'ArrowDownLeft' },
      { name: 'Contas a Pagar', href: '/dashboard/finance/payables', icon: 'ArrowUpRight' },
      { name: 'Relatórios', href: '/dashboard/finance/reports', icon: 'FileText' },
      { name: 'Comissões', href: '/dashboard/commissions', icon: 'DollarSign' },
      { name: 'Relatórios', href: '/dashboard/reports', icon: 'LineChart' }
    ]
  },
  {
    name: 'Configurações',
    items: [
      { name: 'Geral', href: '/dashboard/settings', icon: 'Settings' },
      { name: 'Horários', href: '/dashboard/settings/business-hours', icon: 'Clock' },
      { name: 'Notificações', href: '/dashboard/settings/notifications', icon: 'Bell' },
      { name: 'Integrações', href: '/dashboard/settings/integrations', icon: 'Bot' },
      { name: 'API', href: '/dashboard/settings/api', icon: 'Webhook' }
    ]
  }
];

interface NavItemProps {
  section: {
    name: string;
    items: {
      name: string;
      href: string;
      icon: string;
    }[];
  };
  isActive: boolean;
  onItemClick?: () => void;
}

function NavItem({ section, isActive, onItemClick }: NavItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  return (
    <div className="space-y-1">
      <button
        className={cn(
          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{section.name}</span>
        <Icons.ChevronDown className={cn(
          'h-4 w-4 transition-transform',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {isExpanded && (
        <div className="ml-4 space-y-1 border-l pl-3">
          {section.items.map((item) => {
            const Icon = Icons[item.icon as keyof typeof Icons];
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                onClick={onItemClick}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data } = await apiClient.auth.me();
        setIsSuperAdmin(data?.role === 'super_admin');
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    checkUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
      navigate('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  return (
    <div>
      {/* Mobile sidebar backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 lg:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 bg-white w-72 z-50 lg:block transition-transform duration-200 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center gap-x-4 border-b px-6">
          <Link to="/dashboard" className="flex items-center gap-x-2">
            <Icons.CalendarDays className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Gestly</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto"
            onClick={() => setSidebarOpen(false)}
          >
            <Icons.X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col p-4">
          <div className="flex-1 space-y-2">
            {navigation.map((section) => {
              const isActive = section.items.some(
                item => location.pathname === item.href
              );

              return (
                <NavItem
                  key={section.name}
                  section={section}
                  isActive={isActive}
                  onItemClick={() => setSidebarOpen(false)}
                />
              );
            })}
          </div>

          {isSuperAdmin && (
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-x-3 text-primary"
                asChild
              >
                <Link to="/dashboard/admin">
                  <Icons.Shield className="h-5 w-5" />
                  Painel Administrativo
                </Link>
              </Button>
            </div>
          )}

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-x-3 text-gray-700"
              onClick={handleLogout}
            >
              <Icons.LogOut className="h-5 w-5" />
              Sair
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 h-16 bg-white border-b">
          <div className="flex h-16 items-center gap-x-4 px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Icons.Menu className="h-6 w-6" />
            </Button>

            <div className="flex flex-1 items-center justify-end gap-x-4">
              <div className="w-full max-w-sm lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <Icons.Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    className="pl-10"
                    placeholder="Buscar..."
                    type="search"
                  />
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <Icons.Bell className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <Icons.Settings2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}