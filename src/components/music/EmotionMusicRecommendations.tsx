
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MusicPlaylist, MusicTrack, EmotionResult } from '@/types';
import { PlayCircle } from 'lucide-react';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  emotionResult?: EmotionResult;
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  onSelectTrack?: (track: MusicTrack) => void;
  isLoading?: boolean;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion,
  emotionResult,
  playlists = [],
  onSelectPlaylist,
  onSelectTrack,
  isLoading = false
}) => {
  const emotionName = emotion || emotionResult?.emotion || '';

  // Filter playlists matching the emotion
  const filteredPlaylists = playlists.filter(playlist => 
    playlist.emotion?.toLowerCase() === emotionName.toLowerCase()
  );

  // If no specific playlists found, show a subset of all playlists
  const displayPlaylists = filteredPlaylists.length > 0 
    ? filteredPlaylists 
    : playlists.slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Musique recommandée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-8 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (displayPlaylists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Musique recommandée</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucune playlist disponible pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {emotionName 
            ? `Musique pour l'émotion "${emotionName}"`
            : "Musique recommandée"
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayPlaylists.map(playlist => (
            <div 
              key={playlist.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
            >
              <div>
                <h4 className="font-medium">{playlist.name || playlist.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {playlist.tracks.length} morceaux
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onSelectPlaylist && onSelectPlaylist(playlist)}
              >
                <PlayCircle className="h-6 w-6" />
              </Button>
            </div>
          ))}
          
          {displayPlaylists.length < playlists.length && (
            <Button 
              variant="link" 
              className="w-full mt-2"
            >
              Voir toutes les playlists
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
