
import React, { memo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Play, RefreshCw, Loader2 } from 'lucide-react';
import { useOptimizedMusicRecommendation } from '@/hooks/music/useOptimizedMusicRecommendation';
import { EmotionMusicParams } from '@/types/music';

interface OptimizedMusicRecommendationProps {
  emotion: string;
  intensity?: number;
  autoLoad?: boolean;
  preloadEnabled?: boolean;
  className?: string;
}

const OptimizedMusicRecommendation = memo<OptimizedMusicRecommendationProps>(({
  emotion,
  intensity = 0.5,
  autoLoad = false,
  preloadEnabled = true,
  className = ''
}) => {
  const {
    currentPlaylist,
    isLoading,
    error,
    loadRecommendation,
    preloadRecommendation,
    refreshRecommendation,
    cacheStats
  } = useOptimizedMusicRecommendation();

  const params: EmotionMusicParams = { emotion, intensity };

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadRecommendation(params);
    } else if (preloadEnabled) {
      // Preload silently for better UX
      preloadRecommendation(params);
    }
  }, [emotion, intensity, autoLoad, preloadEnabled]);

  const handleLoadPlaylist = useCallback(() => {
    loadRecommendation(params);
  }, [loadRecommendation, params]);

  const handleRefresh = useCallback(() => {
    refreshRecommendation(params);
  }, [refreshRecommendation, params]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Recommandations musicales
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {cacheStats.valid > 0 && (
              <Badge variant="secondary" className="text-xs">
                {cacheStats.valid} en cache
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {isLoading && !currentPlaylist && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Chargement des recommandations...</span>
          </div>
        )}

        {currentPlaylist && (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">{currentPlaylist.name}</h4>
              {currentPlaylist.description && (
                <p className="text-sm text-muted-foreground">{currentPlaylist.description}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{currentPlaylist.tracks?.length || 0} morceaux</span>
              <Badge variant="outline" className="text-xs">
                {emotion}
              </Badge>
            </div>

            {currentPlaylist.tracks && currentPlaylist.tracks.length > 0 && (
              <div className="space-y-1">
                {currentPlaylist.tracks.slice(0, 3).map((track, index) => (
                  <div key={track.id || index} className="flex items-center text-sm">
                    <span className="font-medium truncate">{track.title}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-muted-foreground truncate">{track.artist}</span>
                  </div>
                ))}
                
                {currentPlaylist.tracks.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{currentPlaylist.tracks.length - 3} autres morceaux
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!currentPlaylist && !isLoading && !error && (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">
              Découvrez des morceaux adaptés à votre émotion
            </p>
            <Button onClick={handleLoadPlaylist} className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Charger les recommandations
            </Button>
          </div>
        )}

        {currentPlaylist && (
          <Button onClick={handleLoadPlaylist} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Chargement...' : 'Écouter la playlist'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

OptimizedMusicRecommendation.displayName = 'OptimizedMusicRecommendation';

export default OptimizedMusicRecommendation;
