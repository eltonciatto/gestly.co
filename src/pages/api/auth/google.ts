import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
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

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get Google OAuth URL
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${env.VITE_APP_URL}/auth/callback`
      }
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        data: { url: data.url }
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in Google auth:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro ao iniciar autenticação com Google. Tente novamente mais tarde.' 
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