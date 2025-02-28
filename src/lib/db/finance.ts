import { query, queryOne } from './postgres';

export interface Transaction {
  id: string;
  business_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method?: string;
  reference_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  business_id: string;
  name: string;
  type: 'credit' | 'debit' | 'cash' | 'pix' | 'transfer' | 'other';
  is_active: boolean;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export async function getTransactions(
  businessId: string,
  options?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }
): Promise<Transaction[]> {
  let sql = 'SELECT * FROM financial_transactions WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.type) {
    sql += ` AND type = $${++paramCount}`;
    params.push(options.type);
  }

  if (options?.category) {
    sql += ` AND category = $${++paramCount}`;
    params.push(options.category);
  }

  if (options?.startDate) {
    sql += ` AND date >= $${++paramCount}`;
    params.push(options.startDate);
  }

  if (options?.endDate) {
    sql += ` AND date <= $${++paramCount}`;
    params.push(options.endDate);
  }

  if (options?.status) {
    sql += ` AND status = $${++paramCount}`;
    params.push(options.status);
  }

  sql += ' ORDER BY date DESC, created_at DESC';

  return query<Transaction>(sql, params);
}

export async function createTransaction(data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
  const result = await queryOne<Transaction>(
    `INSERT INTO financial_transactions (
      business_id, type, category, amount,
      description, date, status, payment_method,
      reference_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      data.business_id,
      data.type,
      data.category,
      data.amount,
      data.description,
      data.date,
      data.status,
      data.payment_method,
      data.reference_id
    ]
  );

  if (!result) {
    throw new Error('Failed to create transaction');
  }

  return result;
}

export async function getPaymentMethods(businessId: string): Promise<PaymentMethod[]> {
  return query<PaymentMethod>(
    'SELECT * FROM payment_methods WHERE business_id = $1 AND is_active = true ORDER BY name',
    [businessId]
  );
}