// Email template types
export type EmailTemplate = {
  subject: string;
  html: (data: Record<string, string>) => string;
}

// Base styles for all emails
const baseStyles = `
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: #1f2937;
  }
  .button {
    display: inline-block;
    padding: 12px 24px;
    background-color: #2563eb;
    color: white !important;
    text-decoration: none;
    border-radius: 6px;
    font-family: system-ui, -apple-system, sans-serif;
    margin: 16px 0;
  }
  .footer {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    font-size: 14px;
    color: #6b7280;
  }
  .logo {
    margin-bottom: 24px;
  }
`;

// Email templates
export const templates: Record<string, EmailTemplate> = {
  MAGIC_LINK: {
    subject: 'Link de Acesso - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Link de Acesso</h2>
          <p>Olá ${data.name},</p>
          <p>Clique no botão abaixo para acessar sua conta:</p>
          <a href="${data.link}" class="button">
            Acessar Conta
          </a>
          <p>Se você não solicitou este acesso, ignore este email.</p>
          <div class="footer">
            <p>Este link expira em 24 horas.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  WELCOME: {
    subject: 'Bem-vindo ao Gestly!',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Bem-vindo ao Gestly!</h2>
          <p>Olá ${data.name},</p>
          <p>Sua conta foi criada com sucesso. Estamos muito felizes em ter você conosco!</p>
          <p>Acesse sua conta para começar a usar o Gestly:</p>
          <a href="${data.link}" class="button">
            Acessar Conta
          </a>
          <div class="footer">
            <p>Se precisar de ajuda, entre em contato com nosso suporte.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  PASSWORD_RESET: {
    subject: 'Redefinição de Senha - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Redefinição de Senha</h2>
          <p>Olá ${data.name},</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${data.link}" class="button">
            Redefinir Senha
          </a>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
          <div class="footer">
            <p>Este link expira em 1 hora.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  APPOINTMENT_CONFIRMATION: {
    subject: 'Agendamento Confirmado - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Agendamento Confirmado</h2>
          <p>Olá ${data.name},</p>
          <p>Seu agendamento foi confirmado com sucesso!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${data.date}</p>
            <p><strong>Horário:</strong> ${data.time}</p>
            <p><strong>Profissional:</strong> ${data.professional}</p>
          </div>
          <p>Para remarcar ou cancelar seu agendamento, acesse sua conta:</p>
          <a href="${data.link}" class="button">
            Gerenciar Agendamento
          </a>
          <div class="footer">
            <p>Caso precise remarcar, entre em contato com antecedência.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  APPOINTMENT_REMINDER: {
    subject: 'Lembrete de Agendamento - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Lembrete de Agendamento</h2>
          <p>Olá ${data.name},</p>
          <p>Não esqueça do seu agendamento amanhã!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${data.date}</p>
            <p><strong>Horário:</strong> ${data.time}</p>
            <p><strong>Profissional:</strong> ${data.professional}</p>
          </div>
          <p>Precisa remarcar?</p>
          <a href="${data.link}" class="button">
            Gerenciar Agendamento
          </a>
          <div class="footer">
            <p>Caso não possa comparecer, entre em contato com antecedência.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  APPOINTMENT_CANCELLED: {
    subject: 'Agendamento Cancelado - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Agendamento Cancelado</h2>
          <p>Olá ${data.name},</p>
          <p>Seu agendamento foi cancelado conforme solicitado.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${data.date}</p>
            <p><strong>Horário:</strong> ${data.time}</p>
          </div>
          <p>Deseja fazer um novo agendamento?</p>
          <a href="${data.link}" class="button">
            Agendar Novamente
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  BIRTHDAY: {
    subject: 'Feliz Aniversário! 🎉',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Feliz Aniversário, ${data.name}! 🎉</h2>
          <p>Queremos desejar um feliz aniversário e agradecer por ser nosso cliente!</p>
          <p>Como presente especial, preparamos uma surpresa para você:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Presente:</strong> ${data.gift}</p>
            <p><strong>Validade:</strong> ${data.validity}</p>
          </div>
          <a href="${data.link}" class="button">
            Resgatar Presente
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  LOYALTY_POINTS: {
    subject: 'Pontos de Fidelidade Creditados! ⭐',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Pontos Creditados!</h2>
          <p>Olá ${data.name},</p>
          <p>Você acabou de ganhar pontos em nosso programa de fidelidade!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Pontos ganhos:</strong> ${data.points}</p>
            <p><strong>Total de pontos:</strong> ${data.total_points}</p>
            <p><strong>Próxima recompensa:</strong> ${data.next_reward}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Recompensas
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  REWARD_AVAILABLE: {
    subject: 'Você Desbloqueou uma Recompensa! 🎁',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Recompensa Desbloqueada!</h2>
          <p>Olá ${data.name},</p>
          <p>Você atingiu os pontos necessários e desbloqueou uma recompensa!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Recompensa:</strong> ${data.reward}</p>
            <p><strong>Validade:</strong> ${data.validity}</p>
          </div>
          <a href="${data.link}" class="button">
            Resgatar Recompensa
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  COMMISSION_PAYMENT: {
    subject: 'Pagamento de Comissão - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Pagamento de Comissão</h2>
          <p>Olá ${data.name},</p>
          <p>Seu pagamento de comissão foi processado com sucesso!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Período:</strong> ${data.period}</p>
            <p><strong>Valor:</strong> ${data.amount}</p>
            <p><strong>Data do pagamento:</strong> ${data.payment_date}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Detalhes
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  REVIEW_REQUEST: {
    subject: 'Como foi sua experiência? - Gestly',
    html: (data) => `
  },

  TEAM_INVITE: {
    subject: 'Convite para Equipe - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Convite para Equipe</h2>
          <p>Olá,</p>
          <p>${data.business_name} convidou você para fazer parte da equipe!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Função:</strong> ${data.role}</p>
            <p><strong>Empresa:</strong> ${data.business_name}</p>
          </div>
          <a href="${data.link}" class="button">
            Aceitar Convite
          </a>
          <div class="footer">
            <p>Este convite expira em 7 dias.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  LOW_STOCK_ALERT: {
    subject: 'Alerta de Estoque Baixo - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Estoque</h2>
          <p>Olá ${data.name},</p>
          <p>Os seguintes produtos estão com estoque baixo:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.products}
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Estoque
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  FINANCIAL_REPORT: {
    subject: 'Relatório Financeiro - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Relatório Financeiro</h2>
          <p>Olá ${data.name},</p>
          <p>Segue o relatório financeiro do período ${data.period}:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Receita Total:</strong> ${data.revenue}</p>
            <p><strong>Despesas:</strong> ${data.expenses}</p>
            <p><strong>Lucro Líquido:</strong> ${data.profit}</p>
            <p><strong>Ticket Médio:</strong> ${data.average_ticket}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Relatório Completo
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  API_USAGE_ALERT: {
    subject: 'Alerta de Uso da API - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Uso da API</h2>
          <p>Olá ${data.name},</p>
          <p>Você atingiu ${data.usage_percentage}% do seu limite de requisições API.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Requisições Utilizadas:</strong> ${data.requests_used}</p>
            <p><strong>Limite do Plano:</strong> ${data.plan_limit}</p>
            <p><strong>Período:</strong> ${data.period}</p>
          </div>
          <a href="${data.link}" class="button">
            Gerenciar API
          </a>
          <div class="footer">
            <p>Considere fazer upgrade do seu plano para aumentar os limites.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SYSTEM_NOTIFICATION: {
    subject: 'Notificação do Sistema - Gestly',
    html: (data) => `
  },

  INVENTORY_EXPIRATION: {
    subject: 'Produtos Próximos ao Vencimento - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Vencimento</h2>
          <p>Olá ${data.name},</p>
          <p>Os seguintes produtos estão próximos ao vencimento:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.products}
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Produtos
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SERVICE_UPDATE: {
    subject: 'Atualização de Serviço - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Atualização de Serviço</h2>
          <p>Olá ${data.name},</p>
          <p>Houve uma atualização em um serviço que você costuma utilizar:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service_name}</p>
            <p><strong>Alteração:</strong> ${data.change_description}</p>
            <p><strong>Válido a partir de:</strong> ${data.valid_from}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Detalhes
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  GOAL_ACHIEVEMENT: {
    subject: 'Meta Atingida! 🎯 - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Parabéns! Meta Atingida! 🎯</h2>
          <p>Olá ${data.name},</p>
          <p>Você atingiu uma meta importante!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Meta:</strong> ${data.goal_description}</p>
            <p><strong>Resultado:</strong> ${data.achievement}</p>
            <p><strong>Bônus:</strong> ${data.bonus}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Detalhes
          </a>
          <div class="footer">
            <p>Continue com o ótimo trabalho!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  PAYMENT_RECEIPT: {
    subject: 'Recibo de Pagamento - Gestly',
    html: (data) => `
  },

  APPOINTMENT_CANCELLATION: {
    subject: 'Agendamento Cancelado - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Agendamento Cancelado</h2>
          <p>Olá ${data.name},</p>
          <div style="background: #fee2e2; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p>Seu agendamento foi cancelado:</p>
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${data.date}</p>
            <p><strong>Horário:</strong> ${data.time}</p>
            ${data.cancellation_reason ? `<p><strong>Motivo:</strong> ${data.cancellation_reason}</p>` : ''}
          </div>
          <p>Se desejar, você pode fazer um novo agendamento:</p>
          <a href="${data.reschedule_link}" class="button">
            Reagendar
          </a>
          <div class="footer">
            <p>Pedimos desculpas por qualquer inconveniente.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SERVICE_PROMOTION: {
    subject: '${data.promotion_title} - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>${data.promotion_title}</h2>
          <p>Olá ${data.name},</p>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p>${data.promotion_description}</p>
            ${data.discount ? `
              <p style="font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin: 16px 0;">
                ${data.discount}
              </p>
            ` : ''}
            <p><strong>Válido até:</strong> ${data.valid_until}</p>
          </div>
          <a href="${data.booking_link}" class="button">
            Aproveitar Oferta
          </a>
          <div class="footer">
            <p>Promoção sujeita à disponibilidade.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  CUSTOMER_BIRTHDAY: {
    subject: 'Feliz Aniversário! 🎉 - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Feliz Aniversário, ${data.name}! 🎉</h2>
          <p>Queremos celebrar esta data especial com você!</p>
          <div style="background: #fdf4ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p>Como presente, preparamos uma surpresa especial:</p>
            <p style="font-size: 24px; font-weight: bold; color: #c026d3; text-align: center; margin: 16px 0;">
              ${data.birthday_offer}
            </p>
            <p><strong>Válido até:</strong> ${data.valid_until}</p>
          </div>
          <a href="${data.booking_link}" class="button">
            Aproveitar Presente
          </a>
          <div class="footer">
            <p>Desejamos um dia incrível!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  ACCOUNT_SECURITY: {
    subject: 'Alerta de Segurança - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Segurança</h2>
          <p>Olá ${data.name},</p>
          <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Detectamos:</strong> ${data.alert_message}</p>
            <p><strong>Data:</strong> ${data.alert_date}</p>
            <p><strong>Localização:</strong> ${data.location}</p>
          </div>
          <p>Se você não reconhece esta atividade, recomendamos:</p>
          <a href="${data.security_link}" class="button">
            Verificar Conta
          </a>
          <div class="footer">
            <p>Sua segurança é nossa prioridade.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SUBSCRIPTION_STATUS: {
    subject: 'Status da Assinatura - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>${data.status_title}</h2>
          <p>Olá ${data.name},</p>
          <div style="background: ${
            data.status === 'active' ? '#f0fdf4' :
            data.status === 'expiring' ? '#fff7ed' :
            data.status === 'expired' ? '#fef2f2' :
            '#f3f4f6'
          }; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p>${data.status_message}</p>
            ${data.expiry_date ? `<p><strong>Data de Expiração:</strong> ${data.expiry_date}</p>` : ''}
            ${data.next_payment ? `<p><strong>Próximo Pagamento:</strong> ${data.next_payment}</p>` : ''}
          </div>
          <a href="${data.action_link}" class="button">
            ${data.action_text || 'Gerenciar Assinatura'}
          </a>
          <div class="footer">
            <p>Precisa de ajuda? Entre em contato com nosso suporte.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Recibo de Pagamento</h2>
          <p>Olá ${data.name},</p>
          <p>Seu pagamento foi processado com sucesso!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Valor:</strong> ${data.amount}</p>
            <p><strong>Data:</strong> ${data.payment_date}</p>
            <p><strong>Método:</strong> ${data.payment_method}</p>
            <p><strong>Número do Recibo:</strong> ${data.receipt_number}</p>
          </div>
          <a href="${data.link}" class="button">
            Download do Recibo
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  INTEGRATION_STATUS: {
    subject: 'Status da Integração - Gestly',
    html: (data) => `
  },

  SUBSCRIPTION_STATUS: {
    subject: 'Status da Assinatura - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Status da Assinatura</h2>
          <p>Olá ${data.name},</p>
          <p>Houve uma atualização no status da sua assinatura:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Plano:</strong> ${data.plan_name}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Próxima Cobrança:</strong> ${data.next_billing_date}</p>
            <p><strong>Valor:</strong> ${data.amount}</p>
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Assinatura
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  TEAM_PERFORMANCE: {
    subject: 'Relatório de Desempenho da Equipe - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Relatório de Desempenho</h2>
          <p>Olá ${data.name},</p>
          <p>Segue o relatório de desempenho da equipe do período ${data.period}:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Taxa de Ocupação:</strong> ${data.occupancy_rate}</p>
            <p><strong>Satisfação dos Clientes:</strong> ${data.customer_satisfaction}</p>
            <p><strong>Faturamento Total:</strong> ${data.total_revenue}</p>
            <p><strong>Metas Atingidas:</strong> ${data.goals_achieved}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Relatório Completo
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  FEEDBACK_RESPONSE: {
    subject: 'Resposta ao seu Feedback - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Resposta ao seu Feedback</h2>
          <p>Olá ${data.name},</p>
          <p>Agradecemos seu feedback sobre o atendimento do dia ${data.service_date}.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Seu Comentário:</strong></p>
            <p style="font-style: italic;">${data.customer_feedback}</p>
            <p><strong>Nossa Resposta:</strong></p>
            <p>${data.response}</p>
          </div>
          <a href="${data.link}" class="button">
            Ver Detalhes
          </a>
          <div class="footer">
            <p>Sua opinião é muito importante para nós!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  APPOINTMENT_SERIES: {
    subject: 'Série de Agendamentos Confirmada - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Série de Agendamentos</h2>
          <p>Olá ${data.name},</p>
          <p>Seus agendamentos recorrentes foram confirmados:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Profissional:</strong> ${data.professional}</p>
            <p><strong>Frequência:</strong> ${data.frequency}</p>
            <p><strong>Datas:</strong></p>
            ${data.dates}
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Agendamentos
          </a>
          <div class="footer">
            <p>Você receberá lembretes antes de cada atendimento.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  CUSTOM_CAMPAIGN: {
    subject: '${data.subject}',
    html: (data) => `
  },

  INVENTORY_ALERT: {
    subject: 'Alerta de Estoque - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Estoque</h2>
          <p>Olá ${data.name},</p>
          <p>${data.alert_type === 'low' ? 'Produtos com estoque baixo:' : 'Produtos vencendo em breve:'}</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.products_list}
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Estoque
          </a>
          <div class="footer">
            <p>Recomendamos verificar estes itens o quanto antes.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  MAINTENANCE_NOTIFICATION: {
    subject: 'Manutenção Programada - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Manutenção Programada</h2>
          <p>Olá ${data.name},</p>
          <p>Informamos que haverá uma manutenção programada em nossos sistemas:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Data:</strong> ${data.maintenance_date}</p>
            <p><strong>Horário:</strong> ${data.maintenance_time}</p>
            <p><strong>Duração Estimada:</strong> ${data.duration}</p>
            <p><strong>Impacto:</strong> ${data.impact_description}</p>
          </div>
          <p>Durante este período, alguns serviços podem ficar indisponíveis.</p>
          <a href="${data.link}" class="button">
            Mais Informações
          </a>
          <div class="footer">
            <p>Agradecemos sua compreensão.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SHIFT_SCHEDULE: {
    subject: 'Atualização de Escala - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Nova Escala de Trabalho</h2>
          <p>Olá ${data.name},</p>
          <p>Sua escala de trabalho foi atualizada:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Período:</strong> ${data.period}</p>
            <p><strong>Horários:</strong></p>
            ${data.schedule_details}
          </div>
          <a href="${data.link}" class="button">
            Ver Escala Completa
          </a>
          <div class="footer">
            <p>Em caso de conflitos, entre em contato com seu supervisor.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  TRAINING_REMINDER: {
    subject: 'Lembrete de Treinamento - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Treinamento Agendado</h2>
          <p>Olá ${data.name},</p>
          <p>Você tem um treinamento agendado:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Treinamento:</strong> ${data.training_name}</p>
            <p><strong>Data:</strong> ${data.training_date}</p>
            <p><strong>Horário:</strong> ${data.training_time}</p>
            <p><strong>Instrutor:</strong> ${data.instructor}</p>
            ${data.location ? `<p><strong>Local:</strong> ${data.location}</p>` : ''}
          </div>
          <a href="${data.link}" class="button">
            Confirmar Presença
          </a>
          <div class="footer">
            <p>Este treinamento é importante para sua evolução profissional.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  CUSTOMER_REACTIVATION: {
    subject: 'Sentimos sua Falta! - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Sentimos sua Falta!</h2>
          <p>Olá ${data.name},</p>
          <p>Notamos que faz um tempo desde seu último agendamento conosco.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Último Atendimento:</strong> ${data.last_visit}</p>
            <p><strong>Oferta Especial:</strong> ${data.special_offer}</p>
            <p><strong>Válido até:</strong> ${data.offer_validity}</p>
          </div>
          <a href="${data.link}" class="button">
            Agendar Agora
          </a>
          <div class="footer">
            <p>Estamos com novidades esperando por você!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  },

  INVENTORY_ALERT: {
    subject: 'Alerta de Estoque - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Estoque</h2>
          <p>Olá ${data.name},</p>
          <p>${data.alert_type === 'low' ? 'Produtos com estoque baixo:' : 'Produtos vencendo em breve:'}</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.products_list}
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Estoque
          </a>
          <div class="footer">
            <p>Recomendamos verificar estes itens o quanto antes.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  MAINTENANCE_NOTIFICATION: {
    subject: 'Manutenção Programada - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Manutenção Programada</h2>
          <p>Olá ${data.name},</p>
          <p>Informamos que haverá uma manutenção programada em nossos sistemas:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Data:</strong> ${data.maintenance_date}</p>
            <p><strong>Horário:</strong> ${data.maintenance_time}</p>
            <p><strong>Duração Estimada:</strong> ${data.duration}</p>
            <p><strong>Impacto:</strong> ${data.impact_description}</p>
          </div>
          <p>Durante este período, alguns serviços podem ficar indisponíveis.</p>
          <a href="${data.link}" class="button">
            Mais Informações
          </a>
          <div class="footer">
            <p>Agradecemos sua compreensão.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SHIFT_SCHEDULE: {
    subject: 'Atualização de Escala - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Nova Escala de Trabalho</h2>
          <p>Olá ${data.name},</p>
          <p>Sua escala de trabalho foi atualizada:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Período:</strong> ${data.period}</p>
            <p><strong>Horários:</strong></p>
            ${data.schedule_details}
          </div>
          <a href="${data.link}" class="button">
            Ver Escala Completa
          </a>
          <div class="footer">
            <p>Em caso de conflitos, entre em contato com seu supervisor.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  TRAINING_REMINDER: {
    subject: 'Lembrete de Treinamento - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Treinamento Agendado</h2>
          <p>Olá ${data.name},</p>
          <p>Você tem um treinamento agendado:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Treinamento:</strong> ${data.training_name}</p>
            <p><strong>Data:</strong> ${data.training_date}</p>
            <p><strong>Horário:</strong> ${data.training_time}</p>
            <p><strong>Instrutor:</strong> ${data.instructor}</p>
            ${data.location ? `<p><strong>Local:</strong> ${data.location}</p>` : ''}
          </div>
          <a href="${data.link}" class="button">
            Confirmar Presença
          </a>
          <div class="footer">
            <p>Este treinamento é importante para sua evolução profissional.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  CUSTOMER_REACTIVATION: {
    subject: 'Sentimos sua Falta! - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Sentimos sua Falta!</h2>
          <p>Olá ${data.name},</p>
          <p>Notamos que faz um tempo desde seu último agendamento conosco.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Último Atendimento:</strong> ${data.last_visit}</p>
            <p><strong>Oferta Especial:</strong> ${data.special_offer}</p>
            <p><strong>Válido até:</strong> ${data.offer_validity}</p>
          </div>
          <a href="${data.link}" class="button">
            Agendar Agora
          </a>
          <div class="footer">
            <p>Estamos com novidades esperando por você!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  },

  INVENTORY_ALERT: {
    subject: 'Alerta de Estoque - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Alerta de Estoque</h2>
          <p>Olá ${data.name},</p>
          <p>${data.alert_type === 'low' ? 'Produtos com estoque baixo:' : 'Produtos vencendo em breve:'}</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.products_list}
          </div>
          <a href="${data.link}" class="button">
            Gerenciar Estoque
          </a>
          <div class="footer">
            <p>Recomendamos verificar estes itens o quanto antes.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  MAINTENANCE_NOTIFICATION: {
    subject: 'Manutenção Programada - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Manutenção Programada</h2>
          <p>Olá ${data.name},</p>
          <p>Informamos que haverá uma manutenção programada em nossos sistemas:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Data:</strong> ${data.maintenance_date}</p>
            <p><strong>Horário:</strong> ${data.maintenance_time}</p>
            <p><strong>Duração Estimada:</strong> ${data.duration}</p>
            <p><strong>Impacto:</strong> ${data.impact_description}</p>
          </div>
          <p>Durante este período, alguns serviços podem ficar indisponíveis.</p>
          <a href="${data.link}" class="button">
            Mais Informações
          </a>
          <div class="footer">
            <p>Agradecemos sua compreensão.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  SHIFT_SCHEDULE: {
    subject: 'Atualização de Escala - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Nova Escala de Trabalho</h2>
          <p>Olá ${data.name},</p>
          <p>Sua escala de trabalho foi atualizada:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Período:</strong> ${data.period}</p>
            <p><strong>Horários:</strong></p>
            ${data.schedule_details}
          </div>
          <a href="${data.link}" class="button">
            Ver Escala Completa
          </a>
          <div class="footer">
            <p>Em caso de conflitos, entre em contato com seu supervisor.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  TRAINING_REMINDER: {
    subject: 'Lembrete de Treinamento - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Treinamento Agendado</h2>
          <p>Olá ${data.name},</p>
          <p>Você tem um treinamento agendado:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Treinamento:</strong> ${data.training_name}</p>
            <p><strong>Data:</strong> ${data.training_date}</p>
            <p><strong>Horário:</strong> ${data.training_time}</p>
            <p><strong>Instrutor:</strong> ${data.instructor}</p>
            ${data.location ? `<p><strong>Local:</strong> ${data.location}</p>` : ''}
          </div>
          <a href="${data.link}" class="button">
            Confirmar Presença
          </a>
          <div class="footer">
            <p>Este treinamento é importante para sua evolução profissional.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  CUSTOMER_REACTIVATION: {
    subject: 'Sentimos sua Falta! - Gestly',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Sentimos sua Falta!</h2>
          <p>Olá ${data.name},</p>
          <p>Notamos que faz um tempo desde seu último agendamento conosco.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Último Atendimento:</strong> ${data.last_visit}</p>
            <p><strong>Oferta Especial:</strong> ${data.special_offer}</p>
            <p><strong>Válido até:</strong> ${data.offer_validity}</p>
          </div>
          <a href="${data.link}" class="button">
            Agendar Agora
          </a>
          <div class="footer">
            <p>Estamos com novidades esperando por você!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>${data.title}</h2>
          <p>Olá ${data.name},</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.content}
          </div>
          ${data.link ? `
            <a href="${data.link}" class="button">
              ${data.button_text || 'Saiba Mais'}
            </a>
          ` : ''}
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Status da Integração</h2>
          <p>Olá ${data.name},</p>
          <p>Houve uma mudança no status da sua integração:</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Integração:</strong> ${data.integration_name}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Detalhes:</strong> ${data.details}</p>
          </div>
          <a href="${data.link}" class="button">
            Verificar Integração
          </a>
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>${data.title}</h2>
          <p>Olá ${data.name},</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${data.message}
          </div>
          ${data.link ? `
            <a href="${data.link}" class="button">
              ${data.action_text || 'Saiba Mais'}
            </a>
          ` : ''}
          <div class="footer">
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Como foi sua experiência?</h2>
          <p>Olá ${data.name},</p>
          <p>Gostaríamos de saber como foi seu atendimento com ${data.professional}.</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${data.date}</p>
          </div>
          <a href="${data.link}" class="button">
            Avaliar Atendimento
          </a>
          <div class="footer">
            <p>Sua opinião é muito importante para nós!</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="${data.logo || import.meta.env.VITE_APP_URL + '/logo.svg'}" alt="Gestly" height="32">
          </div>
          <h2>Agendamento Confirmado</h2>
          <p>Olá ${data.name},</p>
          <p>Seu agendamento foi confirmado com sucesso!</p>
          <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${data.date}</p>
            <p><strong>Horário:</strong> ${data.time}</p>
            <p><strong>Profissional:</strong> ${data.professional}</p>
          </div>
          <p>Para remarcar ou cancelar seu agendamento, acesse sua conta:</p>
          <a href="${data.link}" class="button">
            Gerenciar Agendamento
          </a>
          <div class="footer">
            <p>Caso precise remarcar, entre em contato com antecedência.</p>
            <p>Gestly - Gestão de Agendamentos</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Helper function to validate template data
export function validateTemplateData(template: string, data: Record<string, string>): boolean {
  const requiredFields: Record<string, string[]> = {
    MAGIC_LINK: ['name', 'link'],
    WELCOME: ['name', 'link'],
    PASSWORD_RESET: ['name', 'link'],
    APPOINTMENT_CONFIRMATION: ['name', 'service', 'date', 'time', 'professional', 'link'],
    APPOINTMENT_REMINDER: ['name', 'service', 'date', 'time', 'professional', 'link'],
    APPOINTMENT_CANCELLED: ['name', 'service', 'date', 'time', 'link'],
    BIRTHDAY: ['name', 'gift', 'validity', 'link'],
    LOYALTY_POINTS: ['name', 'points', 'total_points', 'next_reward', 'link'],
    REWARD_AVAILABLE: ['name', 'reward', 'validity', 'link'],
    COMMISSION_PAYMENT: ['name', 'period', 'amount', 'payment_date', 'link'],
    REVIEW_REQUEST: ['name', 'professional', 'service', 'date', 'link'],
    TEAM_INVITE: ['business_name', 'role', 'link'],
    LOW_STOCK_ALERT: ['name', 'products', 'link'],
    FINANCIAL_REPORT: ['name', 'period', 'revenue', 'expenses', 'profit', 'average_ticket', 'link'],
    API_USAGE_ALERT: ['name', 'usage_percentage', 'requests_used', 'plan_limit', 'period', 'link'],
    SYSTEM_NOTIFICATION: ['name', 'title', 'message'],
    INVENTORY_EXPIRATION: ['name', 'products', 'link'],
    SERVICE_UPDATE: ['name', 'service_name', 'change_description', 'valid_from', 'link'],
    GOAL_ACHIEVEMENT: ['name', 'goal_description', 'achievement', 'bonus', 'link'],
    PAYMENT_RECEIPT: ['name', 'amount', 'payment_date', 'payment_method', 'receipt_number', 'link'],
    INTEGRATION_STATUS: ['name', 'integration_name', 'status', 'details', 'link']
    SUBSCRIPTION_STATUS: ['name', 'plan_name', 'status', 'next_billing_date', 'amount', 'link'],
    TEAM_PERFORMANCE: ['name', 'period', 'occupancy_rate', 'customer_satisfaction', 'total_revenue', 'goals_achieved', 'link'],
    FEEDBACK_RESPONSE: ['name', 'service_date', 'customer_feedback', 'response', 'link'],
    APPOINTMENT_SERIES: ['name', 'service', 'professional', 'frequency', 'dates', 'link'],
    CUSTOM_CAMPAIGN: ['name', 'subject', 'title', 'content']
    INVENTORY_ALERT: ['name', 'alert_type', 'products_list', 'link'],
    MAINTENANCE_NOTIFICATION: ['name', 'maintenance_date', 'maintenance_time', 'duration', 'impact_description', 'link'],
    SHIFT_SCHEDULE: ['name', 'period', 'schedule_details', 'link'],
    TRAINING_REMINDER: ['name', 'training_name', 'training_date', 'training_time', 'instructor', 'link'],
    CUSTOMER_REACTIVATION: ['name', 'last_visit', 'special_offer', 'offer_validity', 'link']
    INVENTORY_ALERT: ['name', 'alert_type', 'products_list', 'link'],
    MAINTENANCE_NOTIFICATION: ['name', 'maintenance_date', 'maintenance_time', 'duration', 'impact_description', 'link'],
    SHIFT_SCHEDULE: ['name', 'period', 'schedule_details', 'link'],
    TRAINING_REMINDER: ['name', 'training_name', 'training_date', 'training_time', 'instructor', 'link'],
    CUSTOMER_REACTIVATION: ['name', 'last_visit', 'special_offer', 'offer_validity', 'link']
    INVENTORY_ALERT: ['name', 'alert_type', 'products_list', 'link'],
    MAINTENANCE_NOTIFICATION: ['name', 'maintenance_date', 'maintenance_time', 'duration', 'impact_description', 'link'],
    SHIFT_SCHEDULE: ['name', 'period', 'schedule_details', 'link'],
    TRAINING_REMINDER: ['name', 'training_name', 'training_date', 'training_time', 'instructor', 'link'],
    CUSTOMER_REACTIVATION: ['name', 'last_visit', 'special_offer', 'offer_validity', 'link']
    APPOINTMENT_CANCELLATION: ['name', 'service', 'date', 'time', 'reschedule_link'],
    SERVICE_PROMOTION: ['name', 'promotion_title', 'promotion_description', 'valid_until', 'booking_link'],
    CUSTOMER_BIRTHDAY: ['name', 'birthday_offer', 'valid_until', 'booking_link'],
    ACCOUNT_SECURITY: ['name', 'alert_message', 'alert_date', 'location', 'security_link'],
    SUBSCRIPTION_STATUS: ['name', 'status_title', 'status_message', 'status', 'action_link']
  };

  const fields = requiredFields[template];
  if (!fields) return false;

  return fields.every(field => !!data[field]);
}