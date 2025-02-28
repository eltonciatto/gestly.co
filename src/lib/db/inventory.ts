import { query, queryOne } from './postgres';

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  unit: string;
  min_stock: number;
  current_stock: number;
  cost_price: number;
  sale_price: number;
  supplier_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  business_id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unit_price?: number;
  notes?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  contact_name?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProducts(
  businessId: string,
  options?: {
    search?: string;
    lowStock?: boolean;
    supplierId?: string;
  }
): Promise<Product[]> {
  let sql = 'SELECT * FROM inventory_products WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.search) {
    sql += ` AND (name ILIKE $${++paramCount} OR sku ILIKE $${paramCount} OR barcode ILIKE $${paramCount})`;
    params.push(`%${options.search}%`);
  }

  if (options?.lowStock) {
    sql += ` AND current_stock <= min_stock`;
  }

  if (options?.supplierId) {
    sql += ` AND supplier_id = $${++paramCount}`;
    params.push(options.supplierId);
  }

  sql += ' ORDER BY name ASC';

  return query<Product>(sql, params);
}

export async function createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const result = await queryOne<Product>(
    `INSERT INTO inventory_products (
      business_id, name, description, sku, barcode,
      unit, min_stock, current_stock, cost_price,
      sale_price, supplier_id, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      data.business_id,
      data.name,
      data.description,
      data.sku,
      data.barcode,
      data.unit,
      data.min_stock,
      data.current_stock,
      data.cost_price,
      data.sale_price,
      data.supplier_id,
      data.is_active
    ]
  );

  if (!result) {
    throw new Error('Failed to create product');
  }

  return result;
}

export async function recordStockMovement(data: Omit<StockMovement, 'id' | 'created_at'>): Promise<StockMovement> {
  const result = await queryOne<StockMovement>(
    `INSERT INTO stock_movements (
      business_id, product_id, type,
      quantity, unit_price, notes
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.business_id,
      data.product_id,
      data.type,
      data.quantity,
      data.unit_price,
      data.notes
    ]
  );

  if (!result) {
    throw new Error('Failed to record stock movement');
  }

  return result;
}

export async function getSuppliers(businessId: string): Promise<Supplier[]> {
  return query<Supplier>(
    'SELECT * FROM inventory_suppliers WHERE business_id = $1 AND is_active = true ORDER BY name',
    [businessId]
  );
}