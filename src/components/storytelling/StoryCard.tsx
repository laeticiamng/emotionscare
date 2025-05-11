
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStorytelling } from '@/providers/StorytellingProvider';
import { useSoundscape } from '@/providers/SoundscapeProvider';

interface StoryCardProps {
  storyId: string;
  minimal?: boolean;
  className?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ storyId, minimal = false, className = '' }) => {
  const navigate = useNavigate();
  const { stories, markStorySeen } = useStorytelling();
  const { playFunctionalSound } = useSoundscape();
  
  const story = stories.find(s => s.id === storyId);
  
  if (!story) return null;
  
  const handleCTAClick = () => {
    markStorySeen(storyId);
    playFunctionalSound('transition');
    if (story.cta?.action) {
      navigate(story.cta.action);
    }
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };
  
  // Define card background based on emotion
  const getEmotionBackground = () => {
    switch(story.emotion) {
      case 'calm': return 'bg-blue-50 dark:bg-blue-950';
      case 'joyful':
      case 'happy': return 'bg-amber-50 dark:bg-amber-950';
      case 'energetic': return 'bg-orange-50 dark:bg-orange-950';
      case 'focused': return 'bg-purple-50 dark:bg-purple-950';
      case 'reflective':
      case 'sad': return 'bg-gray-50 dark:bg-gray-900';
      default: return 'bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950';
    }
  };
  
  // Minimal version for sidebars and notifications
  if (minimal) {
    return (
      <motion.div
        className={`cursor-pointer ${className}`}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => markStorySeen(storyId)}
      >
        <div className={`p-3 rounded-lg ${getEmotionBackground()} border border-primary/10`}>
          <h4 className="text-sm font-medium">{story.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{story.content}</p>
        </div>
      </motion.div>
    );
  }
  
  // Full card version
  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className={`overflow-hidden ${getEmotionBackground()} border-primary/10`}>
        {story.image && (
          <div className="w-full h-40 overflow-hidden">
            <img 
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        
        <CardHeader>
          <CardTitle>{story.title}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-muted-foreground">{story.content}</p>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => markStorySeen(storyId)}>
            Fermer
          </Button>
          
          {story.cta && (
            <Button size="sm" onClick={handleCTAClick}>
              {story.cta.text}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default StoryCard;
