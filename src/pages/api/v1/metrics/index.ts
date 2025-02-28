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
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'Período é obrigatório' }), 
        { status: 400 }
      );
    }

    // Buscar métricas
    const { data: metricas, error } = await supabase
      .from('metricas_diarias')
      .select('*')
      .eq('business_id', business.id)
      .gte('data', startDate)
      .lte('data', endDate)
      .order('data');

    if (error) throw error;

    // Calcular totais
    const totais = metricas?.reduce((acc, curr) => ({
      total_agendamentos: acc.total_agendamentos + curr.total_agendamentos,
      agendamentos_realizados: acc.agendamentos_realizados + curr.agendamentos_realizados,
      agendamentos_cancelados: acc.agendamentos_cancelados + curr.agendamentos_cancelados,
      novos_clientes: acc.novos_clientes + curr.novos_clientes,
      faturamento: acc.faturamento + curr.faturamento,
    }), {
      total_agendamentos: 0,
      agendamentos_realizados: 0,
      agendamentos_cancelados: 0,
      novos_clientes: 0,
      faturamento: 0,
    });

    // Registrar requisição
    await logApiRequest(business.id, '/metrics', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          metricas,
          totais,
        },
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};