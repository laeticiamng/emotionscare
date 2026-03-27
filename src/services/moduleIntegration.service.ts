// @ts-nocheck
/**
 * Service de mapping pour l'intégration backend des modules
 * Définit les configurations et achievements pour chaque module
 */

export interface ModuleConfig {
  name: string;
  displayName: string;
  type: 'journey' | 'challenge' | 'collection' | 'social';
  achievements: AchievementConfig[];
  pointsPerAction: number;
  maxLevel: number;
}

export interface AchievementConfig {
  type: string;
  title: string;
  description: string;
  emoji: string;
  condition: (progress: any) => boolean;
  points: number;
}

export const moduleConfigs: Record<string, ModuleConfig> = {
  'flash-glow': {
    name: 'flash-glow',
    displayName: 'Flash Glow Arena',
    type: 'challenge',
    pointsPerAction: 10,
    maxLevel: 20,
    achievements: [
      {
        type: 'first_5',
        title: 'Première Série de 5!',
        description: 'Complète 5 challenges',
        emoji: '🎯',
        condition: (p) => p?.progress_data?.completed?.length >= 5,
        points: 50
      },
      {
        type: 'flash_master',
        title: 'Flash Master',
        description: 'Complète 10 challenges',
        emoji: '⚡',
        condition: (p) => p?.progress_data?.completed?.length >= 10,
        points: 100
      },
      {
        type: 'legend',
        title: 'Légende du Flash',
        description: 'Complète tous les 20 challenges',
        emoji: '👑',
        condition: (p) => p?.progress_data?.completed?.length >= 20,
        points: 500
      }
    ]
  },

  'breath-journey': {
    name: 'breath-journey',
    displayName: 'Breath Journey',
    type: 'journey',
    pointsPerAction: 15,
    maxLevel: 7,
    achievements: [
      {
        type: 'breath_explorer',
        title: 'Explorateur du Souffle',
        description: 'Débloque 3 techniques',
        emoji: '🧘',
        condition: (p) => p?.progress_data?.unlockedTechniques?.length >= 3,
        points: 75
      },
      {
        type: 'breath_master',
        title: 'Maître du Souffle',
        description: 'Maîtrise toutes les techniques',
        emoji: '🌟',
        condition: (p) => p?.progress_data?.unlockedTechniques?.length >= 7,
        points: 200
      }
    ]
  },

  'boss-grit': {
    name: 'boss-grit',
    displayName: 'Boss Grit Arena',
    type: 'challenge',
    pointsPerAction: 50,
    maxLevel: 7,
    achievements: [
      {
        type: 'first_boss',
        title: 'Premier Boss Vaincu',
        description: 'Vaincs ton premier obstacle',
        emoji: '⚔️',
        condition: (p) => p?.progress_data?.defeatedBosses?.length >= 1,
        points: 50
      },
      {
        type: 'boss_slayer',
        title: 'Tueur de Boss',
        description: 'Vaincs 5 boss',
        emoji: '🗡️',
        condition: (p) => p?.progress_data?.defeatedBosses?.length >= 5,
        points: 250
      },
      {
        type: 'ultimate_warrior',
        title: 'Guerrier Ultime',
        description: 'Vaincs tous les boss',
        emoji: '👑',
        condition: (p) => p?.progress_data?.defeatedBosses?.length >= 7,
        points: 500
      }
    ]
  },

  'avatar-flow': {
    name: 'avatar-flow',
    displayName: 'Avatar Flow Studio',
    type: 'collection',
    pointsPerAction: 25,
    maxLevel: 100,
    achievements: [
      {
        type: 'collector',
        title: 'Collectionneur d\'Avatars',
        description: 'Sauvegarde 10 avatars',
        emoji: '🎨',
        condition: (p) => p?.progress_data?.collection?.length >= 10,
        points: 100
      },
      {
        type: 'artist',
        title: 'Artiste Émotionnel',
        description: 'Crée 25 avatars',
        emoji: '✨',
        condition: (p) => p?.progress_data?.collection?.length >= 25,
        points: 250
      }
    ]
  },

  'social-lantern': {
    name: 'social-lantern',
    displayName: 'Social Lantern Plaza',
    type: 'social',
    pointsPerAction: 10,
    maxLevel: 50,
    achievements: [
      {
        type: 'first_light',
        title: 'Première Lumière',
        description: 'Lance ta première lanterne',
        emoji: '🏮',
        condition: (p) => p?.progress_data?.posts?.length >= 1,
        points: 10
      },
      {
        type: 'light_creator',
        title: 'Créateur de Lumière',
        description: 'Lance 10 lanternes',
        emoji: '✨',
        condition: (p) => p?.progress_data?.posts?.length >= 10,
        points: 100
      },
      {
        type: 'week_streak',
        title: 'Une Semaine de Flamme',
        description: 'Partage 7 jours consécutifs',
        emoji: '🔥',
        condition: (p) => p?.streak >= 7,
        points: 150
      }
    ]
  },

  'mood-mixer': {
    name: 'mood-mixer',
    displayName: 'Mood Mixer Laboratory',
    type: 'collection',
    pointsPerAction: 30,
    maxLevel: 10,
    achievements: [
      {
        type: 'first_recipe',
        title: 'Première Recette',
        description: 'Débloque ta première recette',
        emoji: '🧪',
        condition: (p) => p?.progress_data?.unlockedRecipes?.length >= 1,
        points: 50
      },
      {
        type: 'alchemist',
        title: 'Alchimiste des Émotions',
        description: 'Débloque 3 recettes',
        emoji: '🎨',
        condition: (p) => p?.progress_data?.unlockedRecipes?.length >= 3,
        points: 150
      },
      {
        type: 'master_mixer',
        title: 'Maître Mixeur',
        description: 'Débloque toutes les recettes',
        emoji: '🌈',
        condition: (p) => p?.progress_data?.unlockedRecipes?.length >= 6,
        points: 300
      }
    ]
  },

  'music-odyssey': {
    name: 'music-odyssey',
    displayName: 'Music Odyssey',
    type: 'journey',
    pointsPerAction: 20,
    maxLevel: 7,
    achievements: [
      {
        type: 'melody_seeker',
        title: 'Chercheur de Mélodies',
        description: 'Explore 3 royaumes',
        emoji: '🎵',
        condition: (p) => p?.progress_data?.exploredRealms?.length >= 3,
        points: 75
      },
      {
        type: 'music_master',
        title: 'Maître de la Musique',
        description: 'Explore tous les royaumes',
        emoji: '🎼',
        condition: (p) => p?.progress_data?.exploredRealms?.length >= 7,
        points: 200
      }
    ]
  },

  'collab-flame': {
    name: 'collab-flame',
    displayName: 'Collab Flame Hub',
    type: 'social',
    pointsPerAction: 15,
    maxLevel: 4,
    achievements: [
      {
        type: 'team_player',
        title: 'Joueur d\'Équipe',
        description: 'Complète ton premier défi en équipe',
        emoji: '🤝',
        condition: (p) => p?.progress_data?.completedChallenges?.length >= 1,
        points: 50
      },
      {
        type: 'flame_master',
        title: 'Maître de la Flamme',
        description: 'Complète tous les défis',
        emoji: '🔥',
        condition: (p) => p?.progress_data?.completedChallenges?.length >= 4,
        points: 200
      }
    ]
  },

  'screen-time': {
    name: 'screen-time',
    displayName: 'Screen Time Saver',
    type: 'challenge',
    pointsPerAction: 15,
    maxLevel: 7,
    achievements: [
      {
        type: 'eye_care',
        title: 'Protection Oculaire',
        description: 'Complète 5 pauses',
        emoji: '👁️',
        condition: (p) => p?.completed_count >= 5,
        points: 75
      },
      {
        type: 'eye_master',
        title: 'Maître du Repos Oculaire',
        description: 'Complète toutes les pauses',
        emoji: '✨',
        condition: (p) => p?.completed_count >= 7,
        points: 200
      }
    ]
  }
};

/**
 * Get module configuration
 */
export const getModuleConfig = (moduleName: string): ModuleConfig | null => {
  return moduleConfigs[moduleName] || null;
};

/**
 * Check and unlock pending achievements for a module
 */
export const checkAchievements = async (
  moduleName: string,
  progress: any,
  unlockFn: (type: string, data: any) => Promise<void>
) => {
  const config = getModuleConfig(moduleName);
  if (!config) return;

  for (const achievement of config.achievements) {
    if (achievement.condition(progress)) {
      await unlockFn(achievement.type, {
        title: achievement.title,
        description: achievement.description,
        emoji: achievement.emoji,
        points: achievement.points
      });
    }
  }
};
