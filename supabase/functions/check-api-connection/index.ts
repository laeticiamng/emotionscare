// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { user, status } = await authorizeRole(req, ['admin', 'b2b_admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('API key missing');
    }

    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${openAIApiKey}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    const availableModels = data.data.map((m: any) => m.id);
    const requiredModels = ['gpt-4o-mini-2024-07-18', 'gpt-4o-2024-08-06'];

    const hasRequiredModels = requiredModels.some(model =>
      availableModels.includes(model) ||
      availableModels.some((m: string) =>
        m.startsWith(model.split('-').slice(0, 2).join('-'))
      )
    );

    return new Response(JSON.stringify({
      connected: true,
      models: data.data?.length || 0,
      hasRequiredModels
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking OpenAI API connection:', error);
    return new Response(JSON.stringify({
      connected: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
