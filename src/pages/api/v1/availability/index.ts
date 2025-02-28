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
    const date = url.searchParams.get('date');
    const serviceId = url.searchParams.get('service_id');

    if (!date || !serviceId) {
      return new Response(
        JSON.stringify({ error: 'Data e serviço são obrigatórios' }), 
        { status: 400 }
      );
    }

    // Buscar duração do serviço
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (!service) {
      return new Response(
        JSON.stringify({ error: 'Serviço não encontrado' }), 
        { status: 404 }
      );
    }

    // Buscar horário de funcionamento
    const { data: horario } = await supabase
      .from('horarios_funcionamento')
      .select('*')
      .eq('business_id', business.id)
      .eq('dia_semana', new Date(date).getDay())
      .single();

    if (!horario) {
      return new Response(
        JSON.stringify({ 
          success: true,
          data: {
            date,
            available: false,
            reason: 'Estabelecimento fechado neste dia'
          }
        }), 
        { status: 200 }
      );
    }

    // Verificar dias especiais
    const { data: diaEspecial } = await supabase
      .from('dias_especiais')
      .select('*')
      .eq('business_id', business.id)
      .eq('data', date)
      .single();

    if (diaEspecial?.fechado) {
      return new Response(
        JSON.stringify({ 
          success: true,
          data: {
            date,
            available: false,
            reason: diaEspecial.nome
          }
        }), 
        { status: 200 }
      );
    }

    // Buscar agendamentos do dia
    const { data: agendamentos } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('business_id', business.id)
      .eq('status', 'scheduled')
      .gte('start_time', `${date}T00:00:00`)
      .lte('start_time', `${date}T23:59:59`)
      .order('start_time');

    // Calcular horários disponíveis
    const horariosDisponiveis = [];
    const inicio = new Date(`${date}T${horario.hora_inicio}`);
    const fim = new Date(`${date}T${horario.hora_fim}`);
    const intervalo = service.duration;

    let atual = new Date(inicio);
    while (atual < fim) {
      const horarioOcupado = agendamentos?.some(agendamento => {
        const inicio = new Date(agendamento.start_time);
        const fim = new Date(agendamento.end_time);
        return atual >= inicio && atual < fim;
      });

      if (!horarioOcupado) {
        horariosDisponiveis.push(atual.toISOString());
      }

      atual = new Date(atual.getTime() + intervalo * 60000);
    }

    // Registrar requisição
    await logApiRequest(business.id, '/availability', 'GET', 200);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          date,
          available: horariosDisponiveis.length > 0,
          slots: horariosDisponiveis,
        },
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};