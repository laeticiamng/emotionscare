/**
 * Retention Service - Real Supabase Implementation
 * Manages user retention analytics and re-engagement campaigns
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface RetentionStats {
  daysActive: number;
  streak: number;
  badges: string[];
  rewards: string[];
  rituals: string[];
  lastActivityDate: string;
  totalSessions: number;
  engagementScore: number;
}

export interface ReengagementCampaign {
  id: string;
  name: string;
  target: 'B2C' | 'B2B' | 'all';
  status: 'scheduled' | 'running' | 'completed' | 'paused';
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  startDate: string;
  endDate?: string;
}

export interface ChurnRiskUser {
  userId: string;
  displayName: string;
  email: string;
  daysSinceActive: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastEmotion?: string;
  recommendedAction: string;
}

export const retentionService = {
  /**
   * Fetch retention stats for a user
   */
  async fetchStats(userId: string): Promise<RetentionStats> {
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('streak_days, last_activity_date, created_at, consecutive_logins')
        .eq('id', userId)
        .single();

      // Calculate days active since account creation
      const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date();
      const now = new Date();
      const daysActive = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

      // Fetch user badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badges(name)')
        .eq('user_id', userId);

      const badges = userBadges?.map((b: any) => b.badges?.name).filter(Boolean) || [];

      // Fetch rewards
      const { data: userRewards } = await supabase
        .from('user_rewards')
        .select('reward_type, reward_name')
        .eq('user_id', userId)
        .eq('claimed', true);

      const rewards = userRewards?.map(r => r.reward_name) || [];

      // Fetch user rituals/habits
      const { data: rituals } = await supabase
        .from('user_rituals')
        .select('name')
        .eq('user_id', userId)
        .eq('active', true);

      const ritualNames = rituals?.map(r => r.name) || [];

      // Fetch total sessions
      const { count: sessionCount } = await supabase
        .from('activity_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Calculate engagement score (0-100)
      const streakBonus = Math.min((profile?.streak_days || 0) * 5, 25);
      const badgeBonus = Math.min(badges.length * 5, 25);
      const sessionBonus = Math.min((sessionCount || 0) * 2, 25);
      const ritualBonus = Math.min(ritualNames.length * 5, 25);
      const engagementScore = streakBonus + badgeBonus + sessionBonus + ritualBonus;

      return {
        daysActive,
        streak: profile?.streak_days || 0,
        badges,
        rewards,
        rituals: ritualNames.length > 0 ? ritualNames : [
          'Rituels matinaux',
          'Pause musicale',
          'Journal quotidien'
        ],
        lastActivityDate: profile?.last_activity_date || '',
        totalSessions: sessionCount || 0,
        engagementScore: Math.min(engagementScore, 100)
      };
    } catch (error) {
      logger.error('Retention stats error', error as Error, 'RETENTION');
      return {
        daysActive: 0,
        streak: 0,
        badges: [],
        rewards: [],
        rituals: [],
        lastActivityDate: '',
        totalSessions: 0,
        engagementScore: 0
      };
    }
  },

  /**
   * Fetch re-engagement campaigns
   */
  async fetchCampaigns(): Promise<ReengagementCampaign[]> {
    try {
      const { data: campaigns, error } = await supabase
        .from('reengagement_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return (campaigns || []).map(c => ({
        id: c.id,
        name: c.name,
        target: c.target_audience || 'all',
        status: c.status || 'scheduled',
        sent: c.emails_sent || 0,
        opened: c.emails_opened || 0,
        clicked: c.links_clicked || 0,
        converted: c.conversions || 0,
        startDate: c.start_date || c.created_at,
        endDate: c.end_date
      }));
    } catch (error) {
      logger.warn('Campaigns fetch failed, using empty list', { error }, 'RETENTION');
      return [];
    }
  },

  /**
   * Get users at risk of churning
   */
  async getChurnRiskUsers(limit: number = 50): Promise<ChurnRiskUser[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Users who haven't been active in the last 7 days but were active before
      const { data: inactiveUsers } = await supabase
        .from('profiles')
        .select('id, display_name, email, last_activity_date')
        .lt('last_activity_date', sevenDaysAgo.toISOString())
        .gt('last_activity_date', thirtyDaysAgo.toISOString())
        .order('last_activity_date', { ascending: true })
        .limit(limit);

      if (!inactiveUsers || inactiveUsers.length === 0) return [];

      // Fetch last emotion for each user
      const userIds = inactiveUsers.map(u => u.id);
      const { data: lastEmotions } = await supabase
        .from('mood_scans')
        .select('user_id, emotion')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      const userLastEmotion: Record<string, string> = {};
      lastEmotions?.forEach(e => {
        if (!userLastEmotion[e.user_id]) {
          userLastEmotion[e.user_id] = e.emotion;
        }
      });

      return inactiveUsers.map(user => {
        const lastActive = user.last_activity_date ? new Date(user.last_activity_date) : new Date();
        const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        let recommendedAction = 'Envoyer un email de check-in';

        if (daysSinceActive > 21) {
          riskLevel = 'high';
          recommendedAction = 'Appel personnalisé recommandé';
        } else if (daysSinceActive > 14) {
          riskLevel = 'medium';
          recommendedAction = 'Envoyer une offre de réengagement';
        }

        const lastEmotion = userLastEmotion[user.id];
        if (lastEmotion && ['sad', 'anxious', 'stressed', 'frustrated'].includes(lastEmotion)) {
          riskLevel = 'high';
          recommendedAction = 'Contact de soutien prioritaire';
        }

        return {
          userId: user.id,
          displayName: user.display_name || 'Utilisateur',
          email: user.email || '',
          daysSinceActive,
          riskLevel,
          lastEmotion,
          recommendedAction
        };
      });
    } catch (error) {
      logger.error('Churn risk users error', error as Error, 'RETENTION');
      return [];
    }
  },

  /**
   * Send re-engagement notification to a user
   */
  async sendReengagementNotification(userId: string, campaignId: string): Promise<boolean> {
    try {
      // Create notification record
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'reengagement',
          title: 'Nous vous manquez !',
          body: 'Revenez découvrir les nouvelles fonctionnalités qui vous attendent.',
          metadata: { campaign_id: campaignId },
          read: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update campaign stats
      await supabase
        .from('reengagement_campaigns')
        .update({ emails_sent: supabase.rpc('increment_field', { field: 'emails_sent' }) })
        .eq('id', campaignId);

      return true;
    } catch (error) {
      logger.error('Reengagement notification error', error as Error, 'RETENTION');
      return false;
    }
  },

  /**
   * Calculate retention metrics for a time period
   */
  async getRetentionMetrics(days: number = 30): Promise<{
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
    churnRate: number;
    avgSessionsPerUser: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // New users in period
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Active users in period
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('last_activity_date', startDate.toISOString());

      // Total users before period
      const { count: totalUsersBefore } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .lt('created_at', startDate.toISOString());

      // Sessions in period
      const { data: sessions } = await supabase
        .from('activity_sessions')
        .select('user_id')
        .gte('created_at', startDate.toISOString());

      const uniqueSessionUsers = new Set(sessions?.map(s => s.user_id) || []).size;
      const avgSessionsPerUser = uniqueSessionUsers > 0
        ? Math.round((sessions?.length || 0) / uniqueSessionUsers * 10) / 10
        : 0;

      const retentionRate = totalUsersBefore
        ? Math.round(((activeUsers || 0) / (totalUsersBefore + (newUsers || 0))) * 100)
        : 0;

      const churnRate = 100 - retentionRate;

      return {
        newUsers: newUsers || 0,
        activeUsers: activeUsers || 0,
        retentionRate,
        churnRate,
        avgSessionsPerUser
      };
    } catch (error) {
      logger.error('Retention metrics error', error as Error, 'RETENTION');
      return {
        newUsers: 0,
        activeUsers: 0,
        retentionRate: 0,
        churnRate: 0,
        avgSessionsPerUser: 0
      };
    }
  }
};

