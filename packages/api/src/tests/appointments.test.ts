import { test } from 'vitest';
import { app } from '../app';
import { createTestUser, createTestBusiness } from './helpers';

test('appointments endpoints', async () => {
  const user = await createTestUser();
  const business = await createTestBusiness(user.id);
  const token = await app.jwt.sign({ sub: user.id });

  // List appointments
  const listResponse = await app.inject({
    method: 'GET',
    url: '/api/v1/appointments',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  expect(listResponse.statusCode).toBe(200);
  expect(JSON.parse(listResponse.body)).toEqual({
    success: true,
    data: expect.any(Array)
  });

  // Create appointment
  const createResponse = await app.inject({
    method: 'POST',
    url: '/api/v1/appointments',
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: {
      customer_id: 'test-customer-id',
      service_id: 'test-service-id',
      start_time: new Date().toISOString()
    }
  });

  expect(createResponse.statusCode).toBe(201);
  expect(JSON.parse(createResponse.body)).toEqual({
    success: true,
    data: expect.objectContaining({
      id: expect.any(String)
    })
  });
});