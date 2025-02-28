import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { checkRateLimit, logApiRequest } from '@/lib/api-limits';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    const { 
      appointment_id,
      customer_id,
      nota,
      comentario,
      anonimo = false 
    } = body;

    // Validar campos obrigatórios
    if (!appointment_id || !customer_id || !nota) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }), 
        { status: 400 }
      );
    }

    // Validar nota
    if (nota < 1 || nota > 5) {
      return new Response(
        JSON.stringify({ error: 'Nota deve ser entre 1 e 5' }), 
        { status: 400 }
      );
    }

    // Verificar se o agendamento existe e pertence ao negócio
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id, status')
      .eq('id', appointment_id)
      .eq('business_id', business.id)
      .single();

    if (appointmentError || !appointment) {
      return new Response(
        JSON.stringify({ error: 'Agendamento não encontrado' }), 
        { status: 404 }
      );
    }

    // Verificar se o agendamento foi concluído
    if (appointment.status !== 'completed') {
      return new Response(
        JSON.stringify({ error: 'Agendamento não foi concluído' }), 
        { status: 400 }
      );
    }

    // Verificar se já existe avaliação para este agendamento
    const { data: existingReview } = await supabase
      .from('avaliacoes')
      .select('id')
      .eq('appointment_id', appointment_id)
      .single();

    if (existingReview) {
      return new Response(
        JSON.stringify({ error: 'Agendamento já foi avaliado' }), 
        { status: 400 }
      );
    }

    // Criar avaliação
    const { data: avaliacao, error } = await supabase
      .from('avaliacoes')
      .insert({
        business_id: business.id,
        customer_id,
        appointment_id,
        nota,
        comentario,
        anonimo
      })
      .select(`
        id,
        nota,
        comentario,
        anonimo,
        created_at,
        customer:customers (
          id,
          name
        ),
        appointment:appointments (
          id,
          service:services (
            id,
            name
          )
        )
      `)
      .single();

    if (error) throw error;

    // Registrar requisição
    await logApiRequest(business.id, '/reviews/create', 'POST', 201);

    return new Response(
      JSON.stringify({
        success: true,
        data: avaliacao,
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500 }
    );
  }
};