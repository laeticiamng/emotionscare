import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic, FileText } from 'lucide-react';
import { JournalEntry, MoodBucket } from '@/store/journal.store';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EntryCardProps {
  entry: JournalEntry;
}

const moodLabels: Record<MoodBucket, string> = {
  clear: 'Lucide',
  mixed: 'Nuancé',
  pressured: 'Sous pression',
};

const moodColors: Record<MoodBucket, string> = {
  clear: 'text-green-600 bg-green-50',
  mixed: 'text-yellow-600 bg-yellow-50',
  pressured: 'text-red-600 bg-red-50',
};

export const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePlayPause = () => {
    if (!entry.media_url) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = entry.media_url;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);

      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
    }
  };

  const excerpt = entry.summary ? 
    (entry.summary.length > 150 ? entry.summary.substring(0, 150) + '...' : entry.summary) :
    '';

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full", moodColors[entry.mood_bucket])}>
                {entry.mode === 'voice' ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {moodLabels[entry.mood_bucket]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {entry.mode === 'voice' ? 'Voix' : 'Texte'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(entry.created_at)}
                </div>
              </div>
            </div>

            {/* Play button for voice entries */}
            {entry.mode === 'voice' && entry.media_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlayPause}
                aria-label={isPlaying ? "Mettre en pause" : "Lire l'enregistrement"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Content */}
          {excerpt && (
            <div className="text-sm text-gray-700 leading-relaxed">
              {excerpt}
            </div>
          )}

          {/* Suggestion */}
          {entry.suggestion && (
            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
              💡 {entry.suggestion}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};