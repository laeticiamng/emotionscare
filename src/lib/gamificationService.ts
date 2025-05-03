
import { supabase } from '@/integrations/supabase/client';
import type { Challenge, UserChallenge, Badge, UserBadge } from '../types/gamification';

/** 1) Récupérer la liste des challenges disponibles */
export async function fetchChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('points', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

/** 2) Récupérer la progression de l'utilisateur pour aujourd'hui */
export async function fetchUserChallenges(user_id: string): Promise<UserChallenge[]> {
  const today = new Date().toISOString().slice(0,10);
  const { data, error } = await supabase
    .from('user_challenges')
    .select('*')
    .eq('user_id', user_id)
    .like('date', `${today}%`);
    
  if (error) throw error;
  return data || [];
}

/** 3) Marquer un challenge comme complété */
export async function completeChallenge(uc: Omit<UserChallenge,'id'>): Promise<UserChallenge> {
  const { data, error } = await supabase
    .from('user_challenges')
    .upsert(uc, { onConflict: 'user_id,challenge_id,date' })
    .select('*')
    .single();
    
  if (error || !data) throw error || new Error("Failed to complete challenge");
  return data;
}

/** 4) Récupérer les badges et ceux déjà gagnés */
export async function fetchBadges(user_id: string): Promise<{ all: Badge[]; earned: UserBadge[] }> {
  const [{ data: all, error: allErr }, { data: earned, error: earnedErr }] = await Promise.all([
    supabase.from('badges').select('*'),
    supabase.from('user_badges').select('*').eq('user_id', user_id),
  ]);
  
  if (allErr || earnedErr) throw allErr || earnedErr;
  return { all: all || [], earned: earned || [] };
}

/** 5) Attribuer un badge */
export async function awardBadge(ub: Omit<UserBadge,'id'>): Promise<UserBadge> {
  const { data, error } = await supabase
    .from('user_badges')
    .insert(ub)
    .select('*')
    .single();
    
  if (error || !data) throw error || new Error("Failed to award badge");
  return data;
}
