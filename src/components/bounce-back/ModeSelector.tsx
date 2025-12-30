/**
 * ModeSelector - Sélection du mode de bataille
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ModeSelectorProps {
  onSelectMode: (mode: 'standard' | 'intense') => void;
  isLoading?: boolean;
}

const modes = [
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
      '2 boosts de calme disponibles',
      'Rythme progressif',
      'Parfait pour le quotidien'
    ]
  },
  {
    id: 'intense' as const,
    title: 'Intense',
    description: 'Pour les guerriers de la résilience !',
    duration: '4 minutes',
    stimuli: '12 stimuli',
    difficulty: 'Élevé',
    icon: Zap,
    color: 'from-destructive to-warning',
    features: [
      '2 boosts de calme disponibles',
      'Rythme soutenu',
      'XP bonus +50%'
    ]
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

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color}`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <Badge variant="secondary">
                      {mode.difficulty}
                    </Badge>
                  </div>
                  <CardTitle>{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {mode.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Target className="w-4 h-4" />
                      {mode.stimuli}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {mode.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full mt-4"
                    variant={mode.id === 'intense' ? 'default' : 'outline'}
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
    </div>
  );
};
