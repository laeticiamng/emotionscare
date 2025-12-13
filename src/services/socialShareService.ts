// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Plateformes sociales supportées */
export type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'whatsapp' | 'telegram' | 'email' | 'copy';

/** Type de contenu partageable */
export type ShareContentType = 'badge' | 'achievement' | 'mood' | 'streak' | 'milestone' | 'progress' | 'custom';

/** Configuration de partage */
export interface ShareConfig {
  platforms: SocialPlatform[];
  defaultMessage: string;
  includeAppLink: boolean;
  includeHashtags: boolean;
  customHashtags?: string[];
  trackShares: boolean;
}

/** Partage de badge */
export interface BadgeShare {
  id: string;
  userId: string;
  achievementId: string;
  platform: SocialPlatform;
  sharedAt: Date;
  shareUrl?: string;
  engagement?: ShareEngagement;
}

/** Engagement d'un partage */
export interface ShareEngagement {
  clicks: number;
  impressions: number;
  reactions: number;
  comments: number;
}

/** Contenu partageable */
export interface ShareableContent {
  type: ShareContentType;
  title: string;
  description: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
}

/** Statistiques de partage */
export interface ShareStats {
  totalShares: number;
  sharesByPlatform: Record<SocialPlatform, number>;
  sharesByType: Record<ShareContentType, number>;
  topSharedContent: { title: string; shares: number }[];
  weeklyTrend: { week: string; shares: number }[];
  engagementRate: number;
}

/** Template de partage */
export interface ShareTemplate {
  id: string;
  name: string;
  type: ShareContentType;
  messageTemplate: string;
  hashtags: string[];
  emoji?: string;
}

const DEFAULT_CONFIG: ShareConfig = {
  platforms: ['twitter', 'facebook', 'linkedin', 'whatsapp', 'copy'],
  defaultMessage: 'Découvrez mon parcours sur EmotionsCare !',
  includeAppLink: true,
  includeHashtags: true,
  customHashtags: ['EmotionsCare', 'BienEtre', 'SantéMentale'],
  trackShares: true
};

const SHARE_TEMPLATES: ShareTemplate[] = [
  {
    id: 'badge',
    name: 'Badge débloqué',
    type: 'badge',
    messageTemplate: '🏆 J\'ai débloqué le badge "{title}" sur EmotionsCare! {description}',
    hashtags: ['EmotionsCare', 'Accomplissement', 'Gamification'],
    emoji: '🏆'
  },
  {
    id: 'streak',
    name: 'Série active',
    type: 'streak',
    messageTemplate: '🔥 {days} jours consécutifs de bien-être sur EmotionsCare! {description}',
    hashtags: ['EmotionsCare', 'Streak', 'Régularité'],
    emoji: '🔥'
  },
  {
    id: 'mood',
    name: 'Mood du jour',
    type: 'mood',
    messageTemplate: '✨ Mon humeur du jour sur EmotionsCare: {mood}. {description}',
    hashtags: ['EmotionsCare', 'MoodTracking', 'BienEtre'],
    emoji: '✨'
  },
  {
    id: 'milestone',
    name: 'Milestone atteint',
    type: 'milestone',
    messageTemplate: '🎯 Milestone atteint: {title}! {description}',
    hashtags: ['EmotionsCare', 'Milestone', 'Progrès'],
    emoji: '🎯'
  },
  {
    id: 'progress',
    name: 'Progrès',
    type: 'progress',
    messageTemplate: '📈 {progress}% de progrès sur mon parcours EmotionsCare! {description}',
    hashtags: ['EmotionsCare', 'Progrès', 'Développement'],
    emoji: '📈'
  }
];

class SocialShareService {
  private config: ShareConfig = DEFAULT_CONFIG;

  /** Configure le service */
  configure(newConfig: Partial<ShareConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /** Partage un badge sur une plateforme */
  async shareBadge(
    achievementId: string,
    platform: SocialPlatform,
    badgeTitle: string,
    badgeDescription: string
  ): Promise<string | null> {
    return this.shareContent({
      type: 'badge',
      title: badgeTitle,
      description: badgeDescription,
      data: { achievementId }
    }, platform);
  }

  /** Partage un contenu générique */
  async shareContent(
    content: ShareableContent,
    platform: SocialPlatform
  ): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const template = SHARE_TEMPLATES.find(t => t.type === content.type) || SHARE_TEMPLATES[0];
      const message = this.formatMessage(template.messageTemplate, content);
      const shareUrl = this.generateShareUrl(platform, message, template.hashtags);

      // Enregistrer le partage si tracking activé
      if (this.config.trackShares) {
        await supabase.from('social_shares').insert({
          user_id: user.id,
          content_type: content.type,
          content_title: content.title,
          platform,
          share_url: shareUrl,
          metadata: content.data
        });
      }

      // Ouvrir ou copier selon la plateforme
      if (platform === 'copy') {
        await navigator.clipboard.writeText(message);
        return message;
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      logger.info('Content shared', { type: content.type, platform }, 'SOCIAL');
      return shareUrl;
    } catch (error) {
      logger.error('Erreur lors du partage', error as Error, 'SOCIAL');
      return null;
    }
  }

