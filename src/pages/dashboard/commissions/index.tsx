import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DollarSign, Target, FileText, BarChart2, Settings2 } from 'lucide-react';
import CommissionReport from './report';
import CommissionGoals from './goals';
import CommissionPayments from './payments';
import CommissionDashboard from './dashboard';
import CommissionSettings from './settings';

export default function CommissionsPage() {
  const location = useLocation();
  const isGoals = location.pathname.endsWith('/goals');
  const isPayments = location.pathname.endsWith('/payments');
  const isDashboard = location.pathname.endsWith('/dashboard');
  const isSettings = location.pathname.endsWith('/settings');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-x-2 border-b pb-4">
        <Button
          variant={!isGoals && !isDashboard && !isPayments && !isSettings ? 'secondary' : 'ghost'}
          asChild
        >
          <Link to="/dashboard/commissions">
            <DollarSign className="h-4 w-4 mr-2" />
            Relatório
          </Link>
        </Button>
        <Button
          variant={isGoals ? 'secondary' : 'ghost'}
          asChild
        >
          <Link to="/dashboard/commissions/goals">
            <Target className="h-4 w-4 mr-2" />
            Metas
          </Link>
        </Button>
        <Button
          variant={isPayments ? 'secondary' : 'ghost'}
          asChild
        >
          <Link to="/dashboard/commissions/payments">
            <FileText className="h-4 w-4 mr-2" />
            Pagamentos
          </Link>
        </Button>
        <Button
          variant={isDashboard ? 'secondary' : 'ghost'}
          asChild
        >
          <Link to="/dashboard/commissions/dashboard">
            <BarChart2 className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>
        <Button
          variant={isSettings ? 'secondary' : 'ghost'}
          asChild
        >
          <Link to="/dashboard/commissions/settings">
            <Settings2 className="h-4 w-4 mr-2" />
            Configurações
          </Link>
        </Button>
      </div>

      {isGoals ? <CommissionGoals /> :
       isPayments ? <CommissionPayments /> :
       isDashboard ? <CommissionDashboard /> :
       isSettings ? <CommissionSettings /> :
       <CommissionReport />}
    </div>
  );
}