/**
 * Bouton de partage de session
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Share2, 
  Check,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import type { GroupSession } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ShareSessionButtonProps {
  session: GroupSession;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ShareSessionButton: React.FC<ShareSessionButtonProps> = ({
  session,
  variant = 'outline',
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false);

  const sessionUrl = `${window.location.origin}/app/group-sessions?session=${session.id}`;
  const shareText = `Rejoignez-moi pour "${session.title}" le ${format(
    new Date(session.scheduled_at),
    "EEEE d MMMM 'à' HH:mm",
    { locale: fr }
  )} sur EmotionsCare !`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Impossible de copier le lien');
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + sessionUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Invitation: ${session.title}`);
    const body = encodeURIComponent(`${shareText}\n\nRejoindre la session: ${sessionUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: session.title,
          text: shareText,
          url: sessionUrl,
        });
      } catch (err) {
        // L'utilisateur a annulé le partage
      }
    }
  };

  // Vérifier si l'API native est disponible
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  // Utiliser l'API native si disponible sur mobile
  if (canNativeShare) {
    return (
      <Button variant={variant} size={size} onClick={handleNativeShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Partager
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <LinkIcon className="h-4 w-4" />
          )}
          Copier le lien
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareWhatsApp} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareEmail} className="gap-2">
          <Mail className="h-4 w-4" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareSessionButton;