  /** Formate le message avec les variables */
  private formatMessage(template: string, content: ShareableContent): string {
    let message = template
      .replace('{title}', content.title)
      .replace('{description}', content.description);

    // Remplacer les variables personnalisées
    if (content.data) {
      Object.entries(content.data).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, String(value));
      });
    }

    return message;
  }

  /** Génère l'URL de partage selon la plateforme */
  private generateShareUrl(platform: SocialPlatform, message: string, hashtags: string[]): string {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://emotionscare.app';
    const hashtagString = hashtags.join(',');
    const fullMessage = this.config.includeAppLink ? `${message} ${appUrl}` : message;
    const encodedMessage = encodeURIComponent(fullMessage);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedMessage}&hashtags=${hashtagString}`;

      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodedMessage}`;

      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodedMessage}`;

      case 'whatsapp':
        return `https://wa.me/?text=${encodedMessage}`;

      case 'telegram':
        return `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodedMessage}`;

      case 'email':
        const subject = encodeURIComponent('Mon parcours EmotionsCare');
        return `mailto:?subject=${subject}&body=${encodedMessage}`;

      case 'instagram':
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(fullMessage);
        }
        return 'https://www.instagram.com/';

      default:
        return appUrl;
    }
  }

  /** Récupère les partages de l'utilisateur */
  async getUserShares(limit: number = 50): Promise<BadgeShare[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('social_shares')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        achievementId: s.achievement_id || '',
        platform: s.platform,
        sharedAt: new Date(s.created_at),
        shareUrl: s.share_url
      }));
    } catch (error) {
      logger.error('Erreur lors de la récupération des partages', error as Error, 'SOCIAL');
      return [];
    }
  }

  /** Récupère les statistiques de partage */
  async getShareStats(): Promise<ShareStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return this.getEmptyStats();
      }

      const { data: shares } = await supabase
        .from('social_shares')
        .select('*')
        .eq('user_id', user.id);

      if (!shares || shares.length === 0) {
        return this.getEmptyStats();
      }

      // Comptage par plateforme
      const sharesByPlatform: Record<SocialPlatform, number> = {
        twitter: 0, facebook: 0, linkedin: 0, instagram: 0,
        whatsapp: 0, telegram: 0, email: 0, copy: 0
      };
      shares.forEach(s => {
        if (s.platform in sharesByPlatform) {
          sharesByPlatform[s.platform as SocialPlatform]++;
        }
      });

      // Comptage par type
      const sharesByType: Record<ShareContentType, number> = {
        badge: 0, achievement: 0, mood: 0, streak: 0, milestone: 0, progress: 0, custom: 0
      };
      shares.forEach(s => {
        if (s.content_type in sharesByType) {
          sharesByType[s.content_type as ShareContentType]++;
        }
      });

      // Top contenu partagé
      const contentCounts: Record<string, number> = {};
      shares.forEach(s => {
        const title = s.content_title || 'Sans titre';
        contentCounts[title] = (contentCounts[title] || 0) + 1;
      });
      const topSharedContent = Object.entries(contentCounts)
        .map(([title, shares]) => ({ title, shares }))
        .sort((a, b) => b.shares - a.shares)
        .slice(0, 5);

      // Tendance hebdomadaire
      const weeklyData: Record<string, number> = {};
      shares.forEach(s => {
        const week = new Date(s.created_at).toISOString().slice(0, 10);
        weeklyData[week] = (weeklyData[week] || 0) + 1;
      });
      const weeklyTrend = Object.entries(weeklyData)
        .map(([week, shares]) => ({ week, shares }))
        .sort((a, b) => a.week.localeCompare(b.week))
        .slice(-8);

      return {
        totalShares: shares.length,
        sharesByPlatform,
        sharesByType,
        topSharedContent,
        weeklyTrend,
        engagementRate: 0 // À calculer avec les données d'engagement
      };
    } catch (error) {
      logger.error('Erreur lors du calcul des stats', error as Error, 'SOCIAL');
      return this.getEmptyStats();
    }
  }

  /** Statistiques vides par défaut */
  private getEmptyStats(): ShareStats {
    return {
      totalShares: 0,
      sharesByPlatform: {
        twitter: 0, facebook: 0, linkedin: 0, instagram: 0,
        whatsapp: 0, telegram: 0, email: 0, copy: 0
      },
      sharesByType: {
        badge: 0, achievement: 0, mood: 0, streak: 0, milestone: 0, progress: 0, custom: 0
      },
      topSharedContent: [],
      weeklyTrend: [],
      engagementRate: 0
    };
  }

  /** Génère une image de badge dynamique */
  generateBadgeImage(badgeTitle: string, badgeRarity: string, emoji?: string): string {
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Fond gradient selon la rareté
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    const colors = this.getRarityColors(badgeRarity);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Bordure
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 360, 360);

    // Emoji
    if (emoji) {
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(emoji, 200, 150);
    }

    // Texte du badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(badgeTitle, 200, 220);

    // Rareté
    ctx.font = '18px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(badgeRarity.toUpperCase(), 200, 260);

    // Logo
    ctx.font = '14px Arial';
    ctx.fillText('EmotionsCare', 200, 370);

    return canvas.toDataURL('image/png');
  }

  /** Couleurs selon la rareté */
  private getRarityColors(rarity: string): [string, string] {
    switch (rarity) {
      case 'legendary':
        return ['#FFD700', '#FFA500'];
      case 'epic':
        return ['#9333EA', '#4C1D95'];
      case 'rare':
        return ['#3B82F6', '#1E40AF'];
      case 'uncommon':
        return ['#10B981', '#065F46'];
      default:
        return ['#6B7280', '#374151'];
    }
  }

  /** Génère une image de progrès */
  generateProgressImage(progress: number, title: string): string {
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 315; // Format Open Graph
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Fond
    const gradient = ctx.createLinearGradient(0, 0, 600, 315);
    gradient.addColorStop(0, '#1E3A5F');
    gradient.addColorStop(1, '#0D1B2A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 315);

    // Titre
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 300, 80);

    // Cercle de progression
    const centerX = 300;
    const centerY = 180;
    const radius = 70;

    // Fond du cercle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Arc de progression
    const progressAngle = (progress / 100) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, progressAngle);
    ctx.strokeStyle = progress >= 100 ? '#10B981' : '#3B82F6';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Pourcentage
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(progress)}%`, centerX, centerY);

    // Logo
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('EmotionsCare', 300, 290);

    return canvas.toDataURL('image/png');
  }

  /** Partage une série (streak) */
  async shareStreak(days: number, platform: SocialPlatform): Promise<string | null> {
    return this.shareContent({
      type: 'streak',
      title: `${days} jours de série`,
      description: 'Ma régularité porte ses fruits !',
      data: { days }
    }, platform);
  }

  /** Partage un milestone */
  async shareMilestone(
    title: string,
    description: string,
    platform: SocialPlatform
  ): Promise<string | null> {
    return this.shareContent({
      type: 'milestone',
      title,
      description
    }, platform);
  }

  /** Partage le progrès */
  async shareProgress(
    progress: number,
    description: string,
    platform: SocialPlatform
  ): Promise<string | null> {
    return this.shareContent({
      type: 'progress',
      title: `${progress}% de progrès`,
      description,
      data: { progress }
    }, platform);
  }

  /** Vérifie si la plateforme est supportée */
  isPlatformSupported(platform: SocialPlatform): boolean {
    return this.config.platforms.includes(platform);
  }

  /** Récupère les plateformes supportées */
  getSupportedPlatforms(): SocialPlatform[] {
    return this.config.platforms;
  }

  /** Récupère les templates disponibles */
  getTemplates(): ShareTemplate[] {
    return SHARE_TEMPLATES;
  }

  /** Récupère un template par type */
  getTemplateByType(type: ShareContentType): ShareTemplate | undefined {
    return SHARE_TEMPLATES.find(t => t.type === type);
  }

  /** Exporte les données de partage */
  async exportShareData(): Promise<string> {
    const shares = await this.getUserShares(1000);

    let csv = 'Date,Plateforme,Type,Titre,URL\n';
    for (const share of shares) {
      csv += `${share.sharedAt.toISOString()},${share.platform},badge,"${share.achievementId}",${share.shareUrl || ''}\n`;
    }

    return csv;
  }
}

export const socialShareService = new SocialShareService();
