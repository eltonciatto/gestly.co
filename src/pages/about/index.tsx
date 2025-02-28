import { Link } from 'react-router-dom';
import { CalendarDays, Users2, Star, Bot, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
              Sobre o Gestly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Uma plataforma completa de gestão de agendamentos desenvolvida para o mercado brasileiro.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Simplificar a gestão de agendamentos para empresas brasileiras, oferecendo uma solução completa e intuitiva que ajuda a aumentar a produtividade e melhorar a experiência dos clientes.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Confiabilidade</h3>
                    <p className="text-sm text-muted-foreground">Segurança e estabilidade para seu negócio</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Eficiência</h3>
                    <p className="text-sm text-muted-foreground">Otimize seu tempo e recursos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Foco no Cliente</h3>
                    <p className="text-sm text-muted-foreground">Melhore a experiência dos seus clientes</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-6"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Equipe Gestly"
                className="rounded-3xl relative shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Nossa Equipe</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Profissionais dedicados a tornar sua experiência excepcional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="Elton Ciatto"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-medium">Elton Ciatto</h3>
              <p className="text-sm text-muted-foreground">CEO & Fundador</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80"
                alt="Ana Silva"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-medium">Ana Silva</h3>
              <p className="text-sm text-muted-foreground">Head de Produto</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt="Pedro Santos"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-medium">Pedro Santos</h3>
              <p className="text-sm text-muted-foreground">Head de Tecnologia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Entre em Contato</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Estamos aqui para ajudar você a crescer seu negócio
            </p>
            <div className="space-y-4">
              <p className="text-lg">
                <strong>Email:</strong>{' '}
                <a href="mailto:contato@gestly.com.br" className="text-primary hover:underline">
                  contato@gestly.com.br
                </a>
              </p>
              <p className="text-lg">
                <strong>Telefone:</strong>{' '}
                <a href="tel:+551199999999" className="text-primary hover:underline">
                  (11) 9999-9999
                </a>
              </p>
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