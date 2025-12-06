// @ts-nocheck

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSound from '@/hooks/useSound';

export const ReportPrivacyBadge: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { playSound } = useSound();

  const handleClose = () => {
    playSound('tap');
    setIsVisible(false);
  };

  const handleLearnMore = () => {
    playSound('tap');
    // We'd normally navigate to privacy page or show a modal here
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3
                  }}
                  className="bg-primary/10 p-2 rounded-full"
                >
                  <Shield className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <p className="font-medium text-sm">
                    Vos données sont privées et protégées
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tous vos rapports sont conformes RGPD et accessibles uniquement par vous
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs flex items-center gap-1"
                  onClick={handleLearnMore}
                >
                  <span>En savoir plus</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClose}
                  className="h-6 w-6"
                  aria-label="Fermer"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
