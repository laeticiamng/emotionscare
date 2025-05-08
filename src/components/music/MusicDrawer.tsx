
import React from 'react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MusicPlayer from './MusicPlayer';

const MusicDrawer = () => {
  return (
    <Drawer>
      <DrawerContent>
        <div className="p-4 max-w-md mx-auto">
          <MusicPlayer />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
