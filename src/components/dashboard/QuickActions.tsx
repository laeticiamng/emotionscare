// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Monitor, 
  BookOpen, 
  Headphones, 
  Gamepad2,
  Brain,
  Star,
  Clock,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { useUserMode } from '@/contexts/UserModeContext';
import { logger } from '@/lib/logger';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STORAGE_KEY = 'emotionscare_quick_actions';

interface ActionStats {
  usageCount: number;
  lastUsed: string | null;
  isFavorite: boolean;
}

const QUICK_ACTIONS = [
  {
    key: 'flash_glow',
    icon: Zap,
    title: 'Flash Glow',
    subtitle: '60 secondes d\'énergie',
    path: 'flash-glow',
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
    duration: '1 min'
  },
  {
    key: 'screen_silk',
    icon: Monitor,
    title: 'Screen-Silk',
    subtitle: 'Micro-pause 90s',
    path: 'screen-silk',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
    duration: '1.5 min'
  },
  {
    key: 'journal',
    icon: BookOpen,
    title: 'Journal',
    subtitle: 'Écrire une note',
    path: 'journal',
    color: 'bg-accent/10 text-accent hover:bg-accent/20',
    duration: '5 min'
  },
  {
    key: 'music',
    icon: Headphones,
    title: 'Musicothérapie',
    subtitle: 'Session adaptée',
    path: 'music',
    color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    duration: '10 min'
  },
  {
    key: 'boss_grit',
    icon: Gamepad2,
    title: 'Boss Grit',
    subtitle: 'Défi motivation',
    path: 'boss-grit',
    color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    duration: '5 min'
  },
  {
    key: 'vr_breath',
    icon: Brain,
    title: 'VR Respiration',
    subtitle: 'Immersion calme',
    path: 'vr-breath',
    color: 'bg-success/10 text-success hover:bg-success/20',
    duration: '10 min'
  }
];

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { userMode } = useUserMode();
  const [actionStats, setActionStats] = useState<Record<string, ActionStats>>({});
  const [showAll, setShowAll] = useState(false);

  // Load stats from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setActionStats(JSON.parse(stored));
      } catch (e) {
        // Invalid data, start fresh
      }
    }
  }, []);

  // Save stats to localStorage
  const saveStats = (stats: Record<string, ActionStats>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    setActionStats(stats);
  };

  const getFormattedPath = (path: string) => `/app/${path}`;

  const handleAction = (action: typeof QUICK_ACTIONS[0]) => {
    const fullPath = getFormattedPath(action.path);
    
    // Update stats
    const currentStats = actionStats[action.key] || { usageCount: 0, lastUsed: null, isFavorite: false };
    const newStats = {
      ...actionStats,
      [action.key]: {
        ...currentStats,
        usageCount: currentStats.usageCount + 1,
        lastUsed: new Date().toISOString(),
      }
    };
    saveStats(newStats);
    
    router.push(fullPath);
    logger.info('Quick action clicked:', { path: action.path });
  };

  const toggleFavorite = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStats = actionStats[key] || { usageCount: 0, lastUsed: null, isFavorite: false };
    const newStats = {
      ...actionStats,
      [key]: {
        ...currentStats,
        isFavorite: !currentStats.isFavorite,
      }
    };
    saveStats(newStats);
  };

  // Sort actions: favorites first, then by usage
  const sortedActions = [...QUICK_ACTIONS].sort((a, b) => {
    const aStats = actionStats[a.key] || { usageCount: 0, isFavorite: false };
    const bStats = actionStats[b.key] || { usageCount: 0, isFavorite: false };
    
    if (aStats.isFavorite !== bStats.isFavorite) {
      return bStats.isFavorite ? 1 : -1;
    }
    return bStats.usageCount - aStats.usageCount;
  });

  const displayedActions = showAll ? sortedActions : sortedActions.slice(0, 4);
  const totalUsage = Object.values(actionStats).reduce((sum, s) => sum + s.usageCount, 0);
  const favoriteCount = Object.values(actionStats).filter(s => s.isFavorite).length;

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Actions rapides
              {totalUsage > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {totalUsage} utilisations
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {favoriteCount > 0 && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  {favoriteCount}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Moins' : 'Tout voir'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {displayedActions.map((action, index) => {
              const Icon = action.icon;
              const stats = actionStats[action.key] || { usageCount: 0, lastUsed: null, isFavorite: false };
              
              return (
                <motion.div
                  key={action.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`h-auto p-4 justify-start w-full ${action.color} border border-transparent hover:border-current/20 relative group`}
                        onClick={() => handleAction(action)}
                        aria-label={`Lancer ${action.title} ${action.subtitle}`}
                      >
                        {/* Favorite indicator */}
                        {stats.isFavorite && (
                          <Star className="absolute top-2 right-2 w-3 h-3 fill-yellow-500 text-yellow-500" />
                        )}
                        
                        <div className="flex items-center gap-3 w-full">
                          <div className="relative">
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {stats.usageCount > 0 && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                                {stats.usageCount > 99 ? '99+' : stats.usageCount}
                              </div>
                            )}
                          </div>
                          <div className="text-left min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">
                              {action.title}
                            </div>
                            <div className="text-xs opacity-80 truncate flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {action.duration}
                            </div>
                          </div>
                        </div>

                        {/* Quick menu on hover */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div 
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => toggleFavorite(action.key, e as any)}>
                              <Star className={`h-4 w-4 mr-2 ${stats.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                              {stats.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="text-xs">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-muted-foreground">{action.subtitle}</p>
                        {stats.lastUsed && (
                          <p className="text-muted-foreground mt-1">
                            Dernier: {new Date(stats.lastUsed).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </div>

          {/* Recent activity */}
          {totalUsage > 0 && (
            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {sortedActions[0] && actionStats[sortedActions[0].key]?.usageCount > 0 && (
                  <span>
                    Plus utilisé: <strong>{sortedActions[0].title}</strong>
                  </span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
