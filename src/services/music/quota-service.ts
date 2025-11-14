/**
 * Quota Service - Gestion des quotas de génération musicale
 *
 * Features:
 * - Vérification quotas par tier (Free/Premium)
 * - Reset automatique mensuel
 * - Throttling utilisateur
 * - Métriques temps réel
 *
 * @module services/music/quota-service
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface UserQuota {
  userId: string;
  tier: UserTier;
  generationsUsed: number;
  generationsLimit: number;
  resetDate: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuotaStatus {
  canGenerate: boolean;
  remaining: number;
  limit: number;
  percentage: number;
  resetDate: string;
  tier: UserTier;
  reason?: string;
}

export interface QuotaLimits {
  generations: number;
  durationMax: number; // secondes
  concurrentGenerations: number;
}

// ============================================
// CONFIGURATION QUOTAS
// ============================================

const QUOTA_LIMITS: Record<UserTier, QuotaLimits> = {
  [UserTier.FREE]: {
    generations: 10,
    durationMax: 180, // 3 minutes max
    concurrentGenerations: 1
  },
  [UserTier.PREMIUM]: {
    generations: 100,
    durationMax: 600, // 10 minutes max
    concurrentGenerations: 3
  },
  [UserTier.ENTERPRISE]: {
    generations: 1000,
    durationMax: 600,
    concurrentGenerations: 10
  }
};

const RESET_PERIOD_DAYS = 30;

// ============================================
// QUOTA SERVICE
// ============================================

class QuotaService {
  /**
   * Récupère ou crée le quota utilisateur
   */
  async getUserQuota(userId: string): Promise<UserQuota | null> {
    try {
      // Vérifier si le quota existe
      const { data: existing, error: fetchError } = await supabase
        .from('user_music_quotas')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existing) {
        // Vérifier si reset nécessaire
        const resetDate = new Date(existing.reset_date);
        if (resetDate < new Date()) {
          return this.resetQuota(userId);
        }

        return this.mapToUserQuota(existing);
      }

      // Créer nouveau quota
      return this.createQuota(userId);
    } catch (error) {
      logger.error('Failed to get user quota', error as Error, 'MUSIC');
      return null;
    }
  }

  /**
   * Crée un nouveau quota pour un utilisateur
   */
  private async createQuota(userId: string): Promise<UserQuota> {
    const tier = await this.getUserTier(userId);
    const limits = QUOTA_LIMITS[tier];

    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + RESET_PERIOD_DAYS);

    const { data, error } = await supabase
      .from('user_music_quotas')
      .insert({
        user_id: userId,
        generations_used: 0,
        generations_limit: limits.generations,
        reset_date: resetDate.toISOString(),
        is_premium: tier !== UserTier.FREE
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Created new user quota', { userId, tier, limit: limits.generations }, 'MUSIC');

    return this.mapToUserQuota(data);
  }

  /**
   * Reset le quota d'un utilisateur
   */
  private async resetQuota(userId: string): Promise<UserQuota> {
    const tier = await this.getUserTier(userId);
    const limits = QUOTA_LIMITS[tier];

    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + RESET_PERIOD_DAYS);

    const { data, error } = await supabase
      .from('user_music_quotas')
      .update({
        generations_used: 0,
        generations_limit: limits.generations,
        reset_date: resetDate.toISOString(),
        is_premium: tier !== UserTier.FREE,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    logger.info('Reset user quota', { userId, tier, newLimit: limits.generations }, 'MUSIC');

    return this.mapToUserQuota(data);
  }

  /**
   * Vérifie si l'utilisateur peut générer de la musique
   */
  async checkQuota(userId: string): Promise<QuotaStatus> {
    try {
      const quota = await this.getUserQuota(userId);

      if (!quota) {
        return {
          canGenerate: false,
          remaining: 0,
          limit: 0,
          percentage: 100,
          resetDate: new Date().toISOString(),
          tier: UserTier.FREE,
          reason: 'Unable to fetch quota'
        };
      }

      const remaining = quota.generationsLimit - quota.generationsUsed;
      const canGenerate = remaining > 0;
      const percentage = Math.round((quota.generationsUsed / quota.generationsLimit) * 100);

      return {
        canGenerate,
        remaining,
        limit: quota.generationsLimit,
        percentage,
        resetDate: quota.resetDate,
        tier: quota.tier,
        reason: canGenerate ? undefined : 'Quota limit reached'
      };
    } catch (error) {
      logger.error('Failed to check quota', error as Error, 'MUSIC');

      return {
        canGenerate: false,
        remaining: 0,
        limit: 0,
        percentage: 100,
        resetDate: new Date().toISOString(),
        tier: UserTier.FREE,
        reason: 'Error checking quota'
      };
    }
  }

  /**
   * Incrémente l'utilisation du quota
   */
  async incrementUsage(userId: string, amount = 1): Promise<boolean> {
    try {
      const quota = await this.getUserQuota(userId);

      if (!quota) {
        throw new Error('Quota not found');
      }

      const newUsed = quota.generationsUsed + amount;

      if (newUsed > quota.generationsLimit) {
        logger.warn('Quota limit exceeded', { userId, used: newUsed, limit: quota.generationsLimit }, 'MUSIC');
        return false;
      }

      const { error } = await supabase
        .from('user_music_quotas')
        .update({
          generations_used: newUsed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      logger.info('Incremented quota usage', { userId, newUsed, limit: quota.generationsLimit }, 'MUSIC');

      return true;
    } catch (error) {
      logger.error('Failed to increment quota', error as Error, 'MUSIC');
      return false;
    }
  }

  /**
   * Décrémente l'utilisation (en cas d'échec de génération)
   */
  async decrementUsage(userId: string, amount = 1): Promise<boolean> {
    try {
      const quota = await this.getUserQuota(userId);

      if (!quota) {
        throw new Error('Quota not found');
      }

      const newUsed = Math.max(0, quota.generationsUsed - amount);

      const { error } = await supabase
        .from('user_music_quotas')
        .update({
          generations_used: newUsed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      logger.info('Decremented quota usage', { userId, newUsed }, 'MUSIC');

      return true;
    } catch (error) {
      logger.error('Failed to decrement quota', error as Error, 'MUSIC');
      return false;
    }
  }

  /**
   * Récupère le tier de l'utilisateur
   */
  private async getUserTier(userId: string): Promise<UserTier> {
    try {
      // Vérifier dans la table profiles ou user_subscriptions
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return UserTier.FREE;
      }

      // Mapper le tier
      const tier = data.subscription_tier?.toUpperCase();

      if (tier === 'PREMIUM' || tier === 'PRO') {
        return UserTier.PREMIUM;
      }

      if (tier === 'ENTERPRISE') {
        return UserTier.ENTERPRISE;
      }

      return UserTier.FREE;
    } catch (error) {
      logger.error('Failed to get user tier', error as Error, 'MUSIC');
      return UserTier.FREE;
    }
  }

  /**
   * Vérifie si l'utilisateur peut créer une génération avec la durée demandée
   */
  async canGenerateWithDuration(userId: string, durationSeconds: number): Promise<{
    canGenerate: boolean;
    reason?: string;
  }> {
    try {
      // Vérifier le quota de base
      const quotaStatus = await this.checkQuota(userId);

      if (!quotaStatus.canGenerate) {
        return {
          canGenerate: false,
          reason: quotaStatus.reason
        };
      }

      // Vérifier la durée maximale autorisée
      const tier = quotaStatus.tier;
      const limits = QUOTA_LIMITS[tier];

      if (durationSeconds > limits.durationMax) {
        return {
          canGenerate: false,
          reason: `Duration exceeds ${limits.durationMax}s limit for ${tier} tier`
        };
      }

      return {
        canGenerate: true
      };
    } catch (error) {
      logger.error('Failed to check duration quota', error as Error, 'MUSIC');
      return {
        canGenerate: false,
        reason: 'Error checking quota'
      };
    }
  }

  /**
   * Vérifie le nombre de générations concurrentes
   */
  async checkConcurrentGenerations(userId: string): Promise<{
    canGenerate: boolean;
    current: number;
    limit: number;
    reason?: string;
  }> {
    try {
      const tier = await this.getUserTier(userId);
      const limits = QUOTA_LIMITS[tier];

      // Compter les générations en cours
      const { count, error } = await supabase
        .from('music_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['pending', 'processing']);

      if (error) throw error;

      const current = count || 0;
      const canGenerate = current < limits.concurrentGenerations;

      return {
        canGenerate,
        current,
        limit: limits.concurrentGenerations,
        reason: canGenerate ? undefined : 'Concurrent generation limit reached'
      };
    } catch (error) {
      logger.error('Failed to check concurrent generations', error as Error, 'MUSIC');
      return {
        canGenerate: false,
        current: 0,
        limit: 0,
        reason: 'Error checking concurrent generations'
      };
    }
  }

  /**
   * Récupère les limites pour un tier
   */
  getLimitsForTier(tier: UserTier): QuotaLimits {
    return QUOTA_LIMITS[tier];
  }

  /**
   * Upgrade le tier d'un utilisateur (après achat premium)
   */
  async upgradeTier(userId: string, newTier: UserTier): Promise<boolean> {
    try {
      const limits = QUOTA_LIMITS[newTier];

      const { error } = await supabase
        .from('user_music_quotas')
        .update({
          generations_limit: limits.generations,
          is_premium: newTier !== UserTier.FREE,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      logger.info('Upgraded user tier', { userId, newTier, newLimit: limits.generations }, 'MUSIC');

      return true;
    } catch (error) {
      logger.error('Failed to upgrade tier', error as Error, 'MUSIC');
      return false;
    }
  }

  /**
   * Mapper DB → UserQuota
   */
  private mapToUserQuota(data: any): UserQuota {
    return {
      userId: data.user_id,
      tier: data.is_premium ? UserTier.PREMIUM : UserTier.FREE,
      generationsUsed: data.generations_used,
      generationsLimit: data.generations_limit,
      resetDate: data.reset_date,
      isPremium: data.is_premium,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  /**
   * Récupère les statistiques d'utilisation
   */
  async getUsageStats(userId: string): Promise<{
    quota: UserQuota | null;
    status: QuotaStatus;
    concurrent: {
      current: number;
      limit: number;
    };
  }> {
    const quota = await this.getUserQuota(userId);
    const status = await this.checkQuota(userId);
    const concurrent = await this.checkConcurrentGenerations(userId);

    return {
      quota,
      status,
      concurrent: {
        current: concurrent.current,
        limit: concurrent.limit
      }
    };
  }
}

export const quotaService = new QuotaService();
