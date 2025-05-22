import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const SanctuaryPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Sanctuaire</h1>
          <p className="text-muted-foreground mb-6">
            Un espace personnel pour vous ressourcer et pratiquer des techniques de bien-être
          </p>
          
          {/* Sanctuary content will go here */}
          <div className="p-12 border rounded-lg text-center text-muted-foreground">
            Contenu du sanctuaire en cours de développement
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default SanctuaryPage;
