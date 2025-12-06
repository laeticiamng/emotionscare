// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Monitor, 
  BookOpen, 
  Headphones, 
  Gamepad2,
  Brain 
} from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { useUserMode } from '@/contexts/UserModeContext';
import { logger } from '@/lib/logger';

const QUICK_ACTIONS = [
  {
    key: 'flash_glow',
    icon: Zap,
    title: 'Flash Glow',
    subtitle: '60 secondes d\'énergie',
    path: 'flash-glow',
    color: 'bg-warning/10 text-warning hover:bg-warning/20'
  },
  {
    key: 'screen_silk',
    icon: Monitor,
    title: 'Screen-Silk',
    subtitle: 'Micro-pause 90s',
    path: 'screen-silk',
    color: 'bg-primary/10 text-primary hover:bg-primary/20'
  },
  {
    key: 'journal',
    icon: BookOpen,
    title: 'Journal',
    subtitle: 'Écrire une note',
    path: 'journal',
    color: 'bg-accent/10 text-accent hover:bg-accent/20'
  },
  {
    key: 'music',
    icon: Headphones,
    title: 'Musicothérapie',
    subtitle: 'Session adaptée',
    path: 'music',
    color: 'bg-accent/10 text-accent hover:bg-accent/20'
  },
  {
    key: 'boss_grit',
    icon: Gamepad2,
    title: 'Boss Grit',
    subtitle: 'Défi motivation',
    path: 'boss-grit',
    color: 'bg-warning/10 text-warning hover:bg-warning/20'
  },
  {
    key: 'vr_breath',
    icon: Brain,
    title: 'VR Respiration',
    subtitle: 'Immersion calme',
    path: 'vr-breath',
    color: 'bg-success/10 text-success hover:bg-success/20'
  }
];

/**
 * Actions rapides vers les modules clés
 */
export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { userMode } = useUserMode();

  const getFormattedPath = (path: string) => {
    // Utiliser les routes canoniques
    return `/app/${path}`;
  };

  const handleAction = (path: string) => {
    const fullPath = getFormattedPath(path);
    router.push(fullPath);
    
    // Analytics tracking would go here
    logger.info('Quick action clicked:', { path });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.key}
                variant="ghost"
                className={`h-auto p-4 justify-start ${action.color} border border-transparent hover:border-current/20`}
                onClick={() => handleAction(action.path)}
                aria-label={`Lancer ${action.title} ${action.subtitle}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">
                      {action.title}
                    </div>
                    <div className="text-xs opacity-80 truncate">
                      {action.subtitle}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};