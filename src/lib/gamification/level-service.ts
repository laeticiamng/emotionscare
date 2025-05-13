
import { GamificationLevel, GamificationStats } from '@/types/gamification';

// Définition des niveaux de gamification
const gamificationLevels: GamificationLevel[] = [
  {
    id: 1,
    name: "Novice",
    minPoints: 0,
    maxPoints: 500,
    benefits: [
      "Accès aux fonctionnalités de base",
      "3 scans émotionnels par jour"
    ]
  },
  {
    id: 2,
    name: "Apprenti",
    minPoints: 501,
    maxPoints: 1500,
    badge: "apprentice",
    benefits: [
      "Déblocage de 2 playlists thérapeutiques",
      "5 scans émotionnels par jour",
      "Accès aux défis hebdomadaires"
    ]
  },
  {
    id: 3,
    name: "Adepte",
    minPoints: 1501,
    maxPoints: 3000,
    badge: "adept",
    benefits: [
      "Déblocage des séances guidées",
      "Analyse émotionnelle avancée",
      "Personnalisation de l'interface"
    ]
  },
  {
    id: 4,
    name: "Expert",
    minPoints: 3001,
    maxPoints: 6000,
    badge: "expert",
    benefits: [
      "Scans émotionnels illimités",
      "Création de playlists personnalisées",
      "Accès à la communauté exclusive"
    ]
  },
  {
    id: 5,
    name: "Maître",
    minPoints: 6001,
    maxPoints: 10000,
    badge: "master",
    benefits: [
      "Toutes les fonctionnalités premium",
      "Sessions coaching IA avancées",
      "Rapports émotionnels détaillés"
    ]
  },
  {
    id: 6,
    name: "Grand Maître",
    minPoints: 10001,
    maxPoints: Infinity,
    badge: "grandmaster",
    benefits: [
      "Fonctionnalités expérimentales",
      "Contenu en avant-première",
      "Badge exclusif"
    ]
  }
];

/**
 * Récupère le niveau actuel de l'utilisateur en fonction de ses points
 * @param points Nombre de points de l'utilisateur
 */
export const getCurrentLevel = (points: number): GamificationLevel => {
  return gamificationLevels.find(
    level => points >= level.minPoints && points <= level.maxPoints
  ) || gamificationLevels[0];
};

/**
 * Calcule les informations sur le niveau suivant
 * @param points Nombre de points de l'utilisateur
 */
export const getNextLevelInfo = (
  points: number
): { nextLevel: GamificationLevel; pointsNeeded: number; progress: number } => {
  const currentLevel = getCurrentLevel(points);
  const currentLevelIndex = gamificationLevels.findIndex(level => level.id === currentLevel.id);
  
  // Si l'utilisateur est au niveau maximum
  if (currentLevelIndex === gamificationLevels.length - 1) {
    return {
      nextLevel: currentLevel,
      pointsNeeded: 0,
      progress: 100
    };
  }
  
  const nextLevel = gamificationLevels[currentLevelIndex + 1];
  const pointsNeeded = nextLevel.minPoints - points;
  const totalPointsInLevel = currentLevel.maxPoints - currentLevel.minPoints;
  const pointsInCurrentLevel = points - currentLevel.minPoints;
  const progress = (pointsInCurrentLevel / totalPointsInLevel) * 100;
  
  return {
    nextLevel,
    pointsNeeded,
    progress: Math.min(Math.round(progress), 99) // Cap to 99% until new level
  };
};

/**
 * Récupère tous les niveaux de gamification
 */
export const getAllLevels = (): GamificationLevel[] => {
  return gamificationLevels;
};

/**
 * Calcule les statistiques complètes de gamification pour un utilisateur
 * @param userId ID de l'utilisateur
 * @param points Points totaux
 * @param badgesCount Nombre de badges débloqués
 * @param completedChallenges Nombre de défis complétés
 * @param activeChallenges Nombre de défis actifs
 */
export const calculateGamificationStats = (
  userId: string,
  points: number = 0,
  badgesCount: number = 0,
  completedChallenges: number = 0,
  activeChallenges: number = 0
): GamificationStats => {
  const currentLevel = getCurrentLevel(points);
  const { pointsNeeded, progress } = getNextLevelInfo(points);
  
  // Simuler le calcul des jours consécutifs d'activité
  const streakDays = Math.floor(Math.random() * 30) + 1; // Entre 1 et 30 jours
  
  return {
    totalPoints: points,
    currentLevel: currentLevel.id,
    badgesCount,
    completedChallenges,
    activeChallenges,
    pointsToNextLevel: pointsNeeded,
    progressToNextLevel: progress,
    streakDays,
    lastActivityDate: new Date().toISOString()
  };
};

export default {
  getCurrentLevel,
  getNextLevelInfo,
  getAllLevels,
  calculateGamificationStats
};
