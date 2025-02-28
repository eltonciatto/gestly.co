/**
 * Interface base para respostas da API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Interface para respostas paginadas
 */
export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Interface para parâmetros de paginação
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Interface para parâmetros de filtro
 */
export interface FilterParams {
  search?: string;
  [key: string]: any;
}

/**
 * Interface para parâmetros de listagem
 */
export interface ListParams extends PaginationParams, FilterParams {}