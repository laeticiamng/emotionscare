// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Target, Share2, Zap, Flame, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'facile' | 'moyen' | 'difficile';
  completed: boolean;
  deadline?: string;
  bonusMultiplier?: number;
  streak?: number;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: (challengeId: string) => void;
  onClaim?: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onStart, 
  onClaim 
}) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!challenge.deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(challenge.deadline!);
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expiré');
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours < 24) {
        setIsUrgent(true);
        if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      } else {
        const days = Math.floor(hours / 24);
        setTimeRemaining(`${days}j ${hours % 24}h`);
        setIsUrgent(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [challenge.deadline]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'moyen': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'difficile': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      case 'special': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'special': return 'Spécial';
      default: return category;
    }
  };

  const isCompleted = challenge.progress >= challenge.maxProgress;
  const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;
  const totalPoints = challenge.bonusMultiplier 
    ? Math.round(challenge.points * challenge.bonusMultiplier) 
    : challenge.points;

  const handleShare = async () => {
    const shareText = `🏆 Je relève le défi "${challenge.title}" sur EmotionsCare ! ${challenge.completed ? '✅ Terminé !' : `${Math.round(progressPercentage)}% complété`}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon défi EmotionsCare',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copié !',
        description: 'Le texte a été copié dans le presse-papier.',
      });
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`hover:shadow-lg transition-all duration-200 overflow-hidden ${
          isCompleted && !challenge.completed ? 'ring-2 ring-green-500/50' : ''
        }`}>
          {/* Bonus Multiplier Banner */}
          {challenge.bonusMultiplier && challenge.bonusMultiplier > 1 && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs py-1 px-3 flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              <span className="font-semibold">Bonus x{challenge.bonusMultiplier} actif !</span>
            </div>
          )}

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    {challenge.streak && challenge.streak > 1 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-0.5 text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                            <Flame className="h-3 w-3" />
                            <span className="text-xs font-bold">{challenge.streak}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Série de {challenge.streak} défis complétés !</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                
                {/* Points with bonus */}
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold text-sm">{totalPoints}</span>
                  </div>
                  {challenge.bonusMultiplier && challenge.bonusMultiplier > 1 && (
                    <span className="text-xs text-muted-foreground line-through">
                      {challenge.points}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                  {challenge.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCategoryIcon(challenge.category)}
                  {getCategoryLabel(challenge.category)}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-500 text-white">
                    ✓ Terminé
                  </Badge>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">
                    {challenge.progress}/{challenge.maxProgress}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progressPercentage} className="h-2" />
                  {/* Progress milestones */}
                  <div className="absolute inset-0 flex justify-between items-center px-1">
                    {[25, 50, 75].map((milestone) => (
                      <div
                        key={milestone}
                        className={`w-1 h-1 rounded-full ${
                          progressPercentage >= milestone ? 'bg-white' : 'bg-white/30'
                        }`}
                        style={{ marginLeft: `${milestone - 2}%` }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(progressPercentage)}% complété
                </p>
              </div>

              {/* Deadline with countdown */}
              {challenge.deadline && (
                <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                  isUrgent ? 'bg-red-500/10 text-red-600' : 'bg-muted/50 text-muted-foreground'
                }`}>
                  <Clock className={`h-4 w-4 ${isUrgent ? 'animate-pulse' : ''}`} />
                  <span>
                    {isUrgent ? 'Plus que ' : 'Échéance: '}
                    <span className="font-semibold">{timeRemaining}</span>
                  </span>
                  {isUrgent && !isCompleted && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <div className="flex-1">
                  {isCompleted && !challenge.completed ? (
                    <Button 
                      onClick={() => onClaim?.(challenge.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Réclamer {totalPoints} pts
                    </Button>
                  ) : challenge.completed ? (
                    <Button variant="outline" disabled className="w-full">
                      ✓ Récompense réclamée
                    </Button>
                  ) : challenge.progress > 0 ? (
                    <Button 
                      onClick={() => onStart?.(challenge.id)}
                      variant="outline" 
                      className="w-full"
                    >
                      Continuer ({Math.round(progressPercentage)}%)
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => onStart?.(challenge.id)}
                      className="w-full"
                    >
                      Commencer
                    </Button>
                  )}
                </div>
                
                {/* Share Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Partager ce défi</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default ChallengeCard;
