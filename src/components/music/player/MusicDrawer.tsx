
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import SimpleMusicPlayer from './SimpleMusicPlayer';

const MusicDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="rounded-full h-12 w-12 shadow-lg"
          >
            <Music className="h-6 w-6" />
            <span className="sr-only">Ouvrir le lecteur musical</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Lecteur Musical</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SimpleMusicPlayer />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MusicDrawer;
