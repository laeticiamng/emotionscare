// @ts-nocheck

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { socialShareService } from '@/services/socialShareService';
import { useToast } from '@/hooks/use-toast';

interface BadgeShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: {
    id: string;
    title: string;
    description: string;
    rarity: string;
  } | null;
}

export const BadgeShareDialog: React.FC<BadgeShareDialogProps> = ({
  open,
  onOpenChange,
  achievement
}) => {
  const { toast } = useToast();

  if (!achievement) return null;

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram') => {
    const shareUrl = await socialShareService.shareBadge(
      achievement.id,
      platform,
      achievement.title,
      achievement.description
    );

    if (shareUrl) {
      toast({
        title: '🎉 Badge partagé !',
        description: `Votre badge a été partagé sur ${platform}.`,
      });
      onOpenChange(false);
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de partager le badge.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Share2 className="w-5 h-5 text-primary" />
            Partager votre badge
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Partagez votre succès "{achievement.title}" sur vos réseaux sociaux !
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 bg-secondary/20 rounded-lg text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {achievement.rarity}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            
            <Button
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            
            <Button
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2 bg-[#0A66C2] hover:bg-[#095196] text-white"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            
            <Button
              onClick={() => handleShare('instagram')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
