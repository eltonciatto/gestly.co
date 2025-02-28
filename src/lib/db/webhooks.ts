import { query, queryOne } from './postgres';

export interface WebhookEndpoint {
  id: string;
  business_id: string;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookDelivery {
  id: string;
  endpoint_id: string;
  event_type: string;
  payload: Record<string, any>;
  status: 'success' | 'failed';
  status_code?: number;
  response_body?: string;
  error?: string;
  created_at: string;
}

export async function getWebhookEndpoints(businessId: string): Promise<WebhookEndpoint[]> {
  return query<WebhookEndpoint>(
    'SELECT * FROM webhook_endpoints WHERE business_id = $1 AND is_active = true ORDER BY created_at DESC',
    [businessId]
  );
}

export async function createWebhookEndpoint(data: Omit<WebhookEndpoint, 'id' | 'created_at' | 'updated_at'>): Promise<WebhookEndpoint> {
  const result = await queryOne<WebhookEndpoint>(
    `INSERT INTO webhook_endpoints (
      business_id, url, events, secret, is_active
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      data.business_id,
      data.url,
      data.events,
      data.secret,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create webhook endpoint');
  }

  return result;
}

export async function logWebhookDelivery(data: Omit<WebhookDelivery, 'id' | 'created_at'>): Promise<WebhookDelivery> {
  const result = await queryOne<WebhookDelivery>(
    `INSERT INTO webhook_deliveries (
      endpoint_id, event_type, payload,
      status, status_code, response_body, error
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.endpoint_id,
      data.event_type,
      data.payload,
      data.status,
      data.status_code,
      data.response_body,
      data.error
    ]
  );

  if (!result) {
    throw new Error('Failed to log webhook delivery');
  }

  return result;
}