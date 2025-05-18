
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MusicTrack, MusicPlaylist } from '@/types/music';

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
  
  // Implement the component with the Dialog from shadcn/ui
  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MusicDrawer;
