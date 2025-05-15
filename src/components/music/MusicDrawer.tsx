
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { MusicDrawerProps, MusicTrack } from '@/types';
import TrackList from './TrackList';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  isOpen = false,
  open = false,
  onOpenChange,
  onClose,
  playlist,
  currentTrack,
}) => {
  // Use either isOpen or open, depending on what's provided
  const isDrawerOpen = isOpen || open;
  
  // Handle drawer close
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Handle track selection
  const handleSelectTrack = (track: MusicTrack) => {
    // Implementation would depend on other aspects of the application
    console.log('Selected track:', track);
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onOpenChange || onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {playlist?.name || "Playlist"}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {playlist && playlist.tracks && (
            <TrackList 
              tracks={playlist.tracks}
              currentTrack={currentTrack}
              onSelectTrack={handleSelectTrack}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
