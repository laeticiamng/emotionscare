
import React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import MiniPlayer from './MiniPlayer'
import useLogger from '@/hooks/useLogger'

export interface MusicDrawerProps {
  open: boolean
  onClose: () => void
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const logger = useLogger('MusicDrawer')

  if (!open) return null

  logger.debug('Rendering MusicDrawer', { open })
  return (
    <Drawer open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DrawerContent className="max-h-[80vh] focus:outline-none">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Lecteur de musique</DrawerTitle>
          <DrawerClose asChild>
            <button onClick={onClose} type="button">✕</button>
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
