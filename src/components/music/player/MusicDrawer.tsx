
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
import { MusicTrack, MusicPlaylist, MusicDrawerProps } from '@/types';
import MusicPlayer from "./MusicPlayer";

// Assurez-vous que les props acceptent à la fois open et isOpen pour la compatibilité
const MusicDrawer: React.FC<MusicDrawerProps> = ({ 
  open, 
  isOpen, 
  onOpenChange, 
  onClose 
}) => {
  // Utiliser open si fourni, sinon isOpen (pour la rétrocompatibilité)
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
