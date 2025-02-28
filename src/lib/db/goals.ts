import { query, queryOne } from './postgres';

export interface Goal {
  id: string;
  business_id: string;
  attendant_id?: string;
  type: 'revenue' | 'appointments' | 'customers' | 'commission';
  target: number;
  current: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'failed';
  bonus_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface Metric {
  id: string;
  business_id: string;
  date: string;
  metrics: {
    revenue: number;
    appointments: number;
    new_customers: number;
    completed_appointments: number;
    cancelled_appointments: number;
    average_rating: number;
    occupancy_rate: number;
  };
  created_at: string;
}

export async function getGoals(
  businessId: string,
  options?: {
    attendantId?: string;
    type?: string;
    status?: string;
    active?: boolean;
  }
): Promise<Goal[]> {
  let sql = 'SELECT * FROM goals WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.attendantId) {
    sql += ` AND attendant_id = $${++paramCount}`;
    params.push(options.attendantId);
  }

  if (options?.type) {
    sql += ` AND type = $${++paramCount}`;
    params.push(options.type);
  }

  if (options?.status) {
    sql += ` AND status = $${++paramCount}`;
    params.push(options.status);
  }

  if (options?.active) {
    sql += ` AND end_date >= CURRENT_DATE`;
  }

  sql += ' ORDER BY end_date DESC';

  return query<Goal>(sql, params);
}

export async function createGoal(data: Omit<Goal, 'id' | 'current' | 'created_at' | 'updated_at'>): Promise<Goal> {
  const result = await queryOne<Goal>(
    `INSERT INTO goals (
      business_id, attendant_id, type,
      target, start_date, end_date,
      status, bonus_percentage
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      data.business_id,
      data.attendant_id,
      data.type,
      data.target,
      data.start_date,
      data.end_date,
      data.status,
      data.bonus_percentage
    ]
  );

  if (!result) {
    throw new Error('Failed to create goal');
  }

  return result;
}

export async function updateGoalProgress(
  id: string,
  current: number,
  status?: Goal['status']
): Promise<Goal | null> {
  return queryOne<Goal>(
    `UPDATE goals 
     SET current = $2, status = COALESCE($3, status), updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, current, status]
  );
}

export async function getDailyMetrics(
  businessId: string,
  startDate: string,
  endDate: string
): Promise<Metric[]> {
  return query<Metric>(
    `SELECT * FROM daily_metrics 
     WHERE business_id = $1 
     AND date BETWEEN $2 AND $3 
     ORDER BY date ASC`,
    [businessId, startDate, endDate]
  );
}

export async function recordDailyMetrics(data: Omit<Metric, 'id' | 'created_at'>): Promise<Metric> {
  const result = await queryOne<Metric>(
    `INSERT INTO daily_metrics (
      business_id, date, metrics
    ) VALUES ($1, $2, $3)
    ON CONFLICT (business_id, date) 
    DO UPDATE SET metrics = $3
    RETURNING *`,
    [
      data.business_id,
      data.date,
      data.metrics
    ]
  );

  if (!result) {
    throw new Error('Failed to record metrics');
  }

  return result;
}