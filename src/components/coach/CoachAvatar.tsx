
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachAvatarProps {
  mood?: 'neutral' | 'happy' | 'concerned' | 'encouraging';
  isActive?: boolean;
  onClick?: () => void;
  showMessage?: boolean;
  message?: string;
  className?: string;
}

const CoachAvatar: React.FC<CoachAvatarProps> = ({
  mood = 'neutral',
  isActive = false,
  onClick,
  showMessage = false,
  message = "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMoodColor = () => {
    switch (mood) {
      case 'happy': return 'from-green-400 to-blue-500';
      case 'concerned': return 'from-orange-400 to-red-500';
      case 'encouraging': return 'from-purple-400 to-pink-500';
      default: return 'from-blue-400 to-purple-500';
    }
  };

  const getMoodIcon = () => {
    switch (mood) {
      case 'happy': return Heart;
      case 'concerned': return Brain;
      case 'encouraging': return Sparkles;
      default: return MessageCircle;
    }
  };

  const Icon = getMoodIcon();

  return (
    <div className={cn("relative", className)}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={cn(
            "h-16 w-16 rounded-full relative overflow-hidden",
            "bg-gradient-to-br", getMoodColor(),
            isActive && "ring-2 ring-primary ring-offset-2"
          )}
        >
          {/* Avatar background avec animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Icône principale */}
          <Icon className="h-8 w-8 text-white z-10" />
          
          {/* Indicateur d'activité */}
          {isActive && (
            <motion.div
              className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          {/* Particules flottantes */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 bg-white rounded-full"
                    initial={{ 
                      x: Math.random() * 60, 
                      y: Math.random() * 60,
                      opacity: 0 
                    }}
                    animate={{ 
                      y: -10,
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity 
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      
      {/* Bulle de message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-2 left-20 z-20"
          >
            <Card className="max-w-xs shadow-lg">
              <CardContent className="p-3">
                <p className="text-sm">{message}</p>
                {/* Flèche de la bulle */}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
                  <div className="w-2 h-2 bg-background border-l border-b border-border rotate-45" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachAvatar;
