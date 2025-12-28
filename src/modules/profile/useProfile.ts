/**
 * useProfile Hook
 * Hook React centralisé pour la gestion du profil avec real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { profileService } from './profileService';
import {
  UserProfile,
  ProfileStats,
  ProfilePreferences,
  Achievement,
  UserBadge,
  ActivityHistoryItem,
  UpdateProfileInput,
  UpdatePreferencesInput,
  DEFAULT_STATS,
} from './types';

interface UseProfileReturn {
  // Data
  profile: UserProfile | null;
  stats: ProfileStats;
  achievements: Achievement[];
  badges: UserBadge[];
  activityHistory: ActivityHistoryItem[];
  
  // States
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  updateProfile: (updates: UpdateProfileInput) => Promise<void>;
  updatePreferences: (preferences: UpdatePreferencesInput) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  removeAvatar: () => Promise<void>;
  exportData: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  requestAccountDeletion: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats>(DEFAULT_STATS);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [profileData, statsData, achievementsData, badgesData, historyData] = await Promise.all([
        profileService.getProfile(),
        profileService.getStats(),
        profileService.getAchievements(),
        profileService.getBadges(),
        profileService.getActivityHistory(30),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setAchievements(achievementsData);
      setBadges(badgesData);
      setActivityHistory(historyData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    try {
      const profileData = await profileService.getProfile();
      setProfile(profileData);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }, []);

  // Refresh stats
  const refreshStats = useCallback(async () => {
    try {
      const statsData = await profileService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: UpdateProfileInput) => {
    setIsSaving(true);
    try {
      const updatedProfile = await profileService.updateProfile(updates);
      setProfile(updatedProfile);
      toast.success('Profil mis à jour');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de mise à jour';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (preferences: UpdatePreferencesInput) => {
    setIsSaving(true);
    try {
      const newPrefs = await profileService.updatePreferences(preferences);
      setProfile(prev => prev ? { ...prev, preferences: newPrefs } : null);
      toast.success('Préférences mises à jour');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de mise à jour';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    setIsSaving(true);
    try {
      const url = await profileService.uploadAvatar(file);
      setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
      toast.success('Avatar mis à jour');
      return url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de téléchargement';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Remove avatar
  const removeAvatar = useCallback(async () => {
    setIsSaving(true);
    try {
      await profileService.removeAvatar();
      setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
      toast.success('Avatar supprimé');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de suppression';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Export data
  const exportData = useCallback(async () => {
    try {
      const data = await profileService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-profile-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Données exportées');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur d\'export';
      toast.error(message);
      throw err;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (newPassword: string) => {
    setIsSaving(true);
    try {
      await profileService.changePassword(newPassword);
      toast.success('Mot de passe modifié');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de modification';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Request account deletion
  const requestAccountDeletion = useCallback(async () => {
    setIsSaving(true);
    try {
      await profileService.requestAccountDeletion();
      toast.success('Demande de suppression enregistrée');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Load on mount and user change
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Real-time subscription for profile changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            refreshProfile();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshProfile]);

  return {
    profile,
    stats,
    achievements,
    badges,
    activityHistory,
    isLoading,
    isSaving,
    error,
    updateProfile,
    updatePreferences,
    uploadAvatar,
    removeAvatar,
    exportData,
    changePassword,
    requestAccountDeletion,
    refreshProfile,
    refreshStats,
  };
}

export default useProfile;
