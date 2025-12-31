/**
 * ShareSessionButton - Bouton de partage des résultats de session
 */

import { memo, useState, useCallback } from 'react';
import { Share2, Check, Copy, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { BadgeType } from '@/modules/nyvee/types';
import { badgeLabels } from '@/modules/nyvee/types';

interface ShareSessionButtonProps {
  badge: BadgeType;
  moodDelta?: number | null;
  cyclesCompleted: number;
  className?: string;
}

export const ShareSessionButton = memo(({
  badge,
  moodDelta,
  cyclesCompleted,
  className,
}: ShareSessionButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const generateShareText = useCallback(() => {
    const badgeEmoji = badge === 'calm' ? '🌿' : badge === 'partial' ? '✨' : '💫';
    const moodText = moodDelta !== null && moodDelta !== undefined
      ? ` et j'ai amélioré mon humeur de ${moodDelta > 0 ? '+' : ''}${moodDelta}%`
      : '';
    
    return `J'ai complété une session de respiration sur Nyvée ${badgeEmoji}\n\n${cyclesCompleted} cycles de respiration${moodText}.\n\nBadge obtenu : ${badgeLabels[badge]}`;
  }, [badge, moodDelta, cyclesCompleted]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      toast({ title: 'Copié dans le presse-papiers !' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: 'Erreur lors de la copie', variant: 'destructive' });
    }
  }, [generateShareText, toast]);

  const shareOnTwitter = useCallback(() => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }, [generateShareText]);

  const shareOnWhatsApp = useCallback(() => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, [generateShareText]);

  const nativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma session Nyvée',
          text: generateShareText(),
        });
      } catch (error) {
        // User cancelled
      }
    }
  }, [generateShareText]);

  // Si le navigateur supporte le partage natif
  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  
  if (hasNativeShare) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={nativeShare}
        className={className}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Partager
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          Copier
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnWhatsApp}>
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ShareSessionButton.displayName = 'ShareSessionButton';

export default ShareSessionButton;
