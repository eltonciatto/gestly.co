import { query, queryOne } from './postgres';
import type { AppError } from '../error';

export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string;
  service_id: string;
  attendant_id?: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  return queryOne<Appointment>(
    `SELECT * FROM appointments WHERE id = $1`,
    [id]
  );
}

export async function getAppointmentsByBusiness(
  businessId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    customerId?: string;
  }
): Promise<Appointment[]> {
  let sql = `SELECT * FROM appointments WHERE business_id = $1`;
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.startDate) {
    sql += ` AND start_time >= $${++paramCount}`;
    params.push(options.startDate);
  }

  if (options?.endDate) {
    sql += ` AND start_time <= $${++paramCount}`;
    params.push(options.endDate);
  }

  if (options?.status) {
    sql += ` AND status = $${++paramCount}`;
    params.push(options.status);
  }

  if (options?.customerId) {
    sql += ` AND customer_id = $${++paramCount}`;
    params.push(options.customerId);
  }

  sql += ` ORDER BY start_time ASC`;

  return query<Appointment>(sql, params);
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
  const result = await queryOne<Appointment>(
    `INSERT INTO appointments (
      business_id, customer_id, service_id, attendant_id,
      start_time, end_time, status, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      data.business_id,
      data.customer_id,
      data.service_id,
      data.attendant_id,
      data.start_time,
      data.end_time,
      data.status,
      data.notes
    ]
  );

  if (!result) {
    throw new Error('Failed to create appointment');
  }

  return result;
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Promise<Appointment | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');

  return queryOne<Appointment>(
    `UPDATE appointments 
     SET ${fields}, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, ...Object.values(data)]
  );
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const result = await queryOne(
    'DELETE FROM appointments WHERE id = $1 RETURNING id',
    [id]
  );
  return !!result;
}