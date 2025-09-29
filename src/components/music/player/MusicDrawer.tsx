
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import PremiumMusicPlayer from './PremiumMusicPlayer';

interface MusicDrawerProps {
  children?: React.ReactNode;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-4 left-4 h-12 w-12 rounded-full shadow-lg z-50"
        >
          <Music className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <SheetTitle>Lecteur Musical</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {children || <PremiumMusicPlayer compact />}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
