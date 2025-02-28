import { query, queryOne } from './postgres';

export interface Integration {
  id: string;
  business_id: string;
  type: 'typebot' | 'manychat' | 'sendbot' | 'whatsapp' | 'telegram';
  name: string;
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  event_type: string;
  status: 'success' | 'failed';
  request?: Record<string, any>;
  response?: Record<string, any>;
  error?: string;
  created_at: string;
}

export async function getIntegrations(
  businessId: string,
  type?: string
): Promise<Integration[]> {
  let sql = 'SELECT * FROM webhook_integrations WHERE business_id = $1';
  const params: any[] = [businessId];

  if (type) {
    sql += ' AND type = $2';
    params.push(type);
  }

  sql += ' AND is_active = true ORDER BY created_at DESC';

  return query<Integration>(sql, params);
}

export async function createIntegration(data: Omit<Integration, 'id' | 'created_at' | 'updated_at'>): Promise<Integration> {
  const result = await queryOne<Integration>(
    `INSERT INTO webhook_integrations (
      business_id, type, name, config, is_active
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      data.business_id,
      data.type,
      data.name,
      data.config,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create integration');
  }

  return result;
}

export async function logIntegrationEvent(data: Omit<IntegrationLog, 'id' | 'created_at'>): Promise<IntegrationLog> {
  const result = await queryOne<IntegrationLog>(
    `INSERT INTO integration_logs (
      integration_id, event_type, status,
      request, response, error
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.integration_id,
      data.event_type,
      data.status,
      data.request,
      data.response,
      data.error
    ]
  );

  if (!result) {
    throw new Error('Failed to log integration event');
  }

  return result;
}

export async function getIntegrationLogs(integrationId: string) {
  return query<IntegrationLog>(
    `SELECT * FROM integration_logs
     WHERE integration_id = $1
     ORDER BY created_at DESC
     LIMIT 100`,
    [integrationId]
  );
}