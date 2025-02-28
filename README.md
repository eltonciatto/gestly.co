# Gestly - Sistema de Gestão de Agendamentos

![Gestly Logo](https://raw.githubusercontent.com/eltonciatto/gestly/main/public/logo.svg)

O Gestly é uma plataforma SaaS (Software as a Service) completa para gestão de agendamentos, desenvolvida especialmente para o mercado brasileiro. Ideal para salões de beleza, barbearias, clínicas e qualquer negócio que trabalhe com agendamentos.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 20+
- NPM 9+
- Conta no Supabase (para banco de dados)
- Conta no Netlify (para deploy)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gestly.git
cd gestly
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha as variáveis no arquivo `.env`:
```env
# App URL
VITE_APP_URL=http://localhost:5173

# Supabase
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase

# SMTP (para envio de emails)
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=465
VITE_SMTP_USERNAME=seu-email@gmail.com
VITE_SMTP_PASSWORD=sua-senha-de-app
VITE_SMTP_SECURE=true
```

5. Execute as migrations:
```bash
npm run migrate
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📚 Documentação

### Estrutura do Projeto

```
gestly/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── lib/           # Funções utilitárias e configurações
│   ├── pages/         # Páginas da aplicação
│   └── types/         # Tipos TypeScript
├── packages/          # Pacotes monorepo
│   ├── api/          # API REST
│   └── auth/         # Autenticação
├── migrations/        # Migrations do banco
└── docs/             # Documentação
```

### Principais Funcionalidades

1. **Agendamentos**
   - Agendamento online 24/7
   - Confirmações automáticas
   - Lembretes por WhatsApp/Email
   - Bloqueio de horários

2. **Clientes**
   - Cadastro completo
   - Histórico de atendimentos
   - Tags e observações
   - Programa de fidelidade

3. **Profissionais**
   - Gestão de agenda
   - Controle de comissões
   - Metas e bonificações
   - Avaliações

4. **Relatórios**
   - Dashboard em tempo real
   - Métricas de desempenho
   - Relatórios financeiros
   - Análise de ocupação

### API REST

A API do Gestly segue os padrões REST e está disponível em `https://api.gestly.co/v1`.

#### Autenticação

Todas as requisições devem incluir o token JWT no header `Authorization`:

```bash
curl -X GET https://api.gestly.co/v1/appointments \
  -H "Authorization: Bearer seu-token-jwt"
```

#### Endpoints Principais

```typescript
// Agendamentos
GET    /appointments      # Lista agendamentos
POST   /appointments      # Cria agendamento
GET    /appointments/:id  # Detalhes do agendamento
PATCH  /appointments/:id  # Atualiza agendamento
DELETE /appointments/:id  # Remove agendamento

// Clientes
GET    /customers        # Lista clientes
POST   /customers        # Cria cliente
GET    /customers/:id    # Detalhes do cliente
PATCH  /customers/:id    # Atualiza cliente
DELETE /customers/:id    # Remove cliente

// Serviços
GET    /services         # Lista serviços
POST   /services         # Cria serviço
GET    /services/:id     # Detalhes do serviço
PATCH  /services/:id     # Atualiza serviço
DELETE /services/:id     # Remove serviço
```

### Webhooks

Configure webhooks para receber notificações em tempo real:

```typescript
// Eventos disponíveis
- appointment.create  # Novo agendamento
- appointment.update  # Atualização de agendamento
- customer.create    # Novo cliente
- review.create      # Nova avaliação

// Formato do payload
{
  "id": "evt_123",
  "type": "appointment.create",
  "created_at": "2024-01-01T10:00:00Z",
  "data": {
    // Dados específicos do evento
  }
}
```

### Integrações

O Gestly oferece integrações nativas com:

- WhatsApp Business API
- Google Calendar
- Typebot
- ManyChat
- SendBot

## 🧪 Testes

Execute os testes:

```bash
# Testes unitários
npm run test

# Cobertura de testes
npm run test:coverage
```

## 🚢 Deploy

### Netlify

1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Use os seguintes comandos:
   - Build: `npm run build`
   - Publish directory: `dist`

### Docker

```bash
# Build da imagem
docker build -t gestly .

# Executar container
docker run -p 5173:5173 gestly
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guia de Contribuição

- Siga o estilo de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos
- Mantenha o PR focado em uma única funcionalidade

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Elton Ciatto
- GitHub: [@eltonciatto](https://github.com/eltonciatto)
- LinkedIn: [Elton Ciatto](https://linkedin.com/in/eltonciatto)

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Netlify](https://www.netlify.com/)