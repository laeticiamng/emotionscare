
import React from 'react';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import MusicPlayer from './MusicPlayer';
import { useDrawerState } from '@/hooks/useDrawerState';

interface MusicDrawerProps {
  // Add props if needed
}

// Assurons-nous que le composant est bien défini et exporté correctement
const MusicDrawer: React.FC<MusicDrawerProps> = () => {
  const { isDrawerOpen, closeDrawer } = useDrawerState();
  
  // Debug logs to help identify the issue
  console.log("MusicDrawer rendering");
  console.log("MusicPlayer component:", MusicPlayer);
  console.log("Drawer state:", { isDrawerOpen });
  
  if (!MusicPlayer) {
    console.error("MusicPlayer is undefined in MusicDrawer component");
    return <div>Error: MusicPlayer component not found</div>;
  }
  
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

// Assurons-nous d'exporter correctement le composant
export default MusicDrawer;
