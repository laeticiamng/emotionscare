
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

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
  const ai = useAI();

  useEffect(() => {
    if (isDialogOpen) {
      // Only call the music generation when the drawer is open
      // This is just to demonstrate AI integration
      try {
        ai.musicgenV1('mood music');
      } catch (error) {
        console.error('Error generating music:', error);
      }
    }
  }, [ai, isDialogOpen]);
  
  // Handle close function to work with either callback
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else if (!newOpen && onClose) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 sm:max-w-md sm:rounded-lg overflow-hidden">
        <div className="bg-gradient-to-b from-primary/5 to-background">
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/60 backdrop-blur-sm">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {playlist?.title || 'Lecteur musical'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentTrack ? `En cours : ${currentTrack.title || currentTrack.name}` : 'Aucune piste en cours'}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleOpenChange(false)}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children || (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Sélectionnez une piste pour commencer à jouer de la musique</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MusicDrawer;
