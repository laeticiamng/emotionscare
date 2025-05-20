
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';
import SynthesisHeader from '@/components/synthesis/SynthesisHeader';

const TimelinePage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6 space-y-6">
        <SynthesisHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Historique de vos émotions</h2>
          <p className="text-muted-foreground mb-6">
            Visualisez l'évolution de vos émotions et de votre bien-être au fil du temps
          </p>
          
          {/* Timeline content will go here */}
          <div className="p-12 border rounded-lg text-center text-muted-foreground">
            Contenu de la timeline en cours de développement
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default TimelinePage;