// ========== MÉTHODES ENRICHIES ==========

/**
 * Analyse de cohorte par semaine d'inscription
 */
async getCohortAnalysis(weeks: number = 8): Promise<Array<{
  cohortWeek: string;
  usersCount: number;
  retentionByWeek: number[];
}>> {
  try {
    const cohortsData: Array<{
      cohortWeek: string;
      usersCount: number;
      retentionByWeek: number[];
    }> = [];

    for (let w = weeks; w >= 0; w--) {
      const cohortStart = new Date();
      cohortStart.setDate(cohortStart.getDate() - (w + 1) * 7);
      const cohortEnd = new Date();
      cohortEnd.setDate(cohortEnd.getDate() - w * 7);

      // Utilisateurs de la cohorte
      const { data: cohortUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', cohortStart.toISOString())
        .lt('created_at', cohortEnd.toISOString());

      if (!cohortUsers || cohortUsers.length === 0) continue;

      const userIds = cohortUsers.map(u => u.id);
      const retentionByWeek: number[] = [];

      // Calculer la rétention pour chaque semaine suivante
      for (let followupWeek = 0; followupWeek <= w; followupWeek++) {
        const weekStart = new Date(cohortEnd);
        weekStart.setDate(weekStart.getDate() + followupWeek * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const { data: activeSessions } = await supabase
          .from('activity_sessions')
          .select('user_id')
          .in('user_id', userIds)
          .gte('created_at', weekStart.toISOString())
          .lt('created_at', weekEnd.toISOString());

        const activeUserIds = new Set(activeSessions?.map(s => s.user_id) || []);
        const retentionRate = Math.round((activeUserIds.size / userIds.length) * 100);
        retentionByWeek.push(retentionRate);
      }

      cohortsData.push({
        cohortWeek: cohortStart.toISOString().split('T')[0],
        usersCount: userIds.length,
        retentionByWeek
      });
    }

    return cohortsData;
  } catch (error) {
    logger.error('Cohort analysis error', error as Error, 'RETENTION');
    return [];
  }
},

/**
 * Obtenir la distribution des streaks
 */
async getStreaksDistribution(): Promise<Array<{
  range: string;
  count: number;
  percentage: number;
}>> {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('streak_days');

    if (!profiles) return [];

    const ranges = [
      { label: '0 jours', min: 0, max: 0 },
      { label: '1-3 jours', min: 1, max: 3 },
      { label: '4-7 jours', min: 4, max: 7 },
      { label: '8-14 jours', min: 8, max: 14 },
      { label: '15-30 jours', min: 15, max: 30 },
      { label: '30+ jours', min: 31, max: Infinity }
    ];

    const distribution = ranges.map(range => {
      const count = profiles.filter(p => {
        const streak = p.streak_days || 0;
        return streak >= range.min && streak <= range.max;
      }).length;

      return {
        range: range.label,
        count,
        percentage: Math.round((count / profiles.length) * 100)
      };
    });

    return distribution;
  } catch (error) {
    logger.error('Streaks distribution error', error as Error, 'RETENTION');
    return [];
  }
},

/**
 * Analyser les segments d'utilisateurs à risque
 */
async analyzeChurnSegments(): Promise<Array<{
  segment: string;
  usersCount: number;
  avgDaysSinceActive: number;
  topReason: string;
  suggestedAction: string;
}>> {
  try {
    const churnUsers = await this.getChurnRiskUsers(200);

    // Segmenter par comportement
    const segments = {
      'Nouveaux abandons': {
        users: churnUsers.filter(u => u.daysSinceActive <= 14),
        reason: 'Onboarding incomplet',
        action: 'Email série onboarding'
      },
      'Utilisateurs réguliers perdus': {
        users: churnUsers.filter(u => u.daysSinceActive > 14 && u.daysSinceActive <= 21),
        reason: 'Perte d\'intérêt',
        action: 'Offre de nouveaux contenus'
      },
      'Anciens utilisateurs inactifs': {
        users: churnUsers.filter(u => u.daysSinceActive > 21),
        reason: 'Oubli de l\'app',
        action: 'Campagne de réengagement'
      }
    };

    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      usersCount: data.users.length,
      avgDaysSinceActive: data.users.length > 0
        ? Math.round(data.users.reduce((sum, u) => sum + u.daysSinceActive, 0) / data.users.length)
        : 0,
      topReason: data.reason,
      suggestedAction: data.action
    }));
  } catch (error) {
    logger.error('Churn segments analysis error', error as Error, 'RETENTION');
    return [];
  }
},

