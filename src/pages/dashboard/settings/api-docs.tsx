import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language = 'json' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className={`language-${language} rounded-lg p-4 bg-muted overflow-x-auto`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface EndpointDocsProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  params?: Array<{
    name: string;
    type: string;
    description: string;
    required?: boolean;
  }>;
  body?: any;
  response: any;
}

function EndpointDocs({
  method,
  path,
  title,
  description,
  params,
  body,
  response
}: EndpointDocsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium flex items-center gap-x-2">
            <span className={cn(
              'px-2 py-1 text-xs rounded-full font-mono',
              method === 'GET' && 'bg-blue-100 text-blue-700',
              method === 'POST' && 'bg-green-100 text-green-700',
              method === 'PUT' && 'bg-yellow-100 text-yellow-700',
              method === 'DELETE' && 'bg-red-100 text-red-700'
            )}>{method}</span>
            <span>{title}</span>
          </h4>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          <code className="text-sm mt-2 block">{path}</code>
        </div>
      </div>

      {params && params.length > 0 && (
        <div>
          <h5 className="text-sm font-medium mb-2">Parâmetros</h5>
          <div className="grid gap-2">
            {params.map((param) => (
              <div key={param.name} className="text-sm">
                <code className="font-mono">{param.name}</code>
                <span className="text-muted-foreground ml-2">
                  ({param.type}
                  {param.required && <span className="text-red-500">*</span>})
                </span>
                <span className="block text-muted-foreground ml-4">
                  {param.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {body && (
        <div>
          <h5 className="text-sm font-medium mb-2">Corpo da Requisição</h5>
          <CodeBlock
            language="json"
            code={JSON.stringify(body, null, 2)}
          />
        </div>
      )}

      <div>
        <h5 className="text-sm font-medium mb-2">Resposta</h5>
        <CodeBlock
          language="json"
          code={JSON.stringify(response, null, 2)}
        />
      </div>
    </div>
  );
}

export default function APIDocs() {
  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Documentação da API</h2>
        <p className="text-muted-foreground">
          Guia completo para integrar com a API do Gestly
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Autenticação</h3>
          <div className="text-muted-foreground space-y-2">
            <p>Todas as requisições devem incluir sua chave API no header <code>x-api-key</code>.</p>
            <p>A API usa HTTPS e retorna respostas em JSON.</p>
          </div>
          <CodeBlock
            language="bash"
            code={`curl -X POST https://api.gestly.com/webhooks \\
  -H "x-api-key: sua-chave-api" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "appointment.create", ...}'`}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Endpoints Disponíveis</h3>
          <div className="grid gap-6">
            <EndpointDocs
              method="GET"
              path="/api/v1/appointments"
              title="Listar Agendamentos"
              description="Retorna lista de agendamentos com filtros opcionais"
              params={[
                { name: 'customer_id', type: 'string', description: 'Filtrar por cliente' },
                { name: 'status', type: 'string', description: 'Status do agendamento' },
                { name: 'start_date', type: 'string', description: 'Data inicial (YYYY-MM-DD)' },
                { name: 'end_date', type: 'string', description: 'Data final (YYYY-MM-DD)' }
              ]}
              response={{
                success: true,
                data: [{
                  id: 'appointment_id',
                  customer: {
                    id: 'customer_id',
                    name: 'Nome do Cliente'
                  },
                  service: {
                    id: 'service_id',
                    name: 'Nome do Serviço'
                  },
                  start_time: '2024-01-01T10:00:00Z',
                  end_time: '2024-01-01T11:00:00Z',
                  status: 'scheduled'
                }]
              }}
            />

            <EndpointDocs
              method="POST"
              path="/api/v1/appointments"
              title="Criar Agendamento"
              description="Cria um novo agendamento"
              body={{
                customer: {
                  name: 'Nome do Cliente',
                  email: 'cliente@email.com',
                  phone: '11999999999'
                },
                service: {
                  id: 'service_id'
                },
                start_time: '2024-01-01T10:00:00Z',
                notes: 'Observações do agendamento'
              }}
              response={{
                success: true,
                data: {
                  id: 'appointment_id',
                  status: 'scheduled'
                }
              }}
            />

            <EndpointDocs
              method="GET"
              path="/api/v1/availability"
              title="Verificar Disponibilidade"
              description="Verifica horários disponíveis para agendamento"
              params={[
                { name: 'date', type: 'string', description: 'Data (YYYY-MM-DD)', required: true },
                { name: 'service_id', type: 'string', description: 'ID do serviço', required: true }
              ]}
              response={{
                success: true,
                data: {
                  date: '2024-01-01',
                  available: true,
                  slots: [
                    '2024-01-01T09:00:00Z',
                    '2024-01-01T10:00:00Z'
                  ]
                }
              }}
            />

            <EndpointDocs
              method="GET"
              path="/api/v1/customers"
              title="Listar Clientes"
              description="Retorna lista de clientes com filtros opcionais"
              params={[
                { name: 'search', type: 'string', description: 'Buscar por nome' },
                { name: 'phone', type: 'string', description: 'Filtrar por telefone' },
                { name: 'email', type: 'string', description: 'Filtrar por email' }
              ]}
              response={{
                success: true,
                data: [{
                  id: 'customer_id',
                  name: 'Nome do Cliente',
                  email: 'cliente@email.com',
                  phone: '11999999999'
                }]
              }}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Códigos de Erro</h3>
          <div className="grid gap-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-red-500">401 - Unauthorized</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Chave API inválida ou não fornecida
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-red-500">400 - Bad Request</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Dados inválidos ou campos obrigatórios faltando
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-red-500">404 - Not Found</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Recurso não encontrado (serviço, cliente ou agendamento)
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium text-red-500">429 - Too Many Requests</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Limite de requisições excedido
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Limites de Uso</h3>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Os limites variam de acordo com seu plano:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Básico: 100 requisições/hora</li>
              <li>Profissional: 1.000 requisições/hora</li>
              <li>Empresarial: 10.000 requisições/hora</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}