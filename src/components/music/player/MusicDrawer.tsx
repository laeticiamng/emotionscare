
import React from 'react';
import {
  Drawer,
  DrawerContent, 
  DrawerClose, 
  DrawerHeader, 
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
// import MusicPlayer from './MusicPlayer';

// Log de diagnostic pour vérifier que tous les composants sont correctement importés
console.log('UI drawer exports check:', {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  Button,
  X
});

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Drawer component that contains the music player
 */
const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  // Don't render anything if not open
  if (!open) return null;
  
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[80vh] focus:outline-none">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Lecteur de musique</DrawerTitle>
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {/* Stub MusicPlayer */}
          {console.log('✅ MusicPlayer stub rendered')}
          <div>MusicPlayer stub OK!</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
