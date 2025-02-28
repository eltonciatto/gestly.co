import { Link } from 'react-router-dom';
import { CalendarDays, Scale, FileText, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Termos de Serviço</h1>
                <p className="text-muted-foreground">Última atualização: 08 de Janeiro de 2024</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="lead">
                Estes Termos de Serviço ("Termos") regem seu acesso e uso do Gestly, incluindo nosso website, APIs, aplicativos móveis e outros serviços oferecidos ("Serviços").
              </p>

              <div className="my-12 space-y-12">
                {/* Aceitação dos Termos */}
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">1. Aceitação dos Termos</h2>
                  </div>
                  <p>
                    Ao acessar ou usar os Serviços do Gestly, você concorda em ficar vinculado a estes Termos. Se você não concordar com qualquer parte destes Termos, não poderá acessar ou usar nossos Serviços.
                  </p>
                </section>

                {/* Conta e Registro */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Conta e Registro</h2>
                  <p className="mb-4">Para usar nossos Serviços, você deve:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Ter pelo menos 18 anos de idade</li>
                    <li>Completar o processo de registro</li>
                    <li>Fornecer informações precisas e completas</li>
                    <li>Manter suas informações atualizadas</li>
                    <li>Proteger suas credenciais de acesso</li>
                  </ul>
                </section>

                {/* Serviços e Pagamentos */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Serviços e Pagamentos</h2>
                  <div className="space-y-4">
                    <p>
                      O Gestly oferece diferentes planos de assinatura com recursos específicos. Os preços e condições estão disponíveis em nossa página de preços.
                    </p>
                    <p>
                      Ao contratar um plano pago, você concorda em:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Fornecer informações de pagamento válidas</li>
                      <li>Pagar pelos serviços contratados nos prazos estabelecidos</li>
                      <li>Manter suas informações de pagamento atualizadas</li>
                    </ul>
                  </div>
                </section>

                {/* Uso dos Serviços */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Uso dos Serviços</h2>
                  <p className="mb-4">Você concorda em usar os Serviços apenas para fins legais e de acordo com estes Termos. Você não deve:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violar leis ou regulamentos aplicáveis</li>
                    <li>Infringir direitos de propriedade intelectual</li>
                    <li>Enviar conteúdo malicioso ou spam</li>
                    <li>Tentar acessar áreas restritas do sistema</li>
                    <li>Revender ou sublicenciar o acesso aos Serviços</li>
                  </ul>
                </section>

                {/* Propriedade Intelectual */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Propriedade Intelectual</h2>
                  <p className="mb-4">
                    O Gestly e todo o conteúdo relacionado são protegidos por direitos autorais, marcas registradas e outras leis. Nossos Serviços são licenciados, não vendidos.
                  </p>
                  <p>
                    Você mantém todos os direitos sobre os dados que envia através dos Serviços.
                  </p>
                </section>

                {/* Privacidade e Segurança */}
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">6. Privacidade e Segurança</h2>
                  </div>
                  <p className="mb-4">
                    Nossa Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais.
                  </p>
                  <p>
                    Você é responsável por manter a segurança de sua conta e por todas as atividades que ocorrem sob ela.
                  </p>
                </section>

                {/* Limitação de Responsabilidade */}
                <section>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">7. Limitação de Responsabilidade</h2>
                  </div>
                  <p>
                    O Gestly não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de dados, lucros, receita ou vendas.
                  </p>
                </section>

                {/* Modificações */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Modificações</h2>
                  <p>
                    Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre alterações significativas por email ou através de nosso site.
                  </p>
                </section>

                {/* Rescisão */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Rescisão</h2>
                  <p className="mb-4">
                    Você pode cancelar sua conta a qualquer momento. O Gestly pode suspender ou encerrar sua conta por violação destes Termos.
                  </p>
                  <p>
                    Após o término, você terá 30 dias para exportar seus dados.
                  </p>
                </section>
              </div>

              {/* Contato */}
              <div className="bg-slate-50 p-6 rounded-lg mt-12">
                <h2 className="text-xl font-bold mb-4">Contato</h2>
                <p className="mb-4">
                  Se você tiver dúvidas sobre estes Termos, entre em contato:
                </p>
                <ul className="list-none space-y-2">
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:legal@gestly.co" className="text-primary hover:underline">
                      legal@gestly.co
                    </a>
                  </li>
                  <li>
                    <strong>Endereço:</strong> São Paulo, SP - Brasil
                  </li>
                </ul>
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