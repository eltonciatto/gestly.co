import { Link } from 'react-router-dom';
import { CalendarDays, MessageSquare, Video, Book, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  {
    title: 'Primeiros Passos',
    description: 'Guias básicos para começar a usar o Gestly',
    icon: Book,
    articles: [
      'Como criar sua conta',
      'Configurando seu negócio',
      'Adicionando serviços',
      'Gerenciando sua agenda'
    ]
  },
  {
    title: 'Tutoriais em Vídeo',
    description: 'Aprenda visualmente com nossos tutoriais',
    icon: Video,
    videos: [
      'Visão geral do sistema',
      'Agendamentos e confirmações',
      'Programa de fidelidade',
      'Relatórios e métricas'
    ]
  },
  {
    title: 'Chat de Suporte',
    description: 'Fale diretamente com nossa equipe',
    icon: MessageSquare,
    features: [
      'Suporte em tempo real',
      'Segunda a sexta, 9h às 18h',
      'Tempo médio de resposta: 5min',
      'Base de conhecimento integrada'
    ]
  }
];

export default function SupportPage() {
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
              Como podemos ajudar?
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Encontre respostas rápidas ou fale com nossa equipe de suporte
            </p>
            <div className="mt-10">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar ajuda..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-primary mb-4">
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                <div className="space-y-3">
                  {category.articles && category.articles.map((article, i) => (
                    <p key={i} className="text-sm">{article}</p>
                  ))}
                  {category.videos && category.videos.map((video, i) => (
                    <p key={i} className="text-sm">{video}</p>
                  ))}
                  {category.features && category.features.map((feature, i) => (
                    <p key={i} className="text-sm">{feature}</p>
                  ))}
                </div>
                <Button className="w-full mt-6">
                  Acessar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ainda precisa de ajuda?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe está pronta para ajudar você
            </p>
            <Button size="lg">
              Iniciar Chat
              <MessageSquare className="ml-2 h-4 w-4" />
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