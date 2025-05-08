
import React, { useState } from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import MusicPlayer from './MusicPlayer';
import { useDrawerState } from '@/hooks/useDrawerState';

const MusicDrawer = () => {
  // We'll use the basic component structure for now, with no trigger
  // The drawer will be controlled from outside
  
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
