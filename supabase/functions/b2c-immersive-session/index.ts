// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImmersiveSessionRequest {
  type: 'vr' | 'ambilight' | 'audio';
  params: {
    duration_minutes?: number;
    intensity?: number;
    theme?: string;
    [key: string]: any;
  };
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: ImmersiveSessionRequest = await req.json();
    const { type, params } = body;

    console.log('🎭 Starting immersive session:', { user_id: user.id, type, params });

    // Créer la session
    const { data: session, error: insertError } = await supabase
      .from('immersive_sessions')
      .insert({
        user_id: user.id,
        type,
        params_json: params,
        ts_start: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating session:', insertError);
      throw insertError;
    }

    console.log('✅ Immersive session created:', session.id);

    // Simuler le traitement immersif (dans la vraie vie, ce serait un appel à un service VR/Audio)
    const outcome = generateImmersiveOutcome(type, params);

    // Mettre à jour la session avec le résultat
    const { error: updateError } = await supabase
      .from('immersive_sessions')
      .update({
        ts_end: new Date().toISOString(),
        outcome_text: outcome,
      })
      .eq('id', session.id);

    if (updateError) {
      console.error('❌ Error updating session:', updateError);
    }

    return new Response(
      JSON.stringify({
        session_id: session.id,
        type,
        outcome,
        started_at: session.ts_start,
        status: 'completed',
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

function generateImmersiveOutcome(type: string, params: any): string {
  const duration = params.duration_minutes || 10;
  const intensity = params.intensity || 0.5;
  const theme = params.theme || 'calme';

  switch (type) {
    case 'vr':
      return `Séance VR complétée : ${duration} minutes dans un environnement "${theme}". Niveau d'immersion : ${Math.round(intensity * 100)}%. Vous avez exploré 3 espaces de relaxation et complété 2 exercices de respiration guidée.`;
    
    case 'ambilight':
      return `Séance Ambilight terminée : ${duration} minutes de stimulation visuelle douce avec thème "${theme}". Intensité lumineuse : ${Math.round(intensity * 100)}%. Votre rythme cardiaque a diminué de 8% pendant la séance.`;
    
    case 'audio':
      return `Séance audio immersive : ${duration} minutes d'ambiance sonore "${theme}". Intensité : ${Math.round(intensity * 100)}%. Mix de sons naturels, fréquences binaurales et musique adaptative. Niveau de détente estimé : élevé.`;
    
    default:
      return `Séance immersive complétée : ${duration} minutes. Merci d'avoir pris ce temps pour vous.`;
  }
}
