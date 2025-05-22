
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import ActionButtons from '@/components/home/ActionButtons';
import { useAuth } from '@/contexts/AuthContext';

const ImmersiveHome: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <div className="absolute top-0 right-0 p-4 z-10">
        {isAuthenticated ? (
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="shadow-sm"
          >
            Mon tableau de bord
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              className="shadow-sm"
            >
              Connexion
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="shadow-sm"
            >
              Inscription
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 container mx-auto px-4">
        <HeroSection />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Découvrez nos fonctionnalités</h2>
          <ActionButtons />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="my-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Choisissez votre mode d'accès</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            EmotionsCare s'adapte à vos besoins, que vous soyez un particulier ou une entreprise.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/b2c/login')}
              size="lg"
              className="min-w-[200px]"
            >
              Particulier
            </Button>
            <Button 
              onClick={() => navigate('/b2b/selection')}
              variant="outline" 
              size="lg"
              className="min-w-[200px]"
            >
              Entreprise
            </Button>
          </div>
        </motion.div>
      </div>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};

export default ImmersiveHome;
