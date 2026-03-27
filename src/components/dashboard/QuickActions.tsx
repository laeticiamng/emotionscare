// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Monitor,
  BookOpen,
  Brain,
  Clock
} from 'lucide-react';
import { useRouter } from '@/hooks/router';
import { motion } from 'framer-motion';

const QUICK_ACTIONS = [
  {
    key: 'flash_glow',
    icon: Zap,
    title: 'Flash Glow',
    subtitle: '1 min',
    path: 'flash-glow',
    color: 'bg-warning/10 text-warning hover:bg-warning/20',
  },
  {
    key: 'screen_silk',
    icon: Monitor,
    title: 'Screen-Silk',
    subtitle: '1.5 min',
    path: 'screen-silk',
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    key: 'journal',
    icon: BookOpen,
    title: 'Journal',
    subtitle: '5 min',
    path: 'journal',
    color: 'bg-accent/10 text-accent hover:bg-accent/20',
  },
  {
    key: 'vr_breath',
    icon: Brain,
    title: 'Respiration',
    subtitle: '10 min',
    path: 'vr-breath',
    color: 'bg-success/10 text-success hover:bg-success/20',
  }
];

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const handleAction = (path: string) => {
    router.push(`/app/${path}`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className={`h-auto p-4 justify-start w-full ${action.color} border border-transparent hover:border-current/20`}
                  onClick={() => handleAction(action.path)}
                  aria-label={`Lancer ${action.title}`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium text-sm truncate">
                        {action.title}
                      </div>
                      <div className="text-xs opacity-80 truncate flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {action.subtitle}
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
