import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  Brain, 
  Heart, 
  Dumbbell, 
  Sparkles,
  Target
} from 'lucide-react';
import { GritChallenge } from '@/types/boss-level-grit';

interface ChallengeCardProps {
  challenge: GritChallenge;
  onStart: (challenge: GritChallenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onStart }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'hsl(var(--muted))';
      case 'warrior': return 'hsl(var(--primary))';
      case 'master': return 'hsl(var(--accent))';
      case 'legend': return 'hsl(var(--destructive))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental': return <Brain className="h-5 w-5" />;
      case 'physical': return <Dumbbell className="h-5 w-5" />;
      case 'emotional': return <Heart className="h-5 w-5" />;
      case 'spiritual': return <Sparkles className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'novice': return 'Novice';
      case 'warrior': return 'Guerrier';
      case 'master': return 'Maître';
      case 'legend': return 'Légende';
      default: return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mental': return 'Mental';
      case 'physical': return 'Physique';
      case 'emotional': return 'Émotionnel';
      case 'spiritual': return 'Spirituel';
      default: return category;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`relative overflow-hidden ${challenge.status === 'locked' ? 'opacity-60' : ''}`}>
        <div 
          className="absolute top-0 left-0 w-full h-1"
          style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}
        />
        
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(challenge.category)}
              <span>{challenge.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline"
                style={{ borderColor: getDifficultyColor(challenge.difficulty) }}
              >
                {getDifficultyLabel(challenge.difficulty)}
              </Badge>
              {challenge.status === 'completed' && (
                <Trophy className="h-4 w-4 text-accent" />
              )}
            </div>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {getCategoryLabel(challenge.category)} • {challenge.duration} min • {challenge.xpReward} XP
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {challenge.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                📊 {challenge.completionRate}%
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {challenge.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="pt-2">
            <Button
              onClick={() => onStart(challenge)}
              disabled={challenge.status === 'locked'}
              className="w-full"
              variant={challenge.status === 'completed' ? 'outline' : 'default'}
            >
              {challenge.status === 'locked' && (
                <>🔒 Verrouillé</>
              )}
              {challenge.status === 'available' && (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Commencer le Défi
                </>
              )}
              {challenge.status === 'completed' && (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refaire le Défi
                </>
              )}
            </Button>
          </div>
          
          {challenge.streakRequired && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              🔥 Série de {challenge.streakRequired} jours requise
            </div>
          )}
          
          {challenge.prerequisites && challenge.prerequisites.length > 0 && (
            <div className="text-xs text-muted-foreground">
              📋 Prérequis: {challenge.prerequisites.join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChallengeCard;