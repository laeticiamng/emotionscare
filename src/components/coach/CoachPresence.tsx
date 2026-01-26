import React, { useState, useEffect, memo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import CoachCharacter from './CoachCharacter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, ChevronRight, X, Heart, Brain, Wind,
  Bell, BellOff, TrendingUp, Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Wind;
  action: string;
}

interface InteractionStats {
  totalInteractions: number;
  lastInteractionDate: string | null;
  favoriteActions: Record<string, number>;
  streakDays: number;
  notificationsEnabled: boolean;
  dismissCount: number;
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

const STORAGE_KEY = 'coach-presence-stats';

const CoachPresence: React.FC<CoachPresenceProps> = memo(({
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
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message || GREETING_MESSAGES[0]);
  const [_showActions, setShowActions] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<InteractionStats>({
    totalInteractions: 0,
    lastInteractionDate: null,
    favoriteActions: {},
    streakDays: 0,
    notificationsEnabled: true,
    dismissCount: 0,
  });

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: InteractionStats = JSON.parse(saved);
      setStats(parsed);
      
      // Check if dismissed today
      const today = new Date().toDateString();
      const lastDismiss = localStorage.getItem('coach-presence-dismissed');
      if (lastDismiss === today) {
        setDismissed(true);
      }
    }
  }, []);

  // Save stats
  const saveStats = (newStats: InteractionStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  // Update streak
  useEffect(() => {
    if (stats.lastInteractionDate) {
      const lastDate = new Date(stats.lastInteractionDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Continue streak
      } else if (diffDays > 1) {
        // Reset streak
        saveStats({ ...stats, streakDays: 0 });
      }
    }
  }, []);

  // Message personnalisé basé sur l'heure et les stats
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

    // Personalized messages based on streak
    if (stats.streakDays >= 7) {
      setCurrentMessage(`${greeting}🔥 ${stats.streakDays} jours d'affilée ! Continuez !`);
    } else if (stats.totalInteractions === 0) {
      setCurrentMessage(`${greeting}Ravi de vous rencontrer ! Comment puis-je vous aider ?`);
    } else {
      const randomMessage = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
      setCurrentMessage(greeting + randomMessage);
    }
  }, [message, userName, stats.streakDays, stats.totalInteractions]);

  // Format du temps depuis dernière interaction
  const getTimeSinceLastInteraction = () => {
    if (!lastInteraction && !stats.lastInteractionDate) return null;
    
    const lastDate = lastInteraction || new Date(stats.lastInteractionDate!);
    const now = new Date();
    const diff = now.getTime() - lastDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    return 'Récent';
  };

  const handleQuickAction = (action: QuickAction) => {
    // Update stats
    const newFavoriteActions = { ...stats.favoriteActions };
    newFavoriteActions[action.action] = (newFavoriteActions[action.action] || 0) + 1;
    
    const today = new Date().toDateString();
    const lastDate = stats.lastInteractionDate ? new Date(stats.lastInteractionDate).toDateString() : null;
    const newStreak = lastDate === today ? stats.streakDays : 
                      lastDate && new Date(lastDate).getTime() === new Date(today).getTime() - 86400000 
                        ? stats.streakDays + 1 
                        : 1;
    
    saveStats({
      ...stats,
      totalInteractions: stats.totalInteractions + 1,
      lastInteractionDate: new Date().toISOString(),
      favoriteActions: newFavoriteActions,
      streakDays: newStreak,
    });
    
    onQuickAction?.(action.action);
  };

  const handleDismiss = () => {
    localStorage.setItem('coach-presence-dismissed', new Date().toDateString());
    saveStats({ ...stats, dismissCount: stats.dismissCount + 1 });
    setDismissed(true);
  };

  const toggleNotifications = () => {
    const newValue = !stats.notificationsEnabled;
    saveStats({ ...stats, notificationsEnabled: newValue });
    toast({
      title: newValue ? 'Notifications activées' : 'Notifications désactivées',
      description: newValue ? 'Vous recevrez des rappels du coach' : 'Pas de rappels du coach',
    });
  };

  const handleClick = () => {
    // Record interaction
    const today = new Date().toDateString();
    const lastDate = stats.lastInteractionDate ? new Date(stats.lastInteractionDate).toDateString() : null;
    const newStreak = lastDate === today ? stats.streakDays : 
                      lastDate && new Date(lastDate).getTime() === new Date(today).getTime() - 86400000 
                        ? stats.streakDays + 1 
                        : 1;
    
    saveStats({
      ...stats,
      totalInteractions: stats.totalInteractions + 1,
      lastInteractionDate: new Date().toISOString(),
      streakDays: newStreak,
    });
    
    onClick?.();
  };

  // Get most used action
  const getMostUsedAction = () => {
    const entries = Object.entries(stats.favoriteActions);
    if (entries.length === 0) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  };

  if (dismissed) return null;

  const timeSince = getTimeSinceLastInteraction();
  const mostUsedAction = getMostUsedAction();

  return (
    <TooltipProvider>
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
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowActions(false);
            setShowStats(false);
          }}
        >
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNotifications();
                  }}
                >
                  {stats.notificationsEnabled ? (
                    <Bell className="h-3 w-3" />
                  ) : (
                    <BellOff className="h-3 w-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {stats.notificationsEnabled ? 'Désactiver' : 'Activer'} rappels
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStats(!showStats);
                  }}
                >
                  <TrendingUp className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Statistiques</TooltipContent>
            </Tooltip>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Indicateur en ligne */}
          <motion.div
            className="absolute top-3 left-3 h-2 w-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Streak badge */}
          {stats.streakDays >= 3 && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-8 text-xs bg-orange-500/10 text-orange-600"
            >
              🔥 {stats.streakDays}j
            </Badge>
          )}

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
                {stats.totalInteractions >= 10 && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </TooltipTrigger>
                    <TooltipContent>Utilisateur régulier</TooltipContent>
                  </Tooltip>
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

              {/* Stats panel */}
              <AnimatePresence>
                {showStats && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-2 bg-muted/50 rounded-lg grid grid-cols-3 gap-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <div className="text-lg font-bold">{stats.totalInteractions}</div>
                      <div className="text-xs text-muted-foreground">Interactions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{stats.streakDays}</div>
                      <div className="text-xs text-muted-foreground">Jours série</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {mostUsedAction ? QUICK_ACTIONS.find(a => a.action === mostUsedAction[0])?.label.slice(0, 4) || '-' : '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">Favori</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions rapides */}
              <AnimatePresence>
                {showQuickActions && isHovered && !showStats && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 mt-3"
                  >
                    {QUICK_ACTIONS.map((action) => {
                      const IconComponent = action.icon;
                      const usageCount = stats.favoriteActions[action.action] || 0;
                      return (
                        <Tooltip key={action.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "h-7 text-xs relative",
                                usageCount > 5 && "border-primary/50"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAction(action);
                              }}
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                              {action.label}
                              {usageCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center">
                                  {usageCount > 9 ? '9+' : usageCount}
                                </span>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {usageCount > 0 ? `Utilisé ${usageCount} fois` : 'Jamais utilisé'}
                          </TooltipContent>
                        </Tooltip>
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
                className="absolute top-2 right-28"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
});

CoachPresence.displayName = 'CoachPresence';

export default CoachPresence;
