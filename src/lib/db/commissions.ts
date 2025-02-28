import { query, queryOne } from './postgres';

export interface Commission {
  id: string;
  business_id: string;
  attendant_id: string;
  appointment_id: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  paid_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionRule {
  id: string;
  business_id: string;
  service_id?: string;
  attendant_id?: string;
  percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getCommissionById(id: string): Promise<Commission | null> {
  return queryOne<Commission>(
    'SELECT * FROM commissions WHERE id = $1',
    [id]
  );
}

export async function getCommissionsByBusiness(
  businessId: string,
  options?: {
    attendantId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Commission[]> {
  let sql = 'SELECT * FROM commissions WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.attendantId) {
    sql += ` AND attendant_id = $${++paramCount}`;
    params.push(options.attendantId);
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

  return query<Commission>(sql, params);
}

export async function createCommission(data: Omit<Commission, 'id' | 'created_at' | 'updated_at'>): Promise<Commission> {
  const result = await queryOne<Commission>(
    `INSERT INTO commissions (
      business_id, attendant_id, appointment_id,
      amount, percentage, status, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.business_id,
      data.attendant_id,
      data.appointment_id,
      data.amount,
      data.percentage,
      data.status,
      data.notes
    ]
  );

  if (!result) {
    throw new Error('Failed to create commission');
  }

  return result;
}

export async function updateCommissionStatus(
  id: string,
  status: Commission['status'],
  paidAt?: string
): Promise<Commission | null> {
  return queryOne<Commission>(
    `UPDATE commissions 
     SET status = $2, paid_at = $3, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, status, paidAt]
  );
}

export async function getCommissionRules(businessId: string): Promise<CommissionRule[]> {
  return query<CommissionRule>(
    'SELECT * FROM commission_rules WHERE business_id = $1 AND is_active = true ORDER BY created_at DESC',
    [businessId]
  );
}

export async function createCommissionRule(data: Omit<CommissionRule, 'id' | 'created_at' | 'updated_at'>): Promise<CommissionRule> {
  const result = await queryOne<CommissionRule>(
    `INSERT INTO commission_rules (
      business_id, service_id, attendant_id, percentage, is_active
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [
      data.business_id,
      data.service_id,
      data.attendant_id,
      data.percentage,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create commission rule');
  }

  return result;
}