/**
 * SocialProofBar - Barre de preuve sociale animée
 * Affiche des notifications de nouveaux utilisateurs et actions
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Zap, Moon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialProofItem {
  id: string;
  type: 'signup' | 'session' | 'streak' | 'milestone';
  name: string;
  action: string;
  time: string;
  icon: React.ReactNode;
}

const generateRandomProof = (): SocialProofItem => {
  const types = ['signup', 'session', 'streak', 'milestone'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  
  const firstNames = [
    'Marie', 'Thomas', 'Julie', 'Antoine', 'Camille', 'Lucas', 
    'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Maxime'
  ];
  
  const cities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Nantes'];
  
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} de ${cities[Math.floor(Math.random() * cities.length)]}`;
  const minutes = Math.floor(Math.random() * 10) + 1;
  
  const proofs: Record<typeof type, { action: string; icon: React.ReactNode }> = {
    signup: {
      action: 'vient de s\'inscrire',
      icon: <User className="h-3 w-3 text-green-500" />,
    },
    session: {
      action: 'a terminé une session Reset',
      icon: <Zap className="h-3 w-3 text-amber-500" />,
    },
    streak: {
      action: 'a atteint 7 jours de série',
      icon: <Heart className="h-3 w-3 text-pink-500" />,
    },
    milestone: {
      action: 'a débloqué un nouveau badge',
      icon: <CheckCircle2 className="h-3 w-3 text-blue-500" />,
    },
  };
  
  return {
    id: crypto.randomUUID(),
    type,
    name,
    action: proofs[type].action,
    time: `Il y a ${minutes} min`,
    icon: proofs[type].icon,
  };
};

interface SocialProofBarProps {
  className?: string;
  interval?: number;
  position?: 'top' | 'bottom';
  showOnMobile?: boolean;
}

const SocialProofBar: React.FC<SocialProofBarProps> = ({
  className,
  interval = 8000,
  position = 'bottom',
  showOnMobile = false,
}) => {
  const [currentProof, setCurrentProof] = useState<SocialProofItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Afficher le premier proof après 3 secondes
    const initialTimeout = setTimeout(() => {
      setCurrentProof(generateRandomProof());
      setIsVisible(true);
    }, 3000);

    // Rotation des preuves
    const rotationInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentProof(generateRandomProof());
        setIsVisible(true);
      }, 500);
    }, interval);

    // Auto-hide après 5 secondes
    const hideInterval = setInterval(() => {
      setTimeout(() => {
        setIsVisible(false);
      }, interval - 2000);
    }, interval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(rotationInterval);
      clearInterval(hideInterval);
    };
  }, [interval]);

  if (!currentProof) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 20 : -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed z-50 left-4',
            position === 'bottom' ? 'bottom-4' : 'top-4',
            !showOnMobile && 'hidden md:block',
            className
          )}
        >
          <div 
            className="flex items-center gap-3 px-4 py-3 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg max-w-sm"
            role="status"
            aria-live="polite"
            aria-label={`${currentProof.name} ${currentProof.action} - ${currentProof.time}`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted" aria-hidden="true">
              {currentProof.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                <span className="font-medium">{currentProof.name}</span>
                {' '}
                <span className="text-muted-foreground">{currentProof.action}</span>
              </p>
              <p className="text-xs text-muted-foreground">{currentProof.time}</p>
            </div>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              Vérifié
            </Badge>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofBar;
