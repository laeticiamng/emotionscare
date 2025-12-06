import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface DashboardLoadingProps {
  message?: string;
  fullscreen?: boolean;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({
  message = "Chargement de votre espace...",
  fullscreen = false
}) => {
  const containerVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const containerClass = fullscreen
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-8";

  return (
    <motion.div
      className={containerClass}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="flex flex-col items-center max-w-md text-center"
        variants={itemVariants}
      >
        <motion.div
          className="relative h-16 w-16 mb-4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-transparent" />
        </motion.div>

        <motion.h3 
          className="text-xl font-medium mb-2"
          variants={itemVariants}
        >
          {message}
        </motion.h3>
        
        <motion.div 
          variants={itemVariants}
          className="flex gap-2 items-center text-sm text-muted-foreground"
        >
          <Loader className="h-4 w-4 animate-spin" />
          <span>Préparation de vos modules personnalisés</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardLoading;
