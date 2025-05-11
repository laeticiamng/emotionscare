
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Story } from '@/types';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import { useStorytelling } from '@/contexts/StorytellingContext';

interface StoryCardProps {
  story: Story;
  onClose?: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClose }) => {
  const navigate = useNavigate();
  const { markStorySeen } = useStorytelling();
  const { playFunctionalSound } = useSoundscape();

  const handleActionClick = () => {
    if (story && story.cta) {
      // Mark story as seen
      markStorySeen(story.id);
      
      // Play sound effect
      playFunctionalSound("click");
      
      // Navigate to route if provided
      if (story.cta.route) {
        navigate(story.cta.route);
      }
      
      // Close dialog/modal if onClose provided
      if (onClose) onClose();
    }
  };

  // Determine emotion-based styling
  const getEmotionStyling = () => {
    if (!story.emotion) return {};

    const emotionStyles: Record<string, { bg: string; accent: string }> = {
      'happy': { bg: 'from-yellow-50 to-orange-50 border-yellow-200', accent: 'bg-yellow-500' },
      'peaceful': { bg: 'from-blue-50 to-cyan-50 border-blue-200', accent: 'bg-blue-500' },
      'excited': { bg: 'from-orange-50 to-red-50 border-orange-200', accent: 'bg-orange-500' },
      'focused': { bg: 'from-purple-50 to-indigo-50 border-purple-200', accent: 'bg-purple-500' },
      'neutral': { bg: 'from-gray-50 to-slate-50 border-gray-200', accent: 'bg-gray-500' }
    };

    const style = emotionStyles[story.emotion.toLowerCase()] || emotionStyles.neutral;
    return {
      cardClass: `bg-gradient-to-br ${style.bg}`,
      accentClass: style.accent
    };
  };

  const { cardClass, accentClass } = getEmotionStyling();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden shadow-lg ${cardClass}`}>
        {story.image && (
          <div className="relative w-full h-48">
            <img 
              src={story.image} 
              alt={story.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <CardTitle className="absolute bottom-4 left-4 text-white">{story.title}</CardTitle>
          </div>
        )}
        
        {!story.image && (
          <CardHeader>
            <div className="flex items-center gap-3">
              {accentClass && (
                <div className={`w-2 h-10 rounded-full ${accentClass}`}></div>
              )}
              <CardTitle>{story.title}</CardTitle>
            </div>
          </CardHeader>
        )}
        
        <CardContent className="pb-2">
          <CardDescription className="text-foreground/80 whitespace-pre-line text-base">
            {story.content}
          </CardDescription>
        </CardContent>
        
        {story.cta && (
          <CardFooter>
            <Button 
              onClick={handleActionClick}
              className="w-full"
              variant="default"
            >
              {story.cta.label}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default StoryCard;
