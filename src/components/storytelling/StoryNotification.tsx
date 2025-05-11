
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStorytelling } from '@/providers/StorytellingProvider';
import { useSoundscape } from '@/providers/SoundscapeProvider';

interface StoryNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoHideDuration?: number;
}

const StoryNotification: React.FC<StoryNotificationProps> = ({ 
  position = 'bottom-right', 
  autoHideDuration = 8000 
}) => {
  const { stories, activeStory, markStorySeen, showStory } = useStorytelling();
  const { playFunctionalSound } = useSoundscape();
  const [visibleStory, setVisibleStory] = useState(activeStory);
  const [shouldShow, setShouldShow] = useState(false);
  
  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };
  
  // Check for unread stories and show notification
  useEffect(() => {
    const unreadStory = stories.find(story => !story.seen);
    
    if (unreadStory && !activeStory) {
      // Wait a bit before showing the notification
      const timer = setTimeout(() => {
        setVisibleStory(unreadStory);
        setShouldShow(true);
        playFunctionalSound('notification');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [stories, activeStory]);
  
  // Auto-hide after duration
  useEffect(() => {
    if (shouldShow && visibleStory) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShow, visibleStory, autoHideDuration]);
  
  const handleClose = () => {
    setShouldShow(false);
    if (visibleStory) {
      markStorySeen(visibleStory.id);
    }
  };
  
  const handleView = () => {
    if (visibleStory) {
      setShouldShow(false);
      showStory(visibleStory.id);
    }
  };
  
  // Return null if no story to show
  if (!visibleStory || !shouldShow) return null;
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}
          initial={{ opacity: 0, y: position.startsWith('top') ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position.startsWith('top') ? -20 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-card border rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg">{visibleStory.title}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{visibleStory.content}</p>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Fermer
              </Button>
              <Button size="sm" onClick={handleView}>
                Voir
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryNotification;
