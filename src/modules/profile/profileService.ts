// @ts-nocheck
/**
 * Profile Service
 * Service Supabase centralisé pour la gestion du profil utilisateur
 */

import { supabase } from '@/integrations/supabase/client';
import {
  UserProfile,
  ProfileStats,
  ProfilePreferences,
  DEFAULT_PREFERENCES,
  DEFAULT_STATS,
  Achievement,
  UserBadge,
  ActiveSession,
  SecurityInfo,
  ActivityHistoryItem,
  ProfileExportData,
  UpdateProfileInput,
  UpdatePreferencesInput,
  calculateLevel,
} from './types';
import { differenceInDays, subDays, format } from 'date-fns';
import { logger } from '@/lib/logger';

class ProfileService {
  // ─────────────────────────────────────────────────────────────
  // PROFILE CRUD
  // ─────────────────────────────────────────────────────────────

  async getProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error fetching profile:', error as Error, 'PROFILE');
      throw error;
    }

    if (!data) {
      // Create default profile
      return this.createDefaultProfile(user.id, user.email);
    }

    return this.mapProfile(data);
  }

  private async createDefaultProfile(userId: string, email?: string): Promise<UserProfile> {
    const defaultProfile = {
      id: userId,
      email: email || null,
      name: null,
      role: 'b2c',
      preferences: DEFAULT_PREFERENCES,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(defaultProfile)
      .select()
      .single();

    if (error) {
      logger.error('Error creating profile:', error as Error, 'PROFILE');
      throw error;
    }

    return this.mapProfile(data);
  }

  async updateProfile(updates: UpdateProfileInput): Promise<UserProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating profile:', error as Error, 'PROFILE');
      throw error;
    }

    return this.mapProfile(data);
  }

  async updatePreferences(preferences: UpdatePreferencesInput): Promise<ProfilePreferences> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current preferences
    const { data: current } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    const currentPrefs = (current?.preferences as ProfilePreferences) || DEFAULT_PREFERENCES;
    const newPreferences = { ...currentPrefs, ...preferences };

    const { data, error } = await supabase
      .from('profiles')
      .update({
        preferences: newPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('preferences')
      .single();

    if (error) {
      logger.error('Error updating preferences:', error as Error, 'PROFILE');
      throw error;
    }

    return data.preferences as ProfilePreferences;
  }

  // ─────────────────────────────────────────────────────────────
  // AVATAR MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      logger.error('Error uploading avatar:', uploadError as Error, 'PROFILE');
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile
    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    return publicUrl;
  }

  async removeAvatar(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase
      .from('profiles')
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq('id', user.id);
  }

  // ─────────────────────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────────────────────

  async getStats(): Promise<ProfileStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_STATS;

    try {
      // Parallel queries for stats - using correct table names
      const [
        scansResult,
        journalResult,
        breathResult,
        badgesResult,
        streakResult,
        profileResult,
      ] = await Promise.all([
        supabase.from('emotional_scans').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('breathing_vr_sessions').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_achievements').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_wellness_streak').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('profiles').select('created_at, emotional_score').eq('id', user.id).single(),
      ]);

      const totalScans = scansResult.count || 0;
      const totalJournalEntries = journalResult.count || 0;
      const totalBreathingSessions = breathResult.count || 0;
      const totalBadges = badgesResult.count || 0;
      
      const currentStreak = streakResult.data?.current_streak || 0;
      const longestStreak = streakResult.data?.longest_streak || currentStreak;

      // Calculate XP and level
      const totalXp = (totalScans * 10) + (totalJournalEntries * 15) + (totalBreathingSessions * 20) + (totalBadges * 50);
      const { level, currentXp, xpToNext } = calculateLevel(totalXp);

      const memberSinceDays = profileResult.data?.created_at 
        ? differenceInDays(new Date(), new Date(profileResult.data.created_at))
        : 0;

      return {
        totalScans,
        totalJournalEntries,
        totalBreathingSessions,
        totalMeditations: 0,
        totalMusicSessions: 0,
        currentStreak,
        longestStreak,
        totalBadges,
        level,
        xp: totalXp,
        xpToNextLevel: xpToNext,
        averageEmotionalScore: profileResult.data?.emotional_score || 0,
        totalHoursUsed: Math.round((totalScans * 2 + totalBreathingSessions * 10 + totalJournalEntries * 5) / 60),
        memberSinceDays,
      };
    } catch (error) {
      logger.error('Error fetching stats:', error as Error, 'PROFILE');
      return DEFAULT_STATS;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ACHIEVEMENTS & BADGES
  // ─────────────────────────────────────────────────────────────

  async getAchievements(): Promise<Achievement[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        achievement_id,
        progress,
        unlocked_at,
        achievements (
          id,
          name,
          description,
          icon,
          rarity,
          category,
          conditions
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      logger.error('Error fetching achievements:', error as Error, 'PROFILE');
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.achievement_id,
      name: item.achievements?.name || 'Achievement',
      description: item.achievements?.description || '',
      icon: item.achievements?.icon || '🏆',
      rarity: item.achievements?.rarity || 'common',
      category: item.achievements?.category || 'milestone',
      target: item.achievements?.conditions?.target || 1,
      progress: item.progress || 0,
      unlocked: !!item.unlocked_at,
      unlockedAt: item.unlocked_at,
    }));
  }

  async getBadges(): Promise<UserBadge[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (error) {
      logger.error('Error fetching badges:', error as Error, 'PROFILE');
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      badge_id: item.badge_id,
      name: item.badge_name || 'Badge',
      description: item.badge_description || '',
      icon: item.badge_icon || '🎖️',
      rarity: item.badge_rarity || 'common',
      earned_at: item.earned_at,
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // ACTIVITY HISTORY
  // ─────────────────────────────────────────────────────────────

  async getActivityHistory(days: number = 30): Promise<ActivityHistoryItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const startDate = subDays(new Date(), days);
    const dateStr = format(startDate, 'yyyy-MM-dd');

    try {
      const [scansData, journalData, breathData] = await Promise.all([
        supabase
          .from('emotional_scans')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', dateStr),
        supabase
          .from('journal_entries')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', dateStr),
        supabase
          .from('breathing_vr_sessions')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', dateStr),
      ]);

      // Group by date
      const historyMap: Record<string, ActivityHistoryItem> = {};
      
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        historyMap[date] = {
          date,
          scans: 0,
          breathing: 0,
          journals: 0,
          meditations: 0,
          music: 0,
        };
      }

      (scansData.data || []).forEach((item: any) => {
        const date = format(new Date(item.created_at), 'yyyy-MM-dd');
        if (historyMap[date]) historyMap[date].scans++;
      });

      (journalData.data || []).forEach((item: any) => {
        const date = format(new Date(item.created_at), 'yyyy-MM-dd');
        if (historyMap[date]) historyMap[date].journals++;
      });

      (breathData.data || []).forEach((item: any) => {
        const date = format(new Date(item.created_at), 'yyyy-MM-dd');
        if (historyMap[date]) historyMap[date].breathing++;
      });

      return Object.values(historyMap).reverse();
    } catch (error) {
      logger.error('Error fetching activity history:', error as Error, 'PROFILE');
      return [];
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SECURITY
  // ─────────────────────────────────────────────────────────────

  async getSecurityInfo(): Promise<SecurityInfo> {
    return {
      password_last_changed: null,
      password_strength: 'medium',
      two_factor_enabled: false,
      active_sessions_count: 1,
      last_login: new Date().toISOString(),
      last_login_ip: null,
    };
  }

  async getActiveSessions(): Promise<ActiveSession[]> {
    // Supabase doesn't expose session management directly
    // Return current session as the only active session
    return [{
      id: 'current',
      device: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      browser: this.detectBrowser(),
      location: 'Session actuelle',
      ip: '***',
      last_active: new Date().toISOString(),
      is_current: true,
      created_at: new Date().toISOString(),
    }];
  }

  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  // ─────────────────────────────────────────────────────────────
  // DATA EXPORT
  // ─────────────────────────────────────────────────────────────

  async exportData(): Promise<ProfileExportData> {
    const [profile, stats, achievements, badges, activityHistory] = await Promise.all([
      this.getProfile(),
      this.getStats(),
      this.getAchievements(),
      this.getBadges(),
      this.getActivityHistory(90),
    ]);

    if (!profile) throw new Error('Profile not found');

    const { id, ...profileWithoutId } = profile;

    return {
      profile: profileWithoutId,
      stats,
      achievements,
      badges,
      activity_history: activityHistory,
      exported_at: new Date().toISOString(),
      format_version: '1.0',
    };
  }

  // ─────────────────────────────────────────────────────────────
  // ACCOUNT MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  async requestAccountDeletion(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Mark for deletion or create deletion request
    await supabase
      .from('profiles')
      .update({
        preferences: {
          deletion_requested: true,
          deletion_requested_at: new Date().toISOString(),
        },
      })
      .eq('id', user.id);
  }

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────

  private mapProfile(data: any): UserProfile {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role || 'b2c',
      bio: data.bio,
      phone: data.phone,
      location: data.location,
      website: data.website,
      avatar_url: data.avatar_url,
      department: data.department,
      job_title: data.job_title,
      emotional_score: data.emotional_score,
      subscription_plan: data.subscription_plan,
      credits_left: data.credits_left,
      org_id: data.org_id,
      team_id: data.team_id,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...(data.preferences || {}),
      },
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}

export const profileService = new ProfileService();
