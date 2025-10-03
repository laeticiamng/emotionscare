
import React from 'react';
import { motion } from 'framer-motion';

interface TabBackgroundAnimationProps {
  backgroundAnimation: number;
}

const TabBackgroundAnimation: React.FC<TabBackgroundAnimationProps> = ({ backgroundAnimation }) => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: backgroundAnimation === 1 
            ? ['0% 0%', '100% 100%'] 
            : backgroundAnimation === 2 
              ? ['100% 0%', '0% 100%'] 
              : ['0% 100%', '100% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: `radial-gradient(circle at ${backgroundAnimation * 30}% ${100 - backgroundAnimation * 30}%, 
            rgba(99,102,241,0.15) 0%, 
            rgba(168,85,247,0.05) 25%, 
            rgba(236,72,153,0.05) 50%, 
            rgba(239,68,68,0) 100%)`,
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
};

export default TabBackgroundAnimation;
