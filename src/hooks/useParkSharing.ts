// @ts-nocheck
/**
 * useParkSharing - Hook pour partager les accomplissements du parc
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useParkExport } from './useParkExport';

export interface ShareableAchievement {
  type: 'badge' | 'quest' | 'milestone' | 'streak';
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  stats?: Record<string, number>;
}

export function useParkSharing() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { generateSummary } = useParkExport();
  const [isSharing, setIsSharing] = useState(false);

  // Generate share text for achievement
  const generateShareText = useCallback((achievement: ShareableAchievement): string => {
    const emojiMap: Record<string, string> = {
      badge: '🏅',
      quest: '🏆',
      milestone: '🌟',
      streak: '🔥'
    };

    let text = `${emojiMap[achievement.type]} ${achievement.title}\n\n`;
    text += `${achievement.description}\n`;
    
    if (achievement.stats) {
      text += '\n📊 Statistiques:\n';
      Object.entries(achievement.stats).forEach(([key, value]) => {
        text += `• ${key}: ${value}\n`;
      });
    }

    text += '\n#EmotionalPark #BienEtre #EmotionsCare';
    return text;
  }, []);

  // Share via Web Share API
  const shareNative = useCallback(async (achievement: ShareableAchievement) => {
    if (!navigator.share) {
      toast({
        title: 'Partage non supporté',
        description: 'Votre navigateur ne supporte pas le partage natif',
        variant: 'destructive'
      });
      return false;
    }

    setIsSharing(true);
    try {
      await navigator.share({
        title: achievement.title,
        text: generateShareText(achievement),
        url: window.location.origin + '/app/emotional-park'
      });
      toast({
        title: 'Partagé !',
        description: 'Votre accomplissement a été partagé'
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Erreur',
          description: 'Le partage a échoué',
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setIsSharing(false);
    }
  }, [generateShareText, toast]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (achievement: ShareableAchievement) => {
    const text = generateShareText(achievement);
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copié !',
        description: 'Le texte a été copié dans le presse-papiers'
      });
      return true;
    } catch {
      toast({
        title: 'Erreur',
        description: 'La copie a échoué',
        variant: 'destructive'
      });
      return false;
    }
  }, [generateShareText, toast]);

  // Share summary
  const shareSummary = useCallback(async () => {
    setIsSharing(true);
    try {
      const summary = await generateSummary();
      if (!summary) {
        toast({
          title: 'Erreur',
          description: 'Impossible de générer le résumé',
          variant: 'destructive'
        });
        return false;
      }

      if (navigator.share) {
        await navigator.share({
          title: 'Mon aventure au Parc Émotionnel',
          text: summary,
          url: window.location.origin + '/app/emotional-park'
        });
      } else {
        await navigator.clipboard.writeText(summary);
        toast({
          title: 'Copié !',
          description: 'Le résumé a été copié'
        });
      }
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Erreur',
          description: 'Le partage a échoué',
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setIsSharing(false);
    }
  }, [generateSummary, toast]);

  // Share badge unlock
  const shareBadgeUnlock = useCallback((badgeName: string, badgeEmoji: string) => {
    return shareNative({
      type: 'badge',
      title: `Badge débloqué: ${badgeName}`,
      description: `J'ai débloqué le badge ${badgeEmoji} ${badgeName} au Parc Émotionnel !`,
      icon: badgeEmoji,
      earnedAt: new Date()
    });
  }, [shareNative]);

  // Share quest completion
  const shareQuestComplete = useCallback((questTitle: string, rewards: { xp: number; coins: number }) => {
    return shareNative({
      type: 'quest',
      title: `Quête terminée: ${questTitle}`,
      description: `J'ai accompli la quête "${questTitle}" au Parc Émotionnel !`,
      icon: '🏆',
      earnedAt: new Date(),
      stats: {
        'XP gagnés': rewards.xp,
        'Pièces obtenues': rewards.coins
      }
    });
  }, [shareNative]);

  // Share streak milestone
  const shareStreakMilestone = useCallback((days: number) => {
    return shareNative({
      type: 'streak',
      title: `Série de ${days} jours !`,
      description: `Je maintiens une série de ${days} jours consécutifs au Parc Émotionnel !`,
      icon: '🔥',
      earnedAt: new Date(),
      stats: {
        'Jours consécutifs': days
      }
    });
  }, [shareNative]);

  // Check if Web Share is supported
  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  return {
    isSharing,
    isShareSupported,
    shareNative,
    copyToClipboard,
    shareSummary,
    shareBadgeUnlock,
    shareQuestComplete,
    shareStreakMilestone,
    generateShareText
  };
}

export default useParkSharing;
