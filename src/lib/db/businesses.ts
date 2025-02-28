import { query, queryOne } from './postgres';

interface Business {
  id: string;
  owner_id: string;
  name: string;
  email: string | null;
  api_key: string | null;
  default_commission_percentage: number;
  settings: Record<string, any>;
  metrics: Record<string, any>;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  return queryOne<Business>(
    'SELECT * FROM businesses WHERE id = $1',
    [id]
  );
}

export async function getBusinessByOwnerId(ownerId: string): Promise<Business | null> {
  return queryOne<Business>(
    'SELECT * FROM businesses WHERE owner_id = $1',
    [ownerId]
  );
}

export async function createBusiness(data: Omit<Business, 'id'>): Promise<Business> {
  const result = await queryOne<Business>(
    `INSERT INTO businesses (
      owner_id, name, email, api_key, 
      default_commission_percentage, settings, metrics
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      data.owner_id,
      data.name,
      data.email,
      data.api_key,
      data.default_commission_percentage,
      JSON.stringify(data.settings),
      JSON.stringify(data.metrics)
    ]
  );
  
  if (!result) {
    throw new Error('Failed to create business');
  }
  
  return result;
}

export async function updateBusiness(
  id: string, 
  data: Partial<Business>
): Promise<Business | null> {
  const fields = Object.keys(data)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(', ');
    
  const values = Object.values(data).map(val => 
    typeof val === 'object' ? JSON.stringify(val) : val
  );
  
  return queryOne<Business>(
    `UPDATE businesses 
     SET ${fields} 
     WHERE id = $1 
     RETURNING *`,
    [id, ...values]
  );
}