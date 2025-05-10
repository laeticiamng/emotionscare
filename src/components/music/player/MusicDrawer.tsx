
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MusicDrawerProps } from '@/types/music';
import MusicPlayer from "./MusicPlayer";

// Make sure the component accepts both open and isOpen for compatibility
const MusicDrawer: React.FC<MusicDrawerProps> = ({ 
  open, 
  isOpen, 
  onOpenChange, 
  onClose 
}) => {
  // Use open if provided, otherwise isOpen (for backwards compatibility)
  const isDrawerOpen = open !== undefined ? open : isOpen;
  
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else if (!open && onClose) {
      onClose();
    }
  };
  
  return (
    <Drawer open={isDrawerOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>Lecteur de musique</DrawerTitle>
              <DrawerDescription>
                Une expérience musicale adaptée à votre état émotionnel
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-auto">
          <MusicPlayer />
        </div>
        
        <DrawerFooter className="border-t pt-4 pb-6">
          <Button 
            onClick={() => handleOpenChange(false)}
            variant="outline" 
            className="w-full"
          >
            Réduire le lecteur
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
