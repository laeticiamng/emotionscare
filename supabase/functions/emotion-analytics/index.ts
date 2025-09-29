import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionData {
  userId: string;
  emotion: string;
  intensity: number;
  triggers: string[];
  context: string;
  timestamp: string;
  source: 'scan' | 'journal' | 'voice' | 'manual';
}

interface AnalyticsRequest {
  type: 'daily' | 'weekly' | 'monthly' | 'realtime' | 'prediction';
  userId: string;
  dateRange?: { start: string; end: string };
  emotions?: string[];
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userId, dateRange, emotions }: AnalyticsRequest = await req.json();

    console.log('📊 Analyse émotionnelle demandée:', { type, userId });

    let analyticsResult;

    switch (type) {
      case 'daily':
        analyticsResult = await generateDailyAnalytics(userId, dateRange);
        break;
      case 'weekly':
        analyticsResult = await generateWeeklyAnalytics(userId, dateRange);
        break;
      case 'monthly':
        analyticsResult = await generateMonthlyAnalytics(userId, dateRange);
        break;
      case 'realtime':
        analyticsResult = await generateRealtimeAnalytics(userId);
        break;
      case 'prediction':
        analyticsResult = await generateEmotionPredictions(userId);
        break;
      default:
        throw new Error('Type d\'analyse non reconnu');
    }

    return new Response(JSON.stringify({
      success: true,
      data: analyticsResult,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erreur analytics émotionnelles:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erreur lors de l\'analyse des données émotionnelles',
      code: 'EMOTION_ANALYTICS_ERROR'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateDailyAnalytics(userId: string, dateRange?: any) {
  // Simulation de données quotidiennes
  const emotions = ['joy', 'calm', 'stress', 'excitement', 'sadness', 'anger', 'surprise'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const dailyData = {
    date: new Date().toISOString().split('T')[0],
    emotionDistribution: emotions.map(emotion => ({
      emotion,
      percentage: Math.floor(Math.random() * 30) + 5,
      avgIntensity: (Math.random() * 0.8 + 0.2).toFixed(2),
      peakTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    })),
    hourlyTrends: hours.map(hour => ({
      hour,
      dominantEmotion: emotions[Math.floor(Math.random() * emotions.length)],
      intensity: (Math.random() * 0.9 + 0.1).toFixed(2),
      triggers: generateRandomTriggers()
    })),
    insights: [
      {
        type: 'peak_happiness',
        message: 'Votre pic de bonheur était vers 14h30, probablement lié à une interaction sociale positive.',
        confidence: 0.85
      },
      {
        type: 'stress_pattern',
        message: 'Stress légèrement élevé en fin de journée - considérez une session de respiration.',
        confidence: 0.72
      }
    ],
    recommendations: [
      'Planifiez plus d\'activités sociales vers 14h pour maximiser votre bien-être',
      'Une routine de relaxation vers 18h pourrait réduire le stress quotidien',
      'Votre niveau de joie est optimal - continuez vos activités actuelles'
    ],
    wellnessScore: Math.floor(Math.random() * 30) + 70
  };

  return dailyData;
}

async function generateWeeklyAnalytics(userId: string, dateRange?: any) {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const emotions = ['joy', 'calm', 'stress', 'excitement', 'sadness'];
  
  const weeklyData = {
    weekOf: getWeekStart(),
    dailyAverages: days.map(day => ({
      day,
      avgWellness: Math.floor(Math.random() * 30) + 60,
      dominantEmotion: emotions[Math.floor(Math.random() * emotions.length)],
      sessionCount: Math.floor(Math.random() * 8) + 2,
      improvements: Math.random() * 20 - 10 // -10 à +10
    })),
    weeklyTrends: {
      overallImprovement: (Math.random() * 15 + 5).toFixed(1),
      bestDay: days[Math.floor(Math.random() * days.length)],
      challengingDay: days[Math.floor(Math.random() * days.length)],
      streakDays: Math.floor(Math.random() * 7) + 1
    },
    emotionalJourney: generateEmotionalJourney(),
    achievements: [
      { name: '7 jours consécutifs', unlocked: true, progress: 100 },
      { name: 'Maître du calme', unlocked: false, progress: 67 },
      { name: 'Explorer émotionnel', unlocked: true, progress: 100 }
    ],
    nextWeekGoals: [
      'Maintenir le niveau de bien-être actuel',
      'Explorer 2 nouvelles techniques de relaxation',
      'Augmenter les sessions matinales'
    ]
  };

  return weeklyData;
}

async function generateMonthlyAnalytics(userId: string, dateRange?: any) {
  const monthlyData = {
    month: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    overview: {
      totalSessions: Math.floor(Math.random() * 50) + 80,
      avgWellnessScore: Math.floor(Math.random() * 20) + 75,
      improvementRate: (Math.random() * 25 + 10).toFixed(1),
      mostUsedFeature: 'Scan Émotionnel',
      favoriteTime: '19h-21h'
    },
    emotionalEvolution: generateMonthlyEvolution(),
    milestones: [
      { week: 1, achievement: 'Première semaine complète', date: '2024-01-07' },
      { week: 2, achievement: 'Score de bien-être > 80', date: '2024-01-14' },
      { week: 3, achievement: '50 sessions terminées', date: '2024-01-21' },
      { week: 4, achievement: 'Maîtrise de la respiration', date: '2024-01-28' }
    ],
    personalInsights: [
      {
        category: 'Progression',
        insight: 'Votre régularité s\'améliore constamment (+23% ce mois)',
        impact: 'high'
      },
      {
        category: 'Préférences',
        insight: 'Vous répondez mieux aux sessions du soir',
        impact: 'medium'
      },
      {
        category: 'Potentiel',
        insight: 'La méditation pourrait amplifier vos résultats',
        impact: 'high'
      }
    ]
  };

  return monthlyData;
}

async function generateRealtimeAnalytics(userId: string) {
  const realtimeData = {
    currentState: {
      emotion: 'calm',
      intensity: 0.7,
      confidence: 0.89,
      timestamp: new Date().toISOString()
    },
    recentActivity: {
      last24h: {
        sessionsCompleted: Math.floor(Math.random() * 5) + 1,
        avgIntensity: (Math.random() * 0.5 + 0.4).toFixed(2),
        emotionChanges: Math.floor(Math.random() * 8) + 3
      }
    },
    liveRecommendations: [
      {
        type: 'immediate',
        action: 'Session de respiration de 3 minutes',
        reason: 'Votre niveau de stress semble légèrement élevé',
        urgency: 'medium'
      },
      {
        type: 'preventive',
        action: 'Planifier une pause dans 30 minutes',
        reason: 'Pattern habituel de fatigue détecté',
        urgency: 'low'
      }
    ],
    environmentalFactors: {
      timeOfDay: 'optimal',
      dayOfWeek: 'typical',
      weather: 'positive_impact',
      socialContext: 'neutral'
    }
  };

  return realtimeData;
}

async function generateEmotionPredictions(userId: string) {
  const predictions = {
    nextHour: {
      predictedEmotion: 'calm',
      confidence: 0.78,
      factors: ['consistent_pattern', 'time_of_day', 'recent_activity']
    },
    nextDay: {
      expectedWellness: 82,
      riskFactors: ['monday_effect', 'weather_change'],
      opportunities: ['morning_routine', 'social_interaction']
    },
    nextWeek: {
      trendDirection: 'improving',
      suggestedGoals: [
        'Maintenir la régularité des sessions',
        'Explorer la méditation guidée',
        'Intégrer des micro-pauses'
      ],
      potentialChallenges: [
        'Charge de travail élevée prévue jeudi',
        'Weekend social intensif'
      ]
    },
    personalizationSuggestions: [
      {
        area: 'timing',
        suggestion: 'Décaler les sessions de 30 minutes plus tôt',
        expectedImprovement: '15%'
      },
      {
        area: 'content',
        suggestion: 'Inclure plus d\'exercices de gratitude',
        expectedImprovement: '12%'
      }
    ]
  };

  return predictions;
}

function generateRandomTriggers(): string[] {
  const triggers = [
    'travail intense', 'interaction sociale', 'pause déjeuner', 'transport',
    'appel famille', 'exercice physique', 'lecture', 'musique',
    'réunion', 'notification', 'météo', 'repos'
  ];
  
  const count = Math.floor(Math.random() * 3) + 1;
  const selected = [];
  
  for (let i = 0; i < count; i++) {
    const trigger = triggers[Math.floor(Math.random() * triggers.length)];
    if (!selected.includes(trigger)) {
      selected.push(trigger);
    }
  }
  
  return selected;
}

function getWeekStart(): string {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  return monday.toISOString().split('T')[0];
}

function generateEmotionalJourney(): Array<{day: string, morning: string, afternoon: string, evening: string}> {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const emotions = ['joy', 'calm', 'stress', 'excitement', 'neutral'];
  
  return days.map(day => ({
    day,
    morning: emotions[Math.floor(Math.random() * emotions.length)],
    afternoon: emotions[Math.floor(Math.random() * emotions.length)],
    evening: emotions[Math.floor(Math.random() * emotions.length)]
  }));
}

function generateMonthlyEvolution() {
  const weeks = ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'];
  
  return weeks.map((week, index) => ({
    week,
    wellnessScore: 65 + (index * 5) + Math.floor(Math.random() * 10),
    consistency: 60 + (index * 8) + Math.floor(Math.random() * 8),
    engagement: 70 + (index * 3) + Math.floor(Math.random() * 15),
    emotionalStability: 58 + (index * 7) + Math.floor(Math.random() * 12)
  }));
}