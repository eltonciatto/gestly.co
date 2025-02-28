import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AppError } from '../utils/errors';

const appointmentSchema = z.object({
  customer_id: z.string().uuid(),
  service_id: z.string().uuid(),
  attendant_id: z.string().uuid().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  notes: z.string().optional()
});

export const appointmentsRoutes: FastifyPluginAsync = async (fastify) => {
  // List appointments
  fastify.get('/', {
    schema: {
      description: 'List appointments',
      tags: ['appointments'],
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] },
          customerId: { type: 'string', format: 'uuid' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'array',
          items: { $ref: '#/components/schemas/Appointment' }
        }
      }
    }
  }, async (request) => {
    const querySchema = z.object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']).optional(),
      customerId: z.string().uuid().optional()
    });

    const query = querySchema.parse(request.query);

    const { rows } = await request.db.query(
      `SELECT a.*, 
        c.name as customer_name,
        s.name as service_name,
        s.duration,
        s.price
       FROM appointments a
       LEFT JOIN customers c ON a.customer_id = c.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.business_id = $1
       ORDER BY a.start_time DESC`,
      [request.user.business_id]
    );

    return rows;
  });

  // Get appointment
  fastify.get('/:id', async (request) => {
    const { id } = request.params as { id: string };

    const { rows } = await request.db.query(
      `SELECT a.*, 
        c.name as customer_name,
        s.name as service_name,
        s.duration,
        s.price
       FROM appointments a
       LEFT JOIN customers c ON a.customer_id = c.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.id = $1 AND a.business_id = $2`,
      [id, request.user.business_id]
    );

    if (!rows[0]) {
      throw AppError.notFound('Appointment not found');
    }

    return rows[0];
  });

  // Create appointment
  fastify.post('/', {
    schema: {
      description: 'Create a new appointment',
      tags: ['appointments'],
      body: {
        type: 'object',
        required: ['customer_id', 'service_id', 'start_time'],
        properties: {
          customer_id: { type: 'string', format: 'uuid' },
          service_id: { type: 'string', format: 'uuid' },
          start_time: { type: 'string', format: 'date-time' },
          notes: { type: 'string' }
        }
      },
      response: {
        201: {
          description: 'Appointment created',
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/Appointment' }
          }
        }
      }
    }
  }, async (request) => {
    const data = await appointmentSchema.parseAsync(request.body);

    // Validate time slot availability
    const { rows: conflicts } = await request.db.query(
      `SELECT id FROM appointments 
       WHERE business_id = $1 
       AND attendant_id = $2
       AND status != 'cancelled'
       AND (
         (start_time, end_time) OVERLAPS ($3::timestamp, $4::timestamp)
       )`,
      [
        request.user.business_id,
        data.attendant_id,
        data.start_time,
        data.end_time || data.start_time
      ]
    );

    if (conflicts.length > 0) {
      throw AppError.conflict('Time slot not available');
    }

    // Validate customer and service belong to business
    const { rows: validationRows } = await request.db.query(
      `SELECT 
        (SELECT id FROM customers WHERE id = $1 AND business_id = $3) as customer_id,
        (SELECT id FROM services WHERE id = $2 AND business_id = $3) as service_id`,
      [data.customer_id, data.service_id, request.user.business_id]
    );

    if (!validationRows[0]?.customer_id || !validationRows[0]?.service_id) {
      throw AppError.badRequest('Invalid customer or service');
    }

    // Create appointment
    const { rows } = await request.db.query(
      `INSERT INTO appointments (
        business_id, customer_id, service_id, attendant_id,
        start_time, end_time, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled')
      RETURNING *`,
      [
        request.user.business_id,
        data.customer_id,
        data.service_id,
        data.attendant_id,
        data.start_time,
        data.end_time || data.start_time, // Default end time
        data.notes
      ]
    );

    return rows[0];
  });

  // Update appointment
  fastify.patch('/:id', async (request) => {
    const { id } = request.params as { id: string };
    const data = appointmentSchema.partial().parse(request.body);

    const { rows } = await request.db.query(
      `UPDATE appointments
       SET 
        customer_id = COALESCE($3, customer_id),
        service_id = COALESCE($4, service_id),
        attendant_id = COALESCE($5, attendant_id),
        start_time = COALESCE($6, start_time),
        end_time = COALESCE($7, end_time),
        notes = COALESCE($8, notes)
       WHERE id = $1 AND business_id = $2
       RETURNING *`,
      [
        id,
        request.user.business_id,
        data.customer_id,
        data.service_id,
        data.attendant_id,
        data.start_time,
        data.end_time,
        data.notes
      ]
    );

    if (!rows[0]) {
      throw AppError.notFound('Appointment not found');
    }

    return rows[0];
  });

  // Delete appointment
  fastify.delete('/:id', async (request) => {
    const { id } = request.params as { id: string };

    const { rows } = await request.db.query(
      'DELETE FROM appointments WHERE id = $1 AND business_id = $2 RETURNING id',
      [id, request.user.business_id]
    );

    if (!rows[0]) {
      throw AppError.notFound('Appointment not found');
    }

    return { success: true };
  });
};