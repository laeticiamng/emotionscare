
import React from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import MusicPlayer from './MusicPlayer';
import { useDrawerState } from '@/hooks/useDrawerState';

interface MusicDrawerProps {
  // Add props if needed
}

const MusicDrawer: React.FC<MusicDrawerProps> = () => {
  const { isDrawerOpen, closeDrawer } = useDrawerState();
  
  // Debug logs to help identify the issue
  console.log("MusicDrawer rendering");
  console.log("MusicPlayer component:", MusicPlayer);
  console.log("Drawer state:", { isDrawerOpen });
  
  return (
    <Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerContent>
        <div className="p-4 max-w-md mx-auto">
          <MusicPlayer />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
