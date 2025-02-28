import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Users2, 
  Star, 
  Bot, 
  DollarSign, 
  BarChart2, 
  Gift, 
  Clock, 
  Bell, 
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: CalendarDays,
    title: 'Agendamentos Inteligentes',
    description: 'Sistema completo de agendamentos com confirmações automáticas e gestão de horários.',
    benefits: [
      'Agendamento online 24/7',
      'Confirmações automáticas',
      'Gestão de disponibilidade',
      'Bloqueio de horários',
      'Reagendamentos simplificados'
    ]
  },
  {
    icon: Users2,
    title: 'Gestão de Clientes',
    description: 'Cadastro completo de clientes com histórico e preferências.',
    benefits: [
      'Fichas cadastrais completas',
      'Histórico de atendimentos',
      'Preferências e observações',
      'Tags personalizadas',
      'Busca avançada'
    ]
  },
  {
    icon: Gift,
    title: 'Programa de Fidelidade',
    description: 'Sistema de pontos e recompensas para fidelizar seus clientes.',
    benefits: [
      'Pontos por consumo',
      'Recompensas personalizadas',
      'Regras flexíveis',
      'Resgate automático',
      'Relatórios de engajamento'
    ]
  },
  {
    icon: DollarSign,
    title: 'Controle de Comissões',
    description: 'Gestão completa de comissões e pagamentos para profissionais.',
    benefits: [
      'Cálculo automático',
      'Regras por serviço',
      'Metas e bonificações',
      'Relatórios detalhados',
      'Recibos de pagamento'
    ]
  }
];

const integrations = [
  {
    name: 'Typebot',
    description: 'Crie fluxos de agendamento automatizados',
    image: 'https://assets.usehall.com/org_01J5WY498Z4HFNZA1D6GQGBV59/004a705f-4be7-47b3-b6e7-64fa297d5d92.png'
  },
  {
    name: 'ManyChat',
    description: 'Automatize conversas no Facebook e Instagram',
    image: 'https://cdn.prod.website-files.com/625817c1528a479afc134612/64a2c3d3b28e77f1db93056b_Manychat.png'
  },
  {
    name: 'SendBot',
    description: 'Integre com WhatsApp Business',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrAw-eTju22PbWw-6Yp_7qKNn73zd9klZFMg&s'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Gestly</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link to="/register">
                <Button>Começar Grátis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Funcionalidades Completas
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar agendamentos e fazer seu negócio crescer
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Agendar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{feature.title}</h2>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mais Recursos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Funcionalidades que fazem a diferença no seu dia a dia
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Bell className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Notificações Automáticas</h3>
              <p className="text-muted-foreground">
                Lembretes por WhatsApp, SMS e email para reduzir faltas e atrasos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <BarChart2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Relatórios Avançados</h3>
              <p className="text-muted-foreground">
                Métricas e insights para tomar decisões baseadas em dados.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Star className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Avaliações e Feedback</h3>
              <p className="text-muted-foreground">
                Colete e gerencie avaliações dos clientes para melhorar seu serviço.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Clock className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Horários Flexíveis</h3>
              <p className="text-muted-foreground">
                Configure horários de funcionamento e intervalos com facilidade.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Bot className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Integrações</h3>
              <p className="text-muted-foreground">
                Conecte com suas ferramentas favoritas e automatize processos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Smartphone className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Responsivo</h3>
              <p className="text-muted-foreground">
                Acesse de qualquer dispositivo, a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Integrações</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Conecte o Gestly com suas ferramentas favoritas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <img 
                  src={integration.image} 
                  alt={integration.name}
                  className="w-16 h-16 rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{integration.name}</h3>
                <p className="text-muted-foreground text-sm">{integration.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">API Completa</h2>
              <p className="text-lg text-muted-foreground mb-6">
                API REST documentada e webhooks para integrar o Gestly com seus sistemas.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Segura</h3>
                    <p className="text-sm text-muted-foreground">Autenticação via API key e HTTPS</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Rápida</h3>
                    <p className="text-sm text-muted-foreground">Baixa latência e alta disponibilidade</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Documentada</h3>
                    <p className="text-sm text-muted-foreground">Documentação completa e exemplos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-6 font-mono text-sm">
              <pre className="language-json">
                <code>{`{
  "success": true,
  "data": {
    "appointment": {
      "id": "apt_123",
      "customer": {
        "name": "João Silva",
        "email": "joao@email.com"
      },
      "service": {
        "name": "Corte",
        "duration": 60,
        "price": 50.00
      },
      "start_time": "2024-01-01T10:00:00Z"
    }
  }
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Comece a usar o Gestly hoje mesmo
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Teste gratuitamente por 14 dias e descubra como o Gestly pode ajudar seu negócio a crescer.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CalendarDays className="h-6 w-6" />
                <span className="text-xl font-bold">Gestly</span>
              </div>
              <p className="text-slate-400">
                Simplificando a gestão de agendamentos para empresas brasileiras.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Funcionalidades</li>
                <li>Integrações</li>
                <li>Preços</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Privacidade</li>
                <li>Termos</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Gestly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}