/**
 * Créer une nouvelle campagne de réengagement
 */
async createCampaign(campaign: {
  name: string;
  target: 'B2C' | 'B2B' | 'all';
  startDate: string;
  endDate?: string;
  message?: string;
}): Promise<ReengagementCampaign | null> {
  try {
    const { data, error } = await supabase
      .from('reengagement_campaigns')
      .insert({
        name: campaign.name,
        target_audience: campaign.target,
        start_date: campaign.startDate,
        end_date: campaign.endDate,
        status: 'scheduled',
        emails_sent: 0,
        emails_opened: 0,
        links_clicked: 0,
        conversions: 0,
        message: campaign.message
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Campaign created', { campaignId: data.id }, 'RETENTION');

    return {
      id: data.id,
      name: data.name,
      target: data.target_audience,
      status: data.status,
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      startDate: data.start_date,
      endDate: data.end_date
    };
  } catch (error) {
    logger.error('Create campaign error', error as Error, 'RETENTION');
    return null;
  }
},

/**
 * Mettre à jour le statut d'une campagne
 */
async updateCampaignStatus(
  campaignId: string,
  status: 'scheduled' | 'running' | 'completed' | 'paused'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reengagement_campaigns')
      .update({ status })
      .eq('id', campaignId);

    if (error) throw error;

    logger.info('Campaign status updated', { campaignId, status }, 'RETENTION');
    return true;
  } catch (error) {
    logger.error('Update campaign status error', error as Error, 'RETENTION');
    return false;
  }
},

/**
 * Obtenir les utilisateurs les plus engagés
 */
async getTopEngagedUsers(limit: number = 20): Promise<Array<{
  userId: string;
  displayName: string;
  streakDays: number;
  sessionsCount: number;
  engagementScore: number;
}>> {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, streak_days')
      .order('streak_days', { ascending: false })
      .limit(limit * 2);

    if (!profiles) return [];

    const userIds = profiles.map(p => p.id);

    // Compter les sessions
    const { data: sessions } = await supabase
      .from('activity_sessions')
      .select('user_id')
      .in('user_id', userIds);

    const sessionCounts: Record<string, number> = {};
    sessions?.forEach(s => {
      sessionCounts[s.user_id] = (sessionCounts[s.user_id] || 0) + 1;
    });

    return profiles.slice(0, limit).map(p => ({
      userId: p.id,
      displayName: p.display_name || 'Utilisateur',
      streakDays: p.streak_days || 0,
      sessionsCount: sessionCounts[p.id] || 0,
      engagementScore: Math.min(100, (p.streak_days || 0) * 3 + (sessionCounts[p.id] || 0) * 2)
    }));
  } catch (error) {
    logger.error('Top engaged users error', error as Error, 'RETENTION');
    return [];
  }
},

