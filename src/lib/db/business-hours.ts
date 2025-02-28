import { query, queryOne } from './postgres';

export interface BusinessHours {
  id: string;
  business_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_start?: string;
  break_end?: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpecialDay {
  id: string;
  business_id: string;
  date: string;
  name: string;
  is_closed: boolean;
  start_time?: string;
  end_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getBusinessHours(businessId: string): Promise<BusinessHours[]> {
  return query<BusinessHours>(
    'SELECT * FROM business_hours WHERE business_id = $1 ORDER BY day_of_week',
    [businessId]
  );
}

export async function updateBusinessHours(
  id: string,
  data: Partial<BusinessHours>
): Promise<BusinessHours | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');

  return queryOne<BusinessHours>(
    `UPDATE business_hours 
     SET ${fields}, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, ...Object.values(data)]
  );
}

export async function getSpecialDays(
  businessId: string,
  options?: {
    startDate?: string;
    endDate?: string;
  }
): Promise<SpecialDay[]> {
  let sql = 'SELECT * FROM special_days WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.startDate) {
    sql += ` AND date >= $${++paramCount}`;
    params.push(options.startDate);
  }

  if (options?.endDate) {
    sql += ` AND date <= $${++paramCount}`;
    params.push(options.endDate);
  }

  sql += ' ORDER BY date ASC';

  return query<SpecialDay>(sql, params);
}

export async function createSpecialDay(data: Omit<SpecialDay, 'id' | 'created_at' | 'updated_at'>): Promise<SpecialDay> {
  const result = await queryOne<SpecialDay>(
    `INSERT INTO special_days (
      business_id, date, name, is_closed,
      start_time, end_time, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.business_id,
      data.date,
      data.name,
      data.is_closed,
      data.start_time,
      data.end_time,
      data.notes
    ]
  );

  if (!result) {
    throw new Error('Failed to create special day');
  }

  return result;
}