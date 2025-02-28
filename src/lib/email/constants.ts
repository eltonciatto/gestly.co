export const EMAIL_ERROR_CODES = {
  CONFIG_ERROR: 'smtp_config_error',
  INVALID_EMAIL: 'invalid_email', 
  SEND_ERROR: 'email_send_error',
  SMTP_ERROR: 'smtp_connection_error',
  RATE_LIMIT: 'rate_limit_error',
  SPAM_FILTER: 'spam_filter_error'
} as const;

export const EMAIL_ERRORS = {
  [EMAIL_ERROR_CODES.CONFIG_ERROR]: 'Erro de configuração do servidor de email. Nossa equipe foi notificada.',
  [EMAIL_ERROR_CODES.INVALID_EMAIL]: 'O endereço de email informado é inválido. Por favor, verifique e tente novamente.',
  [EMAIL_ERROR_CODES.SEND_ERROR]: 'Não foi possível enviar o email. Por favor, tente novamente em alguns instantes.',
  [EMAIL_ERROR_CODES.SMTP_ERROR]: 'Erro de conexão com servidor de email. Por favor, tente novamente.',
  [EMAIL_ERROR_CODES.RATE_LIMIT]: 'Muitas tentativas. Por favor, aguarde alguns minutos antes de tentar novamente.',
  [EMAIL_ERROR_CODES.SPAM_FILTER]: 'O email pode ter sido bloqueado por filtros anti-spam. Verifique sua pasta de spam ou use outro email.'
} as const;