/**
 * Service Gamification Unifié - EmotionsCare
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { 
  Reward, 
  DailyChallenge, 
  GamificationProgress, 
  Achievement,
  LeaderboardUser 
} from './types';

const STORAGE_PREFIX = 'ec_gamification_';

class GamificationService {
  // ============================================================================
  // REWARDS
  // ============================================================================
  
  async getRewards(): Promise<Reward[]> {
    // Pour l'instant, données locales - à connecter à Supabase plus tard
    const rewards: Reward[] = [
      {
        id: 'theme-dark-galaxy',
        name: 'Thème Galaxie Sombre',
        description: 'Un thème cosmique pour votre interface',
        icon: '🌌',
        cost: 500,
        category: 'theme',
        rarity: 'rare',
        available: true,
      },
      {
        id: 'avatar-zen-master',
        name: 'Avatar Maître Zen',
        description: 'Un avatar exclusif de méditation',
        icon: '🧘',
        cost: 1000,
        category: 'avatar',
        rarity: 'epic',
        available: true,
      },
      {
        id: 'boost-xp-double',
        name: 'XP Double (24h)',
        description: 'Doublez vos gains XP pendant 24 heures',
        icon: '⚡',
        cost: 250,
        category: 'boost',
        rarity: 'common',
        available: true,
        stock: 10,
      },
      {
        id: 'content-meditation-premium',
        name: 'Méditation Premium',
        description: 'Accès à 5 méditations exclusives',
        icon: '🎧',
        cost: 750,
        category: 'content',
        rarity: 'rare',
        available: true,
      },
      {
        id: 'feature-custom-sounds',
        name: 'Sons Personnalisés',
        description: 'Créez vos propres ambiances sonores',
        icon: '🎵',
        cost: 2000,
        category: 'feature',
        rarity: 'legendary',
        available: true,
      },
    ];
    
    return rewards;
  }

  async claimReward(rewardId: string, userId: string): Promise<boolean> {
    try {
      const progress = await this.getProgress(userId);
      const rewards = await this.getRewards();
      const reward = rewards.find(r => r.id === rewardId);
      
      if (!reward) {
        throw new Error('Récompense non trouvée');
      }
      
      if (progress.totalPoints < reward.cost) {
        throw new Error('Points insuffisants');
      }
      
      // Stocker la réclamation localement
      const claimed = this.getClaimedRewards(userId);
      claimed.push({ rewardId, claimedAt: new Date().toISOString() });
      localStorage.setItem(`${STORAGE_PREFIX}claimed_${userId}`, JSON.stringify(claimed));
      
      // Déduire les points
      await this.deductPoints(userId, reward.cost);
      
      logger.info('Reward claimed', { rewardId, userId }, 'GAMIFICATION');
      return true;
    } catch (error) {
      logger.error('Failed to claim reward', error as Error, 'GAMIFICATION');
      return false;
    }
  }

  getClaimedRewards(userId: string): Array<{ rewardId: string; claimedAt: string }> {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}claimed_${userId}`);
    return stored ? JSON.parse(stored) : [];
  }

  // ============================================================================
  // DAILY CHALLENGES
  // ============================================================================
  
  getDailyChallenges(userId: string): DailyChallenge[] {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem(`${STORAGE_PREFIX}challenges_date_${userId}`);
    
    // Générer de nouveaux défis si c'est un nouveau jour
    if (storedDate !== today) {
      const challenges = this.generateDailyChallenges();
      localStorage.setItem(`${STORAGE_PREFIX}challenges_${userId}`, JSON.stringify(challenges));
      localStorage.setItem(`${STORAGE_PREFIX}challenges_date_${userId}`, today);
      return challenges;
    }
    
    const stored = localStorage.getItem(`${STORAGE_PREFIX}challenges_${userId}`);
    return stored ? JSON.parse(stored) : this.generateDailyChallenges();
  }

  private generateDailyChallenges(): DailyChallenge[] {
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    
    return [
      {
        id: 'daily-scan',
        title: 'Scanner d\'émotions',
        description: 'Effectuez 2 scans émotionnels aujourd\'hui',
        icon: '📷',
        xpReward: 50,
        pointsReward: 25,
        progress: 0,
        target: 2,
        completed: false,
        expiresAt: tomorrow.toISOString(),
        category: 'scan',
      },
      {
        id: 'daily-journal',
        title: 'Écriture quotidienne',
        description: 'Écrivez une entrée dans votre journal',
        icon: '📝',
        xpReward: 30,
        pointsReward: 15,
        progress: 0,
        target: 1,
        completed: false,
        expiresAt: tomorrow.toISOString(),
        category: 'journal',
      },
      {
        id: 'daily-meditation',
        title: 'Moment de calme',
        description: 'Complétez 5 minutes de méditation',
        icon: '🧘',
        xpReward: 40,
        pointsReward: 20,
        progress: 0,
        target: 5,
        completed: false,
        expiresAt: tomorrow.toISOString(),
        category: 'meditation',
      },
    ];
  }

  updateChallengeProgress(userId: string, challengeId: string, increment: number = 1): DailyChallenge | null {
    const challenges = this.getDailyChallenges(userId);
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    
    if (challengeIndex === -1) return null;
    
    const challenge = challenges[challengeIndex];
    if (challenge.completed) return challenge;
    
    challenge.progress = Math.min(challenge.progress + increment, challenge.target);
    
    if (challenge.progress >= challenge.target) {
      challenge.completed = true;
      // Ajouter les récompenses
      this.addXp(userId, challenge.xpReward);
      this.addPoints(userId, challenge.pointsReward);
    }
    
    challenges[challengeIndex] = challenge;
    localStorage.setItem(`${STORAGE_PREFIX}challenges_${userId}`, JSON.stringify(challenges));
    
    return challenge;
  }

  // ============================================================================
  // PROGRESS & POINTS
  // ============================================================================
  
  async getProgress(userId: string): Promise<GamificationProgress> {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}progress_${userId}`);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Valeurs par défaut
    const defaultProgress: GamificationProgress = {
      userId,
      level: 1,
      currentXp: 0,
      nextLevelXp: 100,
      totalPoints: 0,
      streak: 0,
      longestStreak: 0,
      achievementsUnlocked: 0,
      totalAchievements: 20,
      badgesEarned: 0,
      totalBadges: 15,
      challengesCompleted: 0,
      rewardsClaimed: 0,
    };
    
    this.saveProgress(userId, defaultProgress);
    return defaultProgress;
  }

  saveProgress(userId: string, progress: GamificationProgress): void {
    localStorage.setItem(`${STORAGE_PREFIX}progress_${userId}`, JSON.stringify(progress));
  }

  async addXp(userId: string, amount: number): Promise<GamificationProgress> {
    const progress = await this.getProgress(userId);
    progress.currentXp += amount;
    
    // Level up
    while (progress.currentXp >= progress.nextLevelXp) {
      progress.currentXp -= progress.nextLevelXp;
      progress.level += 1;
      progress.nextLevelXp = Math.floor(progress.nextLevelXp * 1.2);
    }
    
    this.saveProgress(userId, progress);
    return progress;
  }

  async addPoints(userId: string, amount: number): Promise<number> {
    const progress = await this.getProgress(userId);
    progress.totalPoints += amount;
    this.saveProgress(userId, progress);
    return progress.totalPoints;
  }

  async deductPoints(userId: string, amount: number): Promise<number> {
    const progress = await this.getProgress(userId);
    progress.totalPoints = Math.max(0, progress.totalPoints - amount);
    this.saveProgress(userId, progress);
    return progress.totalPoints;
  }

  // ============================================================================
  // ACHIEVEMENTS
  // ============================================================================
  
  getAchievements(): Achievement[] {
    return [
      {
        id: 'first-scan',
        name: 'Première Lueur',
        description: 'Effectuez votre premier scan émotionnel',
        icon: '✨',
        category: 'scan',
        rarity: 'common',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        xpReward: 50,
      },
      {
        id: 'streak-7',
        name: 'Gardien de la Flamme',
        description: 'Maintenez une série de 7 jours',
        icon: '🔥',
        category: 'streak',
        rarity: 'rare',
        progress: 0,
        maxProgress: 7,
        unlocked: false,
        xpReward: 200,
      },
      {
        id: 'meditation-50',
        name: 'Maître Zen',
        description: 'Complétez 50 séances de méditation',
        icon: '🧘',
        category: 'meditation',
        rarity: 'epic',
        progress: 0,
        maxProgress: 50,
        unlocked: false,
        xpReward: 500,
      },
      {
        id: 'level-25',
        name: 'Légende Émotionnelle',
        description: 'Atteignez le niveau 25',
        icon: '👑',
        category: 'level',
        rarity: 'legendary',
        progress: 0,
        maxProgress: 25,
        unlocked: false,
        xpReward: 1000,
      },
      {
        id: 'journal-30',
        name: 'Chroniqueur',
        description: 'Écrivez 30 entrées de journal',
        icon: '📖',
        category: 'journal',
        rarity: 'rare',
        progress: 0,
        maxProgress: 30,
        unlocked: false,
        xpReward: 300,
      },
    ];
  }

  getUserAchievements(userId: string): Achievement[] {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}achievements_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const achievements = this.getAchievements();
    localStorage.setItem(`${STORAGE_PREFIX}achievements_${userId}`, JSON.stringify(achievements));
    return achievements;
  }

  updateAchievementProgress(userId: string, achievementId: string, progress: number): Achievement | null {
    const achievements = this.getUserAchievements(userId);
    const index = achievements.findIndex(a => a.id === achievementId);
    
    if (index === -1) return null;
    
    const achievement = achievements[index];
    if (achievement.unlocked) return achievement;
    
    achievement.progress = Math.min(progress, achievement.maxProgress);
    
    if (achievement.progress >= achievement.maxProgress) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      this.addXp(userId, achievement.xpReward);
    }
    
    achievements[index] = achievement;
    localStorage.setItem(`${STORAGE_PREFIX}achievements_${userId}`, JSON.stringify(achievements));
    
    return achievement;
  }

  // ============================================================================
  // STREAK
  // ============================================================================
  
  async updateStreak(userId: string): Promise<number> {
    const progress = await this.getProgress(userId);
    const lastActivity = localStorage.getItem(`${STORAGE_PREFIX}last_activity_${userId}`);
    const today = new Date().toISOString().split('T')[0];
    
    if (lastActivity === today) {
      return progress.streak;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActivity === yesterdayStr) {
      progress.streak += 1;
    } else if (lastActivity !== today) {
      progress.streak = 1;
    }
    
    progress.longestStreak = Math.max(progress.longestStreak, progress.streak);
    
    localStorage.setItem(`${STORAGE_PREFIX}last_activity_${userId}`, today);
    this.saveProgress(userId, progress);
    
    return progress.streak;
  }
}

export const gamificationService = new GamificationService();
export default gamificationService;
