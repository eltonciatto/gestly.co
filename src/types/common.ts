/**
 * Interface base para entidades com ID e timestamps
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

/**
 * Interface para entidades vinculadas a um negócio
 */
export interface WithBusinessId {
  business_id: string;
}

/**
 * Interface para entidades com soft delete
 */
export interface SoftDelete {
  deleted_at?: string;
}

/**
 * Status possíveis para agendamentos
 */
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Tipos de notificação suportados
 */
export type NotificationType = 'email' | 'sms' | 'whatsapp';

/**
 * Roles de usuário
 */
export type UserRole = 'admin' | 'attendant' | 'customer';

/**
 * Interface para paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}