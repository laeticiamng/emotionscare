
import { supabase } from '@/integrations/supabase/client';
import type { Challenge, UserChallenge, Badge, UserBadge } from '../types/gamification';

// Mock data (until we create actual tables in Supabase)
const mockChallenges: Challenge[] = [
  { 
    id: '1', 
    title: 'Journal quotidien', 
    description: 'Écrivez dans votre journal aujourd\'hui',
    points: 10 
  },
  { 
    id: '2', 
    title: 'Scan émotionnel', 
    description: 'Complétez un scan émotionnel',
    points: 15 
  },
  { 
    id: '3', 
    title: 'Exercice de respiration', 
    description: 'Faites 5 minutes d\'exercices de respiration',
    points: 5 
  }
];

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Obtenez 10 points en une journée',
    icon_url: '/badges/first-steps.svg',
    threshold: 10
  },
  {
    id: '2',
    name: 'Super conscient',
    description: 'Obtenez 25 points en une journée',
    icon_url: '/badges/super-aware.svg',
    threshold: 25
  },
  {
    id: '3',
    name: 'Maître du bien-être',
    description: 'Obtenez 50 points en une journée',
    icon_url: '/badges/wellness-master.svg',
    threshold: 50
  }
];

/** 1) Récupérer la liste des challenges disponibles */
export async function fetchChallenges(): Promise<Challenge[]> {
  // In a real implementation, we would query the database
  // const { data, error } = await supabase
  //   .from('challenges')
  //   .select('*')
  //   .order('points', { ascending: false });
    
  // if (error) throw error;
  // return data || [];
  
  // Using mock data for now
  return Promise.resolve(mockChallenges);
}

/** 2) Récupérer la progression de l'utilisateur pour aujourd'hui */
export async function fetchUserChallenges(user_id: string): Promise<UserChallenge[]> {
  // In a real implementation, we would query the database
  // const today = new Date().toISOString().slice(0,10);
  // const { data, error } = await supabase
  //   .from('user_challenges')
  //   .select('*')
  //   .eq('user_id', user_id)
  //   .like('date', `${today}%`);
    
  // if (error) throw error;
  // return data || [];
  
  // Mock data - let's assume the first challenge is completed
  const today = new Date().toISOString();
  return Promise.resolve([
    {
      id: '101',
      user_id,
      challenge_id: '1',
      date: today,
      completed: true
    }
  ]);
}

/** 3) Marquer un challenge comme complété */
export async function completeChallenge(uc: Omit<UserChallenge,'id'>): Promise<UserChallenge> {
  // In a real implementation, we would upsert to the database
  // const { data, error } = await supabase
  //   .from('user_challenges')
  //   .upsert(uc, { onConflict: 'user_id,challenge_id,date' })
  //   .select('*')
  //   .single();
    
  // if (error || !data) throw error || new Error("Failed to complete challenge");
  // return data;
  
  // Mock implementation - just return the challenge with an ID
  return Promise.resolve({
    ...uc,
    id: Math.random().toString(36).substring(2, 9)
  });
}

/** 4) Récupérer les badges et ceux déjà gagnés */
export async function fetchBadges(user_id: string): Promise<{ all: Badge[]; earned: UserBadge[] }> {
  // In a real implementation, we would query the database
  // const [{ data: all, error: allErr }, { data: earned, error: earnedErr }] = await Promise.all([
  //   supabase.from('badges').select('*'),
  //   supabase.from('user_badges').select('*').eq('user_id', user_id),
  // ]);
  
  // if (allErr || earnedErr) throw allErr || earnedErr;
  // return { all: all || [], earned: earned || [] };
  
  // Mock implementation - assume the user has earned the first badge
  const mockUserBadges: UserBadge[] = [
    {
      id: '201',
      user_id,
      badge_id: '1',
      awarded_on: new Date().toISOString()
    }
  ];
  
  return Promise.resolve({ 
    all: mockBadges, 
    earned: mockUserBadges 
  });
}

/** 5) Attribuer un badge */
export async function awardBadge(ub: Omit<UserBadge,'id'>): Promise<UserBadge> {
  // In a real implementation, we would insert to the database
  // const { data, error } = await supabase
  //   .from('user_badges')
  //   .insert(ub)
  //   .select('*')
  //   .single();
    
  // if (error || !data) throw error || new Error("Failed to award badge");
  // return data;
  
  // Mock implementation - just return with an ID
  return Promise.resolve({
    ...ub,
    id: Math.random().toString(36).substring(2, 9)
  });
}
