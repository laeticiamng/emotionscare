/**
 * ModeSelector - Sélection du mode de bataille avec 4 modes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Clock, Target, Leaf, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type BattleMode = 'quick' | 'standard' | 'zen' | 'challenge';

interface ModeSelectorProps {
  onSelectMode: (mode: BattleMode) => void;
  isLoading?: boolean;
}

const modes = [
  {
    id: 'quick' as const,
    title: 'Rapide',
    description: 'Session express pour une pause énergisante',
    duration: '1 min 30',
    stimuli: '5 stimuli',
    difficulty: 'Facile',
    icon: Clock,
    color: 'from-success to-success/60',
    features: [
      '1 boost de calme',
      'Rythme modéré',
      'Idéal pour les pauses'
    ],
    xpMultiplier: 1
  },
  {
    id: 'standard' as const,
    title: 'Standard',
    description: 'Idéal pour débuter ou s\'entraîner en douceur',
    duration: '3 minutes',
    stimuli: '8 stimuli',
    difficulty: 'Modéré',
    icon: Shield,
    color: 'from-info to-info/60',
    features: [
      '2 boosts de calme',
      'Rythme progressif',
      'Parfait pour le quotidien'
    ],
    xpMultiplier: 1.5
  },
  {
    id: 'zen' as const,
    title: 'Zen',
    description: 'Concentration sur la respiration et le calme',
    duration: '4 minutes',
    stimuli: '6 stimuli',
    difficulty: 'Modéré',
    icon: Leaf,
    color: 'from-primary to-primary/60',
    features: [
      '3 boosts de calme',
      'Rythme lent et espacé',
      'Pause respiratoire entre chaque stimulus'
    ],
    xpMultiplier: 1.25
  },
  {
    id: 'challenge' as const,
    title: 'Challenge',
    description: 'Pour les guerriers de la résilience !',
    duration: '5 minutes',
    stimuli: '15 stimuli',
    difficulty: 'Élevé',
    icon: Flame,
    color: 'from-destructive to-warning',
    features: [
      '2 boosts de calme',
      'Rythme soutenu',
      'XP bonus +100%'
    ],
    xpMultiplier: 2
  }
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode, isLoading }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choisissez votre mode
        </h2>
        <p className="text-muted-foreground">
          Affrontez des vagues de stimuli stressants et développez votre résilience
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                {/* XP Badge */}
                {mode.xpMultiplier > 1 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">
                      x{mode.xpMultiplier} XP
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color}`}>
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{mode.title}</CardTitle>
                  <CardDescription className="text-sm">{mode.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 flex-1 flex flex-col">
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {mode.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="w-3 h-3" />
                      {mode.stimuli}
                    </div>
                  </div>

                  <Badge variant="outline" className="w-fit text-xs">
                    {mode.difficulty}
                  </Badge>

                  {/* Features */}
                  <ul className="space-y-1.5 flex-1">
                    {mode.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full mt-auto"
                    variant={mode.id === 'challenge' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelectMode(mode.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Chargement...' : 'Commencer'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tips section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 p-4 bg-muted/30 rounded-xl max-w-2xl mx-auto"
      >
        <p className="text-sm text-muted-foreground">
          💡 <strong>Conseil :</strong> Commencez par le mode <strong>Rapide</strong> ou <strong>Standard</strong> pour vous familiariser, 
          puis progressez vers le mode <strong>Challenge</strong> pour maximiser vos gains d'XP !
        </p>
      </motion.div>
    </div>
  );
};
