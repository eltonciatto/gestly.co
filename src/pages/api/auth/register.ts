import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import { hashPassword } from '@/lib/auth/utils';

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
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      throw new Error('Database error');
    }

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

    // Create user with Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'admin'
        }
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      throw new Error('Authentication error');
    }

    if (!authUser.user) {
      throw new Error('Failed to create user');
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email,
        full_name: name,
        role: 'admin'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw new Error('Database error');
    }

    // Create business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        owner_id: profile.id,
        name: business_name,
        api_key: crypto.randomUUID()
      })
      .select()
      .single();

    if (businessError) {
      console.error('Error creating business:', businessError);
      throw new Error('Database error');
    }

    // Update profile with business_id
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ business_id: business.id })
      .eq('id', profile.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error('Database error');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { 
          id: profile.id 
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
    
    // Return appropriate error response
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro ao criar conta. Tente novamente mais tarde.';
      
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
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