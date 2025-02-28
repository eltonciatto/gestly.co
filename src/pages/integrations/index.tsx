import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Bot, 
  MessageSquare, 
  Smartphone, 
  Webhook, 
  ArrowRight,
  CheckCircle,
  Code,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const mainIntegrations = [
  {
    name: 'Typebot',
    description: 'Crie fluxos de agendamento automatizados com chatbots inteligentes.',
    image: 'https://assets.usehall.com/org_01J5WY498Z4HFNZA1D6GQGBV59/004a705f-4be7-47b3-b6e7-64fa297d5d92.png',
    features: [
      'Agendamentos via chatbot',
      'Respostas automáticas',
      'Fluxos personalizados',
      'Integração nativa'
    ]
  },
  {
    name: 'ManyChat',
    description: 'Automatize conversas e agendamentos no Facebook e Instagram.',
    image: 'https://cdn.prod.website-files.com/625817c1528a479afc134612/64a2c3d3b28e77f1db93056b_Manychat.png',
    features: [
      'Chatbot para redes sociais',
      'Campanhas automatizadas',
      'Remarketing inteligente',
      'Métricas detalhadas'
    ]
  },
  {
    name: 'SendBot',
    description: 'Integre com WhatsApp Business por API ou QR-Code.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrAw-eTju22PbWw-6Yp_7qKNn73zd9klZFMg&s',
    features: [
      'WhatsApp Business API',
      'Mensagens automáticas',
      'Confirmações via WhatsApp',
      'Multi-atendentes'
    ]
  }
];

const additionalIntegrations = [
  {
    name: 'Webhooks',
    description: 'Receba notificações em tempo real de eventos no Gestly.',
    icon: Webhook,
    features: [
      'Eventos em tempo real',
      'Payload personalizável',
      'Retry automático',
      'Logs detalhados'
    ]
  },
  {
    name: 'API REST',
    description: 'API completa para integrar com seus sistemas.',
    icon: Code,
    features: [
      'Documentação completa',
      'Autenticação segura',
      'Rate limiting',
      'Suporte a webhooks'
    ]
  },
  {
    name: 'Mobile Apps',
    description: 'Aplicativos nativos para iOS e Android.',
    icon: Smartphone,
    features: [
      'Experiência nativa',
      'Notificações push',
      'Modo offline',
      'Biometria'
    ]
  }
];

export default function IntegrationsPage() {
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
              Integrações Poderosas
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Conecte o Gestly com suas ferramentas favoritas e automatize seus processos
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Ver Documentação
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Integrations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Integrações Principais</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Automatize seus agendamentos com nossas integrações nativas
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {mainIntegrations.map((integration, index) => (
              <div key={index} className="bg-white rounded-xl border p-6">
                <img 
                  src={integration.image} 
                  alt={integration.name}
                  className="w-16 h-16 rounded-lg mb-6"
                />
                <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                <p className="text-muted-foreground mb-6">{integration.description}</p>
                <div className="space-y-3">
                  {integration.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6">
                  Configurar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Integrations */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mais Possibilidades</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Outras formas de integrar com o Gestly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalIntegrations.map((integration, index) => (
              <div key={index} className="bg-white rounded-xl border p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <integration.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
                <p className="text-muted-foreground mb-6">{integration.description}</p>
                <div className="space-y-3">
                  {integration.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20">
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
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Comece a integrar hoje mesmo
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Teste gratuitamente por 14 dias e explore todas as possibilidades de integração do Gestly.
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