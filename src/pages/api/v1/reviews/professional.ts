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

    // Get professional ID from query params
    const url = new URL(request.url);
    const professionalId = url.searchParams.get('professional_id');

    // Get reviews stats
    const { data: stats, error } = await supabase.rpc(
      'get_professional_reviews',
      { 
        p_business_id: business.id,
        p_attendant_id: professionalId || null
      }
    );

    if (error) throw error;

    // Log request
    await logApiRequest(business.id, '/reviews/professional', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: stats,
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching professional reviews:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};