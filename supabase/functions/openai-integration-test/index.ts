// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'OPENAI_API_KEY not configured',
        status: 'missing_key',
        integration_status: 'failed'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Test 1: Vérifier la clé API avec un simple appel models
    console.log('🔍 Testing OpenAI API key validity...');
    const modelsResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!modelsResponse.ok) {
      const errorText = await modelsResponse.text();
      console.error('❌ Models API failed:', errorText);
      return new Response(JSON.stringify({ 
        error: 'Invalid OpenAI API key',
        status: 'invalid_key',
        integration_status: 'failed',
        details: errorText
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const modelsData = await modelsResponse.json();
    console.log('✅ API Key valid, available models:', modelsData.data?.length || 0);

    // Test 2: Effectuer un appel de test avec le nouveau modèle recommandé
    console.log('🧪 Testing chat completion with gpt-4.1-2025-04-14...');
    const testResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for EmotionsCare platform integration testing.'
          },
          {
            role: 'user',
            content: 'Please respond with "Integration test successful" to confirm the API is working.'
          }
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    if (!testResponse.ok) {
      // Fallback vers gpt-4o-mini si le nouveau modèle n'est pas disponible
      console.log('⚠️ gpt-4.1-2025-04-14 not available, testing fallback model...');
      const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for EmotionsCare platform integration testing.'
            },
            {
              role: 'user',
              content: 'Please respond with "Integration test successful" to confirm the API is working.'
            }
          ],
          max_tokens: 50,
          temperature: 0.1,
        }),
      });

      if (!fallbackResponse.ok) {
        const errorText = await fallbackResponse.text();
        console.error('❌ Chat completion failed:', errorText);
        return new Response(JSON.stringify({ 
          error: 'Chat completion test failed',
          status: 'api_error',
          integration_status: 'failed',
          details: errorText
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const fallbackData = await fallbackResponse.json();
      console.log('✅ Fallback model works:', fallbackData.choices[0]?.message?.content);
      
      return new Response(JSON.stringify({
        status: 'success',
        integration_status: 'working_with_fallback',
        api_key_status: 'valid',
        test_response: fallbackData.choices[0]?.message?.content,
        recommended_model: 'gpt-4o-mini',
        available_models_count: modelsData.data?.length || 0,
        message: 'Integration successful but using fallback model (gpt-4o-mini instead of gpt-4.1-2025-04-14)'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const testData = await testResponse.json();
    console.log('✅ Test completion successful:', testData.choices[0]?.message?.content);

    return new Response(JSON.stringify({
      status: 'success',
      integration_status: 'fully_working',
      api_key_status: 'valid',
      test_response: testData.choices[0]?.message?.content,
      recommended_model: 'gpt-4.1-2025-04-14',
      available_models_count: modelsData.data?.length || 0,
      message: 'OpenAI integration is working perfectly with the latest recommended model'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Integration test error:', error);
    return new Response(JSON.stringify({ 
      error: 'Integration test failed',
      status: 'system_error',
      integration_status: 'failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});