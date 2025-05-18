
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MusicDrawerProps, MusicTrack } from '@/types/music';
import { useMusic } from '@/contexts/music';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  open,
  onClose,
  onOpenChange,
  playlist,
  currentTrack: propCurrentTrack,
  children
}) => {
  const { currentTrack: contextCurrentTrack, playTrack } = useMusic();
  
  // Use provided track or get from context
  const displayTrack = propCurrentTrack || contextCurrentTrack;
  
  // Get tracks to display from playlist or recommendations
  const tracksToDisplay = playlist?.tracks || [];
  
  const handleTrackSelect = (track: MusicTrack) => {
    playTrack(track);
  };
  
  return (
    <Drawer 
      open={open} 
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <DrawerContent className="max-h-[80vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex justify-between items-center">
              <span>{playlist?.name || 'Music Player'}</span>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>
            <DrawerDescription>
              {playlist?.description || `${tracksToDisplay.length} tracks available`}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4">
            {children}
            
            {!children && (
              <div className="space-y-4">
                {displayTrack && (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium">{displayTrack.title}</h3>
                    <p className="text-sm text-muted-foreground">{displayTrack.artist}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <h3 className="font-medium">Tracks</h3>
                  {tracksToDisplay.map((track) => (
                    <div 
                      key={track.id}
                      className={`p-3 rounded-md cursor-pointer ${track.id === displayTrack?.id ? 'bg-accent' : 'hover:bg-muted'}`}
                      onClick={() => handleTrackSelect(track)}
                    >
                      <div className="font-medium">{track.title}</div>
                      <div className="text-sm text-muted-foreground">{track.artist}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DrawerFooter>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
