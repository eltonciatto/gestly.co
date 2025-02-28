import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Search, Book, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const articles = [
  {
    category: 'Primeiros Passos',
    items: [
      {
        title: 'Como criar sua conta',
        description: 'Aprenda a criar e configurar sua conta no Gestly',
        type: 'article'
      },
      {
        title: 'Configurando seu negócio',
        description: 'Configure as informações básicas do seu negócio',
        type: 'article'
      },
      {
        title: 'Adicionando serviços',
        description: 'Cadastre os serviços oferecidos pelo seu negócio',
        type: 'video'
      }
    ]
  },
  {
    category: 'Agendamentos',
    items: [
      {
        title: 'Gerenciando sua agenda',
        description: 'Aprenda a usar o calendário e gerenciar horários',
        type: 'article'
      },
      {
        title: 'Confirmações automáticas',
        description: 'Configure lembretes e confirmações automáticas',
        type: 'video'
      },
      {
        title: 'Bloqueio de horários',
        description: 'Como bloquear horários e definir exceções',
        type: 'article'
      }
    ]
  },
  {
    category: 'Clientes',
    items: [
      {
        title: 'Cadastro de clientes',
        description: 'Como cadastrar e gerenciar seus clientes',
        type: 'article'
      },
      {
        title: 'Programa de fidelidade',
        description: 'Configure pontos e recompensas',
        type: 'video'
      },
      {
        title: 'Histórico e notas',
        description: 'Mantenha um histórico completo dos clientes',
        type: 'article'
      }
    ]
  }
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');

  const filteredArticles = articles.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

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

      {/* Search Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Base de Conhecimento
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Encontre tutoriais e artigos para ajudar você a usar o Gestly
            </p>
            <div className="mt-10">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar artigos..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {filteredArticles.map((category, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-8">{category.category}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {category.items.map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 text-primary mb-4">
                        {item.type === 'video' ? (
                          <Video className="h-5 w-5" />
                        ) : (
                          <Book className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium">
                          {item.type === 'video' ? 'Vídeo' : 'Artigo'}
                        </span>
                      </div>
                      <h3 className="font-medium mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link to="#">
                          Ler mais
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
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