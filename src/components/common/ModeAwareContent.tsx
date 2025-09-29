
import React, { useEffect, useState } from 'react';
import { useUserModeHelpers } from '@/hooks/useUserModeHelpers';
import { motion, AnimatePresence } from 'framer-motion';

interface ModeAwareContentProps {
  b2cContent?: React.ReactNode;
  b2bUserContent?: React.ReactNode;
  b2bAdminContent?: React.ReactNode;
  fallbackContent?: React.ReactNode;
  animationMode?: 'fade' | 'slide' | 'zoom' | 'none';
}

/**
 * Component that displays different content based on the current user mode
 * with smooth transitions between content changes
 */
const ModeAwareContent: React.FC<ModeAwareContentProps> = ({
  b2cContent,
  b2bUserContent,
  b2bAdminContent,
  fallbackContent,
  animationMode = 'fade'
}) => {
  const { isB2C, isB2BUser, isB2BAdmin, normalizedMode } = useUserModeHelpers();
  const [renderedContent, setRenderedContent] = useState<React.ReactNode | null>(null);
  
  // Animation variants
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    zoom: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
      transition: {}
    }
  };
  
  // Get the appropriate content based on the user mode
  useEffect(() => {
    if (isB2C && b2cContent) {
      setRenderedContent(b2cContent);
    } else if (isB2BUser && b2bUserContent) {
      setRenderedContent(b2bUserContent);
    } else if (isB2BAdmin && b2bAdminContent) {
      setRenderedContent(b2bAdminContent);
    } else {
      setRenderedContent(fallbackContent);
    }
  }, [isB2C, isB2BUser, isB2BAdmin, b2cContent, b2bUserContent, b2bAdminContent, fallbackContent]);
  
  const selectedVariant = variants[animationMode];
  
  return (
    <AnimatePresence mode="sync">{/* Fixed multiple children warning */}
      <motion.div
        key={normalizedMode}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={selectedVariant.transition}
        className="w-full"
      >
        {renderedContent}
      </motion.div>
    </AnimatePresence>
  );
};

export default ModeAwareContent;
