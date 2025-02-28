import { supabase } from './supabase';

export interface ProgramaFidelidade {
  id: string;
  nome: string;
  pontos_por_real: number;
  validade_pontos?: number;
  regras?: string;
  is_active: boolean;
}

export interface Recompensa {
  id: string;
  nome: string;
  descricao?: string;
  pontos_necessarios: number;
  quantidade_disponivel?: number;
  is_active: boolean;
}

export async function criarProgramaFidelidade(
  businessId: string,
  programa: Omit<ProgramaFidelidade, 'id'>
) {
  const { data, error } = await supabase
    .from('programas_fidelidade')
    .insert({
      business_id: businessId,
      ...programa,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adicionarRecompensa(
  businessId: string,
  recompensa: Omit<Recompensa, 'id'>
) {
  const { data, error } = await supabase
    .from('recompensas')
    .insert({
      business_id: businessId,
      ...recompensa,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function calcularPontosCliente(customerId: string) {
  const { data, error } = await supabase
    .rpc('calcular_pontos_cliente', {
      customer_id: customerId,
    });

  if (error) throw error;
  return data;
}

export async function resgatarRecompensa(
  businessId: string,
  customerId: string,
  recompensaId: string
) {
  const { data: pontos } = await calcularPontosCliente(customerId);
  const { data: recompensa } = await supabase
    .from('recompensas')
    .select('pontos_necessarios')
    .eq('id', recompensaId)
    .single();

  if (!recompensa || pontos.pontos_disponiveis < recompensa.pontos_necessarios) {
    throw new Error('Pontos insuficientes');
  }

  const { error } = await supabase.from('resgates').insert({
    business_id: businessId,
    customer_id: customerId,
    recompensa_id: recompensaId,
    pontos_usados: recompensa.pontos_necessarios,
    status: 'pendente',
  });

  if (error) throw error;
}

export async function aprovarResgate(resgateId: string) {
  const { error } = await supabase
    .from('resgates')
    .update({
      status: 'aprovado',
      updated_at: new Date().toISOString(),
    })
    .eq('id', resgateId);

  if (error) throw error;
}

export async function marcarResgateComoUsado(resgateId: string) {
  const { error } = await supabase
    .from('resgates')
    .update({
      status: 'usado',
      usado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', resgateId);

  if (error) throw error;
}