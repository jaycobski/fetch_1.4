// CORS headers configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.yfetch.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

// Handle CORS preflight requests
export const handleCORS = (req: Request) => {
  // Always handle OPTIONS first
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': 'https://app.yfetch.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept'
      }
    });
  }
  return null;
};