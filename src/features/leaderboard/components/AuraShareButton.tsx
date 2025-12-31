/**
 * AuraShareButton - Bouton de partage de son aura
 */
import { memo, useState } from 'react';
import { Share2, Copy, Check, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { AuraEntry } from '../hooks/useAurasLeaderboard';

interface AuraShareButtonProps {
  aura: AuraEntry;
}

const getAuraDescription = (aura: AuraEntry): string => {
  let energyType = 'équilibrée';
  if (aura.colorHue >= 200 && aura.colorHue <= 270) {
    energyType = 'calme et apaisante';
  } else if (aura.colorHue >= 30 && aura.colorHue <= 60) {
    energyType = 'vive et rayonnante';
  }
  
  const luminosityText = aura.luminosity > 0.7 ? 'brillante' : aura.luminosity > 0.5 ? 'sereine' : 'douce';
  
  return `Mon aura EmotionsCare est ${energyType} et ${luminosityText} ✨`;
};

export const AuraShareButton = memo(function AuraShareButton({ aura }: AuraShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareText = getAuraDescription(aura);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/app/leaderboard' : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast.success('Copié dans le presse-papiers');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier');
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'Mon Aura EmotionsCare',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          toast.error('Erreur lors du partage');
        }
      }
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Partager mon aura
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {hasNativeShare && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copié !' : 'Copier le lien'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter / X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
