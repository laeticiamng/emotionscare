
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  label?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  label,
  duration = 2,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const spring = useSpring(0);
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (!hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    }
  }, [spring, value, hasAnimated]);

  return (
    <div className={`text-center ${className}`}>
      {label && (
        <div className="text-sm text-muted-foreground mb-1">
          {label}
        </div>
      )}
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          delay: 0.2 
        }}
      >
        {prefix}
        <motion.span>{display}</motion.span>
        {suffix}
      </motion.div>
    </div>
  );
};

export default AnimatedCounter;
