import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { hashPassword } from '@/lib/auth/utils';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, password, business_name } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !business_name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Todos os campos são obrigatórios' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email já cadastrado' 
        }), 
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Start transaction
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .insert({
        email,
        full_name: name,
        password_hash: await hashPassword(password),
        role: 'admin'
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        owner_id: user.id,
        name: business_name,
        api_key: crypto.randomUUID()
      })
      .select()
      .single();

    if (businessError) throw businessError;

    // Update user with business_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ business_id: business.id })
      .eq('id', user.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        data: { 
          id: user.id 
        }
      }), 
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in register:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro ao criar conta. Tente novamente mais tarde.' 
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