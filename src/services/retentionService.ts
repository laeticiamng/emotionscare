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

export default retentionService;
