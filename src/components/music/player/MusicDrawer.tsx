
import React from 'react';
import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  // Ajout d'une vérification préventive des propriétés
  console.log('MusicDrawer rendered with:', { open, onClose: !!onClose });
  
  if (!open) return null;

  // Important: utiliser une fonction de callback pour onOpenChange
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[80vh] focus:outline-none">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Lecteur de musique</DrawerTitle>
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              type="button" // Ajout explicite du type
            >
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <MusicPlayer />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
