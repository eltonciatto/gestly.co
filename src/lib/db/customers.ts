import { query, queryOne } from './postgres';

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone: string;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  return queryOne<Customer>(
    'SELECT * FROM customers WHERE id = $1',
    [id]
  );
}

export async function getCustomersByBusiness(
  businessId: string,
  options?: {
    search?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }
): Promise<Customer[]> {
  let sql = 'SELECT * FROM customers WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.search) {
    sql += ` AND (
      name ILIKE $${++paramCount} OR 
      email ILIKE $${paramCount} OR 
      phone ILIKE $${paramCount}
    )`;
    params.push(`%${options.search}%`);
  }

  if (options?.tags?.length) {
    sql += ` AND tags && $${++paramCount}`;
    params.push(options.tags);
  }

  sql += ' ORDER BY name ASC';

  if (options?.limit) {
    sql += ` LIMIT $${++paramCount}`;
    params.push(options.limit);
  }

  if (options?.offset) {
    sql += ` OFFSET $${++paramCount}`;
    params.push(options.offset);
  }

  return query<Customer>(sql, params);
}

export async function createCustomer(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
  const result = await queryOne<Customer>(
    `INSERT INTO customers (
      business_id, name, email, phone, notes, tags
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.business_id,
      data.name,
      data.email,
      data.phone,
      data.notes,
      data.tags
    ]
  );

  if (!result) {
    throw new Error('Failed to create customer');
  }

  return result;
}

export async function updateCustomer(
  id: string,
  data: Partial<Customer>
): Promise<Customer | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');

  return queryOne<Customer>(
    `UPDATE customers 
     SET ${fields}, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, ...Object.values(data)]
  );
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const result = await queryOne(
    'DELETE FROM customers WHERE id = $1 RETURNING id',
    [id]
  );
  return !!result;
}