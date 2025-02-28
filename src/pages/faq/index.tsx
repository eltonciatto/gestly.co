import { Link } from 'react-router-dom';
import { CalendarDays, Search, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const categories = [
  {
    name: 'Primeiros Passos',
    questions: [
      {
        question: 'Como funciona o período de teste?',
        answer: 'Oferecemos 14 dias de teste grátis com acesso completo a todas as funcionalidades do plano Profissional. Não é necessário cartão de crédito para começar. Durante este período, você pode explorar todos os recursos e decidir qual plano melhor atende às suas necessidades.'
      },
      {
        question: 'Preciso instalar algum software?',
        answer: 'Não, o Gestly é uma plataforma 100% web (SaaS). Você só precisa de um navegador moderno e conexão com a internet para acessar todos os recursos. Não há necessidade de instalação ou configurações complexas.'
      },
      {
        question: 'Como faço para começar?',
        answer: 'Começar é simples: basta criar uma conta gratuita, configurar seu perfil de negócio e você já pode começar a usar. Oferecemos um assistente de configuração inicial e tutoriais para ajudar nos primeiros passos.'
      }
    ]
  },
  {
    name: 'Planos e Pagamentos',
    questions: [
      {
        question: 'Quais são as formas de pagamento aceitas?',
        answer: 'Aceitamos diversas formas de pagamento, incluindo cartão de crédito, PIX e boleto bancário. Para planos anuais, oferecemos um desconto de 20% sobre o valor mensal.'
      },
      {
        question: 'Posso mudar de plano depois?',
        answer: 'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são refletidas imediatamente e o valor é ajustado proporcionalmente.'
      },
      {
        question: 'Existe fidelidade ou multa por cancelamento?',
        answer: 'Não há fidelidade ou multas por cancelamento. Você pode cancelar sua assinatura a qualquer momento e terá acesso até o final do período pago.'
      }
    ]
  },
  {
    name: 'Funcionalidades',
    questions: [
      {
        question: 'Como funciona o sistema de notificações?',
        answer: 'O Gestly oferece notificações automáticas por WhatsApp, SMS e email. Você pode configurar lembretes de agendamento, confirmações e mensagens pós-atendimento, tudo de forma personalizada.'
      },
      {
        question: 'É possível integrar com outras ferramentas?',
        answer: 'Sim, oferecemos integrações nativas com Typebot, ManyChat, SendBot e WhatsApp Business. Além disso, disponibilizamos uma API REST completa e webhooks para integrações personalizadas.'
      },
      {
        question: 'Como funciona o programa de fidelidade?',
        answer: 'O programa de fidelidade permite criar regras de pontuação, definir recompensas e gerenciar resgates. Os clientes acumulam pontos automaticamente a cada agendamento realizado.'
      }
    ]
  },
  {
    name: 'Suporte',
    questions: [
      {
        question: 'Qual o horário de atendimento?',
        answer: 'Nosso suporte está disponível em horário comercial (9h às 18h, segunda a sexta) para todos os planos. Clientes dos planos Profissional e Empresarial têm acesso a canais prioritários.'
      },
      {
        question: 'Oferecem treinamento?',
        answer: 'Sim, oferecemos treinamento inicial gratuito para todos os planos. Clientes Empresariais têm acesso a treinamentos personalizados e consultoria dedicada.'
      },
      {
        question: 'Como faço para obter ajuda?',
        answer: 'Você pode obter ajuda através do nosso chat de suporte, email ou base de conhecimento. Também oferecemos tutoriais em vídeo e documentação detalhada.'
      }
    ]
  },
  {
    name: 'Segurança e Privacidade',
    questions: [
      {
        question: 'Como meus dados são protegidos?',
        answer: 'Utilizamos criptografia de ponta a ponta, servidores seguros e seguimos as melhores práticas de segurança. Todos os dados são armazenados em data centers certificados.'
      },
      {
        question: 'O Gestly está em conformidade com a LGPD?',
        answer: 'Sim, o Gestly está totalmente em conformidade com a Lei Geral de Proteção de Dados (LGPD). Implementamos todas as medidas necessárias para proteger os dados dos usuários.'
      },
      {
        question: 'Como faço backup dos meus dados?',
        answer: 'O Gestly realiza backups automáticos diários. Além disso, você pode exportar seus dados a qualquer momento através do painel administrativo.'
      }
    ]
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev => 
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
              Encontre respostas para as dúvidas mais comuns sobre o Gestly
            </p>
            <div className="mt-10">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar perguntas..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="border rounded-lg bg-white overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 text-left"
                        onClick={() => toggleQuestion(item.question)}
                      >
                        <span className="font-medium">{item.question}</span>
                        {expandedQuestions.includes(item.question) ? (
                          <Minus className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Plus className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      {expandedQuestions.includes(item.question) && (
                        <div className="px-4 pb-4">
                          <div className="pt-2 text-muted-foreground">
                            {item.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ainda tem dúvidas?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe está pronta para ajudar você
            </p>
            <Link to="/contact">
              <Button size="lg">
                Falar com Suporte
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