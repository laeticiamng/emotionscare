
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStorytelling } from '@/providers/StorytellingProvider';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';

interface StoryDrawerProps {
  open: boolean;
  onClose: () => void;
}

const StoryDrawer: React.FC<StoryDrawerProps> = ({ open, onClose }) => {
  const { activeStory, markStorySeen } = useStorytelling();
  const { playEmotionalResponse, playFunctionalSound } = useSoundscape();
  const navigate = useNavigate();
  
  if (!activeStory) return null;
  
  const handleClose = () => {
    if (activeStory) {
      markStorySeen(activeStory.id);
    }
    onClose();
  };
  
  const handleCTAClick = () => {
    if (activeStory) {
      markStorySeen(activeStory.id);
      playFunctionalSound('transition');
      if (activeStory.cta?.action) {
        navigate(activeStory.cta.action);
      }
      onClose();
    }
  };
  
  // Play emotional response sound when drawer opens
  React.useEffect(() => {
    if (open && activeStory?.emotion) {
      playEmotionalResponse(activeStory.emotion);
    }
  }, [open, activeStory]);
  
  return (
    <Drawer open={open} onClose={handleClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">{activeStory.title}</DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4">
          {activeStory.image && (
            <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <p className="text-muted-foreground mb-6">{activeStory.content}</p>
          
          {activeStory.emotion && (
            <div className="mb-6">
              <EnhancedMusicVisualizer
                emotion={activeStory.emotion}
                intensity={50}
                height={100}
              />
            </div>
          )}
        </div>
        
        <DrawerFooter>
          {activeStory.cta && (
            <Button className="w-full" onClick={handleCTAClick}>
              {activeStory.cta.text}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default StoryDrawer;
