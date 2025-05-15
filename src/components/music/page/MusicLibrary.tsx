
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, Music2 } from 'lucide-react';
import { MusicPlaylist, MusicTrack } from '@/types';
import { useMusic } from '@/contexts/MusicContext';

interface MusicLibraryProps {
  className?: string;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  onSelectTrack?: (track: MusicTrack) => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({
  className = '',
  onSelectPlaylist,
  onSelectTrack
}) => {
  const { playlists, loadPlaylistById, currentTrack, playTrack, isPlaying } = useMusic();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPlaylists, setFilteredPlaylists] = useState<MusicPlaylist[]>([]);
  
  useEffect(() => {
    // Filter playlists based on category
    if (selectedCategory === 'all') {
      setFilteredPlaylists(playlists);
    } else {
      setFilteredPlaylists(playlists.filter(playlist => 
        playlist.category === selectedCategory || 
        playlist.emotion === selectedCategory
      ));
    }
  }, [selectedCategory, playlists]);
  
  const handlePlaylistSelect = async (playlist: MusicPlaylist) => {
    if (onSelectPlaylist) {
      onSelectPlaylist(playlist);
    }
    
    // If first track exists, play it
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };
  
  const handleTrackSelect = (track: MusicTrack) => {
    if (onSelectTrack) {
      onSelectTrack(track);
    }
    playTrack(track);
  };
  
  const getCoverUrl = (playlist: MusicPlaylist) => {
    // Handle the possibility that coverUrl might not exist
    return playlist.coverUrl || '/images/music/default-playlist-cover.jpg';
  };
  
  return (
    <Card className={`w-full ${className}`}>
      <Tabs defaultValue="playlists">
        <TabsList className="w-full">
          <TabsTrigger value="playlists" className="flex-1">Playlists</TabsTrigger>
          <TabsTrigger value="emotions" className="flex-1">Par émotion</TabsTrigger>
          <TabsTrigger value="tracks" className="flex-1">Pistes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="playlists">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {playlists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className="cursor-pointer group"
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-muted/50 mb-2">
                    <img 
                      src={getCoverUrl(playlist)} 
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/music/default-playlist-cover.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm truncate">{playlist.name || playlist.title}</h3>
                  <p className="text-xs text-muted-foreground">{playlist.tracks?.length || 0} pistes</p>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="emotions">
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['calm', 'energetic', 'happy', 'sad', 'focused', 'relaxed'].map(emotion => (
                <Button 
                  key={emotion}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center"
                  onClick={() => setSelectedCategory(emotion)}
                >
                  <div className="text-lg mb-2">
                    {emotion === 'calm' ? '😌' : 
                     emotion === 'energetic' ? '⚡' : 
                     emotion === 'happy' ? '😊' : 
                     emotion === 'sad' ? '😔' : 
                     emotion === 'focused' ? '🧠' : '🧘'}
                  </div>
                  <span className="capitalize">{emotion}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="tracks">
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {playlists.flatMap(playlist => playlist.tracks).map(track => (
                <div 
                  key={track.id}
                  className={`flex items-center p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${
                    currentTrack?.id === track.id ? 'bg-muted/70' : ''
                  }`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="w-10 h-10 bg-muted rounded-md overflow-hidden mr-3 flex-shrink-0">
                    {(track.coverUrl || track.cover_url || track.cover) ? (
                      <img 
                        src={track.coverUrl || track.cover_url || track.cover} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music2 className="text-muted-foreground h-5 w-5" />
                      </div>
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium truncate">{track.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  
                  <div className="ml-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackSelect(track);
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MusicLibrary;
