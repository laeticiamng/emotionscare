// @ts-nocheck
/**
 * analyze-error-patterns - Analyse des patterns d'erreurs via IA
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 5/min + CORS restrictif
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

Deno.serve(async (req) => {
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
    route: 'analyze-error-patterns',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Error pattern analysis - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting error pattern analysis...');

    // Récupérer les erreurs récentes (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: errors, error: errorsError } = await supabase
      .from('error_patterns_history')
      .select('*')
      .gte('occurred_at', thirtyDaysAgo.toISOString())
      .order('occurred_at', { ascending: false })
      .limit(500);

    if (errorsError) {
      console.error('Error fetching error patterns:', errorsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch error patterns' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!errors || errors.length === 0) {
      console.log('No error patterns found');
      return new Response(
        JSON.stringify({ message: 'No error patterns to analyze', suggestions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${errors.length} error patterns...`);

    // Grouper les erreurs par type et message similaire
    const errorGroups: Record<string, any[]> = {};
    
    errors.forEach((error: any) => {
      const key = `${error.error_type}:${error.error_message}`.slice(0, 100);
      if (!errorGroups[key]) {
        errorGroups[key] = [];
      }
      errorGroups[key].push(error);
    });

    console.log(`Grouped into ${Object.keys(errorGroups).length} patterns`);

    // Analyser avec l'IA les patterns les plus fréquents
    const sortedPatterns = Object.entries(errorGroups)
      .sort(([, a], [, b]) => b.length - a.length)
      .slice(0, 10); // Top 10 patterns

    const suggestions = [];

    for (const [pattern, errorList] of sortedPatterns) {
      const sampleErrors = errorList.slice(0, 5);
      
      const prompt = `Analyse ce pattern d'erreurs récurrent (${errorList.length} occurrences):

Type: ${sampleErrors[0].error_type}
Message: ${sampleErrors[0].error_message}
Sévérité: ${sampleErrors[0].severity}

Exemples de contexte:
${sampleErrors.map((e, i) => `${i + 1}. ${JSON.stringify(e.context || {})}`).join('\n')}

Stack traces (échantillon):
${sampleErrors[0].stack_trace || 'N/A'}

Suggère un template d'alerte optimisé pour ce pattern avec:
1. Un titre clair et actionable
2. Un corps de message informatif
3. Des variables dynamiques pertinentes
4. Des suggestions de résolution

Réponds au format JSON suivant:
{
  "pattern_name": "nom descriptif du pattern",
  "email_subject": "sujet email",
  "email_body": "corps avec variables {{var}}",
  "slack_template": "template slack JSON",
  "resolution_suggestions": ["suggestion 1", "suggestion 2"],
  "priority": "medium|high|critical",
  "confidence": 0.85
}`;

      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'Tu es un expert en analyse d\'erreurs et création de templates d\'alertes. Réponds uniquement en JSON valide.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (!aiResponse.ok) {
          console.error(`AI API error: ${aiResponse.status}`);
          continue;
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        
        if (!content) {
          console.error('No content in AI response');
          continue;
        }

        // Parser la réponse JSON
        let suggestion;
        try {
          // Extraire le JSON de la réponse (au cas où il y a du texte avant/après)
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            suggestion = JSON.parse(jsonMatch[0]);
          } else {
            suggestion = JSON.parse(content);
          }
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          continue;
        }

        // Sauvegarder la suggestion
        const { data: savedSuggestion, error: saveError } = await supabase
          .from('ai_template_suggestions')
          .insert({
            pattern_name: suggestion.pattern_name,
            error_pattern: {
              type: sampleErrors[0].error_type,
              message: sampleErrors[0].error_message,
              severity: sampleErrors[0].severity,
            },
            suggested_template: {
              email: {
                subject: suggestion.email_subject,
                body: suggestion.email_body,
              },
              slack: suggestion.slack_template,
              resolution: suggestion.resolution_suggestions,
              priority: suggestion.priority,
            },
            confidence_score: suggestion.confidence || 0.8,
            occurrences: errorList.length,
            sample_errors: sampleErrors.map((e) => ({
              id: e.id,
              occurred_at: e.occurred_at,
              context: e.context,
            })),
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving suggestion:', saveError);
        } else {
          console.log(`Saved suggestion for pattern: ${suggestion.pattern_name}`);
          suggestions.push(savedSuggestion);
        }
      } catch (aiError) {
        console.error('Error analyzing pattern:', aiError);
      }
    }

    console.log(`Analysis complete: ${suggestions.length} suggestions generated`);

    return new Response(
      JSON.stringify({
        success: true,
        patterns_analyzed: sortedPatterns.length,
        suggestions_generated: suggestions.length,
        suggestions,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-error-patterns:', error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
