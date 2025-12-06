import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { supabase } from "../_shared/supa_client.ts"

const allowedOriginEnv = Deno.env.get('EMOTION_SCAN_ALLOWED_ORIGINS')?.split(',')
  .map((value) => value.trim())
  .filter(Boolean)

function resolveAllowedOrigin(request: Request): string {
  const origin = request.headers.get('origin') ?? request.headers.get('Origin') ?? ''

  if (!allowedOriginEnv || allowedOriginEnv.length === 0) {
    return origin || '*'
  }

  if (allowedOriginEnv.includes('*')) {
    return origin || '*'
  }

  if (origin && allowedOriginEnv.includes(origin)) {
    return origin
  }

  return allowedOriginEnv[0]
}

function createCorsHeaders(request: Request) {
  const allowOrigin = resolveAllowedOrigin(request)

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

interface EmotionAnalysisRequest {
  text: string;
  context?: string;
  previousEmotions?: Record<string, number>;
}

interface EmotionAnalysisResponse {
  emotions: Record<string, number>;
  dominantEmotion: string;
  confidence: number;
  insights: string[];
  recommendations: string[];
}

serve(async (req) => {
  const corsHeaders = createCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { text, context, previousEmotions }: EmotionAnalysisRequest = await req.json()

    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization")
    let userId: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "")
      const { data, error: authError } = await supabase.auth.getUser(token)

      if (authError) {
        console.error("❌ Erreur authentification:", authError)
      } else if (data?.user) {
        userId = data.user.id
      }
    }
    
    if (!text?.trim()) {
      throw new Error('Texte requis pour l\'analyse')
    }

    console.log('🧠 Analyse d\'émotion:', { text: text.substring(0, 50), context })

    // Configuration OpenAI
    const openAIKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIKey) {
      throw new Error('Clé OpenAI manquante')
    }

    // Prompt d'analyse émotionnelle avancée
    const analysisPrompt = `
Analyse les émotions dans ce texte avec précision et nuance.

Texte à analyser: "${text}"
${context ? `Contexte: ${context}` : ''}
${previousEmotions ? `Émotions précédentes: ${JSON.stringify(previousEmotions)}` : ''}

Retourne une analyse JSON avec:
1. emotions: Scores 0-10 pour joie, tristesse, colère, peur, surprise, dégoût, anticipation, confiance
2. dominantEmotion: L'émotion principale détectée
3. confidence: Niveau de confiance de l'analyse (0-1)
4. insights: 3 observations psychologiques sur l'état émotionnel
5. recommendations: 3 conseils personnalisés pour améliorer le bien-être

Sois précis, empathique et constructif. Base-toi sur la psychologie positive.
`

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse émotionnelle et psychologie positive. Réponds uniquement en JSON valide.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    })

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text()
      console.error('❌ Erreur OpenAI:', error)
      throw new Error('Échec de l\'analyse OpenAI')
    }

    const openAIResult = await openAIResponse.json()
    const analysis = JSON.parse(openAIResult.choices[0].message.content)

    // Validation et enrichissement de l'analyse
    const emotions = {
      joie: Math.max(0, Math.min(10, analysis.emotions?.joie || 5)),
      tristesse: Math.max(0, Math.min(10, analysis.emotions?.tristesse || 3)),
      colere: Math.max(0, Math.min(10, analysis.emotions?.colere || 2)),
      peur: Math.max(0, Math.min(10, analysis.emotions?.peur || 3)),
      surprise: Math.max(0, Math.min(10, analysis.emotions?.surprise || 4)),
      degout: Math.max(0, Math.min(10, analysis.emotions?.degout || 1)),
      anticipation: Math.max(0, Math.min(10, analysis.emotions?.anticipation || 6)),
      confiance: Math.max(0, Math.min(10, analysis.emotions?.confiance || 5))
    }

    // Trouver l'émotion dominante
    const dominantEmotion = Object.entries(emotions)
      .reduce((a, b) => emotions[a[0]] > emotions[b[0]] ? a : b)[0]

    // Calcul de la confiance basé sur la clarté émotionnelle
    const emotionVariance = Object.values(emotions)
      .reduce((sum, val, _, arr) => {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length
        return sum + Math.pow(val - mean, 2)
      }, 0) / Object.values(emotions).length

    const confidence = Math.min(1, Math.max(0.3, emotionVariance / 20))

    // Insights et recommandations par défaut si manquants
    const insights = analysis.insights?.length > 0 ? analysis.insights : [
      `L'émotion dominante détectée est ${dominantEmotion}`,
      `Niveau de complexité émotionnelle: ${Object.values(emotions).filter(v => v > 5).length > 3 ? 'Élevé' : 'Modéré'}`,
      `Équilibre émotionnel: ${emotions.joie + emotions.confiance > emotions.tristesse + emotions.peur ? 'Positif' : 'Négatif'}`
    ]

    const recommendations = analysis.recommendations?.length > 0 ? analysis.recommendations : [
      emotions.joie < 5 ? "Pratiquez la gratitude quotidienne pour cultiver la joie" : "Maintenez votre état positif avec des activités plaisantes",
      emotions.confiance < 5 ? "Renforcez votre confiance par des petits succès quotidiens" : "Partagez votre confiance en aidant les autres",
      emotions.tristesse > 7 ? "Accordez-vous du temps pour exprimer et accepter vos émotions" : "Utilisez la méditation pour maintenir votre équilibre émotionnel"
    ]

    const normalizedConfidence = Math.round(confidence * 100) / 100
    const confidencePercent = Math.round(normalizedConfidence * 100)

    const positiveScore = (emotions.joie || 0) + (emotions.confiance || 0) + (emotions.anticipation || 0) + (emotions.surprise || 0)
    const negativeScore = (emotions.tristesse || 0) + (emotions.colere || 0) + (emotions.peur || 0) + (emotions.degout || 0)
    const emotionalBalance = Math.round(Math.max(0, Math.min(100, ((positiveScore - negativeScore + 40) / 80) * 100)))

    const summary = [
      `Émotion dominante: ${dominantEmotion}`,
      `Confiance: ${confidencePercent}%`,
      `Équilibre émotionnel estimé: ${emotionalBalance}/100`
    ].join(' · ')

    const result: EmotionAnalysisResponse = {
      emotions,
      dominantEmotion,
      confidence: normalizedConfidence,
      insights: insights.slice(0, 3),
      recommendations: recommendations.slice(0, 3),
    }

    const persistedPayload = {
      scores: emotions,
      insights: result.insights,
      context: context || null,
      previousEmotions: previousEmotions || null
    }

    let persisted = false
    let scanId: string | null = null

    if (userId) {
      const { data: inserted, error: insertError } = await supabase
        .from("emotion_scans")
        .insert({
          user_id: userId,
          scan_type: "text",
          mood: dominantEmotion,
          confidence: confidencePercent,
          summary,
          recommendations: result.recommendations,
          insights: result.insights,
          emotions: persistedPayload,
          emotional_balance: emotionalBalance
        })
        .select('id')
        .single()

      if (insertError) {
        console.error("❌ Erreur enregistrement emotion_scans:", insertError)
      } else {
        persisted = true
        scanId = inserted?.id ?? null
        console.log("🗄️ Emotion scan enregistré", { userId, mood: dominantEmotion, scanId })
      }
    } else {
      console.log("ℹ️ Aucun utilisateur authentifié, saut de l'enregistrement")
    }

    console.log('✅ Analyse terminée:', { dominantEmotion, confidence: normalizedConfidence, emotionalBalance })

    return new Response(JSON.stringify({
      ...result,
      emotionalBalance,
      confidence: normalizedConfidence,
      persisted,
      scanId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Erreur analyse émotion:', error)

    return new Response(JSON.stringify({
      error: error.message,
      emotions: {
        joie: 5, tristesse: 3, colere: 2, peur: 3,
        surprise: 4, degout: 1, anticipation: 6, confiance: 5
      },
      dominantEmotion: 'neutral',
      confidence: 0.5,
      insights: ['Analyse indisponible temporairement'],
      recommendations: ['Réessayez dans quelques instants'],
      persisted: false,
      scanId: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
