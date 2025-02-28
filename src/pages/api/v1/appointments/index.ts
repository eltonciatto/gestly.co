import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { checkRateLimit, logApiRequest } from '@/lib/api-limits';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const GET: APIRoute = async ({ request }) => {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key não fornecida' }), 
        { status: 401 }
      );
    }

    // Validar API key e obter business_id
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (businessError || !business) {
      return new Response(
        JSON.stringify({ error: 'API key inválida' }), 
        { status: 401 }
      );
    }

    // Verificar limite de requisições
    const dentroDoLimite = await checkRateLimit(business.id);
    if (!dentroDoLimite) {
      return new Response(
        JSON.stringify({ error: 'Limite de requisições excedido' }), 
        { status: 429 }
      );
    }

    // Parâmetros de consulta
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customer_id');
    const status = url.searchParams.get('status');
    const attendantId = url.searchParams.get('attendant_id');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    // Construir query
    let query = supabase
      .from('appointments')
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        customers (
          id,
          name,
          email,
          phone
        ),
        attendant:profiles (
          id,
          full_name
        ),
        services (
          id,
          name,
          duration,
          price
        )
      `)
      .eq('business_id', business.id)
      .order('start_time', { ascending: true });

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (attendantId) {
      query = query.eq('attendant_id', attendantId);
    }
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    if (endDate) {
      query = query.lte('start_time', endDate);
    }

    const { data: appointments, error } = await query;

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/appointments', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: appointments,
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key não fornecida' }), 
        { status: 401 }
      );
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('api_key', apiKey)
      .single();

    if (businessError || !business) {
      return new Response(
        JSON.stringify({ error: 'API key inválida' }), 
        { status: 401 }
      );
    }

    const dentroDoLimite = await checkRateLimit(business.id);
    if (!dentroDoLimite) {
      return new Response(
        JSON.stringify({ error: 'Limite de requisições excedido' }), 
        { status: 429 }
      );
    }

    const body = await request.json();
    const { customer, service, attendant_id, startTime, endTime, notes } = body;

    // Validar campos obrigatórios incluindo profissional
    if (!customer || !service || !startTime || !attendant_id) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }), 
        { status: 400 }
      );
    }

    // Verificar disponibilidade do horário
    const { data: horarioDisponivel } = await supabase
      .rpc('check_horario_disponivel', {
        business_id: business.id,
        attendant_id: attendant_id,
        data_consulta: startTime.split('T')[0],
        hora_consulta: startTime.split('T')[1].slice(0, 5)
      });

    if (!horarioDisponivel) {
      return new Response(
        JSON.stringify({ error: 'Horário não disponível' }), 
        { status: 400 }
      );
    }

    // Criar ou buscar cliente
    let customerId = customer.id;
    if (!customerId) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          business_id: business.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        })
        .select('id')
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // Criar agendamento
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        business_id: business.id,
        customer_id: customerId,
        service_id: service.id,
        attendant_id,
        start_time: startTime,
        end_time: endTime || new Date(new Date(startTime).getTime() + 3600000).toISOString(),
        notes,
        status: 'scheduled',
      })
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        customers (
          id,
          name,
          email,
          phone
        ),
        services (
          id,
          name,
          duration,
          price
        )
      `)
      .single();

    if (appointmentError) throw appointmentError;

    // Registrar requisição
    await logApiRequest(business.id, '/appointments', 'POST', 201);

    return new Response(
      JSON.stringify({
        success: true,
        data: appointment,
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};