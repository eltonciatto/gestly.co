import { rest } from 'msw';

const API_URL = 'http://localhost:3000/api/v1';

export const handlers = [
  // Auth handlers
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          token: 'test-token'
        }
      })
    );
  }),

  // Appointments handlers
  rest.get(`${API_URL}/appointments`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: []
      })
    );
  }),

  rest.post(`${API_URL}/appointments`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: 'test-id',
          status: 'scheduled'
        }
      })
    );
  }),

  // Customers handlers
  rest.get(`${API_URL}/customers`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: []
      })
    );
  }),

  // Services handlers
  rest.get(`${API_URL}/services`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: []
      })
    );
  }),

  // Error handlers
  rest.get(`${API_URL}/error`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: {
          code: 'internal_error',
          message: 'Internal server error'
        }
      })
    );
  })
];