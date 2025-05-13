
import { Badge } from '@/types/gamification';
import { supabase } from '@/integrations/supabase/client';

// Cache temporaire pour les badges
let badgeCache: Record<string, Badge[]> = {};

/**
 * Récupère les badges d'un utilisateur
 * @param userId Identifiant de l'utilisateur
 */
export const getBadges = async (userId: string): Promise<Badge[]> => {
  // Si on a les badges en cache, on les retourne
  if (badgeCache[userId]) {
    return badgeCache[userId];
  }

  try {
    // Dans une vraie implémentation, on récupérerait les badges depuis le backend
    // Ici on simule une réponse avec un délai
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Badges de démonstration
    const badges: Badge[] = [
      {
        id: "badge1",
        name: "Premier Pas",
        description: "S'être connecté pour la première fois",
        imageUrl: "/badges/first-login.svg",
        category: "débutant",
        unlocked: true,
        date_earned: new Date().toISOString(),
        tier: "bronze"
      },
      {
        id: "badge2",
        name: "Explorateur Émotionnel",
        description: "Explorer 5 différentes émotions",
        imageUrl: "/badges/emotion-explorer.svg",
        category: "découverte",
        unlocked: true,
        date_earned: new Date(Date.now() - 86400000 * 3).toISOString(),
        tier: "bronze"
      },
      {
        id: "badge3",
        name: "Journaliste en Herbe",
        description: "Écrire 7 entrées de journal consécutives",
        imageUrl: "/badges/journal-streak.svg",
        category: "journal",
        unlocked: false,
        progress: 45,
        tier: "silver"
      },
      {
        id: "badge4",
        name: "Maître Zen",
        description: "Compléter 10 sessions de méditation",
        imageUrl: "/badges/meditation-master.svg",
        category: "bien-être",
        unlocked: false,
        progress: 30,
        tier: "gold"
      },
      {
        id: "badge5",
        name: "Expert Musical",
        description: "Écouter 15 playlists thérapeutiques",
        imageUrl: "/badges/music-expert.svg",
        category: "musicothérapie",
        unlocked: false,
        progress: 70,
        tier: "silver"
      }
    ];
    
    // Sauvegarder en cache
    badgeCache[userId] = badges;
    
    return badges;
  } catch (error) {
    console.error('Erreur lors de la récupération des badges:', error);
    throw new Error('Impossible de récupérer les badges');
  }
};

/**
 * Déverrouille un badge pour un utilisateur
 * @param userId Identifiant de l'utilisateur
 * @param badgeId Identifiant du badge à déverrouiller
 */
export const unlockBadge = async (userId: string, badgeId: string): Promise<void> => {
  try {
    // Dans une vraie implémentation, on mettrait à jour le backend
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mettre à jour le cache
    if (badgeCache[userId]) {
      const userBadges = badgeCache[userId];
      const badgeIndex = userBadges.findIndex(b => b.id === badgeId);
      
      if (badgeIndex >= 0) {
        userBadges[badgeIndex] = {
          ...userBadges[badgeIndex],
          unlocked: true,
          date_earned: new Date().toISOString(),
          progress: 100
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors du déverrouillage du badge:', error);
    throw new Error('Impossible de déverrouiller le badge');
  }
};

/**
 * Vérifie si un utilisateur remplit les conditions pour obtenir un badge
 * @param userId Identifiant de l'utilisateur
 * @param badgeId Identifiant du badge à vérifier
 */
export const checkBadgeEligibility = async (
  userId: string,
  badgeId: string
): Promise<{ eligible: boolean; progress: number }> => {
  try {
    // Simuler la vérification des conditions
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Retourner une réponse simulée
    return {
      eligible: Math.random() > 0.7,
      progress: Math.floor(Math.random() * 100)
    };
  } catch (error) {
    console.error("Erreur lors de la vérification d'éligibilité au badge:", error);
    throw new Error("Impossible de vérifier l'éligibilité au badge");
  }
};

/**
 * Obtient les badges liés à une émotion spécifique
 * @param emotion Emotion pour laquelle chercher des badges
 */
export const getEmotionBadges = async (emotion: string): Promise<Badge[]> => {
  try {
    // Simuler la récupération des badges liés à une émotion
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Badges de démonstration liés aux émotions
    const emotionBadges: Record<string, Badge[]> = {
      "happy": [
        {
          id: "joy_explorer",
          name: "Explorateur de Joie",
          description: "Identifier et comprendre les nuances de la joie",
          category: "émotions",
          imageUrl: "/badges/joy-explorer.svg",
          unlocked: false,
          tier: "silver"
        }
      ],
      "calm": [
        {
          id: "serenity_master",
          name: "Maître de Sérénité",
          description: "Maintenir un état de calme pendant des périodes stressantes",
          category: "émotions",
          imageUrl: "/badges/serenity-master.svg",
          unlocked: false,
          tier: "gold"
        }
      ],
      "sad": [
        {
          id: "resilience_badge",
          name: "Badge de Résilience",
          description: "Transformer la tristesse en croissance personnelle",
          category: "émotions",
          imageUrl: "/badges/resilience.svg",
          unlocked: false,
          tier: "gold"
        }
      ]
    };
    
    return emotionBadges[emotion.toLowerCase()] || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des badges liés aux émotions:', error);
    return [];
  }
};

/**
 * Génère un badge pour une récompense spécifique
 * @param type Type de récompense
 * @param name Nom de la récompense
 */
export const generateRewardBadge = (type: string, name: string): Badge => {
  return {
    id: `reward_${Date.now()}`,
    name: `${name}`,
    description: `Badge de récompense pour ${type}`,
    category: "récompense",
    unlocked: true,
    date_earned: new Date().toISOString(),
    tier: "silver",
    icon: "award"
  };
};

export default {
  getBadges,
  unlockBadge,
  checkBadgeEligibility,
  getEmotionBadges,
  generateRewardBadge
};
