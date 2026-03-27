// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Link, Globe, Lock, Loader2, Check } from 'lucide-react';
import type { MoodPreset } from '../useMoodMixerEnriched';

interface PresetShareDialogProps {
  preset: MoodPreset | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (preset: MoodPreset, isPublic: boolean) => Promise<string>;
  onCopyLink: (shareCode: string) => void;
  isSharing?: boolean;
}

export const PresetShareDialog: React.FC<PresetShareDialogProps> = ({
  preset,
  isOpen,
  onClose,
  onShare,
  onCopyLink,
  isSharing = false,
}) => {
  const [isPublic, setIsPublic] = useState(false);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!preset) return;
    const code = await onShare(preset, isPublic);
    if (code) {
      setShareCode(code);
    }
  };

  const handleCopy = () => {
    if (shareCode) {
      onCopyLink(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setShareCode(null);
    setIsPublic(false);
    setCopied(false);
    onClose();
  };

  if (!preset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager "{preset.name}"
          </DialogTitle>
          <DialogDescription>
            Partagez votre mix avec d'autres utilisateurs
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Preset preview */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">{preset.name}</p>
              <Badge variant="outline">{preset.category}</Badge>
            </div>
            <div className="flex gap-1">
              {preset.components.slice(0, 6).map((comp) => (
                <div
                  key={comp.id}
                  className={`h-2 rounded-full bg-gradient-to-r ${comp.color}`}
                  style={{ width: `${comp.value}%`, maxWidth: '16.66%' }}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!shareCode ? (
              <motion.div
                key="options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Public toggle */}
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isPublic ? (
                      <Globe className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label htmlFor="public-toggle" className="font-medium">
                        {isPublic ? 'Public' : 'Privé'}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {isPublic 
                          ? 'Visible dans la galerie communautaire' 
                          : 'Accessible uniquement par lien'
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="public-toggle"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>

                <Button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-full"
                >
                  {isSharing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création du lien...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Générer le lien de partage
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-700 dark:text-green-400">
                    Preset partagé avec succès !
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Code de partage</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareCode}
                      readOnly
                      className="font-mono text-center text-lg tracking-wider"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Lien direct</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/app/mood-mixer?import=${shareCode}`}
                      readOnly
                      className="text-xs"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopy}
                      className="flex-shrink-0"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PresetShareDialog;
