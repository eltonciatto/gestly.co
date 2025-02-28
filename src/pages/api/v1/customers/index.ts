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

    // Parâmetros de busca
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const phone = url.searchParams.get('phone');
    const email = url.searchParams.get('email');

    let query = supabase
      .from('customers')
      .select(`
        id,
        name,
        email,
        phone,
        created_at,
        appointments (
          id,
          start_time,
          end_time,
          status,
          services (
            id,
            name
          )
        )
      `)
      .eq('business_id', business.id)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (phone) {
      query = query.eq('phone', phone);
    }
    if (email) {
      query = query.eq('email', email);
    }

    const { data: customers, error } = await query;

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/customers', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: customers,
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
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
    const { name, email, phone, notes } = body;

    // Validar campos obrigatórios
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Nome e telefone são obrigatórios' }), 
        { status: 400 }
      );
    }

    // Verificar se cliente já existe
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('business_id', business.id)
      .eq('phone', phone)
      .maybeSingle();

    if (existingCustomer) {
      return new Response(
        JSON.stringify({ error: 'Cliente já cadastrado' }), 
        { status: 400 }
      );
    }

    // Criar cliente
    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        business_id: business.id,
        name,
        email,
        phone,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/customers', 'POST', 201);

    return new Response(
      JSON.stringify({
        success: true,
        data: customer,
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};