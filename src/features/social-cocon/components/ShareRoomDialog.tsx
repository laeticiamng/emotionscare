import React, { memo, useState } from 'react';
import { Copy, Mail, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useShareRoom } from '../hooks/useShareRoom';

export interface ShareRoomDialogProps {
  roomId: string;
  roomName: string;
  inviteCode: string;
}

const ShareRoomDialog: React.FC<ShareRoomDialogProps> = memo(({ roomId, roomName, inviteCode }) => {
  const { shareUrl, copyToClipboard, isCopied, shareViaEmail } = useShareRoom({ roomId, inviteCode });
  const [email, setEmail] = useState('');

  const handleEmailShare = () => {
    if (email.trim()) {
      shareViaEmail(email.trim());
      setEmail('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager « {roomName} »</DialogTitle>
          <DialogDescription>
            Invitez quelqu'un à rejoindre cet espace privé.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Lien de partage */}
          <div className="space-y-2">
            <Label htmlFor="share-link">Lien d'invitation</Label>
            <div className="flex gap-2">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="flex-1 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                aria-label={isCopied ? 'Copié' : 'Copier le lien'}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Partage par email */}
          <div className="space-y-2">
            <Label htmlFor="share-email">Envoyer par email</Label>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="adresse@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleEmailShare}
                disabled={!email.trim()}
                aria-label="Envoyer l'invitation par email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ShareRoomDialog.displayName = 'ShareRoomDialog';

export default ShareRoomDialog;
