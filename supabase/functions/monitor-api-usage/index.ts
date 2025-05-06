
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("API key missing");
    }

    // In a production environment, this would query the OpenAI API for usage data
    // For now, return mock data for demonstration
    const mockUsage = {
      'gpt-4.1-2025-04-14': 45.75,  // $45.75 spent on gpt-4.1
      'gpt-4o-2024-08-06': 22.30,   // $22.30 spent on gpt-4o
      'gpt-4o-mini-2024-07-18': 5.25 // $5.25 spent on gpt-4o-mini
    };

    const totalSpend = Object.values(mockUsage).reduce((sum, cost) => sum + cost, 0);

    return new Response(JSON.stringify({ 
      usage: mockUsage,
      totalSpend,
      billingCycle: {
        start: '2025-05-01',
        end: '2025-05-31'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error monitoring API usage:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      usage: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
