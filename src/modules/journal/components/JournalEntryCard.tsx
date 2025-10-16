/**
 * JournalEntryCard - Composant d'affichage d'une entrée de journal
 * Day 41 - Module 21: Journal UI Components
 */

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Volume2 } from 'lucide-react';
import type { JournalEntry } from '@/services/journal';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (id: string) => void;
  onPlayAudio?: (audioUrl: string) => void;
  className?: string;
}

/**
 * Carte d'affichage pour une entrée de journal
 */
export const JournalEntryCard = memo<JournalEntryCardProps>(({
  entry,
  onEdit,
  onDelete,
  onPlayAudio,
  className = '',
}) => {
  const handleEdit = () => {
    onEdit?.(entry);
  };

  const handleDelete = () => {
    onDelete?.(entry.id);
  };

  const handlePlayAudio = () => {
    if (entry.emotion_analysis?.audio_url) {
      onPlayAudio?.(entry.emotion_analysis.audio_url);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getToneColor = (tone?: string) => {
    switch (tone) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className={`journal-entry-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">
            {formatDate(entry.created_at)}
          </CardTitle>
          <div className="flex gap-2">
            {entry.emotion_analysis?.audio_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayAudio}
                aria-label="Écouter l'enregistrement"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                aria-label="Modifier l'entrée"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                aria-label="Supprimer l'entrée"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
          {entry.content}
        </p>
        
        {entry.emotion_analysis?.tone && (
          <Badge 
            variant="secondary" 
            className={getToneColor(entry.emotion_analysis.tone)}
          >
            {entry.emotion_analysis.tone === 'positive' && 'Positif'}
            {entry.emotion_analysis.tone === 'negative' && 'Négatif'}
            {entry.emotion_analysis.tone === 'neutral' && 'Neutre'}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
});

JournalEntryCard.displayName = 'JournalEntryCard';

export default JournalEntryCard;
