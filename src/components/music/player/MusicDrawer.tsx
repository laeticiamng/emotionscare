
import React, { useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import MiniPlayer from './MiniPlayer'

export interface MusicDrawerProps {
  open: boolean
  onClose: () => void
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  // Diagnostic du tiroir musical
  useEffect(() => {
    if (open) {
      console.group('🔍 Imports MusicDrawer');
      console.log('→ Drawer             :', typeof Drawer, Drawer);
      console.log('→ DrawerContent      :', typeof DrawerContent, DrawerContent);
      console.log('→ DrawerHeader       :', typeof DrawerHeader, DrawerHeader);
      console.log('→ DrawerTitle        :', typeof DrawerTitle, DrawerTitle);
      console.log('→ DrawerClose        :', typeof DrawerClose, DrawerClose);
      console.log('→ MiniPlayer         :', typeof MiniPlayer, MiniPlayer);
      console.groupEnd();
    }
  }, [open]);

  if (!open) return null

  return (
    <Drawer open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DrawerContent className="max-h-[80vh] focus:outline-none">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Lecteur de musique</DrawerTitle>
          <DrawerClose asChild>
            <button onClick={onClose} type="button" className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-muted">✕</button>
          </DrawerClose>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <MiniPlayer />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MusicDrawer
