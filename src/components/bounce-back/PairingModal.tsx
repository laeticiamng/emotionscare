/**
 * PairingModal - Modal de partage pair-à-pair
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, Copy, Check, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface PairingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pairToken: string;
  onSendTip: (tip: string) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

const TIP_SUGGESTIONS = [
  "Quand je stresse, je prends 3 grandes respirations.",
  "Je me rappelle que tout problème a une solution.",
  "Je fais une pause de 5 minutes pour me recentrer.",
  "Je parle à quelqu'un de confiance.",
  "Je me concentre sur une seule chose à la fois."
];

export const PairingModal: React.FC<PairingModalProps> = ({
  open,
  onOpenChange,
  pairToken,
  onSendTip,
  onSkip,
  isLoading
}) => {
  const [tip, setTip] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(pairToken);
    setCopied(true);
    toast({
      title: 'Code copié !',
      description: 'Partagez-le avec un ami pour échanger des conseils.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTip = () => {
    if (tip.trim().length < 10) {
      toast({
        title: 'Conseil trop court',
        description: 'Écrivez au moins 10 caractères.',
        variant: 'destructive'
      });
      return;
    }
    onSendTip(tip.trim());
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setTip(suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Partage pair-à-pair</DialogTitle>
          </div>
          <DialogDescription>
            Partagez un conseil de résilience avec un autre participant !
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Code de partage */}
          <div className="space-y-2">
            <Label>Votre code de partage</Label>
            <div className="flex gap-2">
              <Input
                value={pairToken}
                readOnly
                className="font-mono text-lg text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyToken}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Partagez ce code avec un ami qui a aussi terminé sa bataille
            </p>
          </div>

          {/* Zone de conseil */}
          <div className="space-y-2">
            <Label htmlFor="tip">Votre conseil de résilience</Label>
            <Textarea
              id="tip"
              placeholder="Partagez une stratégie qui vous aide à gérer le stress..."
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min. 10 caractères</span>
              <span>{tip.length} / 500</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {TIP_SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  {suggestion.slice(0, 30)}...
                </motion.button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={onSkip}
              disabled={isLoading}
            >
              Passer
            </Button>
            <Button
              onClick={handleSendTip}
              disabled={tip.trim().length < 10 || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                'Envoi...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Envoyer le conseil
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
