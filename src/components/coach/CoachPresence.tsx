import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CoachCharacter from './CoachCharacter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Clock, ChevronRight, X, Heart, Brain, Wind } from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Wind;
  action: string;
}

interface CoachPresenceProps {
  mood?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  userName?: string;
  lastInteraction?: Date;
  showQuickActions?: boolean;
  onQuickAction?: (action: string) => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', label: 'Respiration', icon: Wind, action: 'breathing' },
  { id: '2', label: 'Journal', icon: Heart, action: 'journal' },
  { id: '3', label: 'Conseil', icon: Brain, action: 'advice' }
];

const GREETING_MESSAGES = [
  "Comment puis-je vous aider aujourd'hui ?",
  "Je suis là pour vous accompagner.",
  "Prêt pour une nouvelle conversation ?",
  "Besoin d'un moment de bien-être ?",
  "Je suis à votre écoute."
];

const CoachPresence: React.FC<CoachPresenceProps> = ({
  mood = 'neutral',
  message,
  size = 'md',
  className,
  onClick,
  userName,
  lastInteraction,
  showQuickActions = true,
  onQuickAction
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message || GREETING_MESSAGES[0]);
  const [showActions, setShowActions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Message personnalisé basé sur l'heure
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      return;
    }

    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) {
      greeting = userName ? `Bonjour ${userName} ! ` : 'Bonjour ! ';
    } else if (hour < 18) {
      greeting = userName ? `Bon après-midi ${userName} ! ` : 'Bon après-midi ! ';
    } else {
      greeting = userName ? `Bonsoir ${userName} ! ` : 'Bonsoir ! ';
    }

    const randomMessage = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    setCurrentMessage(greeting + randomMessage);
  }, [message, userName]);

  // Format du temps depuis dernière interaction
  const getTimeSinceLastInteraction = () => {
    if (!lastInteraction) return null;
    
    const now = new Date();
    const diff = now.getTime() - lastInteraction.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    return 'Récent';
  };

  if (dismissed) return null;

  const timeSince = getTimeSinceLastInteraction();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Card 
        className={cn(
          "p-4 relative overflow-hidden transition-all duration-300",
          isHovered ? "bg-primary/5 shadow-lg" : "hover:bg-muted/50",
          "cursor-pointer border-2",
          isHovered && "border-primary/30",
          className
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowActions(false);
        }}
      >
        {/* Bouton fermer */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Indicateur en ligne */}
        <motion.div
          className="absolute top-3 left-3 h-2 w-2 bg-green-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="flex items-center gap-3">
          {/* Avatar du coach */}
          <motion.div
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CoachCharacter mood={mood} size={size} animated={true} />
          </motion.div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Coach IA</span>
              {timeSince && (
                <Badge variant="secondary" className="text-xs h-5">
                  <Clock className="h-2.5 w-2.5 mr-1" />
                  {timeSince}
                </Badge>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.p 
                key={currentMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm text-muted-foreground line-clamp-2"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>

            {/* Actions rapides */}
            <AnimatePresence>
              {showQuickActions && isHovered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 mt-3"
                >
                  {QUICK_ACTIONS.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction?.(action.action);
                        }}
                      >
                        <IconComponent className="h-3 w-3 mr-1" />
                        {action.label}
                      </Button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Indicateur d'action */}
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChevronRight className={cn(
              "h-5 w-5 transition-colors",
              isHovered ? "text-primary" : "text-muted-foreground"
            )} />
          </motion.div>
        </div>

        {/* Effet de brillance au hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-10"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default CoachPresence;
