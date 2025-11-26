// @ts-nocheck
/**
 * monitor-api-usage - Surveillance de l'utilisation des API
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 10/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'monitor-api-usage',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'API usage monitoring - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    if (!openAIApiKey) {
      console.error("OpenAI API key not configured");
      throw new Error("OpenAI API key is not configured");
    }

    // Get usage data from OpenAI API
    const response = await fetch('https://api.openai.com/v1/usage', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    // Process the usage data
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter for current month's usage
    const monthlyUsage = data.data?.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= firstDayOfMonth;
    });

    // Calculate costs per model
    const modelUsage = {};
    let totalCost = 0;

    // Define cost mapping (USD per 1000 tokens)
    const costMapping = {
      "gpt-4.1-2025-04-14": { input: 2.00, output: 8.00 },
      "gpt-4.1-mini-2025-04-14": { input: 0.40, output: 1.60 },
      "gpt-4.1-nano-2025-04-14": { input: 0.10, output: 0.40 },
      "gpt-4.5-preview-2025-02-27": { input: 75.00, output: 150.00 },
      "gpt-4o-2024-08-06": { input: 2.50, output: 10.00 },
      "gpt-4o-mini-2024-07-18": { input: 0.15, output: 0.60 },
      "o1-2024-12-17": { input: 15.00, output: 60.00 },
      "o1-pro-2025-03-19": { input: 150.00, output: 600.00 },
      "o3-2025-04-16": { input: 10.00, output: 40.00 },
      "o4-mini-2025-04-16": { input: 1.10, output: 4.40 },
      "o3-mini-2025-01-31": { input: 1.10, output: 4.40 }
    };

    // Calculate costs
    monthlyUsage?.forEach(entry => {
      const model = entry.snapshot_id;
      const tokenType = entry.operation === 'completion' ? 'output' : 'input';
      const costPerThousand = costMapping[model]?.[tokenType] || 0;
      const cost = (entry.n_context_tokens_total / 1000) * costPerThousand;
      
      if (!modelUsage[model]) {
        modelUsage[model] = 0;
      }
      modelUsage[model] += cost;
      totalCost += cost;
    });

    // Add total cost
    modelUsage.total = totalCost;

    return new Response(JSON.stringify({ 
      usage: modelUsage,
      period: {
        start: firstDayOfMonth.toISOString(),
        end: now.toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in monitor-api-usage function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      usage: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
