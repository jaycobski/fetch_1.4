import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleCORS } from './cors.ts';
import { verifyAuth } from './auth.ts';
import { callPerplexityAPI, type PerplexityRequest } from './perplexity.ts';

serve(async (req) => {
  try {
    // Handle CORS preflight
    const corsResponse = handleCORS(req);
    if (corsResponse) return corsResponse;

    // Log request details
    console.log('Handling request:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers)
    });

    // Verify authentication
    const user = await verifyAuth(req);

    // Parse request body
    let body;
    try {
      const text = await req.text() || '{}';
      console.log('Request body text:', text);
      body = JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: error.message
        }), 
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Validate request body
    const { messages, model } = body as PerplexityRequest;

    if (!messages?.length) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!model) {
      return new Response(
        JSON.stringify({ error: 'Model parameter is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Call Perplexity API
    const data = await callPerplexityAPI({ messages, model });

    return new Response(
      JSON.stringify(data),
      { 
        status: 200, 
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, no-cache, must-revalidate, private'
        }
      }
    );

  } catch (error) {
    console.error('Edge function error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      headers: Object.fromEntries(req.headers),
      url: req.url,
      method: req.method
    });

    const status = error.message.includes('authorization') ? 401 : 500;
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.name
      }), 
      { 
        status, 
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, no-cache, must-revalidate, private'
        }
      }
    );
  }
});