import { Link } from 'react-router-dom';
import { CalendarDays, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const articles = [
  {
    id: '1',
    title: 'Como Aumentar a Produtividade do seu Salão de Beleza em 2024',
    description: 'Descubra as melhores práticas e ferramentas para otimizar a gestão do seu salão e aumentar os lucros.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1487&q=80',
    author: 'Ana Silva',
    date: '2024-01-08',
    readTime: '8 min',
    slug: 'aumentar-produtividade-salao-beleza-2024'
  },
  {
    id: '2',
    title: 'Guia Completo de Marketing Digital para Clínicas e Consultórios',
    description: 'Estratégias eficientes de marketing digital para atrair mais pacientes e fidelizar sua base de clientes.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Pedro Santos',
    date: '2024-01-07',
    readTime: '10 min',
    slug: 'articles/guia-marketing-digital-clinicas-consultorios'
  },
  {
    id: '3',
    title: '7 Dicas para Reduzir Faltas e No-shows em Agendamentos',
    description: 'Aprenda estratégias comprovadas para minimizar cancelamentos e faltas de última hora.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Mariana Costa',
    date: '2024-01-06',
    readTime: '6 min',
    slug: 'reduzir-faltas-no-shows-agendamentos'
  },
  {
    id: '4',
    title: 'Como Implementar um Programa de Fidelidade Eficiente',
    description: 'Passo a passo para criar um programa de fidelidade que realmente funciona e aumenta o retorno dos clientes.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Carlos Oliveira',
    date: '2024-01-05',
    readTime: '9 min',
    slug: 'implementar-programa-fidelidade-eficiente'
  },
  {
    id: '5',
    title: 'Gestão Financeira: Controle de Comissões e Pagamentos',
    description: 'Aprenda a gerenciar comissões de forma eficiente e mantenha sua equipe motivada com pagamentos em dia.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Rafael Mendes',
    date: '2024-01-04',
    readTime: '7 min',
    slug: 'gestao-financeira-controle-comissoes-pagamentos'
  },
  {
    id: '6',
    title: 'Automação de Marketing: Lembretes e Comunicação com Clientes',
    description: 'Como usar automação para melhorar a comunicação com clientes e reduzir o trabalho manual.',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1506&q=80',
    author: 'Julia Almeida',
    date: '2024-01-03',
    readTime: '8 min',
    slug: 'automacao-marketing-lembretes-comunicacao-clientes'
  },
  {
    id: '7',
    title: 'Análise de Dados: Tomando Decisões Baseadas em Métricas',
    description: 'Como usar dados e métricas para tomar decisões estratégicas e melhorar seus resultados.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Fernando Silva',
    date: '2024-01-02',
    readTime: '10 min',
    slug: 'analise-dados-decisoes-baseadas-metricas'
  },
  {
    id: '8',
    title: 'Tendências de Gestão de Agendamentos para 2024',
    description: 'Conheça as principais tendências e inovações que vão transformar a gestão de agendamentos.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Amanda Costa',
    date: '2024-01-01',
    readTime: '7 min',
    slug: 'tendencias-gestao-agendamentos-2024'
  },
  {
    id: '9',
    title: 'Como Escolher o Software de Agendamento Ideal',
    description: 'Um guia completo para ajudar você a escolher a melhor solução de agendamento para seu negócio.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Lucas Mendonça',
    date: '2023-12-31',
    readTime: '9 min',
    slug: 'como-escolher-software-agendamento-ideal'
  },
  {
    id: '10',
    title: 'Integrações Essenciais para seu Sistema de Agendamentos',
    description: 'Descubra quais integrações podem potencializar seu sistema de agendamentos e automatizar processos.',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    author: 'Bruno Santos',
    date: '2023-12-30',
    readTime: '8 min',
    slug: 'integracoes-essenciais-sistema-agendamentos'
  }
];

export default function BlogPage() {
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
              Blog do Gestly
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Dicas, tutoriais e novidades sobre gestão de agendamentos e produtividade
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <Link to={`/blog/${articles[0].slug}`} className="block group">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors"></div>
              <img
                src={articles[0].image}
                alt={articles[0].title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-3xl text-center text-white p-6">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="text-lg text-white/90 mb-6">
                    {articles[0].description}
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {articles[0].author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {articles[0].readTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}`}
                className="group"
              >
                <div className="rounded-xl overflow-hidden border bg-card transition-all hover:shadow-md">
                  <div className="relative h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Inscreva-se na Newsletter</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Receba as últimas novidades e dicas sobre gestão de agendamentos
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="flex-1"
              />
              <Button>
                Inscrever
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
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