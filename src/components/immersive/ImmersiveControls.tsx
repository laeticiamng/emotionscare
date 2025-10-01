// @ts-nocheck

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';

interface ImmersiveControlsProps {
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onThemeToggle: () => void;
}

const ImmersiveControls: React.FC<ImmersiveControlsProps> = ({
  soundEnabled,
  onSoundToggle,
  onThemeToggle
}) => {
  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex flex-col gap-3">
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Button
          onClick={onSoundToggle}
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-900 h-10 w-10 rounded-full shadow-md hover:shadow-lg"
          aria-label={soundEnabled ? "Désactiver le son" : "Activer le son"}
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <VolumeX className="h-5 w-5 text-slate-400" />
          )}
        </Button>
      </motion.div>

      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
      >
        <Button
          onClick={onThemeToggle}
          variant="outline"
          size="icon"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-900 h-10 w-10 rounded-full shadow-md hover:shadow-lg"
          aria-label="Changer le thème"
        >
          <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 text-slate-700 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ImmersiveControls;
