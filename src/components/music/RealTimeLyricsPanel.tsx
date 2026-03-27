// @ts-nocheck
/**
 * RealTimeLyricsPanel - Paroles synchronisées en temps réel
 * Intégration de MusicLyricsSynchronized avec le player
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Wand2, Loader2, RefreshCw, Mic2 } from 'lucide-react';
import { MusicLyricsSynchronized, type LRCData } from '@/components/music/MusicLyricsSynchronized';
import { useSyncedLyrics } from '@/hooks/music/useSyncedLyrics';
import { cn } from '@/lib/utils';

interface RealTimeLyricsPanelProps {
  trackTitle?: string;
  trackMood?: string;
  currentTime: number; // seconds
  onSeek?: (time: number) => void;
  className?: string;
}

export const RealTimeLyricsPanel: React.FC<RealTimeLyricsPanelProps> = ({
  trackTitle,
  trackMood,
  currentTime,
  onSeek,
  className,
}) => {
  const { lrcData, isLoading, error, fetchLyrics } = useSyncedLyrics({
    trackTitle,
    autoFetch: false,
  });
  
  const [karaokeMode, setKaraokeMode] = useState(false);

  const handleGenerate = useCallback(() => {
    const prompt = trackMood 
      ? `${trackTitle || 'Therapeutic music'} - ${trackMood} mood` 
      : trackTitle || 'Therapeutic healing music';
    fetchLyrics(prompt);
  }, [fetchLyrics, trackTitle, trackMood]);

  const handleLineClick = useCallback((time: number) => {
    onSeek?.(time);
  }, [onSeek]);

  return (
    <Card className={cn('border-primary/20 overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mic2 className="h-5 w-5 text-primary" />
            Paroles synchronisées
          </CardTitle>
          <div className="flex items-center gap-2">
            {lrcData && (
              <Button
                size="sm"
                variant={karaokeMode ? 'default' : 'outline'}
                onClick={() => setKaraokeMode(!karaokeMode)}
                className="gap-1 text-xs"
              >
                🎤 Karaoké
              </Button>
            )}
            {lrcData && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleGenerate}
                disabled={isLoading}
                className="gap-1"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              </Button>
            )}
          </div>
        </div>
        {trackTitle && (
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {trackTitle}
            </Badge>
            {trackMood && (
              <Badge variant="outline" className="text-xs">
                {trackMood}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* État initial - pas de paroles */}
        {!lrcData && !isLoading && !error && (
          <div className="text-center py-8 space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Générez des paroles synchronisées pour accompagner votre musique
              </p>
              <Button onClick={handleGenerate} className="gap-2">
                <Wand2 className="h-4 w-4" />
                Générer des paroles
              </Button>
            </div>
          </div>
        )}

        {/* Chargement */}
        {isLoading && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Création des paroles en cours...
              </span>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && !isLoading && (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={handleGenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        )}

        {/* Paroles synchronisées */}
        {lrcData && !isLoading && (
          <div className="h-[300px]">
            <MusicLyricsSynchronized
              lyrics={lrcData}
              currentTime={currentTime}
              onLineClick={handleLineClick}
              karaokeMode={karaokeMode}
              autoScroll={true}
              fontSize="md"
              highlightColor="hsl(var(--primary))"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeLyricsPanel;
