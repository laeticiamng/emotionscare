/**
 * Carte d'histoire dans la bibliothèque
 * @module story-synth
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Clock, 
  Heart, 
  Star, 
  Play, 
  Trash2, 
  Download,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StoryCardProps {
  story: {
    id: string;
    title?: string;
    theme?: string;
    tone?: string;
    reading_duration_seconds?: number;
    created_at: string;
    completed_at?: string;
    is_favorite?: boolean;
  };
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onExport?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  index?: number;
}

const themeColors: Record<string, string> = {
  calme: 'from-blue-500 to-cyan-500',
  aventure: 'from-orange-500 to-red-500',
  poetique: 'from-purple-500 to-pink-500',
  mysterieux: 'from-slate-600 to-slate-800',
  romance: 'from-rose-400 to-pink-500',
  introspection: 'from-indigo-500 to-purple-500',
  nature: 'from-green-500 to-emerald-500',
};

const themeEmojis: Record<string, string> = {
  calme: '🌊',
  aventure: '⚔️',
  poetique: '🌸',
  mysterieux: '🔮',
  romance: '💕',
  introspection: '🧘',
  nature: '🌲',
};

const toneLabels: Record<string, string> = {
  apaisant: 'Apaisant',
  encourageant: 'Encourageant',
  contemplatif: 'Contemplatif',
  joyeux: 'Joyeux',
  nostalgique: 'Nostalgique',
  esperant: 'Espérant',
};

export const StoryCard = memo(function StoryCard({
  story,
  onRead,
  onDelete,
  onExport,
  onToggleFavorite,
  index = 0,
}: StoryCardProps) {
  const theme = story.theme || 'calme';
  const gradientClass = themeColors[theme] || themeColors.calme;
  const emoji = themeEmojis[theme] || '📖';
  const durationMins = Math.round((story.reading_duration_seconds || 0) / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Gradient header */}
        <div className={cn('h-2 bg-gradient-to-r', gradientClass)} />
        
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  'bg-gradient-to-br shadow-inner',
                  gradientClass
                )}
              >
                {emoji}
              </div>
              <div>
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {story.title || `Histoire ${theme}`}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {theme}
                  </Badge>
                  {story.tone && (
                    <span className="text-xs text-muted-foreground">
                      {toneLabels[story.tone] || story.tone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onToggleFavorite && (
                  <DropdownMenuItem onClick={() => onToggleFavorite(story.id)}>
                    <Heart className={cn('w-4 h-4 mr-2', story.is_favorite && 'fill-current text-red-500')} />
                    {story.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </DropdownMenuItem>
                )}
                {onExport && (
                  <DropdownMenuItem onClick={() => onExport(story.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(story.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(story.created_at), 'd MMM yyyy', { locale: fr })}
              </span>
            </div>
            {durationMins > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{durationMins} min</span>
              </div>
            )}
            {story.completed_at && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                Terminée
              </Badge>
            )}
          </div>

          {/* Actions */}
          <Button
            onClick={() => onRead(story.id)}
            className="w-full gap-2"
            size="sm"
          >
            <Play className="w-4 h-4" />
            {story.completed_at ? 'Relire' : 'Continuer'}
          </Button>
        </div>

        {/* Favorite indicator */}
        {story.is_favorite && (
          <div className="absolute top-4 right-4">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </div>
        )}
      </Card>
    </motion.div>
  );
});

export default StoryCard;
