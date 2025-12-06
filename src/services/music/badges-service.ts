/**
 * Service de badges et achievements musicaux
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export interface MusicBadge {
  id: string;
  name: string;
  description: string;
  category: 'discovery' | 'consistency' | 'diversity' | 'expertise' | 'milestone';
  requirement: string;
  icon: string;
  unlocked: boolean;
  image: string;
  threshold?: number;
  progress?: number;
  unlockedAt?: string;
}

/**
 * Définitions des badges musicaux
 */
export const MUSIC_BADGES: MusicBadge[] = [
  // Découverte
  {
    id: 'first-genre',
    name: 'Premier Pas',
    description: 'Découvrez votre premier genre musical',
    category: 'discovery',
    requirement: 'Écouter 1 genre',
    icon: '🎵',
    unlocked: false,
    image: '/badges/first-genre.png'
  },
  {
    id: 'genre-explorer',
    name: 'Explorateur Musical',
    description: 'Découvrez 5 genres différents',
    category: 'discovery',
    requirement: 'Écouter 5 genres',
    icon: '🌍',
    unlocked: false,
    threshold: 5,
    image: '/badges/genre-explorer.png'
  },
  {
    id: 'genre-master',
    name: 'Maître des Genres',
    description: 'Découvrez 10 genres différents',
    category: 'discovery',
    requirement: 'Écouter 10 genres',
    icon: '🎓',
    unlocked: false,
    threshold: 10,
    image: '/badges/genre-master.png'
  },
  
  // Consistance
  {
    id: 'daily-listener',
    name: 'Auditeur Quotidien',
    description: 'Écoutez de la musique 7 jours d\'affilée',
    category: 'consistency',
    requirement: '7 jours consécutifs',
    icon: '🔥',
    unlocked: false,
    threshold: 7,
    image: '/badges/daily-listener.png'
  },
  {
    id: 'music-addict',
    name: 'Accro à la Musique',
    description: 'Écoutez de la musique 30 jours d\'affilée',
    category: 'consistency',
    requirement: '30 jours consécutifs',
    icon: '⚡',
    unlocked: false,
    threshold: 30,
    image: '/badges/music-addict.png'
  },
  
  // Diversité
  {
    id: 'mood-mixer',
    name: 'Mixeur d\'Émotions',
    description: 'Explorez 5 ambiances différentes en une semaine',
    category: 'diversity',
    requirement: '5 ambiances en 7 jours',
    icon: '🎨',
    unlocked: false,
    threshold: 5,
    image: '/badges/mood-mixer.png'
  },
  {
    id: 'eclectic-taste',
    name: 'Goût Éclectique',
    description: 'Écoutez 3 genres différents en une journée',
    category: 'diversity',
    requirement: '3 genres en 1 jour',
    icon: '🌈',
    unlocked: false,
    threshold: 3,
    image: '/badges/eclectic-taste.png'
  },
  
  // Expertise
  {
    id: 'ambient-expert',
    name: 'Expert Ambient',
    description: 'Écoutez 50 morceaux Ambient',
    category: 'expertise',
    requirement: '50 morceaux Ambient',
    icon: '🌊',
    unlocked: false,
    threshold: 50,
    image: '/badges/ambient-expert.png'
  },
  {
    id: 'classical-connoisseur',
    name: 'Connaisseur Classique',
    description: 'Écoutez 50 morceaux Classique',
    category: 'expertise',
    requirement: '50 morceaux Classique',
    icon: '🎻',
    unlocked: false,
    threshold: 50,
    image: '/badges/classical-connoisseur.png'
  },
  
  // Milestones
  {
    id: 'century-club',
    name: 'Club des 100',
    description: 'Écoutez 100 morceaux au total',
    category: 'milestone',
    requirement: '100 morceaux',
    icon: '💯',
    unlocked: false,
    threshold: 100,
    image: '/badges/century-club.png'
  },
  {
    id: 'thousand-songs',
    name: 'Mille Chansons',
    description: 'Écoutez 1000 morceaux au total',
    category: 'milestone',
    requirement: '1000 morceaux',
    icon: '🏆',
    unlocked: false,
    threshold: 1000,
    image: '/badges/thousand-songs.png'
  }
];

/**
 * Vérifie et débloque les badges basés sur l'historique d'écoute
 */
