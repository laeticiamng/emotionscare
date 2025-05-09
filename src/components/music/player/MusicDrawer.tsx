
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import MusicPlayer from './MusicPlayer';

interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] sm:max-w-md border-l">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Lecteur de Musique</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        
        <div className="py-6">
          <MusicPlayer />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
