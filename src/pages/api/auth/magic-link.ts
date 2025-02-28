import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { sendEmail } from '@/lib/email';
import { env } from '@/lib/env';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email é obrigatório' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Generate magic link token
    const token = crypto.randomUUID();
    const magicLink = `${env.VITE_APP_URL}/auth/confirm?token=${token}&email=${encodeURIComponent(email)}`;

    // Store token in database
    const { error: tokenError } = await supabase
      .from('auth_tokens')
      .insert({
        token,
        email,
        type: 'magic_link',
        expires_at: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      });

    if (tokenError) {
      console.error('Error storing token:', tokenError);
      throw new Error('Database error');
    }

    // Send magic link email
    await sendEmail({
      to: email,
      subject: 'Link de Acesso - Gestly',
      html: `
        <h2>Link de Acesso</h2>
        <p>Clique no link abaixo para acessar sua conta:</p>
        <a href="${magicLink}">Acessar Conta</a>
        <p>Este link expira em 30 minutos.</p>
        <p>Se você não solicitou este acesso, ignore este email.</p>
      `
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: { message: 'Magic link sent successfully' }
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in magic link:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro ao enviar link de acesso. Tente novamente mais tarde.' 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};