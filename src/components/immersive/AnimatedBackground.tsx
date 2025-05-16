
import React from 'react';
import { motion } from 'framer-motion';
import ThreeCanvas from '@/components/three/ThreeCanvas';

const AnimatedBackground: React.FC = () => {
  return (
    <>
      {/* 3D Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <ThreeCanvas />
      </div>

      {/* Ambient Background */}
      <div className="ambient-animation">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            transition: { 
              repeat: Infinity, 
              duration: 10,
              ease: "easeInOut"
            }
          }}
          className="blur-circle circle-1"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.15, 0.1],
            transition: { 
              repeat: Infinity, 
              duration: 15,
              ease: "easeInOut",
              delay: 1
            }
          }}
          className="blur-circle circle-2"
        />
      </div>
    </>
  );
};

export default AnimatedBackground;
