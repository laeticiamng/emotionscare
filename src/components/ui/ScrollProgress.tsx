
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Only show scroll progress after scrolling a bit
    const handleScroll = () => {
      const showThreshold = 100; // px
      if (window.scrollY > showThreshold && !isVisible) {
        setIsVisible(true);
      } else if (window.scrollY <= showThreshold && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50 origin-left"
        style={{ scaleX, opacity: isVisible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.3 } }}
      />
      
      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-20 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-md z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 1 : 0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut de la page"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </motion.button>
    </>
  );
};

export default ScrollProgress;
