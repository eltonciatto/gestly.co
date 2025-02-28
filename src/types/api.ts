export interface WebhookPayload {
  type: 'appointment.create' | 'appointment.update' | 'customer.create';
  customer?: {
    id?: string;
    name: string;
    email?: string;
    phone: string;
  };
  service?: {
    id: string;
    name?: string;
    duration?: number;
    price?: number;
  };
  startTime?: string;
  endTime?: string;
  notes?: string;
  appointmentId?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}