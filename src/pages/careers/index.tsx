import { Link } from 'react-router-dom';
import { CalendarDays, Heart, Zap, Users2, GraduationCap, Coffee, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const openPositions = [
  {
    id: 1,
    title: 'Desenvolvedor Full Stack Sênior',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'Full-time',
    description: 'Procuramos um desenvolvedor sênior para ajudar a construir o futuro do Gestly.',
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Produto',
    location: 'São Paulo',
    type: 'Full-time',
    description: 'Lidere o desenvolvimento de produtos que impactam milhares de empresas.',
  },
  {
    id: 3,
    title: 'Customer Success Manager',
    department: 'Sucesso do Cliente',
    location: 'Remoto',
    type: 'Full-time',
    description: 'Ajude nossos clientes a alcançarem o máximo potencial com o Gestly.',
  },
  {
    id: 4,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remoto',
    type: 'Full-time',
    description: 'Crie experiências incríveis que fazem a diferença na vida dos usuários.',
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Saúde e Bem-estar',
    description: 'Plano de saúde e odontológico extensivo à família, academia e apoio psicológico.'
  },
  {
    icon: GraduationCap,
    title: 'Desenvolvimento',
    description: 'Verba anual para cursos, certificações e participação em eventos.'
  },
  {
    icon: Coffee,
    title: 'Flexibilidade',
    description: 'Trabalho remoto, horário flexível e sextas-feiras curtas.'
  },
  {
    icon: Users2,
    title: 'Cultura Inclusiva',
    description: 'Ambiente diverso e acolhedor onde todos podem ser quem são.'
  },
  {
    icon: Zap,
    title: 'Impacto Real',
    description: 'Oportunidade de impactar positivamente milhares de empresas brasileiras.'
  }
];

export default function CareersPage() {
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
              Carreiras no Gestly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Junte-se a nós na missão de transformar a gestão de agendamentos no Brasil
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <a href="#positions">
                  Ver Vagas Abertas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa Cultura</h2>
              <p className="text-lg text-muted-foreground mb-6">
                No Gestly, acreditamos que grandes produtos são construídos por pessoas apaixonadas pelo que fazem. Nossa cultura é baseada em:
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Inovação Constante</h3>
                    <p className="text-sm text-muted-foreground">Buscamos sempre as melhores soluções</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Colaboração</h3>
                    <p className="text-sm text-muted-foreground">Trabalhamos juntos para alcançar objetivos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Bem-estar</h3>
                    <p className="text-sm text-muted-foreground">Valorizamos o equilíbrio vida-trabalho</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Equipe Gestly"
                className="rounded-3xl relative shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Benefícios</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Oferecemos um pacote completo de benefícios para nosso time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="positions" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Vagas Abertas</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Encontre a oportunidade perfeita para você
            </p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="group bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                      {position.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {position.department} • {position.location} • {position.type}
                    </p>
                  </div>
                  <Button>
                    Candidatar-se
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground">
                  {position.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Não encontrou uma vaga ideal?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Estamos sempre em busca de talentos. Envie seu currículo e nos conte como você pode contribuir com o Gestly.
            </p>
            <Button size="lg">
              Enviar Currículo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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