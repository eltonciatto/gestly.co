import { Link } from 'react-router-dom';
import { CalendarDays, Shield, Lock, Eye, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
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
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Política de Privacidade</h1>
                <p className="text-muted-foreground">Última atualização: 08 de Janeiro de 2024</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="lead">
                A sua privacidade é importante para nós. Esta política de privacidade descreve como o Gestly coleta, usa e protege suas informações pessoais.
              </p>

              <div className="my-12 space-y-12">
                {/* Coleta de Dados */}
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Coleta de Dados</h2>
                  </div>
                  <p className="mb-4">
                    Coletamos informações que você nos fornece diretamente ao:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Criar uma conta no Gestly</li>
                    <li>Utilizar nossos serviços</li>
                    <li>Entrar em contato com nosso suporte</li>
                    <li>Assinar nossa newsletter</li>
                  </ul>
                  <p className="mt-4">
                    Estas informações podem incluir seu nome, email, telefone, endereço e dados de pagamento.
                  </p>
                </section>

                {/* Uso de Dados */}
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Uso de Dados</h2>
                  </div>
                  <p className="mb-4">
                    Utilizamos suas informações para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Fornecer e manter nossos serviços</li>
                    <li>Processar pagamentos</li>
                    <li>Enviar notificações importantes</li>
                    <li>Melhorar nossos produtos e serviços</li>
                    <li>Prevenir fraudes e abusos</li>
                  </ul>
                </section>

                {/* Proteção de Dados */}
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Proteção de Dados</h2>
                  </div>
                  <p className="mb-4">
                    Implementamos medidas de segurança para proteger suas informações:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Criptografia de dados em trânsito e em repouso</li>
                    <li>Controles de acesso rigorosos</li>
                    <li>Monitoramento contínuo de segurança</li>
                    <li>Backups regulares</li>
                    <li>Atualizações de segurança constantes</li>
                  </ul>
                </section>

                {/* Compartilhamento de Dados */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Compartilhamento de Dados</h2>
                  <p className="mb-4">
                    Não vendemos suas informações pessoais. Compartilhamos dados apenas com:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provedores de serviços essenciais (processamento de pagamentos, hospedagem)</li>
                    <li>Autoridades quando legalmente requerido</li>
                    <li>Parceiros de integração com seu consentimento explícito</li>
                  </ul>
                </section>

                {/* Seus Direitos */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Seus Direitos</h2>
                  <p className="mb-4">
                    Você tem direito a:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Acessar seus dados pessoais</li>
                    <li>Corrigir dados imprecisos</li>
                    <li>Solicitar a exclusão de seus dados</li>
                    <li>Exportar seus dados</li>
                    <li>Retirar consentimentos previamente fornecidos</li>
                  </ul>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                  <p className="mb-4">
                    Utilizamos cookies para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Manter sua sessão ativa</li>
                    <li>Lembrar suas preferências</li>
                    <li>Analisar o uso do site</li>
                    <li>Melhorar a experiência do usuário</li>
                  </ul>
                  <p className="mt-4">
                    Você pode controlar o uso de cookies através das configurações do seu navegador.
                  </p>
                </section>

                {/* Contato */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">Contato</h2>
                  <p className="mb-4">
                    Para questões relacionadas à privacidade, entre em contato:
                  </p>
                  <ul className="list-none space-y-2">
                    <li>
                      <strong>Email:</strong>{' '}
                      <a href="mailto:privacidade@gestly.co" className="text-primary hover:underline">
                        privacidade@gestly.co
                      </a>
                    </li>
                    <li>
                      <strong>DPO:</strong> Elton Ciatto
                    </li>
                  </ul>
                </section>
              </div>

              {/* Atualizações */}
              <div className="bg-slate-50 p-6 rounded-lg mt-12">
                <h2 className="text-xl font-bold mb-4">Atualizações da Política</h2>
                <p className="mb-4">
                  Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através de nosso site ou por email.
                </p>
                <p className="text-sm text-muted-foreground">
                  Última atualização: 08 de Janeiro de 2024
                </p>
              </div>
            </div>
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