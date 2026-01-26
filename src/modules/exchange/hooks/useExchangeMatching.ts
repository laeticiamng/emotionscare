/**
 * Exchange Matching Algorithm - Algorithme de matching intelligent
 * Utilise un système de scoring multi-critères pour le matching
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MatchCandidate {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  matchScore: number;
  matchReasons: string[];
  commonInterests: string[];
  compatibilityFactors: {
    emotionalSync: number;
    activityOverlap: number;
    skillComplement: number;
    scheduleMatch: number;
  };
}

interface UserProfile {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  interests?: string[];
  skills?: string[];
  timezone?: string;
  active_hours?: string[];
  emotional_preferences?: string[];
}

interface UserActivity {
  user_id: string;
  activity_type: string;
  created_at: string;
  metadata?: Record<string, any>;
}

// Algorithme de scoring multi-critères
function calculateMatchScore(
  currentUser: UserProfile,
  candidate: UserProfile,
  currentActivities: UserActivity[],
  candidateActivities: UserActivity[]
): { score: number; factors: MatchCandidate['compatibilityFactors']; reasons: string[] } {
  const reasons: string[] = [];
  
  // 1. Calcul de la synchronisation émotionnelle (25%)
  const emotionalSync = calculateEmotionalSync(
    currentUser.emotional_preferences || [],
    candidate.emotional_preferences || []
  );
  if (emotionalSync > 0.7) reasons.push('Profil émotionnel compatible');

  // 2. Calcul du chevauchement d'activités (25%)
  const activityOverlap = calculateActivityOverlap(currentActivities, candidateActivities);
  if (activityOverlap > 0.5) reasons.push('Activités similaires');

  // 3. Calcul de la complémentarité des compétences (25%)
  const skillComplement = calculateSkillComplement(
    currentUser.skills || [],
    candidate.skills || []
  );
  if (skillComplement > 0.6) reasons.push('Compétences complémentaires');

  // 4. Calcul de la compatibilité horaire (25%)
  const scheduleMatch = calculateScheduleMatch(
    currentUser.active_hours || [],
    candidate.active_hours || [],
    currentUser.timezone,
    candidate.timezone
  );
  if (scheduleMatch > 0.7) reasons.push('Disponibilités compatibles');

  // 5. Bonus pour intérêts communs
  const commonInterests = findCommonInterests(
    currentUser.interests || [],
    candidate.interests || []
  );
  if (commonInterests.length >= 3) reasons.push(`${commonInterests.length} intérêts communs`);

  // Score pondéré final
  const baseScore = (
    emotionalSync * 0.25 +
    activityOverlap * 0.25 +
    skillComplement * 0.25 +
    scheduleMatch * 0.25
  );

  // Bonus pour intérêts communs (jusqu'à +20%)
  const interestBonus = Math.min(0.2, commonInterests.length * 0.04);
  
  const finalScore = Math.min(1, baseScore + interestBonus);

  return {
    score: Math.round(finalScore * 100),
    factors: {
      emotionalSync: Math.round(emotionalSync * 100),
      activityOverlap: Math.round(activityOverlap * 100),
      skillComplement: Math.round(skillComplement * 100),
      scheduleMatch: Math.round(scheduleMatch * 100)
    },
    reasons
  };
}

function calculateEmotionalSync(prefs1: string[], prefs2: string[]): number {
  if (prefs1.length === 0 || prefs2.length === 0) return 0.5; // Neutral
  const common = prefs1.filter(p => prefs2.includes(p));
  return common.length / Math.max(prefs1.length, prefs2.length);
}

function calculateActivityOverlap(activities1: UserActivity[], activities2: UserActivity[]): number {
  const types1 = new Set(activities1.map(a => a.activity_type));
  const types2 = new Set(activities2.map(a => a.activity_type));
  
  if (types1.size === 0 || types2.size === 0) return 0.3;
  
  const intersection = [...types1].filter(t => types2.has(t));
  return intersection.length / Math.max(types1.size, types2.size);
}

function calculateSkillComplement(skills1: string[], skills2: string[]): number {
  if (skills1.length === 0 || skills2.length === 0) return 0.5;
  
  // Complémentarité = skills différents qui peuvent s'entraider
  const unique1 = skills1.filter(s => !skills2.includes(s));
  const unique2 = skills2.filter(s => !skills1.includes(s));
  
  // Score basé sur la diversité des compétences
  const diversity = (unique1.length + unique2.length) / (skills1.length + skills2.length);
  return Math.min(1, diversity + 0.3); // Bonus de base
}

function calculateScheduleMatch(
  hours1: string[],
  hours2: string[],
  _tz1?: string,
  _tz2?: string
): number {
  if (hours1.length === 0 || hours2.length === 0) return 0.5;
  
  // Pour simplifier, on compare directement les heures
  const overlap = hours1.filter(h => hours2.includes(h));
  return overlap.length / Math.max(hours1.length, hours2.length);
}

function findCommonInterests(interests1: string[], interests2: string[]): string[] {
  return interests1.filter(i => 
    interests2.some(i2 => i2.toLowerCase() === i.toLowerCase())
  );
}

// Hook principal pour le matching
export const useExchangeMatching = (marketType: 'time' | 'trust' | 'improvement' | 'emotion') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['exchange-matches', user?.id, marketType],
    queryFn: async (): Promise<MatchCandidate[]> => {
      if (!user?.id) return [];

      // Récupérer le profil de l'utilisateur courant
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Récupérer les activités récentes de l'utilisateur
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const [breathingResult, coachResult] = await Promise.all([
        supabase.from('breathing_vr_sessions')
          .select('user_id, created_at')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo),
        supabase.from('ai_coach_sessions')
          .select('user_id, created_at')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo)
      ]);

      const currentActivities: UserActivity[] = [
        ...(breathingResult.data || []).map(s => ({ 
          user_id: s.user_id, 
          activity_type: 'breathing', 
          created_at: s.created_at 
        })),
        ...(coachResult.data || []).map(s => ({ 
          user_id: s.user_id, 
          activity_type: 'coaching', 
          created_at: s.created_at 
        }))
      ];

      // Récupérer les candidats potentiels
      const { data: candidates } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .limit(50);

      if (!candidates || candidates.length === 0) return [];

      // Récupérer les activités des candidats
      const candidateIds = candidates.map(c => c.user_id);
      
      const [candBreathing, candCoach] = await Promise.all([
        supabase.from('breathing_vr_sessions')
          .select('user_id, created_at')
          .in('user_id', candidateIds)
          .gte('created_at', thirtyDaysAgo),
        supabase.from('ai_coach_sessions')
          .select('user_id, created_at')
          .in('user_id', candidateIds)
          .gte('created_at', thirtyDaysAgo)
      ]);

      const candidateActivitiesMap = new Map<string, UserActivity[]>();
      
      [...(candBreathing.data || []), ...(candCoach.data || [])].forEach(a => {
        const activities = candidateActivitiesMap.get(a.user_id) || [];
        activities.push({
          user_id: a.user_id,
          activity_type: a.user_id === candBreathing.data?.find(b => b.user_id === a.user_id)?.user_id ? 'breathing' : 'coaching',
          created_at: a.created_at
        });
        candidateActivitiesMap.set(a.user_id, activities);
      });

      // Calculer les scores pour chaque candidat
      const matches: MatchCandidate[] = candidates.map(candidate => {
        const candidateActivities = candidateActivitiesMap.get(candidate.user_id) || [];
        
        const { score, factors, reasons } = calculateMatchScore(
          currentProfile || { user_id: user.id },
          candidate,
          currentActivities,
          candidateActivities
        );

        const commonInterests = findCommonInterests(
          (currentProfile as any)?.interests || [],
          (candidate as any)?.interests || []
        );

        return {
          userId: candidate.user_id,
          displayName: candidate.display_name || 'Utilisateur',
          avatarUrl: candidate.avatar_url,
          matchScore: score,
          matchReasons: reasons,
          commonInterests,
          compatibilityFactors: factors
        };
      });

      // Trier par score décroissant et retourner les meilleurs
      return matches
        .filter(m => m.matchScore >= 30) // Minimum 30% de compatibilité
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour créer une connexion
export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
 mutationFn: async ({ targetUserId }: { targetUserId: string; marketType: string }) => {
      const { error } = await supabase
        .from('buddies')
        .insert({
          user_id: user?.id,
          buddy_user_id: targetUserId,
          date: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchange-matches'] });
      queryClient.invalidateQueries({ queryKey: ['buddies'] });
    }
  });
};
