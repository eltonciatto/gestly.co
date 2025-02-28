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

    // Parâmetros de consulta
    const url = new URL(request.url);
    const customerId = url.searchParams.get('customer_id');

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'ID do cliente é obrigatório' }), 
        { status: 400 }
      );
    }

    // Calcular pontos do cliente
    const { data: pontos, error } = await supabase
      .rpc('calcular_pontos_cliente', {
        customer_id: customerId,
      });

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/loyalty/points', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: pontos,
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar pontos:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};