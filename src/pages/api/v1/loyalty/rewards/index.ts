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

    // Buscar recompensas disponíveis
    const { data: recompensas, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('business_id', business.id)
      .eq('is_active', true)
      .order('pontos_necessarios');

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/loyalty/rewards', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: recompensas,
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar recompensas:', error);
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
    const { customerId, recompensaId } = body;

    // Validar campos obrigatórios
    if (!customerId || !recompensaId) {
      return new Response(
        JSON.stringify({ error: 'Cliente e recompensa são obrigatórios' }), 
        { status: 400 }
      );
    }

    // Verificar pontos do cliente
    const { data: pontos } = await supabase
      .rpc('calcular_pontos_cliente', {
        customer_id: customerId,
      });

    // Verificar recompensa
    const { data: recompensa } = await supabase
      .from('recompensas')
      .select('*')
      .eq('id', recompensaId)
      .single();

    if (!recompensa) {
      return new Response(
        JSON.stringify({ error: 'Recompensa não encontrada' }), 
        { status: 404 }
      );
    }

    if (!recompensa.is_active) {
      return new Response(
        JSON.stringify({ error: 'Recompensa não está disponível' }), 
        { status: 400 }
      );
    }

    if (pontos.pontos_disponiveis < recompensa.pontos_necessarios) {
      return new Response(
        JSON.stringify({ error: 'Pontos insuficientes' }), 
        { status: 400 }
      );
    }

    // Criar resgate
    const { data: resgate, error } = await supabase
      .from('resgates')
      .insert({
        business_id: business.id,
        customer_id: customerId,
        recompensa_id: recompensaId,
        pontos_usados: recompensa.pontos_necessarios,
        status: 'pendente',
      })
      .select()
      .single();

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/loyalty/rewards', 'POST', 201);

    return new Response(
      JSON.stringify({
        success: true,
        data: resgate,
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao resgatar recompensa:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};