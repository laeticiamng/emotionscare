
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          className="text-center max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Prenez soin de votre <span className="text-primary">bien-être émotionnel</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez des outils personnalisés pour améliorer votre bien-être quotidien et renforcer votre résilience émotionnelle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/b2c/login')}
              className="text-lg px-8 py-6"
            >
              Commencer maintenant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/b2b/selection')}
              className="text-lg px-8 py-6"
            >
              Solutions entreprise
            </Button>
          </div>

          <div className="pt-4">
            <Button 
              variant="link" 
              onClick={() => navigate('/pricing')}
              className="text-lg"
            >
              Voir nos offres
            </Button>
          </div>
        </motion.div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Analysez vos émotions',
              description: 'Suivez votre bien-être grâce à des outils d\'analyse émotionnelle avancés'
            },
            {
              title: 'Thérapie musicale',
              description: 'Découvrez des playlists adaptées à votre humeur et à vos besoins'
            },
            {
              title: 'Expériences immersives',
              description: 'Vivez des sessions de réalité virtuelle pour la relaxation et la méditation'
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImmersiveHome;
