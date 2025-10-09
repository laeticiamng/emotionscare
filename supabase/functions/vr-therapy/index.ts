// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VRGenerateRequest {
  emotion: string;
  intensity: number;
  duration: number;
  environmentType: string;
}

interface VRSessionRequest {
  action: 'start' | 'complete' | 'list';
  sessionId?: string;
  environment?: any;
  biometrics?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();

    // Gestion des sessions VR
    if (body.action === 'start') {
      const { data: session, error } = await supabase
        .from('vr_therapy_sessions')
        .insert({
          user_id: user.id,
          environment_config: body.environment,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (body.action === 'complete') {
      const { data: session, error } = await supabase
        .from('vr_therapy_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          biometric_data: body.biometrics,
        })
        .eq('id', body.sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (body.action === 'list') {
      const { data: sessions, error } = await supabase
        .from('vr_therapy_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ sessions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Génération d'environnement VR via IA
    const { emotion, intensity, duration, environmentType } = body as VRGenerateRequest;

    console.log('🌐 Generating VR environment:', { user_id: user.id, emotion, intensity, duration, environmentType });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `Tu es un expert en thérapie par réalité virtuelle. Génère un environnement VR thérapeutique personnalisé et immersif.

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) contenant:
{
  "name": "nom de l'environnement",
  "description": "description immersive",
  "settings": {
    "skyColor": "couleur du ciel (hex)",
    "groundColor": "couleur du sol (hex)",
    "lighting": "type d'éclairage (soft/dynamic/ambient)",
    "weather": "météo (clear/cloudy/rain/snow)",
    "timeOfDay": "moment (dawn/day/dusk/night)"
  },
  "elements": [
    {
      "type": "nature/architecture/abstract",
      "name": "nom de l'élément",
      "position": {"x": 0, "y": 0, "z": 0},
      "properties": {}
    }
  ],
  "audio": {
    "ambient": "description des sons ambiants",
    "music": "style de musique de fond",
    "frequency": "fréquence en Hz (432/528 pour thérapeutique)"
  },
  "interactions": [
    {
      "type": "breathing/meditation/movement",
      "description": "description de l'interaction",
      "duration": 60
    }
  ],
  "therapeutic_benefits": ["bénéfice 1", "bénéfice 2"],
  "difficulty": "easy/medium/hard"
}`;

    const userPrompt = `Crée un environnement VR thérapeutique de type "${environmentType}" pour l'émotion "${emotion}" avec une intensité de ${intensity}/10 et une durée de ${duration} minutes.

L'environnement doit être adapté à cette émotion et favoriser le bien-être psychologique.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;

    let environment;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      environment = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Sauvegarder l'environnement généré
    const { data: savedEnv, error: saveError } = await supabase
      .from('vr_environments')
      .insert({
        user_id: user.id,
        name: environment.name,
        description: environment.description,
        environment_config: environment,
        emotion_tag: emotion,
        intensity_level: intensity,
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Save error:', saveError);
      throw saveError;
    }

    console.log('✅ VR environment generated:', savedEnv.id);

    return new Response(
      JSON.stringify({
        environment: savedEnv,
        message: 'Environnement VR généré avec succès',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
