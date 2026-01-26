// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Music, Brain, Heart, Users, BookOpen, Camera,
  Zap, PlayCircle, SkipForward, Volume2,
  Settings, Share2, Download, Star, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
  badge?: string;
  premium?: boolean;
  shortcut?: string;
}

interface QuickActionsProps {
  className?: string;
  context?: 'dashboard' | 'music' | 'meditation' | 'journal' | 'community';
  onActionClick?: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  className,
  context = 'dashboard',
  onActionClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const getContextualActions = (): QuickAction[] => {
    switch (context) {
      case 'music':
        return [
          {
            id: 'play-pause',
            label: 'Lecture/Pause',
            icon: <PlayCircle className="w-4 h-4" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            onClick: () => handleAction('play-pause'),
            shortcut: 'Space'
          },
          {
            id: 'next-track',
            label: 'Piste suivante',
            icon: <SkipForward className="w-4 h-4" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            onClick: () => handleAction('next-track'),
            shortcut: '→'
          },
          {
            id: 'volume',
            label: 'Volume',
            icon: <Volume2 className="w-4 h-4" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            onClick: () => handleAction('volume')
          },
          {
            id: 'add-to-favorites',
            label: 'Favoris',
            icon: <Heart className="w-4 h-4" />,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
            onClick: () => handleAction('add-to-favorites')
          },
          {
            id: 'share',
            label: 'Partager',
            icon: <Share2 className="w-4 h-4" />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            onClick: () => handleAction('share')
          }
        ];

      case 'meditation':
        return [
          {
            id: 'start-session',
            label: 'Nouvelle session',
            icon: <Brain className="w-4 h-4" />,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-500/10',
            onClick: () => handleAction('start-session'),
            premium: true
          },
          {
            id: 'breathing-exercise',
            label: 'Respiration',
            icon: <Zap className="w-4 h-4" />,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            onClick: () => handleAction('breathing-exercise')
          },
          {
            id: 'guided-meditation',
            label: 'Méditation guidée',
            icon: <PlayCircle className="w-4 h-4" />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            onClick: () => handleAction('guided-meditation')
          }
        ];

      case 'journal':
        return [
          {
            id: 'new-entry',
            label: 'Nouvelle entrée',
            icon: <Plus className="w-4 h-4" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            onClick: () => handleAction('new-entry')
          },
          {
            id: 'voice-note',
            label: 'Note vocale',
            icon: <Camera className="w-4 h-4" />,
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            onClick: () => handleAction('voice-note'),
            premium: true
          },
          {
            id: 'export',
            label: 'Exporter',
            icon: <Download className="w-4 h-4" />,
            color: 'text-gray-400',
            bgColor: 'bg-gray-500/10',
            onClick: () => handleAction('export')
          }
        ];

      case 'community':
        return [
          {
            id: 'new-post',
            label: 'Nouveau post',
            icon: <Plus className="w-4 h-4" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            onClick: () => handleAction('new-post')
          },
          {
            id: 'join-group',
            label: 'Rejoindre groupe',
            icon: <Users className="w-4 h-4" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            onClick: () => handleAction('join-group')
          },
          {
            id: 'share-achievement',
            label: 'Partager succès',
            icon: <Star className="w-4 h-4" />,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            onClick: () => handleAction('share-achievement')
          }
        ];

      default:
        return [
          {
            id: 'quick-scan',
            label: 'Scan Express',
            icon: <Brain className="w-4 h-4" />,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            onClick: () => handleAction('quick-scan'),
            badge: 'Nouveau'
          },
          {
            id: 'music-therapy',
            label: 'Musicothérapie',
            icon: <Music className="w-4 h-4" />,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            onClick: () => handleAction('music-therapy')
          },
          {
            id: 'breathing',
            label: 'Respiration',
            icon: <Zap className="w-4 h-4" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            onClick: () => handleAction('breathing')
          },
          {
            id: 'journal',
            label: 'Journal',
            icon: <BookOpen className="w-4 h-4" />,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            onClick: () => handleAction('journal')
          },
          {
            id: 'community',
            label: 'Communauté',
            icon: <Users className="w-4 h-4" />,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
            onClick: () => handleAction('community'),
            badge: '12 en ligne'
          }
        ];
    }
  };

  const handleAction = (actionId: string) => {
    setActiveAction(actionId);
    onActionClick?.(actionId);
    
    // Feedback visuel temporaire
    setTimeout(() => setActiveAction(null), 300);
  };

  const actions = getContextualActions();

  return (
    <Card className={cn(
      "bg-gradient-to-br from-background/95 to-accent/5 backdrop-blur-sm border-border/50",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Actions Rapides
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>

        <div className={cn(
          "grid gap-2 transition-all duration-300",
          isExpanded ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-5"
        )}>
          <AnimatePresence>
            {actions.slice(0, isExpanded ? actions.length : 5).map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <Button
                  variant={action.premium ? "default" : "outline"}
                  size="sm"
                  onClick={action.onClick}
                  className={cn(
                    "w-full h-auto flex-col gap-2 p-3 relative transition-all",
                    action.bgColor,
                    action.color,
                    action.premium && "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white",
                    activeAction === action.id && "scale-95"
                  )}
                >
                  <div className="flex items-center justify-center">
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium leading-tight text-center">
                    {action.label}
                  </span>
                  
                  {action.shortcut && (
                    <Badge 
                      variant="outline" 
                      className="absolute -top-1 -right-1 text-xs px-1 h-4"
                    >
                      {action.shortcut}
                    </Badge>
                  )}
                </Button>

                {action.badge && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs px-2 h-5 bg-primary text-primary-foreground"
                  >
                    {action.badge}
                  </Badge>
                )}

                {action.premium && (
                  <div className="absolute -top-1 -left-1">
                    <div className="w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isExpanded && actions.length > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-3"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-xs text-muted-foreground"
            >
              +{actions.length - 5} actions de plus
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;