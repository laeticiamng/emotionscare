import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Clock, Star, Trophy, Zap } from 'lucide-react';

interface GritChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'novice' | 'warrior' | 'master' | 'legend';
  category: 'mental' | 'physical' | 'emotional' | 'spiritual';
  duration: number;
  xpReward: number;
  completionRate: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
}

interface ChallengeCardProps {
  challenge: GritChallenge;
  onStart: (challenge: GritChallenge) => void;
  disabled?: boolean;
}

const difficultyColors = {
  novice: 'bg-green-500',
  warrior: 'bg-yellow-500', 
  master: 'bg-orange-500',
  legend: 'bg-purple-500'
};

const categoryIcons = {
  mental: Zap,
  physical: Trophy,
  emotional: Star,
  spiritual: Clock
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onStart, 
  disabled = false 
}) => {
  const IconComponent = categoryIcons[challenge.category];
  const isLocked = challenge.status === 'locked';
  const isCompleted = challenge.status === 'completed';
  
  return (
    <motion.div
      whileHover={!disabled && !isLocked ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLocked ? { scale: 0.98 } : {}}
    >
      <Card className={`transition-all duration-200 ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 
        isCompleted ? 'border-green-500/50 bg-green-500/5' :
        'hover:shadow-lg cursor-pointer'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription className="text-sm">
                  {challenge.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge 
                variant="secondary"
                className={`${difficultyColors[challenge.difficulty]} text-white`}
              >
                {challenge.difficulty}
              </Badge>
              {isCompleted && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ✓ Complété
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{challenge.duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{challenge.xpReward} XP</span>
            </div>
          </div>
          
          {challenge.completionRate > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progression</span>
                <span>{challenge.completionRate}%</span>
              </div>
              <Progress value={challenge.completionRate} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={() => onStart(challenge)}
            disabled={disabled || isLocked}
            className="w-full"
            variant={isCompleted ? "outline" : "default"}
          >
            {isLocked ? 'Verrouillé' : 
             isCompleted ? 'Refaire' : 
             challenge.status === 'in_progress' ? 'Continuer' : 'Commencer'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChallengeCard;