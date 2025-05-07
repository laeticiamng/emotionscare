
import React from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import MusicPlayer from './MusicPlayer';

const MusicDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, currentTrack } = useMusic();
  
  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>Lecteur musical</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 py-2 pb-8">
            <MusicPlayer />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
