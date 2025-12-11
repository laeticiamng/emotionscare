/**
 * JournalEntryCard - Composant d'affichage d'une entrée de journal
 * Day 41 - Module 21: Journal UI Components
 */

import { memo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Edit2, Volume2, Heart, Share2, Calendar, Clock, Smile, Meh, Frown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { JournalEntry } from '@/services/journal';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (id: string) => void;
  onPlayAudio?: (audioUrl: string) => void;
  onFavorite?: (id: string, isFavorite: boolean) => void;
  className?: string;
}

/**
 * Carte d'affichage enrichie pour une entrée de journal
 */
export const JournalEntryCard = memo<JournalEntryCardProps>(({
  entry,
  onEdit,
  onDelete,
  onPlayAudio,
  onFavorite,
  className = '',
}) => {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('journal_favorites') || '[]');
    return favorites.includes(entry.id);
  });
  const [isSharing, setIsSharing] = useState(false);

  const handleEdit = useCallback(() => {
    onEdit?.(entry);
  }, [onEdit, entry]);

  const handleDelete = useCallback(() => {
    onDelete?.(entry.id);
  }, [onDelete, entry.id]);

  const handlePlayAudio = useCallback(() => {
    if (entry.emotion_analysis?.audio_url) {
      onPlayAudio?.(entry.emotion_analysis.audio_url);
    }
  }, [entry.emotion_analysis?.audio_url, onPlayAudio]);

  const handleFavorite = useCallback(() => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    
    const favorites = JSON.parse(localStorage.getItem('journal_favorites') || '[]');
    if (newState) {
      favorites.push(entry.id);
    } else {
      const index = favorites.indexOf(entry.id);
      if (index > -1) favorites.splice(index, 1);
    }
    localStorage.setItem('journal_favorites', JSON.stringify(favorites));
    
    onFavorite?.(entry.id, newState);
    toast({
      title: newState ? 'Ajouté aux favoris' : 'Retiré des favoris',
      duration: 2000,
    });
  }, [isFavorite, entry.id, onFavorite, toast]);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mon journal émotionnel',
          text: entry.content.slice(0, 200) + (entry.content.length > 200 ? '...' : ''),
        });
      } else {
        await navigator.clipboard.writeText(entry.content);
        toast({
          title: 'Copié dans le presse-papier',
          description: 'Le contenu a été copié.',
          duration: 2000,
        });
      }
    } catch {
      // User cancelled share
    } finally {
      setIsSharing(false);
    }
  }, [entry.content, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getToneIcon = (tone?: string) => {
    switch (tone) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getToneColor = (tone?: string) => {
    switch (tone) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getToneLabel = (tone?: string) => {
    switch (tone) {
      case 'positive':
        return 'Positif';
      case 'negative':
        return 'Négatif';
      default:
        return 'Neutre';
    }
  };

  const wordCount = entry.content.split(/\s+/).filter(Boolean).length;

  return (
    <Card className={`journal-entry-card group hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {formatDate(entry.created_at)}
            </CardTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatTime(entry.created_at)}
              </span>
              <span>{wordCount} mots</span>
            </div>
          </div>
          <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavorite}
                  aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  className={isFavorite ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  disabled={isSharing}
                  aria-label="Partager"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager</TooltipContent>
            </Tooltip>
            {entry.emotion_analysis?.audio_url && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayAudio}
                    aria-label="Écouter l'enregistrement"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Écouter</TooltipContent>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    aria-label="Modifier l'entrée"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Modifier</TooltipContent>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    aria-label="Supprimer l'entrée"
                    className="hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed line-clamp-4">
          {entry.content}
        </p>
        
        {entry.emotion_analysis?.tone && (
          <div className="flex items-center gap-2 pt-2">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1.5 ${getToneColor(entry.emotion_analysis.tone)}`}
            >
              {getToneIcon(entry.emotion_analysis.tone)}
              {getToneLabel(entry.emotion_analysis.tone)}
            </Badge>
            {entry.emotion_analysis.confidence && (
              <span className="text-xs text-muted-foreground">
                {Math.round(entry.emotion_analysis.confidence * 100)}% confiance
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

JournalEntryCard.displayName = 'JournalEntryCard';

export default JournalEntryCard;
