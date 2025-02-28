import { Link } from 'react-router-dom';
import { CalendarDays, MessageSquare, Users2, Star, Bot, Shield, Zap, ArrowRight, DollarSign, BarChart2, Gift, Clock, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TypebotLogo = () => (
  <svg viewBox="0 0 400 400" className="w-16 h-16">
    <path
      fill="#4C51BF"
      d="M200 0C89.5 0 0 89.5 0 200s89.5 200 200 200 200-89.5 200-200S310.5 0 200 0zm0 360c-88.4 0-160-71.6-160-160S111.6 40 200 40s160 71.6 160 160-71.6 160-160 160z"
    />
    <path
      fill="#4C51BF"
      d="M200 120c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 120c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z"
    />
  </svg>
);

const ManyChatLogo = () => (
  <svg viewBox="0 0 400 400" className="w-16 h-16">
    <path
      fill="#00B0FF"
      d="M320 40H80c-22.1 0-40 17.9-40 40v240c0 22.1 17.9 40 40 40h160l80 80V320c22.1 0 40-17.9 40-40V80c0-22.1-17.9-40-40-40z"
    />
    <circle fill="#FFFFFF" cx="140" cy="200" r="30" />
    <circle fill="#FFFFFF" cx="200" cy="200" r="30" />
    <circle fill="#FFFFFF" cx="260" cy="200" r="30" />
  </svg>
);

const SendBotLogo = () => (
  <svg viewBox="0 0 400 400" className="w-16 h-16">
    <path
      fill="#4CAF50"
      d="M200 0C89.5 0 0 89.5 0 200s89.5 200 200 200 200-89.5 200-200S310.5 0 200 0zm133.3 150L200 283.3 66.7 150l33.3-33.3L200 216.7l100-100 33.3 33.3z"
    />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Gestly</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Funcionalidades
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Planos
              </a>
              <a href="#integrations" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Integrações
              </a>
            </nav>
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
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Gestão de Agendamentos
              <span className="text-primary"> Simplificada</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Automatize seus agendamentos, fidelize clientes e impulsione seu negócio com a plataforma mais completa do mercado.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Teste Grátis por 14 Dias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver Demonstração
                </Button>
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                <span>Configure em minutos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tudo que você precisa em um só lugar</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Gerencie seu negócio de forma simples e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={CalendarDays}
              title="Agendamentos Inteligentes"
              description="Sistema completo com confirmações automáticas, lembretes por WhatsApp e controle de horários."
            />
            <FeatureCard
              icon={Bot}
              title="Integrações com Chatbots"
              description="Integre com Typebot, ManyChat e SendBot para automatizar o atendimento e agendamentos."
            />
            <FeatureCard
              icon={Users2}
              title="Gestão de Clientes"
              description="Cadastro completo, histórico, tags, programa de fidelidade e análise de comportamento."
            />
            <FeatureCard
              icon={Star}
              title="Avaliações e Feedback"
              description="Sistema de avaliações com respostas, métricas por profissional e análise de satisfação."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Notificações Automáticas"
              description="Lembretes multicanal (WhatsApp, SMS, email) com templates personalizáveis."
            />
            <FeatureCard
              icon={Shield}
              title="API Completa"
              description="API REST documentada, webhooks e integrações personalizadas."
            />
            <FeatureCard
              icon={DollarSign}
              title="Gestão de Comissões"
              description="Controle de comissões por profissional, serviço e metas com relatórios detalhados."
            />
            <FeatureCard
              icon={BarChart2}
              title="Relatórios Avançados"
              description="Dashboard completo com métricas de desempenho, ocupação e faturamento."
            />
            <FeatureCard
              icon={Gift}
              title="Programa de Fidelidade"
              description="Sistema de pontos, recompensas e benefícios para fidelizar clientes."
            />
            <FeatureCard
              icon={Clock}
              title="Horários Flexíveis"
              description="Configure horários por dia, intervalos e dias especiais com facilidade."
            />
            <FeatureCard
              icon={Settings2}
              title="Altamente Personalizável"
              description="Adapte o sistema ao seu negócio com configurações flexíveis."
            />
            <FeatureCard
              icon={Zap}
              title="Rápido e Intuitivo"
              description="Interface moderna e responsiva para agilizar seu trabalho."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Planos para todos os tamanhos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <PriceCard
              title="Grátis"
              price="R$ 0"
              description="Para começar"
              features={[
                "30 agendamentos/mês",
                "50 clientes",
                "3 serviços",
                "1 atendente",
                "Lembretes WhatsApp",
                "API básica"
              ]}
            />
            <PriceCard
              title="Iniciante"
              price="R$ 49,90"
              description="Para autônomos"
              features={[
                "100 agendamentos/mês",
                "200 clientes",
                "10 serviços",
                "1 atendente",
                "Programa fidelidade",
                "API completa"
              ]}
            />
            <PriceCard
              title="Profissional"
              price="R$ 99,90"
              description="Para pequenos negócios"
              features={[
                "500 agendamentos/mês",
                "1.000 clientes",
                "30 serviços",
                "5 atendentes",
                "Relatórios avançados",
                "Suporte prioritário"
              ]}
              highlighted
            />
            <PriceCard
              title="Empresarial"
              price="R$ 199,90"
              description="Para crescer mais"
              features={[
                "Agendamentos ilimitados",
                "Clientes ilimitados",
                "Serviços ilimitados",
                "Atendentes ilimitados",
                "API sem limites",
                "Suporte VIP"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Integre com suas ferramentas favoritas</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              O Gestly se conecta com as principais plataformas do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <IntegrationCard
              title="Typebot"
              description="Crie fluxos de agendamento automatizados"
              image="https://assets.usehall.com/org_01J5WY498Z4HFNZA1D6GQGBV59/004a705f-4be7-47b3-b6e7-64fa297d5d92.png"
            />
            <IntegrationCard
              title="ManyChat"
              description="Automatize conversas no Facebook e Instagram"
              image="https://cdn.prod.website-files.com/625817c1528a479afc134612/64a2c3d3b28e77f1db93056b_Manychat.png"
            />
            <IntegrationCard
              title="SendBot"
              description="Crie fluxos de agendamento automatizados e Integre com WhatsApp Business por API ou QR-Code"
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrAw-eTju22PbWw-6Yp_7qKNn73zd9klZFMg&s"
            />
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
                <li><Link to="/features" className="hover:text-white">Funcionalidades</Link></li>
                <li><Link to="/integrations" className="hover:text-white">Integrações</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Preços</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/about" className="hover:text-white">Sobre</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white">Carreiras</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><Link to="/terms" className="hover:text-white">Termos</Link></li>
                <li><Link to="/privacy#cookies" className="hover:text-white">Cookies</Link></li>
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

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-primary mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PriceCard({ 
  title, 
  price, 
  description, 
  features,
  highlighted = false
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={`
      rounded-lg p-8 
      ${highlighted 
        ? 'bg-primary text-primary-foreground ring-2 ring-primary' 
        : 'bg-white border'}
    `}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`${highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'} mb-4`}>
        {description}
      </p>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-sm">/mês</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <Check className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/register" className="block">
        <Button 
          className="w-full" 
          variant={highlighted ? 'secondary' : 'outline'}
        >
          Começar Agora
        </Button>
      </Link>
    </div>
  );
}

function IntegrationCard({
  title,
  description,
  image
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <img 
        src={image} 
        alt={title}
        className="w-16 h-16 rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}