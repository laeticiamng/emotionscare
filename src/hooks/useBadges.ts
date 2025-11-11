import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Badge {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  badge_category: string;
  earned_at: string;
  progress?: {
    current: number;
    target: number;
  };
  unlocked: boolean;
  shared_on_social: boolean;
}

export const useBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlockBadge = async (badgeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_badges')
        .update({ unlocked: true })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      if (error) throw error;

      toast.success('Badge débloqué ! 🎉');
      fetchBadges();
    } catch (error: any) {
      console.error('Error unlocking badge:', error);
      toast.error('Erreur lors du déblocage du badge');
    }
  };

  const updateBadgeProgress = async (badgeId: string, current: number, target: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const progress = { current, target };
      const unlocked = current >= target;

      const { error } = await supabase
        .from('user_badges')
        .update({ 
          progress,
          unlocked
        })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      if (error) throw error;

      if (unlocked) {
        toast.success('Badge débloqué ! 🎉');
      }

      fetchBadges();
    } catch (error: any) {
      console.error('Error updating badge progress:', error);
    }
  };

  const shareBadgeOnSocial = async (badgeId: string, platform: 'twitter' | 'linkedin') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const badge = badges.find(b => b.badge_id === badgeId);
      if (!badge) return;

      const text = `Je viens de débloquer le badge "${badge.badge_name}" sur EmotionsCare ! ${badge.badge_icon || '🏆'}`;
      const url = window.location.origin + '/app/achievements';

      let shareUrl = '';
      if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');

      // Mark as shared
      await supabase
        .from('user_badges')
        .update({ shared_on_social: true })
        .eq('user_id', user.id)
        .eq('badge_id', badgeId);

      toast.success('Badge partagé !');
      fetchBadges();
    } catch (error: any) {
      console.error('Error sharing badge:', error);
      toast.error('Erreur lors du partage');
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return {
    badges,
    loading,
    unlockBadge,
    updateBadgeProgress,
    shareBadgeOnSocial,
    refetch: fetchBadges,
  };
};
