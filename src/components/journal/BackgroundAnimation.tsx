
import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundAnimationProps {
  className?: string;
  intensity?: number;
  emotion?: string;
  musicEnabled?: boolean;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ 
  className = '', 
  intensity = 30,
  emotion = 'neutral',
  musicEnabled = false 
}) => {
  // Generate emotion-specific animation properties
  const getEmotionAnimation = () => {
    switch(emotion) {
      case 'calm':
        return {
          backgroundImage: 'radial-gradient(circle, rgba(148,187,233,0.3) 0%, rgba(238,174,202,0.1) 100%)',
          duration: 20,
        };
      case 'happy':
        return {
          backgroundImage: 'radial-gradient(circle, rgba(255,236,170,0.3) 0%, rgba(255,193,102,0.1) 100%)',
          duration: 12,
        };
      case 'focused':
        return {
          backgroundImage: 'radial-gradient(circle, rgba(129,230,217,0.3) 0%, rgba(79,209,197,0.1) 100%)',
          duration: 15,
        };
      default:
        return {
          backgroundImage: 'radial-gradient(circle, rgba(148,187,233,0.3) 0%, rgba(238,174,202,0.1) 100%)',
          duration: 15,
        };
    }
  };

  const emotionAnimation = getEmotionAnimation();
  
  const opacityValue = intensity ? intensity / 100 * 0.4 : 0.3;

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: emotionAnimation.duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: emotionAnimation.backgroundImage,
          backgroundSize: '400% 400%',
          opacity: opacityValue
        }}
      />
      
      {musicEnabled && (
        <motion.div
          className="absolute left-1/2 bottom-4 -translate-x-1/2 w-40 h-12 opacity-20"
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
};

export default BackgroundAnimation;
