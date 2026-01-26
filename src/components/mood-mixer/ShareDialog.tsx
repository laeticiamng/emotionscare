import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  Share2, 
  MessageCircle,
  Twitter,
  Facebook,
  Mail,
  QrCode
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mixName: string;
  mixId: string;
  components: { id: string; name: string; value: number }[];
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  mixName,
  mixId,
  components
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [includeComponents, setIncludeComponents] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  const shareUrl = `https://emotionscare.com/mix/${mixId}`;
  const shareText = `Découvrez mon mix "${mixName}" sur EmotionsCare! ${includeComponents ? components.slice(0, 3).map(c => `${c.name}: ${c.value}%`).join(', ') : ''}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Lien copié !',
        description: 'Le lien a été copié dans votre presse-papiers.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`Mon mix "${mixName}"`)}&body=${encodedText}%20${encodedUrl}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager votre mix
          </DialogTitle>
          <DialogDescription>
            Partagez "{mixName}" avec vos amis et votre communauté
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Aperçu du mix */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-medium">{mixName}</div>
                <div className="text-sm text-muted-foreground">Mood Mix</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {components.slice(0, 4).map((comp) => (
                <Badge key={comp.id} variant="secondary" className="text-xs">
                  {comp.name}: {comp.value}%
                </Badge>
              ))}
            </div>
          </div>

          {/* Options de partage */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-components" className="cursor-pointer">
                Inclure les détails du mix
              </Label>
              <Switch
                id="include-components"
                checked={includeComponents}
                onCheckedChange={setIncludeComponents}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is-public" className="cursor-pointer">
                  Rendre public
                </Label>
                <p className="text-xs text-muted-foreground">
                  Permet à d'autres utilisateurs de découvrir ce mix
                </p>
              </div>
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </div>

          {/* Lien de partage */}
          <div className="space-y-2">
            <Label>Lien de partage</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Boutons de partage */}
          <div className="space-y-2">
            <Label>Partager sur</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-5 w-5" />
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-5 w-5" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => handleShare('whatsapp')}
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-3"
                onClick={() => handleShare('email')}
              >
                <Mail className="h-5 w-5" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </div>

          {/* QR Code placeholder */}
          <div className="p-4 rounded-lg border border-dashed text-center">
            <QrCode className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              QR Code disponible prochainement
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
