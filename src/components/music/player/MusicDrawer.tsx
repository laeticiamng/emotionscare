
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MusicDrawerProps } from '@/types/music';

const MusicDrawer: React.FC<MusicDrawerProps> = ({ 
  isOpen, 
  onOpenChange, 
  onClose,
  playlist, 
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[320px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>
              {playlist ? playlist.name : 'Bibliothèque musicale'}
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="pt-4 overflow-y-auto">
          {playlist && (
            <div className="flex flex-col items-center mb-6">
              {playlist.coverUrl && (
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.name} 
                  className="w-32 h-32 rounded-lg mb-2 object-cover"
                />
              )}
              <h3 className="text-lg font-medium">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">{playlist.description}</p>
            </div>
          )}
          
          <div className="space-y-2">
            {playlist && playlist.tracks.map((track) => (
              <div 
                key={track.id}
                className="flex items-center p-2 hover:bg-secondary rounded-lg cursor-pointer"
              >
                <img 
                  src={track.coverUrl || track.cover_url || '/images/music/default-cover.jpg'} 
                  alt={track.title}
                  className="h-10 w-10 rounded object-cover mr-3"
                />
                <div>
                  <p className="font-medium">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
              </div>
            ))}
            
            {!playlist && (
              <p className="text-center text-muted-foreground my-8">
                Sélectionnez une playlist pour voir les pistes disponibles
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
