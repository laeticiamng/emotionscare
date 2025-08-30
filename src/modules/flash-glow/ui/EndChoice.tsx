/**
 * EndChoice - Composant de choix de fin pour Flash Glow
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, RotateCcw, Sparkles, Clock } from 'lucide-react';

interface EndChoiceProps {
  onChoice: (choice: 'gain' | 'léger' | 'incertain', extend?: boolean) => void;
  sessionDuration: number;
  className?: string;
}

const EndChoice: React.FC<EndChoiceProps> = ({
  onChoice,
  sessionDuration,
  className
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showExtend, setShowExtend] = useState(false);

  const choices = [
    {
      id: 'gain',
      label: 'Gain ressenti',
      description: 'Je me sens plus énergique',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      emoji: '✨'
    },
    {
      id: 'léger',
      label: 'Effet léger',
      description: 'Petit changement positif',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      emoji: '🌟'
    },
    {
      id: 'incertain',
      label: 'Incertain',
      description: 'Pas de changement notable',
      icon: RotateCcw,
      color: 'from-gray-500 to-slate-500',
      emoji: '🤔'
    }
  ];

  const handleChoice = (choice: 'gain' | 'léger' | 'incertain') => {
    setSelectedChoice(choice);
    
    // Si la session était courte, proposer d'étendre
    if (sessionDuration < 90 && choice !== 'gain') {
      setShowExtend(true);
    } else {
      onChoice(choice, false);
    }
  };

  const handleExtend = (extend: boolean) => {
    if (selectedChoice) {
      onChoice(selectedChoice as 'gain' | 'léger' | 'incertain', extend);
    }
  };

  if (showExtend && selectedChoice) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={className}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Encore 60 secondes ?</h3>
              <p className="text-sm text-muted-foreground">
                Votre session était de {sessionDuration}s. Un peu plus pourrait amplifier l'effet.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleExtend(false)}
                className="flex-1"
              >
                Ça suffit
              </Button>
              <Button
                onClick={() => handleExtend(true)}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Encore 60s
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
      className={className}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Comment vous sentez-vous ?</h3>
        <p className="text-sm text-muted-foreground">
          Session de {sessionDuration}s terminée
        </p>
      </div>

      <div className="grid gap-3 max-w-md mx-auto">
        {choices.map((choice) => {
          const Icon = choice.icon;
          
          return (
            <motion.div
              key={choice.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={() => handleChoice(choice.id as 'gain' | 'léger' | 'incertain')}
                className={`
                  w-full h-auto p-4 text-left border-2 transition-all duration-200
                  hover:border-primary/20 group relative overflow-hidden
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-full bg-gradient-to-r ${choice.color} 
                    flex items-center justify-center text-white shadow-lg
                  `}>
                    <span className="text-lg">{choice.emoji}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-base mb-1">
                      {choice.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {choice.description}
                    </div>
                  </div>

                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Effet hover subtil */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${choice.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}
                  initial={false}
                />
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-muted-foreground">
          Votre retour nous aide à personnaliser l'expérience
        </p>
      </div>
    </motion.div>
  );
};

export default EndChoice;