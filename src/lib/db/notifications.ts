import { query, queryOne } from './postgres';

export interface NotificationTemplate {
  id: string;
  business_id: string;
  type: 'email' | 'sms' | 'whatsapp';
  trigger: 'appointment_confirmation' | 'appointment_reminder' | 'appointment_cancelled' | 'birthday' | 'custom';
  subject?: string;
  content: string;
  variables?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  business_id: string;
  customer_id: string;
  appointment_id?: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'sent' | 'failed' | 'delivered' | 'read';
  error?: string;
  created_at: string;
}

export async function getNotificationTemplates(
  businessId: string,
  type?: string
): Promise<NotificationTemplate[]> {
  let sql = 'SELECT * FROM notification_templates WHERE business_id = $1';
  const params: any[] = [businessId];

  if (type) {
    sql += ' AND type = $2';
    params.push(type);
  }

  sql += ' AND is_active = true ORDER BY created_at DESC';

  return query<NotificationTemplate>(sql, params);
}

export async function createNotificationTemplate(
  data: Omit<NotificationTemplate, 'id' | 'created_at' | 'updated_at'>
): Promise<NotificationTemplate> {
  const result = await queryOne<NotificationTemplate>(
    `INSERT INTO notification_templates (
      business_id, type, trigger, subject,
      content, variables, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.business_id,
      data.type,
      data.trigger,
      data.subject,
      data.content,
      data.variables,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create notification template');
  }

  return result;
}

export async function updateNotificationTemplate(
  id: string,
  data: Partial<NotificationTemplate>
): Promise<NotificationTemplate | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');

  return queryOne<NotificationTemplate>(
    `UPDATE notification_templates 
     SET ${fields}, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, ...Object.values(data)]
  );
}

export async function logNotification(data: Omit<NotificationLog, 'id' | 'created_at'>): Promise<NotificationLog> {
  const result = await queryOne<NotificationLog>(
    `INSERT INTO notification_logs (
      business_id, customer_id, appointment_id,
      type, status, error
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.business_id,
      data.customer_id,
      data.appointment_id,
      data.type,
      data.status,
      data.error
    ]
  );

  if (!result) {
    throw new Error('Failed to log notification');
  }

  return result;
}

export async function getNotificationLogs(
  businessId: string,
  options?: {
    customerId?: string;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<NotificationLog[]> {
  let sql = 'SELECT * FROM notification_logs WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.customerId) {
    sql += ` AND customer_id = $${++paramCount}`;
    params.push(options.customerId);
  }

  if (options?.type) {
    sql += ` AND type = $${++paramCount}`;
    params.push(options.type);
  }

  if (options?.status) {
    sql += ` AND status = $${++paramCount}`;
    params.push(options.status);
  }

  if (options?.startDate) {
    sql += ` AND created_at >= $${++paramCount}`;
    params.push(options.startDate);
  }

  if (options?.endDate) {
    sql += ` AND created_at <= $${++paramCount}`;
    params.push(options.endDate);
  }

  sql += ' ORDER BY created_at DESC';

  if (options?.limit) {
    sql += ` LIMIT $${++paramCount}`;
    params.push(options.limit);
  }

  return query<NotificationLog>(sql, params);
}