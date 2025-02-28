# Guia de Integração

## Chatbots

### Typebot

1. Crie um fluxo no Typebot
2. Configure o webhook:
   - URL: `https://gestly.co/api/webhooks`
   - Método: `POST`
   - Headers:
     ```
     x-api-key: sua-chave-api
     Content-Type: application/json
     ```

### ManyChat

1. Crie um fluxo no ManyChat
2. Adicione ação "Call Webhook":
   - URL: `https://gestly.co/api/webhooks`
   - Método: `POST`
   - Headers:
     ```
     x-api-key: sua-chave-api
     Content-Type: application/json
     ```

### SendBot

1. Configure o webhook no SendBot:
   - URL: `https://gestly.co/api/webhooks`
   - Eventos: Selecione os eventos desejados
   - Headers:
     ```
     x-api-key: sua-chave-api
     Content-Type: application/json
     ```

## WhatsApp

### WhatsApp Business API

1. Configure o webhook:
   ```json
   {
     "webhook_url": "https://gestly.co/api/webhooks/whatsapp",
     "verify_token": "seu-token"
   }
   ```

2. Adicione o número no painel
3. Configure as mensagens automáticas

### WhatsApp Cloud API

1. Configure no Facebook Developer:
   - Webhook URL: `https://gestly.co/api/webhooks/whatsapp`
   - Verify Token: Seu token de verificação
   - Events: Selecione os eventos

2. Adicione o número de telefone
3. Configure os templates de mensagem

## Telegram

1. Crie um bot com @BotFather
2. Configure o webhook:
   ```bash
   curl -F "url=https://gestly.co/api/webhooks/telegram" \
        -F "certificate=@cert.pem" \
        https://api.telegram.org/bot<token>/setWebhook
   ```

## Exemplos de Integração

### Agendamento via WhatsApp

```javascript
// Exemplo de fluxo
async function handleWhatsAppMessage(message) {
  // Verificar disponibilidade
  const slots = await checkAvailability(serviceId, date);
  
  // Criar agendamento
  const appointment = await createAppointment({
    customer: {
      name: message.contact.name,
      phone: message.from
    },
    service: { id: serviceId },
    startTime: selectedSlot
  });
  
  // Enviar confirmação
  await sendWhatsAppMessage(message.from, {
    template: 'appointment_confirmation',
    params: {
      customer_name: appointment.customer.name,
      date: formatDate(appointment.startTime)
    }
  });
}
```

### Lembretes Automáticos

```javascript
// Configurar lembretes
const reminderSettings = {
  channels: ['whatsapp', 'sms'],
  templates: {
    '24h': {
      whatsapp: 'reminder_24h',
      sms: 'reminder_24h_sms'
    },
    '1h': {
      whatsapp: 'reminder_1h'
    }
  }
};

// Processar lembretes
async function processReminders() {
  const appointments = await getUpcomingAppointments();
  
  for (const apt of appointments) {
    await sendReminders(apt, reminderSettings);
  }
}
```

## Webhooks

### Configuração

1. Acesse as configurações da API
2. Adicione um novo webhook
3. Configure os eventos
4. Copie a URL e o secret

### Segurança

- Use HTTPS
- Valide a assinatura
- Implemente retry com backoff
- Monitore falhas

### Exemplo de Handler

```javascript
async function handleWebhook(req, res) {
  const signature = req.headers['x-webhook-signature'];
  
  // Validar assinatura
  if (!validateSignature(signature, req.body)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Processar evento
  const { type, data } = req.body;
  
  switch (type) {
    case 'appointment.create':
      await handleNewAppointment(data);
      break;
    case 'appointment.update':
      await handleAppointmentUpdate(data);
      break;
  }
  
  res.json({ received: true });
}
```