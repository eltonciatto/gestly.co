import { Link } from 'react-router-dom';
import { CalendarDays, Check, ArrowRight, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Grátis',
    description: 'Para começar',
    price: 0,
    features: [
      '30 agendamentos/mês',
      '50 clientes',
      '3 serviços',
      '1 atendente',
      'Lembretes por WhatsApp',
      'API básica'
    ],
    cta: 'Começar Grátis',
    highlighted: false
  },
  {
    name: 'Iniciante',
    description: 'Para autônomos',
    price: 49.90,
    features: [
      '100 agendamentos/mês',
      '200 clientes',
      '10 serviços',
      '1 atendente',
      'Programa de fidelidade',
      'Integrações com chatbots',
      'API completa',
      'Suporte por email'
    ],
    cta: 'Assinar Agora',
    highlighted: false
  },
  {
    name: 'Profissional',
    description: 'Para pequenos negócios',
    price: 99.90,
    features: [
      '500 agendamentos/mês',
      '1.000 clientes',
      '30 serviços',
      '5 atendentes',
      'Tudo do plano Iniciante',
      'Relatórios avançados',
      'Personalização de notificações',
      'Suporte prioritário'
    ],
    cta: 'Assinar Agora',
    highlighted: true
  },
  {
    name: 'Empresarial',
    description: 'Para crescer mais',
    price: 199.90,
    features: [
      'Agendamentos ilimitados',
      'Clientes ilimitados',
      'Serviços ilimitados',
      'Atendentes ilimitados',
      'Tudo do plano Profissional',
      'API sem limites',
      'Integrações personalizadas',
      'Suporte VIP'
    ],
    cta: 'Falar com Vendas',
    highlighted: false
  }
];

const features = [
  {
    name: 'Agendamentos',
    free: '30/mês',
    starter: '100/mês',
    pro: '500/mês',
    business: 'Ilimitado'
  },
  {
    name: 'Clientes',
    free: '50',
    starter: '200',
    pro: '1.000',
    business: 'Ilimitado'
  },
  {
    name: 'Serviços',
    free: '3',
    starter: '10',
    pro: '30',
    business: 'Ilimitado'
  },
  {
    name: 'Atendentes',
    free: '1',
    starter: '1',
    pro: '5',
    business: 'Ilimitado'
  },
  {
    name: 'Lembretes WhatsApp',
    free: true,
    starter: true,
    pro: true,
    business: true
  },
  {
    name: 'Programa Fidelidade',
    free: false,
    starter: true,
    pro: true,
    business: true
  },
  {
    name: 'Integrações Chatbot',
    free: false,
    starter: true,
    pro: true,
    business: true
  },
  {
    name: 'API',
    free: 'Básica',
    starter: 'Completa',
    pro: 'Completa',
    business: 'Sem limites'
  },
  {
    name: 'Relatórios',
    free: 'Básicos',
    starter: 'Básicos',
    pro: 'Avançados',
    business: 'Avançados'
  },
  {
    name: 'Suporte',
    free: 'Email',
    starter: 'Email',
    pro: 'Prioritário',
    business: 'VIP'
  }
];

export default function PricingPage() {
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Planos para todos os tamanhos
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Escolha o plano ideal para o seu negócio
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm">Configure em minutos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl p-8 ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'bg-white border'
                }`}
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className={`${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'R$ 0' : `R$ ${plan.price.toFixed(2)}`}
                  </span>
                  <span className="text-sm">/mês</span>
                </div>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className={`h-5 w-5 ${plan.highlighted ? 'text-primary-foreground' : 'text-green-500'}`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'secondary' : 'outline'}
                  asChild
                >
                  <Link to="/register">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Comparação de Recursos</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Compare os recursos disponíveis em cada plano
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Recurso</th>
                  <th className="p-4 text-center font-medium">Grátis</th>
                  <th className="p-4 text-center font-medium">Iniciante</th>
                  <th className="p-4 text-center font-medium">Profissional</th>
                  <th className="p-4 text-center font-medium">Empresarial</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4 font-medium">{feature.name}</td>
                    <td className="p-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        feature.free
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        feature.starter
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        feature.pro
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof feature.business === 'boolean' ? (
                        feature.business ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        feature.business
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Perguntas Frequentes</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tire suas dúvidas sobre nossos planos
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-2">Como funciona o período de teste?</h3>
                <p className="text-muted-foreground">
                  Oferecemos 14 dias de teste grátis com acesso a todas as funcionalidades do plano Profissional. Não é necessário cartão de crédito.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-2">Posso mudar de plano depois?</h3>
                <p className="text-muted-foreground">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são refletidas imediatamente.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-2">Preciso me comprometer por quanto tempo?</h3>
                <p className="text-muted-foreground">
                  Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento sem multa.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="font-medium mb-2">Quais formas de pagamento são aceitas?</h3>
                <p className="text-muted-foreground">
                  Aceitamos cartão de crédito, PIX e boleto bancário. Oferecemos desconto de 20% no plano anual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
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