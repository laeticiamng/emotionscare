import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Button } from '@/components/ui/button';
import { X } from '@/components/music/icons';

export interface MusicDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  side?: "left" | "right" | "top" | "bottom";
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  isOpen = false,
  open = false,
  onOpenChange,
  onClose,
  playlist,
  currentTrack,
}) => {
  // Use open or isOpen, prioritizing open if both are provided
  const isDialogOpen = open || isOpen;
  
  // Handle close function to work with either callback
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else if (!newOpen && onClose) {
      onClose();
    }
  };
  
  return (
    <LazyMotionWrapper>
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md p-0 sm:max-w-md sm:rounded-lg overflow-hidden">
          <div className="bg-gradient-to-b from-primary/5 to-background">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/60 backdrop-blur-sm">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {(playlist as any)?.title || (playlist as any)?.name || 'Lecteur musical'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentTrack ? `En cours : ${currentTrack.title}` : 'Aucune piste en cours'}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleOpenChange(false)}
                className="rounded-full"
                aria-label="Fermer le lecteur musical"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children || (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Sélectionnez une piste pour commencer à jouer de la musique</p>
                  </div>
                )}
              </m.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </LazyMotionWrapper>
  );
};

export default MusicDrawer;
