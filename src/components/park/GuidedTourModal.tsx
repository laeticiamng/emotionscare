import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Zap, Palette, Wind, Users, Sparkles, LucideIcon } from 'lucide-react';
import { EmotionalProfile } from '@/hooks/useGuidedTour';

interface GuidedTourModalProps {
  isOpen: boolean;
  onStart: (profile: EmotionalProfile) => void;
  onSkip: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onStart,
  onSkip
}) => {
  const [selectedProfile, setSelectedProfile] = useState<EmotionalProfile['primary'] | null>(null);

  const profiles: Array<{
    id: EmotionalProfile['primary'];
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
  }> = [
    {
      id: 'stress',
      name: 'Réduction du Stress',
      description: 'Je cherche à me détendre et gérer mon stress quotidien',
      icon: Wind,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'energy',
      name: 'Boost d\'Énergie',
      description: 'Je veux retrouver ma motivation et mon dynamisme',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'creativity',
      name: 'Expression Créative',
      description: 'J\'aspire à explorer ma créativité émotionnelle',
      icon: Palette,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'calm',
      name: 'Paix Intérieure',
      description: 'Je recherche la sérénité et la méditation',
      icon: Heart,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'social',
      name: 'Connexion Sociale',
      description: 'Je souhaite me connecter avec une communauté bienveillante',
      icon: Users,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const handleStart = () => {
    if (selectedProfile) {
      onStart({ primary: selectedProfile, preferences: [] });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onSkip}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Bienvenue dans le Parc Émotionnel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Laisse-moi te guider à travers les attractions qui correspondent le mieux à tes besoins émotionnels.
            </p>
            <p className="text-sm text-muted-foreground">
              Choisis ton objectif principal pour recevoir un parcours personnalisé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((profile) => {
              const Icon = profile.icon;
              const isSelected = selectedProfile === profile.id;

              return (
                <motion.button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all text-left
                    ${isSelected 
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10' 
                      : 'border-border hover:border-primary/50 bg-background'
                    }
                  `}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-indicator"
                      className="absolute top-3 right-3"
                    >
                      <Badge className="bg-primary">Sélectionné</Badge>
                    </motion.div>
                  )}

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${profile.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{profile.description}</p>
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              Explorer librement
            </Button>
            <Button
              onClick={handleStart}
              disabled={!selectedProfile}
              className="flex-1"
            >
              Commencer le parcours guidé
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Tu pourras toujours explorer toutes les attractions librement après le parcours guidé
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
