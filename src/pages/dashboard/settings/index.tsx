import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users2, Clock, Bell, Bot, Gift, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as configurações do seu negócio
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/dashboard/settings/business" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Building2 className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">Dados do Negócio</h3>
            <p className="text-sm text-muted-foreground">
              Configure informações básicas do seu negócio
            </p>
          </div>
        </Link>

        <Link to="/dashboard/settings/team" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Users2 className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">Equipe</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie os profissionais da sua equipe
            </p>
          </div>
        </Link>

        <Link to="/dashboard/settings/business-hours" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Clock className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">Horários de Funcionamento</h3>
            <p className="text-sm text-muted-foreground">
              Configure os horários de atendimento e dias especiais
            </p>
          </div>
        </Link>

        <Link to="/dashboard/settings/notifications" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Bell className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">Notificações</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie lembretes e mensagens automáticas
            </p>
          </div>
        </Link>

        <Link to="/dashboard/settings/integrations" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Bot className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">Integrações</h3>
            <p className="text-sm text-muted-foreground">
              Conecte com outras plataformas
            </p>
          </div>
        </Link>

        <Link to="/dashboard/settings/loyalty" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Gift className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">Programa de Fidelidade</h3>
            <p className="text-sm text-muted-foreground">
              Configure pontos e recompensas
            </p>
          </div>
        </Link>

        <Link to="/dashboard/settings/api" className="block">
          <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <Webhook className="h-6 w-6 mb-4 text-primary" />
            <h3 className="font-medium mb-2">API e Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie integrações via API
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}