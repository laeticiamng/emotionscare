/**
 * ShareAchievementDialog - Dialog pour partager un accomplissement
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useParkSharing, type ShareableAchievement } from '@/hooks/useParkSharing';

interface ShareAchievementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: ShareableAchievement | null;
}

export function ShareAchievementDialog({
  isOpen,
  onClose,
  achievement
}: ShareAchievementDialogProps) {
  const { isSharing, isShareSupported, shareNative, copyToClipboard, generateShareText } = useParkSharing();
  const [copied, setCopied] = useState(false);

  if (!achievement) return null;

  const shareText = generateShareText(achievement);
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(window.location.origin + '/app/emotional-park');

  const handleCopy = async () => {
    const success = await copyToClipboard(achievement);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    await shareNative(achievement);
    onClose();
  };

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Partager votre accomplissement
          </DialogTitle>
          <DialogDescription>
            Partagez "{achievement.title}" avec vos amis !
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Achievement Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{achievement.icon}</span>
              <div>
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
            {achievement.stats && (
              <div className="flex gap-3 mt-3">
                {Object.entries(achievement.stats).map(([key, value]) => (
                  <div key={key} className="px-2 py-1 rounded bg-background/50 text-xs">
                    <span className="font-medium">{value}</span>
                    <span className="text-muted-foreground ml-1">{key}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Share Text Preview */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Aperçu du message:</p>
            <Textarea
              readOnly
              value={shareText}
              className="resize-none h-24 text-sm"
            />
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            {isShareSupported && (
              <Button
                onClick={handleNativeShare}
                disabled={isSharing}
                className="w-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                {isSharing ? 'Partage...' : 'Partager'}
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copier
                  </>
                )}
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]"
              >
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]"
              >
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]"
              >
                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareAchievementDialog;