export async function checkAndUnlockBadges(
  userId: string,
  listeningHistory: any[]
): Promise<MusicBadge[]> {
  try {
    const unlockedBadges: MusicBadge[] = [];
    
    // Analyser l'historique
    const uniqueGenres = new Set(listeningHistory.map(h => h.genre || h.tags?.[0]));
    const uniqueMoods = new Set(listeningHistory.map(h => h.mood));
    const totalTracks = listeningHistory.length;
    
    // Calculer le streak
    const streak = calculateStreak(listeningHistory);
    
    // Vérifier chaque badge
    for (const badge of MUSIC_BADGES) {
      let shouldUnlock = false;
      let progress = 0;
      
      switch (badge.id) {
        case 'first-genre':
          shouldUnlock = uniqueGenres.size >= 1;
          progress = Math.min(uniqueGenres.size, 1);
          break;
        case 'genre-explorer':
          shouldUnlock = uniqueGenres.size >= 5;
          progress = uniqueGenres.size;
          break;
        case 'genre-master':
          shouldUnlock = uniqueGenres.size >= 10;
          progress = uniqueGenres.size;
          break;
        case 'daily-listener':
          shouldUnlock = streak >= 7;
          progress = streak;
          break;
        case 'music-addict':
          shouldUnlock = streak >= 30;
          progress = streak;
          break;
        case 'mood-mixer':
          shouldUnlock = uniqueMoods.size >= 5;
          progress = uniqueMoods.size;
          break;
        case 'eclectic-taste':
          // Vérifier 3 genres en 1 jour (simplifié)
          shouldUnlock = uniqueGenres.size >= 3;
          progress = uniqueGenres.size;
          break;
        case 'century-club':
          shouldUnlock = totalTracks >= 100;
          progress = totalTracks;
          break;
        case 'thousand-songs':
          shouldUnlock = totalTracks >= 1000;
          progress = totalTracks;
          break;
        default:
          // Badges d'expertise par genre
          if (badge.category === 'expertise') {
            const genreCount = listeningHistory.filter(h => 
              (h.genre || h.tags?.[0])?.toLowerCase().includes(badge.id.split('-')[0])
            ).length;
            shouldUnlock = genreCount >= (badge.threshold || 50);
            progress = genreCount;
          }
      }
      
      if (shouldUnlock && !badge.unlocked) {
        const unlockedBadge = { ...badge, unlocked: true, unlockedAt: new Date().toISOString() };
        unlockedBadges.push(unlockedBadge);
      } else if (!badge.unlocked && badge.threshold) {
        // Mettre à jour la progression
        badge.progress = progress;
      }
    }
    
    logger.info('Checked music badges', { unlocked: unlockedBadges.length }, 'MUSIC');
    return unlockedBadges;
  } catch (error) {
    logger.error('Failed to check badges', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Calcule le streak de jours consécutifs
 */
function calculateStreak(listeningHistory: any[]): number {
  if (listeningHistory.length === 0) return 0;

  // Trier par date décroissante
  const sortedHistory = [...listeningHistory].sort((a, b) =>
    new Date(b.created_at || b.timestamp || b.date).getTime() -
    new Date(a.created_at || a.timestamp || a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Parcourir l'historique pour compter les jours consécutifs
  for (const entry of sortedHistory) {
    const entryDate = new Date(entry.created_at || entry.timestamp || entry.date);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    // Si c'est aujourd'hui ou hier, incrémenter le streak
    if (diffDays === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffDays > streak) {
      // Jour manquant, fin du streak
      break;
    }
  }

  return streak;
}

/**
 * Récupère les badges d'un utilisateur
 */
export async function getUserMusicBadges(userId: string): Promise<MusicBadge[]> {
  try {
    // Récupérer les badges utilisateur depuis Supabase
    const { data: userBadges, error } = await supabase
      .from('user_music_badges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to fetch user badges from DB', error as Error, 'MUSIC');
      // Fallback sur les badges par défaut
      return MUSIC_BADGES.map(badge => ({ ...badge }));
    }

    // Mapper les badges avec leur statut de déverrouillage
    const badgeMap = new Map(userBadges?.map(ub => [ub.badge_id, ub]) || []);

    return MUSIC_BADGES.map(badge => {
      const userBadge = badgeMap.get(badge.id);
      return {
        ...badge,
        unlocked: userBadge?.is_unlocked || false,
        progress: userBadge?.progress || 0,
        unlockedAt: userBadge?.earned_at,
      };
    });
  } catch (error) {
    logger.error('Failed to get user badges', error as Error, 'MUSIC');
    return MUSIC_BADGES.map(badge => ({ ...badge }));
  }
}
