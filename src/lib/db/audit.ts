import { query, queryOne } from './postgres';

export interface AuditLog {
  id: string;
  business_id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export async function createAuditLog(data: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
  const result = await queryOne<AuditLog>(
    `INSERT INTO audit_logs (
      business_id, user_id, action, resource,
      resource_id, changes, metadata,
      ip_address, user_agent
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      data.business_id,
      data.user_id,
      data.action,
      data.resource,
      data.resource_id,
      data.changes,
      data.metadata,
      data.ip_address,
      data.user_agent
    ]
  );

  if (!result) {
    throw new Error('Failed to create audit log');
  }

  return result;
}

export async function getAuditLogs(
  businessId: string,
  options?: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }
): Promise<AuditLog[]> {
  let sql = 'SELECT * FROM audit_logs WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.userId) {
    sql += ` AND user_id = $${++paramCount}`;
    params.push(options.userId);
  }

  if (options?.action) {
    sql += ` AND action = $${++paramCount}`;
    params.push(options.action);
  }

  if (options?.resource) {
    sql += ` AND resource = $${++paramCount}`;
    params.push(options.resource);
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

  if (options?.offset) {
    sql += ` OFFSET $${++paramCount}`;
    params.push(options.offset);
  }

  return query<AuditLog>(sql, params);
}