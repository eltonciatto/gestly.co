import { z } from 'zod';

export const appointmentSchema = z.object({
  customer_id: z.string().uuid(),
  service_id: z.string().uuid(),
  attendant_id: z.string().uuid().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  notes: z.string().optional()
});

export const customerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const serviceSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  duration: z.number().min(1).max(480),
  price: z.number().min(0).max(99999.99),
  commission_percentage: z.number().min(0).max(100).default(40)
});