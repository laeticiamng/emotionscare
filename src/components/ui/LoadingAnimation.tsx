import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 'md',
  color = 'currentColor'
}) => {
  const sizeMap = {
    sm: {
      wrapper: 'h-4 w-8',
      circle: 'h-2 w-2',
    },
    md: {
      wrapper: 'h-5 w-10',
      circle: 'h-2.5 w-2.5',
    },
    lg: {
      wrapper: 'h-6 w-12',
      circle: 'h-3 w-3',
    },
  };

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const circleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const circleTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  };

  return (
    <motion.div
      className={`flex justify-around ${sizeMap[size].wrapper}`}
      variants={containerVariants}
      initial="start"
      animate="end"
    >
      <motion.span
        className={`${sizeMap[size].circle} rounded-full`}
        style={{ backgroundColor: color }}
        variants={circleVariants}
        transition={{ ...circleTransition, delay: 0 }}
      />
      <motion.span
        className={`${sizeMap[size].circle} rounded-full`}
        style={{ backgroundColor: color }}
        variants={circleVariants}
        transition={{ ...circleTransition, delay: 0.2 }}
      />
      <motion.span
        className={`${sizeMap[size].circle} rounded-full`}
        style={{ backgroundColor: color }}
        variants={circleVariants}
        transition={{ ...circleTransition, delay: 0.4 }}
      />
    </motion.div>
  );
};

export default LoadingAnimation;
