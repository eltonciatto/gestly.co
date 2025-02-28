import { Link } from 'react-router-dom';
import { CalendarDays, Play, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tutorials = [
  {
    category: 'Introdução',
    videos: [
      {
        title: 'Visão Geral do Gestly',
        description: 'Conheça as principais funcionalidades do sistema',
        duration: '5:30',
        thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        title: 'Configuração Inicial',
        description: 'Configure seu negócio em poucos minutos',
        duration: '8:45',
        thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      }
    ]
  },
  {
    category: 'Agendamentos',
    videos: [
      {
        title: 'Gerenciando sua Agenda',
        description: 'Aprenda a usar o calendário de forma eficiente',
        duration: '7:15',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        title: 'Confirmações Automáticas',
        description: 'Configure lembretes e confirmações',
        duration: '6:20',
        thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      }
    ]
  },
  {
    category: 'Clientes',
    videos: [
      {
        title: 'Cadastro e Gestão',
        description: 'Gerencie sua base de clientes',
        duration: '9:00',
        thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        title: 'Programa de Fidelidade',
        description: 'Configure pontos e recompensas',
        duration: '10:30',
        thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1487&q=80'
      }
    ]
  }
];

export default function Tutorials() {
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
              Tutoriais em Vídeo
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Aprenda a usar o Gestly com nossos tutoriais passo a passo
            </p>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {tutorials.map((category, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-8">{category.category}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {category.videos.map((video, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="relative group">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="lg" variant="secondary">
                            <Play className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{video.duration}</span>
                        </div>
                        <h3 className="font-medium mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {video.description}
                        </p>
                        <Button variant="ghost" className="w-full" asChild>
                          <Link to="#">
                            Assistir
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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