import { AppError } from './error';
import { env } from './env';
import { EMAIL_ERROR_CODES } from './email/constants';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Send email function using Netlify Function
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...options,
        from: {
          name: env.VITE_SMTP_SENDER_NAME,
          email: env.VITE_SMTP_SENDER_EMAIL
        }
      })
    });

    if (!response.ok) {
      throw new AppError('Failed to send email', EMAIL_ERROR_CODES.SEND_ERROR);
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error instanceof AppError ? error : new AppError('Failed to send email', EMAIL_ERROR_CODES.SEND_ERROR);
  }
}

// Helper function to validate email address
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Send magic link email
export async function sendMagicLink(email: string, name: string = ''): Promise<boolean> {
  try {
    // Validate email
    if (!validateEmail(email)) {
      throw new AppError('Invalid email address', EMAIL_ERROR_CODES.INVALID_EMAIL);
    }

    // Generate token and link
    const token = crypto.randomUUID();
    const link = `${env.VITE_APP_URL}/auth/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    // Send email
    return await sendEmail({
      to: email,
      subject: 'Link de Acesso - Gestly',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.5;
              color: #1f2937;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #2563eb;
              color: white !important;
              text-decoration: none;
              border-radius: 6px;
              font-family: system-ui, -apple-system, sans-serif;
              margin: 16px 0;
            }
            .footer {
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Link de Acesso</h2>
            <p>Olá ${name || email.split('@')[0]},</p>
            <p>Clique no botão abaixo para acessar sua conta:</p>
            <a href="${link}" class="button">
              Acessar Conta
            </a>
            <p>Este link expira em 30 minutos.</p>
            <p>Se você não solicitou este acesso, ignore este email.</p>
            <div class="footer">
              <p>Gestly - Gestão de Agendamentos</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error('Magic link error:', error);
    throw error instanceof AppError ? error : new AppError('Failed to send magic link', EMAIL_ERROR_CODES.SEND_ERROR);
  }
}