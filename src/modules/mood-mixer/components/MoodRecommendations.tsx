// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Brain, Moon, Zap, Coffee, Palette,
  ArrowRight, Clock
} from 'lucide-react';
import type { MoodPreset } from '../useMoodMixerEnriched';

interface MoodRecommendationsProps {
  currentMoodScore: number;
  currentTime?: Date;
  onApplyPreset: (preset: MoodPreset) => void;
  availablePresets: MoodPreset[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  priority: number;
  presetCategory: MoodPreset['category'];
}

function getTimeBasedRecommendations(hour: number): Recommendation[] {
  if (hour >= 5 && hour < 9) {
    return [
      {
        id: 'morning-energy',
        title: 'Réveil Dynamique',
        description: 'Commencez la journée avec énergie',
        icon: Coffee,
        category: 'Matin',
        priority: 1,
        presetCategory: 'energy',
      },
      {
        id: 'morning-focus',
        title: 'Clarté Matinale',
        description: 'Préparez-vous pour une journée productive',
        icon: Brain,
        category: 'Matin',
        priority: 2,
        presetCategory: 'focus',
      },
    ];
  }

  if (hour >= 9 && hour < 12) {
    return [
      {
        id: 'work-focus',
        title: 'Focus Profond',
        description: 'Concentrez-vous sur vos tâches importantes',
        icon: Brain,
        category: 'Travail',
        priority: 1,
        presetCategory: 'focus',
      },
    ];
  }

  if (hour >= 12 && hour < 14) {
    return [
      {
        id: 'lunch-relax',
        title: 'Pause Régénérante',
        description: 'Rechargez vos batteries à midi',
        icon: Sparkles,
        category: 'Pause',
        priority: 1,
        presetCategory: 'relax',
      },
    ];
  }

  if (hour >= 14 && hour < 18) {
    return [
      {
        id: 'afternoon-creative',
        title: 'Flow Créatif',
        description: 'Libérez votre créativité l\'après-midi',
        icon: Palette,
        category: 'Après-midi',
        priority: 1,
        presetCategory: 'creative',
      },
      {
        id: 'afternoon-energy',
        title: 'Boost de l\'après-midi',
        description: 'Combattez la fatigue de 15h',
        icon: Zap,
        category: 'Après-midi',
        priority: 2,
        presetCategory: 'energy',
      },
    ];
  }

  if (hour >= 18 && hour < 21) {
    return [
      {
        id: 'evening-relax',
        title: 'Détente du Soir',
        description: 'Décompressez après la journée',
        icon: Sparkles,
        category: 'Soirée',
        priority: 1,
        presetCategory: 'relax',
      },
    ];
  }

  return [
    {
      id: 'night-sleep',
      title: 'Préparation au Sommeil',
      description: 'Transition douce vers le repos',
      icon: Moon,
      category: 'Nuit',
      priority: 1,
      presetCategory: 'sleep',
    },
  ];
}

function getMoodBasedRecommendations(moodScore: number): Recommendation[] {
  if (moodScore < 30) {
    return [
      {
        id: 'low-mood-energy',
        title: 'Boost d\'Énergie',
        description: 'Remontez votre humeur rapidement',
        icon: Zap,
        category: 'Bien-être',
        priority: 1,
        presetCategory: 'energy',
      },
    ];
  }

  if (moodScore < 50) {
    return [
      {
        id: 'medium-mood-balance',
        title: 'Équilibre Zen',
        description: 'Retrouvez votre harmonie intérieure',
        icon: Sparkles,
        category: 'Bien-être',
        priority: 1,
        presetCategory: 'relax',
      },
    ];
  }

  return [];
}

export const MoodRecommendations: React.FC<MoodRecommendationsProps> = ({
  currentMoodScore,
  currentTime = new Date(),
  onApplyPreset,
  availablePresets,
}) => {
  const hour = currentTime.getHours();
  
  const timeRecs = getTimeBasedRecommendations(hour);
  const moodRecs = getMoodBasedRecommendations(currentMoodScore);
  
  const allRecommendations = [...moodRecs, ...timeRecs]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  const findMatchingPreset = (category: MoodPreset['category']): MoodPreset | undefined => {
    return availablePresets.find(p => p.category === category);
  };

  if (allRecommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Recommandations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {allRecommendations.map((rec, index) => {
          const Icon = rec.icon;
          const matchingPreset = findMatchingPreset(rec.presetCategory);
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{rec.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {rec.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {rec.description}
                </p>
              </div>

              {matchingPreset && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onApplyPreset(matchingPreset)}
                  className="flex-shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          );
        })}

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <Clock className="h-3 w-3" />
          <span>
            Basé sur l'heure ({hour}h) et votre humeur ({currentMoodScore}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodRecommendations;
