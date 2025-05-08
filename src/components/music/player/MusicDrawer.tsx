
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Music, ListMusic, Heart, MoreHorizontal } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MusicPlayer from './MusicPlayer';
import { MusicTrack } from '@/types/music';

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const { currentPlaylist, playTrack, currentTrack } = useMusic();
  const [activeTab, setActiveTab] = useState<string>('player');

  // Marquer la piste comme favorite (pour démonstration)
  const handleFavorite = (track: MusicTrack) => {
    console.log('Track favorited:', track.title);
    // Implémenter la fonctionnalité pour marquer comme favoris
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[80vh] focus:outline-none">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Lecteur de musique</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="px-4 pb-4">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="player" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Lecteur
            </TabsTrigger>
            <TabsTrigger value="playlist" className="flex items-center gap-2">
              <ListMusic className="h-4 w-4" />
              Playlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="focus:outline-none">
            <MusicPlayer />
          </TabsContent>

          <TabsContent value="playlist" className="focus:outline-none">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">
                {currentPlaylist?.name || "Playlist actuelle"}
              </h3>
              
              <div className="space-y-2 max-h-[50vh] overflow-auto pr-2">
                {currentPlaylist?.tracks.map((track) => (
                  <div 
                    key={track.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      currentTrack?.id === track.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-accent'
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                        {track.coverUrl ? (
                          <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                        ) : (
                          <Music className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium leading-none">{track.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{track.artist}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavorite(track);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {!currentPlaylist?.tracks.length && (
                  <div className="text-center p-6 text-muted-foreground">
                    Aucun morceau disponible dans cette playlist
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
