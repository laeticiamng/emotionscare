import { useCallback, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseShareRoomOptions {
  roomId: string;
  inviteCode: string;
}

interface UseShareRoomResult {
  shareUrl: string;
  copyToClipboard: () => Promise<void>;
  isCopied: boolean;
  shareViaEmail: (recipientEmail: string) => void;
}

export const useShareRoom = ({ roomId, inviteCode }: UseShareRoomOptions): UseShareRoomResult => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://emotionscare.app';
    return `${baseUrl}/app/social-cocon/join?code=${encodeURIComponent(inviteCode)}`;
  }, [inviteCode]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast({
        title: 'Lien copié',
        description: 'Le lien d\'invitation a été copié dans le presse-papier.',
        variant: 'success',
      });
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  }, [shareUrl, toast]);

  const shareViaEmail = useCallback(
    (recipientEmail: string) => {
      const subject = encodeURIComponent('Invitation à rejoindre un espace Social Cocon');
      const body = encodeURIComponent(
        `Bonjour,\n\nJe t'invite à me rejoindre sur Social Cocon pour un moment de pause partagée.\n\nClique sur ce lien pour rejoindre : ${shareUrl}\n\nÀ bientôt !`
      );
      window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, '_blank');
    },
    [shareUrl]
  );

  return {
    shareUrl,
    copyToClipboard,
    isCopied,
    shareViaEmail,
  };
};

export default useShareRoom;
