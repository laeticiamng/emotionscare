
import React from 'react';

// Code de diagnostic pour identifier les modules undefined
;(async () => {
  console.log('🔍 ui/drawer →', await import('@/components/ui/drawer'))
  console.log('🔍 ui/button →', await import('@/components/ui/button'))
  console.log('🔍 lucide-react X →', (await import('lucide-react')).X)
  console.log('🔍 MusicPlayer →', await import('./MusicPlayer'))
})();

import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[80vh] focus:outline-none">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Lecteur de musique</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
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
