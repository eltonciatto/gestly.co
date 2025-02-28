import { query, queryOne } from './postgres';

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  commission_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getServiceById(id: string): Promise<Service | null> {
  return queryOne<Service>(
    'SELECT * FROM services WHERE id = $1',
    [id]
  );
}

export async function getServicesByBusiness(
  businessId: string,
  options?: {
    activeOnly?: boolean;
    search?: string;
  }
): Promise<Service[]> {
  let sql = 'SELECT * FROM services WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.activeOnly) {
    sql += ` AND is_active = true`;
  }

  if (options?.search) {
    sql += ` AND (name ILIKE $${++paramCount} OR description ILIKE $${paramCount})`;
    params.push(`%${options.search}%`);
  }

  sql += ' ORDER BY name ASC';

  return query<Service>(sql, params);
}

export async function createService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
  const result = await queryOne<Service>(
    `INSERT INTO services (
      business_id, name, description, duration,
      price, commission_percentage, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.business_id,
      data.name,
      data.description,
      data.duration,
      data.price,
      data.commission_percentage,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create service');
  }

  return result;
}

export async function updateService(
  id: string,
  data: Partial<Service>
): Promise<Service | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');

  return queryOne<Service>(
    `UPDATE services 
     SET ${fields}, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, ...Object.values(data)]
  );
}

export async function deleteService(id: string): Promise<boolean> {
  const result = await queryOne(
    'UPDATE services SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
    [id]
  );
  return !!result;
}