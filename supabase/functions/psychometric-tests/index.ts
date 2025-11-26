// @ts-nocheck
/**
 * psychometric-tests - Tests psychométriques (PHQ-9, GAD-7, PSS-10, WHO-5)
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 30/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const INSTRUMENTS = {
  'PHQ-9': {
    name: 'PHQ-9',
    fullName: 'Patient Health Questionnaire-9',
    description: 'Évaluation de la dépression',
    questions: [
      'Peu d\'intérêt ou de plaisir à faire les choses',
      'Se sentir triste, déprimé(e) ou désespéré(e)',
      'Difficulté à s\'endormir, se réveiller ou trop dormir',
      'Se sentir fatigué(e) ou manquer d\'énergie',
      'Peu d\'appétit ou manger trop',
      'Sentiment de dévalorisation ou culpabilité',
      'Difficulté à se concentrer',
      'Bouger ou parler lentement, ou être agité(e)',
      'Pensées de se faire du mal'
    ],
    options: [
      { label: 'Jamais', value: 0 },
      { label: 'Plusieurs jours', value: 1 },
      { label: 'Plus de la moitié du temps', value: 2 },
      { label: 'Presque tous les jours', value: 3 }
    ],
    thresholds: {
      minimal: [0, 4],
      mild: [5, 9],
      moderate: [10, 14],
      moderatelySevere: [15, 19],
      severe: [20, 27]
    }
  },
  'GAD-7': {
    name: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder-7',
    description: 'Évaluation de l\'anxiété',
    questions: [
      'Se sentir nerveux(se), anxieux(se) ou sur les nerfs',
      'Ne pas pouvoir arrêter de s\'inquiéter',
      'S\'inquiéter de trop de choses différentes',
      'Avoir du mal à se détendre',
      'Être si agité(e) qu\'il est difficile de tenir en place',
      'Être facilement ennuyé(e) ou irritable',
      'Se sentir effrayé(e) comme si quelque chose d\'affreux allait arriver'
    ],
    options: [
      { label: 'Jamais', value: 0 },
      { label: 'Plusieurs jours', value: 1 },
      { label: 'Plus de la moitié du temps', value: 2 },
      { label: 'Presque tous les jours', value: 3 }
    ],
    thresholds: {
      minimal: [0, 4],
      mild: [5, 9],
      moderate: [10, 14],
      severe: [15, 21]
    }
  },
  'PSS-10': {
    name: 'PSS-10',
    fullName: 'Perceived Stress Scale-10',
    description: 'Évaluation du stress perçu',
    questions: [
      'Avez-vous été contrarié(e) par quelque chose d\'inattendu?',
      'Avez-vous senti que vous étiez incapable de contrôler les choses importantes?',
      'Vous êtes-vous senti(e) nerveux(se) ou stressé(e)?',
      'Avez-vous géré avec succès les petits problèmes quotidiens?',
      'Avez-vous senti que vous faisiez face efficacement aux changements?',
      'Vous êtes-vous senti(e) confiant(e) dans votre capacité à gérer vos problèmes?',
      'Avez-vous senti que les choses allaient comme vous le vouliez?',
      'Avez-vous trouvé que vous ne pouviez pas faire face à toutes les choses?',
      'Avez-vous été capable de contrôler les irritations de votre vie?',
      'Avez-vous senti que vous maîtrisiez la situation?'
    ],
    options: [
      { label: 'Jamais', value: 0 },
      { label: 'Presque jamais', value: 1 },
      { label: 'Parfois', value: 2 },
      { label: 'Assez souvent', value: 3 },
      { label: 'Très souvent', value: 4 }
    ],
    reverseScored: [3, 4, 5, 6, 8, 9],
    thresholds: {
      low: [0, 13],
      moderate: [14, 26],
      high: [27, 40]
    }
  },
  'WHO-5': {
    name: 'WHO-5',
    fullName: 'WHO-5 Well-Being Index',
    description: 'Évaluation du bien-être',
    questions: [
      'Je me suis senti(e) joyeux(se) et de bonne humeur',
      'Je me suis senti(e) calme et détendu(e)',
      'Je me suis senti(e) actif(ve) et vigoureux(se)',
      'Je me suis réveillé(e) en me sentant frais et dispos',
      'Ma vie quotidienne a été remplie de choses qui m\'intéressent'
    ],
    options: [
      { label: 'Jamais', value: 0 },
      { label: 'Rarement', value: 1 },
      { label: 'Moins de la moitié du temps', value: 2 },
      { label: 'Plus de la moitié du temps', value: 3 },
      { label: 'La plupart du temps', value: 4 },
      { label: 'Tout le temps', value: 5 }
    ],
    thresholds: {
      poor: [0, 12],
      moderate: [13, 18],
      good: [19, 25]
    }
  }
};

function calculateScore(instrument: string, answers: number[]) {
  const config = INSTRUMENTS[instrument];
  let total = 0;
  
  answers.forEach((answer, index) => {
    if (config.reverseScored && config.reverseScored.includes(index)) {
      const maxValue = Math.max(...config.options.map(o => o.value));
      total += maxValue - answer;
    } else {
      total += answer;
    }
  });
  
  return total;
}

function getInterpretation(instrument: string, score: number) {
  const thresholds = INSTRUMENTS[instrument].thresholds;
  
  for (const [level, range] of Object.entries(thresholds)) {
    if (score >= range[0] && score <= range[1]) {
      return level;
    }
  }
  
  return 'unknown';
}

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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting per-user
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'psychometric-tests',
      userId: user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Psychometric test operations',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    const { action, instrument, answers, sessionId } = await req.json();

    switch (action) {
      case 'get-instruments': {
        const instrumentList = Object.entries(INSTRUMENTS).map(([key, value]) => ({
          id: key,
          name: value.name,
          fullName: value.fullName,
          description: value.description,
          questionCount: value.questions.length
        }));

        return new Response(
          JSON.stringify({ success: true, instruments: instrumentList }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-instrument-details': {
        const config = INSTRUMENTS[instrument];
        if (!config) {
          return new Response(
            JSON.stringify({ error: 'Instrument invalide' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, instrument: config }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'submit-test': {
        const score = calculateScore(instrument, answers);
        const interpretation = getInterpretation(instrument, score);

        const { data: session, error: sessionError } = await supabaseClient
          .from('assessment_sessions')
          .insert({
            user_id: user.id,
            instrument,
            answers: { responses: answers },
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            context: {
              score,
              interpretation,
              maxScore: INSTRUMENTS[instrument].questions.length * Math.max(...INSTRUMENTS[instrument].options.map(o => o.value))
            }
          })
          .select()
          .single();

        if (sessionError) throw sessionError;

        const { error: assessmentError } = await supabaseClient
          .from('assessments')
          .insert({
            user_id: user.id,
            instrument,
            score_json: {
              total: score,
              interpretation,
              answers
            }
          });

        if (assessmentError) console.error('Assessment insert error:', assessmentError);

        return new Response(
          JSON.stringify({ 
            success: true, 
            session,
            score,
            interpretation,
            message: 'Test soumis avec succès'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-history': {
        const { data, error } = await supabaseClient
          .from('assessment_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, history: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-trends': {
        const { data, error } = await supabaseClient
          .from('assessment_sessions')
          .select('instrument, context, created_at')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        const trends = {};
        data.forEach(session => {
          if (!trends[session.instrument]) {
            trends[session.instrument] = [];
          }
          trends[session.instrument].push({
            date: session.created_at,
            score: session.context?.score || 0
          });
        });

        return new Response(
          JSON.stringify({ success: true, trends }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Action invalide' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in psychometric-tests function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
