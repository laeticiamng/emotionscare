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

const QUICK_ACTIONS = [
  {
    key: 'flash_glow',
    icon: Zap,
    title: 'Flash Glow',
    subtitle: '60 secondes d\'énergie',
    path: 'flash-glow',
    color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
  },
  {
    key: 'screen_silk',
    icon: Monitor,
    title: 'Screen-Silk',
    subtitle: 'Micro-pause 90s',
    path: 'screen-silk',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  },
  {
    key: 'journal',
    icon: BookOpen,
    title: 'Journal',
    subtitle: 'Écrire une note',
    path: 'journal',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  },
  {
    key: 'music',
    icon: Headphones,
    title: 'Musicothérapie',
    subtitle: 'Session adaptée',
    path: 'music',
    color: 'bg-pink-100 text-pink-700 hover:bg-pink-200'
  },
  {
    key: 'boss_grit',
    icon: Gamepad2,
    title: 'Boss Grit',
    subtitle: 'Défi motivation',
    path: 'boss-grit',
    color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
  },
  {
    key: 'vr_breath',
    icon: Brain,
    title: 'VR Respiration',
    subtitle: 'Immersion calme',
    path: 'vr-breath',
    color: 'bg-green-100 text-green-700 hover:bg-green-200'
  }
];

/**
 * Actions rapides vers les modules clés
 */
export const QuickActions: React.FC = () => {
  const router = useRouter();
  const { userMode } = useUserMode();

  const getFormattedPath = (path: string) => {
    if (userMode === 'b2b_user') return `/b2b/user/${path}`;
    if (userMode === 'b2b_admin') return `/b2b/admin/${path}`;
    return `/b2c/${path}`;
  };

  const handleAction = (path: string) => {
    const fullPath = getFormattedPath(path);
    router.push(fullPath);
    
    // Analytics tracking would go here
    console.log('Quick action clicked:', path);
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