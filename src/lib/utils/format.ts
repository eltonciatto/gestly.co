import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um valor monetário para o formato brasileiro
 * @param value Valor a ser formatado
 * @returns String formatada (ex: R$ 1.234,56)
 */
export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

/**
 * Formata uma data para o formato brasileiro
 * @param date Data a ser formatada
 * @param pattern Padrão de formatação
 * @returns String formatada
 */
export const formatDate = (date: string | Date, pattern: string = "d 'de' MMMM 'às' HH:mm") => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, pattern, { locale: ptBR });
};

/**
 * Formata um número de telefone para o formato brasileiro
 * @param phone Número de telefone
 * @returns String formatada ((99) 99999-9999)
 */
export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};