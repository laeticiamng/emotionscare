/**
 * Hook pour générer des recommandations dynamiques basées sur les données utilisateur
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  reason: string;
  to: string;
  icon: 'breath' | 'music' | 'journal' | 'scan' | 'coach';
  priority: number;
}

interface UserContext {
  lastScanMood?: string;
  lastScanTime?: Date;
  streakDays: number;
  weeklyGoals: number;
  preferredModules: string[];
}

const RECOMMENDATIONS_CONFIG: Record<string, Recommendation> = {
  breath_stress: {
    id: 'breath_stress',
    title: 'Session de respiration apaisante',
    description: 'Réduisez votre stress avec une session guidée de 5 minutes',
    reason: 'Détente recommandée après une journée chargée',
    to: '/app/breath',
    icon: 'breath',
    priority: 1
  },
  music_focus: {
    id: 'music_focus',
    title: 'Musique de concentration',
    description: 'Sons binauraux pour améliorer votre focus',
    reason: 'Boost de productivité adapté à votre rythme',
    to: '/app/music',
    icon: 'music',
    priority: 2
  },
  journal_reflect: {
    id: 'journal_reflect',
    title: 'Moment de réflexion',
    description: 'Prenez 3 minutes pour noter vos pensées',
    reason: 'Écrire clarifie l\'esprit et réduit l\'anxiété',
    to: '/app/journal',
    icon: 'journal',
    priority: 3
  },
  scan_checkin: {
    id: 'scan_checkin',
    title: 'Check-in émotionnel',
    description: 'Analysez votre état émotionnel actuel',
    reason: 'Gardez une trace de votre bien-être quotidien',
    to: '/app/scan',
    icon: 'scan',
    priority: 4
  },
  coach_talk: {
    id: 'coach_talk',
    title: 'Discuter avec Nyvée',
    description: 'Votre coach IA est disponible pour vous écouter',
    reason: 'Un soutien bienveillant à portée de main',
    to: '/app/coach',
    icon: 'coach',
    priority: 5
  },
  breath_morning: {
    id: 'breath_morning',
    title: 'Respiration matinale',
    description: 'Commencez la journée avec une respiration énergisante',
    reason: 'Éveillez votre corps et votre esprit',
    to: '/app/breath',
    icon: 'breath',
    priority: 1
  },
  music_sleep: {
    id: 'music_sleep',
    title: 'Musique pour dormir',
    description: 'Sons relaxants pour une nuit paisible',
    reason: 'Préparez-vous à un sommeil réparateur',
    to: '/app/music',
    icon: 'music',
    priority: 2
  }
};

async function fetchUserContext(userId: string): Promise<UserContext> {
  const [lastScan, userStats, recentActivity, clinicalSignals] = await Promise.all([
    supabase
      .from('scan_history')
      .select('dominant_emotion, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('user_stats')
      .select('streak_days')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase
      .from('activity_sessions')
      .select('activity_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(5),
    supabase
      .from('clinical_signals')
      .select('metadata, source_instrument')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3)
  ]);

  // Analyser les signaux cliniques pour détecter le mood
  let detectedMood: string | undefined = lastScan.data?.dominant_emotion;
  
  if (clinicalSignals.data && clinicalSignals.data.length > 0) {
    for (const signal of clinicalSignals.data) {
      const metadata = signal.metadata as Record<string, unknown> | null;
      if (metadata?.dominant_emotion) {
        detectedMood = String(metadata.dominant_emotion);
        break;
      }
      if (metadata?.mood) {
        detectedMood = String(metadata.mood);
        break;
      }
    }
  }

  // Détecter les modules préférés basés sur l'activité récente
  const preferredModules: string[] = [];
  if (recentActivity.data) {
    const activityIds = recentActivity.data.map(a => a.activity_id).filter(Boolean);
    if (activityIds.length > 0) {
      // Les IDs d'activités peuvent indiquer des préférences
      // Ex: si beaucoup de sessions breath -> préférence respiration
      preferredModules.push('breath', 'music'); // Fallback par défaut
    }
  }

  return {
    lastScanMood: detectedMood,
    lastScanTime: lastScan.data?.created_at ? new Date(lastScan.data.created_at) : undefined,
    streakDays: userStats.data?.streak_days || 0,
    weeklyGoals: 0,
    preferredModules
  };
}

function generateRecommendations(context: UserContext): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const hour = new Date().getHours();

  // Logique temporelle
  if (hour >= 6 && hour < 10) {
    // Matin : respiration énergisante
    recommendations.push(RECOMMENDATIONS_CONFIG.breath_morning);
  } else if (hour >= 21 || hour < 6) {
    // Soir/nuit : musique relaxante
    recommendations.push(RECOMMENDATIONS_CONFIG.music_sleep);
  }

  // Logique basée sur le dernier scan
  if (context.lastScanMood) {
    const stressMoods = ['anxious', 'stressed', 'overwhelmed', 'anxieux', 'stressé'];
    const sadMoods = ['sad', 'melancholic', 'down', 'triste', 'mélancolique'];
    
    if (stressMoods.some(m => context.lastScanMood?.toLowerCase().includes(m))) {
      recommendations.push(RECOMMENDATIONS_CONFIG.breath_stress);
    }
    if (sadMoods.some(m => context.lastScanMood?.toLowerCase().includes(m))) {
      recommendations.push(RECOMMENDATIONS_CONFIG.coach_talk);
    }
  }

  // Si pas de scan récent (> 24h)
  if (!context.lastScanTime || Date.now() - context.lastScanTime.getTime() > 24 * 60 * 60 * 1000) {
    recommendations.push(RECOMMENDATIONS_CONFIG.scan_checkin);
  }

  // Toujours suggérer le journal si pas d'autres recommandations
  if (recommendations.length === 0) {
    recommendations.push(RECOMMENDATIONS_CONFIG.journal_reflect);
  }

  // Ajouter concentration en milieu de journée
  if (hour >= 10 && hour < 17 && recommendations.length < 2) {
    recommendations.push(RECOMMENDATIONS_CONFIG.music_focus);
  }

  // Limiter à 2 recommandations max
  return recommendations
    .filter((r, i, arr) => arr.findIndex(x => x.id === r.id) === i)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 2);
}

export function useDynamicRecommendations() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => fetchUserContext(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
  });

  const recommendations = useMemo(() => {
    if (!query.data) {
      // Recommandation par défaut basée sur l'heure
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 10) return [RECOMMENDATIONS_CONFIG.breath_morning];
      if (hour >= 21 || hour < 6) return [RECOMMENDATIONS_CONFIG.music_sleep];
      return [RECOMMENDATIONS_CONFIG.breath_stress];
    }
    return generateRecommendations(query.data);
  }, [query.data]);

  return {
    recommendations,
    loading: query.isLoading,
    refetch: query.refetch
  };
}
