
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wind } from 'lucide-react';

export const GlowEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-6"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <Wind className="w-12 h-12 text-purple-500" />
        </div>
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Première pause Glow
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        Fais ta première pause Glow pour voir tes stats et suivre ton souffle en couleur !
      </p>
      
      <Button 
        size="lg"
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
      >
        Commencer ma pause Glow
      </Button>
    </motion.div>
  );
};
