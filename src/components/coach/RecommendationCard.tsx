// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'music' | 'breathing' | 'meditation' | 'exercise' | 'social';
  duration?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  rating?: number;
  category: string;
  action?: () => void;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  className?: string;
  variant?: 'default' | 'compact';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  className,
  variant = 'default'
}) => {
  const getTypeColor = () => {
    switch (recommendation.type) {
      case 'music': return 'bg-accent/10 text-accent';
      case 'breathing': return 'bg-primary/10 text-primary';
      case 'meditation': return 'bg-success/10 text-success';
      case 'exercise': return 'bg-warning/10 text-warning';
      case 'social': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = () => {
    switch (recommendation.difficulty) {
      case 'easy': return 'bg-success/10 text-success';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = () => {
    switch (recommendation.type) {
      case 'music': return 'Musique';
      case 'breathing': return 'Respiration';
      case 'meditation': return 'Méditation';
      case 'exercise': return 'Exercice';
      case 'social': return 'Social';
      default: return 'Autre';
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={className}
      >
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{recommendation.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
                <div className="flex gap-1">
                  <Badge variant="secondary" className={cn("text-xs", getTypeColor())}>
                    {getTypeLabel()}
                  </Badge>
                  {recommendation.duration && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {recommendation.duration}min
                    </Badge>
                  )}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={recommendation.action}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{recommendation.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={cn("text-xs", getTypeColor())}>
                  {getTypeLabel()}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", getDifficultyColor())}>
                  {recommendation.difficulty}
                </Badge>
                {recommendation.duration && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {recommendation.duration} min
                  </Badge>
                )}
              </div>
            </div>
            {recommendation.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-sm font-medium">{recommendation.rating}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground mb-4">{recommendation.description}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Catégorie: {recommendation.category}
          </p>
          <Button 
            className="w-full" 
            onClick={recommendation.action}
          >
            Commencer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
