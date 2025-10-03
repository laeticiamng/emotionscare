import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ActivityRequest {
  activity_type: string;
  activity_name: string;
  duration?: number; // en secondes
  completion_percentage?: number; // 0-100
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  session_data?: Record<string, any>;
}

interface GamificationResponse {
  points_earned: number;
  total_points: number;
  achievements_unlocked: string[];
  level_info: {
    current_level: number;
    level_name: string;
    progress_to_next: number;
    next_level_threshold: number;
  };
  streak_info: {
    current_streak: number;
    longest_streak: number;
    streak_type: string; // 'daily', 'weekly'
  };
  recommendations: string[];
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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Authentification requise')
    }

    const {
      activity_type,
      activity_name,
      duration = 0,
      completion_percentage = 100,
      difficulty_level = 'beginner',
      session_data = {}
    }: ActivityRequest = await req.json()

    console.log('🎮 Tracking activité gamification:', { activity_type, activity_name, user_id: user.id })

    // Calculer les points selon le type d'activité et la difficulté
    const basePoints = {
      'meditation': 10,
      'vr_session': 15,
      'breathwork': 8,
      'emotion_scan': 5,
      'voice_journal': 7,
      'coach_chat': 12,
      'music_generation': 15,
      'privacy_setup': 5,
      'goal_completion': 20
    }

    const difficultyMultiplier = {
      'beginner': 1.0,
      'intermediate': 1.5,
      'advanced': 2.0
    }

    const completionMultiplier = completion_percentage / 100
    const durationBonus = Math.min(Math.floor(duration / 60), 10) // Bonus pour la durée (max 10 points)
    
    const points_earned = Math.round(
      (basePoints[activity_type as keyof typeof basePoints] || 5) * 
      difficultyMultiplier[difficulty_level] * 
      completionMultiplier + 
      durationBonus
    )

    // Vérifier les achievements débloqués
    let achievements_unlocked: string[] = []

    // Récupérer les activités précédentes de l'utilisateur
    const { data: userActivities } = await supabase
      .from('gamification_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    const activityCount = userActivities?.length || 0
    const totalPoints = (userActivities?.reduce((sum, activity) => sum + activity.points_earned, 0) || 0) + points_earned

    // Logique d'achievements
    if (activityCount === 0) {
      achievements_unlocked.push('Premier pas')
    }
    if (activityCount === 9) {
      achievements_unlocked.push('Explorer dévoué')
    }
    if (activityCount === 49) {
      achievements_unlocked.push('Maître du bien-être')
    }
    if (totalPoints >= 100) {
      achievements_unlocked.push('Centurion')
    }
    if (totalPoints >= 500) {
      achievements_unlocked.push('Champion')
    }

    // Vérifier les streaks (activités quotidiennes)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const todayActivities = userActivities?.filter(activity => 
      activity.created_at.split('T')[0] === today
    ) || []
    
    const yesterdayActivities = userActivities?.filter(activity => 
      activity.created_at.split('T')[0] === yesterday
    ) || []

    let current_streak = 1 // Au moins aujourd'hui
    if (todayActivities.length > 0 && yesterdayActivities.length > 0) {
      // Calculer le streak en remontant
      let streak = 1
      for (let i = 1; i < 30; i++) { // Vérifier max 30 jours
        const checkDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dayActivities = userActivities?.filter(activity => 
          activity.created_at.split('T')[0] === checkDate
        ) || []
        
        if (dayActivities.length > 0) {
          streak++
        } else {
          break
        }
      }
      current_streak = streak
    }

    // Achievements de streak
    if (current_streak === 7) {
      achievements_unlocked.push('Une semaine de régularité')
    }
    if (current_streak === 30) {
      achievements_unlocked.push('Mois de constance')
    }

    // Achievements spéciaux par type d'activité
    const typeCount = userActivities?.filter(a => a.activity_type === activity_type).length || 0
    if (typeCount === 4) { // 5ème fois (0-indexé)
      achievements_unlocked.push(`Expert ${activity_type}`)
    }

    // Calculer le niveau
    const levelThresholds = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000, 5000]
    let current_level = 1
    let next_level_threshold = 50

    for (let i = 0; i < levelThresholds.length; i++) {
      if (totalPoints >= levelThresholds[i]) {
        current_level = i + 1
        next_level_threshold = levelThresholds[i + 1] || levelThresholds[i] + 2000
      }
    }

    const level_names = [
      'Novice', 'Apprenti', 'Pratiquant', 'Initié', 'Adepte', 
      'Expert', 'Maître', 'Sage', 'Gourou', 'Enlightened'
    ]

    const progress_to_next = Math.round(
      ((totalPoints - levelThresholds[current_level - 1]) / 
       (next_level_threshold - levelThresholds[current_level - 1])) * 100
    )

    // Enregistrer l'activité
    await supabase.from('gamification_activities').insert({
      user_id: user.id,
      activity_type,
      activity_name,
      points_earned,
      duration,
      completion_percentage,
      difficulty_level,
      achievements_unlocked,
      session_data
    })

    // Générer des recommandations personnalisées
    const recommendations = []
    
    if (completion_percentage < 80) {
      recommendations.push('Essayez de terminer complètement vos sessions pour maximiser les bénéfices')
    }
    
    if (current_streak < 3) {
      recommendations.push('La régularité est clé - essayez de pratiquer quotidiennement')
    }
    
    if (typeCount < 2) {
      recommendations.push(`Excellent début avec ${activity_name}! Continuez à explorer cette pratique`)
    }
    
    // Recommandations selon le type d'activité
    const activityRecommendations = {
      'meditation': ['Essayez la méditation guidée de 10 minutes', 'Explorez différents types de méditation'],
      'vr_session': ['Découvrez les environnements VR avancés', 'Combinez VR et méditation'],
      'emotion_scan': ['Tenez un journal émotionnel quotidien', 'Analysez vos patterns émotionnels'],
      'breathwork': ['Pratiquez la cohérence cardiaque', 'Essayez les techniques de respiration avancées']
    }
    
    const typeRecs = activityRecommendations[activity_type as keyof typeof activityRecommendations]
    if (typeRecs) {
      recommendations.push(typeRecs[Math.floor(Math.random() * typeRecs.length)])
    }

    const response: GamificationResponse = {
      points_earned,
      total_points: totalPoints,
      achievements_unlocked,
      level_info: {
        current_level,
        level_name: level_names[Math.min(current_level - 1, level_names.length - 1)],
        progress_to_next,
        next_level_threshold
      },
      streak_info: {
        current_streak,
        longest_streak: Math.max(current_streak, 1), // TODO: calculer le vrai longest
        streak_type: 'daily'
      },
      recommendations: recommendations.slice(0, 3) // Max 3 recommendations
    }

    console.log('✅ Activité trackée:', { points_earned, achievements: achievements_unlocked.length })

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Erreur gamification tracking:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      points_earned: 0,
      total_points: 0,
      achievements_unlocked: [],
      level_info: {
        current_level: 1,
        level_name: 'Novice',
        progress_to_next: 0,
        next_level_threshold: 50
      },
      streak_info: {
        current_streak: 0,
        longest_streak: 0,
        streak_type: 'daily'
      },
      recommendations: ['Réessayez dans un moment']
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})