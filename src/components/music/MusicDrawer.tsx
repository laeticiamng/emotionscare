
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { MusicDrawerProps, MusicTrack } from '@/types';
import TrackList from './TrackList';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  isOpen,
  open,
  onOpenChange,
  onClose,
  playlist,
  currentTrack
}) => {
  // Use either isOpen or open prop
  const isDrawerOpen = isOpen || open;
  
  const handleSelectTrack = (track: MusicTrack) => {
    console.log("Selected track:", track.title);
    // In a real implementation, this would dispatch to a music context
  };
  
  return (
    <Drawer open={isDrawerOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Music Player</DrawerTitle>
          <DrawerDescription>
            {playlist ? `Playing from ${playlist.name}` : 'Current track'}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4">
          {currentTrack ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden mb-4">
                {currentTrack.coverUrl || currentTrack.cover ? (
                  <img 
                    src={currentTrack.coverUrl || currentTrack.cover} 
                    alt={currentTrack.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    ♪
                  </div>
                )}
              </div>
              
              <div className="text-center mb-6">
                <h3 className="font-medium">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No track currently playing
            </div>
          )}
          
          {playlist && playlist.tracks && playlist.tracks.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Playlist: {playlist.name}</h4>
              <TrackList 
                tracks={playlist.tracks}
                currentTrack={currentTrack || playlist.tracks[0]}
                onSelect={handleSelectTrack}
              />
            </div>
          )}
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
