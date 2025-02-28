import { env } from '../env';
import { AppError } from '../error';
import { handleApiError } from './error-handler';
import type { ApiResponse } from './types';

const API_URL = env.VITE_API_URL;

/**
 * Função base para requisições HTTP com autenticação
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  try {
    const session = localStorage.getItem('session');
    const headers = {
      'Content-Type': 'application/json',
      ...(session && { Authorization: `Bearer ${JSON.parse(session).access_token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new AppError(error.message || 'API request failed', error.code);
    }

    return response.json();
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Cliente API com endpoints organizados
 */
export const api = {
  // Auth
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (data: any) =>
      fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () => fetchWithAuth('/auth/me'),
    logout: () => fetchWithAuth('/auth/logout', { method: 'POST' }),
  },

  // Appointments
  appointments: {
    list: (params?: Record<string, any>) =>
      fetchWithAuth('/appointments' + (params ? `?${new URLSearchParams(params)}` : '')),
    get: (id: string) => fetchWithAuth(`/appointments/${id}`),
    create: (data: any) =>
      fetchWithAuth('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/appointments/${id}`, {
        method: 'DELETE',
      }),
  },

  // Customers
  customers: {
    list: (params?: Record<string, any>) =>
      fetchWithAuth('/customers' + (params ? `?${new URLSearchParams(params)}` : '')),
    get: (id: string) => fetchWithAuth(`/customers/${id}`),
    create: (data: any) =>
      fetchWithAuth('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/customers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/customers/${id}`, {
        method: 'DELETE',
      }),
  },

  // Services
  services: {
    list: (params?: Record<string, any>) =>
      fetchWithAuth('/services' + (params ? `?${new URLSearchParams(params)}` : '')),
    get: (id: string) => fetchWithAuth(`/services/${id}`),
    create: (data: any) =>
      fetchWithAuth('/services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/services/${id}`, {
        method: 'DELETE',
      }),
  },

  // Team
  team: {
    list: (params?: Record<string, any>) =>
      fetchWithAuth('/team' + (params ? `?${new URLSearchParams(params)}` : '')),
    create: (data: any) =>
      fetchWithAuth('/team', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/team/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/team/${id}`, {
        method: 'DELETE',
      }),
  },

  // Reports
  reports: {
    financial: (startDate: string, endDate: string) =>
      fetchWithAuth(`/reports/financial?startDate=${startDate}&endDate=${endDate}`),
    commissions: (startDate: string, endDate: string) =>
      fetchWithAuth(`/reports/commissions?startDate=${startDate}&endDate=${endDate}`),
    metrics: (params?: Record<string, any>) =>
      fetchWithAuth('/reports/metrics' + (params ? `?${new URLSearchParams(params)}` : '')),
  },

  // Settings
  settings: {
    getBusinessHours: () => fetchWithAuth('/settings/business-hours'),
    updateBusinessHours: (id: string, data: any) =>
      fetchWithAuth(`/settings/business-hours/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    getNotificationSettings: () => fetchWithAuth('/settings/notifications'),
    updateNotificationSettings: (data: any) =>
      fetchWithAuth('/settings/notifications', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Integrations
  integrations: {
    list: () => fetchWithAuth('/integrations'),
    create: (data: any) =>
      fetchWithAuth('/integrations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      fetchWithAuth(`/integrations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithAuth(`/integrations/${id}`, {
        method: 'DELETE',
      }),
  },
};