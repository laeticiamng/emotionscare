import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, userId, analysisType = 'text' } = await req.json();
    
    console.log('🧠 Analyzing emotion:', { analysisType, textLength: text?.length, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Perform emotion analysis
    const analysis = await analyzeTextEmotion(text);

    // Store analysis result if userId provided
    if (userId) {
      const { error: storeError } = await supabase
        .from('emotion_analysis_logs')
        .insert({
          user_id: userId,
          input_text: text.substring(0, 500), // Store first 500 chars for privacy
          detected_emotion: analysis.emotion,
          confidence_score: analysis.confidence,
          valence: analysis.valence,
          arousal: analysis.arousal,
          analysis_metadata: {
            text_length: text.length,
            analysis_type: analysisType,
            processing_time: analysis.processingTime
          }
        });

      if (storeError) {
        console.error('Error storing analysis:', storeError);
      }
    }

    console.log('✅ Emotion analysis completed:', analysis.emotion, 'confidence:', analysis.confidence);

    return new Response(JSON.stringify({
      id: `analysis-${Date.now()}`,
      timestamp: new Date().toISOString(),
      emotion: analysis.emotion,
      intensity: analysis.intensity,
      confidence: analysis.confidence,
      valence: analysis.valence,
      arousal: analysis.arousal,
      insight: analysis.insight,
      recommendations: analysis.recommendations,
      processingTime: analysis.processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in emotion-analysis:', error);
    return new Response(JSON.stringify({ 
      error: 'Emotion analysis failed',
      message: error.message,
      fallback: {
        emotion: 'neutral',
        confidence: 0.5,
        insight: 'Analyse temporairement indisponible, mais votre bien-être reste notre priorité.'
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeTextEmotion(text: string) {
  const startTime = Date.now();
  
  // In production, this would use:
  // - OpenAI GPT for emotion analysis
  // - Hugging Face sentiment models
  // - Custom trained emotion detection models
  // - Azure Cognitive Services
  
  // For now, implement rule-based analysis with emotional intelligence
  const emotionAnalysis = performRuleBasedAnalysis(text);
  
  const processingTime = Date.now() - startTime;
  
  return {
    ...emotionAnalysis,
    processingTime
  };
}

function performRuleBasedAnalysis(text: string) {
  const lowerText = text.toLowerCase();
  
  // Emotion keywords and patterns
  const emotionPatterns = {
    happy: {
      keywords: ['heureux', 'content', 'joyeux', 'ravi', 'enthousiaste', 'optimiste', 'sourire', 'rire', 'bien', 'génial', 'fantastique', 'merveilleux'],
      patterns: [/j'adore/, /c'est super/, /trop bien/, /excellent/, /parfait/],
      valence: 0.8,
      arousal: 0.6
    },
    calm: {
      keywords: ['calme', 'paisible', 'serein', 'tranquille', 'détendu', 'relaxé', 'zen', 'apaisé', 'équilibré'],
      patterns: [/me détendre/, /besoin de calme/, /moment de paix/],
      valence: 0.6,
      arousal: 0.2
    },
    energetic: {
      keywords: ['énergique', 'dynamique', 'motivé', 'actif', 'excité', 'stimulé', 'vivant', 'électrique'],
      patterns: [/plein d'énergie/, /super motivé/, /prêt à tout/],
      valence: 0.7,
      arousal: 0.9
    },
    focused: {
      keywords: ['concentré', 'focalisé', 'attentif', 'déterminé', 'appliqué', 'productif'],
      patterns: [/besoin de me concentrer/, /en mode focus/, /travail intense/],
      valence: 0.6,
      arousal: 0.5
    },
    sad: {
      keywords: ['triste', 'malheureux', 'déprimé', 'mélancolique', 'abattu', 'découragé', 'morose'],
      patterns: [/j'ai le blues/, /pas le moral/, /déprime/],
      valence: 0.2,
      arousal: 0.3
    },
    anxious: {
      keywords: ['anxieux', 'stressé', 'inquiet', 'nerveux', 'angoissé', 'tendu', 'préoccupé'],
      patterns: [/je stress/, /j'angoisse/, /j'ai peur/],
      valence: 0.3,
      arousal: 0.8
    },
    angry: {
      keywords: ['en colère', 'furieux', 'irrité', 'énervé', 'fâché', 'agacé', 'contrarié'],
      patterns: [/ça m'énerve/, /je suis furieux/, /j'en ai marre/],
      valence: 0.2,
      arousal: 0.9
    },
    tired: {
      keywords: ['fatigué', 'épuisé', 'las', 'éreinté', 'crevé', 'exténué'],
      patterns: [/je suis crevé/, /trop fatigué/, /besoin de repos/],
      valence: 0.3,
      arousal: 0.1
    }
  };

  let bestMatch = { emotion: 'neutral', score: 0, valence: 0.5, arousal: 0.5 };
  
  for (const [emotion, config] of Object.entries(emotionPatterns)) {
    let score = 0;
    
    // Check keywords
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }
    
    // Check patterns
    for (const pattern of config.patterns) {
      if (pattern.test(lowerText)) {
        score += 2; // Patterns have higher weight
      }
    }
    
    // Normalize score by text length
    const normalizedScore = score / Math.max(1, text.split(' ').length / 10);
    
    if (normalizedScore > bestMatch.score) {
      bestMatch = {
        emotion,
        score: normalizedScore,
        valence: config.valence,
        arousal: config.arousal
      };
    }
  }

  const confidence = Math.min(0.95, 0.5 + (bestMatch.score * 0.3));
  const intensity = Math.min(1, bestMatch.score * 0.4 + 0.3);

  return {
    emotion: bestMatch.emotion,
    confidence,
    intensity,
    valence: bestMatch.valence,
    arousal: bestMatch.arousal,
    insight: generateInsight(bestMatch.emotion, confidence, text),
    recommendations: generateRecommendations(bestMatch.emotion, intensity)
  };
}

function generateInsight(emotion: string, confidence: number, text: string): string {
  const insights = {
    happy: [
      "Votre expression rayonne de positivité ! Cette belle énergie mérite d'être cultivée.",
      "Je sens une joie authentique dans vos mots. Continuez à nourrir cette humeur lumineuse.",
      "Votre optimisme transparaît magnifiquement. C'est un véritable cadeau que vous vous offrez."
    ],
    calm: [
      "Votre sérénité est palpable. Vous semblez avoir trouvé un bel équilibre intérieur.",
      "Cette tranquillité d'esprit est précieuse. Savourez ce moment de paix.",
      "Votre calme inspire confiance. Vous maîtrisez bien l'art de la zen attitude."
    ],
    energetic: [
      "Quelle belle vitalité ! Votre dynamisme est contagieux et inspirant.",
      "Cette énergie débordante est formidable. Canalisez-la vers vos projets les plus chers.",
      "Votre enthousiasme fait plaisir à ressentir. Utilisez cette force motrice à bon escient."
    ],
    focused: [
      "Votre concentration est remarquable. Cette détermination vous mènera loin.",
      "Je sens cette belle intention de focus. Votre mental est aligné sur vos objectifs.",
      "Cette clarté d'esprit est un atout précieux. Gardez cette belle lucidité."
    ],
    sad: [
      "Je perçois cette mélancolie dans vos mots. Accordez-vous la douceur que vous méritez.",
      "Ces moments de tristesse font partie de l'expérience humaine. Vous n'êtes pas seul(e).",
      "Votre vulnérabilité témoigne de votre authenticité. Prenez soin de vous avec bienveillance."
    ],
    anxious: [
      "Je sens cette tension intérieure. Respirez profondément, vous avez les ressources pour traverser cela.",
      "Cette anxiété est compréhensible. Rappelez-vous que vous êtes plus fort(e) que vos inquiétudes.",
      "Votre stress transparaît, mais n'oubliez pas que chaque tempête finit par passer."
    ],
    angry: [
      "Cette colère semble intense. Prenez le temps de la laisser se transformer en force constructive.",
      "Je sens cette frustration. Votre émotion est légitime, trouvons ensemble des moyens sains de l'exprimer.",
      "Cette irritation demande à être entendue. Écoutez ce qu'elle a à vous dire, puis laissez-la partir."
    ],
    tired: [
      "Votre fatigue est bien réelle. Accordez-vous le repos dont votre corps et votre esprit ont besoin.",
      "Cette lassitude appelle à la récupération. Soyez doux/douce avec vous-même.",
      "Votre épuisement mérite attention. C'est le moment de ralentir et de vous ressourcer."
    ],
    neutral: [
      "Votre état émotionnel semble équilibré. C'est une base stable pour construire votre journée.",
      "Cette neutralité peut être apaisante. Parfois, la simplicité du moment présent suffit.",
      "Votre expression reste mesurée. Cette stabilité émotionnelle est précieuse."
    ]
  };

  const emotionInsights = insights[emotion as keyof typeof insights] || insights.neutral;
  const randomInsight = emotionInsights[Math.floor(Math.random() * emotionInsights.length)];
  
  if (confidence > 0.8) {
    return randomInsight;
  } else {
    return `${randomInsight} (Analyse préliminaire - n'hésitez pas à préciser votre ressenti)`;
  }
}

function generateRecommendations(emotion: string, intensity: number): string[] {
  const recommendations = {
    happy: [
      "Partagez cette belle énergie avec vos proches",
      "Écoutez de la musique qui amplifie cette joie",
      "Profitez-en pour vous lancer dans un projet créatif",
      "Savourez ce moment et ancrez-le dans votre mémoire"
    ],
    calm: [
      "Maintenez cette sérénité avec quelques respirations profondes",
      "Une musique douce pour accompagner ce calme",
      "Moment idéal pour de la méditation ou de la lecture",
      "Profitez de cette paix pour vous reconnecter à vous-même"
    ],
    energetic: [
      "Canalisez cette énergie dans une activité physique",
      "Musique rythmée pour accompagner votre dynamisme",
      "C'est le moment parfait pour tackle vos défis",
      "Utilisez cette force pour avancer sur vos projets"
    ],
    focused: [
      "Maintenez cette concentration avec un environnement adapté",
      "Musique instrumentale pour soutenir votre focus",
      "Planifiez vos tâches importantes maintenant",
      "Éliminez les distractions pour optimiser cette clarté"
    ],
    sad: [
      "Accordez-vous de la douceur et de la compréhension",
      "Musique apaisante pour accompagner cette émotion",
      "Parlez à quelqu'un de confiance si vous le souhaitez",
      "Rappelez-vous que cette tristesse est temporaire"
    ],
    anxious: [
      "Pratiquez des respirations lentes et profondes",
      "Musique relaxante pour apaiser votre système nerveux",
      "Essayez une courte méditation guidée",
      "Identifiez une action concrète pour réduire votre stress"
    ],
    angry: [
      "Prenez quelques minutes pour vous calmer avant d'agir",
      "Évacuez cette tension par l'exercice physique",
      "Exprimez cette colère de manière constructive",
      "Cherchez la leçon cachée derrière cette frustration"
    ],
    tired: [
      "Accordez-vous une vraie pause récupératrice",
      "Musique douce ou sons de la nature pour vous apaiser",
      "Planifiez un moment de repos de qualité",
      "Hydratez-vous et nourrissez-vous sainement"
    ],
    neutral: [
      "C'est un bon moment pour faire le point sur vos besoins",
      "Explorez différents types de musique pour éveiller vos émotions",
      "Profitez de cette stabilité pour planifier votre journée",
      "Restez ouvert(e) aux opportunités qui se présentent"
    ]
  };

  const emotionRecs = recommendations[emotion as keyof typeof recommendations] || recommendations.neutral;
  
  // Return 3-4 recommendations based on intensity
  const numRecs = intensity > 0.7 ? 4 : 3;
  return emotionRecs.slice(0, numRecs);
}