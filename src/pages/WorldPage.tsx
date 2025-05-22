import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const WorldPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Monde</h1>
          <p className="text-muted-foreground mb-6">
            Explorez le monde des émotions et découvrez comment les autres interagissent avec leurs sentiments
          </p>
          
          {/* World content will go here */}
          <div className="p-12 border rounded-lg text-center text-muted-foreground">
            Contenu du monde en cours de développement
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default WorldPage;
