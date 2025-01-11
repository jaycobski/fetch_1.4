const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface PerplexityRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
  model: string;
}

export const callPerplexityAPI = async (request: PerplexityRequest) => {
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    console.error('Missing Perplexity API key');
    throw new Error('Missing Perplexity API key');
  }

  console.log('Calling Perplexity API with request:', {
    model: request.model,
    messageCount: request.messages?.length,
    firstMessage: request.messages?.[0]?.content?.substring(0, 100)
  });

  try {
    // Validate request before sending
    if (!request.messages?.length || !request.model) {
      throw new Error('Invalid request format: missing required fields');
    }

    const requestBody = JSON.stringify(request);
    console.log('Request body:', requestBody);

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: requestBody,
    });

    const responseText = await response.text();
    console.log('Raw API response length:', responseText.length);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      console.error('API error response:', {
        status: response.status,
        body: responseText.substring(0, 1000),
        headers: Object.fromEntries(response.headers)
      });
      throw new Error(`Perplexity API error: ${response.status} ${responseText.substring(0, 100)}`);
    }

    if (!responseText) {
      console.error('Empty response from API');
      throw new Error('Empty response from Perplexity API');
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed API response:', {
        status: response.status,
        choicesCount: data.choices?.length,
        firstChoice: data.choices?.[0]?.message?.content?.substring(0, 100)
      });
      return data;
    } catch (e) {
      console.error('Failed to parse response:', {
        error: e,
        responseText: responseText.substring(0, 1000)
      });
      throw new Error('Invalid JSON response from Perplexity API');
    }
  } catch (error) {
    console.error('API call failed:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};