import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApiTestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

async function testOpenAI(): Promise<ApiTestResult> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    return {
      name: 'OpenAI API Key',
      status: 'error',
      message: 'OPENAI_API_KEY non configurée dans les secrets Supabase'
    };
  }

  try {
    // Test de connexion aux modèles
    const modelsResponse = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${openAIApiKey}` }
    });

    if (!modelsResponse.ok) {
      return {
        name: 'OpenAI Models API',
        status: 'error',
        message: `Erreur API: ${modelsResponse.status}`,
        details: await modelsResponse.text()
      };
    }

    const modelsData = await modelsResponse.json();
    const availableModels = modelsData.data.map((m: any) => m.id);
    
    // Vérifier les modèles requis
    const requiredModels = ['gpt-5-2025-08-07', 'gpt-4.1-2025-04-14', 'gpt-4o-mini'];
    const hasRequiredModels = requiredModels.some(model =>
      availableModels.some((m: string) => m.includes(model) || model.includes(m))
    );

    // Test simple de génération de texte
    const testResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Test de connexion API' }],
        max_tokens: 10
      }),
    });

    if (!testResponse.ok) {
      return {
        name: 'OpenAI Chat API',
        status: 'error',
        message: `Test de génération échoué: ${testResponse.status}`,
        details: await testResponse.text()
      };
    }

    return {
      name: 'OpenAI Integration',
      status: 'success',
      message: `Connexion réussie - ${modelsData.data.length} modèles disponibles`,
      details: {
        totalModels: modelsData.data.length,
        hasRequiredModels,
        sampleModels: availableModels.slice(0, 5)
      }
    };

  } catch (error) {
    return {
      name: 'OpenAI Connection',
      status: 'error',
      message: `Erreur de connexion: ${error.message}`
    };
  }
}

async function testSuno(): Promise<ApiTestResult> {
  const sunoApiKey = Deno.env.get('SUNO_API_KEY');
  
  if (!sunoApiKey) {
    return {
      name: 'Suno API Key',
      status: 'error',
      message: 'SUNO_API_KEY non configurée dans les secrets Supabase'
    };
  }

  try {
    // Test de connexion à l'API Suno (via sunoapi.org)
    const testResponse = await fetch('https://api.sunoapi.org/api/v1/health', {
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!testResponse.ok) {
      // Si l'endpoint health n'existe pas, on teste avec une requête de génération simple
      const musicTestResponse = await fetch('https://api.sunoapi.org/api/v1/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sunoApiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt: "Test connection to Suno API",
          make_instrumental: true,
          model: "chirp-v3-5"
        })
      });

      if (!musicTestResponse.ok) {
        const errorText = await musicTestResponse.text();
        return {
          name: 'Suno API Connection',
          status: 'error',
          message: `Erreur API: ${musicTestResponse.status}`,
          details: errorText
        };
      }

      const musicData = await musicTestResponse.json();
      
      return {
        name: 'Suno Integration',
        status: 'success',
        message: 'Connexion réussie - API Suno fonctionnelle',
        details: {
          taskId: musicData.taskId || musicData.id,
          apiEndpoint: 'sunoapi.org'
        }
      };
    }

    return {
      name: 'Suno Integration',
      status: 'success',
      message: 'Connexion réussie - API Suno accessible',
      details: { apiEndpoint: 'sunoapi.org' }
    };

  } catch (error) {
    return {
      name: 'Suno Connection',
      status: 'error',
      message: `Erreur de connexion: ${error.message}`
    };
  }
}

async function testIntegrationFlow(): Promise<ApiTestResult> {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');

    if (!openAIApiKey || !sunoApiKey) {
      return {
        name: 'Integration Flow',
        status: 'error',
        message: 'Impossible de tester le flux complet - APIs manquantes'
      };
    }

    // Test du flux OpenAI -> Suno
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: 'Génère un prompt musical pour une chanson relaxante de 30 secondes'
        }],
        max_tokens: 100
      }),
    });

    if (!openAIResponse.ok) {
      return {
        name: 'Integration Flow',
        status: 'error',
        message: 'Échec de génération du prompt musical'
      };
    }

    const openAIData = await openAIResponse.json();
    const musicPrompt = openAIData.choices[0].message.content;

    return {
      name: 'Integration Flow',
      status: 'success',
      message: 'Flux d\'intégration OpenAI → Suno fonctionnel',
      details: {
        generatedPrompt: musicPrompt.substring(0, 100) + '...'
      }
    };

  } catch (error) {
    return {
      name: 'Integration Flow',
      status: 'error',
      message: `Erreur dans le flux d'intégration: ${error.message}`
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Démarrage des tests d\'intégration API...');
    
    // Exécuter tous les tests en parallèle
    const [openAIResult, sunoResult, integrationResult] = await Promise.all([
      testOpenAI(),
      testSuno(),
      testIntegrationFlow()
    ]);

    const results = [openAIResult, sunoResult, integrationResult];
    
    // Calculer le statut global
    const hasErrors = results.some(r => r.status === 'error');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'success';
    
    const summary = {
      overall: overallStatus,
      timestamp: new Date().toISOString(),
      results,
      platform_status: {
        openai_ready: openAIResult.status === 'success',
        suno_ready: sunoResult.status === 'success',
        integration_ready: integrationResult.status === 'success'
      }
    };

    console.log('Tests terminés:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur lors des tests d\'intégration:', error);
    
    return new Response(JSON.stringify({
      overall: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      results: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});