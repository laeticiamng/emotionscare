
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Heart, Timer } from 'lucide-react';

interface RhSelfCareProps {
  onClose: () => void;
  playSound?: () => void;
}

export const RhSelfCare: React.FC<RhSelfCareProps> = ({
  onClose,
  playSound
}) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  
  const startBreathing = () => {
    if (playSound) playSound();
    setIsBreathing(true);
    
    // Mock breathing exercise with 3 breaths
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setBreathCount(count);
      
      if (count >= 3) {
        clearInterval(interval);
        setTimeout(() => {
          setIsBreathing(false);
          onClose();
        }, 2000);
      }
    }, 4000); // Each breath takes 4 seconds
    
    return () => clearInterval(interval);
  };
  
  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      <Card className="border-primary/20 shadow-lg overflow-hidden">
        <CardHeader className="bg-primary/5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Heart className="h-5 w-5 mr-2 text-rose-500" />
              Et vous, comment allez-vous ?
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-3">
          {!isBreathing ? (
            <div className="space-y-3">
              <p className="text-sm">
                Vous consultez des données émotionnelles intensément depuis un moment. Prendriez-vous une minute pour vous-même ?
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <p className="text-sm">
                  <span className="font-medium block">Suggestion :</span>
                  Une respiration guidée de 30 secondes vous aiderait à rester centré(e) et à maintenir votre propre équilibre émotionnel.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center">
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center mb-4"
              >
                <span className="text-lg font-medium text-blue-700 dark:text-blue-300">
                  {breathCount + 1}/3
                </span>
              </motion.div>
              <motion.p
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="text-blue-700 dark:text-blue-300 text-sm font-medium"
              >
                {breathCount % 2 === 0 ? "Inspirez..." : "Expirez..."}
              </motion.p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end border-t pt-3 pb-3 bg-primary/5">
          {!isBreathing && (
            <Button 
              size="sm" 
              className="gap-1"
              onClick={startBreathing}
            >
              <Timer size={16} />
              <span>Respirer 30 secondes</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
