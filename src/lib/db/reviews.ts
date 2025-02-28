import { query, queryOne } from './postgres';

export interface Review {
  id: string;
  business_id: string;
  customer_id: string;
  appointment_id: string;
  rating: number;
  comment?: string;
  response?: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export async function getReviewById(id: string): Promise<Review | null> {
  return queryOne<Review>(
    'SELECT * FROM reviews WHERE id = $1',
    [id]
  );
}

export async function getReviewsByBusiness(
  businessId: string,
  options?: {
    pendingResponseOnly?: boolean;
    customerId?: string;
    appointmentId?: string;
  }
): Promise<Review[]> {
  let sql = 'SELECT * FROM reviews WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.pendingResponseOnly) {
    sql += ` AND response IS NULL`;
  }

  if (options?.customerId) {
    sql += ` AND customer_id = $${++paramCount}`;
    params.push(options.customerId);
  }

  if (options?.appointmentId) {
    sql += ` AND appointment_id = $${++paramCount}`;
    params.push(options.appointmentId);
  }

  sql += ' ORDER BY created_at DESC';

  return query<Review>(sql, params);
}

export async function createReview(data: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
  const result = await queryOne<Review>(
    `INSERT INTO reviews (
      business_id, customer_id, appointment_id,
      rating, comment, is_anonymous
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.business_id,
      data.customer_id,
      data.appointment_id,
      data.rating,
      data.comment,
      data.is_anonymous
    ]
  );

  if (!result) {
    throw new Error('Failed to create review');
  }

  return result;
}

export async function respondToReview(
  id: string,
  response: string
): Promise<Review | null> {
  return queryOne<Review>(
    `UPDATE reviews 
     SET response = $2, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, response]
  );
}

export async function deleteReview(id: string): Promise<boolean> {
  const result = await queryOne(
    'DELETE FROM reviews WHERE id = $1 RETURNING id',
    [id]
  );
  return !!result;
}