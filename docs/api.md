# Documentação da API

## Base URL

```bash
https://api.gestly.co/v1
```

## Autenticação

Todas as requisições devem incluir o token JWT no header `Authorization`:

```bash
curl -X GET https://api.gestly.co/v1/appointments \
  -H "Authorization: Bearer seu-token-jwt"
```

## Endpoints

### Agendamentos

#### GET /appointments

Lista todos os agendamentos.

**Parâmetros:**
- `customer_id` (opcional): Filtrar por cliente
- `status` (opcional): Status do agendamento
- `start_date` (opcional): Data inicial
- `end_date` (opcional): Data final

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "apt_123",
      "customer": {
        "id": "cus_123",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "11999999999"
      },
      "service": {
        "id": "srv_123",
        "name": "Corte",
        "duration": 60,
        "price": 50.00
      },
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T11:00:00Z",
      "status": "scheduled"
    }
  ]
}
```

#### POST /appointments

Cria um novo agendamento.

**Corpo:**
```json
{
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "service": {
    "id": "srv_123"
  },
  "start_time": "2024-01-01T10:00:00Z",
  "notes": "Observações"
}
```

### Clientes

#### GET /customers

Lista todos os clientes.

**Parâmetros:**
- `search` (opcional): Buscar por nome
- `phone` (opcional): Filtrar por telefone
- `email` (opcional): Filtrar por email

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cus_123",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Serviços

#### GET /services

Lista todos os serviços.

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "srv_123",
      "name": "Corte",
      "duration": 60,
      "price": 50.00,
      "commission_percentage": 40
    }
  ]
}
```

### Relatórios

#### GET /reports/financial

Relatório financeiro.

**Parâmetros:**
- `start_date` (obrigatório): Data inicial
- `end_date` (obrigatório): Data final

**Resposta:**
```json
{
  "success": true,
  "data": {
    "revenue": 1000.00,
    "expenses": 400.00,
    "profit": 600.00,
    "metrics": {
      "average_ticket": 50.00,
      "conversion_rate": 0.8
    }
  }
}
```

## Webhooks

### Configuração

1. Acesse as configurações da API
2. Adicione um novo webhook
3. Configure os eventos
4. Copie a URL e o secret

### Eventos Disponíveis

- `appointment.create`: Novo agendamento
- `appointment.update`: Atualização de agendamento
- `customer.create`: Novo cliente
- `review.create`: Nova avaliação

### Formato do Payload

```json
{
  "id": "evt_123",
  "type": "appointment.create",
  "created_at": "2024-01-01T10:00:00Z",
  "data": {
    // Dados específicos do evento
  }
}
```

## Limites de Uso

Os limites variam por plano:

- Básico: 100 requisições/hora
- Profissional: 1.000 requisições/hora
- Empresarial: 10.000 requisições/hora

## Códigos de Erro

- `401`: API key inválida
- `400`: Dados inválidos
- `404`: Recurso não encontrado
- `429`: Limite de requisições excedido

## Exemplos

### Node.js

```javascript
const axios = require('axios');

const gestly = axios.create({
  baseURL: 'https://api.gestly.com/v1',
  headers: {
    'Authorization': 'Bearer seu-token'
  }
});

// Criar agendamento
async function createAppointment(data) {
  try {
    const response = await gestly.post('/appointments', data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}
```

### PHP

```php
$client = new GuzzleHttp\Client([
    'base_uri' => 'https://api.gestly.com/v1',
    'headers' => [
        'Authorization' => 'Bearer seu-token'
    ]
]);

// Listar clientes
try {
    $response = $client->get('/customers');
    $data = json_decode($response->getBody());
} catch (Exception $e) {
    echo 'Erro: ' . $e->getMessage();
}
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