import React, { useState } from 'react';
import {
  Share2,
  Copy,
  MessageCircle,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

interface SharePostButtonProps {
  postId: string;
  postContent: string;
  postAuthor?: string;
}

export const SharePostButton: React.FC<SharePostButtonProps> = ({
  postId,
  postContent,
  postAuthor = 'Une personne de la communauté',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/app/community?post=${postId}`;
  };

  const generateShareText = () => {
    return `Partage de la communauté EmotionsCare:\n\n"${postContent.slice(0, 100)}..."\n\n- ${postAuthor}`;
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = generateShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Lien copié',
        description: 'Tu peux maintenant partager ce message.',
      });
      setIsOpen(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyText = async () => {
    try {
      const shareText = generateShareText();
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Texte copié',
        description: 'Tu peux partager ce message où tu veux.',
      });
      setIsOpen(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le texte.',
        variant: 'destructive',
      });
    }
  };

  const handleShareVia = (platform: string) => {
    const shareText = generateShareText();
    const shareUrl = generateShareUrl();
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=Un partage de la communauté EmotionsCare&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
    }

    if (url) {
      if (platform === 'email') {
        window.location.href = url;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      setIsOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      toast({
        title: 'Partage non disponible',
        description: 'Utilise les options ci-dessous pour partager.',
      });
      return;
    }

    try {
      await navigator.share({
        title: 'EmotionsCare',
        text: generateShareText(),
        url: generateShareUrl(),
      });
      setIsOpen(false);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: 'Erreur de partage',
          description: 'Impossible de partager ce message.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-emerald-600 transition-colors"
          title="Partager ce message"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Partager</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Copier le lien</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyText} className="cursor-pointer">
          <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Copier le texte</span>
        </DropdownMenuItem>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Partager via...</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleShareVia('email')}
          className="cursor-pointer"
        >
          <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShareVia('whatsapp')}
          className="cursor-pointer"
        >
          <span className="mr-2">💬</span>
          <span>WhatsApp</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
