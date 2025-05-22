import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const MusicPage: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Musique</h1>
          <p className="text-muted-foreground mb-6">
            Explorez des playlists adaptées à vos émotions et favorisant votre bien-être
          </p>
          
          {/* Music content will go here */}
          <div className="p-12 border rounded-lg text-center text-muted-foreground">
            Contenu musical en cours de développement
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default MusicPage;
