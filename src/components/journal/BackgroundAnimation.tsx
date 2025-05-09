
import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundAnimationProps {
  className?: string;
}

const BackgroundAnimation: React.FC<BackgroundAnimationProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148,187,233,0.3) 0%, rgba(238,174,202,0.1) 100%)',
          backgroundSize: '400% 400%',
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
