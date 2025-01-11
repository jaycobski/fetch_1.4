import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { corsHeaders } from './cors.ts';

export const verifyAuth = async (req: Request) => {
  // Verify JWT token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.log('Missing authorization header');
    throw new Error('Missing authorization header');
  }

  const jwt = authHeader.replace('Bearer ', '');
  console.log('JWT token received');

  // Create Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  const supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  // Verify the JWT
  console.log('Verifying JWT token...');
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);
  
  if (authError || !user) {
    console.error('JWT verification failed:', authError);
    throw new Error('Invalid authorization token');
  }

  console.log('JWT verified successfully for user:', user.id);
  return user;
};