
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { mockMusicPlaylists, mockMusicTracks } from '@/mocks/musicTracks';

const B2CMusic: React.FC = () => {
  const { currentPlaylist, playerState, setCurrentPlaylist, playTrack, pauseTrack } = useMusic();
  const [selectedPlaylist, setSelectedPlaylist] = useState(mockMusicPlaylists[0]);

  const handlePlayPlaylist = (playlist: any) => {
    setCurrentPlaylist(playlist);
    setSelectedPlaylist(playlist);
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const handlePlayTrack = (track: any) => {
    playTrack(track);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Music className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
          <p className="text-muted-foreground">Découvrez des playlists adaptées à vos émotions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlists */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Playlists Recommandées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMusicPlaylists.map((playlist) => (
              <Card key={playlist.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{playlist.name}</span>
                    <Button
                      size="sm"
                      onClick={() => handlePlayPlaylist(playlist)}
                      variant={currentPlaylist?.id === playlist.id ? "default" : "outline"}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {playlist.tracks?.length || 0} morceaux
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Player actuel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Lecteur Musical</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {playerState.currentTrack ? (
                <div>
                  <h3 className="font-medium">{playerState.currentTrack.title}</h3>
                  <p className="text-sm text-muted-foreground">{playerState.currentTrack.artist}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button variant="ghost" size="icon">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={playerState.isPlaying ? pauseTrack : () => handlePlayTrack(playerState.currentTrack)}
                      size="icon"
                    >
                      {playerState.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Volume2 className="h-4 w-4" />
                    <div className="flex-1 bg-secondary h-1 rounded">
                      <div 
                        className="bg-primary h-1 rounded transition-all"
                        style={{ width: `${playerState.volume * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Sélectionnez une playlist pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Liste des morceaux de la playlist sélectionnée */}
          {selectedPlaylist && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">{selectedPlaylist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedPlaylist.tracks?.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-secondary/50 ${
                        playerState.currentTrack?.id === track.id ? 'bg-secondary' : ''
                      }`}
                      onClick={() => handlePlayTrack(track)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.artist}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(track.duration)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track);
                          }}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-sm">Aucun morceau disponible</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2CMusic;
