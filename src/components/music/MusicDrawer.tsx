
import React, { useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Music } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import MusicPlayer from '@/components/music/player/MusicPlayer';
import MusicCreator from '@/components/music/MusicCreator';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { openDrawer, setOpenDrawer, currentTrack } = useMusic();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('player');
  
  // Use props if provided, otherwise use context
  const isOpen = open !== undefined ? open : openDrawer;
  const handleOpenChange = onOpenChange || setOpenDrawer;
  
  // Use different components based on device type
  const DrawerComponent = isMobile ? Drawer : Sheet;
  const ContentComponent = isMobile ? DrawerContent : SheetContent;
  
  return (
    <DrawerComponent open={isOpen} onOpenChange={handleOpenChange}>
      <ContentComponent side={isMobile ? undefined : "right"} className="p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <span className="flex items-center">
                <Music className="mr-2 h-5 w-5 text-primary" />
                Musique Thérapeutique
              </span>
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="p-4">
          <Tabs defaultValue="player" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="player">Lecteur</TabsTrigger>
              <TabsTrigger value="create">Créer</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="player" className="space-y-4">
                  <MusicPlayer />
                </TabsContent>
                
                <TabsContent value="create" className="space-y-4">
                  <MusicCreator />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
        
        {/* Mini Player at the bottom when drawer is open */}
        <AnimatePresence>
          {currentTrack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border-t p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted/50 rounded-md flex items-center justify-center">
                  <Music className="h-5 w-5 text-primary/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{currentTrack.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentComponent>
    </DrawerComponent>
  );
};

export default MusicDrawer;
