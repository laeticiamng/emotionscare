
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Clock, X } from 'lucide-react';

interface RhSelfCareProps {
  onClose: () => void;
  playSound?: () => void;
}

export const RhSelfCare: React.FC<RhSelfCareProps> = ({ onClose, playSound }) => {
  return (
    <Card className="w-full max-w-md shadow-lg border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Heart className="mr-2 text-rose-500" size={18} />
            Auto-soin RH
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => {
            if (playSound) playSound();
            onClose();
          }}>
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vous consultez de nombreuses données émotionnelles aujourd'hui. Prenez un moment pour vous-même.
          </p>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-2 text-sm">Exercice de respiration (2 min)</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Respirez profondément en suivant le cercle ci-dessous.
            </p>
            <div className="flex justify-center py-2">
              <motion.div
                className="w-16 h-16 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.2, 1.2, 1, 1] }}
                transition={{
                  duration: 8,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
          if (playSound) playSound();
          onClose();
        }}>
          <Clock size={14} />
          <span>Plus tard</span>
        </Button>
        <Button size="sm" className="text-xs" onClick={() => {
          if (playSound) playSound();
          onClose();
        }}>
          J'ai pris une pause
        </Button>
      </CardFooter>
    </Card>
  );
};
