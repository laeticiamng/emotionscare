
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  points: number;
  badge?: {
    name: string;
    icon: string;
    rarity: string;
  };
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  show: boolean;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  show
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-4 left-1/2 z-50 w-96"
        >
          <Card className="p-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-2xl border-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                >
                  {achievement.badge ? (
                    <Award className="h-6 w-6" />
                  ) : achievement.type.includes('level') ? (
                    <Trophy className="h-6 w-6" />
                  ) : (
                    <Star className="h-6 w-6" />
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-bold text-lg mb-1"
                  >
                    {achievement.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90 text-sm mb-2"
                  >
                    {achievement.description}
                  </motion.p>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs"
                  >
                    <Star className="h-3 w-3" />
                    +{achievement.points} points
                  </motion.div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
