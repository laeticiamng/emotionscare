// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'instagram';

interface BadgeShare {
  id: string;
  user_id: string;
  achievement_id: string;
  platform: SocialPlatform;
  shared_at: string;
  share_url?: string;
}

class SocialShareService {
  async shareBadge(achievementId: string, platform: SocialPlatform, badgeTitle: string, badgeDescription: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const shareUrl = this.generateShareUrl(platform, badgeTitle, badgeDescription);

      // Enregistrer le partage
      const { error } = await supabase
        .from('badge_shares')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          platform,
          share_url: shareUrl
        });

      if (error) throw error;

      // Ouvrir la fenêtre de partage
      window.open(shareUrl, '_blank', 'width=600,height=400');

      return shareUrl;
    } catch (error) {
      logger.error('Erreur lors du partage du badge', error as Error, 'SocialShareService');
      return null;
    }
  }

  private generateShareUrl(platform: SocialPlatform, title: string, description: string): string {
    const appUrl = window.location.origin;
    const shareText = `🎵 J'ai débloqué le badge "${title}" sur EmotionsCare! ${description}`;
    const hashtags = 'EmotionsCare,Musicothérapie,Gamification';

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=${hashtags}&url=${encodeURIComponent(appUrl)}`;
      
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
      
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodeURIComponent(shareText)}`;
      
      case 'instagram':
        // Instagram ne permet pas de partage direct via URL, on copie le texte
        navigator.clipboard.writeText(shareText);
        return `https://www.instagram.com/`;
      
      default:
        return appUrl;
    }
  }

  async getBadgeShares(): Promise<BadgeShare[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('badge_shares')
        .select('*')
        .eq('user_id', user.id)
        .order('shared_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des partages', error as Error, 'SocialShareService');
      return [];
    }
  }

  generateBadgeImage(badgeTitle: string, badgeRarity: string): string {
    // Générer une image de badge dynamique avec Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Fond gradient selon la rareté
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    switch (badgeRarity) {
      case 'legendary':
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        break;
      case 'epic':
        gradient.addColorStop(0, '#9333EA');
        gradient.addColorStop(1, '#4C1D95');
        break;
      case 'rare':
        gradient.addColorStop(0, '#3B82F6');
        gradient.addColorStop(1, '#1E40AF');
        break;
      default:
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(1, '#065F46');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Texte du badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(badgeTitle, 200, 200);

    return canvas.toDataURL('image/png');
  }
}

export const socialShareService = new SocialShareService();
