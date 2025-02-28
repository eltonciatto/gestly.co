# Webhooks

## Visão Geral

Os webhooks permitem que sua aplicação receba notificações em tempo real sobre eventos que acontecem no Gestly.

## Eventos Disponíveis

### Agendamentos

- `appointment.create`: Novo agendamento criado
- `appointment.update`: Agendamento atualizado
- `appointment.cancel`: Agendamento cancelado
- `appointment.reminder`: Lembrete de agendamento

### Clientes

- `customer.create`: Novo cliente cadastrado
- `customer.update`: Dados do cliente atualizados

### Avaliações

- `review.create`: Nova avaliação recebida
- `review.response`: Resposta à avaliação

### Fidelidade

- `loyalty.points_earned`: Pontos creditados
- `loyalty.reward_redeemed`: Recompensa resgatada

## Configuração

1. Acesse o painel do Gestly
2. Vá em Configurações > API e Webhooks
3. Adicione um novo endpoint
4. Configure os eventos
5. Copie a URL e o secret

## Formato do Payload

```json
{
  "id": "evt_123",
  "type": "appointment.create",
  "created_at": "2024-01-01T10:00:00Z",
  "data": {
    "id": "apt_123",
    "customer": {
      "id": "cus_123",
      "name": "João Silva"
    },
    "service": {
      "id": "srv_123",
      "name": "Corte"
    },
    "start_time": "2024-01-02T14:00:00Z",
    "status": "scheduled"
  }
}
```

## Segurança

### Assinatura

Cada requisição inclui um header `x-webhook-signature` com uma assinatura HMAC:

```javascript
const crypto = require('crypto');

function validateSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Retry Logic

Em caso de falha, o Gestly tentará reenviar o webhook:

- 1ª tentativa: Imediato
- 2ª tentativa: 5 minutos
- 3ª tentativa: 30 minutos
- 4ª tentativa: 2 horas
- 5ª tentativa: 12 horas

## Exemplos de Implementação

### Node.js (Express)

```javascript
const express = require('express');
const app = express();

app.post('/webhooks', express.json(), (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  
  // Validar assinatura
  if (!validateSignature(req.body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Processar evento
  const { type, data } = req.body;
  
  switch (type) {
    case 'appointment.create':
      handleNewAppointment(data);
      break;
    case 'appointment.update':
      handleAppointmentUpdate(data);
      break;
  }
  
  res.json({ received: true });
});
```

### PHP (Laravel)

```php
Route::post('/webhooks', function (Request $request) {
    $signature = $request->header('x-webhook-signature');
    
    if (!validateSignature($request->getContent(), $signature)) {
        return response()->json(['error' => 'Invalid signature'], 401);
    }
    
    $payload = $request->json();
    
    match ($payload->get('type')) {
        'appointment.create' => handleNewAppointment($payload->get('data')),
        'appointment.update' => handleAppointmentUpdate($payload->get('data')),
        default => throw new Exception('Unknown event type'),
    };
    
    return response()->json(['received' => true]);
});
```

### Python

```python
import requests

class GestlyAPI:
    def __init__(self, token):
        self.base_url = 'https://api.gestly.com/v1'
        self.headers = {'Authorization': f'Bearer {token}'}
    
    def get_availability(self, date, service_id):
        response = requests.get(
            f'{self.base_url}/availability',
            headers=self.headers,
            params={'date': date, 'service_id': service_id}
        )
        return response.json()
```

## Boas Práticas

1. **Validação**
   - Sempre valide a assinatura
   - Verifique o timestamp do evento
   - Valide o formato do payload

2. **Processamento**
   - Processe eventos de forma assíncrona
   - Implemente idempotência
   - Monitore falhas

3. **Segurança**
   - Use HTTPS
   - Mantenha o secret seguro
   - Limite o acesso ao endpoint

4. **Monitoramento**
   - Registre todos os eventos
   - Configure alertas para falhas
   - Monitore o tempo de processamento

## Troubleshooting

### Problemas Comuns

1. **Assinatura Inválida**
   - Verifique se está usando o secret correto
   - Confirme o formato do payload
   - Verifique a codificação

2. **Timeout**
   - Processe eventos de forma assíncrona
   - Aumente o timeout do servidor
   - Implemente confirmação imediata

3. **Eventos Duplicados**
   - Implemente idempotência
   - Verifique IDs duplicados
   - Registre eventos processados

### Logs

Acesse os logs de webhook em:
1. Painel do Gestly > Configurações > API
2. Selecione "Logs de Webhook"
3. Filtre por data, evento ou status