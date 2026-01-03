/**
 * CompletionScreen - Écran de fin de bataille avec XP basé sur mode et partage
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, RotateCcw, BarChart2, MessageCircle, Share2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

// XP multipliers per mode
const XP_MULTIPLIERS: Record<string, number> = {
  quick: 1,
  standard: 1.5,
  zen: 1.25,
  challenge: 2
};

interface CompletionScreenProps {
  coachMessage: string | null;
  duration: number;
  eventCount: number;
  onRestart: () => void;
  onViewStats: () => void;
  tipReceived?: string | null;
  xpEarned?: number;
  mode?: string;
  score?: number;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  coachMessage,
  duration,
  eventCount,
  onRestart,
  onViewStats,
  tipReceived,
  xpEarned,
  mode = 'standard',
  score
}) => {
  const [copied, setCopied] = React.useState(false);
  
  // Calculate XP with mode multiplier
  const multiplier = XP_MULTIPLIERS[mode] || 1;
  const baseXP = Math.round((duration / 60) * 10 + eventCount * 5);
  const calculatedXP = xpEarned ?? Math.round(baseXP * multiplier);
  
  // Trigger confetti on mount
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const shareText = `🛡️ J'ai terminé une bataille Bounce-Back!\n⏱️ Durée: ${formatDuration(duration)}\n🎯 Stimuli gérés: ${eventCount}\n⭐ XP gagnés: +${calculatedXP}\n\n#BounceBack #Résilience`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bounce-Back Battle',
          text: shareText,
        });
        toast({
          title: 'Partagé !',
          description: 'Votre résultat a été partagé',
        });
      } catch (error) {
        // User cancelled or error
        handleCopy(shareText);
      }
    } else {
      handleCopy(shareText);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Copié !',
      description: 'Résultat copié dans le presse-papiers',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto text-center" role="main" aria-label="Écran de complétion">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-warning to-warning/60 rounded-full mb-4">
          <Trophy className="w-12 h-12 text-primary-foreground" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bataille terminée !
        </h1>
        <p className="text-muted-foreground">
          Vous avez développé votre résilience avec succès
        </p>
        {multiplier > 1 && (
          <Badge className="mt-2 bg-warning/20 text-warning">
            Mode {mode} - x{multiplier} XP
          </Badge>
        )}
      </motion.div>

      {/* Stats rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              {formatDuration(duration)}
            </div>
            <div className="text-sm text-muted-foreground">Durée</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-foreground">
              {eventCount}
            </div>
            <div className="text-sm text-muted-foreground">Stimuli gérés</div>
          </CardContent>
        </Card>
        {score !== undefined && (
          <Card className="bg-success/10 border-success/30">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-success">
                {score}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </CardContent>
          </Card>
        )}
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-warning">
              +{calculatedXP}
            </div>
            <div className="text-sm text-muted-foreground">XP gagnés</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Coach message */}
      {coachMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
              <p className="text-lg text-foreground italic">
                "{coachMessage}"
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tip received */}
      {tipReceived && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-info/5 border-info/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-info flex items-center justify-center gap-2">
                <Star className="w-4 h-4" aria-hidden="true" />
                Conseil reçu d'un pair
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                "{tipReceived}"
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          variant="outline"
          onClick={handleShare}
          className="gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copié !' : 'Partager'}
        </Button>
        <Button
          variant="outline"
          onClick={onViewStats}
          className="gap-2"
        >
          <BarChart2 className="w-4 h-4" />
          Voir mes statistiques
        </Button>
        <Button
          onClick={onRestart}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Nouvelle bataille
        </Button>
      </motion.div>
    </div>
  );
};
