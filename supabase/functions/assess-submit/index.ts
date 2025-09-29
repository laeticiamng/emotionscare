import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmitRequest {
  session_id: string
  instrument: string
  answers: Record<string, number>
  meta?: {
    duration_ms?: number
    device_flags?: string[]
  }
}

// Fonctions de scoring pour chaque instrument
function scoreWHO5(answers: Record<string, number>): { score: number, level: number } {
  const total = Object.values(answers).reduce((sum, val) => sum + val, 0)
  const score = (total / 25) * 100 // Normalisation 0-100
  
  let level = 2 // neutre par défaut
  if (score <= 20) level = 0      // besoin de douceur
  else if (score <= 40) level = 1 // moment plus délicat
  else if (score <= 60) level = 2 // équilibre stable
  else if (score <= 80) level = 3 // bonne forme
  else level = 4                  // très belle énergie
  
  return { score, level }
}

function scoreSTAI6(answers: Record<string, number>): { score: number, level: number } {
  const reversedItems = ['1', '4', '5']
  let total = 0
  
  for (const [id, value] of Object.entries(answers)) {
    const adjustedValue = reversedItems.includes(id) ? (5 - value) : value
    total += adjustedValue
  }
  
  const score = ((total - 6) / 18) * 100 // Normalisation 0-100
  
  let level = 2
  if (score <= 20) level = 0      // grande sérénité
  else if (score <= 40) level = 1 // calme ressenti
  else if (score <= 60) level = 2 // état équilibré
  else if (score <= 80) level = 3 // tension présente
  else level = 4                  // besoin d'apaisement
  
  return { score, level }
}

function scoreSAM(answers: Record<string, number>): { score: number, level: number, valence: number, arousal: number } {
  const valence = (answers['1'] || 5) / 9 * 100
  const arousal = (answers['2'] || 5) / 9 * 100
  
  // Score composite basé sur la valence principalement
  const score = valence
  
  let level = 2
  if (valence <= 20) level = 0    // humeur difficile
  else if (valence <= 40) level = 1 // tonalité plus basse
  else if (valence <= 60) level = 2 // état mixte
  else if (valence <= 80) level = 3 // bonne humeur
  else level = 4                    // excellente forme
  
  return { score, level, valence, arousal }
}

const SCORING_FUNCTIONS = {
  WHO5: scoreWHO5,
  STAI6: scoreSTAI6,
  SAM: scoreSAM
}

const SUMMARIES = {
  WHO5: {
    0: 'besoin de douceur',
    1: 'moment plus délicat', 
    2: 'équilibre stable',
    3: 'bonne forme',
    4: 'très belle énergie'
  },
  STAI6: {
    0: 'grande sérénité',
    1: 'calme ressenti',
    2: 'état équilibré', 
    3: 'tension présente',
    4: 'besoin d\'apaisement'
  },
  SAM: {
    0: 'humeur difficile',
    1: 'tonalité plus basse',
    2: 'état mixte',
    3: 'bonne humeur', 
    4: 'excellente forme'
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

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { session_id, instrument, answers, meta }: SubmitRequest = await req.json()

    // Vérifier que l'instrument est supporté
    const scoringFn = SCORING_FUNCTIONS[instrument as keyof typeof SCORING_FUNCTIONS]
    if (!scoringFn) {
      return new Response(
        JSON.stringify({ error: 'instrument_not_supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculer le score
    const result = scoringFn(answers)
    const summary = SUMMARIES[instrument as keyof typeof SUMMARIES][result.level as keyof typeof SUMMARIES[keyof typeof SUMMARIES]]

    // Récupérer l'utilisateur depuis le token
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sauvegarder la réponse
    const { error: insertError } = await supabase
      .from('clinical_responses')
      .insert({
        user_id: user.id,
        instrument_code: instrument,
        cadence: 'on_demand',
        responses: answers,
        internal_score: result.score,
        internal_level: result.level,
        context_data: meta || {},
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      })

    if (insertError) {
      console.error('Error saving response:', insertError)
      return new Response(
        JSON.stringify({ error: 'save_failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Créer un signal clinique pour l'orchestration
    await supabase
      .from('clinical_signals')
      .insert({
        user_id: user.id,
        source_instrument: instrument,
        level: result.level,
        domain: instrument === 'WHO5' ? 'wellbeing' : instrument === 'STAI6' ? 'anxiety' : 'mood',
        window_type: 'immediate',
        module_context: 'assessment',
        metadata: { ...result },
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      })

    const receiptId = crypto.randomUUID()

    // Générer des hints d'orchestration basés sur le niveau
    const hints = []
    if (instrument === 'WHO5' && result.level <= 1) {
      hints.push({ action: 'gentle_nudges', priority: 'high' })
      hints.push({ action: 'promote_nyvee', priority: 'medium' })
    } else if (instrument === 'STAI6' && result.level >= 3) {
      hints.push({ action: 'grounding_exercises', priority: 'high' })
      hints.push({ action: 'slow_breathing', priority: 'medium' })
    } else if (instrument === 'SAM' && 'valence' in result && result.valence < 40) {
      hints.push({ action: 'mood_support', priority: 'medium' })
      hints.push({ action: 'suggest_flash_glow', priority: 'low' })
    }

    return new Response(
      JSON.stringify({
        receipt_id: receiptId,
        summary, // Phrase descriptive, jamais de chiffre
        orchestration: { hints }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in assess-submit:', error)
    return new Response(
      JSON.stringify({ error: 'internal_error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})