
import React from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import MusicPlayer from './MusicPlayer';
import { useDrawerState } from '@/hooks/useDrawerState';

const MusicDrawer = () => {
  const { isDrawerOpen } = useDrawerState();
  
  return (
    <Drawer open={isDrawerOpen}>
      <DrawerContent>
        <div className="p-4 max-w-md mx-auto">
          <MusicPlayer />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
