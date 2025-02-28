import { env } from '../env';
import { AppError } from '../error';
import { handleApiError } from './error-handler';
import type { ApiResponse, ListParams } from './types';

const API_URL = env.VITE_API_URL || '/api';

/**
 * Função base para requisições HTTP com autenticação
 */
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const session = localStorage.getItem('session');
  const requestId = crypto.randomUUID();
  const url = `${API_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-API-Key': env.VITE_API_KEY,
    ...(session && { Authorization: `Bearer ${JSON.parse(session).access_token}` }),
    'X-Request-Id': requestId,
  };

  try {
    const startTime = performance.now();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      }
    });
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log request metrics
    console.debug('API Request', {
      requestId,
      endpoint,
      method: options.method || 'GET',
      duration,
      status: response.status
    });

    if (!response.ok) {
      throw handleApiError(response);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Request Failed', {
      requestId,
      endpoint,
      error
    });

    throw handleApiError(error);
  }
}

/**
 * Cliente API com endpoints organizados
 */
export const apiClient = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth<ApiResponse<{ token: string }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: { name: string; email: string; password: string }) =>
      fetchWithAuth<ApiResponse<{ id: string }>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    me: () => fetchWithAuth<ApiResponse<any>>('/auth/me'),

    logout: () => fetchWithAuth<ApiResponse<void>>('/auth/logout', {
      method: 'POST',
    }),
  },

  // Appointments
  appointments: {
    list: (params?: ListParams) =>
      fetchWithAuth<ApiResponse<any[]>>('/appointments', { params }),

    get: (id: string) =>
      fetchWithAuth<ApiResponse<any>>(`/appointments/${id}`),

    create: (data: any) =>
      fetchWithAuth<ApiResponse<any>>('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      fetchWithAuth<ApiResponse<any>>(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchWithAuth<ApiResponse<void>>(`/appointments/${id}`, {
        method: 'DELETE',
      }),
  },

  // Customers
  customers: {
    list: (params?: ListParams) =>
      fetchWithAuth<ApiResponse<any[]>>('/customers', { params }),

    get: (id: string) =>
      fetchWithAuth<ApiResponse<any>>(`/customers/${id}`),

    create: (data: any) =>
      fetchWithAuth<ApiResponse<any>>('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      fetchWithAuth<ApiResponse<any>>(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchWithAuth<ApiResponse<void>>(`/customers/${id}`, {
        method: 'DELETE',
      }),
  },

  // Services
  services: {
    list: (params?: ListParams) =>
      fetchWithAuth<ApiResponse<any[]>>('/services', { params }),

    get: (id: string) =>
      fetchWithAuth<ApiResponse<any>>(`/services/${id}`),

    create: (data: any) =>
      fetchWithAuth<ApiResponse<any>>('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      fetchWithAuth<ApiResponse<any>>(`/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchWithAuth<ApiResponse<void>>(`/services/${id}`, {
        method: 'DELETE',
      }),
  },

  // Team
  team: {
    list: (params?: ListParams) =>
      fetchWithAuth<ApiResponse<any[]>>('/team', { params }),

    create: (data: any) =>
      fetchWithAuth<ApiResponse<any>>('/team', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      fetchWithAuth<ApiResponse<any>>(`/team/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchWithAuth<ApiResponse<void>>(`/team/${id}`, {
        method: 'DELETE',
      }),

    resendInvite: (email: string) =>
      fetchWithAuth<ApiResponse<void>>('/team/resend-invite', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
  },

  // Reports
  reports: {
    financial: (startDate: string, endDate: string) =>
      fetchWithAuth<ApiResponse<any>>(`/reports/financial?startDate=${startDate}&endDate=${endDate}`),

    commissions: (startDate: string, endDate: string) =>
      fetchWithAuth<ApiResponse<any>>(`/reports/commissions?startDate=${startDate}&endDate=${endDate}`),

    metrics: (params?: any) =>
      fetchWithAuth<ApiResponse<any>>('/reports/metrics', { params }),
  },

  // Settings
  settings: {
    getBusinessHours: () =>
      fetchWithAuth<ApiResponse<any[]>>('/settings/business-hours'),

    updateBusinessHours: (id: string, data: any) =>
      fetchWithAuth<ApiResponse<any>>(`/settings/business-hours/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    getNotificationSettings: () =>
      fetchWithAuth<ApiResponse<any>>('/settings/notifications'),

    updateNotificationSettings: (data: any) =>
      fetchWithAuth<ApiResponse<any>>('/settings/notifications', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Integrations
  integrations: {
    list: () =>
      fetchWithAuth<ApiResponse<any[]>>('/integrations'),

    create: (data: any) =>
      fetchWithAuth<ApiResponse<any>>('/integrations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      fetchWithAuth<ApiResponse<any>>(`/integrations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchWithAuth<ApiResponse<void>>(`/integrations/${id}`, {
        method: 'DELETE',
      }),
  },
};