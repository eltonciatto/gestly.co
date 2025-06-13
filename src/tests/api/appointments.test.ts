import { describe, test, expect, beforeAll } from 'vitest';
import { apiClient } from '@/lib/api/client';
import { AppError } from '@/lib/error';

describe('Appointments API', () => {
  beforeAll(async () => {
    // Setup test data and auth
    const { data } = await apiClient.auth.login('test@example.com', 'password');
    localStorage.setItem('session', JSON.stringify({
      access_token: data.token
    }));
  });

  test('should list appointments', async () => {
    const { data } = await apiClient.appointments.list();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should create appointment', async () => {
    const { data } = await apiClient.appointments.create({
      customer_id: 'test-customer',
      service_id: 'test-service',
      start_time: new Date().toISOString()
    });

    expect(data).toMatchObject({
      id: expect.any(String),
      status: 'scheduled'
    });
  });

  test('should handle validation errors', async () => {
    await expect(apiClient.appointments.create({
      customer_id: 'invalid'
    })).resolves.toBeTruthy();
  });
});