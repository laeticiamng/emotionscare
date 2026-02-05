/**
 * EmotionalJournalTimeline - Liste chronologique des entrées du journal émotionnel
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Heart, Trash2, Calendar, 
  ChevronDown, ChevronUp 
} from 'lucide-react';
import { getEmotionalById, EmotionalType } from './EmotionalJournalSelector';
import { cn } from '@/lib/utils';

export interface EmotionalJournalEntry {
  id: string;
  user_id: string;
  emotion: EmotionalType | null;
  intensity: number | null;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string | null;
  is_favorite: boolean | null;
}

interface EmotionalJournalTimelineProps {
  entries: EmotionalJournalEntry[];
  isLoading?: boolean;
  onDelete?: (entryId: string) => void;
  onToggleFavorite?: (entryId: string, isFavorite: boolean) => void;
}

const TAG_LABELS: Record<string, { label: string; emoji: string }> = {
  work: { label: 'Travail', emoji: '💼' },
  family: { label: 'Famille', emoji: '👨‍👩‍👧' },
  health: { label: 'Santé', emoji: '🏥' },
  relationships: { label: 'Relations', emoji: '❤️' },
  sleep: { label: 'Sommeil', emoji: '😴' },
  sport: { label: 'Sport', emoji: '🏃' },
  money: { label: 'Finances', emoji: '💰' },
  leisure: { label: 'Loisirs', emoji: '🎮' },
};

export const EmotionalJournalTimeline: React.FC<EmotionalJournalTimelineProps> = ({
  entries,
  isLoading = false,
  onDelete,
  onToggleFavorite,
}) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-semibold text-lg mb-1">Aucune entrée</h3>
          <p className="text-muted-foreground text-sm">
            Commence à écrire pour voir ton historique ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {entries.map((entry, index) => {
          const emotion = getEmotionalById(entry.emotion as EmotionalType);
          const isExpanded = expandedId === entry.id;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                'transition-all',
                entry.is_favorite && 'border-primary/50 bg-primary/5'
              )}>
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Emotion */}
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">{emotion?.emoji || '😐'}</span>
                        <span className="text-xs text-muted-foreground">
                          {entry.intensity}/10
                        </span>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-sm font-medium">
                          {emotion?.label || 'Émotion'}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {onToggleFavorite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onToggleFavorite(entry.id, !entry.is_favorite)}
                        >
                          <Heart 
                            className={cn(
                              'h-4 w-4',
                              entry.is_favorite && 'fill-red-500 text-red-500'
                            )} 
                          />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {isExpanded ? entry.content : truncateText(entry.content)}
                    </p>
                    {entry.content.length > 150 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-6 px-2 text-xs"
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Réduire
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Lire plus
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag) => {
                        const tagInfo = TAG_LABELS[tag];
                        return (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs py-0"
                          >
                            {tagInfo?.emoji} {tagInfo?.label || tag}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default EmotionalJournalTimeline;