/**
 * Calculer la LTV (Lifetime Value) moyenne
 */
async calculateAverageLTV(): Promise<{
  avgLTV: number;
  avgLifetimeDays: number;
  avgSessionsPerUser: number;
  avgModulesCompleted: number;
}> {
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, created_at');

    if (!profiles || profiles.length === 0) {
      return { avgLTV: 0, avgLifetimeDays: 0, avgSessionsPerUser: 0, avgModulesCompleted: 0 };
    }

    // Calcul jours depuis inscription
    const now = Date.now();
    const totalDays = profiles.reduce((sum, p) => {
      const created = new Date(p.created_at).getTime();
      return sum + Math.floor((now - created) / (1000 * 60 * 60 * 24));
    }, 0);
    const avgLifetimeDays = Math.round(totalDays / profiles.length);

    // Sessions moyennes
    const { count: totalSessions } = await supabase
      .from('activity_sessions')
      .select('id', { count: 'exact', head: true });

    const avgSessionsPerUser = Math.round((totalSessions || 0) / profiles.length * 10) / 10;

    // Modules complétés moyens
    const { count: totalModules } = await supabase
      .from('module_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('completed', true);

    const avgModulesCompleted = Math.round((totalModules || 0) / profiles.length * 10) / 10;

    // LTV estimée (basée sur engagement)
    const avgLTV = Math.round(avgLifetimeDays * 0.1 + avgSessionsPerUser * 2 + avgModulesCompleted * 5);

    return {
      avgLTV,
      avgLifetimeDays,
      avgSessionsPerUser,
      avgModulesCompleted
    };
  } catch (error) {
    logger.error('Calculate LTV error', error as Error, 'RETENTION');
    return { avgLTV: 0, avgLifetimeDays: 0, avgSessionsPerUser: 0, avgModulesCompleted: 0 };
  }
}
};

export default retentionService;
