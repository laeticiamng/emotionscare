import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify JWT and get user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader }
    });
    
    if (!userResponse.ok) {
      throw new Error('Unauthorized');
    }
    
    const user = await userResponse.json();
    if (!user?.id) {
      throw new Error('Invalid user');
    }

    const { action, emotion, intensity, duration, journeyId } = await req.json();

    console.log('Therapeutic journey request:', { action, emotion, intensity, duration, journeyId, userId: user.id });

    // Action: Generate personalized journey
    if (action === 'generate') {
      if (!lovableApiKey) {
        throw new Error('LOVABLE_API_KEY not configured');
      }

      const systemPrompt = `Tu es un thérapeute expert en thérapies émotionnelles intégratives.
Tu crées des parcours thérapeutiques personnalisés basés sur:
- L'émotion cible (${emotion})
- L'intensité émotionnelle (${intensity}/10)
- La durée souhaitée (${duration} minutes)

Génère un parcours thérapeutique structuré avec:
1. Un titre évocateur
2. Une introduction thérapeutique
3. 4-6 segments progressifs avec:
   - Titre du segment
   - Type de technique (respiration, méditation, visualisation, recadrage cognitif, etc.)
   - Durée (en minutes)
   - Instructions guidées détaillées
   - Bénéfices attendus
4. Recommandations post-session
5. Exercices de consolidation

Format JSON uniquement.`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { 
              role: 'user', 
              content: `Crée un parcours thérapeutique pour: ${emotion} (intensité ${intensity}/10, durée ${duration}min)` 
            }
          ],
          temperature: 0.8,
          max_tokens: 2000
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API error:', aiResponse.status, errorText);
        throw new Error(`AI generation failed: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const generatedContent = aiData.choices[0].message.content;

      let journeyData;
      try {
        // Extract JSON from potential markdown code blocks
        const jsonMatch = generatedContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                         generatedContent.match(/\{[\s\S]*\}/);
        journeyData = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : generatedContent);
      } catch (e) {
        console.error('JSON parse error:', e, 'Content:', generatedContent);
        // Fallback structure
        journeyData = {
          title: `Parcours ${emotion}`,
          introduction: generatedContent.substring(0, 500),
          segments: [],
          recommendations: ['Pratiquer régulièrement', 'Noter vos progrès']
        };
      }

      // Save journey to database
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/therapeutic_journeys`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          emotion: emotion,
          intensity: intensity,
          duration_minutes: duration,
          content: journeyData,
          status: 'ready'
        })
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Database error:', errorText);
        throw new Error('Failed to save journey');
      }

      const [journey] = await insertResponse.json();

      console.log('Journey created successfully:', journey.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          journey: journey,
          message: 'Parcours thérapeutique généré avec succès'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Start journey session
    if (action === 'start') {
      const sessionResponse = await fetch(`${supabaseUrl}/rest/v1/therapeutic_sessions`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          journey_id: journeyId,
          started_at: new Date().toISOString(),
          status: 'in_progress'
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to start session');
      }

      const [session] = await sessionResponse.json();

      return new Response(
        JSON.stringify({ success: true, session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Complete journey session
    if (action === 'complete') {
      const { sessionId, completionData } = await req.json();

      const updateResponse = await fetch(
        `${supabaseUrl}/rest/v1/therapeutic_sessions?id=eq.${sessionId}&user_id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': authHeader,
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            completed_at: new Date().toISOString(),
            status: 'completed',
            completion_data: completionData
          })
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to complete session');
      }

      const [session] = await updateResponse.json();

      return new Response(
        JSON.stringify({ success: true, session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Get user's journeys
    if (action === 'list') {
      const listResponse = await fetch(
        `${supabaseUrl}/rest/v1/therapeutic_journeys?user_id=eq.${user.id}&order=created_at.desc&limit=20`,
        {
          headers: {
            'Authorization': authHeader,
            'apikey': supabaseKey
          }
        }
      );

      if (!listResponse.ok) {
        throw new Error('Failed to load journeys');
      }

      const journeys = await listResponse.json();

      return new Response(
        JSON.stringify({ success: true, journeys }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in therapeutic-journey function:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
