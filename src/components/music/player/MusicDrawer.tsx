
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
import { MusicDrawerProps, MusicTrack } from '@/types/types';

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
              <div className="max-h-[200px] overflow-y-auto">
                {playlist.tracks.map((track) => (
                  <div 
                    key={track.id}
                    className={`flex items-center p-2 rounded ${
                      currentTrack?.id === track.id ? 'bg-secondary/50' : 'hover:bg-muted/50'
                    } cursor-pointer mb-1`}
                  >
                    <div className="w-8 h-8 bg-muted/50 rounded overflow-hidden mr-3">
                      {(track.coverUrl || track.cover) && (
                        <img 
                          src={track.coverUrl || track.cover} 
                          alt={track.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{track.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                    </div>
                  </div>
                ))}
              </div>
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
