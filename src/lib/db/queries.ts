import { query, queryOne } from './index';
import { AppError } from '../error';

export async function getBusinessById(id: string) {
  try {
    const business = await queryOne(
      'SELECT * FROM businesses WHERE id = $1',
      [id]
    );
    
    if (!business) {
      throw AppError.notFound('Negócio não encontrado');
    }

    return business;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('permission denied')) {
        throw AppError.unauthorized('Sem permissão para acessar este recurso');
      }
    }
    throw error;
  }
}

export async function getBusinessByOwnerId(ownerId: string) {
  return queryOne(
    'SELECT * FROM businesses WHERE owner_id = $1',
    [ownerId]
  );
}

export async function getBusinessHours(businessId: string) {
  return query(
    'SELECT * FROM business_hours WHERE business_id = $1 ORDER BY day_of_week',
    [businessId]
  );
}

export async function getAppointments(businessId: string, options: {
  startDate?: string;
  endDate?: string;
  status?: string;
  customerId?: string;
} = {}) {
  let sql = `
    SELECT a.*, 
      c.name as customer_name,
      s.name as service_name,
      s.duration,
      s.price
    FROM appointments a
    LEFT JOIN customers c ON a.customer_id = c.id
    LEFT JOIN services s ON a.service_id = s.id
    WHERE a.business_id = $1
  `;
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options.startDate) {
    sql += ` AND a.start_time >= $${++paramCount}`;
    params.push(options.startDate);
  }

  if (options.endDate) {
    sql += ` AND a.start_time <= $${++paramCount}`;
    params.push(options.endDate);
  }

  if (options.status) {
    sql += ` AND a.status = $${++paramCount}`;
    params.push(options.status);
  }

  if (options.customerId) {
    sql += ` AND a.customer_id = $${++paramCount}`;
    params.push(options.customerId);
  }

  sql += ' ORDER BY a.start_time DESC';

  return query(sql, params);
}

export async function getCustomers(businessId: string, options: {
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  let sql = 'SELECT * FROM customers WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options.search) {
    sql += ` AND (name ILIKE $${++paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount})`;
    params.push(`%${options.search}%`);
  }

  sql += ' ORDER BY name';

  if (options.limit) {
    sql += ` LIMIT $${++paramCount}`;
    params.push(options.limit);
  }

  if (options.offset) {
    sql += ` OFFSET $${++paramCount}`;
    params.push(options.offset);
  }

  return query(sql, params);
}

export async function getServices(businessId: string) {
  return query(
    'SELECT * FROM services WHERE business_id = $1 ORDER BY name',
    [businessId]
  );
}

export async function getTeamMembers(businessId: string) {
  return query(
    'SELECT * FROM profiles WHERE business_id = $1 AND role = \'attendant\' ORDER BY full_name',
    [businessId]
  );
}