import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const apiKey = request.headers.get('x-api-key');

    // Validate API key
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (businessError || !business) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
      });
    }

    // Handle different webhook types
    switch (body.type) {
      case 'appointment.create':
        return handleAppointmentCreate(body, business.id);
      case 'appointment.update':
        return handleAppointmentUpdate(body, business.id);
      case 'customer.create':
        return handleCustomerCreate(body, business.id);
      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported webhook type' }), 
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}

async function handleAppointmentCreate(body: any, businessId: string) {
  const { customer, service, startTime, endTime, notes } = body;

  // Validate required fields
  if (!customer || !service || !startTime) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }), 
      { status: 400 }
    );
  }

  try {
    // Find or create customer
    let customerId = customer.id;
    if (!customerId) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          business_id: businessId,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        })
        .select('id')
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        business_id: businessId,
        customer_id: customerId,
        service_id: service.id,
        start_time: startTime,
        end_time: endTime || new Date(new Date(startTime).getTime() + 3600000).toISOString(),
        notes,
        status: 'scheduled',
      })
      .select()
      .single();

    if (appointmentError) throw appointmentError;

    return new Response(
      JSON.stringify({ success: true, data: appointment }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create appointment' }), 
      { status: 500 }
    );
  }
}

async function handleAppointmentUpdate(body: any, businessId: string) {
  const { appointmentId, status, notes } = body;

  if (!appointmentId || !status) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }), 
      { status: 400 }
    );
  }

  try {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status,
        notes: notes || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data: appointment }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update appointment' }), 
      { status: 500 }
    );
  }
}

async function handleCustomerCreate(body: any, businessId: string) {
  const { name, email, phone, notes } = body;

  if (!name || !phone) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields' }), 
      { status: 400 }
    );
  }

  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        business_id: businessId,
        name,
        email,
        phone,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data: customer }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create customer' }), 
      { status: 500 }
    );
  }
}