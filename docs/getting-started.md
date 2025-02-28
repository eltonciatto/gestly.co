# Primeiros Passos com o Gestly

## Introdução

O Gestly é uma plataforma SaaS completa para gestão de agendamentos, desenvolvida especialmente para o mercado brasileiro. Este guia irá ajudá-lo a começar a usar o Gestly.

## Requisitos

- Node.js 20+
- NPM 9+
- Conta no Supabase
- Conta no Netlify

## Configuração Inicial

### 1. Configuração do Ambiente

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/gestly.git
cd gestly
npm install
```

### 2. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure as seguintes variáveis:

```env
# App URL
VITE_APP_URL=http://localhost:5173

# Supabase
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase

# SMTP
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=465
VITE_SMTP_USERNAME=seu-email@gmail.com
VITE_SMTP_PASSWORD=sua-senha-de-app
VITE_SMTP_SECURE=true
```

### 3. Banco de Dados

Execute as migrations do Supabase:

```bash
npm run migrate
```

### 4. Desenvolvimento Local

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Estrutura do Projeto

```
gestly/
├── src/
│   ├── components/     # Componentes React
│   ├── lib/           # Funções utilitárias
│   ├── pages/         # Páginas da aplicação
│   └── types/         # Tipos TypeScript
├── packages/
│   ├── api/          # API REST
│   └── auth/         # Autenticação
├── migrations/       # Migrations do banco
└── docs/            # Documentação
```

## Funcionalidades Principais

### Agendamentos

```typescript
// Criar agendamento
const appointment = await createAppointment({
  customer_id: "123",
  service_id: "456",
  start_time: "2024-01-01T10:00:00Z",
  notes: "Observações"
});

// Verificar disponibilidade
const slots = await checkAvailability({
  date: "2024-01-01",
  service_id: "456"
});
```

### Notificações

```typescript
// Enviar lembrete
await sendNotification({
  type: "appointment_reminder",
  customer_id: "123",
  appointment_id: "789",
  channel: "whatsapp"
});
```

### Integrações

```typescript
// Configurar webhook
await setupWebhook({
  url: "https://seu-dominio.com/webhook",
  events: ["appointment.create", "appointment.update"],
  secret: "seu-secret"
});
```

## Customização

### Temas

O Gestly usa TailwindCSS para estilização. Você pode customizar as cores e outros estilos no arquivo `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          // ...
        },
        // ...
      }
    }
  }
}
```

### Componentes

Todos os componentes são baseados em Radix UI e podem ser customizados:

```typescript
// src/components/ui/button.tsx
export const Button = styled(RadixButton, {
  // Seus estilos aqui
});
```

## Deploy

### Netlify

1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

### Docker

```bash
# Build
docker build -t gestly .

# Run
docker run -p 5173:5173 gestly
```

## Suporte

- Email: suporte@gestly.co
- Discord: [Comunidade Gestly](https://discord.gg/gestly)
- GitHub Issues: [Reportar Bugs](https://github.com/eltonciatto/gestly/issues)

## Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request