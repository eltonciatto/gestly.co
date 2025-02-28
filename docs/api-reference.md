# Referência da API

## Base URL

```
https://gestly.co/api/v1
```

## Autenticação

Todas as requisições devem incluir sua chave API no header `x-api-key`:

```bash
curl -X GET https://gestly.co/api/v1/appointments \
  -H "x-api-key: sua-chave-api"
```

## Endpoints

### Agendamentos

#### GET /v1/appointments

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
      "attendant": {
        "id": "att_123",
        "name": "Maria Oliveira"
      },
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T11:00:00Z",
      "status": "scheduled",
      "notes": "Observações do agendamento"
    }
  ]
}
```

#### POST /v1/appointments

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

### Disponibilidade

#### GET /v1/availability

Verifica horários disponíveis.

**Parâmetros:**
- `date` (obrigatório): Data (YYYY-MM-DD)
- `service_id` (obrigatório): ID do serviço

**Resposta:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-01",
    "available": true,
    "slots": [
      "2024-01-01T09:00:00Z",
      "2024-01-01T10:00:00Z"
    ]
  }
}
```

### Clientes

#### GET /v1/customers

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

### Programa de Fidelidade

#### GET /v1/loyalty/points

Consulta pontos do cliente.

**Parâmetros:**
- `customer_id` (obrigatório): ID do cliente

**Resposta:**
```json
{
  "success": true,
  "data": {
    "points_available": 100,
    "points_used": 50,
    "next_reward": {
      "id": "rwd_123",
      "name": "Desconto 10%",
      "points_needed": 150
    }
  }
}
```

## Webhooks

### Eventos

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
    'x-api-key': 'sua-chave-api'
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
        'x-api-key' => 'sua-chave-api'
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
    def __init__(self, api_key):
        self.base_url = 'https://api.gestly.com/v1'
        self.headers = {'x-api-key': api_key}
    
    def get_availability(self, date, service_id):
        response = requests.get(
            f'{self.base_url}/availability',
            headers=self.headers,
            params={'date': date, 'service_id': service_id}
        )
        return response.json()
```