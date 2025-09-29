import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StartRequest {
  instrument: string
  locale?: string
}

interface InstrumentItem {
  id: string
  prompt: string
  type: 'scale' | 'choice' | 'slider'
  options?: string[]
  min?: number
  max?: number
}

// Catalogues d'instruments validés
const INSTRUMENTS: Record<string, Record<string, any>> = {
  WHO5: {
    fr: {
      name: "Mini questionnaire bien-être",
      items: [
        { id: "1", prompt: "Au cours des 2 dernières semaines, je me suis senti(e) joyeux/se et de bonne humeur", type: "scale", min: 0, max: 5 },
        { id: "2", prompt: "Au cours des 2 dernières semaines, je me suis senti(e) calme et détendu(e)", type: "scale", min: 0, max: 5 },
        { id: "3", prompt: "Au cours des 2 dernières semaines, je me suis senti(e) actif/ve et vigoureux/se", type: "scale", min: 0, max: 5 },
        { id: "4", prompt: "Au cours des 2 dernières semaines, je me suis réveillé(e) en me sentant frais/che et reposé(e)", type: "scale", min: 0, max: 5 },
        { id: "5", prompt: "Au cours des 2 dernières semaines, ma vie quotidienne a été remplie de choses qui m'intéressent", type: "scale", min: 0, max: 5 }
      ]
    }
  },
  STAI6: {
    fr: {
      name: "Questionnaire état émotionnel",
      items: [
        { id: "1", prompt: "Je me sens calme", type: "scale", min: 1, max: 4, reversed: true },
        { id: "2", prompt: "Je suis tendu(e)", type: "scale", min: 1, max: 4 },
        { id: "3", prompt: "Je me sens bouleversé(e)", type: "scale", min: 1, max: 4 },
        { id: "4", prompt: "Je suis détendu(e)", type: "scale", min: 1, max: 4, reversed: true },
        { id: "5", prompt: "Je me sens satisfait(e)", type: "scale", min: 1, max: 4, reversed: true },
        { id: "6", prompt: "Je suis inquiet/ète", type: "scale", min: 1, max: 4 }
      ]
    }
  },
  SAM: {
    fr: {
      name: "Auto-évaluation émotionnelle",
      items: [
        { id: "1", prompt: "Comment vous sentez-vous en ce moment ? (de mécontent à heureux)", type: "slider", min: 1, max: 9 },
        { id: "2", prompt: "Quel est votre niveau d'activation ? (de calme à excité)", type: "slider", min: 1, max: 9 }
      ]
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { instrument, locale = 'fr' }: StartRequest = await req.json()

    // Vérifier que l'instrument existe
    if (!INSTRUMENTS[instrument] || !INSTRUMENTS[instrument][locale]) {
      return new Response(
        JSON.stringify({ error: 'instrument_not_found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const catalog = INSTRUMENTS[instrument][locale]
    const sessionId = crypto.randomUUID()
    const expiryTs = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    return new Response(
      JSON.stringify({
        session_id: sessionId,
        instrument,
        name: catalog.name,
        items: catalog.items,
        expiry_ts: expiryTs.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in assess-start:', error)
    return new Response(
      JSON.stringify({ error: 'internal_error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})