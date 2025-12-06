import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Monitor, 
  Headphones, 
  BookOpen, 
  Gamepad2,
  Play,
  RotateCcw,
  MoreHorizontal
} from 'lucide-react';
import { ActivityItem } from '@/store/activity.store';
import { useRouter } from '@/hooks/router';

interface ActivityItemCardProps {
  item: ActivityItem;
}

// Icônes par module
const MODULE_ICONS = {
  boss_grit: Gamepad2,
  flash_glow: Zap,
  screen_silk: Monitor,
  vr_breath: Brain,
  journal: BookOpen,
  music_therapy: Headphones,
  scan: Brain,
  gamification: Gamepad2
};

// Couleurs par famille de modules
const MODULE_COLORS = {
  boss_grit: 'bg-orange-100 text-orange-700',
  flash_glow: 'bg-yellow-100 text-yellow-700',
  screen_silk: 'bg-blue-100 text-blue-700',
  vr_breath: 'bg-green-100 text-green-700',
  journal: 'bg-purple-100 text-purple-700',
  music_therapy: 'bg-pink-100 text-pink-700',
  scan: 'bg-teal-100 text-teal-700',
  gamification: 'bg-indigo-100 text-indigo-700'
};

export const ActivityItemCard: React.FC<ActivityItemCardProps> = ({ item }) => {
  const router = useRouter();
  const IconComponent = MODULE_ICONS[item.module as keyof typeof MODULE_ICONS] || Brain;
  const colorClass = MODULE_COLORS[item.module as keyof typeof MODULE_COLORS] || 'bg-gray-100 text-gray-700';

  const handleAction = (deeplink: string) => {
    router.push(deeplink);
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && item.actions?.resume_deeplink) {
          handleAction(item.actions.resume_deeplink);
        } else if (e.key === 'r' && item.actions?.replay_deeplink) {
          handleAction(item.actions.replay_deeplink);
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icône module */}
          <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-sm">
                  {item.title}
                </h3>
                {item.label && (
                  <p className="text-xs text-muted-foreground">
                    {item.label}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTime(item.date)}
              </span>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs px-1.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {item.actions?.resume_deeplink && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(item.actions.resume_deeplink!)}
                  className="text-xs h-7"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Reprendre
                </Button>
              )}
              
              {item.actions?.replay_deeplink && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(item.actions.replay_deeplink!)}
                  className="text-xs h-7"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Rejouer
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 ml-auto"
              >
                <MoreHorizontal className="w-3 h-3" />
                <span className="sr-only">Plus d'options</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};