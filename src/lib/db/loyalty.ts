import { query, queryOne } from './postgres';

export interface LoyaltyProgram {
  id: string;
  business_id: string;
  name: string;
  points_per_currency: number;
  points_expiration_days?: number;
  rules?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyPoints {
  id: string;
  business_id: string;
  customer_id: string;
  appointment_id?: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  expires_at?: string;
  notes?: string;
  created_at: string;
}

export interface LoyaltyReward {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  points_required: number;
  quantity_available?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getLoyaltyProgram(businessId: string): Promise<LoyaltyProgram | null> {
  return queryOne<LoyaltyProgram>(
    'SELECT * FROM loyalty_programs WHERE business_id = $1 AND is_active = true',
    [businessId]
  );
}

export async function createLoyaltyProgram(data: Omit<LoyaltyProgram, 'id' | 'created_at' | 'updated_at'>): Promise<LoyaltyProgram> {
  const result = await queryOne<LoyaltyProgram>(
    `INSERT INTO loyalty_programs (
      business_id, name, points_per_currency,
      points_expiration_days, rules, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.business_id,
      data.name,
      data.points_per_currency,
      data.points_expiration_days,
      data.rules,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create loyalty program');
  }

  return result;
}

export async function getCustomerPoints(
  customerId: string,
  options?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<LoyaltyPoints[]> {
  let sql = 'SELECT * FROM loyalty_points WHERE customer_id = $1';
  const params: any[] = [customerId];
  let paramCount = 1;

  if (options?.type) {
    sql += ` AND type = $${++paramCount}`;
    params.push(options.type);
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

  return query<LoyaltyPoints>(sql, params);
}

export async function addLoyaltyPoints(data: Omit<LoyaltyPoints, 'id' | 'created_at'>): Promise<LoyaltyPoints> {
  const result = await queryOne<LoyaltyPoints>(
    `INSERT INTO loyalty_points (
      business_id, customer_id, appointment_id,
      points, type, expires_at, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.business_id,
      data.customer_id,
      data.appointment_id,
      data.points,
      data.type,
      data.expires_at,
      data.notes
    ]
  );

  if (!result) {
    throw new Error('Failed to add loyalty points');
  }

  return result;
}

export async function getLoyaltyRewards(businessId: string): Promise<LoyaltyReward[]> {
  return query<LoyaltyReward>(
    'SELECT * FROM loyalty_rewards WHERE business_id = $1 AND is_active = true ORDER BY points_required ASC',
    [businessId]
  );
}

export async function createLoyaltyReward(data: Omit<LoyaltyReward, 'id' | 'created_at' | 'updated_at'>): Promise<LoyaltyReward> {
  const result = await queryOne<LoyaltyReward>(
    `INSERT INTO loyalty_rewards (
      business_id, name, description,
      points_required, quantity_available, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.business_id,
      data.name,
      data.description,
      data.points_required,
      data.quantity_available,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create loyalty reward');
  }

  return result;
}